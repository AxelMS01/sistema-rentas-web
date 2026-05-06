
import { Button, Label, Modal, ModalBody, ModalHeader, ModalFooter, TextInput, Select } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";
import { UserRoundKey } from "lucide-react";
import NewContractForm from "./NewContractForm";

export default function NewContractModal({ isModalOpen, onCloseModal, onSaveContract, isOnEdit, onEditData }) {
    const loggedUserId = useUser((state) => state.loggedUser);
    const [apartmentOptions, setApartmentOptions] = useState([]);

    // Inputs for the apartment selection.
    const [apartmentId, setApartmentId] = useState(-1);
    const [tenantName, setTenantName] = useState("");
    const [tenantLastName, setTenantLastName] = useState("");

    // Inputs for the guarantor.
    const [isLinkLoading, setIsLinkLoading] = useState(true);
    const [areOptionsLoading, setAreOptionsLoading] = useState(true);

    useEffect(() => {
        if (isOnEdit) {
            console.log(onEditData);
            setGuarantorName(onEditData.guarantorName);
        };

    }, [onEditData]);

    useEffect(() => {
        async function getApartmentsOptions() {
            try {
                const { data, error } = await supabase
                    .from("apartments")
                    .select("id, name, status")
                    .eq("ownerid", loggedUserId);

                if (error) throw error;

                console.log(data);

                // Show only the apartment options whose status is available.
                const availableOptions = data.filter((apartment) => {
                    return apartment.status === "AVAILABLE"
                });

                setApartmentOptions(availableOptions);
            } catch (error) {
                console.log(error);
            } finally {
                setAreOptionsLoading(false);
            }
        };

        getApartmentsOptions();
    }, [])

    async function onSubmitData(guarantorData, apartmentId, selectedTenantId, contractStart, contractEnd, rentalPrice, e) {
        e.preventDefault();

        if (!guarantorData.guarantorName || !guarantorData.guarantorFatSurn || !guarantorData.guarantorMotSurn || !guarantorData.guarantorNation || !contractStart || !contractEnd || !rentalPrice) {
            toast.error("Por favor, llena todos los campos del formulario.");
            return;
        };

        async function insertNewData() {
            const { data: newGuarantor, error: guarantorError } = await supabase
                .from("guarantors")
                .insert({
                    apartment_id: apartmentId,
                    name: guarantorData.guarantorName,
                    father_surname: guarantorData.guarantorFatSurn,
                    mother_surname: guarantorData.guarantorMotSurn,
                    nationality: guarantorData.guarantorNation,
                    street: guarantorData.guarantorStreet,
                    ext_num: guarantorData.guarantorExtNum,
                    division: guarantorData.guarantorDivision,
                    city: guarantorData.guarantorCity,
                    state: guarantorData.guarantorState,
                    phone: guarantorData.guarantorPhone,
                })
                .select();

            if (guarantorError) throw guarantorError;

            let newGuarantorId = newGuarantor[0].id;

            const { error } = await supabase
                .from("rentalcontracts")
                .insert({
                    apartmentid: apartmentId,
                    owner_id: loggedUserId,
                    tenantid: selectedTenantId,
                    guarantorid: newGuarantorId,
                    startdate: contractStart,
                    enddate: contractEnd,
                    depositamount: rentalPrice,
                    monthlyamount: rentalPrice,
                });

            if (error) throw error;

            onSaveContract();
        };

        // Promise chain.
        insertNewData();
    };

    return (
        <>
            <Modal show={isModalOpen} size="xl" onClose={onCloseModal} popup>
                <ModalHeader className="w-full p-4">
                    <p className="text-2xl! tracking-tight font-semibold">{!isOnEdit ? "Crear nuevo contrato" : "Editar contrato"}</p>
                </ModalHeader>
                <ModalBody>
                    {!areOptionsLoading && (
                        <NewContractForm
                            selectedApartmentId={apartmentId}
                            apartmentOptions={apartmentOptions}
                            onSubmitForm={onSubmitData}
                            onEditData={() => ""}
                        />
                    )}
                </ModalBody>
                <ModalFooter>
                    <div className="w-full flex sm:flex-row flex-col gap-2">
                        <Button className="w-full text-sm! rounded-lg! px-4! py-2!" color={"alternative"} onClick={onCloseModal}>
                            Cancelar
                        </Button>
                        <Button type="submit" form="contract-form" className="w-full text-sm! rounded-lg! bg-sky-600 hover:bg-sky-700! px-4! py-2!">
                            Generar contrato
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>
        </>
    );
};