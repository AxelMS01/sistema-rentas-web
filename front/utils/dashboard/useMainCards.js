import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../config/supabase-client";
import { lastDayOfMonth } from "date-fns";
import useUser from "../../stores/user-store";

/**
 * Fetches all the necessary data to render the main four cards in the Dashboard.
 * @param {*} monthId 
 * @returns An object containing the values that will be shown in the Dashboard's main four cards.
 */

export default function useMainCards(monthId) {
    const [isLoading, setIsLoading] = useState(true);
    const [monthlyEarnings, setMonthlyEarnings] = useState();
    const [occupiedHousings, setOccupiedHousings] = useState();
    const [totalHousings, setTotalHousings] = useState();
    const [expiredBills, setExpiredBills] = useState();
    const [pendingCharge, setPendingCharge] = useState();
    const loggedUserId = useUser((state) => state.loggedUser);
    const currentDate = new Date();
    const firstMonthDate = new Date(currentDate.getFullYear(), monthId, 1);
    const lastMonthDate = lastDayOfMonth(new Date(currentDate.getFullYear(), monthId, 1));

    async function getInvoices() {
        setIsLoading(true);

        const { data: invoicesData, error: invoicesError } = await supabase
            .from("invoices")
            .select()
            .gte("created_at", firstMonthDate.toISOString())
            .lte("created_at", lastMonthDate.toISOString())
            .eq("id", loggedUserId);

        if (invoicesError) throw invoicesError;

        let invoicesTotal = 0;

        invoicesData.forEach((invoice) => {
            invoicesTotal += invoice.amount;
        })

        if (!invoicesData) setMonthlyEarnings(0);

        setMonthlyEarnings(invoicesTotal);
        setIsLoading(false);
    };

    async function getApartmentData() {
        setIsLoading(true);

        try {
            const { data: apartmentsData, error: apartmentsError } = await supabase
                .from("apartments")
                .select()
                .eq("ownerid", loggedUserId)

            let occupiedNumber = 0;

            apartmentsData.forEach((apartment) => {
                if (apartment.status === "OCCUPIED") {
                    occupiedNumber += 1;
                };
            })

            if (apartmentsError) throw invoicesError;

            setTotalHousings(apartmentsData.length);
            setOccupiedHousings(occupiedNumber);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    async function getExpiredBills() {
        setIsLoading(true);
        const currentDate = new Date().toISOString();

        try {
            const { data, error } = await supabase
                .from("invoices")
                .select()
                .lt("duedate", currentDate);

            if (error) throw error;

            let totalExpired = 0;

            data.forEach((invoice) => {
                totalExpired += invoice.amount;
            });

            setExpiredBills(totalExpired);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    async function getPendingCharges() {
        setIsLoading(true);
        const currentDate = new Date().toISOString();

        try {
            const { data, error } = await supabase
                .from("invoices")
                .select()
                .gte("duedate", currentDate);

            if (error) throw error;

            let totalPending = 0;

            data.forEach((invoice) => {
                totalPending += invoice.amount;
            });

            setPendingCharge(totalPending);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };

    const fetchData = useCallback(
        async () => {
            try {
                getInvoices();
                getApartmentData();
                getExpiredBills();
                getPendingCharges();
            } catch (error) {
                console.log("Error found in statistic card calculations:", error);
            };
        }, [monthId]
    );

    useEffect(() => {
        fetchData();
    }, [monthId]);

    return {
        isDataLoading: isLoading,
        monthlyEarnings: monthlyEarnings,
        totalHousings: totalHousings,
        occupiedHousings: occupiedHousings,
        expiredBills: expiredBills,
        pendingCharge: pendingCharge,
    };
};