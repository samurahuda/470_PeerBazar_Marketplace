import { MarketplaceService } from '$lib/services';
import { error, fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import type { ProductListing } from '$lib/types/marketplace';

const marketplaceService = (supabase: any) => new MarketplaceService(supabase);

export const load: PageServerLoad = async ({ params, locals: { supabase } }) => {
  const { data: { user: sessionUser } } = await supabase.auth.getUser();
  const productId = params.id;

  if (!sessionUser) {
    throw redirect(303, '/auth/login'); // Redirect to login if not authenticated
  }

  const product = await marketplaceService(supabase).getProductById(productId);

  if (!product) {
    throw error(404, 'Product not found');
  }

  // Ensure the current user is the seller of this product
  if (product.seller_id !== sessionUser.id) {
    throw error(403, 'You are not authorized to edit this product.');
  }

  return { product };
};

export const actions: Actions = {
  updateProduct: async ({ request, params, locals: { supabase } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) return fail(401, { error: 'Unauthorized' });

    const productId = params.id;
    const formData = await request.formData();

    // Fetch existing product to get current image_url if not updated
    const existingProduct = await marketplaceService(supabase).getProductById(productId);
    if (!existingProduct || existingProduct.seller_id !== actionUser.id) {
        return fail(403, { error: 'Not authorized to update this product.' });
    }

    let imageUrl: string | undefined = existingProduct.image_url; // Default to existing image
    const imageFile = formData.get('image_file') as File;

    // Handle new image upload
    if (imageFile && imageFile.size > 0) {
      const fileName = `${actionUser.id}/${crypto.randomUUID()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: true }); // Use upsert: true for updates

      if (uploadError) {
        console.error('Supabase image upload error:', uploadError);
        return fail(500, { error: `Failed to upload new image: ${uploadError.message}` });
      }
      imageUrl = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;

      // Optional: Delete old image from storage if it exists and is different
      if (existingProduct.image_url && existingProduct.image_url !== imageUrl) {
        const oldFileName = existingProduct.image_url.split('/').pop(); // Extract filename from URL
        if (oldFileName) {
          await supabase.storage.from('product-images').remove([`${actionUser.id}/${oldFileName}`]);
        }
      }
    }

    const updatedProductData: Partial<ProductListing> = {
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      category: formData.get('category') as string || undefined,
      size: formData.get('size') as string || undefined,
      color: formData.get('color') as string || undefined,
      brand: formData.get('brand') as string || undefined,
      image_url: imageUrl,
    };

    try {
      await marketplaceService(supabase).updateProduct(productId, updatedProductData);
      return { success: true, message: 'Product updated successfully!' };
    } catch (e: any) {
      console.error('Error updating product:', e);
      return fail(500, { error: e.message });
    }
  },
};
