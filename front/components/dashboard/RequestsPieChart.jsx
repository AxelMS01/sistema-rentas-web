import { Pie, PieChart, Tooltip, Cell } from "recharts";
import { supabase } from "../../config/supabase-client";
import useUser from "../../stores/user-store";
import { useEffect, useState } from "react";

export default function RequestsPieChart() {
    const colors = ["#eab308", "#22c55e"]; // Pending, solved; respectively.
    const loggedUserId = useUser((state) => state.loggedUser);
    const [chartData, setChartData] = useState();
    const [pendingRequests, setPendingRequests] = useState();
    const [solvedRequests, setSolvedRequests] = useState();
    const [isLoading, setIsLoading] = useState();

    async function getChartData() {
        try {
            // Initialize the pie chart's numbers.
            let pendingNumber = 0;
            let solvedNumber = 0;

            const { data, error } = await supabase
                .from("maintenancerequests")
                .select()
                .eq("owner_id", loggedUserId);

            if (error) throw error;

            data.forEach((request, id) => {
                if (request.status === "pending") {
                    pendingNumber += 1;
                } else {
                    solvedNumber += 1;
                };
            });

            setPendingRequests(pendingNumber);
            setSolvedRequests(solvedNumber);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        };
    };

    useEffect(() => {
        getChartData();
    })

    const data = [
        {
            name: "Pendientes",
            value: pendingRequests
        },
        {
            name: "Resueltas",
            value: solvedRequests,
        }
    ];

    return (
        <>
            {!isLoading && (
                <PieChart
                    style={{ width: "100%", height: "100%", aspectRatio: 1 }}
                    responsive
                >

                    <Pie data={data} dataKey="value" label>
                        {data.map((entry, id) => (
                            <Cell key={id} fill={colors[id]} />
                        ))}
                    </Pie>

                    <Tooltip content={<CustomTooltip />} />

                </PieChart>
            )}
        </>
    )
};

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        return (
            <div className="flex flex-col gap-2 bg-white border border-slate-200 rounded-md! p-2 shadow-xl">
                <p className="text-sm text-slate-600">
                    {payload[0].name}: <span className="font-semibold text-slate-900">{payload[0].value}</span>
                </p>
            </div>
        );
    };

    return null;
};