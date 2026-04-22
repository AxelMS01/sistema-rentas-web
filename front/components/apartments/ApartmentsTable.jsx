
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import StatusTag from "./StatusTag";
import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Button } from "flowbite-react";
import {
    SquarePen,
    ScrollText,
    House,
    Archive,
    ArchiveRestore,
    CircleDot,
    CircleCheck
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
}) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState();

    useEffect(() => {
        function getTenantName() {
            return 2;
        };
    }, [apartments])


    return (
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

                        return (
                            <TableRow key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell>img</TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                    <div className="flex flex-row items-start">
                                        <StatusTag status={!apartment.status ? "AVAILABLE" : apartment.status} />
                                    </div>
                                </TableCell>
                                <TableCell>{location}</TableCell>
                                <TableCell>{apartment.tenantName ? apartment.tenantName : "Sin asignar"}</TableCell>
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
                                        <Button onClick={() => navigate("/viviendas/" + apartment.id + "/detalles")} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                            <House size={14} />
                                            Ver detalles
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};