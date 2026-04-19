import { TextInput, Label } from 'flowbite-react';
import { useEffect, useRef, useState } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import "./SignatureCanvas.css";
import FormStep from '../../components/welcome-form/FormStep';
import { CircleUser, Eraser, Grid2X2Check, House } from 'lucide-react';
import { Button } from 'flowbite-react';
import useUser from '../../stores/user-store';
import SignatureCanvas from 'react-signature-canvas';
import { supabase } from "../../config/supabase-client";
import { useNavigate } from 'react-router-dom';
import Signature from "@uiw/react-signature/canvas";
import { useLocation } from 'react-router-dom';
import { DocumentoContrato } from '../../components/pdf-documents/Machotes/Contrato/Contrato';
import { PDFViewer } from '@react-pdf/renderer';

export default function WelcomeForm({ firstName }) {
    const location = useLocation().state;
    const loggedTenantId = useUser((state) => state.loggedUser);

    const [curp, setCurp] = useState("");
    // Inicializar los siguientes tres estados con la información cargada de la base de datos.
    const [name, setName] = useState(location.name);
    const [motherSurname, setMotherSurname] = useState(location.father_surname);
    const [fatherSurname, setFatherSurname] = useState(location.mother_surname);

    // Stateful variables for each element necessary for the contract.
    // There's no state for the tenant, since its information is contained in the 'location' object.
    const [contractInfo, setContractInfo] = useState();
    const [ownerInfo, setOwnerInfo] = useState();
    const [tenantInfo, setTenantInfo] = useState();
    const [guarantorInfo, setGuarantorInfo] = useState();
    const [apartmentInfo, setApartmentInfo] = useState();

    const [alternateStreet, setAlternateStreet] = useState("");
    const [alternateExtNum, setAlternateExtNum] = useState("");
    const [alternateDivision, setAlternateDivision] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const $canvas = useRef(null);

    useEffect(() => {
        // Fetch all the needed data for the contract.
        const fetchData = async () => {
            try {
                const { data: contractData, error: contractError } = await supabase
                    .from("rentalcontracts")
                    .select()
                    .eq("tenantid", location.id);

                if (contractError) throw error;
                setContractInfo(contractData[0]);

                // Variables for the rest of the tables.
                const ownerId = contractData[0].owner_id;
                const tenantId = contractData[0].tenantid;
                const guarantorId = contractData[0].guarantorid;
                const apartmentId = contractData[0].apartmentid;

                const { data: ownerData, error: ownerError } = await supabase
                    .from("owners")
                    .select()
                    .eq("id", ownerId);

                if (ownerError) throw error;
                setOwnerInfo(ownerData[0]);

                const { data: tenantData, error: tenantError } = await supabase
                    .from("tenants")
                    .select()
                    .eq("id", tenantId);

                if (tenantError) throw error;
                setTenantInfo(tenantData[0]);

                const { data: guarantorData, error: guarantorError } = await supabase
                    .from("guarantors")
                    .select()
                    .eq("id", guarantorId);

                if (guarantorError) throw error;
                setGuarantorInfo(guarantorData[0]);

                const { data: apartmentData, error: apartmentError } = await supabase
                    .from("apartments")
                    .select()
                    .eq("id", apartmentId);

                if (apartmentError) throw error;
                setApartmentInfo(apartmentData[0]);
            } catch (error) {
                console.log(error);
            } finally {
            };
        };

        fetchData();
    }, [])

    const navigate = useNavigate();

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

            const { error } = await supabase
                .from("tenants")
                .update({
                    is_first_time: false,
                    signature_url: signatureURL 
                })
                .eq("id", location.id);

            if (error) throw error;

            navigate("/home", { state: { isWelcomeCompleted: true } });
        } else {
            toast.error("¡La firma no puede quedar vacía!");
        };
    }

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
                    <div className='flex flex-col gap-4 items-start'>
                        <FormStep
                            name="Previsualización del contrato"
                            status={currentStep === 3 ? "active" : (currentStep === 2 ? "completed" : "normal")}
                            stepNum={currentStep}
                            icon={<Grid2X2Check size={18} />}
                        />

                        <p className='text-base text-slate-600'>La siguiente es una vista previa del contrato que será generado. Si estás de acuerdo con la información, por favor, pasa a firmarlo en el siguiente paso.</p>
                    </div>
                )}

                {currentStep === 4 && (
                    <div className='flex flex-col gap-4 items-start'>
                        <FormStep
                            name="Firma de los documentos"
                            status={currentStep === 4 ? "active" : (currentStep === 2 ? "completed" : "normal")}
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
                    )}

                    {currentStep === 2 && (
                        <>
                            <p className='text-lg font-semibold text-start'>¿Confirmas que estos datos son correctos?</p>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Tu(s) nombre(s)</p>
                                <TextInput
                                    className='w-full text-sm'
                                    placeholder='Nombre'
                                    value={location.name}
                                    onChange={(e) => setCurp(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Apellido materno</p>
                                <TextInput
                                    className='w-full text-sm'
                                    placeholder='Apellido materno'
                                    value={location.mother_surname}
                                    onChange={(e) => setMotherSurname(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Apellido paterno</p>
                                <TextInput
                                    className='w-full text-sm'
                                    placeholder='Apellido paterno'
                                    value={location.father_surname}
                                    onChange={(e) => setFatherSurname(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Inicio del contrato</p>
                                <TextInput
                                    className='w-full text-sm'
                                    disabled
                                    placeholder='Inicio'
                                    value={format(contractInfo.startdate, "PPP", { locale: es })}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Fin del contrato</p>
                                <TextInput
                                    className='w-full text-sm'
                                    disabled
                                    placeholder='Inicio'
                                    value={format(contractInfo.enddate, "PPP", { locale: es })}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Monto del arrendamiento</p>
                                <TextInput
                                    className='w-full text-sm'
                                    disabled
                                    placeholder='Nombre'
                                    value={"$" + contractInfo.depositamount + " pesos mensuales"}
                                />
                            </div>
                        </>
                    )}

                    {currentStep === 3 && (
                        <PDFViewer width={500} height={800}>
                            <DocumentoContrato
                                contractInfo={contractInfo}
                                ownerInfo={ownerInfo}
                                tenantInfo={location}
                                guarantorInfo={guarantorInfo}
                                apartmentInfo={apartmentInfo}
                            />
                        </PDFViewer>
                    )}

                    {currentStep === 4 && (
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

                        <Button type="button" onClick={currentStep === 2 ? (e) => onSubmitData(e) : (currentStep === 4 ? handleFinishForm : () => setCurrentStep(currentStep + 1))} className='text-sm! w-full text-nowrap rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                            {currentStep === 3 ? "Pasar a firmar" : (currentStep === 4 ? "Terminar" : "Avanzar al siguiente paso")}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};