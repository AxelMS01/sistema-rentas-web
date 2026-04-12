import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { LuHand, LuHouse, LuInfo, LuSettings, LuArrowLeft, LuSquarePen, LuArchive, LuArchiveRestore, LuCircleCheck, LuCircleDot } from "react-icons/lu";
import { Toaster } from 'react-hot-toast';
import mensajeExito from "../../../utils/mensaje-exito";
import EditarForm from "../Forms/Editarform";
import Button from "../../../components/Button";
import "./ViviendaDetalle.css";
import { supabase } from "../../../config/supabase-client";
import useUser from "../../../stores/user-store";

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

  useEffect(() => {
    const fetchVivienda = async () => {
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

    fetchVivienda();
  }, [id]);

  if (loading) return <div className="text-center py-5">Cargando detalles...</div>;
  if (error) return <div className="text-center py-5 text-danger">{error}</div>;

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

  const abrirGestionArrendatario = async () => {
    if (!vivienda) return;

    setTenantMsg("");
    setTenantForm({
      ...emptyTenantForm,
      name: vivienda.tenant_name || "",
      phone: vivienda.tenant_phone || "",
      email: vivienda.tenant_email || ""
    });

    if (!vivienda.tenant_id) return;

    try {
      /*
      const res = await fetch(`${REACT_APP_API_URL}/tenants/${vivienda.tenant_id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();
      setTenantForm((prev) => ({
        ...prev,
        name: data?.name || prev.name,
        phone: data?.phone || prev.phone,
        email: data?.email || prev.email,
        governmentid: data?.governmentid || ""
      }));*/
    } catch (err) {
      console.error(err);
    }
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

      const creationPayload = {
        name: tenantForm.name.trim(),
        phone: tenantForm.phone.trim(),
        email: tenantForm.email.trim(),
        governmentid: tenantForm.governmentid.trim(),
        role: "tenant",
        owner_id: ownerId,
        apartment_id: id,
      }

      if (isEditingTenant) {
        try {
          const { error } = await supabase
            .from("tenants")
            .update(editPayload)
            .eq("id", vivienda.tenant_id);

          if (error) throw error;
        } catch (error) {
          console.log(error);
        } finally {
          mensajeExito("Cuenta actualizada para el arrendatario.");
        }
      } else {
        try {
          const { data, error } = await supabase.auth.signUp({
            email: tenantForm.email.trim(),
            password: tenantForm.password.trim(),
            options: {
              data: {
                name: tenantForm.name.trim(),
                phone: tenantForm.phone.trim(),
                email: tenantForm.email.trim(),
                governmentid: tenantForm.governmentid.trim(),
                role: "tenant",
                owner_id: ownerId,
                apartment_id: id,
              },
            },
          });

          if (error) console.log(error);
        } catch (error) {
          console.log(error);
        } finally {
          mensajeExito("Cuenta creada para el arrendatario.");
        }
      };



      /*
      const tenantRes = await fetch(
        isEditingTenant
          ? `${REACT_APP_API_URL}/tenants/${vivienda.tenant_id}`
          : `${REACT_APP_API_URL}/tenants`,
        {
          method: isEditingTenant ? "PUT" : "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(payload)
        }
      );

      const tenantData = await tenantRes.json().catch(() => ({}));
      if (!tenantRes.ok) {
        throw new Error(tenantData?.error || tenantData?.message || "No se pudo guardar el arrendatario");
      }

      const tenantId = tenantData?.id || tenantData?.tenantid;
      if (!tenantId) {
        throw new Error("No se encontró ID del arrendatario para asignar a la vivienda");
      }

      const assignRes = await fetch(`${REACT_APP_API_URL}/apartments/${vivienda.id}/tenant`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ tenantid: tenantId })
      });

      const assignData = await assignRes.json().catch(() => ({}));
      if (!assignRes.ok) {
        throw new Error(assignData?.error || assignData?.message || "No se pudo asignar a la vivienda");
      }

      setVivienda((prev) => ({
        ...prev,
        tenant_id: assignData?.tenantid || tenantId,
        tenant_name: assignData?.tenant_name || payload.name,
        tenant_phone: assignData?.tenant_phone || payload.phone,
        tenant_email: assignData?.tenant_email || payload.email
      }));

      setTenantForm((prev) => ({ ...prev, password: "" }));
      setTenantMsg("Cuenta de arrendatario guardada y vinculada correctamente.");*/
    } catch (err) {
      console.error(err);
      setTenantMsg(err.message || "Error al gestionar la cuenta.");
    } finally {
      setTenantSaving(false);
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
    <div className="w-full h-full flex flex-col gap-6! lg:px-20! py-10">
      <Link to="/viviendas" style={{ textDecoration: "none" }} className="flex flex-row gap-2 items-center justify-center w-auto self-start m-0 bg-white border border-slate-200 px-3 py-2 rounded-md">
        <LuArrowLeft className="text-sky-600" size={18} />

        <p className="text-start font-semibold text-sky-600 m-0! text-sm">
          Regresar a todas las viviendas
        </p>
      </Link>

      <div className="flex lg:flex-row flex-col justify-between items-center">
        <div className="flex flex-col items-start">
          <h1 className="text-start font-light fw-semibold tracking-tight">Viviendas</h1>
          <p className="text-base font-medium text-slate-500">Visualiza las viviendas registradas en el sistema fácil y rápidamente.</p>
        </div>

        <button
          type="button"
          className="bg-sky-600 flex flex-row gap-2 px-3 py-2 rounded-md! items-center justify-center text-white font-medium"
          data-bs-toggle="modal"
          data-bs-target="#tenantAccountModal"
          onClick={abrirGestionArrendatario}
        >
          <LuSettings size={18} />
          Gestionar cuenta de arrendatario
        </button>
      </div>

      <Toaster />

      <div className="w-full grid grid-cols-3 gap-4">
        <div className="general-detail col-span-2 w-full bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-4 justify-start">
          <div className="card-header flex flex-row gap-2 items-center justify-start w-full">
            <LuHouse size={21} strokeWidth={2.5} />

            <h1 className="text-2xl! m-0! font-semibold!">
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

        <div className="w-full flex flex-col gap-4">
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
              <Button text="Guardar estatus" onClick={guardarStatus} />
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

      <div
        className="modal fade"
        id="tenantAccountModal"
        tabIndex="-1"
        aria-labelledby="tenantAccountModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="tenantAccountModalLabel">
                {vivienda?.tenant_id ? "Editar arrendatario" : "Crear arrendatario"}
              </h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>

            <form onSubmit={guardarArrendatario}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tenantForm.name}
                    onChange={(e) => setTenantForm((prev) => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Teléfono</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tenantForm.phone}
                    onChange={(e) => setTenantForm((prev) => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Correo</label>
                  <input
                    type="email"
                    className="form-control"
                    value={tenantForm.email}
                    onChange={(e) => setTenantForm((prev) => ({ ...prev, email: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Identificación oficial</label>
                  <input
                    type="text"
                    className="form-control"
                    value={tenantForm.governmentid}
                    onChange={(e) => setTenantForm((prev) => ({ ...prev, governmentid: e.target.value }))}
                    required
                  />
                </div>
                <div className="mb-0">
                  <label className="form-label">
                    {vivienda?.tenant_id ? "Nueva contraseña (opcional)" : "Contraseña"}
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    value={tenantForm.password}
                    onChange={(e) => setTenantForm((prev) => ({ ...prev, password: e.target.value }))}
                    required={!vivienda?.tenant_id}
                  />
                </div>
                {tenantMsg && (
                  <small
                    className={`d-block mt-2 ${tenantMsg.includes("correctamente") ? "text-success" : "text-danger"
                      }`}
                  >
                    {tenantMsg}
                  </small>
                )}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-outline-secondary" data-bs-dismiss="modal">
                  Cerrar
                </button>
                <button type="submit" className="btn btn-dark" disabled={tenantSaving}>
                  {tenantSaving ? "Guardando..." : "Guardar arrendatario"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
