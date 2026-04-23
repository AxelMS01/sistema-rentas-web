import { useState } from 'react';
import { User, Lock, UserCircle } from 'lucide-react';
import { supabase } from '../../../config/supabase-client';
import useUser from '../../../stores/user-store';
import fondocasa from "../../../src/assets/fondo01.png";
import { useNavigate } from 'react-router-dom';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader, TextInput } from "flowbite-react";

export default function RegisterPage() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Variables de los inputs.
    const [name, setName] = useState("");
    const [fatherSurname, setFatherSurname] = useState("");
    const [motherSurname, setMotherSurname] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [email, setEmail] = useState("");
    const [govId, setGovId] = useState("");
    const [password, setPassword] = useState("");

    const updateUserId = useUser((state) => state.updateLoggedUser);
    const navigate = useNavigate();

    async function handleOwnerRegistration(e) {
        e.preventDefault();

        let newSessionId;
        let accessSessionToken;

        // Crear un nuevo usuario en la tabla 'auth.users' de la base de datos.
        try {
            const { data, error } = await supabase.auth.signUp({
                email: email,
                password: password,
                options: {
                    data: {
                        user_type: "owner", // Diferenciar la creación de un usuario arrendador, de un arrendatario.
                        name: name,
                        mother_surname: motherSurname,
                        father_surname: fatherSurname,
                        email: email,
                        phone: phoneNumber,
                        governmentid: govId,
                    },
                },
            });

            newSessionId = data.user.id;
            accessSessionToken = data.session.access_token;
        } catch (error) {
            console.log(error);
        };

        // Después, obtenemos el ID del usuario que creamos, de la tabla public.owners.
        const { data, error } = await supabase
            .from("owners")
            .select("id")
            .eq("authid", newSessionId);

        if (error) throw error;

        // Con el ID obtenido, actualizamos el estado global del usuario para separar su propio espacio.
        updateUserId(data[0].id);

        // Guardando temporalmente el token de sesión en el local storage.
        // Nota: en futuras ediciones, modificar esto para guardarlo en las cookies.
        localStorage.setItem("token", accessSessionToken);
        localStorage.setItem("role", "owner");

        // Finalmente, redirigimos al usuario a la página principal del sistema (viviendas).
        navigate("/viviendas");
    };

    return (
        <div className='relative flex w-full min-h-screen bg-[url("../../../src/assets/fondo01.png")] bg-no-repeat bg-cover items-center justify-center'>
            <div className={`absolute bg-sky-900 opacity-80 w-full h-screen`}>
            </div>

            <Modal show={true} onClose={() => ""} size='xl'>
                <ModalHeader className='border-b-slate-200 p-4! pb-4! tracking-tight'>
                    <p className='text-2xl! font-semibold'>Registrarse como arrendador</p>
                </ModalHeader>
                <ModalBody className=''>
                    <form id="registration-form" className='flex! flex-col! gap-4' onSubmit={(e) => handleOwnerRegistration(e)}>
                        <div className='flex flex-col gap-2 items-start w-full'>
                            <p className='text-slate-900 text-sm font-medium!'>Nombre(s)</p>
                            <TextInput
                                type="text"
                                className="text-sm! w-full"
                                placeholder="Tu(s) nombre(s)"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-2 items-start w-full'>
                            <p className='text-slate-900 text-sm font-medium!'>Apellido paterno</p>
                            <TextInput
                                type="text"
                                className="text-sm! w-full"
                                placeholder="Apellido paterno"
                                value={fatherSurname}
                                onChange={(e) => setFatherSurname(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-2 items-start w-full'>
                            <p className='text-slate-900 text-sm font-medium!'>Apellido materno</p>
                            <TextInput
                                type="text"
                                className="text-sm! w-full"
                                placeholder="Apellido materno"
                                value={motherSurname}
                                onChange={(e) => setMotherSurname(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-2 items-start w-full'>
                            <p className='text-slate-900 text-sm font-medium!'>Número de teléfono</p>
                            <TextInput
                                type="text"
                                className="text-sm! w-full"
                                placeholder="Número a 10 dígitos"
                                value={phoneNumber}
                                onChange={(e) => setPhoneNumber(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-2 items-start w-full'>
                            <p className='text-slate-900 text-sm font-medium!'>CURP</p>
                            <TextInput
                                type="text"
                                className="text-sm! w-full"
                                placeholder="18 caracteres"
                                value={govId}
                                onChange={(e) => setGovId(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-2 items-start w-full'>
                            <p className='text-slate-900 text-sm font-medium!'>Correo electrónico</p>
                            <TextInput
                                type="text"
                                className="text-sm! w-full"
                                placeholder="tucorreo@ejemplo.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div className='flex flex-col gap-2 items-start w-full'>
                            <p className='text-slate-900 text-sm font-medium!'>Contraseña</p>
                            <TextInput
                                type="password"
                                className="text-sm! w-full"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </form>
                </ModalBody>
                <ModalFooter className='flex flex-col gap-4'>
                    <p className='text-sm text-slate-600'>
                        Al continuar, usted acepta los Términos de Sistema de Administración de Rentas y reconoce haber leído nuestra <span className="cursor-pointer text-sky-600" onClick={() => setIsModalOpen(true)}>Política de Privacidad</span>. Aviso de recopilación de información.
                    </p>

                    <div className='flex flex-col gap-4 w-full'>
                        <Button
                            type="submit"
                            form="registration-form"
                            color="default"
                            className="bg-sky-600 text-white rounded-md! w-full"
                        >
                            Registrarme
                        </Button>

                        <Button
                            type="button"
                            color="alternative"
                            className="rounded-md! w-full"
                            onClick={() => navigate("/")}
                        >
                            Iniciar sesión
                        </Button>
                    </div>
                </ModalFooter>
            </Modal>

            {isModalOpen && (
                <div className="modal-overlay2 z-999 bg-[rgb(0,0,0,0.5)] w-full h-screen flex items-center justify-center">
                    <div className="modal-content2 flex flex-col gap-2 md:max-w-2xl w-auto bg-white p-6 rounded-xl!">
                        <h2 className='text-2xl! tracking-tight font-semibold!'>Términos y Políticas de Privacidad</h2>
                        <p className='text-slate-600'><span className='text-slate-900 font-semibold'>1. Introducción</span><br />
                            Bienvenido a Administración de Rentas. Valoramos su privacidad y estamos comprometidos a proteger sus datos personales. Esta política le informará cómo cuidamos sus datos personales y sus derechos.
                        </p>

                        <p className='text-slate-600'><span className='text-slate-900 font-semibold'>2. Los datos que recopilamos</span><br />
                            Podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales sobre usted: Datos de identidad, datos de contacto, datos financieros y datos de transacciones.
                        </p>

                        <p className='text-slate-600'><span className='text-slate-900 font-semibold'>3. Cómo usamos sus datos</span><br />
                            Solo utilizaremos sus datos personales cuando la ley nos lo permita. Lo más común es utilizarlos para formalizar y cumplir contratos con usted o respaldar nuestros intereses legítimos.
                        </p>

                        <p className='text-slate-600'><span className='text-slate-900 font-semibold'>4. Seguridad</span><br />
                            Hemos implementado medidas de seguridad apropiadas para evitar que sus datos personales se pierdan, utilicen o accedan accidentalmente de manera no autorizada.
                        </p>

                        <p className='text-slate-600'><span className='text-slate-900 font-semibold'>5. Sus derechos.</span><br />
                            En ciertas circunstancias, usted tiene derechos según las leyes de protección de datos con respecto a sus datos personales (solicitar acceso, corrección, eliminación, restricción, etc.).
                        </p>

                        <Button
                            color="default"
                            className="bg-sky-600 text-white rounded-md! w-auto self-start mt-2"
                            onClick={() => setIsModalOpen(false)}
                        >
                            Cerrar/Entendido
                        </Button>
                    </div>
                </div>
            )}

        </div>
    );
};