import React, { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import EditarContratoModal from "../Forms/EditarContratoModal";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { supabase } from "../../../config/supabase-client";
import { ArrowLeft, Banknote, Download, Info, ScrollText, Settings } from "lucide-react";
import ContractPaymentsTable from "../../../components/contracts/ContractPaymentsTable";
import ContractBadge from "../../../components/contracts/ContractBadge";
import { PDFDownloadLink } from "@react-pdf/renderer";
import useUser from "../../../stores/user-store";
import { DocumentoContrato } from "../../../components/pdf-documents/Machotes/Contrato/Contrato";
import useContractData from "../../../utils/useContractData";
import { Spinner } from "flowbite-react";
export const token = localStorage.getItem("token");

export default function ContractDetails() {
    const loggedUserId = useUser((state) => state.loggedUser);

    // React Router functions.
    const { id } = useParams();
    const location = useLocation().state;
    const [contrato, setContrato] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [invoices, setInvoices] = useState([]);

    const {
        isDataLoading,
        contractInfo,
        ownerInfo,
        tenantInfo,
        guarantorInfo,
        apartmentInfo
    } = useContractData(location.tenantId, loggedUserId);

    console.log(contractInfo);

    // Modal state
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState(null);
    const [paymentAmount, setPaymentAmount] = useState('');
    const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
    const [paymentMethod, setPaymentMethod] = useState('CASH');
    const [paymentLoading, setPaymentLoading] = useState(false);
    const [paymentError, setPaymentError] = useState('');
    const [editingContractId, setEditingContractId] = useState(null);

    const handleContractUpdated = () => {
        setEditingContractId(null);
        fetchData();
    };

    const handlePaymentSubmit = async (e) => {
        e.preventDefault();
        setPaymentLoading(true);
        setPaymentError('');
        try {
            const { invoicesData } = await supabase.from("rentalcontracts").select();
            setInvoices(invoicesData);
            setShowPaymentModal(false);
        } catch (err) {
            setPaymentError(err.message);
        } finally {
            setPaymentLoading(false);
        }
    };

    function formatDate(dateString) {
        const date = new Date(dateString);

        return new Intl.DateTimeFormat('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        }).format(date);
    };

    if (error) return <div className="text-center py-5 text-danger">{error}</div>;

    return (
        <>
            {isDataLoading && (
                <div className="flex flex-row gap-2 w-full items-center justify-center my-20">
                    <p className="text-base! font-medium text-slate-900">Cargando información del contrato...</p>

                    <Spinner size="md" />
                </div>
            )}

            {!isDataLoading && (
                <div className="w-full min-h-screen flex flex-col gap-6! lg:px-20! sm:px-14 px-8 py-10 items-start">
                    <Link to="/contratos" style={{ textDecoration: "none" }} className="flex flex-row gap-2 items-center justify-center w-auto self-start m-0 bg-white border border-slate-200 px-3 py-2 rounded-md">
                        <ArrowLeft className="text-sky-600" size={18} />

                        <p className="text-start font-semibold text-sky-600 m-0! text-sm">
                            Regresar a todos los contratos
                        </p>
                    </Link>

                    <div className="flex w-full lg:flex-row flex-col justify-between! lg:items-center! items-start gap-6">
                        <div className="flex flex-col items-start gap-3">
                            <h1 className="text-start font-light fw-semibold tracking-tight">Detalles del contrato</h1>
                            <div className="w-full text-sm! flex flex-row gap-1.5 px-3 py-2 bg-sky-50 items-center rounded border border-sky-400!">
                                <ScrollText size={18} className="text-sky-700" />
                                <p className="font-medium text-sky-700">ID del contrato: <span className="font-medium text-slate-800">Contrato-{contractInfo.id}</span></p>
                            </div>
                        </div>

                        {contractInfo.status != "pending" && (
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
                                <button
                                    type="button"
                                    className="bg-sky-600 flex flex-row gap-2 px-3 py-2 rounded-md! items-center justify-center text-sm! text-white font-medium"
                                    data-bs-toggle="modal"
                                    data-bs-target="#tenantAccountModal"
                                    onClick={() => setTenantCreation(true)}
                                >
                                    <Download size={18} />
                                    Descargar en PDF
                                </button>
                            </PDFDownloadLink>
                        )}
                    </div>

                    <Toaster />

                    <div className="w-full grid grid-cols-3 gap-4">
                        <div className="general-detail lg:col-span-2 col-span-3 w-full bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-4 justify-start">
                            <div className="card-header flex flex-row gap-2 items-center justify-start w-full">
                                <Banknote size={28} strokeWidth={2.5} />

                                <h1 className="text-2xl! m-0! font-semibold! text-start text-wrap">
                                    Corrida de pagos de renta
                                </h1>
                            </div>

                            <ContractPaymentsTable />
                        </div>

                        <div className="w-full flex flex-col gap-4 lg:col-span-1 col-span-3">
                            <div className="general-detail w-full bg-white border border-slate-200 p-4 rounded-xl flex flex-col gap-4 justify-start">
                                <div className="card-header flex flex-row gap-2 items-center justify-start w-full">
                                    <Info size={21} strokeWidth={2.5} />

                                    <h1 className="text-2xl! m-0! font-semibold!">
                                        Información
                                    </h1>
                                </div>

                                <div className="flex sm:flex-row flex-col sm:gap-4 gap-2 sm:items-center items-start w-full justify-between">
                                    <span className="font-medium text-slate-500">Costo de renta</span>
                                    <span className="text-emerald-500 font-semibold">
                                        ${contractInfo.depositamount}
                                    </span>
                                </div>

                                <div className="flex sm:flex-row flex-col sm:gap-4 gap-2 sm:items-center items-start w-full justify-between">
                                    <span className="font-medium text-slate-500">Arrendatario</span>
                                    <span className="info-value">
                                        {location.tenantName}
                                    </span>
                                </div>

                                <div className="flex sm:flex-row flex-col sm:gap-4 gap-2 items-start w-full justify-between">
                                    <span className="font-medium text-slate-500">Duración del contrato</span>
                                    <span className="info-value">
                                        <p>{format(location.startDate, "PP", { locale: es })}</p>
                                        <p className="font-normal text-slate-600">al</p>
                                        <p>{format(location.endDate, "PP", { locale: es })}</p>
                                    </span>
                                </div>

                                <div className="flex sm:flex-row flex-col sm:gap-4 gap-2 sm:items-center items-start w-full justify-between">
                                    <span className="font-medium text-slate-500">Estado</span>
                                    <ContractBadge contractStatus={location.contractStatus} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
