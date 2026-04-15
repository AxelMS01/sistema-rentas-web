import { Button, Label, TextInput } from "flowbite-react";

export default function PaymentIntegration({
    card1,
    card2,
    card3
}) {
    return (
        <div className="flex flex-col gap-8! w-full">
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
                        value={card1}
                        placeholder="Número de tarjeta"
                    />
                </div>

                <div className="flex flex-col gap-2.5 items-start">
                    <Label className="text-sm text-slate-400 font-medium">Tarjeta 2</Label>
                    <TextInput
                        className="text-sm"
                        value={card1}
                        placeholder="Número de tarjeta"
                    />
                </div>

                <div className="flex flex-col gap-2.5 items-start">
                    <Label className="text-sm text-slate-400 font-medium">Tarjeta 3</Label>
                    <TextInput
                        className="text-sm"
                        value={card1}
                        placeholder="Número de tarjeta"
                    />
                </div>
            </div>

            <div className='flex sm:flex-row flex-col items-start self-start gap-2'>
                <Button onClick={() => ""} size="sm" className='text-sm! w-full rounded-md! py-0! text-nowrap' color="alternative">
                    Restablecer valores
                </Button>

                <Button type="button" onClick={() => ""} size="sm" className='text-sm! w-full text-nowrap rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                    Guardar cambios
                </Button>
            </div>
        </div>
    );
};