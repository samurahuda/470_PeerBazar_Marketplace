import { MarketplaceService } from '$lib/services';
import { fail, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';

const marketplaceService = (supabase: any) => new MarketplaceService(supabase);

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
  const { data: { user: sessionUser } } = await supabase.auth.getUser();
  
  if (!sessionUser) {
    return { myProducts: [], myJobs: [], myGiveaways: [], error: 'Unauthorized' };
  }

  try {
    const myProducts = await marketplaceService(supabase).getProductsBySeller(sessionUser.id);
    const myJobs = await marketplaceService(supabase).getJobsBySeller(sessionUser.id);
    const myGiveaways = await marketplaceService(supabase).getGiveawaysBySeller(sessionUser.id);
    return { myProducts, myJobs, myGiveaways, error: null };
  } catch (e: any) {
    return { myProducts: [], myJobs: [], myGiveaways: [], error: e.message };
  }
};

export const actions: Actions = {
  createProduct: async ({ request, locals: { supabase, getSession } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) return fail(401, { error: 'Unauthorized' });

    const formData = await request.formData();
    let imageUrl: string | undefined = undefined;
    const imageFile = formData.get('image_file') as File;

    if (imageFile && imageFile.size > 0) {
      const fileName = `${actionUser.id}/${crypto.randomUUID()}-${imageFile.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Supabase image upload error:', uploadError);
        return fail(500, { error: `Failed to upload image: ${uploadError.message}` });
      }
      imageUrl = supabase.storage.from('product-images').getPublicUrl(fileName).data.publicUrl;
    }

    const productData = {
      seller_id: actionUser.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      price: Number(formData.get('price')),
      image_url: imageUrl, // Initialize with imageUrl
    };

    try {
      await marketplaceService(supabase).createProduct(productData);
      return { success: true, message: 'Product created successfully!' };
    } catch (e: any) {
      console.error('Error creating product:', e);
      return fail(500, { error: e.message });
    }
  },

  deleteProduct: async ({ request, locals: { supabase, getSession } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) return fail(401, { error: 'Unauthorized' });

    const formData = await request.formData();
    const productId = formData.get('productId') as string;

    try {
      await marketplaceService(supabase).deleteProduct(productId);
      return { success: true, message: 'Product deleted.' };
    } catch (e: any) {
      console.error('Error deleting product:', e);
      return fail(500, { error: e.message });
    }
  },
  
  createJob: async ({ request, locals: { supabase, getSession } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) return fail(401, { error: 'Unauthorized' });

    const formData = await request.formData();
    const jobData = {
        seller_id: actionUser.id,
        job_title: formData.get('job_title') as string,
        job_description: formData.get('job_description') as string,
        salary: Number(formData.get('salary')) || undefined,
    };

    try {
        await marketplaceService(supabase).createJob(jobData);
        return { success: true, message: 'Job posted successfully!' };
    } catch (e: any) {
        console.error('Error creating job:', e);
        return fail(500, { error: e.message });
    }
  },

  deleteJob: async ({ request, locals: { supabase, getSession } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) return fail(401, { error: 'Unauthorized' });

    const formData = await request.formData();
    const jobId = formData.get('jobId') as string;

    try {
      await marketplaceService(supabase).deleteJob(jobId);
      return { success: true, message: 'Job deleted.' };
    } catch (e: any) {
      console.error('Error deleting job:', e);
      return fail(500, { error: e.message });
    }
  },

  createGiveaway: async ({ request, locals: { supabase } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) return fail(401, { error: 'Unauthorized' });

    const formData = await request.formData();
    let imageUrl: string | undefined = undefined;
    const imageFile = formData.get('image_file') as File;

    if (imageFile && imageFile.size > 0) {
      const fileName = `${actionUser.id}/${crypto.randomUUID()}-${imageFile.name}`;
      const { error: uploadError } = await supabase.storage
        .from('giveaway-images') // Using a new bucket for giveaway images
        .upload(fileName, imageFile, { cacheControl: '3600', upsert: false });

      if (uploadError) {
        console.error('Supabase image upload error:', uploadError);
        return fail(500, { error: `Failed to upload image: ${uploadError.message}` });
      }
      const { data: publicUrlData } = supabase.storage.from('giveaway-images').getPublicUrl(fileName);
      imageUrl = publicUrlData.publicUrl;
    }

    const giveawayData = {
      seller_id: actionUser.id,
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      image_url: imageUrl,
    };

    try {
      await marketplaceService(supabase).createGiveaway(giveawayData);
      throw redirect(303, '/marketplace/seller');
    } catch (e: any) {
      console.error('Error creating giveaway:', e);
      return fail(500, { error: e.message });
    }
  },

  deleteGiveaway: async ({ request, locals: { supabase } }) => {
    const { data: { user: actionUser } } = await supabase.auth.getUser();
    if (!actionUser) return fail(401, { error: 'Unauthorized' });

    const formData = await request.formData();
    const giveawayId = formData.get('giveawayId') as string;

    try {
      await marketplaceService(supabase).deleteGiveaway(giveawayId);
      return { success: true, message: 'Giveaway deleted.' };
    } catch (e: any) {
      console.error('Error deleting giveaway:', e);
      return fail(500, { error: e.message });
    }
  },
};