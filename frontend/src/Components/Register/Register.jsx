import { useState } from 'react';
import { User, Lock } from 'lucide-react';
import "../LoginForm/LoginForm.css";
import { supabase } from '../../Config/supabase-client';
import useUser from '../../Stores/user-store';
import { useNavigate } from 'react-router-dom';

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

        const { data, error } = await supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    name: name,
                    mother_surname: motherSurname,
                    father_surname: fatherSurname,
                    phone: phoneNumber,
                    governmentid: govId,
                },
            },
        });

        // Actualizando el estado global del usuario para separar su propio espacio.
        updateUserId(data.user.id);

        localStorage.setItem("token", data.session.access_token);
        navigate("/viviendas");
    };

    return (
        <div className='login-page'>
            <div className={`wrapper`}>
                <div className='form-box login'>
                    <form onSubmit={(e) => handleOwnerRegistration(e)}>
                        <h1>Administración de Rentas</h1>
                        <div className="input-box">
                            <input type="text" placeholder='Nombre' value={name} onChange={(e) => setName(e.target.value)} required /> <User className='icon' />
                        </div>

                        <div className="input-box">
                            <input type="text" placeholder='Apellido paterno' value={fatherSurname} onChange={(e) => setFatherSurname(e.target.value)} required /> <Lock className='icon' />
                        </div>

                        <div className="input-box">
                            <input type="text" placeholder='Apellido materno' value={motherSurname} onChange={(e) => setMotherSurname(e.target.value)} required /> <Lock className='icon' />
                        </div>

                        <div className="input-box">
                            <input type="text" placeholder='Número de teléfono' value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required /> <Lock className='icon' />
                        </div>

                        <div className="input-box">
                            <input type="text" placeholder='Correo electrónico' value={email} onChange={(e) => setEmail(e.target.value)} required /> <Lock className='icon' />
                        </div>

                        <div className="input-box">
                            <input type="text" placeholder='CURP' value={govId} onChange={(e) => setGovId(e.target.value)} required /> <Lock className='icon' />
                        </div>

                        <div className="input-box">
                            <input type="password" placeholder='Contraseña' value={password} onChange={(e) => setPassword(e.target.value)} required /> <Lock className='icon' />
                        </div>

                        <button type="submit" className="btn btn-dark w-100">Registrarme como arrendador</button>

                        <div className="login-link">
                            <p> <a href='#' onClick={() => ""}> </a>
                            </p>
                        </div>
                        <div className="input-fuaq">
                            <p>Al continuar, usted acepta los Términos de Sistema de Administración de Rentas y reconoce haber leído nuestra <span className="privacy-link" onClick={() => setIsModalOpen(true)}>Política de Privacidad</span>. Aviso de recopilación de información.
                            </p>
                        </div>
                    </form>
                </div>
            </div>

            {isModalOpen && (
                <div className="modal-overlay2" onClick={() => ""}>
                    <div className="modal-content2" onClick={(e) => ""}>
                        <button className="modal-close2" onClick={() => setIsModalOpen(false)}>&times;</button>
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
                        <button className="btn btn-dark w-100" style={{ marginTop: "15px" }} onClick={() => setIsModalOpen(false)}>Cerrar / Entendido</button>
                    </div>
                </div>
            )}

        </div>
    );
};