import { Checkbox, Label, TextInput } from "flowbite-react";
import { Grid2X2Check } from "lucide-react";
import FormStep from "./FormStep";

export default function StepTwoContent({
    name,
    setName,
    motherSurname,
    setMotherSurname,
    fatherSurname,
    setFatherSurname,
    startDate,
    endDate,
    paymentAmount,
    guarantorName,
    guarantorFatherSurname,
    guarantorMotherSurname,
    guarantorConfirmed,
    setGuarantorConfirmed,
}) {
    return (
        <>
            <div className='flex md:flex-row flex-col gap-4'>
                <FormStep
                    name="Confirmación de datos"
                    stepNum={2}
                    icon={<Grid2X2Check size={18} />}
                />
            </div>

            <p className='text-lg font-semibold text-start'>¿Confirmas que estos datos son correctos?</p>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Tu(s) nombre(s)</p>
                <TextInput
                    className='w-full text-sm'
                    placeholder='Nombre'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Apellido materno</p>
                <TextInput
                    className='w-full text-sm'
                    placeholder='Apellido materno'
                    value={motherSurname}
                    onChange={(e) => setMotherSurname(e.target.value)}
                />
            </div>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Apellido paterno</p>
                <TextInput
                    className='w-full text-sm'
                    placeholder='Apellido paterno'
                    value={fatherSurname}
                    onChange={(e) => setFatherSurname(e.target.value)}
                />
            </div>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Inicio del contrato</p>
                <TextInput
                    className='w-full text-sm'
                    disabled
                    placeholder='Inicio'
                    value={startDate}
                />
            </div>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Fin del contrato</p>
                <TextInput
                    className='w-full text-sm'
                    disabled
                    placeholder='Inicio'
                    value={endDate}
                />
            </div>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Monto del arrendamiento</p>
                <TextInput
                    className='w-full text-sm'
                    disabled
                    placeholder='Nombre'
                    value={paymentAmount}
                />
            </div>

            <div className="w-full h-px bg-slate-200 my-2" />

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-base font-semibold text-slate-900'>Datos del aval</p>
                <p className='text-sm text-slate-600 m-0'>Estos datos se tomaron del formulario con el que se generó el contrato.</p>
            </div>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Nombre(s) del aval</p>
                <TextInput
                    className='w-full text-sm'
                    disabled
                    value={guarantorName}
                />
            </div>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Apellido paterno del aval</p>
                <TextInput
                    className='w-full text-sm'
                    disabled
                    value={guarantorFatherSurname}
                />
            </div>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Apellido materno del aval</p>
                <TextInput
                    className='w-full text-sm'
                    disabled
                    value={guarantorMotherSurname}
                />
            </div>

            <div className="flex items-start gap-2 mt-1">
                <Checkbox
                    id="guarantorConfirmation"
                    checked={guarantorConfirmed}
                    onChange={() => setGuarantorConfirmed(!guarantorConfirmed)}
                />
                <Label htmlFor="guarantorConfirmation" className="text-sm text-slate-700">
                    Confirmo que los datos del aval son correctos.
                </Label>
            </div>
        </>
    )
}
