import { Pie, PieChart, Tooltip, Cell } from "recharts";

export default function RequestsPieChart() {
    const colors = ["#eab308", "#22c55e"]; // Pending, solved

    const data = [
        {
            name: "Pendientes",
            value: 50
        },
        {
            name: "Resueltas",
            value: 10,
        }
    ];

    return (
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