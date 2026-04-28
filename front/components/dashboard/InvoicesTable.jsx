import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import "../../views/owner/Incidencias/Incidencias.css";
import { supabase } from "../../config/supabase-client";
import { Button } from "flowbite-react";
import { Eye } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import useLoggedUser from "../../utils/useLoggedUser";
import InvoiceStatusTag from "./InvoiceStatusTag";

export default function InvoicesTable({
    searchValue,
    tenantList,
}) {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [locationData, setLocationData] = useState([]);
    const [invoicesData, setInvoicesData] = useState([]);
    const loggedUser = useLoggedUser();

    console.log(tenantList);

    async function getApartmentsData() {
        setIsLoading(true);

        const apartmentsPromises = Array.from(tenantList).map(async (tenant) => {
            try {
                const { data, error } = await supabase
                    .from("apartments")
                    .select("name, street, division")
                    .eq("tenant_id", tenant.id);

                if (error) throw error;
                return data[0];

            } catch (error) {
                console.log(error);
            };
        });

        const results = await Promise.all(apartmentsPromises);
        setLocationData(results);
        console.log("Location results:", results);
        setIsLoading(false);
    };

    async function getInvoicesData() {
        setIsLoading(true);

        const invoicesPromises = Array.from(tenantList).map(async (tenant, id) => {
            try {
                const { data, error } = await supabase
                    .from("invoices")
                    .select()
                    .eq("tenant_id", tenant.id);

                if (error) throw error;
                return data[0];
            } catch (error) {
                console.log(error);
            };
        });

        const results = await Promise.all(invoicesPromises);
        setInvoicesData(results);
        console.log("Invoices results:", results);
        setIsLoading(false);
    };

    const fetchData = useCallback(
        async () => {
            try {
                getApartmentsData();
                getInvoicesData();
            } catch (error) {
                console.log(error);
            };
        }, [tenantList]
    );

    useEffect(() => {
        fetchData();
    }, [tenantList]);

    return (
        <>
            {!isLoading && (
                <div className="overflow-x-auto w-full">
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
                            {tenantList.map((tenant, id) => {
                                console.log(locationData);
                                return (
                                    <TableRow key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell>
                                            {tenant.name} {tenant.father_surname}
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {locationData[id] ? locationData[id].name : "Sin asignar"}
                                        </TableCell>

                                        <TableCell>
                                            {tenant.phone}
                                        </TableCell>

                                        <TableCell className="flex items-start">
                                            <InvoiceStatusTag status={invoicesData[id] ? invoicesData[id].status : "pending"} />
                                        </TableCell>

                                        <TableCell>
                                        </TableCell>
                                    </TableRow>
                                )
                            })}
                        </TableBody>
                    </Table>
                </div>
            )}
        </>
    );
};