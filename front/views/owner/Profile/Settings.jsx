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
    const [activeTab, setActiveTab] = useState("profile");
    const [successfulAction, setSuccessfulAction] = useState(0);

    const [ownerInfo, setOwnerInfo] = useState({
        name: "",
        fatherSurname: "",
        motherSurname: "",
        email: "",
        phoneNumber: "",
        street: "",
        division: "",
        postalCode: "",
        extNum: "",
        city: "",
        state: "",
        signatureUrl: "",
        chargeFee: "",
        minimumContractDur: "",
        curp: "",
        card1: "",
    })

    const loggedUserId = useUser((state) => state.loggedUser);

    useEffect(() => {
        const fetchProfileData = async () => {
            const { data, error } = await supabase
                .from("owners")
                .select()
                .eq("id", loggedUserId);

            if (error) throw error;

            const userData = data[0];

            setOwnerInfo({
                name: userData.name,
                fatherSurname: userData.father_surname,
                motherSurname: userData.mother_surname,
                email: userData.email,
                phoneNumber: userData.phone,
                street: userData.street,
                division: userData.division,
                postalCode: userData.postal_code,
                extNum: userData.ext_num,
                city: userData.city,
                state: userData.state,
                signatureUrl: userData.signature_url,
                chargeFee: userData.charge_fee,
                minimumContractDur: userData.minimum_duration,
                curp: userData.governmentid,
                card1: userData.card1,

            })
        };

        fetchProfileData();
    }, [successfulAction]);

    return (
        <div className="w-full min-h-screen flex flex-col gap-8! lg:px-20! sm:px-16! px-8! py-10!">
            <h1 className="text-start font-semibold! tracking-tight">Configuración</h1>

            <div className="flex lg:flex-row flex-col gap-8 bg-white border border-slate-200 p-6! rounded-2xl">
                <TabNavigator onTabChange={setActiveTab} />

                {activeTab === "profile" && (
                    <Profile
                        name={ownerInfo.name}
                        fatherSurname={ownerInfo.fatherSurname}
                        motherSurname={ownerInfo.motherSurname}
                        email={ownerInfo.email}
                        phoneNumber={ownerInfo.phoneNumber}
                        street={ownerInfo.street}
                        extNum={ownerInfo.extNum}
                        division={ownerInfo.division}
                        city={ownerInfo.city}
                        state={ownerInfo.state}
                        onEditSuccess={() => setSuccessfulAction(successfulAction + 1)}
                    />
                )}

                {activeTab === "payments" && (
                    <PaymentIntegration
                        card1={ownerInfo.card1}
                    />
                )}

                {activeTab === "globals" && (
                    <Globals
                        chargeFee={ownerInfo.chargeFee}
                        minMonths={ownerInfo.minimumContractDur}
                    />
                )}

                {activeTab === "signature" && (
                    <SignatureSection
                        defaultSignUrl={ownerInfo.signatureUrl}
                        onUpdateSuccess={() => setSuccessfulAction(successfulAction + 1)}
                    />
                )}
            </div>
        </div>
    );
};

export default OwnerProfile;