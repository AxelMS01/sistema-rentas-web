import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import "../../views/owner/Incidencias/Incidencias.css";
import { supabase } from "../../config/supabase-client";
import { Button } from "flowbite-react";
import { Eye } from "lucide-react";
import RequestStatusBtn from "./RequestStatusBtn";
import { useEffect, useState } from "react";

export default function RequestsTable({
    searchValue,
    requests,
    obtainUrlMedia,
    openEvidence
}) {

    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [locationData, setLocationData] = useState([]);
    const [tenantNames, setTenantNames] = useState([]);

    useEffect(() => {
        async function getApartmentsLocation() {
            setIsLoading(true);
            
            const apartmentNamesPromises = Array.from(requests).map(async (request) => {
                try {
                    const { data, error } = await supabase
                        .from("apartments")
                        .select("street, ext_num, division")
                        .eq("id", Number(request.apartmentid));

                    if (error) throw error;

                    return data[0];
                } catch (error) {
                    console.log(error);
                };
            });

            const results = await Promise.all(apartmentNamesPromises);
            setLocationData(results);
            setIsLoading(false);
        };

        async function getTenantNames() {
            setIsLoading(true);

            const tenantNamesPromises = Array.from(requests).map(async (request) => {
                try {
                    const { data, error } = await supabase
                        .from("tenants")
                        .select("name, father_surname, mother_surname")
                        .eq("id", Number(request.tenantid));

                    if (error) throw error;

                    return data[0];
                } catch (error) {
                    console.log(error);
                };
            });

            const results = await Promise.all(tenantNamesPromises);
            setTenantNames(results);
            setIsLoading(false);
        }

        getApartmentsLocation().then(getTenantNames);
    }, [requests]);

    const fetchRequestMedia = async (requestId) => {
        // Load media files of the requests.
        const { data, error } = await supabase
            .from("maintenancerequest_media")
            .select()
            .eq("request_id", requestId);

        if (error) throw error;

        return data;
    };

    return (
        <>
            {!isLoading && (
                <div className="overflow-x-auto" >
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableHeadCell className="bg-slate-200">Imagen</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Ubicación</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Arrendatario</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Incidencia</TableHeadCell>
                                <TableHeadCell className="bg-slate-200">Estado</TableHeadCell>
                            </TableRow>
                        </TableHead>
                        <TableBody className="divide-y! border-b-gray-200!">
                            {requests.filter((request) => {
                                return searchValue.toLowerCase() === ""
                                ? request
                                : request.description.toLowerCase().includes(searchValue.toLowerCase());
                            }).map((request, id) => {
                                return (
                                    <TableRow key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                        <TableCell>
                                            {/*
                                                                                        {request.media?.[0] ? (
                                                request.media[0].tipo === "VIDEO" ? (
                                                    <video
                                                        src={() => obtainUrlMedia(incidencia.media[0])}
                                                        className="incidencias-image"
                                                        controls
                                                        preload="metadata"
                                                    />
                                                ) : (
                                                    <img
                                                        src={obtainUrlMedia(incidencia.media[0])}
                                                        alt="Evidencia"
                                                        className="incidencias-image"
                                                    />
                                                )
                                            ) : (
                                                <img
                                                    src={incidencia.img}
                                                    alt="Vivienda"
                                                    className="incidencias-image"
                                                />
                                            )}
                                            */}
                                            Imagen
                                        </TableCell>

                                        <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                                            {locationData[id].street} {locationData[id].ext_num}, {locationData[id].division}
                                        </TableCell>

                                        <TableCell>
                                            {tenantNames[0].name} {tenantNames[0].father_surname} {tenantNames[0].mother_surname}
                                        </TableCell>

                                        <TableCell>
                                            <div className="w-full flex flex-col gap-2">
                                                <div className="w-full h-auto p-4 text-nowrap bg-slate-100 border border-slate-200 rounded-lg">
                                                    {request.description}
                                                </div>
                                            </div>
                                        </TableCell>

                                        <TableCell className="flex self-start">
                                            <RequestStatusBtn status={request.status} />
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