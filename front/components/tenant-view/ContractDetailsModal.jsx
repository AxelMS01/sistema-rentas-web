
import { Button, Label, Modal, ModalBody, ModalHeader, ModalFooter, TextInput, FileInput, Datepicker, Textarea } from "flowbite-react";
import toast, { Toaster } from "react-hot-toast";
import { useState, useEffect } from "react";
import useUser from "../../stores/user-store";
import { supabase } from "../../config/supabase-client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import useContractData from "../../lib/useContractData";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { DocumentoContrato } from "../pdf-documents/Machotes/Contrato/Contrato";
import { CheckCircle, CircleCheck, Download } from "lucide-react";

export default function ContractDetailsModal({ isModalOpen, onCloseModal }) {
    const loggedUserId = useUser((state) => state.loggedUser);

    const {
        isDataLoading,
        contractInfo,
        ownerInfo,
        tenantInfo,
        guarantorInfo,
        apartmentInfo
    } = useContractData("tenants", loggedUserId);

    return (
        <>
            {!isDataLoading && (
                <Modal show={isModalOpen} size="xl" onClose={onCloseModal} popup>
                    <ModalHeader className="w-full p-4">
                        <p className="text-2xl! tracking-tight font-semibold mb-4">Detalles del contrato</p>
                        
                        <PDFDownloadLink document={
                            <DocumentoContrato
                                contractInfo={contractInfo}
                                ownerInfo={ownerInfo}
                                tenantInfo={tenantInfo}
                                guarantorInfo={guarantorInfo}
                                apartmentInfo={apartmentInfo}
                                isActive={true}
                            />
                        } className="no-underline!" fileName={`Contrato-${contractInfo.id}`}>
                            <Button
                                type="button"
                                color="default"
                                className="flex flex-row gap-2 px-3! py-2! bg-sky-600 rounded-md! items-center justify-center text-sm! font-medium"
                            >
                                <Download size={18} />
                                Descargar en PDF
                            </Button>
                        </PDFDownloadLink>
                    </ModalHeader>
                    <ModalBody className="flex flex-col gap-4">

                        <div className="w-full flex flex-col gap-3 p-3 border boder-slate-200 rounded-md!">
                            <h1 className="text-lg! font-medium! text-slate-900!">Detalles del arrendador</h1>

                            <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-sm! text-slate-600">Nombre completo</p>
                                    <p className="text-base! text-slate-900 font-medium!">{ownerInfo.name} {ownerInfo.father_surname} {ownerInfo.mother_surname}</p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <p className="text-sm! text-slate-600">Número de teléfono</p>
                                    <p className="text-base! text-slate-900 font-medium!">{ownerInfo.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-3 p-3 border boder-slate-200 rounded-md!">
                            <h1 className="text-lg! font-medium! text-slate-900!">Detalles del aval</h1>

                            <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-sm! text-slate-600">Nombre completo</p>
                                    <p className="text-base! text-slate-900 font-medium!">{guarantorInfo.name} {guarantorInfo.father_surname} {guarantorInfo.mother_surname}</p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <p className="text-sm! text-slate-600">Número de teléfono</p>
                                    <p className="text-base! text-slate-900 font-medium!">{guarantorInfo.phone}</p>
                                </div>
                            </div>
                        </div>

                        <div className="w-full flex flex-col gap-3 p-3 border boder-slate-200 rounded-md!">
                            <h1 className="text-lg! font-medium! text-slate-900!">Detalles de la renta</h1>

                            <div className="grid sm:grid-cols-2 grid-cols-1 w-full gap-6">
                                <div className="flex flex-col gap-1.5">
                                    <p className="text-sm! text-slate-600">Monto mensual</p>
                                    <p className="text-base! text-slate-900 font-medium!">${contractInfo.monthlyamount}</p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <p className="text-sm! text-slate-600">Fecha de inicio</p>
                                    <p className="text-base! text-slate-900 font-medium!">{format(contractInfo.startdate, "PP", { locale: es })}</p>
                                </div>

                                <div className="flex flex-col gap-1.5">
                                    <p className="text-sm! text-slate-600">Fecha de término</p>
                                    <p className="text-base! text-slate-900 font-medium!">{format(contractInfo.enddate, "PP", { locale: es })}</p>
                                </div>
                            </div>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            type="button"
                            color="default"
                            className="flex flex-row gap-2 px-3! py-2! bg-sky-600 rounded-md! items-center justify-center text-sm! font-medium"
                            onClick={onCloseModal}
                        >
                            <CircleCheck size={18} />
                            Cerrar
                        </Button>
                    </ModalFooter>
                </Modal>
            )}
        </>
    );
};