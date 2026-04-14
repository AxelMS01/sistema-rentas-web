import { TextInput, Label } from 'flowbite-react';
import { useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import FormStep from '../../components/welcome-form/FormStep';
import { CircleUser, Grid2X2Check } from 'lucide-react';
import { Button } from 'flowbite-react';
import CustomButton from '../../components/Button';

export default function WelcomeForm({ firstName }) {
    const [curp, setCurp] = useState("");
    const [name, setName] = useState("");
    const [motherSurname, setMotherSurname] = useState("");
    const [fatherSurname, setFatherSurname] = useState("");
    const [alternateAddress, setAlternateAddress] = useState("");
    const [currentStep, setCurrentStep] = useState(1);

    const contractDuration = "Del 31/04/2026 al 31/12/2026";
    const payment = 4000;

    function onSubmitData() {

    }

    return (
        <div className="w-full min-h-screen h-auto flex flex-col items-center justify-center gap-4! lg:px-20! sm:px-16! px-8! py-10 bg-linear-to-bl from-sky-500 to-sky-600">
            <div className="form-content flex flex-col max-w-xl w-auto px-8 py-12 bg-white rounded-xl gap-4">
                <div className="welcome-message flex flex-col gap-1 items-start">
                    <h1 className="text-2xl! font-semibold!">¡Bienvenido, {firstName}</h1>
                    <p className="text-slate-600 text-start">Para empezar a usar el sistema, por favor, completa el siguiente formulario para terminar de generar tu contrato.</p>
                </div>

                {currentStep === 1 && (
                    <div className='flex md:flex-row flex-col gap-4'>
                        <FormStep
                            name="Datos personales faltantes"
                            status={currentStep === 1 ? "active" : (currentStep === 2 ? "completed" : "normal")}
                            stepNum={currentStep}
                            icon={<CircleUser size={18} />}
                        />
                    </div>
                )}

                {currentStep === 2 && (
                    <div className='flex md:flex-row flex-col gap-4'>
                        <FormStep
                            name="Confirmación de datos"
                            status={currentStep === 2 ? "active" : (currentStep === 2 ? "completed" : "normal")}
                            stepNum={currentStep}
                            icon={<Grid2X2Check size={18} />}
                        />
                    </div>
                )}

                {currentStep === 3 && (
                    <div className='flex md:flex-row flex-col gap-4'>
                        <FormStep
                            name="Creación de firma"
                            status={currentStep === 3 ? "active" : (currentStep === 2 ? "completed" : "normal")}
                            stepNum={currentStep}
                            icon={<Grid2X2Check size={18} />}
                        />
                    </div>
                )}

                <form onSubmit={onSubmitData} className='flex flex-col gap-4'>
                    {currentStep === 1 && (
                        <>
                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Ingresa tu CURP</p>
                                <TextInput
                                    className='w-full'
                                    placeholder='CURP'
                                    value={curp}
                                    onChange={(e) => setCurp(e.target.value)}
                                    minLength={18}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start'>
                                <p className='text-sm font-medium! text-start'>Dirección de vivienda alternativa</p>
                                <TextInput
                                    className='w-full'
                                    placeholder='Calle, número exterior y colonia'
                                    value={alternateAddress}
                                    onChange={(e) => setAlternateAddress(e.target.value)}
                                    minLength={18}
                                />
                            </div>
                        </>
                    )}

                    {currentStep === 2 && (
                        <>
                            <p className='text-lg font-semibold text-start'>¿Confirmas que estos datos son correctos?</p>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Tu(s) nombre(s)</p>
                                <TextInput
                                    className='w-full'
                                    placeholder='Nombre'
                                    value={name}
                                    onChange={(e) => setCurp(e.target.value)}
                                    minLength={18}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Apellido materno</p>
                                <TextInput
                                    className='w-full'
                                    placeholder='Nombre'
                                    value={name}
                                    onChange={(e) => setCurp(e.target.value)}
                                    minLength={18}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Apellido paterno</p>
                                <TextInput
                                    className='w-full'
                                    placeholder='Nombre'
                                    value={name}
                                    onChange={(e) => setCurp(e.target.value)}
                                    minLength={18}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Duración del contrato</p>
                                <TextInput
                                    className='w-full'
                                    disabled
                                    placeholder='Nombre'
                                    value={contractDuration}
                                    onChange={(e) => setCurp(e.target.value)}
                                    minLength={18}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Monto del arrendamiento</p>
                                <TextInput
                                    className='w-full'
                                    disabled
                                    placeholder='Nombre'
                                    value={"$" + payment + " pesos mensuales"}
                                    onChange={(e) => setCurp(e.target.value)}
                                    minLength={18}
                                />
                            </div>
                        </>
                    )}

                    {currentStep === 3 && (
                        /* Lienzo para firma aquí */

                        <>

                        </>
                    )}

                    <div className='flex sm:flex-row flex-col w-full items-center gap-2'>
                        {currentStep > 1 && (
                            <Button onClick={() => setCurrentStep(currentStep - 1)} className='text-sm! w-full rounded-md! py-0!' color="alternative">
                                Regresar
                            </Button>
                        )}

                        <Button type={currentStep > 3 ? "submit" : "button"} onClick={currentStep != 3 ? () => setCurrentStep(currentStep + 1) : () => ""} className='text-sm! w-full text-nowrap rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                            {currentStep === 3 ? "Terminar" : "Avanzar al siguiente paso"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};