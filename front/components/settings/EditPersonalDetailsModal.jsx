import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useState } from "react";
import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";

/**
 * Represents an edition modal for the Setting's profile section.
 */

export default function EditPersonalDetails({ onCloseModal, isModalOpen, onEditSuccess }) {
    const [name, setName] = useState("");
    const [fatherSurname, setFatherSurname] = useState("");
    const [motherSurname, setMotherSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [curp, setCurp] = useState("");

    const loggedUserId = useUser((state) => state.loggedUser);

    async function handleSaveData() {
        const { error } = await supabase
            .from("owners")
            .update({
                name: name,
                father_surname: fatherSurname,
                mother_surname: motherSurname,
                phone: phoneNumber,
                email: email,
                governmentid: curp
            })
            .eq("id", loggedUserId);

        if (error) throw error;

        onEditSuccess();
    };

    return (
        <>
            <Modal show={isModalOpen} size="md" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="space-y-6!">
                        <h3 className="text-2xl! font-semibold! tracking-tight text-gray-900 dark:text-white">Editar detalles personales</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email">Nombre(s)</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Tu(s) nombre(s)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
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
                                <Label htmlFor="password">CURP</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="CURP a 18 dígitos"
                                value={curp}
                                onChange={(e) => setCurp(e.target.value)}
                                required
                            />
                        </div>

                        <div className="w-full flex sm:flex-row flex-col gap-2">
                            <Button className="w-full text-sm! rounded-lg! px-4! py-2!" color={"alternative"} onClick={onCloseModal}>
                                Cancelar
                            </Button>
                            <Button className="w-full text-sm! rounded-lg! bg-sky-600 hover:bg-sky-700! px-4! py-2!" onClick={handleSaveData}>
                                Guardar contrato
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}