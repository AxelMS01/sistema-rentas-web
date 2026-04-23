import { useState, useEffect } from "react";
import ContractsTable from "../../../components/contracts/ContractsTable";
import { supabase } from "../../../config/supabase-client";
import SearchBar from "../../../components/SearchBar";
import useUser from "../../../stores/user-store";
import Button from "../../../components/Button";
import { useNavigate } from "react-router-dom";
import MenuCard from "../../../components/tenant-view/MenuCard";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Banknote, ScrollText, Sun, TriangleAlert } from "lucide-react";
import HomeInfoCard from "../../../components/tenant-view/HomeInfoCard";
import ContractDetailsModal from "../../../components/tenant-view/ContractDetailsModal";

export const token = localStorage.getItem("token");

const Home = () => {
    const navigate = useNavigate();
    const [tenantInfo, setTenantInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const [ownerId, setOwnerId] = useState();
    const [contractDetailModal, setContractDetail] = useState(false);
    const loggedUserId = useUser((state) => state.loggedUser);
    console.log(loggedUserId);

    useEffect(() => {
        async function getOwnerAndTenant() {
            try {
                const { data: tenantData, error: tenantError } = await supabase
                    .from("tenants")
                    .select()
                    .eq("id", loggedUserId);

                if (tenantError) throw tenantError;

                if (tenantData[0].is_first_time === true) {
                    navigate("/bienvenida", { state: tenantData[0] });
                } else {
                    setTenantInfo(tenantData[0]);
                };

                const { data: contractData, error: contractError } = await supabase
                    .from("rentalcontracts")
                    .select("owner_id")
                    .eq("tenantid", loggedUserId);

                if (contractError) throw contractError;

                console.log(contractData.length);

                if (contractData.length === 0) {
                    navigate("/", {
                        state: {
                            welcomeFormErr: "No hay un contrato creado",
                            welcomeFormErrDesc: "Tu arrendador no ha generado un contrato en su sistema aún. Por favor, espera a que lo haya creado."
                        }
                    });
                };

                setOwnerId(contractData[0].owner_id);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        getOwnerAndTenant();
    }, []);

    const todayDate = new Date();

    return (
        <>
            {!isLoading && (

                <>
                    <ContractDetailsModal
                        isModalOpen={contractDetailModal}
                        onCloseModal={() => setContractDetail(false)}
                        ownerId={ownerId}
                        tenantId={loggedUserId}

                    />

                    <div className="w-full min-h-screen flex flex-col gap-4! lg:px-20! sm:px-16! px-8! py-10">
                        <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                            <div className="header flex flex-col gap-2">
                                <h1 className="text-start font-light fw-semibold tracking-tight">¡Bienvenido, {tenantInfo.name}!</h1>
                                <p className="text-base font-normal text-slate-500 text-start">¿Qué deseas hacer hoy?</p>
                            </div>

                            <div className="flex flex-row gap-2 items-center justify-center px-3 py-2 bg-sky-600 border border-sky-700 text-white rounded-md self-start text-sm! font-medium">
                                <Sun strokeWidth={2} size={18} />
                                Hoy es {format(todayDate, "PPP", { locale: es })}
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                            <MenuCard action="quick">
                                <div className="w-full flex! cursor-pointer py-2 px-3 flex-row! gap-2 items-center justify-start border border-slate-200 rounded-md hover:bg-sky-100 hover:border-sky-500!">
                                    <Banknote size={20} />
                                    <p className="font-medium! text-sm! text-slate-700">Realizar un pago</p>
                                </div>

                                <div onClick={() => setContractDetail(true)} className="w-full flex! cursor-pointer py-2 px-3 flex-row! gap-2 items-center justify-start border border-slate-200 rounded-md hover:bg-sky-100 hover:border-sky-500!">
                                    <ScrollText size={20} />
                                    <p className="font-medium! text-sm! text-slate-700">Ver detalles de mi contrato</p>
                                </div>

                                <div onClick={() => navigate("/mis-incidencias")} className="w-full flex! cursor-pointer py-2 px-3 flex-row! gap-2 items-center justify-start border border-slate-200 rounded-md hover:bg-sky-100 hover:border-sky-500!">
                                    <TriangleAlert size={20} />
                                    <p className="font-medium! text-sm! text-slate-700">Mis incidencias</p>
                                </div>
                            </MenuCard>

                            <MenuCard action="info">
                                <HomeInfoCard />
                            </MenuCard>

                            <MenuCard
                                action="receipts"
                            />
                        </div>
                    </div>
                </>
            )}
        </>
    );
};

export default Home;