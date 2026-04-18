import { Page, Document, Text, View, Image } from '@react-pdf/renderer';
import { DeclaracionesArrendador } from './ComponentesDeclaraciones/DeclaracionesArrendador';
import { DeclaracionesArrendatario } from './ComponentesDeclaraciones/DeclaracionesArrendatario';
import { DeclaracionesFiador } from './ComponentesDeclaraciones/DeclaracionesFiador';
import estilos from './EstilosContrato';
import { format, lastDayOfMonth } from "date-fns";
import { useEffect, useState } from 'react';
import { es } from "date-fns/locale";
import { PrimeraSegundaClausula } from './ComponentesCláusulas/PrimeraSegundaClausula';
import { TerceraClausula } from './ComponentesCláusulas/TerceraClausula';
import { CuartaClausula } from './ComponentesCláusulas/CuartaClausula';
import { QuintaClausula } from './ComponentesCláusulas/QuintaClausula';
import { SextaSeptimaClausula } from './ComponentesCláusulas/SextaSeptimaClausula';
import { OctavaNovenaClausula } from './ComponentesCláusulas/OctavaNovena';
import { DecimaClausula } from './ComponentesCláusulas/DecimaClausula';
import { supabase } from '../../../../config/supabase-client';

export function DocumentoContrato(contractId) {
    // Contract info.
    const [contractInfo, setContractInfo] = useState();
    const [ownerInfo, setOwnerInfo] = useState();
    const [tenantInfo, setTenantInfo] = useState();
    const [guarantorInfo, setGuarantorInfo] = useState();
    const [apartmentInfo, setApartmentInfo] = useState();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: contractData, error: contractError } = await supabase
                    .from("rentalcontracts")
                    .select()
                    .eq("id", contractId);

                if (contractError) throw error;
                setContractInfo(contractData[0]);

                // Variables for the rest of the tables.
                const ownerId = contractData[0].owner_id;
                const tenantId = contractData[0].tenantid;
                const guarantorId = contractData[0].guarantorid;
                const apartmentId = contractData[0].apartmentid;

                const { data: ownerData, error: ownerError } = await supabase
                    .from("owners")
                    .select()
                    .eq("id", ownerId);

                if (ownerError) throw error;
                setOwnerInfo(ownerData[0]);

                const { data: tenantData, error: tenantError } = await supabase
                    .from("tenants")
                    .select()
                    .eq("id", tenantId);

                if (tenantError) throw error;
                setOwnerInfo(tenantData[0]);

                const { data: guarantorData, error: guarantorError } = await supabase
                    .from("owners")
                    .select()
                    .eq("id", guarantorId);

                if (guarantorError) throw error;
                setGuarantorInfo(guarantorData[0]);

                const { data: apartmentData, error: apartmentError } = await supabase
                    .from("apartments")
                    .select()
                    .eq("id", apartmentId);

                if (apartmentError) throw error;
                setOwnerInfo(apartmentData[0]);
            } catch (error) {
                console.log(error);
            } finally {
                setIsLoading(false);
            };
        };
    }, []);

    console.log(contractInfo);

    const diaContrato = contractInfo.startdate.getDate();
    const mesContrato = contractInfo.startdate.getMonth();
    const añoContrato = contractInfo.startdate.getFullYear();

    const nombreCompletoArrendador = ownerInfo.name + " " + ownerInfo.mother_surname + " " + ownerInfo.father_surname;
    const nombreCompletoArrendatario = tenantInfo.name + " " + tenantInfo.mother_surname + " " + tenantInfo.father_surname;

    return (
        <>
            {!isLoading && (
                <Document>
                    <Page style={estilos.hoja}>
                        <View style={estilos.seccion}>
                            <Text style={estilos.centrado}>
                                CONTRATO DE ARRENDAMIENTO
                            </Text>

                            <Text style={estilos.texto}>
                                <Text style={estilos.textoMayus}>
                                    Que celebran en la ciudad de Durango, Durango, a <Text style={estilos.textoBold}>{diaContrato} del mes de {format(mesContrato, "MMMM", { locale: es })} del año {añoContrato}</Text>,
                                    por una parte el Lic. <Text style={estilos.textoBold}>{nombreCompletoArrendador}</Text>, por sus propios derechos, a quien en lo sucesivo se denominará <Text style={estilos.boldItalic}>"el arrendador"</Text>,
                                    y por la otra parte <Text>{nombreCompletoArrendatario}</Text>, por sus propios derechos, referido en lo futuro como <Text style={estilos.boldItalic}>"el arrendatario"</Text>, así como el C. ___________________
                                    constituyéndose como <Text style={estilos.boldItalic}>"fiador"</Text> del arrendatario, el cual se regirá al tenor de las siguientes <Text style={estilos.textoBold}>declaraciones</Text> y <Text style={estilos.textoBold}>cláusulas</Text>:
                                </Text>
                            </Text>
                        </View>

                        <DeclaracionesArrendador 
                            nombreVivienda={ownerInfo.name}
                            calle={ownerInfo.street}
                            numero={ownerInfo.ext_num}
                            colonia={ownerInfo.division}
                            nacionalidad="Mexicana"
                        />

                        <DeclaracionesArrendatario
                            curp={tenantInfo.governmentid}
                            nombreArrendador={tenantInfo.name}
                            apellidoPatArrendador={tenantInfo.father_surname}
                            apellidoMatArrendador={tenantInfo.mother_surname}
                        />

                        <DeclaracionesFiador
                            nacionalidad={guarantorInfo.nationality}
                        />

                        <View style={estilos.seccion}>
                            <Text style={estilos.textoBold}>
                                Declaran las partes contratantes:
                            </Text>

                            <Text style={estilos.viñetaLetra}>
                                Que es su libre y espontánea voluntad olbigarse en términos de lo establecido en el presente contrato.
                            </Text>

                            <Text style={estilos.viñetaLetra}>
                                <Text style={estilos.textoBold}>
                                    b).-
                                </Text>

                                Que se conocen recíprocamente la personalidad con que se ostentan para la celebración del contrato.
                            </Text>

                            <Text style={estilos.viñetaLetra}>
                                <Text style={estilos.textoBold}>
                                    c).-
                                </Text>

                                Que conocen y aceptan el cumplimiento del reglamento vigente que regula al INMUEBLE aquí arrendado,
                                mismo que se firma de igual manera para constancia de cumplimiento y obligación.
                            </Text>

                            <Text style={estilos.viñetaLetra}>
                                <Text style={estilos.textoBold}>
                                    d).-
                                </Text>

                                Que es su intención obligarse en términos de las siguientes:
                            </Text>
                        </View>

                        <PrimeraSegundaClausula
                            nombreVivienda={apartmentInfo.name}
                            calle={apartmentInfo.street}
                            numExt={apartmentInfo.ext_num}
                            colonia={apartmentInfo.division}
                            inicioContrato={contractInfo.startdate}
                            finContrato={contractInfo.enddate}
                        />

                        <TerceraClausula 
                            precioRenta={contractInfo.depositamount}
                        />

                        <CuartaClausula 
                            tasaInteres={ownerInfo.charge_fee}
                        />

                        <QuintaClausula />

                        <SextaSeptimaClausula 
                            calleArrendador={ownerInfo.street}
                            numExtArrendador={ownerInfo.ext_num}
                            fraccionamientoArrendador={ownerInfo.division}
                            cpArrendador={34162}
                            ciudadArrendador={ownerInfo.city}
                        />

                        <OctavaNovenaClausula />
                    </Page>

                    <Page style={estilos.hoja}>
                        <DecimaClausula 
                            nombreArrendador={ownerInfo.name}
                            apellidoPatArrendador={ownerInfo.father_surname}
                            apellidoMatArrendador={ownerInfo.mother_surname}
                            nombreArrendatario={tenantInfo.name}
                            apellidoPatArrendador={tenantInfo.father_surname}
                            apellidoMatArrendatario={tenantInfo.mother_surname}
                            nombreTestigo1="H1"
                            apellidoPatTestigo1="h1"
                            apellidoMatTestigo1="h2"
                        />
                    </Page>
                </Document>
            )}
        </>
    )
};