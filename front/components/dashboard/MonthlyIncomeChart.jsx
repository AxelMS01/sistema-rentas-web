import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    ResponsiveContainer,
    CartesianGrid,
    Tooltip,
    Legend
} from "recharts";
import { supabase } from "../../config/supabase-client";
import { useState, useEffect } from "react";
import useUser from "../../stores/user-store";

const currentDate = new Date();
const currentYear = currentDate.getFullYear();
const lastDateOfYear = new Date(currentYear, 11, 31).toISOString();
const firstDateOfYear = new Date(currentYear, 0, 1).toISOString();

export default function MonthlyIncomeChart() {
    const [chartData, setChartData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const loggedUserId = useUser((state) => state.loggedUser);

    function reduceIncomes(array) {
        const initialValue = 0;
        const totalSum = array.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            initialValue
        );

        return totalSum;
    };


    async function getChartData() {
        try {
            const { data, error } = await supabase
                .from("invoices")
                .select()
                .lte("created_at", lastDateOfYear)
                .gte("created_at", firstDateOfYear)
                .eq("owner_id", loggedUserId);

            if (error) throw error;

            const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
            const incomeByMonth = [
                [0],
                [0],
                [0],
                [0],
                [0],
                [0],
                [0],
                [0],
                [0],
                [0],
                [0],
                [0]
            ];

            data.forEach((invoice, id) => {
                const monthIncomes = 0;
                const invoiceMonth = new Date(invoice.created_at).getMonth();

                incomeByMonth[invoiceMonth].push(invoice.amount ? invoice.amount : 0);
            });

            const resultsArray = [];

            incomeByMonth.forEach((month, id) => {
                resultsArray.push({
                    "name": monthNames[id],
                    "Ingresos": reduceIncomes(incomeByMonth[id])
                });
            });

            setChartData(resultsArray);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        getChartData();
    }, []);

    return (
        <>
            {!isLoading && (
                <ResponsiveContainer className="mt-4" width={"100%"} height={300}>
                    <LineChart
                        width={500}
                        height={300}
                        data={chartData}
                        margin={{
                            right: 30,

                        }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" stroke="#64748b" strokeWidth={0.5} fontSize={14} />
                        <YAxis stroke="#64748b" strokeWidth={0.5} fontSize={14} />
                        <Legend />
                        <Line type="monotone" dataKey="Ingresos" stroke="#0284c7" strokeWidth={2} />
                        <Tooltip content={<CustomTooltip />} />
                    </LineChart>
                </ResponsiveContainer>
            )}
        </>
    )
};

function CustomTooltip({ active, payload }) {
    if (active && payload && payload.length) {
        return (
            <div className="flex flex-col gap-2 bg-white border border-slate-200 rounded-md! p-2 shadow-xl">
                <p className="text-sm text-slate-600">
                    {payload[0].name}: <span className="font-semibold text-slate-900">${payload[0].value}</span>
                </p>
            </div>
        );
    };

    return null;
}