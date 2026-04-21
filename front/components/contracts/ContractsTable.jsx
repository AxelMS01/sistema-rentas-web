import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { format } from "date-fns";
import { es } from "date-fns/locale";
import "../../views/owner/Incidencias/Incidencias.css";
import { supabase } from "../../config/supabase-client";
import { Button } from "flowbite-react";
import { Eye, SquarePen } from "lucide-react";
import { useEffect, useState } from "react";

export default function ContractsTable({
    contracts,
    onEdit,
    finishLoading
}) {
    const navigate = useNavigate();
    const [apartmentNames, setApartmentNames] = useState([]);
    const [tenantNames, setTenantNames] = useState([]);
    const [isTenantLoading, setIsTenantLoading] = useState(true);
    const [isApartmentLoading, setIsApartmentLoading] = useState(true);

    useEffect(() => {
        async function getApartmentsNames() {
            const apartmentNamesPromises = Array.from(contracts).map(async (contract) => {
                try {
                    const { data, error } = await supabase
                        .from("apartments")
                        .select("id, name")
                        .eq("id", contract.apartmentid);

                    if (error) throw error;
                    return data[0];
                } catch (error) {
                    console.log(error);
                } finally {
                    setIsApartmentLoading(false);
                }
            });

            const results = await Promise.all(apartmentNamesPromises);
            setApartmentNames(results);
        };

        async function getTenantsNames() {
            console.log(contracts);
            const tenantNamesPromises = Array.from(contracts).map(async (contract) => {
                try {
                    const { data, error } = await supabase
                        .from("tenants")
                        .select("name, father_surname, mother_surname")
                        .eq("id", contract.tenantid);

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

        getApartmentsNames().then(getTenantsNames());
    }, [contracts]);

    return (
        <div className="overflow-x-auto" >
            {!isTenantLoading && !isApartmentLoading && (
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
                            console.log(tenantNames);
                            const tenantName = tenantNames[id].name + " " + tenantNames[id].father_surname + " " + tenantNames[id].mother_surname;
                            const apartmentName = apartmentNames[id].name;
                            return (
                                <TableRow key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                    <TableCell>Contrato-{contract.id}</TableCell>
                                    <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{apartmentName}</TableCell>
                                    <TableCell>{tenantName}</TableCell>
                                    <TableCell>
                                        <div className="flex! w-full flex-col! gap-2">
                                            <p className="font-medium">{format(contract.startdate, "dd-MM-yyyy", { locale: es })}</p>
                                            <p>al</p>
                                            <p className="font-medium">{format(contract.enddate, "dd-MM-yyyy", { locale: es })}</p>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <p className="text-green-500 font-medium">${contract.depositamount} MXN</p>
                                    </TableCell>
                                    <TableCell>
                                        <div className="w-full flex flex-col gap-2">
                                            <Button onClick={() => onEdit(contract)} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                <SquarePen size={14} />
                                                Editar
                                            </Button>

                                            <Button onClick={() => navigate("/contratos/" + contract.id + "/detalles", {
                                                state: {
                                                    tenantName: tenantName,
                                                    rentCost: contract.depositamount,
                                                    startDate: contract.startdate,
                                                    endDate: contract.enddate,
                                                    contractStatus: contract.status
                                                }
                                            })} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
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
            )}
        </div>
    );
};