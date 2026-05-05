import toast, { Toaster } from "react-hot-toast";
import NotificationRow from "../notifications/NotificationRow";
import useNotifications from "../../utils/notifications/useNotifications";
import useLoggedUser from "../../utils/useLoggedUser";
import { CircleCheck } from "lucide-react";

export default function NotificationsSection() {
    const ownerId = useLoggedUser();

    const {
        loadingNotifs,
        newNotifs,
        weekNotifs,
        monthNotifs,
        prevNotifs
    } = useNotifications("owner", ownerId);

    const stylesPerType = {
        rental_contracts: {
            bgColor: "bg-sky-500!",
            icon: <Bell size={14} strokeWidth={2} fill="white" className="text-white" />
        },
        invoices: {
            bgColor: "bg-green-50 border border-green-500!",
            icon: <HandCoins size={15} strokeWidth={2} className="text-emerald-500" />
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full">
            <Toaster />
            <div className="header flex flex-col gap-2">
                <h1 className="text-start font-semibold! text-2xl! tracking-tight">Notificaciones</h1>
                <p className="text-base font-normal text-slate-500 text-start">Revisa tus últimas notificaciones y mantente al tanto de todo en tu sistema.</p>
            </div>

            {!loadingNotifs && (
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-medium text-slate-900">Nuevas</p>

                        {newNotifs.length === 0 && (
                            <div className="flex flex-row gap-1 items-center text-slate-500">
                                <CircleCheck size={16} className="" />
                                <p className="text-sm">¡Estás al día! No hay notificaciones qué mostrar.</p>
                            </div>
                        )}

                        {newNotifs.length > 0 && newNotifs.map((notif, id) => {
                            return (
                                <NotificationRow
                                    title={notif.title}
                                    desc={notif.description}
                                    type={notif.type}
                                    creationDate={notif.created_at}
                                    additionalDetails={notif.additional_details}
                                    isSeen={notif.seen}
                                    notifId={notif.id}
                                    key={id}
                                />
                            )
                        })}
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-medium text-slate-900">Esta semana</p>

                        {weekNotifs.length === 0 && (
                            <div className="flex flex-row gap-1 items-center text-slate-500">
                                <CircleCheck size={16} className="" />
                                <p className="text-sm">¡Estás al día! No hay notificaciones qué mostrar.</p>
                            </div>
                        )}

                        {weekNotifs.length > 0 && weekNotifs.map((notif, id) => {
                            return (
                                <NotificationRow
                                    title={notif.title}
                                    desc={notif.description}
                                    type={notif.type}
                                    creationDate={notif.created_at}
                                    additionalDetails={notif.additional_details}
                                    isSeen={notif.seen}
                                    notifId={notif.id}
                                    key={id}
                                />
                            )
                        })}
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-medium text-slate-900">Este mes</p>

                        {monthNotifs.length === 0 && (
                            <div className="flex flex-row gap-1 items-center text-slate-600">
                                <CircleCheck size={16} className="" />
                                <p className="text-sm">¡Estás al día! No hay notificaciones qué mostrar.</p>
                            </div>
                        )}

                        {monthNotifs.length > 0 && monthNotifs.map((notif, id) => {
                            return (
                                <NotificationRow
                                    title={notif.title}
                                    desc={notif.description}
                                    type={notif.type}
                                    creationDate={notif.created_at}
                                    additionalDetails={notif.additional_details}
                                    isSeen={notif.seen}
                                    notifId={notif.id}
                                    key={id}
                                />
                            )
                        })}
                    </div>

                    <div className="flex flex-col gap-2">
                        <p className="text-lg font-medium text-slate-900">Anteriores</p>
                        {prevNotifs.map((notif, id) => {
                            console.log(prevNotifs);
                            return (
                                <NotificationRow
                                    title={notif.title}
                                    desc={notif.description}
                                    type={notif.type}
                                    creationDate={notif.created_at}
                                    additionalDetails={notif.additional_details}
                                    isSeen={notif.seen}
                                    notifId={notif.id}
                                    key={id}
                                />
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}