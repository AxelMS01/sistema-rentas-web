import { BookUser, Receipt, Zap } from "lucide-react"

export default function MenuCard({ action, children }) {
    console.log(action);
    const styles = {
        quick: {
            icon: <Zap size={18} />,
            iconBgColor: "bg-pink-500",
            title: "Acciones rápidas"
        },
        info: {
            icon: <BookUser size={18} />,
            iconBgColor: "bg-emerald-500",
            title: "Información de renta"
        },
        receipts: {
            icon: <Receipt size={18} />,
            iconBgColor: "bg-amber-500",
            title: "Recibos de pagos"
        }
    }

    return (
        <div className="w-full flex flex-col gap-3 sm:p-8 p-6 bg-white border rounded-lg! border-slate-200">
            <div className={`${styles[action].iconBgColor} p-2 rounded-md text-white self-start`}>
                {styles[action].icon}
            </div>

            <h1 className="text-lg! tracking-normal! font-semibold! text-slate-900">{styles[action].title}</h1>

            {children}
        </div>
    )
}