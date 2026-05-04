import toast, { Toaster } from "react-hot-toast"

export default function NotificationsSection() {
    return (
        <div className="flex flex-col gap-4 w-full">
            <Toaster />
            <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                <div className="header flex flex-col gap-2">
                    <h1 className="text-start font-semibold! text-2xl! tracking-tight">Notificaciones</h1>
                    <p className="text-base font-normal text-slate-500 text-start">Revisa tus últimas notificaciones y mantente al tanto de todo en tu sistema.</p>
                </div>
            </div>
        </div>
    )
}