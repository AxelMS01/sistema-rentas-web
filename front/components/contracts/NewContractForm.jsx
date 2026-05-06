import { Select, Spinner, TextInput } from "flowbite-react";
import { UserRoundKey } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "../../config/supabase-client";

export default function NewContractForm({
    apartmentOptions,
    onSubmitForm,
    onEditData
}) {
    const [guarantorData, setGuarantorData] = useState({
        guarantorName: onEditData ? onEditData.guarantorName : "",
        guarantorFatSurn: "",
        guarantorMotSurn: "",
        guarantorNation: "",
        guarantorStreet: "",
        guarantorExtNum: "",
        guarantorDivision: "",
        guarantorCity: "",
        guarantorCity: "",
        guarantorState: "",
        guarantorPhone: "",
    });
    const [isLoading, setIsLoading] = useState(true);
    const [apartmentId, setApartmentId] = useState(-1);
    const [linkFound, setLinkFound] = useState(false);
    const [selectedTenantId, setSelectedTenantId] = useState("");

    const [linkedTenantName, setLinkedTenantName] = useState("");
    const [linkedTenantLastName, setLinkedTenantLastName] = useState("");

    useEffect(() => {
        async function updateRelatedTenant() {
            setIsLoading(true);

            try {
                const { data, error } = await supabase
                    .from("tenants")
                    .select("id, name, father_surname")
                    .eq("apartment_id", apartmentId);

                if (error) throw error;

                if (data.length === 0) {
                    setLinkFound(false);
                } else {
                    setLinkFound(true);
                    setSelectedTenantId(data[0].id);
                    setLinkedTenantName(data[0].name);
                    setLinkedTenantLastName(data[0].father_surname);
                };

            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            }
        };

        updateRelatedTenant();
    }, [apartmentId]);

    // Inputs for the contract.
    const [contractStart, setContractStart] = useState();
    const [contractEnd, setContractEnd] = useState();
    const [rentalPrice, setRentalPrice] = useState();

    return (
        <form id="contract-form" onSubmit={(e) => onSubmitForm(guarantorData, apartmentId, selectedTenantId, contractStart, contractEnd, rentalPrice, e)} className='flex flex-col gap-4'>

            <div className='flex flex-col gap-2 items-start text-start'>
                <p className='text-sm font-medium!'>Selecciona una de tus viviendas</p>

                {apartmentOptions.length === 0 && (
                    <p className="text-slate-500 font-medium">¡No hay viviendas disponibles para contrato!</p>
                )}

                {isLoading && apartmentOptions.length > 0 && apartmentId != -1 && (
                    <div className="w-full my-6 items-center justify-center flex flex-row gap-2 self-center">
                        <p className="text-base! font-medium text-slate-900">Buscando inquilino enlazado...</p>

                        <Spinner size="md" />
                    </div>
                )}

                {!isLoading && apartmentOptions.length > 0 && (
                    <Select className="w-full" value={apartmentId} onChange={(e) => setApartmentId(e.target.value)}>
                        <option value={-1}>Selecciona una opción</option>

                        {apartmentOptions.length > 0 && apartmentOptions.map((apartment, id) => {
                            return (
                                <option key={id} value={apartment.id}>{apartment.name}</option>
                            )
                        })}
                    </Select>
                )}

                {!isLoading && apartmentId != -1 && (
                    <div className="w-full text-sm! flex flex-row gap-1 px-3 py-2 bg-sky-50 items-center rounded border border-sky-400!">
                        <UserRoundKey size={18} className="text-sky-800" />
                        {linkFound ? (
                            <>
                                <p className="font-medium text-sky-800">Arrendatario enlazado: {linkedTenantName} {linkedTenantLastName}</p>
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
                        value={guarantorData.guarantorName}
                        onChange={(e) => setGuarantorData({ ...guarantorData, guarantorName: e.target.value })}
                    />
                </div>

                <div className='flex flex-col gap-2 items-start'>
                    <p className='text-sm font-medium! text-start'>Apellido paterno</p>
                    <TextInput
                        className='w-full text-sm'
                        placeholder='Apellido paterno del aval'
                        value={guarantorData.guarantorFatSurn}
                        onChange={(e) => setGuarantorData({ ...guarantorData, guarantorFatSurn: e.target.value })}
                    />
                </div>

                <div className='flex flex-col gap-2 items-start'>
                    <p className='text-sm font-medium! text-start'>Apellido materno</p>
                    <TextInput
                        className='w-full text-sm'
                        placeholder='Apellido materno del aval'
                        value={guarantorData.guarantorMotSurn}
                        onChange={(e) => setGuarantorData({ ...guarantorData, guarantorMotSurn: e.target.value })}
                    />
                </div>

                <div className='flex flex-col gap-2 items-start'>
                    <p className='text-sm font-medium! text-start'>Nacionalidad</p>
                    <TextInput
                        className='w-full text-sm'
                        placeholder='Ej. Mexicana'
                        value={guarantorData.guarantorNation}
                        onChange={(e) => setGuarantorData({ ...guarantorData, guarantorNation: e.target.value })}
                    />
                </div>

                <div className="flex md:flex-row flex-col gap-4 w-full">
                    <div className='flex flex-col gap-2 items-start w-full'>
                        <p className='text-sm font-medium! text-start'>Calle</p>
                        <TextInput
                            className='w-full text-sm'
                            placeholder='Calle'
                            value={guarantorData.guarantorStreet}
                            onChange={(e) => setGuarantorData({ ...guarantorData, guarantorStreet: e.target.value })}
                        />
                    </div>

                    <div className='flex flex-col gap-2 items-start w-full'>
                        <p className='text-sm font-medium! text-start'>Número exterior</p>
                        <TextInput
                            className='w-full text-sm'
                            placeholder='Número exterior'
                            value={guarantorData.guarantorExtNum}
                            onChange={(e) => setGuarantorData({ ...guarantorData, guarantorExtNum: e.target.value })}
                        />
                    </div>
                </div>

                <div className='flex flex-col gap-2 items-start'>
                    <p className='text-sm font-medium! text-start'>Colonia</p>
                    <TextInput
                        className='w-full text-sm'
                        placeholder='Colonia'
                        value={guarantorData.guarantorDivision}
                        onChange={(e) => setGuarantorData({ ...guarantorData, guarantorDivision: e.target.value })}
                    />
                </div>

                <div className="flex md:flex-row flex-col gap-4 w-full">
                    <div className='flex flex-col gap-2 items-start w-full'>
                        <p className='text-sm font-medium! text-start'>Ciudad</p>
                        <TextInput
                            className='w-full text-sm'
                            placeholder='Ciudad'
                            value={guarantorData.guarantorCity}
                            onChange={(e) => setGuarantorData({ ...guarantorData, guarantorCity: e.target.value })}
                        />
                    </div>

                    <div className='flex flex-col gap-2 items-start w-full'>
                        <p className='text-sm font-medium! text-start'>Estado</p>
                        <TextInput
                            className='w-full text-sm'
                            placeholder='Estado'
                            value={guarantorData.guarantorState}
                            onChange={(e) => setGuarantorData({ ...guarantorData, guarantorState: e.target.value })}
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
                        value={guarantorData.guarantorPhone}
                        onChange={(e) => setGuarantorData({ ...guarantorData, guarantorPhone: e.target.value })}
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
    );
};