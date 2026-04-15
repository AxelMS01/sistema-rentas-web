import { useEffect, useState } from "react";
import { supabase } from "../../../config/supabase-client";
import useUser from "../../../stores/user-store";
import TabNavigator from "../../../components/settings/TabNavigator";
import Globals from "../../../components/settings/Globals";
import Profile from "../../../components/settings/Profile";
import PaymentIntegration from "../../../components/settings/PaymentIntegration";
import ProfileTab from "../../../components/settings/ProfileTab";
import { Button, Label } from "flowbite-react";
import SignatureSection from "../../../components/settings/Signature";

function OwnerProfile() {
    const [name, setName] = useState("");
    const [fatherSurname, setFatherSurname] = useState("");
    const [motherSurname, setMotherSurname] = useState("");
    const [email, setEmail] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [street, setStreet] = useState("");
    const [division, setDivision] = useState("");
    const [postalCode, setPostalCode] = useState("");
    const [extNum, setExtNum] = useState("");
    const [city, setCity] = useState("Durango");
    const [state, setState] = useState("Durango");
    const [activeTab, setActiveTab] = useState("profile")

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
        <div className="w-full min-h-screen flex flex-col gap-8! lg:px-20! sm:px-16! px-8! py-10!">
            <h1 className="text-start font-semibold! tracking-tight">Configuración</h1>

            <div className="flex flex-row gap-8 bg-white border border-slate-200 p-6! rounded-2xl">
                <TabNavigator onTabChange={setActiveTab} />

                {activeTab === "profile" && (
                    <Profile />
                )}

                {activeTab === "payments" && (
                    <PaymentIntegration />
                )}

                {activeTab === "globals" && (
                    <Globals />
                )}

                {activeTab === "signature" && (
                    <SignatureSection />
                )}
            </div>
        </div>
    );
};

export default OwnerProfile;