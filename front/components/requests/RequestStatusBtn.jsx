import { CircleCheckBig, MessageCircleWarning } from "lucide-react";

function RequestStatusBtn({ status }) {
    const buttonStyles = {
        solved: {
            label: "Resuelta",
            borderColor: "border-green-500",
            bgColor: "bg-[rgb(33,196,93,0.10)]",
            icon: <CircleCheckBig size={18} className="text-green-500" />
        },
        pending: {
            label: "Pendiente",
            borderColor: "border-amber-500",
            bgColor: "bg-[rgb(255,153,0,0.10)]",
            icon: <MessageCircleWarning size={18} className="text-amber-500" />
        }
    };

    return (
        <div className={`flex flex-row gap-1 items-center justify-center px-2 py-1.5 rounded-md self-start border! ${buttonStyles[status].bgColor} ${buttonStyles[status].borderColor}`}>
            {buttonStyles[status].icon}

            <p className="text-xs font-medium text-slate-900">
                {buttonStyles[status].label}
            </p>
        </div>
    );
};

export default RequestStatusBtn;