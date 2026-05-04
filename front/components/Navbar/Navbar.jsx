import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Settings, Bell, X, Eraser, LogOut, Menu, House, LayoutDashboard, ClipboardCheck, MessageCircleWarning, FileUser } from "lucide-react";
import { supabase } from "../../config/supabase-client";
import useUser from "../../stores/user-store";
import toast, { Toaster } from "react-hot-toast";
import casaLogo from "../../src/assets/casa.png";
import NotificationBox from "../notifications/Notifications";
import { Button, Popover } from "flowbite-react";
import { Dropdown, DropdownItem } from "flowbite-react";
import Notifications from "../notifications/Notifications";
import NavbarMobileLink from "./NavbarMobileLink";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => (location.pathname === path ? "text-sky-600! font-semibold!" : "text-muted");
  const role = useUser((state) => state.role);
  const loggedUserId = useUser((state) => state.loggedUser);
  const isTenant = role === "tenant";

  const [showModal, setShowModal] = useState(false);
  const firmaRef = useRef(null);
  const [firma, setFirma] = useState();
  const [firmaURL, setFirmaURL] = useState("");
  const [minimumMonths, setMinimumMonths] = useState("");
  const [notifications, setNotifications] = useState();
  const [loadingNotifs, setLoadingNotifs] = useState(true);

  const [activeTab, setActiveTab] = useState("pagos");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifs, setShowNotifs] = useState(false);
  const userMenuRef = useRef(null);
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [lienzoFirma, setLienzoFirma] = useState(false);

  const [paymentKeys, setPaymentKeys] = useState({
    stripe: "",
    conekta: "",
    mercadoPago: "",
    openpayId: "",
    openpayKey: ""
  });

  const [moraSettings, setMoraSettings] = useState({ tipo: "percentage", valor: 10 });

  useEffect(() => {
    async function getNotifs() {
      try {
        const { data, error } = await supabase
          .from("notifications")
          .select()
          .eq("seen", false)
          .eq("ownerid", loggedUserId);

        if (error) throw error;

        setNotifications(data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoadingNotifs(false);
      }
    };

    getNotifs();
  }, []);

  const handlePaymentChange = (e) => {
    setPaymentKeys({ ...paymentKeys, [e.target.name]: e.target.value });
  };

  const handleMoraChange = (e) => {
    setMoraSettings({ ...moraSettings, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const feeString = moraSettings.tipo + "-" + moraSettings.valor;

    const { error } = await supabase
      .from("owners")
      .update({
        signature_url: firmaURL,
        charge_fee: feeString,
        minimum_duration: minimumMonths
      })
      .eq("id", loggedUserId);

    if (error) throw error;

    setShowModal(false);
    toast.success("¡Configuraciones guardadas!");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setShowUserMenu(false);
    navigate("/login");
  };

  function actualizarFirma() {
    setLienzoFirma(false);
    const url = firmaRef.current.getTrimmedCanvas().toDataURL("firma/png");
    console.log(url);
    setFirmaURL(url);
  };

  return (
    <>
      <Toaster />
      <nav
        className="flex flex-col gap-3 items-center! justify-center! bg-white border-bottom sm:py-2 py-3 px-4 sticky-top shadow-sm z-9 min-h-20 w-full"
        style={{ zIndex: 9, minHeight: "80px" }}
      >

        <div className="w-full flex flex-row items-center justify-between">
          {/* Logo */}
          <div className="d-flex align-items-center">
            <img
              src={casaLogo}
              alt="Logo"
              style={{ width: "45px", height: "45px", objectFit: "contain", marginRight: "10px" }}
            />
            <div className="d-flex flex-column" style={{ lineHeight: "1.1" }}>
              <span className="fw-bold fs-6">Administración</span>
              <span className="text-secondary small">de Rentas</span>
            </div>
          </div>

          {/* Links Collapse */}
          {!isTenant && (
            <div className={`md:flex hidden justify-content-center w-lg-auto ${isNavOpen ? 'lg:hidden flex mt-4 pb-3' : ''}`}>
              <div className="flex! flex-row! align-items-center gap-3 gap-lg-4 mx-auto bg-light px-4 py-3 py-lg-2 rounded-4" style={{ borderRadius: isNavOpen ? '1rem' : '50rem' }}>
                <Link to="/system/viviendas" onClick={() => setIsNavOpen(false)} className={`text-decoration-none small font-normal ${isActive("/system/viviendas")}`}>
                  Viviendas
                </Link>
                <Link to="/system/dashboard" onClick={() => setIsNavOpen(false)} className={`text-decoration-none small font-normal ${isActive("/system/dashboard")}`}>
                  Dashboard
                </Link>
                <Link to="/system/reportes" onClick={() => setIsNavOpen(false)} className={`text-decoration-none small font-normal ${isActive("/system/reportes")}`}>
                  Reportes
                </Link>
                <Link to="/system/incidencias" onClick={() => setIsNavOpen(false)} className={`text-decoration-none small font-normal ${isActive("/system/incidencias")}`}>
                  Incidencias
                </Link>
                <Link to="/system/contratos" onClick={() => setIsNavOpen(false)} className={`text-decoration-none small font-normal ${isActive("/system/contratos")}`}>
                  Contratos
                </Link>
              </div>
            </div>
          )}

          {/* Actions & Toggler */}
          <div className="flex! items-center! justify-center! gap-3">
            {!loadingNotifs && (
              <Notifications notificationList={notifications} />
            )}

            <div className="mt-2" ref={userMenuRef}>
              <button
                type="button"
                onClick={() => setShowUserMenu((prev) => !prev)}
                className="cursor-pointer"
              >
                <Menu size={22} className="text-slate-700 hover:text-sky-600" />
              </button>

              {showUserMenu && (
                <div
                  className="md:flex hidden flex-col position-absolute inset-e-0 mt-2 mr-2 bg-white border rounded shadow-sm"
                  style={{ minWidth: "150px", zIndex: 1100 }}
                >
                  <button
                    type="button"
                    className="btn btn-link hover:bg-slate-100! flex! flex-row gap-1.5 items-center! text-decoration-none text-dark w-100 text-start px-3 py-2"
                    onClick={!isTenant ? () => navigate("/system/configuracion") : ""}
                  >
                    <Settings size={18} />
                    Configuración
                  </button>

                  <button
                    type="button"
                    className="btn btn-link hover:bg-slate-100! flex! flex-row gap-1.5 items-center! text-decoration-none text-dark w-100 text-start px-3 py-2"
                    onClick={handleLogout}
                  >
                    <LogOut size={18} />
                    Cerrar sesion
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Route links for small screen sizes */}
        {showUserMenu && (
          <div className="md:hidden flex flex-col border border-slate-200 w-full align-items-center gap-3 gap-lg-4 mx-auto bg-light px-4 py-3 py-lg-2 rounded-4" style={{ borderRadius: isNavOpen ? '1rem' : '50rem' }}>
            <NavbarMobileLink route="/system/viviendas" label="Viviendas" onClick={() => setShowUserMenu(false)} isActive={isActive("/system/viviendas")} icon={<House size={20} />} />

            <NavbarMobileLink route="/system/dashboard" label="Dashboard" onClick={() => setShowUserMenu(false)} isActive={isActive("/system/dashboard")} icon={<LayoutDashboard size={20} />} />

            <NavbarMobileLink route="/system/reportes" label="Reportes" onClick={() => setShowUserMenu(false)} isActive={isActive("/system/reportes")} icon={<ClipboardCheck size={20} />} />

            <NavbarMobileLink route="/system/incidencias" label="Incidencias" onClick={() => setShowUserMenu(false)} isActive={isActive("/system/incidencias")} icon={<MessageCircleWarning size={20} />} />

            <NavbarMobileLink route="/system/contratos" label="Contratos" onClick={() => setShowUserMenu(false)} isActive={isActive("/system/contratos")} icon={<FileUser size={20} />} />

            <div className="w-full h-px bg-slate-300"></div>

            <NavbarMobileLink route="/system/configuracion" label="Configuración" onClick={() => setShowUserMenu(false)} isActive={isActive("/system/configuracion")} icon={<Settings size={20} />} />

            <NavbarMobileLink route="/login" label="Cerrar sesión" onClick={handleLogout} isActive={isActive("/")} icon={<LogOut size={20} />} />
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
