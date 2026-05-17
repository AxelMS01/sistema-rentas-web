import { Page, Document, Text, View, Image } from '@react-pdf/renderer';
import { numeroEscrito } from '../../../../utils/numero-escrito';
import { divisorPaginasPagares } from '../../../../utils/divisor-paginas-pdf';
import estilos from './EstilosPagare';
import { differenceInMonths } from 'date-fns';
import { format, lastDayOfMonth } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Esta funcion crea un documento PDF con una lista de pagares en base a la duracion del contrato.
 *
 * Por ejemplo, genera doce pagares en un documento cuando el contrato es a un ano.
 */

export function DocumentoPagare({ pagareInfo, ownerInfo, tenantInfo, guarantorInfo, apartmentInfo }) {
    if (!pagareInfo?.startdate || !pagareInfo?.enddate || !ownerInfo || !tenantInfo || !guarantorInfo || !apartmentInfo) {
        return null;
    }

    let contadorPagares = 0;
    const startDate = new Date(pagareInfo.startdate);
    const endDate = new Date(pagareInfo.enddate);
    const contractDuration = differenceInMonths(endDate, startDate);
    const fechaConFormato = format(startDate, "dd-MM-yyyy");
    let pagaresRestantes = contractDuration;
    let pagaresEnHoja;
    let anioPagareActual;
    let fechaEscrita;
    let contadorMeses = startDate.getMonth() - 1;
    const totalPaginas = divisorPaginasPagares(pagaresRestantes);

    const chargeFee = typeof ownerInfo?.charge_fee === "string" ? ownerInfo.charge_fee.split("-") : ["percentage", "0"];
    const tenantSignature = tenantInfo?.signature_url || null;
    const tenantFullName = `${tenantInfo?.name || ""} ${tenantInfo?.father_surname || ""} ${tenantInfo?.mother_surname || ""}`.trim().toUpperCase();
    const guarantorSignature = guarantorInfo?.signature_url || null;
    const guarantorFullName = `${guarantorInfo?.name || ""} ${guarantorInfo?.father_surname || ""} ${guarantorInfo?.mother_surname || ""}`.trim().toUpperCase();

    function getSignatureNameStyle(fullName) {
        const nameLength = fullName.length;

        if (nameLength > 30) {
            return [estilos.nombreFirma, estilos.nombreFirmaMuyLargo];
        }

        if (nameLength > 22) {
            return [estilos.nombreFirma, estilos.nombreFirmaLargo];
        }

        return estilos.nombreFirma;
    }

    const FullDocument = () => (
        <Document>
            {[...Array(totalPaginas)].map((pagina, id) => {
                if (id !== 0) {
                    pagaresRestantes -= 3;
                }

                pagaresEnHoja = pagaresRestantes < 3 ? pagaresRestantes : 3;

                return (
                    <Page key={id} size="A4" style={estilos.hoja}>
                        {[...Array(pagaresEnHoja)].map((pagare, innerId) => {
                            contadorMeses += 1;
                            contadorPagares += 1;

                            anioPagareActual = startDate.getFullYear();

                            const ultimoDiaMes = lastDayOfMonth(new Date(anioPagareActual, contadorMeses, 1));
                            fechaEscrita = format(new Date(anioPagareActual, contadorMeses, ultimoDiaMes.getDate()), "PPP", { locale: es });

                            return (
                                <View key={innerId} style={estilos.contenedorPagare}>
                                    <View style={estilos.encabezado}>
                                        <Text style={estilos.textoChicoGrueso}>PAGARE</Text>

                                        <View style={estilos.enumerador}>
                                            <Text style={estilos.textoChico}>No.</Text>

                                            <View style={estilos.cuadroEnumerador}>
                                                <Text style={estilos.textoChicoGrueso}>{contadorPagares}</Text>
                                            </View>

                                            <Text style={estilos.textoChico}>de</Text>

                                            <View style={estilos.cuadroEnumerador}>
                                                <Text style={estilos.textoChicoGrueso}>{contractDuration}</Text>
                                            </View>
                                        </View>

                                        <View style={estilos.valorPagare}>
                                            <Text style={estilos.textoChico}>BUENO POR:</Text>
                                            <Text style={estilos.textoChicoGrueso}>${pagareInfo.monthlyamount}</Text>
                                        </View>
                                    </View>

                                    <View style={estilos.fecha}>
                                        <Text style={estilos.textoChicoDerecha}>
                                            En la ciudad de Durango, Dgo., a {fechaConFormato}
                                        </Text>
                                    </View>

                                    <View style={estilos.cuerpoContenedor}>
                                        <Text style={estilos.cuerpo}>
                                            Debe(mos) y pagare(mos) incondicionalmente por este Pagare a la orden de:
                                            <Text style={estilos.textoChicoGrueso}> {ownerInfo.name} {ownerInfo.father_surname} {ownerInfo.mother_surname}</Text>,
                                            el dia: <Text style={estilos.textoChicoGrueso}> {fechaEscrita}</Text>.
                                        </Text>

                                        <Text style={estilos.cuerpo}>
                                            C. {apartmentInfo.street} #{apartmentInfo.ext_num}, {apartmentInfo.division}, {apartmentInfo.city}.
                                        </Text>

                                        <Text style={estilos.cuerpo}>
                                            La cantidad de: <Text style={{ fontSize: 7, fontWeight: 600, textDecoration: "underline" }}>{numeroEscrito(pagareInfo.monthlyamount)} pesos 00/100 MXN</Text>,
                                            valor recibido a mi (nuestra) entera satisfaccion. Este Pagare forma parte de una serie numerada del
                                            <Text style={estilos.textoChicoGrueso}>1</Text> al <Text style={estilos.textoChicoGrueso}>{contractDuration} </Text>
                                            y todos estan sujetos a la condicion de que, al no pagarse, cualquiera de ellos a su vencimiento,
                                            seran exigibles todos los que le siguen en su numero, ademas de los ya vencidos, desde la fecha de vencimiento de este documento hasta el dia de su liquidacion,
                                            causaran intereses moratorios al tipo de <Text style={estilos.textoChicoGrueso}>{chargeFee[1]} {chargeFee[0] === "percentage" ? "% mensual" : "pesos mensuales"}</Text>, pagadero
                                            en esta ciudad juntamente con el principal, mas los gastos que por ello se originen.
                                        </Text>
                                    </View>

                                    <View style={estilos.parteInferior}>
                                        <View style={estilos.datosPersonas}>
                                            <View style={estilos.contenedorDatos}>
                                                <Text style={estilos.textoChicoGrueso}>SUSCRIPTOR</Text>
                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Nombre:</Text>
                                                    <Text style={estilos.textoChico}>{(tenantInfo?.name || "").toUpperCase()}</Text>
                                                </View>

                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Direccion: </Text>
                                                    <Text style={estilos.textoChico}>
                                                        {apartmentInfo.street} {apartmentInfo.ext_num}, {apartmentInfo.division}, {apartmentInfo.city}
                                                    </Text>
                                                </View>

                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Telefono:</Text>
                                                    <Text style={estilos.textoChico}>{tenantInfo.phone}</Text>
                                                </View>
                                            </View>

                                            <View style={estilos.contenedorDatos}>
                                                <Text style={estilos.textoChicoGrueso}>AVAL</Text>
                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Nombre:</Text>
                                                    <Text style={estilos.textoChico}>{(guarantorInfo?.name || "").toUpperCase()}</Text>
                                                </View>

                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Direccion:</Text>
                                                    <Text style={estilos.textoChico}>
                                                        {guarantorInfo.street} {guarantorInfo.ext_num}, {guarantorInfo.division}, {guarantorInfo.city}, {guarantorInfo.state}
                                                    </Text>
                                                </View>

                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Telefono:</Text>
                                                    <Text style={estilos.textoChico}>{guarantorInfo.phone}</Text>
                                                </View>
                                            </View>
                                        </View>

                                        <View style={estilos.firmas}>
                                            <View style={estilos.espacioFirma}>
                                                <View style={estilos.contenedorFirma}>
                                                    {tenantSignature && <Image src={tenantSignature} />}
                                                </View>

                                                <Text style={getSignatureNameStyle(tenantFullName)}>
                                                    {tenantFullName}
                                                </Text>
                                            </View>

                                            <View style={estilos.espacioFirma}>
                                                <View style={estilos.contenedorFirma}>
                                                    {guarantorSignature && <Image src={guarantorSignature} />}
                                                </View>

                                                <Text style={getSignatureNameStyle(guarantorFullName)}>
                                                    {guarantorFullName}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        })}
                    </Page>
                )
            })}
        </Document>
    );

    return <FullDocument />;
};
