import { TextInput } from "flowbite-react";
import { CircleUser, House } from "lucide-react";
import FormStep from "./FormStep";

export default function StepOneContent({
    curp,
    setCurp,
    alternateStreet,
    setAlternateStreet,
    alternateExtNum,
    setAlternateExtNum,
    alternateDivision,
    setAlternateDivision,
}) {
    return (
        <>
            <div className='flex md:flex-row flex-col gap-4'>
                <FormStep
                    name="Datos personales faltantes"
                    stepNum={1}
                    icon={<CircleUser size={18} />}
                />
            </div>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Ingresa tu CURP</p>
                <TextInput
                    className='w-full text-sm'
                    placeholder='CURP'
                    value={curp}
                    onChange={(e) => setCurp(e.target.value)}
                    minLength={18}
                />
            </div>

            <div className='flex flex-row gap-2 items-center'>
                <House size={20} strokeWidth={2} />
                <p className='text-lg! font-semibold'>Ingresa una dirección alternativa</p>
            </div>

            <div className='flex flex-col gap-2 items-start'>
                <p className='text-sm font-medium! text-start'>Calle</p>
                <TextInput
                    className='w-full text-sm'
                    placeholder='Calle'
                    value={alternateStreet}
                    onChange={(e) => setAlternateStreet(e.target.value)}
                />
            </div>

            <div className='flex flex-col gap-2 items-start'>
                <p className='text-sm font-medium! text-start'>Número exterior</p>
                <TextInput
                    className='w-full text-sm'
                    placeholder='Número exterior'
                    value={alternateExtNum}
                    onChange={(e) => setAlternateExtNum(e.target.value)}
                />
            </div>

            <div className='flex flex-col gap-2 items-start'>
                <p className='text-sm font-medium! text-start'>Colonia o fraccionamiento</p>
                <TextInput
                    className='w-full text-sm'
                    placeholder='Colonia o fraccionamiento'
                    value={alternateDivision}
                    onChange={(e) => setAlternateDivision(e.target.value)}
                />
            </div>
        </>
    );
};