import { Dropdown, DropdownDivider, DropdownItem } from "flowbite-react";
import { ScrollText, Bell } from "lucide-react";
import { useState, useEffect } from "react";

function NotificationBox({
    title,
    description,
    type,
    isSeen,
}) {
    const stylesPerType = {
        rentalContracts: {
            bgColor: "bg-sky-50",
            icon: <Bell size={18} strokeWidth={18} className="text-sky-500" />
        }
    };

    return (
        <div className={`w-full shrink-0 flex rounded-md flex-row gap-2 ${isSeen ? "bg-slate-100" : "bg-white"}`}>
            <div className={`flex p-4 rounded-md ${rentalContracts[type].bgColor}`}>
                {rentalContracts[type].icon}
            </div>

            <div className="flex flex-col gap-2.5">
                <p className="text-lg text-slate-900 font-medium">
                    {title}
                </p>

                <p className="text-sm! text-slate-500 font-normal">
                    {description}
                </p>
            </div>
        </div>
    );
};

export default function NotificationDropdownContent({ isOpen }) {
    const [notifications, setNotifications] = useState();

    useEffect(() => {
        async function getNotifs() {
            const { data, error } = await supabase
                .from("notifications")
                .select()
                .eq("seen", false);

            if (error) throw error;

            console.log("Data:", data);

            setNotifications(data);
        };

        getNotifs();
    }, []);

    console.log("Notifications", notifications);

    return (
        <div className={`max-w-30 p-2 flex flex-col gap-2 rounded-md border border-slate-200 bg-white`}>
            {notifications.map((notif, id) => {
                return (
                    <NotificationBox
                        key={id}
                        title={notif.title}
                        description={notif.description}
                        type={notif.type}
                    />
                )
            })}
        </div>
    );
};