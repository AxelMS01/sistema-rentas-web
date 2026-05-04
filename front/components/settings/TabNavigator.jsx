import { useState } from "react";
import ProfileTab from "./ProfileTab";
import { Bell, CreditCard, HandCoins, Settings, Signature, UserRound } from "lucide-react";

export default function TabNavigator({ onTabChange }) {
    const [activeTab, setActiveTab] = useState("profile");

    function handleTabChange(tabName) {
        setActiveTab(tabName);
        onTabChange(tabName);
    };

    return (
        <div className="flex flex-col gap-2 lg:border-r lg:border-b-0 border-b border-r-0 border-slate-200 lg:pr-8 pb-8">
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

            <ProfileTab
                tabName="Todas mis notificaciones"
                isActive={activeTab === "notifications"}
                icon={<Bell size={18} strokeWidth={activeTab === "signature" ? 2.5 : 2} />}
                onClick={() => handleTabChange("notifications")}
            />
        </div>
    )
};