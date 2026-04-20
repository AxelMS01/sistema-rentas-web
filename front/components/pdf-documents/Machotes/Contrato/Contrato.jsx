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

export function DocumentoContrato({ contractInfo, ownerInfo, tenantInfo, guarantorInfo, apartmentInfo, isActive }) {
    const fechaContrato = new Date(contractInfo.startdate);
    const diaContrato = fechaContrato.getDate();
    const mesContrato = fechaContrato.getMonth();
    const añoContrato = fechaContrato.getFullYear();

    const nombreCompletoArrendador = ownerInfo.name + " " + ownerInfo.father_surname + " " + ownerInfo.mother_surname;
    const nombreCompletoArrendatario = tenantInfo.name + " " + tenantInfo.father_surname + " " + tenantInfo.mother_surname;
    const nombreCompletoAval = guarantorInfo.name + " " + guarantorInfo.father_surname + " " + guarantorInfo.mother_surname;

    function formatMonthName(monthNum) {
        const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        return monthNames[monthNum];
    };

    return (
        <>
            <Document>
                <Page style={estilos.hoja}>
                    <View style={estilos.seccion}>
                        <Text style={estilos.centrado}>
                            CONTRATO DE ARRENDAMIENTO
                        </Text>

                        <Text style={estilos.texto}>
                            <Text style={estilos.textoMayus}>
                                Que celebran en la ciudad de Durango, Durango, a <Text style={estilos.textoBold}>{diaContrato} del mes de {formatMonthName(mesContrato)} del año {añoContrato}</Text>,
                                por una parte el Lic. <Text style={estilos.textoBold}>{nombreCompletoArrendador}</Text>, por sus propios derechos, a quien en lo sucesivo se denominará <Text style={estilos.boldItalic}>"el arrendador"</Text>,
                                y por la otra parte <Text>{nombreCompletoArrendatario}</Text>, por sus propios derechos, referido en lo futuro como <Text style={estilos.boldItalic}>"el arrendatario"</Text>, así como el C. {nombreCompletoAval}
                                constituyéndose como <Text style={estilos.boldItalic}>"fiador"</Text> del arrendatario, el cual se regirá al tenor de las siguientes <Text style={estilos.textoBold}>declaraciones</Text> y <Text style={estilos.textoBold}>cláusulas</Text>:
                            </Text>
                        </Text>
                    </View>

                    <DeclaracionesArrendador
                        nombreVivienda={apartmentInfo.name}
                        calle={ownerInfo.street}
                        numero={ownerInfo.ext_num}
                        colonia={ownerInfo.division}
                        nacionalidad="Mexicana"
                    />

                    <DeclaracionesArrendatario
                        curp={tenantInfo.governmentid}
                        nombreArrendador={ownerInfo.name}
                        apellidoPatArrendador={ownerInfo.father_surname}
                        apellidoMatArrendador={ownerInfo.mother_surname}
                    />

                    <DeclaracionesFiador
                        nacionalidad={guarantorInfo.nationality}
                    />

                    <View style={estilos.seccion}>
                        <Text style={estilos.textoBold}>
                            Declaran las partes contratantes:
                        </Text>

                        <Text style={estilos.viñetaLetra}>
                            <Text style={estilos.textoBold}>
                                a).-
                            </Text>
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
                        duracionForzosa={ownerInfo.minimum_duration}
                    />

                    <TerceraClausula
                        precioRenta={contractInfo.depositamount}
                    />

                    <CuartaClausula
                        tasaInteres={ownerInfo.charge_fee}
                    />

                    <QuintaClausula />

                    <SextaSeptimaClausula
                        ownerAlternateAddr={{
                            calle: ownerInfo.street,
                            numExt: ownerInfo.ext_num,
                            fraccionamiento: ownerInfo.division,
                            cp: ownerInfo.postal_code,
                            ciudad: ownerInfo.city
                        }}
                        tenantAlternateAddr={{
                            calle: tenantInfo.alt_street,
                            numExt: tenantInfo.alt_ext_num,
                            fraccionamiento: tenantInfo.alt_division,
                            ciudad: ownerInfo.city
                        }}
                    />

                    <OctavaNovenaClausula />
                </Page>

                <Page style={estilos.hoja}>
                    <DecimaClausula
                        nombreArrendador={ownerInfo.name}
                        apellidoPatArrendador={ownerInfo.father_surname}
                        apellidoMatArrendador={ownerInfo.mother_surname}
                        nombreArrendatario={tenantInfo.name}
                        apellidoPatArrendatario={tenantInfo.father_surname}
                        apellidoMatArrendatario={tenantInfo.mother_surname}
                        nombreTestigo1=""
                        apellidoPatTestigo1=""
                        apellidoMatTestigo1=""
                        isActive={isActive}
                        signatureOwner={ownerInfo.signature_url}
                        signatureTenant={tenantInfo.signature_url}
                    />
                </Page>
            </Document>
        </>
    )
};