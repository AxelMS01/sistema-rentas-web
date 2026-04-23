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
                    .range(firstMonthDate, lastMonthDate);
                
                if (invoicesError) throw invoicesError;
                
                console.log("received data:", invoicesData);
            } catch (error) {
                console.log("Error found in statistic card calculations:", error);
            } finally {
                setIsLoading(false);
            };
        }
    );

    useEffect(() => {
        fetchData();
    }, []);
}