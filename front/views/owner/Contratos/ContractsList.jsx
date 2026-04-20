import { useState, useEffect } from "react";
import "./ContractsList.css";
import ContractsTable from "../../../components/contracts/ContractsTable";
import EditarContratoModal from "../Forms/EditarContratoModal";
import { supabase } from "../../../config/supabase-client";
import SearchBar from "../../../components/SearchBar";
import useUser from "../../../stores/user-store";
import Button from "../../../components/Button";
import NewContractModal from "../../../components/contracts/NewContractModal";
import { LuPlus } from "react-icons/lu";

export const token = localStorage.getItem("token");

const Contracts = () => {
  const loggedUserId = useUser((state) => state.loggedUser);

  const [contratos, setContratos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreationModal, setShowCreationModal] = useState(false);

  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [filtroBusqueda, setFiltroBusqueda] = useState("");
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
  const [editingContractId, setEditingContractId] = useState(null);

  const [editData, setEditData] = useState();

  useEffect(() => {
    setPaginaActual(1); // Reset to first page on filter change
  }, [filtroStatus, filtroBusqueda]);

  {/* in this part you can change the number of items that appears in one page */ }
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 5; //only you need to change this number for change the items per page

  // ⬇ Fetch data from backend on page load
  const fetchData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.
        from("rentalcontracts").
        select()
        .eq("owner_id", loggedUserId);

      if (error) throw error;

      setContratos(data);

    } catch (err) {
      console.error(err);
      setError("Error loading contratos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleContractUpdated = (updatedContract) => {
    setEditingContractId(null);
    fetchData();
  };

  const formatDate = (date) => {
    if (!date) return ""; // ← If null, return nothing
    return new Date(date).toLocaleDateString("es-MX");
  };

  if (loading) return <div className="text-center py-5">Cargando datos...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  function handleOpenEdit(editContractData) {
    console.log(editContractData);
    setEditData(editContractData);
    setShowCreationModal(true);
  };

  // ------------------------------
  //  NORMAL RENDER
  // ------------------------------

  return (
    <div className="w-full h-screen flex flex-col gap-4! lg:px-20! sm:px-16! px-8! py-10">
      {showCreationModal && (
        <NewContractModal isModalOpen={showCreationModal} onCloseModal={() => setShowCreationModal(false)} isOnEditData={editData} />
      )}

      <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
        <div className="header flex flex-col gap-2">
          <h1 className="text-start font-light fw-semibold tracking-tight">Contratos</h1>
          <p className="text-base font-normal text-slate-500 text-start">Consulta los contratos que han sido generados en el sistema.</p>
        </div>

        <Button
          text="Agregar contrato"
          icon={<LuPlus size={18} />}
          onClick={() => setShowCreationModal(true)}
        />
      </div>

      <div className="flex flex-row w-full items-start">
        <SearchBar
          placeholder="Buscar un contrato..."
          value={filtroBusqueda}
          onChange={(e) => setFiltroBusqueda(e.target.value)}
        />
      </div>

      <ContractsTable contracts={contratos} onEdit={handleOpenEdit} finishLoading={() => setLoading(false)} />

      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center gap-3 footer-pagination mt-4">
        <span className="text-muted small">Mostrando {contratos.length} contratos</span>

        <nav>
          <ul className="pagination pagination-sm mb-0">
            <li className="page-item disabled">
              <a className="page-link" href="#">‹</a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">1</a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">›</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Contracts;
