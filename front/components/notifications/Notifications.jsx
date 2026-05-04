import { Dropdown, DropdownDivider, DropdownItem, Popover } from "flowbite-react";
import { ScrollText, Bell } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import useLoggedUser from "../../utils/useLoggedUser";
import { supabase } from "../../config/supabase-client";

export function NotificationBox({
    title,
    description,
    type,
    isSeen,
}) {
    const stylesPerType = {
        rental_contracts: {
            bgColor: "bg-sky-50 border border-sky-300!",
            icon: <Bell size={18} strokeWidth={2} className="text-sky-500" />
        }
    };

    return (
        <div className={`w-full! h-full! p-2 flex items-start cursor-pointer rounded-md flex-row gap-3! ${isSeen ? "bg-slate-50" : "bg-white hover:bg-slate-100!"}`}>
            <div className={`flex p-2.5! rounded-md ${stylesPerType[type].bgColor}`}>
                {stylesPerType[type].icon}
            </div>

            <div className="flex flex-col gap-1 items-start">
                <p className="text-sm! text-start text-slate-900 font-semibold">
                    {title}
                </p>

                <p className="text-sm! text-start text-slate-500 font-normal">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default function Notifications({ notificationList }) {
    const navigate = useNavigate();

    return (
        <Popover className="max-w-80 rounded-md border p-2 border-slate-200 shadow-xl bg-white" placement="bottom" content={
            <div className="flex flex-col! gap-3 items-center">
                {notificationList.map((notif, id) => {
                    return (
                        <NotificationBox
                            key={id}
                            title={notif.title}
                            description={notif.description}
                            type={notif.type}
                            isSeen={notif.seen}
                        />
                    )
                })}

                <button onClick={() => navigate("/system/configuracion", { state: { openTab: "notifications" } })} className="px-2 pb-2 self-start text-sm! text-start font-medium text-sky-600 hover:text-sky-800 cursor-pointer">
                    Ver todas las notificaciones
                </button>
            </div>
        }>
            <button
                type="button"
                className="cursor-pointer"
            >
                <Bell size={22} className="text-slate-500! hover:text-sky-600!" />
            </button>
        </ Popover>
    )
}
