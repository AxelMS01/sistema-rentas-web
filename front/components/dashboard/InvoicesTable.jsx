import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import "../../views/owner/Incidencias/Incidencias.css";
import { supabase } from "../../config/supabase-client";
import { Button } from "flowbite-react";
import { Eye } from "lucide-react";
import { useEffect, useState } from "react";

export default function InvoicesTable({
    searchValue,
    requests,
}) {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [locationData, setLocationData] = useState([]);
    const [tenantNames, setTenantNames] = useState([]);

    return (
        <>
            {!isLoading && (
                <div className="overflow-x-auto" >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell className="bg-slate-200">Inquilino</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Vivienda</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Número de teléfono</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Estatus de pago</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Recibo</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y! border-b-gray-200!">
                            <TableRow key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell>
                                    Kevin Torres
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                                <TableCell>
                                </TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
            )}
        </>
    );
};