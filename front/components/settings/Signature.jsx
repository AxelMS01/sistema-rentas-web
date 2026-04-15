import { Button } from "flowbite-react";
import SignatureCanvas from "react-signature-canvas";
import "./Signature.css";
import { useState, useRef } from "react";
import { CircleCheck, CircleX, Eraser, SquarePen } from "lucide-react";

export default function SignatureSection() {
    const signatureRef = useRef(null);
    const [isOnModify, setIsOnModify] = useState(false);
    const [signature, setSignature] = useState("");

    function handleSignatureSubmit() {
        const url = signatureRef.current.getTrimmedCanvas().toDataURL("/firma/png");
        setSignature(url);
        console.log(url);
    };

    function clearSignature() {
        signatureRef.current?.clear();
        setSignature(null);
    };

    function cancelEdition() {
        setIsOnModify(false);
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                <div className="header flex flex-col gap-2">
                    <h1 className="text-start font-semibold! text-2xl! tracking-tight">Firma para documentos</h1>
                    <p className="text-base font-normal text-slate-500 text-start">Revisa y/o edita tu firma, la cual será usada para firmar automáticamentente documentos como contratos y pagarés.</p>
                </div>
            </div>

            {isOnModify && (
                <div className="relative lg:w-sm h-70 border border-slate-200 bg-slate-100 rounded-lg!">
                    <Button onClick={clearSignature} color="alternative" size='xs' className='absolute top-3 right-3 text-xs! font-semibold! px-2 py-0.5! rounded-lg! flex flex-row gap-2 items-center'>
                        <Eraser size={16} />
                        Restablecer
                    </Button>

                    <SignatureCanvas
                        ref={signatureRef}
                        canvasProps={{
                            className: "signature-pad"
                        }}
                    />
                </div>
            )}

            {isOnModify && (
                <div className='flex md:flex-row md:w-auto w-full flex-col items-start self-start gap-2'>
                    <Button onClick={cancelEdition} size="sm" className='text-sm! w-full gap-2 rounded-md! py-0! text-nowrap' color="alternative">
                        <CircleX size={16} />
                        Cancelar edición
                    </Button>

                    <Button type="button" onClick={() => signatureRef.current.getTrimmedCanvas().toDataURL('image/png')} size="sm" className='text-sm! w-full text-nowrap gap-2 rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                        <CircleCheck size={16} />
                        Guardar firma
                    </Button>
                </div>
            )}

            {!isOnModify && (
                <Button type="button" onClick={() => setIsOnModify(true)} size="sm" className='text-sm! md:w-auto! w-full self-start text-nowrap gap-2 rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                    <SquarePen size={16} />
                    Editar mi firma
                </Button>
            )}
        </div>
    );
};