import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TbContract } from "react-icons/tb";
import { LuHouse, LuPlus } from "react-icons/lu";
import { Toaster } from "react-hot-toast";
import "./AparmentList.css";
import { DocumentoPagare } from "../../../components/pdf-documents/Machotes/Pagares/Pagare";
import { DocumentoContrato } from "../../../components/pdf-documents/Machotes/Contrato/Contrato";
import ViviendaForm from "../Forms/Viviendaform";
import EditApartmentModal from "../Forms/Editarform";
import ContractWizardModal from "../Forms/ContratoWizardform";
import { Modal } from 'bootstrap';
import { PDFViewer, Page, Document, Text, View } from '@react-pdf/renderer';
import useUser from "../../../stores/user-store";
import Button from "../../../components/Button";
import mensajeExito from "../../../utils/mensaje-exito";
import StatusButton from "../../../components/apartments/ApartmentStatusBtn";
import { Search, UserCircle, Archive, ArchiveRestore, SquarePen, CircleDot, CircleCheck } from 'lucide-react';
import { supabase } from "../../../config/supabase-client";

const Viviendas = () => {
  const [signUrl, setSignUrl] = useState();
  const [propiedades, setPropiedades] = useState([]);
  const [showPropiertiesModal, setShowPropiertiesModal] = useState(false);
  const [showContractModal, setShowContractModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionCompleted, setActionCompleted] = useState(0);
  const loggedUserId = useUser((state) => state.loggedUser);

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [contractApartmentId, setContractApartmentId] = useState(null);

  const handleSelect = (apartment) => {
    setSelectedApartment(apartment);
  };

  useEffect(() => {
    if (!selectedApartment) return;

    const modalEl = document.getElementById('editModal');
    if (!modalEl) return;

    const modal = new Modal(modalEl);
    modal.show();
  }, [selectedApartment]);

  useEffect(() => {
    setPaginaActual(1); // Reset to first page on filter change
  }, [filtroStatus, filtroBusqueda]);

  {/* in this part you can change the number of items that appears in one page */ }
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5; //only you need to change this number for change the items per page

  // ⬇ Fetch data from backend on page load
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await supabase.
          from("apartments")
          .select()
          .eq("ownerid", loggedUserId);

        setPropiedades(data);
      } catch (err) {
        console.error(err);
        setError("Error loading viviendas");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [actionCompleted]);

  const formatDate = (date) => {
    if (!date) return ""; // ← If null, return nothing
    return new Date(date).toLocaleDateString("es-MX");
  };
  // ------------------------------
  //  Helpers to modify UI locally
  // ------------------------------

  async function cambiarEstado(id, nuevoEstado) {
    try {
      const { error } = await supabase
        .from("apartments")
        .update({
          status: nuevoEstado
        })
        .eq("id", id);

      if (error) throw error;

    } catch (error) {
      console.log("An error ocurred:", error)
    } finally {
      setPropiedades(prev =>
        prev.map((p) =>
          p.id === id
            ? { ...p, status: nuevoEstado }
            : p
        )
      );

      mensajeExito("Estatus actualizado.")
    }
  };

  const getStatusDot = (status) => {
    switch (status) {
      case "AVAILABLE":
        return "status-dot status-disponible";
      case "OCCUPIED":
        return "status-dot status-ocupado";
      case "ARCHIVED":
        return "status-dot status-archivado";
      default:
        return "";
    }
  };

  const agregarPropiedad = (nueva) => {
    setPropiedades(prev => [...prev, nueva]);
  };
  const handleApartmentCreated = (newApartment) => {
    mensajeExito("¡Vivienda creada correctamente!");
    agregarPropiedad(newApartment);
    setShowPropiertiesModal(false);

    // Update this state variable to refetch the data in the main useEffect.
    setActionCompleted(actionCompleted + 1);
  };

  const actualizarPropiedad = (propActualizada) => {
    setPropiedades(prev =>
      prev.map((p) =>
        p.id === propActualizada.id ? propActualizada : p
      )
    );
  };

  //  Filtering logic

  const propiedadesFiltradas = propiedades
    .filter((p) => filtroStatus === "todos" || p.status === filtroStatus)
    .filter((p) => {
      const texto = filtroBusqueda.toLowerCase();
      const addressString = `${p.street || ''} ${p.ext_num || ''} ${p.division || ''} ${p.postal_code || ''}`.toLowerCase();
      return (
        addressString.includes(texto) ||
        p.id.toString().includes(texto)
      );
    });


  const indexInicio = (paginaActual - 1) * itemsPorPagina;
  const indexFin = indexInicio + itemsPorPagina;
  const propiedadesPaginadas = propiedadesFiltradas.slice(indexInicio, indexFin);
  const totalPaginas = Math.ceil(propiedadesFiltradas.length / itemsPorPagina);
  // ------------------------------
  //  UI States: Loading and Error
  // ------------------------------

  if (loading) return <div className="text-center py-5">Cargando datos...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  // ------------------------------
  //  NORMAL RENDER
  // ------------------------------

  return (
    <div className="w-full h-full flex flex-col gap-4! lg:px-20! pt-10">
      <div className="flex flex-col items-start">
        <h1 className="text-start font-light fw-semibold tracking-tight">Viviendas</h1>
        <p className="text-base font-medium text-slate-500">Visualiza las viviendas registradas en el sistema fácil y rápidamente.</p>
      </div>

      {/* Search + Add */}
      <div className="apartments-toolbar d-flex justify-content-between align-items-center mb-3">
        <div className="search-pill d-flex align-items-center">
          <Search size={16} className="mr-2" />
          <input
            type="text"
            className="search-input"
            placeholder="Buscar..."
            value={filtroBusqueda}
            onChange={(e) => setFiltroBusqueda(e.target.value)}
          />
        </div>

        <Toaster toastOptions={{
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }
        }} />

        <Button
          text="Nueva vivienda"
          icon={<LuPlus size={18} />}
          onClick={() => setShowPropiertiesModal(true)}
        />

        <ViviendaForm
          show={showPropiertiesModal}
          onClose={() => setShowPropiertiesModal(false)}
          onCreated={handleApartmentCreated}
        />
        {selectedApartment && (
          <EditApartmentModal
            apartment={selectedApartment}
            onClose={() => setSelectedApartment(null)}
            onUpdated={(updated) => {
              setPropiedades(prev =>
                prev.map(a => a.id === updated.id ? updated : a)
              );
              setSelectedApartment(null);
              mensajeExito("¡Vivienda actualizada!");
            }}
          />
        )}
        <ContractWizardModal
          show={showContractModal}
          onClose={() => setShowContractModal(false)}
          selectedApartmentId={contractApartmentId}

        />
      </div>

      {/*
        <PDFViewer width={500} height={800}>
          <DocumentoContrato />
        </PDFViewer>
        */}

      {/* Filter buttons */}
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center justify-start w-auto self-start">
        <StatusButton onClick={() => setFiltroStatus("todos")} isActive={filtroStatus === "todos"} status={"all"} />
        <StatusButton onClick={() => setFiltroStatus("AVAILABLE")} isActive={filtroStatus === "AVAILABLE"} status={"AVAILABLE"} />
        <StatusButton onClick={() => setFiltroStatus("OCCUPIED")} isActive={filtroStatus === "OCCUPIED"} status={"OCCUPIED"} />
        <StatusButton onClick={() => setFiltroStatus("ARCHIVED")} isActive={filtroStatus === "ARCHIVED"} status={"ARCHIVED"} />
      </div>

      {/* Table header */}
      <div className="row table-header mb-2 d-none d-lg-flex fw-bold text-muted px-3">
        <div className="col-lg-3">Ubicación</div>
        <div className="col-lg-2 text-center">Arrendatario</div>
        <div className="col-lg-2">Fecha de Pago</div>
        <div className="col-lg-5 text-end">Acciones</div>
      </div>

      {/* Property list */}
      {propiedadesPaginadas.map((prop) => {

        return (
          <div className="row property-card responsive-card mx-0 mb-3 mb-lg-0" key={prop.id}>
            <div className="col-12 col-lg-3 d-flex align-items-center border-end-lg pb-3 pb-lg-0">
              <span className={getStatusDot(prop.status)}></span>
              <img
                src="https://th.bing.com/th/id/OIP.6XIv3DVREt05mi0sSNtUDgHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3"
                className="property-img me-2"
                alt="Departamento"
              />
              <div>
                <p className="mb-1 fw-semibold">{`${prop.street || ''} ${prop.ext_num || ''}, ${prop.division || ''}`.trim()}</p>
                <small>{prop.depositamount ? prop.depositamount.toLocaleString('en-US') : ''}$</small>
              </div>
            </div>

            <div className="col-12 col-lg-2 d-flex align-items-center justify-content-lg-center flex-row flex-lg-column gap-2 gap-lg-0 border-end-lg py-2 py-lg-0">
              <span className="d-lg-none fw-bold mobile-label">Arrendatario:</span>
              <UserCircle className="mb-2" />
              <span>{prop.tenant_name ? prop.tenant_name : "Sin asignar"}</span>
            </div>

            <div className="col-12 col-lg-2 d-flex align-items-center border-end-lg py-2 py-lg-0 gap-2">
              <span className="d-lg-none fw-bold mobile-label">Fecha de Pago:</span>
              <span>{prop.latest_due_date ? formatDate(prop.latest_due_date) : '-'}</span>
            </div>

            {/* Buttons */}
            <div className="col-12 col-lg-5 d-flex flex-column flex-sm-row justify-content-lg-end align-items-stretch align-items-sm-center gap-3 pt-3 pt-lg-0">
              <div className="actions-stack-box w-100 flex-sm-grow-1 flex-lg-grow-0">
                <button
                  className="box-action-btn"
                  onClick={() => handleSelect(prop)}
                >
                  <SquarePen size={16} />
                  Editar
                </button>

                {prop.status === "ARCHIVED" ? (
                  <button className="box-action-btn" onClick={() => cambiarEstado(prop.id, "AVAILABLE")}>
                    <Archive size={16} />
                    Desarchivar
                  </button>
                ) : (
                  <button className="box-action-btn" onClick={() => cambiarEstado(prop.id, "ARCHIVED")}>
                    <ArchiveRestore size={16} />
                    Archivar
                  </button>
                )}

                {prop.status === "OCCUPIED" ? (
                  <button className="box-action-btn" onClick={() => cambiarEstado(prop.id, "AVAILABLE")}>
                    <CircleDot size={16} />
                    Ocupado
                  </button>
                ) : (
                  <button className="box-action-btn" onClick={() => cambiarEstado(prop.id, "OCCUPIED")}>
                    <CircleCheck size={16} />
                    Disponible
                  </button>
                )}
              </div>

              <div className="contract-links-stack w-100 flex-sm-grow-1 flex-lg-grow-0">
                {prop.tenant_name ?
                  <Link to={"/contratos/" + prop.rc_id} className="contract-link-text-btn ">
                    <TbContract size={16} />
                    Datos del contrato
                  </Link>
                  :
                  <button
                    type="button"
                    className="contract-link-text-btn"
                    onClick={() => { setContractApartmentId(prop.id); setShowContractModal(true); }}
                  >
                    <TbContract size={16} />
                    Agregar Contrato
                  </button>}


                <Link
                  to={`/viviendas/${prop.id}/detalles`}
                  state={{ propiedad: prop }}
                  className="contract-link-text"
                >
                  <LuHouse size={16} />
                  Datos de la vivienda
                </Link>
              </div>
            </div>
          </div>
        )
      })}

      {/* Pagination */}
      <nav className="mt-4">
        <ul className="pagination justify-content-center custom-pagination">
          {Array.from(
            { length: Math.ceil(propiedadesFiltradas.length / itemsPorPagina) },
            (_, idx) => (
              <li
                key={idx + 1}
                className={`page-item ${paginaActual === idx + 1 ? "active" : ""}`}>
                <button
                  className="page-link"
                  onClick={() => setPaginaActual(idx + 1)}>
                  {idx + 1}
                </button>
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};

export default Viviendas;
