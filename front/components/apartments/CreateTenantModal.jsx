import { Button, FileInput, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useState } from "react";
import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";

/**
 * Represents an edition modal for the Setting's profile section.
 */

export default function CreateTenantModal({ onCloseModal, isModalOpen, onCreateSuccess, apartmentId, ownerId }) {
    const [name, setName] = useState("");
    const [fatherSurname, setFatherSurname] = useState("");
    const [motherSurname, setMotherSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [govIdImg, setGovIdImg] = useState([]);
    const [password, setPassword] = useState("");

    const loggedUserId = useUser((state) => state.loggedUser);
    var newUserId;

    async function handleSaveData() {
        const { data, error } = await supabase.auth.signUp({
            email: email.trim(),
            password: password.trim(),
            options: {
                data: {
                    user_type: "tenant",
                    name: name,
                    father_surname: fatherSurname,
                    mother_surname: motherSurname,
                    phone: phoneNumber,
                    email: email,
                    role: "tenant",
                    owner_id: ownerId,
                    apartment_id: apartmentId,
                }
            },
        });

        newUserId = data.user.id;

        if (error) throw error;

        uploadGovIdImages();
    };

    const handleFileChange = (e) => {
        const newFiles = [];
        for (let i = 0; i < e.target.files.length; i++) {
            newFiles.push(e.target.files[i]);
        };

        setGovIdImg(newFiles);
    };

    async function uploadGovIdImages() {
        try {
            const { data, error } = await supabase
                .storage
                .from("gov_id_images")
                .upload(`${newUserId}/govid`, govIdImg[0]);

            if (error) throw error;

            // An array of promises that upload files to the gov_id_images file bucket.
            const fileUploadPromises = Array.from(govIdImg).map(async (image, id) => {
                const { data, error } = await supabase
                    .storage
                    .from("gov_id_images")
                    .upload(`${newUserId}/govid${id}`, image);

                if (error) throw error;
            });

            await Promise.all(fileUploadPromises);

        } catch (error) {
            console.log("An error ocurred while uploading the files:", error)
        };

        onCreateSuccess();
    }

    return (
        <>
            <Modal show={isModalOpen} size="lg" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="space-y-6!">
                        <h3 className="text-2xl! font-semibold! tracking-tight text-gray-900 dark:text-white">Nueva cuenta para el arrendatario</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email">Nombre(s)</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Nombre(s)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password">Apellido paterno</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Apellido paterno"
                                value={fatherSurname}
                                onChange={(e) => setFatherSurname(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password">Apellido materno</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Apellido materno"
                                value={motherSurname}
                                onChange={(e) => setMotherSurname(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password">Número de teléfono</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="tel"
                                placeholder="Número de teléfono"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password">Correo electrónico</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="">Contraseña</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="file-input">Identificación oficial/Credencial de estudiante</Label>
                            </div>
                            <FileInput
                                id="file-input"
                                className="text-sm!"
                                placeholder="Subir archivos..."
                                onChange={handleFileChange}
                                required
                                max={2}
                                size="xs"
                                multiple
                                accept="image/png, image/jpeg"
                            />
                        </div>

                        <div className="w-full flex sm:flex-row flex-col gap-2">
                            <Button className="w-full text-sm! rounded-lg! px-4! py-2!" color={"alternative"} onClick={onCloseModal}>
                                Cancelar
                            </Button>
                            <Button className="w-full text-sm! rounded-lg! bg-sky-600 hover:bg-sky-700! px-4! py-2!" onClick={handleSaveData}>
                                Crear arrendatario
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}