import React, { useState, useEffect } from 'react';
import { Send, UserRound } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { FaUser, FaEnvelope } from "react-icons/fa6";
import { FaLock } from "react-icons/fa6";
import { TextInput, Label } from 'flowbite-react';
import { useNavigate, useLocation } from 'react-router-dom';
import useUser from '../../../stores/user-store';
import { supabase } from '../../../config/supabase-client';
import { ShieldUser, UserRoundKey } from 'lucide-react';
import Button from '../../../components/Button';

const LoginForm = () => {

  const [role, setRole] = useState("owner");
  const [userEmail, setUserEmail] = useState("");
  const [userPassowrd, setUserPassword] = useState("");
  const [action, setAction] = useState('');
  const [faqOpenIndex, setFaqOpenIndex] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const updateUserId = useUser((state) => state.updateLoggedUser);
  const updateUserRole = useUser((state) => state.updateUserRole);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  useEffect(() => {
    if (location.state) {
      toast.custom((t) => (
        <div
          className={`${t.visible ? 'animate-custom-enter' : 'animate-custom-leave'
            } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="shrink-0 pt-0.5 p-2 bg-sky-100 text-sky-500 rounded-md!">
                <Send size={20} />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-base font-semibold! text-gray-900">
                  {location.state.welcomeFormErr}
                </p>
                <p className="mt-1 text-sm text-gray-500">
                  {location.state.welcomeFormErrDesc}
                </p>
              </div>
            </div>
          </div>
        </div>
      ));

      window.history.replaceState({}, '');
    };
  }, [])

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: userEmail,
        password: userPassowrd
      });

      if (error) throw error;

      const userAuthId = data.user.id;
      let userNormalId;

      if (role === "owner") {
        const { data, error } = await supabase
          .from("owners")
          .select("id")
          .eq("authid", userAuthId);

        if (error) throw error;

        userNormalId = data[0].id;
      } else {
        const { data, error } = await supabase
          .from("tenants")
          .select("id")
          .eq("authid", userAuthId);

        if (error) throw error;

        userNormalId = data[0].id;
      };

      // Actualizando el estado global del usuario para separar su propio espacio.
      updateUserId(userNormalId);

      // Guardando temporalmente el token de sesión en el local storage.
      // Nota: en futuras ediciones, modificar esto para guardarlo en las cookies.
      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("role", role)
      updateUserRole(role);

      // Finalmente, redirigimos al usuario a la página principal del sistema (viviendas).
      navigate(role === "owner" ? "/viviendas" : "/home");

    } catch (error) {
      console.error(error);
      alert("Server error");
    }
  };

  return (
    <div className='flex w-full min-h-screen bg-[url("/src/assets/fondo01.png")] bg-no-repeat bg-cover items-center justify-center'>
      <Toaster />

      <div className={`absolute bg-sky-950 opacity-80 w-full h-screen`}>
      </div>

      <div className={`flex flex-col z-10 gap-2 bg-white max-w-md px-8 py-8 rounded-2xl`}>
        <form onSubmit={handleLogin} className='w-auto! flex flex-col gap-4'>
          <p className="text-2xl! font-semibold! text-center">Administración de Rentas</p>

          <div className="flex flex-row w-full justify-center items-center gap-2">
            <button
              type="button"
              onClick={() => setRole("owner")}
              className={`flex flex-row gap-2 px-4 py-2 items-center text-nowrap justify-center rounded-lg! text-sm! ${role === "owner" ? "bg-sky-600 text-white font-medium" : "bg-slate-100 border border-slate-200 text-slate-900"}`}
            >
              <ShieldUser size={18} strokeWidth={2} />
              Soy un propietario
            </button>

            <button
              type="button"
              onClick={() => setRole("tenant")}
              className={`flex flex-row gap-2 px-4 py-2 items-center text-nowrap justify-center rounded-lg! text-sm! ${role === "tenant" ? "bg-sky-600 text-white font-medium" : "bg-slate-100 border border-slate-200 text-slate-900"}`}
            >
              <UserRoundKey size={18} strokeWidth={2} />
              Soy un inquilino
            </button>
          </div>

          <div className='flex flex-col gap-2 items-start w-full'>
            <p className='text-slate-900 text-sm font-medium!'>Correo electrónico</p>
            <TextInput
              type="text"
              className="text-sm! w-full"
              value={userEmail}
              placeholder="Correo electrónico"
              onChange={(e) => setUserEmail(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col gap-2 items-start w-full'>
            <p className='text-slate-900 text-sm! font-medium!'>Contraseña</p>
            <TextInput
              type="password"
              className="text-sm! w-full"
              value={userPassowrd}
              placeholder="Contraseña"
              onChange={(e) => setUserPassword(e.target.value)}
              required
            />
          </div>

          <div className='flex flex-col gap-2'>
            <div className="w-full flex flex-col">
              <Button onClick={handleLogin} type="submit" text="Iniciar sesión" />
            </div>

            {role === "owner" && (
              <>
                <div className="flex flex-row items-center gap-2 w-full">
                  <div className="w-full h-px bg-slate-300"></div>
                  <p className="text-slate-400 text-base font-medium">ó</p>
                  <div className="w-full h-px bg-slate-300"></div>
                </div>

                <p onClick={() => navigate("/signup")} className='w-full text-center text-sm font-medium! text-slate-900 hover:text-sky-600! cursor-pointer'>
                  Registrarme como propietario
                </p>
              </>
            )}
          </div>

          <div className="w-full wrap-normal">
            <p className='text-slate-600 text-sm! text-center'>Al continuar, usted acepta los Términos de Sistema de Administración de Rentas y reconoce haber leído nuestra <span className="privacy-link" onClick={toggleModal}>Política de Privacidad</span>. Aviso de recopilación de información.
            </p>
          </div>
        </form>
      </div>

      {isModalOpen && (
        <div className="modal-overlay2" onClick={toggleModal}>
          <div className="modal-content2 text-center" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close2" onClick={toggleModal}>&times;</button>
            <h2>Términos y Políticas de Privacidad</h2>
            <p><strong>1. Introducción</strong><br />
              Bienvenido a Administración de Rentas. Valoramos su privacidad y estamos comprometidos a proteger sus datos personales. Esta política le informará cómo cuidamos sus datos personales y sus derechos.
            </p>
            <p><strong>2. Los datos que recopilamos</strong><br />
              Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre usted: Datos de identidad, datos de contacto, datos financieros y datos de transacciones.
            </p>
            <p><strong>3. Cómo usamos sus datos</strong><br />
              Solo utilizaremos sus datos personales cuando la ley nos lo permita. Lo más común es utilizarlos para formalizar y cumplir contratos con usted o respaldar nuestros intereses legítimos.
            </p>
            <p><strong>4. Seguridad</strong><br />
              Hemos implementado medidas de seguridad apropiadas para evitar que sus datos personales se pierdan, utilicen o accedan accidentalmente de manera no autorizada.
            </p>
            <p><strong>5. Sus derechos</strong><br />
              En ciertas circunstancias, usted tiene derechos según las leyes de protección de datos con respecto a sus datos personales (solicitar acceso, corrección, eliminación, restricción, etc.).
            </p>
            <button className="btn btn-dark w-100" style={{ marginTop: "15px" }} onClick={toggleModal}>Cerrar / Entendido</button>
          </div>
        </div>
      )}

    </div>
  )
}

export default LoginForm;
