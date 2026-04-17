import { Button, Toast } from "flowbite-react";
import SignaturePad from "react-signature-canvas";
import toast, { Toaster } from "react-hot-toast";
import "./Signature.css";
import Signature from "@uiw/react-signature/canvas";
import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";
import { useState, useRef } from "react";
import { CircleCheck, CircleX, Eraser, SquarePen } from "lucide-react";

export default function SignatureSection({ defaultSignUrl, onUpdateSuccess }) {
    const $canvas = useRef(null);
    const [isOnModify, setIsOnModify] = useState(false);
    const [signature, setSignature] = useState("");
    const loggedUserId = useUser((state) => state.loggedUser);

    async function updateSignature(signatureUrl) {
        const { error } = await supabase
            .from("owners")
            .update({ signature_url: signatureUrl })
            .eq("id", loggedUserId);

        if (error) throw error;

        toast.success("¡Firma actualizada!");
        setIsOnModify(false);

        onUpdateSuccess();
    }

    function handleSignatureSubmit() {
        if ($canvas.current) {
            const signatureURL = $canvas.current.canvas.toDataURL();
            updateSignature(signatureURL);
        } else {
            toast.error("¡La firma no puede quedar vacía!");
        };
    };

    function clearSignature() {
        $canvas.current.clear();
        setSignature(null);
    };

    function cancelEdition() {
        setIsOnModify(false);
    }

    return (
        <div className="flex flex-col gap-4 w-full">
            <Toaster />
            <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                <div className="header flex flex-col gap-2">
                    <h1 className="text-start font-semibold! text-2xl! tracking-tight">Firma para documentos</h1>
                    <p className="text-base font-normal text-slate-500 text-start">Revisa y/o edita tu firma, la cual será usada para firmar automáticamentente documentos como contratos y pagarés.</p>
                </div>
            </div>

            {isOnModify && (
                <div className="flex flex-col gap-4 items-start">
                    <div className="relative border border-slate-200 bg-slate-100 rounded-lg!">
                        <Button onClick={clearSignature} color="alternative" size='xs' className='absolute top-3 z-999 right-3 text-xs! font-semibold! px-2 py-0.5! rounded-lg! flex flex-row gap-2 items-center'>
                            <Eraser size={16} />
                            Borrar
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

                    <div className='flex md:flex-row md:w-auto w-full flex-col items-start self-start gap-2'>
                        <Button onClick={cancelEdition} size="sm" className='text-sm! w-full gap-2 rounded-md! py-0! text-nowrap' color="alternative">
                            <CircleX size={16} />
                            Cancelar edición
                        </Button>

                        <Button type="button" onClick={handleSignatureSubmit} size="sm" className='text-sm! w-full text-nowrap gap-2 rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                            <CircleCheck size={16} />
                            Guardar firma
                        </Button>
                    </div>
                </div>
            )}

            {!isOnModify && (
                <div className="flex flex-col gap-6">
                    <img className="sm:max-w-96 sm:max-h-70 border border-slate-200 rounded-lg" src={defaultSignUrl} />

                    <Button type="button" onClick={() => setIsOnModify(true)} size="sm" className='text-sm! md:w-auto! w-full self-start text-nowrap gap-2 rounded-md! py-0! bg-sky-600 hover:bg-sky-700!' color="default">
                        <SquarePen size={16} />
                        Editar mi firma
                    </Button>
                </div>
            )}
        </div>
    );
};