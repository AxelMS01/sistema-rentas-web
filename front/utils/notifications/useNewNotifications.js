import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../config/supabase-client";

/**
 * Fetches all the notifications that have not been seen by the user yet (new notifications).
 * @param {*} role 
 * @param {*} userId 
 * @returns An array containing all the fetched notifications from the user.
 */

export default function useNewNotifications(role, userId) {
    const [isLoading, setIsLoading] = useState(true);
    const [newNotifs, setNewNotifs] = useState();

    const fetchData = useCallback(
        async () => {
            try {
                const { data, error } = await supabase
                    .from("notifications")
                    .select()
                    .eq("seen", false)
                    .eq(role === "owner" ? "ownerid" : "tenantid", userId);

                if (error) throw error;

                console.log(data);

                setNewNotifs(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            };
        }, [userId]
    );

    useEffect(() => {
        fetchData();
    }, []);

    return {
        loadingNotifs: isLoading,
        newNotifs: newNotifs
    };
};