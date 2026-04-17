
import { Button, Label, Modal, ModalBody, ModalHeader, TextInput, Select } from "flowbite-react";
import { Datepicker } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";
import { UserRoundKey } from "lucide-react";

export default function NewContractModal({ isModalOpen, onCloseModal, onSaveContract }) {
    const loggedUserId = useUser((state) => state.loggedUser);

    // Inputs for the apartment selection.
    const [apartmentId, setApartmentId] = useState(0);
    const [tenantName, setTenantName] = useState();
    const [tenantLastName, setTenantLastName] = useState();
    const [apartmentOptions, setApartmentOptions] = useState([{}]);

    const [selectedTenantId, setSelectedTenantId] = useState();

    // Inputs for the guarantor.
    const [guarantorName, setGuarantorName] = useState("");
    const [guarantorFatSurn, setGuarantorFatSurn] = useState("");
    const [guarantorMotSurn, setGuarantorMotSurn] = useState("");
    const [guarantorNation, setGuarantorNation] = useState("");

    // Inputs for the contract.
    const [contractStart, setContractStart] = useState();
    const [contractEnd, setContractEnd] = useState();
    const [rentalPrice, setRentalPrice] = useState();

    useEffect(() => {
        async function getApartmentsOptions() {
            try {
                const { data, error } = await supabase
                    .from("apartments")
                    .select("id, name")
                    .eq("ownerid", loggedUserId);

                if (error) throw error;

                console.log(data);
                setApartmentOptions(data);
                setApartmentId(data[0].id);
            } catch (error) {
                console.log(error);
            };
        };

        getApartmentsOptions();
    }, [])

    useEffect(() => {
        async function updateRelatedTenant() {
            try {
                const { data, error } = await supabase
                    .from("tenants")
                    .select("id, name, father_surname")
                    .eq("apartment_id", apartmentId);

                if (error) throw error;

                setSelectedTenantId(data[0].id);
                setTenantName(data[0].name);
                setTenantLastName(data[0].father_surname);

            } catch (error) {
                console.log(error);
            };
        };

        updateRelatedTenant();
    }, [apartmentId]);

    async function onSubmitData() {
        if (!guarantorName || !guarantorFatSurn || !guarantorMotSurn || !guarantorNation || !contractStart || !contractEnd || !rentalPrice) {
            toast.error("Por favor, llena todos los campos del formulario.");
            return;
        };

        async function insertGuarantorData() {
            const { error } = await supabase
                .from("guarantors")
                .insert({
                    apartment_id: apartmentId,
                    name: guarantorName,
                    father_surname: guarantorFatSurn,
                    mother_surname: guarantorMotSurn,
                    nationality: guarantorNation
                })

            if (error) throw error;
        };

        let newGuarantorId;

        async function getNewGuarantorId() {
            const { data, error } = await supabase
                .from("guarantors")
                .select("id")
                .eq("apartment_id", apartmentId)

            if (error) throw error;

            newGuarantorId = data[0].id;
        };

        async function insertContractData() {
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
        };

        // Promise chain.
        insertGuarantorData()
            .then(getNewGuarantorId())
            .then(insertContractData())
            .finally(onSaveContract());
    };

    return (
        <>
            <Modal show={isModalOpen} size="xl" onClose={onCloseModal} popup>
                <ModalHeader className="w-full p-4">
                    <p className="text-2xl! tracking-tight font-semibold">Crear nuevo contrato</p>
                </ModalHeader>
                <ModalBody>
                    <form onSubmit={onSubmitData} className='flex flex-col gap-4'>

                        <div className='flex flex-col gap-2 items-start text-start'>
                            <p className='text-sm font-medium!'>Selecciona una vivienda</p>
                            <Select className="w-full" defaultValue="1" value={apartmentId} onChange={(e) => setApartmentId(e.target.value)}>
                                {apartmentOptions.map((apartment, id) => {
                                    return (
                                        <option key={id} value={apartment.id}>{apartment.name}</option>
                                    )
                                })}
                            </Select>
                            <div className="w-full text-sm! flex flex-row gap-1 px-3 py-2 bg-sky-50 items-center rounded border border-sky-400!">
                                <UserRoundKey size={18} className="text-sky-800" />
                                <p className="font-medium text-sky-800">Arrendatario enlazado:</p>
                                <p className="font-medium text-slate-800">{tenantName} {tenantLastName}</p>
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className='text-lg font-semibold text-start'>Datos del aval</p>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Nombre(s)</p>
                                <TextInput
                                    className='w-full text-sm'
                                    placeholder='Nombre del aval'
                                    value={guarantorName}
                                    onChange={(e) => setGuarantorName(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start'>
                                <p className='text-sm font-medium! text-start'>Apellido paterno</p>
                                <TextInput
                                    className='w-full text-sm'
                                    placeholder='Apellido paterno del aval'
                                    value={guarantorFatSurn}
                                    onChange={(e) => setGuarantorFatSurn(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start'>
                                <p className='text-sm font-medium! text-start'>Apellido materno</p>
                                <TextInput
                                    className='w-full text-sm'
                                    placeholder='Apellido materno del aval'
                                    value={guarantorMotSurn}
                                    onChange={(e) => setGuarantorMotSurn(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start'>
                                <p className='text-sm font-medium! text-start'>Nacionalidad</p>
                                <TextInput
                                    className='w-full text-sm'
                                    placeholder='Ej. Mexicana'
                                    value={guarantorNation}
                                    onChange={(e) => setGuarantorNation(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className='text-lg font-semibold text-start'>Datos del contrato</p>

                            <div className='flex flex-col gap-2 items-start text-start'>
                                <p className='text-sm font-medium!'>Fecha de inicio</p>
                                <input
                                    className="border border-slate-200 rounded-md p-2 text-sm! bg-slate-100 w-full placeholder:text-slate-400"
                                    type="date"
                                    lang="es"
                                    value={contractStart}
                                    onChange={(e) => setContractStart(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start'>
                                <p className='text-sm font-medium! text-start'>Fecha de término</p>
                                <input
                                    className="border border-slate-200 rounded-md p-2 text-sm! bg-slate-100 w-full"
                                    type="date"
                                    lang="es"
                                    value={contractEnd}
                                    onChange={(e) => setContractEnd(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start'>
                                <p className='text-sm font-medium! text-start'>Precio de renta (pesos)</p>
                                <TextInput
                                    type="number"
                                    className='w-full text-sm'
                                    placeholder='Precio de renta'
                                    value={rentalPrice}
                                    onChange={(e) => setRentalPrice(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="w-full flex sm:flex-row flex-col gap-2">
                            <Button className="w-full text-sm! rounded-lg! px-4! py-2!" color={"alternative"} onClick={onCloseModal}>
                                Cancelar
                            </Button>
                            <Button className="w-full text-sm! rounded-lg! bg-sky-600 hover:bg-sky-700! px-4! py-2!" onClick={onSubmitData}>
                                Generar contrato
                            </Button>
                        </div>
                    </form>
                </ModalBody>
            </Modal>
        </>
    );
}