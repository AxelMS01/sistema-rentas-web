import { useEffect, useState } from "react";
import { supabase } from "../../../config/supabase-client";
import useUser from "../../../stores/user-store";

function OwnerProfile() {
    const [name, setName] = useState("");
    const [fatherSurname, setFatherSurname] = useState("");
    const [motherSurname, setMotherSurname] = useState("");
    const [street, setStreet] = useState("");
    const [division, setDivision] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [extNum, setExtNum] = useState("");

    const loggedUserId = useUser((state) => state.loggedUser);

    useEffect(() => {
        const fetchProfileData = async () => {
            const { data, error } = await supabase
                .from("owners")
                .select()
                .eq("id", loggedUserId);

            if (error) throw error;

            setName(data[0].name);
            setFatherSurname(data[0].father_surname);
            setMotherSurname(data[0].mother_surname);
            setStreet(data[0].street);
            setDivision(data[0].division);
            setPostalCode(data[0].postal_code);
            setExtNum(data[0].ext_num);
        };

        fetchProfileData();
    }, []);

    return (
        <div className="w-full h-screen flex flex-col gap-4! lg:px-20! sm:px-16! px-8! py-10">
            <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                <div className="header flex flex-col gap-2">
                    <h1 className="text-start font-light fw-semibold tracking-tight">Mi Perfil</h1>
                    <p className="text-base font-normal text-slate-500 text-start">Revisa y configura tu información personal.</p>
                </div>
            </div>

            <div className="w-full flex items-center gap-10 justify-start md:flex-row flex-col bg-white sm:p-8 p-6 border border-slate-200 rounded-xl!">
                <div className="avatar w-40! h-40! rounded-full! bg-slate-100 border-2 border-slate-200">
                    {/*Avatar aquí*/}
                </div>

                <div className="w-auto flex flex-col gap-2 items-start">
                    <p className="text-xl! font-semibold text-slate-900">{name} {fatherSurname} {motherSurname}</p>
                    <p className="text text-slate-600 font-normal">Arrendador</p>
                </div>
            </div>
        </div>
    );
};

export default OwnerProfile;