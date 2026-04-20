import { useEffect, useMemo, useState } from "react";
import SearchBar from "../../../components/SearchBar";
import { ArrowLeft, CalendarArrowDown, CalendarArrowUp, Plus } from "lucide-react";
import { Button } from "flowbite-react";
import CustomButton from "../../../components/Button"
import RequestsTable from "../../../components/requests/RequestsTable";
import { supabase } from "../../../config/supabase-client";
import useUser from "../../../stores/user-store";
import { Link } from "react-router-dom";
import TenantRequestsTable from "../../../components/requests/TenantRequestsTable";
import NewRequestModal from "../../../components/requests/NewRequestModal";
import toast, { Toaster } from "react-hot-toast";

const leerRespuesta = async (response) => {
    const text = await response.text();

    try {
        return text ? JSON.parse(text) : {};
    } catch {
        return { raw: text };
    }
};

const obtenerMarcaTiempo = (fecha) => {
    const timestamp = new Date(fecha).getTime();
    return Number.isNaN(timestamp) ? 0 : timestamp;
};

function TenantRequests() {
    const loggedUserId = useUser((state) => state.loggedUser);
    const obtenerToken = () => localStorage.getItem("token") || "";
    const [incidenciasData, setIncidenciasData] = useState([]);
    const [filtroBusqueda, setFiltroBusqueda] = useState("");
    const [filtroEstado, setFiltroEstado] = useState("todas");
    const [orden, setOrden] = useState("recientes");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [successfulAction, setSuccessfulAction] = useState(0);
    const [createModal, setCreateModal] = useState(false);

    const construirMediaUrl = (id) => {
        const token = obtenerToken();

        // return api(`/maintenancerequests/media/${id}?token=${encodeURIComponent(token)}`);
    };

    const obtenerUrlMedia = (media) => {
        if (media?.storage_path && /^https?:\/\//i.test(media.storage_path)) {
            return media.storage_path;
        }
        return media?.id ? construirMediaUrl(media.id) : "";
    };

    const abrirEvidencia = (url) => {
        if (!url) {
            return;
        }
        window.open(url, "_blank", "noopener,noreferrer");
    };

    useEffect(() => {
        const controller = new AbortController();

        const cargarIncidencias = async () => {
            try {
                setLoading(true);
                setError("");

                const { data, error } = await supabase
                    .from("maintenancerequests")
                    .select()
                    .eq("tenantid", loggedUserId)

                setIncidenciasData(data);

            } catch (err) {
                if (err.name === "AbortError") {
                    return;
                }
                console.error(err);
                setError(err.message || "No se pudieron cargar las incidencias");
            } finally {
                setLoading(false);
            }
        };

        cargarIncidencias();

        return () => {
            controller.abort();
        };
    }, [successfulAction]);

    const restablecerFiltros = () => {
        setFiltroBusqueda("");
        setFiltroEstado("todas");
        setOrden("recientes");
    };

    function handleSuccess(msg) {
        setCreateModal(false);
        setSuccessfulAction(successfulAction + 1);
        toast.success(msg);
    }

    const incidencias = useMemo(() => {
        const texto = filtroBusqueda.trim().toLowerCase();

        const filtradas = incidenciasData.filter((incidencia) => {
            const ubicacion = String(incidencia.ubicacion || "").toLowerCase();
            const arrendatario = String(incidencia.arrendatario || "").toLowerCase();
            const descripcion = String(incidencia.descripcion || "").toLowerCase();

            const coincideBusqueda =
                ubicacion.includes(texto) ||
                arrendatario.includes(texto) ||
                descripcion.includes(texto);

            const coincideEstado =
                filtroEstado === "todas" ? true : incidencia.status === filtroEstado;

            return coincideBusqueda && coincideEstado;
        });

        return [...filtradas].sort((a, b) => {
            const fechaA = obtenerMarcaTiempo(a.fecha);
            const fechaB = obtenerMarcaTiempo(b.fecha);
            const idA = Number(a.id) || 0;
            const idB = Number(b.id) || 0;

            if (orden === "recientes") {
                if (fechaB !== fechaA) {
                    return fechaB - fechaA;
                }

                return idB - idA;
            }

            if (fechaA !== fechaB) {
                return fechaA - fechaB;
            }

            return idA - idB;
        });
    }, [filtroBusqueda, filtroEstado, incidenciasData, orden]);

    return (
        <>
            <div className="w-full h-screen flex flex-col gap-4! lg:px-20! sm:px-16! px-8! py-10">

                <Toaster />
                <NewRequestModal isModalOpen={createModal} onCloseModal={() => setCreateModal(false)} onSave={() => handleSuccess("Incidencia creada correctamente.")} />

                <Link to="/home" style={{ textDecoration: "none" }} className="flex flex-row gap-2 items-center justify-center w-auto self-start m-0 bg-white hover:bg-sky-100! hover:border-sky-500! border border-slate-200 px-3 py-2 rounded-md">
                    <ArrowLeft className="text-sky-600" size={18} />

                    <p className="text-start font-semibold text-sky-600 m-0! text-sm">
                        Regresar al inicio
                    </p>
                </Link>

                <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                    <div className="header flex flex-col gap-2">
                        <h1 className="text-start font-light fw-semibold tracking-tight">Mis Incidencias</h1>
                        <p className="text-base font-normal text-slate-500 text-start">Consulta aquí todas las incidencias que has reportado.</p>
                    </div>

                    <CustomButton
                        text="Nueva incidencia"
                        icon={<Plus size={18} />}
                        onClick={() => setCreateModal(true)}
                    />
                </div>

                <div className="incidencias-toolbar">
                    <SearchBar
                        placeholder="Buscar una incidencia..."
                        value={filtroBusqueda}
                        onChange={(e) => setFiltroBusqueda(e.target.value)}
                    />

                    <div className="flex flex-row gap-2 p-2.5 bg-white border border-slate-200 rounded-lg!">
                        <button
                            onClick={() => setOrden("recientes")}
                            className={`flex flex-row gap-2 px-4 py-2 items-center justify-center rounded-lg! text-sm! ${orden === "recientes" ? "bg-sky-50 border border-sky-500! text-sky-600 font-semibold" : "bg-slate-100 border border-slate-200 text-slate-900"}`}
                        >
                            <CalendarArrowUp size={18} strokeWidth={2} />
                            Más recientes primero
                        </button>

                        <button
                            onClick={() => setOrden("antiguas")}
                            className={`flex flex-row gap-2 px-4 py-2 items-center justify-center rounded-lg! text-sm! ${orden === "antiguas" ? "bg-sky-50 border border-sky-500! text-sky-600 font-semibold" : "bg-slate-100 border border-slate-200 text-slate-900"}`}
                        >
                            <CalendarArrowDown size={18} strokeWidth={2} />
                            Más antiguas primero
                        </button>
                    </div>
                </div>

                <div className="incidencias-filters">
                    <button
                        type="button"
                        className={`incidencias-filter-btn ${filtroEstado === "todas" ? "is-active" : ""}`}
                        onClick={restablecerFiltros}
                    >
                        Todas
                    </button>
                    <button
                        type="button"
                        className={`incidencias-filter-btn ${filtroEstado === "resuelta" ? "is-active is-success" : ""}`}
                        onClick={() => setFiltroEstado("resuelta")}
                    >
                        Resueltas
                    </button>
                    <button
                        type="button"
                        className={`incidencias-filter-btn ${filtroEstado === "pendiente" ? "is-active is-warning" : ""}`}
                        onClick={() => setFiltroEstado("pendiente")}
                    >
                        Pendientes
                    </button>
                </div>

                {!loading && (
                    <TenantRequestsTable
                        requests={incidencias}
                        obtainUrlMedia={obtenerUrlMedia}
                        openEvidence={abrirEvidencia}
                        onActionCompleted={handleSuccess}
                        tenantId={loggedUserId}
                    />
                )}
            </div>
        </>
    );
};

export default TenantRequests;