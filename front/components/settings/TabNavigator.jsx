import { useState } from "react";
import ProfileTab from "./ProfileTab";
import { CreditCard, HandCoins, Settings, Signature, UserRound } from "lucide-react";

export default function TabNavigator({ onTabChange }) {
    const [activeTab, setActiveTab] = useState("profile");

    function handleTabChange(tabName) {
        setActiveTab(tabName);
        onTabChange(tabName);
    };

    return (
        <div className="flex flex-col gap-2 border-r border-slate-200 pr-8">
            <ProfileTab
                tabName="Perfil"
                isActive={activeTab === "profile"}
                icon={<UserRound size={18} strokeWidth={activeTab === "profile" ? 2.5 : 2} />}
                onClick={() => handleTabChange("profile")}
            />

            <ProfileTab
                tabName="Integración de pagos"
                isActive={activeTab === "payments"}
                icon={<CreditCard size={18} strokeWidth={activeTab === "payments" ? 2.5 : 2} />}
                onClick={() => handleTabChange("payments")}
            />

            <ProfileTab
                tabName="Ajustes globales"
                isActive={activeTab === "globals"}
                icon={<Settings size={18} strokeWidth={activeTab === "globals" ? 2.5 : 2} />}
                onClick={() => handleTabChange("globals")}
            />

            <ProfileTab
                tabName="Firma de documentos"
                isActive={activeTab === "signature"}
                icon={<Signature size={18} strokeWidth={activeTab === "signature" ? 2.5 : 2} />}
                onClick={() => handleTabChange("signature")}
            />
        </div>
    )
};