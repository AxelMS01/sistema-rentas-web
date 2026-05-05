import { Bell, Clock, FileText, HandCoins, ScrollText, Text } from "lucide-react";
import { format, formatDistance } from "date-fns";
import markNotifAsRead from "../../utils/notifications/MarkNotifAsRead";
import { useNavigate } from "react-router-dom";
import { es } from "date-fns/locale";

export default function NotificationRow({ notifId, title, desc, type, additionalDetails, creationDate, isSeen }) {
    const navigate = useNavigate();
    const currentDate = new Date().toLocaleString();
    console.log(creationDate);

    const stylesPerType = {
        rental_contracts: {
            bgColor: "bg-sky-500!",
            icon: <FileText size={16} strokeWidth={2.5} className="text-white" />
        },
        invoices: {
            bgColor: "bg-emerald-500!",
            icon: <HandCoins size={15} strokeWidth={2} className="text-white" />
        }
    };

    const labelStyles = {
        rental_contracts: {
            bgColor: "bg-sky-50",
            label: "Contratos",
            textColor: "text-sky-500",
            borderColor: "border-sky-300!",
            link: "/system/contratos"
        },
    };

    async function handleRedirection(updateId, link) {
        console.log(updateId)
        await markNotifAsRead(updateId);
        navigate(link);
    }

    return (
        <div onClick={() => handleRedirection(notifId, labelStyles[type].link)} className={`w-full p-3 flex flex-col gap-2 border border-slate-200 rounded-xl ${isSeen ? "bg-slate-100" : "bg-white"} hover:bg-slate-100! cursor-pointer items-start`}>
            <div className="flex flex-row gap-2 items-center">
                <div className={`flex p-2 rounded-full ${stylesPerType[type].bgColor}`}>
                    {stylesPerType[type].icon}
                </div>

                <div className="flex flex-col gap-2 items-start">
                    <div className="flex sm:flex-row flex-col sm:items-center items-start justify-center gap-2">
                        <div className={`${labelStyles[type].borderColor} ${labelStyles[type].bgColor} border rounded-md px-2 py-1`}>
                            <p className={`text-xs! ${labelStyles[type].textColor} font-medium`}>
                                Módulo de {labelStyles[type].label}
                            </p>
                        </div>

                        <div className="flex flex-row gap-1 text-slate-500">
                            <Clock size={14} />
                            <p className="text-xs! font-normal">Hace {formatDistance(currentDate, creationDate, { locale: es })}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <p className="text-base! text-start text-slate-900 font-semibold">
                    {title}
                </p>

                <p className="text-sm! text-start text-slate-600 font-normal">
                    {desc}
                </p>

                {additionalDetails != undefined && (
                    <div className={`w-full text-wrap text-sm p-2.5 text-slate-800 ${isSeen ? "bg-white" : "bg-slate-100"} border border-slate-200 rounded-lg`}>
                        {additionalDetails}
                    </div>
                )}
            </div>
        </div>
    );
};