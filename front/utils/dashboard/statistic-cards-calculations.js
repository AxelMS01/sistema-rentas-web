import { useState, useEffect, useCallback } from "react";
import { supabase } from "../../config/supabase-client";
import { lastDayOfMonth } from "date-fns";

export default function useStatisticCardCalculations(monthId) {
    const [isLoading, setIsLoading] = useState(true);
    const [monthlyEarnings, setMonthlyEarnings] = useState();
    const [occupiedHousings, setOccupiedHousings] = useState();
    const [expiredBills, setExpiredBills] = useState();
    const [pendingChange, setPendingChange] = useState();

    const currentDate = new Date();
    const firstMonthDate = new Date(currentDate.getFullYear(), monthId, 1);
    const lastMonthDate = lastDayOfMonth(new Date(currentDate.getFullYear(), monthId, 1));

    const fetchData = useCallback(
        async () => {
            try {
                const { data: invoicesData, error: invoicesError } = await supabase
                    .from("invoices")
                    .select()
                    .gte("created_at", firstMonthDate.toISOString())
                    .lte("created_at", lastMonthDate.toISOString());

                if (invoicesError) throw invoicesError;

                let invoicesTotal = 0;

                invoicesData.forEach((invoice) => {
                    invoicesTotal += invoice.amount;
                })

                if (!invoicesData) setMonthlyEarnings(0);

                setMonthlyEarnings(invoicesTotal);
            } catch (error) {
                console.log("Error found in statistic card calculations:", error);
            } finally {
                setIsLoading(false);
            };
        }, [monthId]
    );

    useEffect(() => {
        fetchData();
    }, [monthId]);

    return {
        isDataLoading: isLoading,
        monthlyEarnings: monthlyEarnings,
    }
}