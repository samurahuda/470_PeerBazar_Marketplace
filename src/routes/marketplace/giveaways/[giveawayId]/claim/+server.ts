import { json } from '@sveltejs/kit';
import { GiveawayService } from '$lib/services/giveaway.service';
import { supabase } from '$lib/server/supabaseClient';

export async function POST({ request, params }) {
    const { giveawayId } = params;
    const { phoneNumber } = await request.json();

    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return json({ success: false, error: 'Authentication required.' }, { status: 401 });
    }

    const claimerId = user.id;
    const giveawayService = new GiveawayService(supabase);

    const result = await giveawayService.claimGiveaway(giveawayId, claimerId, phoneNumber);

    if (result.success) {
        return json({ success: true, message: 'Giveaway claimed successfully.' });
    } else {
        return json({ success: false, error: result.error }, { status: 400 });
    }
}