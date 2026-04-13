
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "../../views/owner/Incidencias/Incidencias.css";
import { supabase } from "../../config/supabase-client";
import { Button } from "flowbite-react";
import { Eye, SquarePen } from "lucide-react";

export default function ContractsTable({
    contracts,
    onEdit
}) {

    const navigate = useNavigate();

    const getApartmentName = async (tenantId) => {
        const { data, error } = await supabase
            .from("apartments")
            .select("name")
            .eq("tenant_id", tenantId)

        if (error) throw error;

        return data[0].name;
    };

    const getTenantName = async (tenantId) => {
        const { data, error } = await supabase
            .from("tenants")
            .select("name", "father_surname", "mother_surname")
            .eq("id", tenantId);

        if (error) throw error;

        // Build a string containing the name of the tenant, using the received data from Supabase.
        const tenantName = data[0].name + " " + data[0].father_surname + " " + data[0].mother_surname;

        return tenantName;
    };

    return (
        <div className="overflow-x-auto" >
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeadCell className="bg-slate-200">ID</TableHeadCell>
                        <TableHeadCell className="bg-slate-200">Propiedad</TableHeadCell>
                        <TableHeadCell className="bg-slate-200">Arrendatario</TableHeadCell>
                        <TableHeadCell className="bg-slate-200">Fechas</TableHeadCell>
                        <TableHeadCell className="bg-slate-200">Alquiler</TableHeadCell>
                        <TableHeadCell className="bg-slate-200">Acciones</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y! border-b-gray-200!">
                    {contracts.map((contract, id) => {
                        return (
                            <TableRow key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell>Contrato-{(contract.id).toString().padStart(4, '0')}</TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{getApartmentName(contract.id)}</TableCell>
                                <TableCell>{getTenantName(contract.tenantid)}</TableCell>
                                <TableCell>
                                    {format(contract.startdate, "PPP", { locale: es })} al
                                    {format(contract.enddate, "PPP", { locale: es })}
                                </TableCell>
                                <TableCell>
                                    <p className="text-green-500 font-medium">${contract.depositamount} MXN</p>
                                </TableCell>
                                <TableCell>
                                    <div className="w-full flex flex-col gap-2">
                                        <Button onClick={() => onEdit(contract.id)} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                            <SquarePen size={14} />
                                            Editar
                                        </Button>

                                        <Button onClick={() => navigate("/contratos/" + contract.id)} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                            <Eye size={14} />
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