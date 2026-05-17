import { supabase } from "../../config/supabase-client";

/**
 * Updates the seen status of a notification by setting it to true.
 * @param {*} notifId 
 */

export default async function markNotifAsRead(notifId) {
    const { error } = await supabase
        .from("notifications")
        .update({ seen: true })
        .eq("id", notifId)

    if (error) throw error;
};