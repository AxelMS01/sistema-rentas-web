import { useEffect, useState } from "react";
import { Button, FileInput, Label, Modal, ModalBody, ModalHeader, TextInput } from "flowbite-react";
import { supabase } from "../../config/supabase-client";
import toast, { Toaster } from "react-hot-toast";


export default function NewApartmentModal({
    onCloseModal,
    isModalOpen,
    onCreateSuccess,
    ownerId,
    onEditData,
    isOnEdit,
}) {
    const [apartmentName, setApartmentName] = useState(isOnEdit ? onEditData.name : "");
    const [street, setStreet] = useState(isOnEdit ? onEditData.street : "");
    const [extNum, setExtNum] = useState(isOnEdit ? onEditData.ext_num : "");
    const [intNum, setIntNum] = useState(isOnEdit ? onEditData.int_num : "");
    const [division, setDivision] = useState(isOnEdit ? onEditData.division : "");
    const [postalCode, setPostalCode] = useState(isOnEdit ? onEditData.postal_code : "");
    const [city, setCity] = useState(isOnEdit ? onEditData.city : "");
    const [state, setState] = useState(isOnEdit ? onEditData.state : "");

    useEffect(() => {
        if (isOnEdit) {
            setApartmentName(onEditData.name);
            setStreet(onEditData.street);
            setExtNum(onEditData.ext_num);
            setIntNum(onEditData.int_num);
            setDivision(onEditData.division);
            setPostalCode(onEditData.postal_code);
            setCity(onEditData.city);
            setState(onEditData.state);
        }
    }, [onEditData]);

    async function handleSaveData() {
        try {
            const { error } = await supabase
                .from("apartments")
                .insert({
                    ownerid: ownerId,
                    name: apartmentName,
                    city: city,
                    state: state,
                    street: street,
                    postal_code: postalCode,
                    division: division,
                    ext_num: extNum,
                    int_num: intNum
                })

            if (error) throw error;
        } catch (error) {
            console.log(error);
            toast.error("Hubo un error al registrar la vivienda.");
        } finally {
            onCreateSuccess();
        };
    };

    async function handleEditData(apartmentId) {
        try {
            const { error } = await supabase
                .from("apartments")
                .update({
                    ownerid: ownerId,
                    name: apartmentName,
                    city: city,
                    state: state,
                    street: street,
                    postal_code: postalCode,
                    division: division,
                    ext_num: extNum,
                    int_num: intNum
                })
                .eq("ownerid", ownerId)
                .eq("id", onEditData.id);

            if (error) throw error;
        } catch (error) {
            console.log(error);
            toast.error("Hubo un error al editar la vivienda.");
        } finally {
            onCreateSuccess();
        };
    };

    return (
        <>
            <Modal show={isModalOpen} size="lg" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="space-y-6!">
                        <h3 className="text-2xl! font-semibold! tracking-tight text-gray-900 dark:text-white">{onEditData ? "Editar vivienda" : "Crear una vivienda"}</h3>
                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="email">Nombre de la vivienda</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Nombre de la vivienda"
                                value={apartmentName}
                                onChange={(e) => setApartmentName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="password">Calle</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Calle"
                                value={street}
                                onChange={(e) => setStreet(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-row w-full gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password">Número exterior</Label>
                                </div>
                                <TextInput
                                    className="text-sm"
                                    type="text"
                                    placeholder="###"
                                    value={extNum}
                                    onChange={(e) => setExtNum(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password">Número interior (opcional)</Label>
                                </div>
                                <TextInput
                                    className="text-sm"
                                    type="text"
                                    placeholder="###"
                                    value={intNum}
                                    onChange={(e) => setIntNum(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="">Colonia o Fraccionamiento</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Colonia o Fraccionamiento"
                                value={division}
                                onChange={(e) => setDivision(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <Label htmlFor="">Código postal</Label>
                            </div>
                            <TextInput
                                className="text-sm"
                                type="text"
                                placeholder="Colonia o Fraccionamiento"
                                value={postalCode}
                                onChange={(e) => setPostalCode(e.target.value)}
                                required
                            />
                        </div>

                        <div className="flex flex-row w-full gap-4">
                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password">Ciudad</Label>
                                </div>
                                <TextInput
                                    className="text-sm"
                                    type="text"
                                    placeholder="###"
                                    value={city}
                                    onChange={(e) => setCity(e.target.value)}
                                    required
                                />
                            </div>

                            <div>
                                <div className="mb-2 block">
                                    <Label htmlFor="password">Estado</Label>
                                </div>
                                <TextInput
                                    className="text-sm"
                                    type="text"
                                    placeholder="###"
                                    value={state}
                                    onChange={(e) => setState(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="w-full flex sm:flex-row flex-col gap-2">
                            <Button className="w-full text-sm! rounded-lg! px-4! py-2!" color={"alternative"} onClick={onCloseModal}>
                                Cancelar
                            </Button>
                            <Button className="w-full text-sm! rounded-lg! bg-sky-600 hover:bg-sky-700! px-4! py-2!" onClick={onEditData ? handleEditData : handleSaveData}>
                                {onEditData ? "Guardar cambios" : "Crear vivienda"}
                            </Button>
                        </div>
                    </div>
                </ModalBody>
            </Modal>
        </>
    )
}