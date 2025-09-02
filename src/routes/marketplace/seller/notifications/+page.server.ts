import { MarketplaceService } from '$lib/services';
import type { PageServerLoad } from './$types';
import { getSellerNotifications, type SellerNotification } from '$lib/repositories/seller-notification.repository';

export const load: PageServerLoad = async ({ parent, locals: { supabase } }) => {
  const { data: { user: sessionUser } } = await supabase.auth.getUser();
  if (!sessionUser) {
    return { purchases: [], applications: [], giveawayNotifications: [], error: 'You must be logged in to view notifications.' };
  }

  try {
    const allNotifications = await getSellerNotifications(supabase, sessionUser.id);

    const purchases = allNotifications
      .filter((notification: SellerNotification) => notification.type === 'product_purchase');

    const applications = allNotifications
      .filter((notification: SellerNotification) => notification.type === 'job_application');

    const giveawayNotifications = [];
    for (const notification of allNotifications) {
      if (notification.type === 'general' && notification.title?.includes('Giveaway Claimed!')) {
        // Extract giveaway_id from action_url (e.g., /marketplace/giveaways/123)
        const giveawayIdMatch = notification.action_url?.match(/\/marketplace\/giveaways\/(.*)/);
        const giveawayId = giveawayIdMatch ? giveawayIdMatch[1] : null;

        if (giveawayId) {
          const { data: claim, error: claimError } = await supabase
            .from('giveaway_claims')
            .select('claimer_phone_number')
            .eq('giveaway_id', giveawayId)
            .single();

          if (claimError) {
            console.error(`Error fetching claim for giveaway ${giveawayId}:`, claimError);
          } else if (claim) {
            giveawayNotifications.push({
              ...notification,
              claimer_phone_number: claim.claimer_phone_number
            });
          } else {
            // If no claim found, still add the notification but without phone number
            giveawayNotifications.push(notification);
          }
        } else {
          // If giveawayId cannot be extracted, still add the notification
          giveawayNotifications.push(notification);
        }
      }
    }

    return { notifications: allNotifications, purchases, applications, giveawayNotifications };
  } catch (error: any) {
    return { purchases: [], applications: [], giveawayNotifications: [], error: error.message };
  }
};
