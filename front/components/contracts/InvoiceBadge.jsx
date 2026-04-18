export default function InvoicBadge({ status, labelText, location }) {
    const stylesPerStatus = {
        active: {
            bgColor: "bg-green-500",
            infoText: "Activo"
        },
        pending: {
            bgColor: "bg-amber-500",
            infoText: "Pendiente",
        },
        cancelled: {
            bgColor: "bg-red-500",
            infoText: "Cancelado",
        },
    }

    return (
        <div className={`bg-white border border-slate-200 flex flex-row gap-2 px-3! py-1.5! items-center justify-center cursor-pointer rounded w-auto`}>
            <div className={`w-2 h-2 rounded-full ${stylesPerStatus[status].bgColor}`}></div>

            <p className={`text-slate-900 font-medium text-sm!`}>{stylesPerStatus[status].infoText}</p>
        </div>
    );
};