import { Button, Label, TextInput } from "flowbite-react";
import toaster, { Toaster } from "react-hot-toast";
import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";
import { useState } from "react";

export default function PaymentIntegration({
    card1
}) {
    const loggedUserId = useUser((state) => state.loggedUser);
    const [card1Val, setCard1Val] = useState(card1);

    async function onSaveChanges() {
        const { error } = await supabase
            .from("owners")
            .update({
                card1: card1
            })
            .eq("id", loggedUserId);

        if (error) throw error;

        toaster.success("¡Datos de pago guardados!");
    };

    return (
        <div className="flex flex-col gap-8! w-full">
            <Toaster />
            <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                <div className="header flex flex-col gap-2">
                    <h1 className="text-start font-semibold! text-2xl! tracking-tight">Integración de pagos</h1>
                    <p className="text-base font-normal text-slate-500 text-start">Configura aquí tus tarjetas de crédito para usarlas en los procesos del sistema.</p>
                </div>
            </div>

            <div className="flex flex-row gap-10 flex-wrap items-start">
                <div className="flex flex-col gap-2.5 items-start">
                    <Label className="text-sm text-slate-400 font-medium">Tarjeta 1</Label>
                    <TextInput
                        className="text-sm"
                        value={card1Val}
                        onChange={(e) => setCard1Val(e.target.value)}
                        placeholder="Número de tarjeta"
                    />
                </div>
            </div>

            <div className='flex sm:flex-row flex-col items-start self-start gap-2'>
                <Button type="button" onClick={onSaveChanges} size="sm" className='text-sm! w-full text-nowrap rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                    Guardar cambios
                </Button>
            </div>
        </div>
    );
};