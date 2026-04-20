
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import "../../views/owner/Incidencias/Incidencias.css";
import { supabase } from "../../config/supabase-client";
import { Button } from "flowbite-react";
import { Eye } from "lucide-react";
import RequestStatusBtn from "./RequestStatusBtn";

export default function RequestsTable({
    requests,
    obtainUrlMedia,
    openEvidence
}) {

    const navigate = useNavigate();
    const location = "";
    const tenantName = "";

    const fetchRequestMedia = async (requestId) => {
        // Load media files of the requests.
        const { data, error } = await supabase
            .from("maintenancerequest_media")
            .select()
            .eq("request_id", requestId);

        return data;
    };

    return (
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
                    {requests.map((request, id) => {
                        const location = apartment.street + " " + apartment.ext_num + ", " + apartment.division;
                        const requestMedia = fetchRequestMedia(request.id);

                        return (
                            <TableRow key={id} className="bg-white dark:border-gray-700 dark:bg-gray-800">
                                <TableCell>
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
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{location}</TableCell>
                                <TableCell>{tenantName}</TableCell>
                                <TableCell>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="w-full h-auto p-4 text-nowrap bg-slate-100 border border-slate-200 rounded-lg">
                                            {request.description}
                                        </div>

                                        {requestMedia.length > 0 ? (
                                            fetchRequestMedia(request.id).map((media, id) => {
                                                media.tipo === "VIDEO" ? (
                                                    <div className="incidencias-media-card" key={id}>
                                                        <video
                                                            src={obtainUrlMedia(media)}
                                                            controls
                                                            preload="metadata"
                                                        />

                                                        <Button onClick={() => openEvidence(obtainUrlMedia(media))} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                            <Eye size={14} />
                                                            Ver evidencia
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <div className="incidencias-media-card" key={id}>
                                                        <img
                                                            src={obtainUrlMedia(media)}
                                                            alt="Evidencia"
                                                        />

                                                        <Button onClick={() => openEvidence(obtainUrlMedia(media))} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                            <Eye size={14} />
                                                            Ver evidencia
                                                        </Button>
                                                    </div>
                                                )
                                            })
                                        ) : (
                                            <p>Sin evidencias adjuntas.</p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <RequestStatusBtn status={request.status}/>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};