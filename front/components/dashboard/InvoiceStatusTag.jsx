export default function InvoiceStatusTag({ status }) {
    const tagStyles = {
        paid: {
            textColor: "text-green-500",
            bgColor: "bg-[rgb(33,196,93,0.10)]",
            dotColor: "bg-green-500",
            borderColor: "border-green-400",
            label: "Pagado"
        },
        expired: {
            textColor: "text-red-500",
            bgColor: "bg-[rgb(240,67,67,0.10)]",
            dotColor: "bg-red-500",
            borderColor: "border-red-500",
            label: "Pago vencido"
        },
        pending: {
            textColor: "text-amber-600",
            bgColor: "bg-amber-50",
            dotColor: "bg-amber-600",
            borderColor: "border-amber-200",
            label: "Pago pendiente"
        }
    };

    return (
        <div className={`flex flex-row gap-1 items-center justify-center px-2 py-1.5 rounded-md self-start! border! ${tagStyles[status].bgColor} ${tagStyles[status].borderColor}`}>
            <div className={`w-1.5 h-1.5 rounded-full ${tagStyles[status].dotColor}`}></div>

            <p className={`text-xs font-medium ${tagStyles[status].textColor}`}>
                {tagStyles[status].label}
            </p>
        </div>
    );
};