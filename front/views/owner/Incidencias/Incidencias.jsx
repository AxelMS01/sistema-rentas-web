import { useEffect, useMemo, useState } from "react";
import "./Incidencias.css";
import LoadingStatus from "../../../components/LoadingStatus";
import SearchBar from "../../../components/SearchBar";
import { Button, Spinner } from "flowbite-react";
import { CalendarArrowDown, CalendarArrowUp } from "lucide-react";
import RequestsTable from "../../../components/requests/RequestsTable";
import { supabase } from "../../../config/supabase-client";
import useUser from "../../../stores/user-store";

const leerRespuesta = async (response) => {
  const text = await response.text();

  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return { raw: text };
  }
};

const normalizarIncidencia = (incidencia) => ({
  id: incidencia?.id ?? incidencia?.requestid ?? Date.now(),
  status:
    incidencia?.status === "resuelta" ||
      String(incidencia?.status || "").toUpperCase() === "COMPLETED"
      ? "resuelta"
      : "pendiente",
  fecha:
    incidencia?.fecha ||
    incidencia?.requestdate ||
    incidencia?.request_date ||
    new Date().toISOString(),
  img:
    incidencia?.img ||
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400",
  ubicacion:
    incidencia?.ubicacion ||
    incidencia?.apartment_address ||
    "Sin ubicacion",
  arrendatario:
    incidencia?.arrendatario ||
    incidencia?.tenant_name ||
    "Sin asignar",
  avatar: incidencia?.avatar || null,
  descripcion:
    incidencia?.descripcion ||
    incidencia?.description ||
    "Sin descripcion",
  media: Array.isArray(incidencia?.media) ? incidencia.media : [],
});

const obtenerMarcaTiempo = (fecha) => {
  const timestamp = new Date(fecha).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
};

const Incidencias = () => {
  const loggedUserId = useUser((state) => state.loggedUser);
  const obtenerToken = () => localStorage.getItem("token") || "";
  const [incidenciasData, setIncidenciasData] = useState([]);
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("all");
  const [orden, setOrden] = useState("recientes");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

        if (filtroEstado === "all") {
          const { data, error } = await supabase
            .from("maintenancerequests")
            .select()
            .eq("owner_id", loggedUserId);

          if (error) throw error;

          setIncidenciasData(data);
        } else {
          const { data, error } = await supabase
            .from("maintenancerequests")
            .select()
            .eq("owner_id", loggedUserId)
            .eq("status", filtroEstado);

          if (error) throw error;

          setIncidenciasData(data);
        }
      } catch (err) {
        if (err.name === "AbortError") {
          return;
        }
        console.error(err);
        setError(err.message || "No se pudieron cargar las incidencias");
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    cargarIncidencias();

    return () => {
      controller.abort();
    };
  }, [filtroEstado]);

  return (
    <>
      <div className="w-full h-screen flex flex-col gap-4! lg:px-20! sm:px-16! px-8! py-10">
        <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
          <div className="header flex flex-col gap-2">
            <h1 className="text-start font-light fw-semibold tracking-tight">Incidencias</h1>
            <p className="text-base font-normal text-slate-500 text-start">Consulta aquí todas las incidencias reportadas en el sistema.</p>
          </div>
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
              className={`flex flex-row gap-2 px-4 py-2 items-center justify-center rounded-lg! text-sm! ${orden === "recientes" ? "bg-sky-600 text-white font-medium" : "bg-slate-100 border border-slate-200 text-slate-900"}`}
            >
              <CalendarArrowUp size={18} strokeWidth={2} />
              Más recientes primero
            </button>

            <button
              onClick={() => setOrden("antiguas")}
              className={`flex flex-row gap-2 px-4 py-2 items-center justify-center rounded-lg! text-sm! ${orden === "antiguas" ? "bg-sky-600 text-white font-medium" : "bg-slate-100 border border-slate-200 text-slate-900"}`}
            >
              <CalendarArrowDown size={18} strokeWidth={2} />
              Más antiguas primero
            </button>
          </div>
        </div>

        <div className="incidencias-filters">
          <button
            type="button"
            className={`incidencias-filter-btn ${filtroEstado === "all" ? "is-active" : ""}`}
            onClick={() => setFiltroEstado("all")}
          >
            Todas
          </button>
          <button
            type="button"
            className={`incidencias-filter-btn ${filtroEstado === "solved" ? "is-active is-success" : ""}`}
            onClick={() => setFiltroEstado("solved")}
          >
            Resueltas
          </button>
          <button
            type="button"
            className={`incidencias-filter-btn ${filtroEstado === "pending" ? "is-active is-warning" : ""}`}
            onClick={() => setFiltroEstado("pending")}
          >
            Pendientes
          </button>
        </div>

        {loading && (
              <div className="flex flex-row gap-2 self-center">
                  <p className="text-base! font-medium text-slate-900">Cargando incidencias...</p>
          
                  <Spinner size="md"/>
              </div>
        )}

        {!loading && (
          <RequestsTable searchValue={filtroBusqueda} requests={incidenciasData} obtainUrlMedia={obtenerUrlMedia} openEvidence={abrirEvidencia} />
        )}
      </div>
    </>
  );
};

export default Incidencias;
