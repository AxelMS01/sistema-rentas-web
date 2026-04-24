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

const sampleData = [
    {
        name: "Enero",
        income: 5000,
    },
    {
        name: "Febrero",
        income: 2500,
    },
    {
        name: "Marzo",
        income: 4500
    },
    {
        name: "Abril",
        income: 5000,
    },
    {
        name: "Mayo",
        income: 5500
    },
]

export default function MonthlyIncomeChart() {
    return (
        <ResponsiveContainer className="mt-4" width={"100%"} height={300}>
            <LineChart
                width={500}
                height={300}
                data={sampleData}
                margin={{
                    right: 30,

                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" stroke="#64748b" strokeWidth={0.5} fontSize={14}/>
                <YAxis stroke="#64748b" strokeWidth={0.5} fontSize={14} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#0284c7" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    )
}