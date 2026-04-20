
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import "../../views/owner/Incidencias/Incidencias.css";
import { supabase } from "../../config/supabase-client";
import { Button } from "flowbite-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CircleCheck, CircleDot, Eye, Trash } from "lucide-react";
import RequestStatusBtn from "./RequestStatusBtn";
import ConfirmationModal from "../ConfirmationModal";
import { useState } from "react";

export default function TenantRequestsTable({
    requests,
    obtainUrlMedia,
    openEvidence,
    tenantId,
    onActionCompleted
}) {
    const [deleteModal, setDeleteModal] = useState(false);
    const [selectedRequestId, setSelectedRequestId] = useState("");

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

    async function updateStatus(newStatus) {
        const { error } = await supabase
            .from("maintenancerequests")
            .update({ status: newStatus })
            .eq("tenantid", tenantId);

        if (error) throw error;

        onActionCompleted("Estado actualizado correctamente.");
    };

    async function deleteRequest() {
        const response = await supabase
            .from("maintenancerequests")
            .delete()
            .eq("id", selectedRequestId);

        if (response.status === 204) {
            onActionCompleted("Incidencia eliminada correctamente");
        };
    };

    function onRemovePressed(requestId) {
        setDeleteModal(true);
        setSelectedRequestId(requestId);
    };

    return (
        <div className="overflow-x-auto" >
            <ConfirmationModal
                title="Eliminar incidencia"
                msg="¿Estás segur@ de eliminar esta incidencia?"
                isModalOpen={deleteModal}
                onCancel={() => setDeleteModal(false)}
                onConfirm={deleteRequest} />
            <Table>
                <TableHead>
                    <TableRow>
                        <TableHeadCell className="bg-slate-200">Imagen</TableHeadCell>
                        <TableHeadCell className="bg-slate-200">Fecha de creación</TableHeadCell>
                        <TableHeadCell className="bg-slate-200">Descripción</TableHeadCell>
                        <TableHeadCell className="bg-slate-200">Estado</TableHeadCell>
                        <TableHeadCell className="bg-slate-200">Acciones</TableHeadCell>
                    </TableRow>
                </TableHead>
                <TableBody className="divide-y! border-b-gray-200!">
                    {requests.map((request, id) => {
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
                                            src={request.media}
                                            alt="Vivienda"
                                            className="incidencias-image"
                                        />
                                    )}
                                </TableCell>
                                <TableCell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">{format(request.requestdate, "PP", { locale: es })}</TableCell>
                                <TableCell>
                                    <div className="w-full flex flex-col gap-2">
                                        <div className="w-full h-auto p-4 text-nowrap bg-slate-100 border border-slate-200 rounded-lg">
                                            {request.description}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <RequestStatusBtn status={request.status} />
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col gap-2">
                                        {request.status === "solved" ? (
                                            <Button onClick={() => updateStatus("pending")} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                <CircleDot size={14} />
                                                Marcar como pendiente
                                            </Button>
                                        ) : (
                                            <Button onClick={() => updateStatus("solved")} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                                <CircleCheck size={14} />
                                                Marcar como resuelta
                                            </Button>
                                        )}
                                        <Button onClick={() => onRemovePressed(request.id)} className="rounded-md! flex flex-row gap-1.5 text-nowrap text-[13px]!" size="xs" color="alternative">
                                            <Trash size={14} />
                                            Eliminar incidencia
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