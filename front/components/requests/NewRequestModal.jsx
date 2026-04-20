import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, FileInput } from "flowbite-react";
import { Datepicker, Textarea, } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";

export default function NewRequestModal({ isModalOpen, onCloseModal, onSave }) {
    const loggedUserId = useUser((state) => state.loggedUser);

    const [requestDesc, setRequestDesc] = useState("");
    const [media, setMedia] = useState([]);

    const handleFileChange = (e) => {
        const newFiles = [];
        for (let i = 0; i < e.target.files.length; i++) {
            newFiles.push(e.target.files[i]);
        };

        setMedia(newFiles);
    };

    async function onSubmitData() {
        if (!requestDesc || media.length === 0) {
            toast.error("Por favor, llena todos los campos del formulario.");
            return;
        };

        async function insertNewData() {
            try {
                const { data: tenantData, error: tenantError } = await supabase
                    .from("tenants")
                    .select("owner_id, apartment_id")
                    .eq("id", loggedUserId);

                if (tenantError) throw error;

                const { error } = await supabase
                    .from("maintenancerequests")
                    .insert({
                        apartmentid: tenantData[0].apartment_id,
                        tenantid: loggedUserId,
                        description: requestDesc,
                        owner_id: tenantData[0].owner_id,
                    });
                
                if (error) throw error;
            } catch (error) {
                console.log(error);
            };

            uploadProofMedia();
        };

        insertNewData();
    };

    async function uploadProofMedia() {
        try {
            // An array of promises that upload files to the gov_id_images file bucket.
            const fileUploadPromises = Array.from(media).map(async (element, id) => {
                const { data, error } = await supabase
                    .storage
                    .from("maintenancerequests")
                    .upload(`tenant-${loggedUserId}/maintenance-request`, element);

                if (error) throw error;
            });

            await Promise.all(fileUploadPromises);
        } catch (error) {
            console.log("An error ocurred:", error);
        } finally {
            onSave();
        };
    };

    return (
        <>
            <Toaster />
            <Modal show={isModalOpen} size="xl" onClose={onCloseModal} popup>
                <ModalHeader className="w-full p-4">
                    <p className="text-2xl! tracking-tight font-semibold">Crear nueva incidencia</p>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={onSubmitData} className='flex flex-col gap-4'>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="">Descripción del problema</Label>
                            </div>
                            <Textarea
                                rows={5}
                                className="text-sm!"
                                type="text"
                                placeholder="Ingresa una descripción"
                                value={requestDesc}
                                onChange={(e) => setRequestDesc(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="file-input">Archivos de prueba</Label>
                            </div>
                            <FileInput
                                id="file-input"
                                className="text-sm!"
                                placeholder="Subir archivos..."
                                onChange={handleFileChange}
                                required
                                size="xs"
                                multiple
                                accept="image/png, image/jpeg"
                            />
                        </div>

                        <div className="w-full flex sm:flex-row flex-col gap-2">
                            <Button className="w-full text-sm! rounded-lg! px-4! py-2!" color={"alternative"} onClick={onCloseModal}>
                                Cancelar
                            </Button>
                            <Button className="w-full text-sm! rounded-lg! bg-sky-600 hover:bg-sky-700! px-4! py-2!" onClick={onSubmitData}>
                                Crear incidencia
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
};