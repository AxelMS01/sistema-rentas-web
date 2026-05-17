import { House, TrendingUp, CreditCard, Receipt } from "lucide-react";

export default function QuickStatisticCard({ name, number, comparisonNumber }) {
    const cardStyles = {
        monthlyEarnings: {
            iconBgColor: "bg-[rgb(171,69,255,0.1)]",
            icon: <TrendingUp className="text-purple-500" size={28} />,
            title: "Ingresos mensuales"
        },
        occupiedHousings: {
            iconBgColor: "bg-[rgb(245,51,155,0.1)]",
            icon: <House className="text-pink-500" size={24} />,
            title: "Viviendas ocupadas",
        },
        expiredBills: {
            iconBgColor: "bg-[rgb(240,176,0,0.1)]",
            icon: <Receipt className="text-amber-500" size={24} />,
            title: "Rentas vencidas",
        },
        pendingCharge: {
            iconBgColor: "bg-[rgb(0,183,219,0.1)]",
            icon: <CreditCard className="text-cyan-500" size={24} />,
            title: "Cobro pendiente",
        }
    };

    return (
        <div className="w-full bg-white border items-center gap-4 flex flex-row rounded-xl border-slate-200 p-6">
            <div className={`card-icon p-2.5 rounded-full items-center ${cardStyles[name].iconBgColor}`}>
                {cardStyles[name].icon}
            </div>

            <div className="flex flex-col gap-1.5">
                <div className="flex flex-row gap-1.5 items-end">
                    <p className="text-3xl! font-semibold text-slate-800">{number}</p>
                    {comparisonNumber != undefined && (
                        <>
                            <p className="text-base font-medium text-slate-500">/</p>
                            <p className="text-base font-medium text-slate-500">{comparisonNumber}</p>
                        </>
                    )}
                </div>

                <h1 className="text-base! font-normal! text-slate-500!">{cardStyles[name].title}</h1>
            </div>
        </div>
    )
}