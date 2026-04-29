
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import StatusTag from "./StatusTag";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from "../ConfirmationModal";
import { Button } from "flowbite-react";
import {
    SquarePen,
    ScrollText,
    House,
    Archive,
    ArchiveRestore,
    CircleDot,
    CircleCheck,
    Trash
} from "lucide-react";
import { supabase } from "../../config/supabase-client";

export default function ApartmentTable({
    apartments,
    onEditClick,
    onArchiveClick,
    onRestoreClick,
    onAvailableClick,
    onOccupiedClick,
    onAddContractClick,
    onApartmentDeletion,
}) {
    const navigate = useNavigate();
    const [isTenantLoading, setIsTenantLoading] = useState(true);
    const [tenantNames, setTenantNames] = useState([]);
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedApartmentId, setSelectedApartmentId] = useState();

    useEffect(() => {
        async function getTenantsNames() {
            const tenantNamesPromises = Array.from(apartments).map(async (apartment) => {
                try {
                    const { data, error } = await supabase
                        .from("tenants")
                        .select("name, father_surname, mother_surname")
                        .eq("id", Number(apartment.tenant_id));

                    if (error) throw error;

                    return data[0];
                } catch (error) {
                    console.log(error);
                };
            });

            const results = await Promise.all(tenantNamesPromises);
            setTenantNames(results);
            setIsTenantLoading(false);
        };

        getTenantsNames();
    }, [apartments]);

    async function handleDeleteApartment() {
        const response = await supabase
            .from("apartments")
            .delete()
            .eq("id", selectedApartmentId);

        setDeleteModal(false);
        onApartmentDeletion();
    };

    function requestDeleteApartment(apartmentId) {
        setSelectedApartmentId(apartmentId);
        setDeleteModal(true);
    };

    return (
        <>
            <ConfirmationModal
                title="Eliminar la vivienda"
                msg="¿Estás segur@ de que quieres eliminar esta vivienda? Toda su información se perderá permanentemente."
                isModalOpen={deleteModal}
                onCancel={() => setDeleteModal(false)}
                onConfirm={handleDeleteApartment}

            />

            {!isTenantLoading && (
                <div className="overflow-x-auto" >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell className="bg-slate-200">Imagen</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Estatus</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Ubicación</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Arrendatario</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Fecha de pago</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Acciones</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Detalles</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y! border-b-gray-200!">
                            {apartments.map((apartment, id) => {
                                const location = apartment.street + " " + apartment.ext_num + ", " + apartment.division;

                                let tenantName;

                                if (tenantNames[id] === undefined) {
                                    tenantName = "Sin asignar";
                                } else {
                                    tenantName = tenantNames[id].name + " " + tenantNames[id].father_surname + " " + tenantNames[id].mother_surname;
                                };

                                return (
                                    <TableRow key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell>img</TableCell>
                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            <div className="flex flex-row items-start">
                                                <StatusTag status={!apartment.status ? "AVAILABLE" : apartment.status} />
                                            </div>
                                        </TableCell>
                                        <TableCell>{location}</TableCell>
                                        <TableCell>{tenantName}</TableCell>
                                        <TableCell>{apartment.latest_due_date ? apartment.latest_due_date : "Por definir"}</TableCell>
                                        <TableCell className="flex flex-col gap-2">
                                            <div className="w-full flex flex-col gap-2">
                                                <Button onClick={() => onEditClick(apartment)} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                    <SquarePen size={14} />
                                                    Editar
                                                </Button>
                                                {apartment.status === "ARCHIVED" ? (
                                                    <Button onClick={() => onRestoreClick(apartment.id, "AVAILABLE")} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                        <ArchiveRestore size={14} />
                                                        Desarchivar
                                                    </Button>
                                                ) : (
                                                    <Button onClick={() => onArchiveClick(apartment.id, "ARCHIVED")} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                        <Archive size={14} />
                                                        Archivar
                                                    </Button>
                                                )}

                                                {apartment.status === "OCCUPIED" ? (
                                                    <Button onClick={() => onAvailableClick(apartment.id, "AVAILABLE")} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                        <CircleDot size={14} />
                                                        Cambiar a disponible
                                                    </Button>
                                                ) : (
                                                    <Button onClick={() => onOccupiedClick(apartment.id, "OCCUPIED")} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                        <CircleCheck size={14} />
                                                        Cambiar a ocupada
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="w-full flex flex-col gap-2">
                                                <Button onClick={() => navigate("/system/viviendas/" + apartment.id + "/detalles", {
                                                    state: {
                                                        tenantId: apartment.tenant_id
                                                    }
                                                })}
                                                    className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                    <House size={14} />
                                                    Ver detalles
                                                </Button>

                                                {apartment.status === "AVAILABLE" && (
                                                    <Button onClick={() => requestDeleteApartment(apartment.id)} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                        <Trash size={14} />
                                                        Eliminar esta vivienda
                                                    </Button>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </>
    );
};