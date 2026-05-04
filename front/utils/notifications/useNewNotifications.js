import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../config/supabase-client";

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
                    .eq(role === "owner" ? ownerid : tenantid, userId);

                if (error) throw error;

                setNewNotifs(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            };
        }, [ownerId]
    );

    useEffect(() => {
        fetchData();
    }, []);

    return {
        isDataLoading: isLoading,
        newNotifs: newNotifs
    };
};