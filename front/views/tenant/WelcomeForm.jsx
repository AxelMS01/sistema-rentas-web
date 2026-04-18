import { TextInput, Label } from 'flowbite-react';
import { useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import "./SignatureCanvas.css";
import FormStep from '../../components/welcome-form/FormStep';
import { CircleUser, Eraser, Grid2X2Check, House } from 'lucide-react';
import { Button } from 'flowbite-react';
import SignatureCanvas from 'react-signature-canvas';
import { useNavigate } from 'react-router-dom';
import Signature from "@uiw/react-signature/canvas";
import { useLocation } from 'react-router-dom';

export default function WelcomeForm({ firstName }) {
    const location = useLocation().state;
    console.log(location);

    const [curp, setCurp] = useState("");
    // Inicializar los siguientes tres estados con la información cargada de la base de datos.
    const [name, setName] = useState(location.name);
    const [motherSurname, setMotherSurname] = useState(location.father_surname);
    const [fatherSurname, setFatherSurname] = useState(location.mother_surname);
    const [alternateStreet, setAlternateStreet] = useState("");
    const [alternateExtNum, setAlternateExtNum] = useState("");
    const [alternateDivision, setAlternateDivision] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const $canvas = useRef(null);

    const navigate = useNavigate();

    const contractDuration = "Del 31/04/2026 al 31/12/2026";
    const payment = 4000;

    function onSubmitData(e) {
        e.preventDefault;
        console.log($canvas.current?.canvas.toDataURL());

        if (!name || !motherSurname || !fatherSurname || !alternateStreet | !$canvas) {
            toast.error("¡Ningún campo del formulario puede quedarse vacío!");
            return;
        };

        console.log("Success");
        navigate("/home");

    };

    console.log(currentStep);

    return (
        <div className="w-full min-h-screen h-auto flex flex-col items-center justify-center gap-4! lg:px-20! sm:px-16! px-8! py-10 bg-sky-600">
            <Toaster />

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
                                    className='w-full text-sm'
                                    placeholder='CURP'
                                    value={curp}
                                    onChange={(e) => setCurp(e.target.value)}
                                    minLength={18}
                                />
                            </div>

                            <div className='flex flex-row gap-2 items-center'>
                                <House size={20} strokeWidth={2}/>
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
                    )}

                    {currentStep === 2 && (
                        <>
                            <p className='text-lg font-semibold text-start'>¿Confirmas que estos datos son correctos?</p>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Tu(s) nombre(s)</p>
                                <TextInput
                                    className='w-full text-sm'
                                    placeholder='Nombre'
                                    value={name}
                                    onChange={(e) => setCurp(e.target.value)}
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
                                <p className='text-sm font-medium!'>Duración del contrato</p>
                                <TextInput
                                    className='w-full text-sm'
                                    disabled
                                    placeholder='Nombre'
                                    value={contractDuration}
                                    onChange={(e) => setCurp(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Monto del arrendamiento</p>
                                <TextInput
                                    className='w-full text-sm'
                                    disabled
                                    placeholder='Nombre'
                                    value={"$" + payment + " pesos mensuales"}
                                    onChange={(e) => setCurp(e.target.value)}
                                />
                            </div>
                        </>
                    )}

                    {currentStep === 3 && (
                        <div className='flex flex-col gap-4 items-start justify-start'>
                            <p className='text-start text-sm! text-slate-600'>Por favor, dibuja tu firma en el siguiente lienzo, la cual será utilizada para firmar el contrato final.</p>

                            <div className='relative signature-container items-start border border-slate-200 rounded-xl bg-slate-50'>
                                <Button onClick={() => $canvas.current.clear()} color="alternative" size='xs' className='absolute z-999 top-3 right-3 text-xs! font-semibold! px-2 py-0.5! rounded-lg! flex flex-row gap-2 items-center'>
                                    <Eraser size={16} />
                                    Restablecer
                                </Button>

                                <Signature
                                    ref={$canvas}
                                    options={{
                                        smoothing: 0.46,
                                        thinning: 0.73,
                                        streamline: 0.5,
                                        easing: (t) => t,
                                        simulatePressure: true,
                                        last: true,
                                        start: {
                                            cap: true,
                                            taper: 0,
                                            easing: (t) => t,
                                        },
                                        end: {
                                            cap: true,
                                            taper: 0,
                                            easing: (t) => t,
                                        },
                                    }}
                                />
                            </div>

                            <p className='text-start text-sm! text-slate-600'>Si estás conforme con tu firma y estás seguro de que la información previa es correcta, ¡puedes terminar el formulario y entrar a tu sistema!</p>
                        </div>
                    )}

                    <div className='flex sm:flex-row flex-col w-full items-center gap-2'>
                        {currentStep > 1 && (
                            <Button onClick={() => setCurrentStep(currentStep - 1)} className='text-sm! w-full rounded-md! py-0!' color="alternative">
                                Regresar
                            </Button>
                        )}

                        <Button type="button" onClick={currentStep === 3 ? (e) => onSubmitData(e) : () => setCurrentStep(currentStep + 1)} className='text-sm! w-full text-nowrap rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                            {currentStep === 3 ? "Terminar" : "Avanzar al siguiente paso"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};