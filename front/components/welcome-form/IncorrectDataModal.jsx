
import { Button, Label, Modal, ModalBody, ModalHeader, Textarea, Select } from "flowbite-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";
import { AlertTriangle } from "lucide-react";

export default function IncorrectDataModal({ isModalOpen, onCloseModal, contractId, tenantId, ownerId }) {
    const [errDesc, setErrDesc] = useState("");
    const navigate = useNavigate();

    async function onSubmitComments() {
        const { error } = await supabase
            .from("notifications")
            .insert({
                tenantid: tenantId,
                ownerid: ownerId,
                type: "rentalcontracts",
                title: "Solicitud de corrección de datos",
                description: `El arrendatario solicitó una corrección de sus datos en el contrato ${contractId}`,
                additional_details: errDesc
            });

        if (error) throw error;

        navigate("/", {state: {
            welcomeFormErr: "¡Se notificó al arrendatario de la corrección!",
            welcomeFormErrDesc: "Se pondrá en contato contigo una vez la información haya sido actualizada.",
        }});
    }

    return (
        <>
            <Modal show={isModalOpen} size="xl" onClose={onCloseModal} popup>
                <ModalHeader className="p-4">
                    <p className="text-2xl! tracking-tight font-semibold">Reportar datos incorrectos</p>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={onSubmitComments} className='flex flex-col gap-4'>
                        <div className='flex flex-col gap-3 items-start text-start'>
                            <p className='text-sm font-medium! text-slate-600'>Por favor, describe los datos que encontraste incorrectos para notificar al propietario.</p>
                            <Textarea
                                className='w-full text-sm!'
                                placeholder='¿Qué hay de incorrecto en tus datos?'
                                value={errDesc}
                                onChange={(e) => setErrDesc(e.target.value)}
                            />
                        </div>

                        <div className="w-full flex sm:flex-row flex-col gap-2">
                            <Button className="w-full text-sm! rounded-lg! px-4! py-2!" color={"alternative"} onClick={onCloseModal}>
                                Cancelar
                            </Button>
                            <Button className="w-full text-sm! rounded-lg! bg-sky-600 hover:bg-sky-700! px-4! py-2!" onClick={onSubmitComments}>
                                Enviar comentarios
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
};