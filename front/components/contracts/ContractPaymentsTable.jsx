import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { useParams } from "react-router-dom";
import { es } from "date-fns/locale";
import "../../views/owner/Incidencias/Incidencias.css";
import { supabase } from "../../config/supabase-client";
import InvoiceBadge from "./InvoiceBadge";
import { Button } from "flowbite-react";
import { Eye, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContractPaymentsTable({
    duePayment
}) {
    const { id } = useParams();
    const navigate = useNavigate();
    const [invoices, setInvoices] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function getInvoices() {
            try {
                const { data, error } = await supabase
                    .from("invoices")
                    .select()
                    .eq("contractid", id);

                if (error) throw error;
                setInvoices(data);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            };
        };

        getInvoices();
    }, []);

    return (
        <div className="overflow-x-auto" >
            {!isLoading && (
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeadCell className="bg-slate-200">Fecha de pago</TableHeadCell>
                            <TableHeadCell className="bg-slate-200">Concepto</TableHeadCell>
                            <TableHeadCell className="bg-slate-200">Pago realizado</TableHeadCell>
                            <TableHeadCell className="bg-slate-200">Estado</TableHeadCell>
                        </TableRow>
                    </TableHead>
                    <TableBody className="divide-y! border-b-gray-200!">
                        {invoices.map((invoice, id) => {
                            const invoiceFormattedDate = format(invoice.created_at, "PP", { locale: es })
                            return (
                                <TableRow key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell>{invoiceFormattedDate}</TableCell>
                                    <TableCell className="font-medium">{invoice.concept}</TableCell>
                                    <TableCell className="font-semibold text-emerald-500!">${invoice.amount}</TableCell>
                                    <TableCell>
                                        <InvoiceBadge
                                            location="info"
                                            status={invoice.status}
                                            location="info"
                                        />
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};