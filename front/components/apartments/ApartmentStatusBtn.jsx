export default function StatusButton({ status, isActive, onClick }) {
    const stylesPerStatus = {
        all: {
            bgColor: "bg-sky-600",
            text: "Todas las viviendas",
        },
        AVAILABLE: {
            bgColor: "bg-green-500",
            text: "Disponibles"
        },
        OCCUPIED: {
            bgColor: "bg-red-500",
            text: "Ocupadas",
        },
        ARCHIVED: {
            bgColor: "bg-slate-500",
            text: "Archivadas",
        },
    }

    return (
        <div onClick={onClick} className={`${isActive ? stylesPerStatus[status].bgColor : "bg-white border hover:bg-slate-100 border-slate-200"} flex flex-row gap-2 px-3 py-1.5 items-center justify-center cursor-pointer rounded w-auto`}>
            {!isActive && (
                <div className={`w-2 h-2 rounded-circle ${stylesPerStatus[status].bgColor}`}></div>
            )}

            <p className={`${isActive ? "text-white" : "text-slate-900"} font-medium mb-0!`}>{stylesPerStatus[status].text}</p>
        </div>
    )
}