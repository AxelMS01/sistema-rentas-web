import { Search } from "lucide-react";

function SearchBar({value, onChange, placeholder}) {
    return (
        <div className="sm:w-auto w-full px-2.5 py-2.5 border border-slate-200 bg-white rounded-lg flex flex-row gap-2 items-center justify-center">
            <Search className="text-slate-600" size={18}/>
            <input type="text" value={value} onChange={onChange} placeholder={placeholder} className="w-full h-full text-sm! border-none outline-none"/>
        </div>
    );
};

export default SearchBar;