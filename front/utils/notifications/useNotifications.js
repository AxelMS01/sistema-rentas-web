import { useState, useEffect, useCallback } from "react";
import { previousMonday, subWeeks } from "date-fns";
import { supabase } from "../../config/supabase-client";

/**
 * Fetches the new, the current week's, month's, and previous notifications, based on a user's role and id.
 * @param {*} role 
 * @param {*} userId 
 * @returns An object containing the fetched notifications, separated in their corresponding group: new, current week's, current month's, and previous.
 */

export default function useNotifications(role, userId) {
    const currentDate = new Date();

    // We will use the last monday as the point from where we will fetch the week's notifications.
    const lastMonday = previousMonday(currentDate).toISOString();

    // Create a date for the first day of the month.
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);

    // Stateful variables to save the fetched notifications from the database.
    const [newNotifs, setNewNotifs] = useState([]);
    const [weekNotifs, setWeekNotifs] = useState([]);
    const [monthNotifs, setMonthNotifs] = useState([]);
    const [prevNotifs, setPrevNotifs] = useState([]);

    // Variable to control the promises' loading status.
    const [isLoading, setIsLoading] = useState(true);

    // Separated fetching functions.
    async function getNewNotifs() {
        try {
            const { data, error } = await supabase
                .from("notifications")
                .select()
                .eq("seen", false)
                .eq(role === "owner" ? ownerid : tenantid, userId);

            if (error) throw error;

            setNewNotifs(data);
        } catch (error) {
            console.log("An error ocurred:", error);
        };
    };

    async function getWeekNotifs() {
        try {
            const { data, error } = await supabase
                .from("notifications")
                .select()
                .eq(role === "owner" ? ownerid : tenantid, userId)
                .gte("created_at", lastMonday);

            if (error) throw error;

            setWeekNotifs(data);

        } catch (error) {
            console.log("An error ocurred:", error);
        };
    };

    async function getMonthNotifs() {
        try {
            const { data, error } = await supabase
                .from("notifications")
                .select()
                .eq(role === "owner" ? ownerid : tenantid, userId)
                .gte("created_at", firstDayOfMonth)
                .lt("created_at", lastMonday);

            if (error) throw error;

            setMonthNotifs(data);

        } catch (error) {
            console.log("An error ocurred:", error);
        };
    };

    async function getPrevNotifs() {
        try {
            const { data, error } = await supabase
                .from("notifications")
                .select()
                .eq(role === "owner" ? ownerid : tenantid, userId)
                .lt("created_at", firstDayOfMonth);

            if (error) throw error;

            setPrevNotifs(data);

        } catch (error) {
            console.log("An error ocurred:", error);
        };
    };

    const fetchData = useCallback(
        async () => {
            try {
                getNewNotifs()
                    .then(getWeekNotifs())
                    .then(getMonthNotifs())
                    .then(getPrevNotifs())
            } catch (error) {
                console.log("An error ocurred while trying to fetch the notifications:", error);
            } finally {
                setIsLoading(false);
            };
        }, []
    );

    useEffect(() => {
        fetchData();
    }, []);

    return {
        isDataLoading: isLoading,
        newNotifs: newNotifs,
        weekNotifs: weekNotifs,
        monthNotifs: monthNotifs,
        prevNotifs: prevNotifs
    };
};