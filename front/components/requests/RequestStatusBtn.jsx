import { CircleCheckBig } from "lucide-react";

function RequestStatusBtn({ status }) {
    const buttonStyles = {
        resuelta: {
            label: "Resuelta",
            borderColor: "border-green-500",
            bgColor: "bg-[rgb(33,196,93,0.10)]",
            icon: <CircleCheckBig size={18} className="text-green-500" />
        },
        pendiente: {
            label: "Pendiente",
            borderColor: "border-red-500",
            bgColor: "bg-[rgb(240,67,67,0.10)]",
            label: "Ocupada",
        }
    };

    return (
        <div className={`flex flex-row gap-1 items-center justify-center px-2 py-1.5 rounded-md self-start border! ${buttonStyles[status].bgColor} ${buttonStyles[status].borderColor}`}>
            {icon}

            <p className="text-xs font-medium text-slate-900">
                {buttonStyles[status].label}
            </p>
        </div>
    );
};

export default RequestStatusBtn;