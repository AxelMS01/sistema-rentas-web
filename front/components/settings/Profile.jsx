import { Edit, SquarePen } from "lucide-react";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import { Button, Label } from "flowbite-react";
import EditPersonalDetails from "./EditPersonalDetailsModal";

export default function Profile({
    name,
    fatherSurname,
    motherSurname,
    phoneNumber,
    email,
    street,
    extNum,
    division,
    city,
    state,
    onEditSuccess
}) {
    const [profDetailsModal, setProfDetailsModal] = useState(false);

    function handleSuccess({successMsg}) {
        toast.success(successMsg);
        setProfDetailsModal(false);
        onEditSuccess();
    };

    return (
        <div className="flex flex-col gap-4 w-full">
            {/*Modals*/}
            <EditPersonalDetails 
                isModalOpen={profDetailsModal}
                onCloseModal={() => setProfDetailsModal(false)}
                onEditSuccess={() => handleSuccess("¡Datos guardados correctamente!")}
            />

            <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
                <div className="header flex flex-col gap-2">
                    <h1 className="text-start font-semibold! text-2xl! tracking-tight">Mi Perfil</h1>
                    <p className="text-base font-normal text-slate-500 text-start">Revisa y configura tu información personal.</p>
                </div>
            </div>

            <div className="relative w-full flex items-center gap-10 justify-start md:flex-row flex-col bg-white sm:p-8 p-6 border border-slate-200 rounded-xl!">
                <div className="avatar w-40! h-40! rounded-full! bg-slate-100 border-2 border-slate-200">
                    {/*Avatar aquí*/}
                </div>

                <div className="w-auto flex flex-col sm:gap-2! gap-3! md:items-start items-center">
                    <p className="text-xl! font-semibold text-slate-900 text-center!">{name} {fatherSurname} {motherSurname}</p>
                    <p className="text-base text-slate-600 font-medium text-center!">Arrendador</p>
                    <p className="location text-slate-500 text-sm text-center!">Durango, México</p>
                    <Button onClick={() => ""} color="alternative" size='sm' className='sm:hidden flex text-sm! font-semibold! px-2 py-0.5! rounded-lg! flex-row gap-2 items-center'>
                        <SquarePen size={16} />
                        Editar
                    </Button>
                </div>

                <Button onClick={() => ""} color="alternative" size='sm' className='sm:flex hidden absolute top-8 right-8 text-sm! font-semibold! px-2 py-0.5! rounded-lg! flex-row gap-2 items-center'>
                    <SquarePen size={16} />
                    Editar
                </Button>
            </div>

            <div className="relative w-full flex items-start gap-8 justify-start flex-col bg-white sm:p-8 p-6 border border-slate-200 rounded-xl!">
                <div className="w-full flex flex-row items-center justify-between">
                    <h1 className="text-xl! font-semibold! tracking-tight text-slate-900">Detalles Personales</h1>
                    <Button onClick={() => setProfDetailsModal(true)} color="alternative" size='sm' className='sm:flex hidden absolute top-8 right-8 text-sm! font-semibold! px-2 py-0.5! rounded-lg! flex-row gap-2 items-center'>
                        <SquarePen size={16} />
                        Editar
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-x-20 gap-y-8">
                    <div className="flex flex-col gap-2 items-start">
                        <Label className="text-sm text-slate-400 font-medium">Nombre(s)</Label>
                        <p className="text-base text-slate-900 font-medium">
                            {name}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                        <Label className="text-sm text-slate-400 font-medium">Apellido materno</Label>
                        <p className="text-base text-slate-900 font-medium">
                            {fatherSurname}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                        <Label className="text-sm text-slate-400 font-medium">Apellido paterno</Label>
                        <p className="text-base text-slate-900 font-medium">
                            {motherSurname}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                        <Label className="text-sm text-slate-400 font-medium">Número de teléfono</Label>
                        <p className="text-base text-slate-900 font-medium">
                            {phoneNumber}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                        <Label className="text-sm text-slate-400 font-medium">Correo electrónico</Label>
                        <p className="text-base text-slate-900 font-medium">
                            {email}
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative w-full flex items-start gap-8 justify-start flex-col bg-white sm:p-8 p-6 border border-slate-200 rounded-xl!">
                <div className="w-full flex flex-row items-center justify-between">
                    <h1 className="text-xl! font-semibold! tracking-tight text-slate-900">Detalles de Dirección</h1>
                    <Button onClick={() => ""} color="alternative" size='sm' className='sm:flex hidden absolute top-8 right-8 text-sm! font-semibold! px-2 py-0.5! rounded-lg! flex-row gap-2 items-center'>
                        <SquarePen size={16} />
                        Editar
                    </Button>
                </div>

                <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 md:gap-x-20 gap-y-8">
                    <div className="flex flex-col gap-2 items-start">
                        <Label className="text-sm text-slate-400 font-medium">Calle</Label>
                        <p className="text-base text-slate-900 font-medium">
                            {street}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                        <Label className="text-sm text-slate-400 font-medium">Número exterior</Label>
                        <p className="text-base text-slate-900 font-medium">
                            {extNum}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                        <Label className="text-sm text-slate-400 font-medium">Colonia/Fraccionamiento</Label>
                        <p className="text-base text-slate-900 font-medium">
                            {division}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                        <Label className="text-sm text-slate-400 font-medium">Ciudad</Label>
                        <p className="text-base text-slate-900 font-medium">
                            {city}
                        </p>
                    </div>

                    <div className="flex flex-col gap-2 items-start">
                        <Label className="text-sm text-slate-400 font-medium">Estado</Label>
                        <p className="text-base text-slate-900 font-medium">
                            {state}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};