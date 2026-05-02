import { Dropdown, DropdownDivider, DropdownItem, Popover } from "flowbite-react";
import { ScrollText, Bell } from "lucide-react";
import { useState, useEffect } from "react";
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
            bgColor: "bg-sky-50",
            icon: <Bell size={18} className="text-sky-500" />
        }
    };

    return (
        <div className={`w-full! h-full! bg-white! flex items-start flex-row gap-3! ${isSeen ? "bg-slate-100" : "bg-white"}`}>
            <div className={`flex p-2.5! rounded-md ${stylesPerType[type].bgColor}`}>
                {stylesPerType[type].icon}
            </div>

            <div className="flex flex-col gap-2 items-start">
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
    return (
        <Popover className="max-w-80 rounded-md border p-2.5 border-slate-200 shadow-xl bg-white" placement="bottom" content={
            notificationList.map((notif, id) => {
                return (
                    <NotificationBox
                        key={id}
                        title={notif.title}
                        description={notif.description}
                        type={notif.type}
                    />
                )
            })
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
