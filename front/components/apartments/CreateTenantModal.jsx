import { Button, Modal, ModalBody, ModalHeader } from "flowbite-react";
import { useState } from "react";
import toast from "react-hot-toast";
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
    const [ineFront, setIneFront] = useState(null);
    const [ineBack, setIneBack] = useState(null);
    const [password, setPassword] = useState("");

    async function handleSaveData() {
        if (!name.trim() || !fatherSurname.trim() || !motherSurname.trim() || !phoneNumber.trim() || !email.trim() || !password.trim()) {
            toast.error("Completa todos los campos obligatorios.");
            return;
        }

        if (password.trim().length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        if (!ineFront || !ineBack) {
            toast.error("Por favor, sube la foto del frente y del reverso de la identificación.");
            return;
        }

        try {
            const { error: newUserError } = await supabase.auth.signUp({
                email: email.trim(),
                password: password.trim(),
                options: {
                    data: {
                        user_type: "tenant",
                        name: name.trim(),
                        father_surname: fatherSurname.trim(),
                        mother_surname: motherSurname.trim(),
                        phone: phoneNumber.trim(),
                        email: email.trim(),
                        role: "tenant",
                        owner_id: ownerId,
                        apartment_id: apartmentId,
                    }
                },
            });

            if (newUserError) throw newUserError;

            const { data: tentantTableInfo, error: tenantError } = await supabase
                .from("tenants")
                .select("id")
                .eq("owner_id", ownerId)
                .eq("apartment_id", apartmentId);

            if (tenantError) throw tenantError;

            const tableTenantId = tentantTableInfo?.[0]?.id;
            if (!tableTenantId) {
                throw new Error("No se pudo encontrar el arrendatario recien creado.");
            }

            const { error: updateApartmentError } = await supabase
                .from("apartments")
                .update({
                    tenant_id: tableTenantId
                })
                .eq("id", apartmentId);

            if (updateApartmentError) throw updateApartmentError;

            const imagesToUpload = [ineFront, ineBack];
            const fileUploadPromises = imagesToUpload.map(async (image, id) => {
                const { error } = await supabase
                    .storage
                    .from("gov_id_images")
                    .upload(`${tableTenantId}/govid${id}`, image);

                if (error) throw error;
            });

            await Promise.all(fileUploadPromises);
            onCreateSuccess();
        } catch (error) {
            console.log(error);
            toast.error(error.message || "No fue posible crear la cuenta del arrendatario.");
        }
    };

    const handleIneFrontChange = (e) => {
        if (e.target.files.length > 0) {
            setIneFront(e.target.files[0]);
        } else {
            setIneFront(null);
        }
    };

    const handleIneBackChange = (e) => {
        if (e.target.files.length > 0) {
            setIneBack(e.target.files[0]);
        } else {
            setIneBack(null);
        }
    };

    return (
        <>
            <Modal show={isModalOpen} size="lg" onClose={onCloseModal} popup>
                <ModalHeader />
                <ModalBody>
                    <div className="space-y-6!">
                        <h3 className="text-2xl! font-semibold! tracking-tight text-slate-900">Nueva cuenta para el arrendatario</h3>

                        <div>
                            <div className="mb-2 block">
                                <label htmlFor="tenant-name" className="form-label fw-semibold text-dark">Nombre(s)</label>
                            </div>
                            <input
                                id="tenant-name"
                                className="form-control"
                                type="text"
                                placeholder="Nombre(s)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <label htmlFor="tenant-father-surname" className="form-label fw-semibold text-dark">Apellido Paterno</label>
                            </div>
                            <input
                                id="tenant-father-surname"
                                className="form-control"
                                type="text"
                                placeholder="Apellido paterno"
                                value={fatherSurname}
                                onChange={(e) => setFatherSurname(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <label htmlFor="tenant-mother-surname" className="form-label fw-semibold text-dark">Apellido Materno</label>
                            </div>
                            <input
                                id="tenant-mother-surname"
                                className="form-control"
                                type="text"
                                placeholder="Apellido materno"
                                value={motherSurname}
                                onChange={(e) => setMotherSurname(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <label htmlFor="tenant-phone" className="form-label fw-semibold text-dark">Número de Teléfono</label>
                            </div>
                            <input
                                id="tenant-phone"
                                className="form-control"
                                type="tel"
                                placeholder="Numero de telefono"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <label htmlFor="tenant-email" className="form-label fw-semibold text-dark">Correo Electrónico</label>
                            </div>
                            <input
                                id="tenant-email"
                                className="form-control"
                                type="text"
                                placeholder="Correo electronico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <label htmlFor="tenant-password" className="form-label fw-semibold text-dark">Contraseña</label>
                            </div>
                            <input
                                id="tenant-password"
                                className="form-control"
                                type="password"
                                placeholder="Contrasena"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <label htmlFor="file-input-front" className="form-label fw-semibold text-dark">Identificación Oficial/Credencial de Estudiante - Frente</label>
                            </div>
                            <input
                                id="file-input-front"
                                className="form-control"
                                type="file"
                                onChange={handleIneFrontChange}
                                required
                                accept="image/png, image/jpeg"
                            />
                        </div>

                        <div>
                            <div className="mb-2 block">
                                <label htmlFor="file-input-back" className="form-label fw-semibold text-dark">Identificación Oficial/Credencial de Estudiante - Reverso</label>
                            </div>
                            <input
                                id="file-input-back"
                                className="form-control"
                                type="file"
                                onChange={handleIneBackChange}
                                required
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
