import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../config/supabase-client";
import { lastDayOfMonth } from "date-fns";
import useUser from "../../stores/user-store";

export default function useMainCards(monthId) {
    const [isLoading, setIsLoading] = useState(true);
    const [monthlyEarnings, setMonthlyEarnings] = useState();
    const [occupiedHousings, setOccupiedHousings] = useState();
    const [totalHousings, setTotalHousings] = useState();
    const [expiredBills, setExpiredBills] = useState();
    const [pendingChange, setPendingChange] = useState();
    const loggedUserId = useUser((state) => state.loggedUser);
    console.log(loggedUserId);

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

        const { data: apartmentsData, error: apartmentsError } = await supabase
            .from("apartments")
            .select()
            .eq("ownerid", loggedUserId)

        let occupiedNumber = 0;

        console.log(apartmentsData);

        apartmentsData.forEach((apartment) => {
            if (apartment.status === "OCCUPIED") {
                occupiedNumber += 1;
            };
        })

        if (apartmentsError) throw invoicesError;

        setTotalHousings(apartmentsData.length);
        setOccupiedHousings(occupiedNumber);

        setIsLoading(false);
    };

    const fetchData = useCallback(
        async () => {
            try {
                getInvoices();
                getApartmentData();
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
    }
}