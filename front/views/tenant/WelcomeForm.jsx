import { TextInput, Label, Checkbox } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import "./SignatureCanvas.css";
import FormStep from '../../components/welcome-form/FormStep';
import { CircleUser, Eraser, Grid2X2Check, House, TriangleAlert } from 'lucide-react';
import { Button } from 'flowbite-react';
import useUser from '../../stores/user-store';
import { supabase } from "../../config/supabase-client";
import { useNavigate } from 'react-router-dom';
import Signature from "@uiw/react-signature/canvas";
import { useLocation } from 'react-router-dom';
import { DocumentoContrato } from '../../components/pdf-documents/Machotes/Contrato/Contrato';
import { PDFViewer } from '@react-pdf/renderer';
import StepOneContent from '../../components/welcome-form/StepOneContent';
import StepTwoContent from '../../components/welcome-form/StepTwoContent';
import IncorrectDataModal from '../../components/welcome-form/IncorrectDataModal';
import useContractData from '../../lib/useContractData';

export default function WelcomeForm({ firstName }) {
    const location = useLocation().state;
    const loggedTenantId = useUser((state) => state.loggedUser);

    const [curp, setCurp] = useState("");
    // Inicializar los siguientes tres estados con la información cargada de la base de datos.
    const [name, setName] = useState(location.name);
    const [motherSurname, setMotherSurname] = useState(location.father_surname);
    const [fatherSurname, setFatherSurname] = useState(location.mother_surname);
    const [incorrectDataModal, setIncorrectDataModal] = useState();
    const [signAuthorization, setSignAuthorization] = useState(false);
    const [phoneNumber, setPhoneNumber] = useState("");

    const [alternateStreet, setAlternateStreet] = useState("");
    const [alternateExtNum, setAlternateExtNum] = useState("");
    const [alternateDivision, setAlternateDivision] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const $canvas = useRef(null);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();

    // Fetch the necessary contract's data using the created hook.
    var {
        isDataLoading,
        contractInfo,
        ownerInfo,
        tenantInfo,
        guarantorInfo,
        apartmentInfo
    } = useContractData(location.id, "");

    if (!contractInfo) {
        navigate("/", {
            state: {
                welcomeFormErr: "No hay un contrato creado",
                welcomeFormErrDesc: "Tu arrendador no ha generado un contrato en su sistema aún. Por favor, espera a que lo haya creado."
            }
        })
    };

    async function onSubmitData(e) {
        e.preventDefault;

        if (!curp || !name || !motherSurname || !fatherSurname || !alternateStreet || !alternateExtNum || !alternateDivision) {
            toast.error("¡Ningún campo del formulario puede quedarse vacío!");
            return;
        };

        const { error } = await supabase
            .from("tenants")
            .update({
                name: name,
                governmentid: curp,
                father_surname: fatherSurname,
                mother_surname: motherSurname,
                alt_street: alternateStreet,
                alt_ext_num: alternateExtNum,
                alt_division: alternateDivision
            })
            .eq("id", loggedTenantId);

        if (error) throw error;

        setCurrentStep(currentStep + 1);
    };

    async function handleFinishForm() {
        if ($canvas.current) {
            const signatureURL = $canvas.current.canvas.toDataURL();

            // Update the tenant's first time status and their signature URL.
            const { error: tenantError } = await supabase
                .from("tenants")
                .update({
                    is_first_time: false,
                    signature_url: signatureURL
                })
                .eq("id", location.id);

            if (tenantError) throw tenantError;

            // Update the contract's status to mark it as active.
            const { error: contractError } = await supabase
                .from("rentalcontracts")
                .update({
                    status: "active"
                })
                .eq("id", contractInfo.id);

            if (contractError) throw contractError;

            // Finally, update the apartment's status to mark it as occupied.
            const { erorr: apartmentError } = await supabase
                .from("apartments")
                .update({ status: "OCCUPIED" })
                .eq("id", apartmentInfo.id);

            if (apartmentError) throw apartmentError;

            navigate("/home", { state: { isWelcomeCompleted: true } });
        } else {
            toast.error("¡La firma no puede quedar vacía!");
        };
    };

    async function handleIncorrectData() {
        const { error } = await supabase
            .from("notifications")
            .insert({
                type: "rentalcontracts",
                tenantid: location.id,
                ownerid: ownerInfo.id,
                title: "Información marcada como incorrecta",
                description: `El arrendador ${location.name} ${location.father_surname} marcó como incorrecta la información `
            })
        navigate("/home", { state: { welcomeFormErr: "Le notificaremos al arrendador que hubo un error. ¡Gracias!" } })
    };

    return (
        <>
            {!isDataLoading && (
                <div className="w-full min-h-screen h-auto flex flex-col items-center justify-center gap-4! lg:px-20! sm:px-16! px-8! py-10 bg-sky-600">
                    <Toaster />

                    <IncorrectDataModal isModalOpen={incorrectDataModal} onCloseModal={() => setIncorrectDataModal(false)} ownerId={ownerInfo.id} tenantId={tenantInfo.id} />

                    <div className="form-content flex flex-col max-w-xl w-auto bg-white rounded-xl gap-8">
                        <div className="welcome-message flex flex-col gap-1 items-start p-8 border-b border-b-slate-200">
                            <h1 className="text-2xl! font-semibold!">¡Bienvenido, {firstName}</h1>
                            <p className="text-slate-600 text-start">Para empezar a usar el sistema, por favor, completa el siguiente formulario para terminar de generar tu contrato.</p>
                        </div>

                        <form onSubmit={onSubmitData} className={`flex flex-col gap-4 sm:px-8 px-6 sm:pb-8 pb-6 pt-0 ${currentStep != 3 ? "max-h-96" : "h-auto"} overflow-y-scroll`}>
                            {currentStep === 1 && (
                                <StepOneContent
                                    curp={curp}
                                    setCurp={(e) => setCurp(e)}
                                    alternateStreet={alternateStreet}
                                    setAlternateStreet={(e) => setAlternateStreet(e)}
                                    alternateExtNum={alternateExtNum}
                                    setAlternateExtNum={(e) => setAlternateExtNum(e)}
                                    alternateDivision={alternateDivision}
                                    setAlternateDivision={(e) => setAlternateDivision(e)}
                                />
                            )}

                            {currentStep === 2 && (
                                <StepTwoContent
                                    name={name}
                                    setName={(e) => setName(e)}
                                    motherSurname={motherSurname}
                                    setMotherSurname={(e) => setMotherSurname(e)}
                                    fatherSurname={fatherSurname}
                                    setFatherSurname={(e) => setFatherSurname(e)}
                                    startDate={format(contractInfo.startdate, "PPP", { locale: es })}
                                    endDate={format(contractInfo.enddate, "PPP", { locale: es })}
                                    paymentAmount={"$" + contractInfo.depositamount + " pesos mensuales"}
                                />
                            )}

                            {currentStep === 3 && (
                                <>
                                    <div className='flex flex-col gap-4 items-start'>
                                        <FormStep
                                            name="Previsualización del contrato"
                                            status={currentStep === 3 ? "active" : (currentStep === 2 ? "completed" : "normal")}
                                            stepNum={currentStep}
                                            icon={<Grid2X2Check size={18} />}
                                        />

                                        <p className='text-base text-slate-600'>La siguiente es una vista previa del contrato que será generado. Si estás de acuerdo con la información, por favor, pasa a firmarlo en el siguiente paso.</p>
                                    </div>

                                    <PDFViewer width={500} height={800}>
                                        <DocumentoContrato
                                            contractInfo={contractInfo}
                                            ownerInfo={ownerInfo}
                                            tenantInfo={location}
                                            guarantorInfo={guarantorInfo}
                                            apartmentInfo={apartmentInfo}
                                        />
                                    </PDFViewer>
                                </>
                            )}

                            {currentStep === 4 && (
                                <>
                                    <div className='flex flex-col gap-4 items-start'>
                                        <FormStep
                                            name="Firma de los documentos"
                                            status={currentStep === 4 ? "active" : (currentStep === 2 ? "completed" : "normal")}
                                            stepNum={currentStep}
                                            icon={<Grid2X2Check size={18} />}
                                        />
                                    </div>

                                    <div className='flex flex-col gap-4 items-start justify-start'>
                                        <p className='text-start text-sm! text-slate-800'>Por favor, dibuja tu firma en el siguiente lienzo, la cual será utilizada para firmar el contrato final.</p>

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

                                        <div className="flex items-center gap-2">
                                            <Checkbox checked={signAuthorization} onChange={() => setSignAuthorization(!signAuthorization)} id="promotion" />
                                            <Label htmlFor="promotion">Acepto que mi firma también sea usada en los pagarés del arrendamiento.</Label>
                                        </div>
                                    </div>
                                </>
                            )}
                        </form>

                        <div className='px-8 pb-8 pt-0 flex flex-col gap-4'>
                            <div className='flex sm:flex-row flex-col w-full items-center gap-2'>
                                {currentStep > 1 && (
                                    <Button onClick={() => setCurrentStep(currentStep - 1)} className='text-sm! w-full rounded-md! py-0!' color="alternative">
                                        Regresar
                                    </Button>
                                )}

                                <Button disabled={currentStep === 4 && !signAuthorization} type="button" onClick={currentStep === 2 ? (e) => onSubmitData(e) : (currentStep === 4 ? handleFinishForm : () => setCurrentStep(currentStep + 1))} className='text-sm! w-full text-nowrap rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                                    {currentStep === 3 ? "Pasar a firmar" : (currentStep === 4 ? "Terminar" : "Avanzar al siguiente paso")}
                                </Button>
                            </div>

                            {currentStep === 2 && (
                                <button type='button' onClick={() => setIncorrectDataModal(true)} className='text-sm! text-start text-nowrap font-medium flex flex-row gap-2 items-center justify-center text-sky-600 hover:text-sky-800 cursor-pointer'>
                                    <TriangleAlert size={18} />
                                    Hay datos incorrectos en este paso
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};