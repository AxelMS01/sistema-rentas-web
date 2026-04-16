function ProfileTab({ tabName, isActive, icon, onClick }) {
    return (
        <button onClick={onClick} className={`w-full flex items-center justify-start flex-row gap-1 py-2 sm:pl-4 sm:pr-10 px-2 cursor-pointer rounded-md! ${isActive ? "bg-sky-100 text-sky-600" : "bg-transparent hover:bg-slate-200 text-slate-700"}`}>
            {icon}

            <p className={`${isActive ? "font-semibold" : "font-normal"} text-sm text-nowrap`}>{tabName}</p>
        </button>
    );
};

export default ProfileTab;