
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
import { useNavigate } from 'react-router-dom';
import { Button } from "flowbite-react";

export default function RequestsTable({
    requests,
    obtainUrlMedia,
}) {
    const navigate = useNavigate();
    const location = "";
    const tenantName = "";
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
                        const location = apartment.street + " " + apartment.ext_num + ", " + apartment.division
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
                                    <div className="max-w-24 h-auto p-4 text-nowrap bg-slate-100 border border-slate-200 rounded-lg">
                                        {request.description}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span
                                        className={`incidencias-status-badge ${request.status === "resuelta" ? "is-success" : "is-warning"
                                            }`}
                                    >
                                        {request.status === "resuelta" ? "Resuelta" : "Pendiente"}
                                    </span>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
};