import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { TbContract } from "react-icons/tb";
import { LuHouse, LuPlus } from "react-icons/lu";
import toast, { Toaster } from "react-hot-toast";
import SearchBar from "../../../components/SearchBar";
import { Table, TableBody, TableCell, TableHead, TableHeadCell, TableRow } from "flowbite-react";
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
import ApartmentTable from "../../../components/apartments/ApartmentsTable";
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

  function onApartmentDeleted() {
    setActionCompleted(actionCompleted + 1);
    toast.success("Vivienda eliminada correctamente");
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

  function onAddContract(apartmentId) {
    setContractApartmentId(apartmentId);
    setShowContractModal(true);

  };

  return (
    <div className="w-full h-screen flex flex-col gap-4! lg:px-20! sm:px-16! px-8! py-10">
      <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
        <div className="header flex flex-col gap-2">
          <h1 className="text-start font-semibold! tracking-tight">Viviendas</h1>
          <p className="text-base font-normal text-slate-500 text-start">Visualiza las viviendas registradas en el sistema fácil y rápidamente.</p>
        </div>

        <Button
          text="Nueva vivienda"
          icon={<LuPlus size={18} />}
          onClick={() => setShowPropiertiesModal(true)}
        />
      </div>

      {/*Modales */}
      <Toaster toastOptions={{
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }
      }} />

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
            setActionCompleted(actionCompleted + 1);
            mensajeExito("¡Vivienda actualizada!");
          }}
        />
      )}
      <ContractWizardModal
        show={showContractModal}
        onClose={() => setShowContractModal(false)}
        selectedApartmentId={contractApartmentId}
      />

      {/* Search + Filters */}
      <div className="flex md:flex-row flex-col gap-4 justify-between md:items-center items-start">
        <SearchBar value={filtroBusqueda} onChange={(e) => setFiltroBusqueda(e.target.value)} placeholder="Buscar por ubicación" />

        {/* Filter buttons */}
        <div className="grid lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-2 items-center justify-start sm:w-auto w-full self-start bg-white p-2 border border-slate-200 rounded-lg">
          <StatusButton onClick={() => setFiltroStatus("todos")} isActive={filtroStatus === "todos"} status={"all"} />
          <StatusButton onClick={() => setFiltroStatus("AVAILABLE")} isActive={filtroStatus === "AVAILABLE"} status={"AVAILABLE"} />
          <StatusButton onClick={() => setFiltroStatus("OCCUPIED")} isActive={filtroStatus === "OCCUPIED"} status={"OCCUPIED"} />
          <StatusButton onClick={() => setFiltroStatus("ARCHIVED")} isActive={filtroStatus === "ARCHIVED"} status={"ARCHIVED"} />
        </div>
      </div>

      <ApartmentTable
        apartments={propiedadesPaginadas}
        onEditClick={handleSelect}
        onRestoreClick={cambiarEstado}
        onArchiveClick={cambiarEstado}
        onOccupiedClick={cambiarEstado}
        onAvailableClick={cambiarEstado}
        onAddContractClick={onAddContract}
        onApartmentDeletion={onApartmentDeleted}
      />

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
    </div >
  );
};

export default Viviendas;
