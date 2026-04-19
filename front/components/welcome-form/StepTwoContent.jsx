import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TextInput } from "flowbite-react";

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
}) {
    return (
        <>
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
        </>
    )
}