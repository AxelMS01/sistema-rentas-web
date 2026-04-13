export default function Button({ text, icon, onClick, formId = "", type = "" }) {
    return (
        <button className="sm:w-auto w-full flex flex-row gap-2 bg-sky-600 hover:opacity-75 items-center justify-center px-3 py-2 text-white rounded" onClick={onClick} form={formId} type={type}>
            {icon}

            <p className="font-medium text-sm text-nowrap">{text}</p>
        </button>
    );
};