function FormStep({ name, icon, status, stepNum }) {
    const totalSteps = 4;

    return (
        <div className="flex sm:flex-col flex-row gap-2 items-center justify-center px-2 py-2 rounded-md border border-sky-500! bg-sky-50">
            <div className={`p-1.5 rounded-full bg-sky-600 text-white`}>
                {icon}
            </div>

            <p className={`text-slate-900 font-medium text-sm text-start`}>
                Paso {stepNum} de {totalSteps}: {name}
            </p>
        </div>
    );
};

export default FormStep;