function FormStep({ name, icon, status, stepNum }) {
    const totalSteps = 3;

    return (
        <div className="flex sm:flex-col flex-row gap-2 items-center justify-center px-2 py-2 rounded-md border border-sky-500! bg-sky-50">
            <div className={`p-1.5 rounded-full ${status === "active" ? "bg-sky-600 text-white" : (status === "unseen" ? "bg-slate-bg-slate-100 border border-slate-200" : "bg-green-500 text-white")}`}>
                {icon}
            </div>

            <p className={`${status === "active" ? "text-slate-900" : (status === "unseen" ? "text-slate-600" : "text-green-500")} font-medium text-sm text-start`}>
                Paso {stepNum} de 3: {name}
            </p>
        </div>
    );
};

export default FormStep;