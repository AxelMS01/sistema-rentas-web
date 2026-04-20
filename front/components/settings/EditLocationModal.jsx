import { Button, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { useState } from "react";
import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";

/**
 * Represents an edition modal for the Setting's profile section.
 */

export default function EditLocationModal({ onCloseModal, isModalOpen, onEditSuccess }) {
    const [street, setStreet] = useState("");
    const [extNum, setExtNum]  = useState("");
    const [division, setDivision] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const loggedUserId = useUser((state) => state.loggedUser);

    async function handleSaveData() {
        const { error } = await supabase
            .from("owners")
            .update({
                street: street,
                ext_num: extNum,
                division: division,
                city: city,
                state: state
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
                                <Label>Calle</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Ej. Moreras"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label>Número exterior</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Número exterior"
                                value={extNum}
                                onChange={(e) => setExtNum(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label>Colonia o fraccionamiento</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Colonia o fraccionamiento"
                                value={division}
                                onChange={(e) => setDivision(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password">Ciudad</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Ciudad"
                                value={city}
                                onChange={(e) => setCity(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password">State</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Estado"
                                value={state}
                                onChange={(e) => setState(e.target.value)}
                                required
                            />
                        </div>

                        <div className="w-full flex sm:flex-row flex-col gap-2">
                            <Button className="w-full text-sm! rounded-lg! px-4! py-2!" color={"alternative"} onClick={onCloseModal}>
                                Cancelar
                            </Button>
                            <Button className="w-full text-sm! rounded-lg! bg-sky-600 hover:bg-sky-700! px-4! py-2!" onClick={handleSaveData}>
                                Guardar datos
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    );
};