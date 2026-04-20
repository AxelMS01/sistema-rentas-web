import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";
import { useState, useEffect } from "react";
import { format, lastDayOfMonth } from "date-fns";
import { es } from "date-fns/locale";
import { MapPinHouse } from "lucide-react";

export default function HomeInfoCard() {
    const loggedTenantId = useUser((state) => state.loggedUser);
    const [cardInfo, setCardInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const date = new Date();
    const currentMonth = new Date().getMonth();
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const lastDay = lastDayOfMonth(date);

    useEffect(() => {
        async function fetchData() {
            try {
                const { data: apartmentData, error: apartmentError } = await supabase
                    .from("apartments")
                    .select("street, ext_num, division, postal_code")
                    .eq("tenant_id", loggedTenantId);

                if (apartmentError) throw error;

                console.log(apartmentData);

                const { data: contractData, error: contractError } = await supabase
                    .from("rentalcontracts")
                    .select("monthlyamount")
                    .eq("tenantid", loggedTenantId);

                if (contractError) throw error;

                const collectedInfo = {
                    address: apartmentData[0],
                    dueAmount: contractData[0].monthlyamount,
                    month: monthNames[currentMonth],
                    dueDate: format(lastDay, "PPP", { locale: es }),
                    status: "pending",
                };

                setCardInfo(collectedInfo);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    return (
        <>
            {!isLoading && (
                <>
                    <div className="w-full flex flex-row gap-2 py-2 px-2.5 border rounded-md items-center border-slate-200">
                        <MapPinHouse size={20} />

                        <p className="font-medium! text-sm! wrap-normal">{cardInfo.address.street} {cardInfo.address.ext_num}, {cardInfo.address.division}, {cardInfo.address.postal_code}</p>
                    </div>

                    <div className="flex sm:flex-row flex-col gap-2 sm:justify-between justify-start sm:items-center items-start">
                        <p className="text-sm text-slate-600">Monto total a pagar</p>
                        <p className="text-sm text-emerald-500 font-semibold">${cardInfo.dueAmount}</p>
                    </div>

                    <div className="flex sm:flex-row flex-col gap-2 sm:justify-between justify-start sm:items-center items-start">
                        <p className="text-sm text-slate-600">Mensualidad a pagar</p>
                        <p className="text-sm text-slate-900 font-medium">{cardInfo.month}</p>
                    </div>

                    <div className="flex sm:flex-row flex-col gap-2 sm:justify-between justify-start sm:items-center items-start">
                        <p className="text-sm text-slate-600">Fecha limite de pago</p>
                        <p className="text-sm text-slate-900 font-medium">{cardInfo.dueDate}</p>
                    </div>

                    <div className="flex sm:flex-row flex-col gap-2 sm:justify-between justify-start sm:items-center items-start">
                        <p className="text-sm text-slate-600">Estado del pago</p>
                        <p className="text-sm text-slate-900 font-medium">Pendiente</p>
                    </div>
                </>
            )}
        </>
    );
};
