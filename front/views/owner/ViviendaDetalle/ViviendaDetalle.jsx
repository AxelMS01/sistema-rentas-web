import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { LuHand, LuHouse, LuInfo, LuSettings, LuArrowLeft, LuSquarePen, LuArchive, LuArchiveRestore, LuCircleCheck, LuCircleDot } from "react-icons/lu";
import toast, { Toaster } from 'react-hot-toast';
import CreateTenantModal from "../../../components/apartments/CreateTenantModal";
import mensajeExito from "../../../utils/mensaje-exito";
import EditarForm from "../Forms/Editarform";
import { Button } from "flowbite-react";
import "./ViviendaDetalle.css";
import { supabase } from "../../../config/supabase-client";
import useUser from "../../../stores/user-store";
import useContractData from "../../../lib/useContractData";
import { Download } from "lucide-react";
import { DocumentoContrato } from "../../../components/pdf-documents/Machotes/Contrato/Contrato";

const token = localStorage.getItem("token");

const formatDate = (date) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString("es-MX");
};

const statusLabel = (status) => {
  if (status === "AVAILABLE") return "Disponible";
  if (status === "OCCUPIED") return "Ocupada";
  if (status === "ARCHIVED") return "Archivada";
  return status || "-";
};

const statusClass = (status) => {
  if (status === "AVAILABLE") return "is-available";
  if (status === "OCCUPIED") return "is-occupied";
  if (status === "ARCHIVED") return "is-archived";
  return "";
};

export default function ViviendaDetalle() {
  const ownerId = useUser((state) => state.loggedUser);
  const emptyTenantForm = {
    name: "",
    father_surname: "",
    mother_surname: "",
    phone: "",
    email: "",
    governmentid: "",
    password: ""
  };

  const { id } = useParams();
  const { state } = useLocation();

  const [vivienda, setVivienda] = useState(state?.propiedad || null);
  const [loading, setLoading] = useState(!state?.propiedad);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState("");
  const [tenantForm, setTenantForm] = useState(emptyTenantForm);
  const [tenantSaving, setTenantSaving] = useState(false);
  const [tenantMsg, setTenantMsg] = useState("");
  const [isOnEdit, setIsOnEdit] = useState(false);
  const [tenantCreation, setTenantCreation] = useState(false);
  const [successfulAction, setSuccessfulAction] = useState(0);
  const [isAccountCreated, setIsAccountCreated] = useState(false); // Indicates whether the tenant's system account has already been created or not.

  // Fetch the necessary contract's data using the created hook.
  const {
    isDataLoading,
    contractInfo,
    ownerInfo,
    tenantInfo,
    guarantorInfo,
    apartmentInfo
  } = useContractData("owners", ownerId);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("apartments")
          .select()
          .eq("id", id);

        if (error) throw error;

        setVivienda(data[0]);
      } catch (err) {
        console.error(err);
        setError("No fue posible cargar los detalles de la vivienda.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, successfulAction]);

  if (loading) return <div className="text-center py-5">Cargando detalles...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

  function onCreateTenant() {
    toast.success("¡Arrendatario creado!");
    setTenantCreation(false);
    setSuccessfulAction(successfulAction + 1);
  };

  const cambiarEstado = () => {
    setVivienda((prev) => ({
      ...prev,
      status: prev.status === "OCCUPIED" ? "AVAILABLE" : "OCCUPIED"
    }));
  };

  const archivarVivienda = () => {
    setVivienda((prev) => ({
      ...prev,
      status: prev.status === "ARCHIVED" ? "AVAILABLE" : "ARCHIVED"
    }));
  };

  const guardarStatus = async () => {
    if (!vivienda?.id || saving) return;

    setSaving(true);
    setSaveMsg("");

    try {
      const { error } = await supabase
        .from("apartments")
        .update({
          status: vivienda.status
        })
        .eq("id", id);

      if (error) throw error;
    } catch (error) {
      console.log("An error ocurred:", error);
    } finally {
      mensajeExito("¡Estatus actualizado!");
      setSaving(false);
    };
  };

  const guardarArrendatario = async (e) => {
    e.preventDefault();
    if (tenantSaving || !vivienda?.id) return;

    if (!tenantForm.name.trim() || !tenantForm.governmentid.trim()) {
      setTenantMsg("Nombre e identificación oficial son obligatorios.");
      return;
    }

    const isEditingTenant = Boolean(vivienda?.tenant_id);
    if (!isEditingTenant && !tenantForm.password.trim()) {
      setTenantMsg("Para crear una cuenta debes capturar una contraseña.");
      return;
    }

    setTenantSaving(true);
    setTenantMsg("");

    try {
      const editPayload = {
        name: tenantForm.name.trim(),
        phone: tenantForm.phone.trim(),
        email: tenantForm.email.trim(),
        governmentid: tenantForm.governmentid.trim()
      };

      const { data, error } = await supabase.auth.signUp({
        email: tenantForm.email.trim(),
        password: tenantForm.password.trim(),
        options: {
          data: {
            user_type: "tenant",
            name: tenantForm.name,
            father_surname: tenantForm.father_surname,
            mother_surname: tenantForm.mother_surname,
            phone: tenantForm.phone,
            email: tenantForm.email,
            governmentid: tenantForm.governmentid,
            role: "tenant",
            owner_id: ownerId,
            apartment_id: id,
          }
        },
      });

      if (error) console.log(error);
    } catch (err) {
      console.error(err);
      setTenantMsg(err.message || "Error al gestionar la cuenta.");
    } finally {
      setTenantSaving(false);
      mensajeExito("Cuenta creada para el arrendatario.");

    }
  };

  function finishUpdate(updatedHousing) {
    setIsOnEdit(false);
    mensajeExito("¡Vivienda actualizada!");
    setVivienda(updatedHousing);
  };

  const mainImage =
    vivienda?.main_image ||
    vivienda?.image ||
    "https://th.bing.com/th/id/OIP.6XIv3DVREt05mi0sSNtUDgHaE8?o=7rm=3&rs=1&pid=ImgDetMain&o=7&rm=3";
  const isArchived = vivienda?.status === "ARCHIVED";
  const isOccupied = vivienda?.status === "OCCUPIED";

  return (
    <div className="w-full h-full flex flex-col gap-6! lg:px-20! sm:px-14 px-8 py-10 items-start">
      <Link to="/viviendas" style={{ textDecoration: "none" }} className="flex flex-row gap-2 items-center justify-center w-auto self-start m-0 bg-white border border-slate-200 px-3 py-2 rounded-md">
        <LuArrowLeft className="text-sky-600" size={18} />

        <p className="text-start font-semibold text-sky-600 m-0! text-sm">
          Regresar a todas las viviendas
        </p>
      </Link>

      <div className="flex w-full lg:flex-row flex-col justify-between! lg:items-center! items-start gap-6">
        <div className="flex flex-col items-start gap-2">
          <h1 className="text-start font-light fw-semibold tracking-tight">Viviendas</h1>
          <p className="text-base font-medium text-slate-500 text-start">Visualiza las viviendas registradas en el sistema fácil y rápidamente.</p>
        </div>

        <button
          type="button"
          className="bg-sky-600 flex flex-row gap-2 px-3 py-2 rounded-md! items-center justify-center text-sm! text-white font-medium"
          data-bs-toggle="modal"
          data-bs-target="#tenantAccountModal"
          onClick={() => setTenantCreation(true)}
        >
          <LuSettings size={18} />
          Gestionar cuenta de arrendatario
        </button>
      </div>

      <Toaster />

      <div className="w-full grid grid-cols-3 gap-4">
        <div className="general-detail lg:col-span-2 col-span-3 w-full bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-4 justify-start">
          <div className="card-header flex flex-row gap-2 items-center justify-start w-full">
            <LuHouse size={21} strokeWidth={2.5} />

            <h1 className="text-2xl! m-0! font-semibold! text-start text-wrap">
              Datos Generales
            </h1>
          </div>

          <div className="flex flex-col gap-2 w-full justify-start">
            <p className="text-base font-medium! w-auto text-start text-slate-500">Dirección:</p>
            <p className="text-base font-medium! w-auto text-start text-slate-950">{vivienda ? `${vivienda.street || ''} ${vivienda.int_num || ''}, ${vivienda.division || ''} C.P. ${vivienda.postal_code || ''}`.trim() : "-"}</p>
          </div>

          <div className="flex flex-col gap-4 w-full justify-start">
            <p className="text-base font-medium! w-auto text-start text-slate-500">Imagen principal:</p>
            <div className="main-image-wrap">
              <img src={mainImage} alt="Vivienda" className="main-image" />
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col gap-4 lg:col-span-1 col-span-3">
          <div className="general-detail w-full bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-4 justify-start">
            <div className="card-header flex flex-row gap-2 items-center justify-start w-full">
              <LuInfo size={21} strokeWidth={2.5} />

              <h1 className="text-2xl! m-0! font-semibold!">
                Información
              </h1>
            </div>

            <div className="flex md:flex-row gap-4 items-center w-full justify-between">
              <span className="info-key">Precio de renta</span>
              <span className="info-value text-success fw-bold">
                {vivienda?.depositamount ? `$${vivienda.depositamount.toLocaleString("en-US")}` : "-"}
              </span>
            </div>

            <div className="flex md:flex-row gap-4 items-center w-full justify-between">
              <span className="info-key">Arrendatario</span>
              <span className="info-value">{vivienda?.tenant_name || "-"}</span>
            </div>

            <div className="flex md:flex-row gap-4 items-center w-full justify-between">
              <span className="info-key">Fecha de pago</span>
              <span className="info-value">{formatDate(vivienda?.latest_due_date)}</span>
            </div>

            <div className="flex md:flex-row gap-4 items-center w-full justify-between">
              <span className="info-key">Estado</span>
              <span className={`status-pill ${statusClass(vivienda?.status)}`}>
                <span className="status-solid-dot"></span>
                {statusLabel(vivienda?.status)}
              </span>
            </div>

            {vivienda.status === "OCCUPIED" && (
              <div className="flex flex-col gap-4 justify-start">
                <div className="flex md:flex-row gap-4 items-center w-full justify-between">
                  <span className="info-key">Contrato</span>

                  <PDFDownloadLink document={
                    <DocumentoContrato
                      contractInfo={contractInfo}
                      ownerInfo={ownerInfo}
                      tenantInfo={tenantInfo}
                      guarantorInfo={guarantorInfo}
                      apartmentInfo={apartmentInfo}
                    />
                  } className="no-underline!" fileName={`Contrato-${contractInfo.id}`}>
                    <Button
                      type="button"
                      color="alternative"
                      className="flex flex-row gap-2 px-3! py-2!  rounded-md! items-center justify-center text-sm! font-medium"
                    >
                      <Download size={18} />
                      Descargar en PDF
                    </Button>
                  </PDFDownloadLink>
                </div>

                <div className="flex md:flex-row gap-4 items-center w-full justify-between">
                  <span className="info-key">Pagarés</span>

                  <Button
                    type="button"
                    color="alternative"
                    className="flex flex-row gap-2 px-3! py-2! rounded-md! items-center justify-center text-sm! font-medium"
                    onClick={() => setTenantCreation(true)}
                  >
                    <Download size={18} />
                    Descargar en PDF
                  </Button>
                </div>
              </div>
            )}


          </div>

          <div className="general-detail w-full bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-4 justify-start">
            <div className="card-header flex flex-row gap-2 items-center justify-start w-full">
              <LuHand size={20} strokeWidth={2.5} />

              <h1 className="text-2xl! m-0! font-semibold!">
                Acciones
              </h1>
            </div>

            <div className="actions-row">
              <button
                type="button"
                className="small-action-btn"
                data-bs-target="#editModal"
                onClick={() => setIsOnEdit(true)}
              >
                <LuSquarePen size={18} />
                Editar
              </button>

              <button
                type="button"
                className={`small-action-btn status-action-btn ${vivienda?.status === "ARCHIVED" ? "is-active archived" : ""}`}
                onClick={archivarVivienda}
              >
                {vivienda?.status === "ARCHIVED" ? (
                  <>
                    <LuArchiveRestore size={18} />
                    <p>Desarchivar</p>
                  </>
                ) : (
                  <>
                    <LuArchive size={18} />
                    <p>Archivar</p>
                  </>
                )}
              </button>

              <button
                type="button"
                className={`small-action-btn status-action-btn ${isArchived ? "is-active archived" : isOccupied ? "is-active occupied" : "is-active available"
                  }`}
                onClick={() => {
                  if (isArchived) return;
                  cambiarEstado();
                }}
                disabled={isArchived}
              >
                {isArchived && (
                  <>
                    <LuArchive size={18} />
                    <p>Archivada</p>
                  </>
                )}

                {isOccupied && (
                  <>
                    <LuCircleDot size={18} />
                    <p>Ocupada</p>
                  </>
                )}

                {!isArchived && !isOccupied && (
                  <>
                    <LuCircleCheck size={18} />
                    <p>Disponible</p>
                  </>
                )}
              </button>
            </div>

            <div>
              <Button color="default" className="text-white! rounded-md! px-3 py-1.5 bg-sky-600 text-sm!" size="sm" onClick={guardarStatus} >Guardar estatus</Button>
            </div>
          </div>
        </div>
      </div>

      {isOnEdit && (
        <EditarForm
          apartment={vivienda}
          onClose={() => setIsOnEdit(false)}
          onUpdated={finishUpdate}
        />
      )}

      <CreateTenantModal isModalOpen={tenantCreation} onCreateSuccess={onCreateTenant} onCloseModal={() => setTenantCreation(false)} />
    </div>
  );
}
