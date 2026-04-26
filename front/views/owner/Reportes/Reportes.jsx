import React, { useEffect, useMemo, useState } from "react";
import "./Reportes.css";
import Button from "../../../components/Button";
import { LuPlus } from "react-icons/lu";
import { RotateCcw } from "lucide-react";
import { supabase } from "../../../config/supabase-client";
import useUser from "../../../stores/user-store";
import { getOccupationPercentage } from "../../../utils/reports-calculations";

const formatCurrency = (value) => {
  const amount = Number(value) || 0;
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0
  }).format(amount);
};

const Reportes = () => {
  const loggedUserId = useUser((state) => state.loggedUser);
  const [ocupacion, setOcupacion] = useState(null);
  const [occupiedNum, setOccupiedNum] = useState(0);
  const [availableNum, setAvailableNum] = useState(0);
  const [arrendatarios, setArrendatarios] = useState({});
  const [contratos, setContratos] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchContracts = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("rentalcontracts")
        .select()
        .eq("owner_id", loggedUserId);
      
      if (error) throw error;
      setContratos(data);
      
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  const loadReportData = async () => {
    try {
      setLoading(true);
      const { data: allApartments, error: allApartmentsError } = await supabase
        .from("apartments")
        .select()
        .eq("ownerid", loggedUserId);

      if (allApartmentsError) throw error;
      console.log(allApartments.length)
      setPropiedades(allApartments);

      const { data: occupiedApartments, error: occupiedError } = await supabase
        .from("apartments")
        .select()
        .eq("status", "OCCUPIED")
        .eq("ownerid", loggedUserId);

      if (occupiedError) throw error;
      setOccupiedNum(occupiedApartments.length);

      const { data: availableApartments, error: availableError } = await supabase
        .from("apartments")
        .select()
        .eq("status", "AVAILABLE")
        .eq("ownerid", loggedUserId);

      if (availableError) throw error;
      setAvailableNum(availableApartments.length)

      const porcentajeOcupacion = getOccupationPercentage(allApartments.length, occupiedApartments.length);
      setOcupacion(porcentajeOcupacion.toFixed(2));
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReportData();
    fetchContracts();
  }, []);

  const arrendatariosEntries = useMemo(
    () => Object.entries(arrendatarios || {}),
    [arrendatarios]
  );
  const contratosEntries = useMemo(
    () => Object.entries(contratos || {}),
    [contratos]
  );
  const propiedadesEntries = useMemo(
    () => Object.entries(propiedades || {}),
    [propiedades]
  );

  const totalUnidades = ocupacion?.total_unidades || 0;
  const totalOcupadas = ocupacion?.ocupadas || 0;
  const totalDisponibles = ocupacion?.disponibles || 0;

  return (
    <>
      {!loading && (
        <div className="w-full h-screen flex flex-col gap-4! lg:px-20! sm:px-16! px-8! py-10">
          <div className="flex w-full md:flex-row flex-col justify-between md:items-center items-start gap-6">
            <div className="header flex flex-col gap-2">
              <h1 className="text-start font-light fw-semibold tracking-tight">Reportes</h1>
              <p className="text-base font-normal text-slate-500 text-start">Resumen ejecutivo de ocupacion, pagos y contratos</p>
            </div>

            <Button
              text={loading ? "Actualizando..." : "Actualizar"}
              icon={<RotateCcw size={18} />}
              onClick={loadReportData}
              isDisabled={loading}
            />
          </div>

          {error && (
            <div className="alert alert-danger border-0 shadow-sm">{error}</div>
          )}

          <div className="row g-3 mb-4">
            <div className="col-lg-4">
              <div className="reportes-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="flex flex-col gap-2">
                    <p className="m-0 font-semibold! text-xs! text-slate-400 text-start uppercase">Ocupación general</p>
                    <h3 className="m-0 font-semibold! text-start">{ocupacion}%</h3>
                  </div>
                  <span className="bg-sky-100 text-sky-600 text-xs font-semibold rounded-lg px-2 py-1">En unidades</span>
                </div>
                <div className="reportes-progress">
                  <div
                    className="reportes-progress-bar"
                    style={{ width: `${ocupacion}%` }}
                  />
                </div>
                <div className="d-flex justify-content-between mt-3">
                  <div>
                    <p className="reportes-label">Total</p>
                    <span className="reportes-value">{propiedades.length}</span>
                  </div>
                  <div>
                    <p className="reportes-label">Ocupadas</p>
                    <span className="reportes-value">{occupiedNum}</span>
                  </div>
                  <div>
                    <p className="reportes-label">Disponibles</p>
                    <span className="reportes-value">{availableNum}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="col-lg-8">
              <div className="reportes-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="flex flex-col gap-2">
                    <p className="m-0 reportes-kicker text-start">Totales por arrendatario</p>
                    <h4 className="m-0 text-2xl! font-semibold!">Resumen de pagos</h4>
                  </div>
                  <span className="reportes-meta">{arrendatariosEntries.length} registros</span>
                </div>
                <div className="row g-3">
                  {loading && (
                    <div className="col-12">
                      <div className="reportes-placeholder" />
                    </div>
                  )}
                  {!loading && arrendatariosEntries.length === 0 && (
                    <div className="col-12">
                      <p className="text-muted mb-0">Sin datos disponibles.</p>
                    </div>
                  )}
                  {!loading &&
                    arrendatariosEntries.map(([nombre, data]) => (
                      <div className="col-md-6 col-xl-4" key={nombre}>
                        <div className="reportes-mini-card">
                          <h6 className="m-0 reportes-mini-title">{nombre}</h6>
                          <p className="m-0 reportes-mini-amount">
                            {formatCurrency(data.total_pagado)}
                          </p>
                          <div className="d-flex justify-content-between mt-2">
                            <span className="reportes-pill">
                              Pagos: {data.pagos_realizados}
                            </span>
                            <span className="reportes-pill reportes-pill-warning">
                              Pendientes: {data.pagos_pendientes}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>

          <div className="row g-3">
            <div className="col-lg-6">
              <div className="reportes-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="flex flex-col gap-2">
                    <p className="m-0 reportes-kicker text-start">Contratos</p>
                    <h4 className="m-0 font-semibold!">Detalle por contrato</h4>
                  </div>
                  <span className="reportes-meta">{contratos.length} contratos</span>
                </div>
                <div className="reportes-list">
                  {loading && <div className="reportes-placeholder" />}
                  {!loading && contratosEntries.length === 0 && (
                    <p className="text-muted mb-0">Sin datos disponibles.</p>
                  )}
                  {!loading &&
                    contratosEntries.map(([contratoId, data]) => (
                      <div className="reportes-list-item" key={contratoId}>
                        <div>
                          <p className="m-0 reportes-list-title">Contrato #{contratoId}</p>
                          <span className="reportes-list-subtitle">
                            Pagos registrados: {data.pagos?.length || 0}
                          </span>
                        </div>
                        <div className="reportes-list-amount">
                          {formatCurrency(data.total_contrato)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <div className="reportes-card h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="flex flex-col gap-2">
                    <p className="m-0 reportes-kicker text-start">Propiedades</p>
                    <h4 className="m-0 font-semibold!">Ingresos por propiedad</h4>
                  </div>
                  <span className="reportes-meta">{propiedadesEntries.length} propiedades</span>
                </div>
                <div className="reportes-list">
                  {loading && <div className="reportes-placeholder" />}
                  {!loading && propiedadesEntries.length === 0 && (
                    <p className="text-muted mb-0">Sin datos disponibles.</p>
                  )}
                  {!loading &&
                    propiedadesEntries.map(([propiedad, data]) => (
                      <div className="reportes-list-item" key={propiedad}>
                        <div>
                          <p className="m-0 reportes-list-title">{propiedad}</p>
                          <span className="reportes-list-subtitle">
                            Pagos: {data.total_pagos}
                          </span>
                        </div>
                        <div className="reportes-list-amount">
                          {formatCurrency(data.total_ingresos)}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Reportes;
