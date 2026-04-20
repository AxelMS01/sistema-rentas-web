import { House, TrendingUp } from "lucide-react";

export default function QuickStatisticCard({ name, icon, number, isComparison, comparisonNumber, }) {
    const cardStyles = {
        monthlyEarnings: {
            iconBgColor: "bg-[rgb(171,69,255,0.1)]",
            icon: <TrendingUp className="text-purple-500" size={18} />,
            title: "Ganancias mensuales"
        },
        occupiedHousings: {
            iconBgColor: "bg-[rgb(245,51,155,0.1)]",
            icon: <House className="text-pink-500" size={18} />,
            title: "Viviendas ocupadas",
        },
        expiredBills: {
            iconBgColor: "bg-[rgb(240,176,0,0.1)]",
            icon: <House className="text-amber-500" size={18} />,
            title: "Viviendas ocupadas",
        }
    };

    return (
        <div className="w-full bg-white border flex sm:flex-row rounded-xl flex-col border-slate-200 p-6">
            <div className={`card-icon p-3 rounded-full items-center ${cardStyles[name].iconBgColor}`}>
                {icon}
            </div>

            <div className="flex flex-col gap-4">
                <div className="flex flex-row gap-2 items-end">
                    <p className="text-xl! font-semibold text-slate-900">{number}</p>
                    {isComparison && (
                        <>
                            <p className="text-base font-medium text-slate-600"></p>
                            <p className="text-base font-medium text-slate-600">{comparisonNumber}</p>
                        </>
                    )}
                </div>

                <h1 className="text-lg font-medium text-slate-600">{cardStyles[name].title}</h1>
            </div>
        </div>
    )
}