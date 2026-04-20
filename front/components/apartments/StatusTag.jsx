export default function StatusTag({ status }) {
    const tagStyles = {
        AVAILABLE: {
            textColor: "text-green-500",
            bgColor: "bg-[rgb(33,196,93,0.10)]",
            dotColor: "bg-green-500",
            borderColor: "border-green-400",
            label: "Disponible"
        },
        OCCUPIED: {
            textColor: "text-red-500",
            bgColor: "bg-[rgb(240,67,67,0.10)]",
            dotColor: "bg-red-500",
            borderColor: "border-red-500",
            label: "Ocupada"
        },
        ARCHIVED: {
            textColor: "text-slate-600",
            bgColor: "bg-slate-100",
            dotColor: "bg-slate-600",
            borderColor: "border-slate-200",
            label: "Archivada"
        }
    };

    return (
        <div className={`flex flex-row gap-1 items-center justify-center px-2 py-1.5 rounded-md self-start border! ${tagStyles[status].bgColor} ${tagStyles[status].borderColor}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${tagStyles[status].dotColor}`}></div>

            <p className={`text-xs font-medium ${tagStyles[status].textColor}`}>
                {tagStyles[status].label}
            </p>
        </div>
    );
};