import { Label, Select } from "flowbite-react";
import { useState, useMemo, useEffect } from "react";
import ChartCard from "../../../components/dashboard/ChartCard";
import useMainCards from "../../../utils/dashboard/useMainCards";
import QuickStatisticCard from "../../../components/dashboard/QuickStatisticCard";
import MonthlyIncomeChart from "../../../components/dashboard/MonthlyIncomeChart";
import RequestsPieChart from "../../../components/dashboard/RequestsPieChart";
import InvoicesTable from "../../../components/dashboard/InvoicesTable";
import { supabase } from "../../../config/supabase-client";
import useLoggedUser from "../../../utils/useLoggedUser";

export default function NewDashboard() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const [isLoading, setIsLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);
    const [tenantsInfo, setTenantsInfo] = useState();
    const loggedUser = useLoggedUser();

    const {
        isDataLoading,
        monthlyEarnings,
        occupiedHousings,
        totalHousings,
        pendingCharge,
        expiredBills
    } = useMainCards(selectedMonth);

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    useEffect(() => {
        async function getTenantsFromOwner() {
            try {
                const { data, error } = await supabase
                    .from("tenants")
                    .select()
                    .eq("owner_id", loggedUser);

                if (error) throw error;

                setTenantsInfo(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        getTenantsFromOwner();
    }, []);

    return (
        <>
            {!isDataLoading && !isLoading && (
                <div className="w-full min-h-screen flex flex-col gap-8! lg:px-20! sm:px-16! px-8! py-10">
                    <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                        <div className="header flex flex-col gap-2">
                            <h1 className="text-start font-semibold! tracking-tight">Dashboard</h1>
                            <p className="text-base font-normal text-slate-500 text-start">Consulta estadísticas e información importante de las rentas.</p>
                        </div>
                    </div>

                    <div className="w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
                        <QuickStatisticCard
                            name="monthlyEarnings"
                            number={`$${monthlyEarnings}`}
                        />

                        <QuickStatisticCard
                            name="occupiedHousings"
                            number={occupiedHousings}
                            comparisonNumber={totalHousings}
                        />

                        {/* Poner el costo como tal */}
                        <QuickStatisticCard
                            name="expiredBills"
                            number={`$${expiredBills}`}
                        />

                        {/* Cantidad del cobro pendiente (en dinero) de todas las viviendas, 
                            en base a la cantidad de meses que ya han transcurrido.
                            E.j. de 60,000 pesos, ya cobré 10,000, entonces me faltan 50,000 (de una vivienda).
                        */}
                        <QuickStatisticCard
                            name="pendingCharge"
                            number={`$${pendingCharge}`}
                        />
                    </div>

                    <div className="flex w-full md:flex-row flex-col justify-between md:items-start items-start gap-6">
                        <div className="header flex flex-col gap-2">
                            <h1 className="text-start font-semibold! text-2xl! tracking-tight">Cálculos mensuales</h1>
                        </div>

                        <div className="max-w-80 flex flex-row items-end! gap-2">
                            <div className="mb-2 block">
                                <Label htmlFor="countries" className="text-slate-600">Mostrando registros de:</Label>
                            </div>
                            <Select size="sm" className="bg-white! text-sm!" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} id="countries" required>
                                {monthNames.map((month, id) => {
                                    return (
                                        <option className="bg-white!" key={id} value={id}>{monthNames[id]}</option>
                                    )
                                })}
                            </Select>
                        </div>
                    </div>

                    <div className="w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
                        <div className="lg:col-span-3 sm:col-span-4 w-full!">
                            <ChartCard title="Gráfica de ingresos mensuales">
                                <MonthlyIncomeChart />
                            </ChartCard>
                        </div>

                        <div className="lg:col-span-1 sm:col-span-4 w-full h-full!">
                            <ChartCard title="Incidencias">
                                <RequestsPieChart />
                            </ChartCard>
                        </div>
                    </div>

                    <ChartCard title="Tabla general">
                        <InvoicesTable tenantList={tenantsInfo} />
                    </ChartCard>
                </div>
            )}
        </>
    )
}