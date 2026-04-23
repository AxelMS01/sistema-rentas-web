import { Label, Select } from "flowbite-react";
import { useState, useMemo, useEffect } from "react";
import useStatisticCardCalculations from "../../../utils/dashboard/statistic-cards-calculations";
import QuickStatisticCard from "../../../components/dashboard/QuickStatisticCard";

export default function NewDashboard() {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(currentMonth);

    const {
        isDataLoading,
        monthlyEarnings
    } = useStatisticCardCalculations(selectedMonth);

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <>
            {!isDataLoading && (
                <div className="w-full h-screen flex flex-col gap-6! lg:px-20! sm:px-16! px-8! py-10">
                    <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                        <div className="header flex flex-col gap-2">
                            <h1 className="text-start font-light fw-semibold tracking-tight">Dashboard</h1>
                            <p className="text-base font-normal text-slate-500 text-start">Consulta estadísticas e información importante de las rentas.</p>
                        </div>

                        <div className="max-w-80">
                            <div className="mb-2 block">
                                <Label htmlFor="countries">Mostrando registros de:</Label>
                            </div>
                            <Select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} id="countries" required>
                                {monthNames.map((month, id) => {
                                    return (
                                        <option id={id} value={id}>{monthNames[id]}</option>
                                    )
                                })}
                            </Select>
                        </div>
                    </div>

                    <div className="w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
                        <QuickStatisticCard
                            name="monthlyEarnings"
                            number={`$${monthlyEarnings}`}
                        />

                        <QuickStatisticCard
                            name="occupiedHousings"
                            number={500}
                            comparisonNumber={600}
                        />

                        <QuickStatisticCard
                            name="expiredBills"
                            number={2}
                        />


                        <QuickStatisticCard
                            name="pendingCharge"
                            number={`$${500}`}
                        />
                    </div>
                </div>
            )}
        </>
    )
}