
import { Button, Label, Modal, ModalBody, ModalHeader, ModalFooter, TextInput, Select, FileInput } from "flowbite-react";
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
    const [guarantorName, setGuarantorName] = useState(onEditData ? onEditData.guarantorName : "");
    const [guarantorFatSurn, setGuarantorFatSurn] = useState("");
    const [guarantorMotSurn, setGuarantorMotSurn] = useState("");
    const [guarantorNation, setGuarantorNation] = useState("");
    const [guarantorStreet, setGuarantorStreet] = useState("");
    const [guarantorExtNum, setGuarantorExtNum] = useState("");
    const [guarantorDivision, setGuarantorDivision] = useState("");
    const [guarantorCity, setGuarantorCity] = useState("");
    const [guarantorState, setGuarantorState] = useState("");
    const [guarantorPhone, setGuarantorPhone] = useState("");
    const [guarantorIdFront, setGuarantorIdFront] = useState(null);
    const [guarantorIdBack, setGuarantorIdBack] = useState(null);
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

        if (!guarantorIdFront || !guarantorIdBack) {
            toast.error("Sube el frente y reverso de la identificación del aval.");
            return;
        }

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

            const guarantorFiles = [
                { file: guarantorIdFront, suffix: "front" },
                { file: guarantorIdBack, suffix: "back" },
            ];

            const uploadedFiles = await Promise.all(
                guarantorFiles.map(async ({ file, suffix }) => {
                    const fileExtension = file.name.split(".").pop();
                    const filePath = `guarantors/${newGuarantorId}/ine-${suffix}-${Date.now()}.${fileExtension}`;

                    const { error: uploadError } = await supabase
                        .storage
                        .from("gov_id_images")
                        .upload(filePath, file, { upsert: true });

                    if (uploadError) throw uploadError;

                    const { data: publicUrlData } = supabase
                        .storage
                        .from("gov_id_images")
                        .getPublicUrl(filePath);

                    return {
                        suffix,
                        publicUrl: publicUrlData.publicUrl,
                    };
                })
            );

            const guarantorIdFrontUrl = uploadedFiles.find((file) => file.suffix === "front")?.publicUrl || null;
            const guarantorIdBackUrl = uploadedFiles.find((file) => file.suffix === "back")?.publicUrl || null;

            const { error: guarantorUpdateError } = await supabase
                .from("guarantors")
                .update({
                    ine_front_url: guarantorIdFrontUrl,
                    ine_back_url: guarantorIdBackUrl,
                })
                .eq("id", newGuarantorId);

            const guarantorIdColumnsMissing =
                guarantorUpdateError?.code === "PGRST204" &&
                (
                    guarantorUpdateError?.message?.includes("ine_front_url") ||
                    guarantorUpdateError?.message?.includes("ine_back_url")
                );

            if (guarantorUpdateError && !guarantorIdColumnsMissing) throw guarantorUpdateError;

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

            if (guarantorIdColumnsMissing) {
                toast("Se subieron las imágenes del INE del aval, pero falta guardar las URLs en la tabla guarantors.");
            }

            onSaveContract();

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
                    <form onSubmit={onSubmitData} className='flex flex-col gap-4'>

                        <div className='flex flex-col gap-2 items-start text-start'>
                            <p className='text-sm font-medium!'>Selecciona una de tus viviendas</p>
                            <Select className="w-full" value={apartmentId} onChange={(e) => setApartmentId(e.target.value)}>
                                <option value={-1}>Selecciona una opción</option>
                                {apartmentOptions.map((apartment, id) => {
                                    return (
                                        <option key={id} value={apartment.id}>{apartment.name}</option>
                                    )
                                })}
                            </Select>

                            {!isLinkLoading && apartmentId != -1 && (
                                <div className="w-full text-sm! flex flex-row gap-1 px-3 py-2 bg-sky-50 items-center rounded border border-sky-400!">
                                    <UserRoundKey size={18} className="text-sky-800" />
                                    {linkFound ? (
                                        <>
                                            <p className="font-medium text-sky-800">Arrendatario enlazado: {tenantName} {tenantLastName}</p>
                                        </>
                                    ) : (
                                        <>
                                            <p className="font-medium text-sky-800">No se encontró un arrendatario enlazado.</p>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col gap-4">
                            <p className='text-lg font-semibold text-start'>Datos del Fiador</p>

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

                            <div className="flex md:flex-row flex-col gap-4 w-full">
                                <div className='flex flex-col gap-2 items-start w-full'>
                                    <p className='text-sm font-medium! text-start'>Calle</p>
                                    <TextInput
                                        className='w-full text-sm'
                                        placeholder='Calle'
                                        value={guarantorStreet}
                                        onChange={(e) => setGuarantorStreet(e.target.value)}
                                    />
                                </div>

                                <div className='flex flex-col gap-2 items-start w-full'>
                                    <p className='text-sm font-medium! text-start'>Número exterior</p>
                                    <TextInput
                                        className='w-full text-sm'
                                        placeholder='Número exterior'
                                        value={guarantorExtNum}
                                        onChange={(e) => setGuarantorExtNum(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col gap-2 items-start'>
                                <p className='text-sm font-medium! text-start'>Colonia</p>
                                <TextInput
                                    className='w-full text-sm'
                                    placeholder='Colonia'
                                    value={guarantorDivision}
                                    onChange={(e) => setGuarantorDivision(e.target.value)}
                                />
                            </div>

                            <div className="flex md:flex-row flex-col gap-4 w-full">
                                <div className='flex flex-col gap-2 items-start w-full'>
                                    <p className='text-sm font-medium! text-start'>Ciudad</p>
                                    <TextInput
                                        className='w-full text-sm'
                                        placeholder='Ciudad'
                                        value={guarantorCity}
                                        onChange={(e) => setGuarantorCity(e.target.value)}
                                    />
                                </div>

                                <div className='flex flex-col gap-2 items-start w-full'>
                                    <p className='text-sm font-medium! text-start'>Estado</p>
                                    <TextInput
                                        className='w-full text-sm'
                                        placeholder='Estado'
                                        value={guarantorState}
                                        onChange={(e) => setGuarantorState(e.target.value)}
                                    />
                                </div>
                            </div>

                            <div className='flex flex-col gap-2 items-start'>
                                <p className='text-sm font-medium! text-start'>Número de teléfono</p>
                                <TextInput
                                    type="tel"
                                    min={10}
                                    max={10}
                                    className='w-full text-sm'
                                    placeholder='Número de teléfono'
                                    value={guarantorPhone}
                                    onChange={(e) => setGuarantorPhone(e.target.value)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start'>
                                <p className='text-sm font-medium! text-start'>INE o identificación oficial del aval - Frente</p>
                                <FileInput
                                    className='w-full text-sm'
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => setGuarantorIdFront(e.target.files?.[0] || null)}
                                />
                            </div>

                            <div className='flex flex-col gap-2 items-start'>
                                <p className='text-sm font-medium! text-start'>INE o identificación oficial del aval - Reverso</p>
                                <FileInput
                                    className='w-full text-sm'
                                    accept="image/png, image/jpeg, image/webp"
                                    onChange={(e) => setGuarantorIdBack(e.target.files?.[0] || null)}
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
                    </form>
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
