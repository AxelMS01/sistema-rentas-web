import { Select } from "flowbite-react";
import { useState, useMemo } from "react";
import useStatisticCardCalculations from "../../../utils/dashboard/statistic-cards-calculations";
import QuickStatisticCard from "../../../components/dashboard/QuickStatisticCard";

export default function NewDashboard() {
    const [isLoading, setIsLoading] = useState(false);
    useStatisticCardCalculations(3);

    return (
        <>
            {!isLoading && (
                <div className="w-full h-screen flex flex-col gap-6! lg:px-20! sm:px-16! px-8! py-10">
                    <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                        <div className="header flex flex-col gap-2">
                            <h1 className="text-start font-light fw-semibold tracking-tight">Dashboard</h1>
                            <p className="text-base font-normal text-slate-500 text-start">Consulta estadísticas e información importante de las rentas.</p>
                        </div>
                    </div>

                    <div className="w-full grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-6">
                        <QuickStatisticCard
                            name="monthlyEarnings"
                            number={`$${500}`}
                        />

                        <QuickStatisticCard
                            name="occupiedHousings"
                            number={500}
                            comparisonNumber={600}
                        />

                        <QuickStatisticCard
                            name="expiredBills"
                            number={`$${500}`}
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