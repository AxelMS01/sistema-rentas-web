import { Label, TextInput, Select, Button } from "flowbite-react";
import toaster, { Toaster } from "react-hot-toast";
import { useState } from "react";
import { supabase } from "../../config/supabase-client";
import useUser from "../../stores/user-store";

export default function Globals({
    chargeFee,
    minMonths
}) {
    // Divide the charge-fee in the 'type-value' format.
    const initialChargeFee = chargeFee.split("-");

    const [chargeType, setChargeType] = useState(initialChargeFee[0]);
    const [chargeVal, setChargeVal] = useState(initialChargeFee[1]);
    const [minimumMonths, setMinimumMonths] = useState(minMonths);

    const loggedUserId = useUser((state) => state.loggedUser);

    function restablishValues() {
        // Set the stateful variables to the values passed as parameters.
        setChargeType(initialChargeFee[0]);
        setChargeVal(initialChargeFee[1]);
        setMinimumMonths(minMonths);
    };

    async function onSaveChanges() {
        const newChargeFee = chargeType + "-" + chargeVal;
        const { error } = await supabase
            .from("owners")
            .update({
                charge_fee: newChargeFee,
                minimum_duration: minimumMonths
            })
            .eq("id", loggedUserId);

        if (error) throw error;

        toaster.success("¡Datos actualizados correctamente!")
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <Toaster />
            <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                <div className="header flex flex-col gap-2">
                    <h1 className="text-start font-semibold! text-2xl! tracking-tight">Ajustes globales</h1>
                    <p className="text-base font-normal text-slate-500 text-start">Configuraciones que se aplicarán globalmente para distintos elementos.</p>
                </div>
            </div>

            <div className="flex! lg:flex-row! flex-col! gap-6! w-full">
                <div className="w-full flex items-start gap-6 flex-col bg-white sm:p-6 p-4 border border-slate-200 rounded-xl!">
                    <h1 className="text-xl! font-semibold! tracking-tight text-slate-900">Cobros y Mora</h1>

                    <div className="flex flex-row gap-3">
                        <div className="flex flex-col items-start min-w-40">
                            <div className="mb-2 block">
                                <Label htmlFor="countries">Tipo de cargo</Label>
                            </div>
                            <Select
                                onChange={(e) => setChargeType(e.target.value)}
                                className="text-sm w-full"
                                id="charge-type"
                                required
                            >
                                <option value="percentage">Porcentaje</option>
                                <option value="fixed">Valor fjo</option>
                            </Select>
                        </div>

                        <div className="flex flex-col items-start">
                            <div className="mb-2 block">
                                <Label htmlFor="countries text-start!">Ingresa un valor</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="number"
                                placeholder="Valor"
                                value={chargeVal}
                                onChange={(e) => setChargeVal(e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                <div className="w-full! flex items-start gap-6 flex-col bg-white sm:p-6 p-4 border border-slate-200 rounded-xl!">
                    <h1 className="text-xl! font-semibold! tracking-tight text-slate-900">Duración mínima de contratos</h1>

                    <div className="flex flex-col items-start">
                        <div className="mb-2 block">
                            <Label htmlFor="countries text-start!">Número mínimo de meses</Label>
                        </div>
                        <TextInput
                            className="text-sm"
                            type="number"
                            placeholder="Valor"
                            value={minimumMonths}
                            onChange={(e) => setMinimumMonths(e.target.value)}
                        />
                    </div>
                </div>
            </div>


            <div className='flex sm:flex-row flex-col items-start self-start gap-2'>
                <Button onClick={restablishValues} size="sm" className='text-sm! w-full rounded-md! py-0! text-nowrap' color="alternative">
                    Restablecer valores
                </Button>

                <Button type="button" onClick={onSaveChanges} size="sm" className='text-sm! w-full text-nowrap rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                    Guardar cambios
                </Button>
            </div>
        </div>
    )
}