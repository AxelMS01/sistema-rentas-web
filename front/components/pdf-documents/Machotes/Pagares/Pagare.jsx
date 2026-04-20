import { Page, Document, Text, View, Image } from '@react-pdf/renderer';
import { numeroEscrito } from '../../../../utils/numero-escrito';
import { divisorPaginasPagares } from '../../../../utils/divisor-paginas-pdf';
import estilos from './EstilosPagare';
import { differenceInMonths } from 'date-fns';
import { format, lastDayOfMonth } from "date-fns";
import { es } from "date-fns/locale";

/**
 * Esta función crea un documento PDF con una lista de pagarés en base a la duración del contrato.
 * 
 * Por ejemplo, genera **doce** pagarés en un documento cuando el contrato es a un año.
 * @param informacion Representa el objeto que contiene toda la información necesaria para crear los pagarés.
 * @returns Un documento PDF conteniendo todos los pagarés, en base a la duración del contrato.
 */

export function DocumentoPagare({ pagareInfo, ownerInfo, tenantInfo, guarantorInfo, apartmentInfo }) {
    let contadorPagares = 0;
    const startDate = new Date(pagareInfo.startdate);
    const endDate = new Date(pagareInfo.enddate);

    const contractDuration = differenceInMonths(endDate, startDate);
    console.log(contractDuration);
    const fechaConFormato = format(startDate, "dd-MM-yyyy");
    let pagaresRestantes = contractDuration; // Inicializamos los pagarés restantes con la duración en meses del contrato.
    let pagaresEnHoja; // Indica el número de pagarés que debe contener la hoja de la iteración actual.
    let añoPagareActual; // Indica el año de la fecha a pagar del pagaré de la iteración actual.
    let fechaEscrita;
    let contadorMeses = startDate.getMonth() - 1; // Inicializamos el contador con el mes de la fecha en la que se emiten los pagarés.
    let totalPaginas = divisorPaginasPagares(pagaresRestantes);

    const chargeFee = ownerInfo.charge_fee.split("-");

    const FullDocument = () => (
        <Document>

            {/* Obtenemos el número de páginas del PDF con la función 'divisorPaginasPagares', pasándole los meses que durará del contrato. */}
            {[...Array(totalPaginas)].map((pagina, id) => {
                if (id === 0) {
                    pagaresRestantes = pagaresRestantes;
                } else {
                    pagaresRestantes -= 3;
                };

                if (pagaresRestantes < 3) {
                    pagaresEnHoja = pagaresRestantes;
                } else {
                    pagaresEnHoja = 3;
                };

                return (
                    <Page key={id} size={'A4'} style={estilos.hoja}>
                        {/* Por cada hoja del PDF, debe haber al menos tres recuadros de pagarés. */}

                        {[...Array(pagaresEnHoja)].map((pagare, id) => {
                            contadorMeses += 1;
                            contadorPagares += 1;

                            añoPagareActual = startDate.getFullYear();

                            const ultimoDiaMes = lastDayOfMonth(new Date(añoPagareActual, contadorMeses, 1));

                            // Generamos la fecha escrita a incluirse en el cuerpo del pagaré, en base al mes actual del mismo.
                            fechaEscrita = format(new Date(añoPagareActual, contadorMeses, ultimoDiaMes.getDate()), "PPP", { locale: es });

                            return (
                                <View key={id} style={estilos.contenedorPagare}>
                                    <View style={estilos.encabezado}>
                                        <Text style={estilos.textoChicoGrueso}>PAGARÉ</Text>

                                        <View style={estilos.enumerador}>
                                            <Text style={estilos.textoChico}>No.</Text>

                                            <View style={estilos.cuadroEnumerador}>
                                                <Text style={estilos.textoChicoGrueso}>
                                                    {contadorPagares}
                                                </Text>
                                            </View>

                                            <Text style={estilos.textoChico}>de</Text>

                                            <View style={estilos.cuadroEnumerador}>
                                                <Text style={estilos.textoChicoGrueso}>
                                                    {contractDuration}
                                                </Text>
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

                                    <View>
                                        <Text style={estilos.cuerpo}>
                                            Debe(mos) y pagare(mos) incondicionalmente por este Pagaré a la orden de:
                                            <Text style={estilos.textoChicoGrueso}> {ownerInfo.name} {ownerInfo.father_surname} {ownerInfo.mother_surname}</Text>,
                                            el día: <Text style={estilos.textoChicoGrueso}> {fechaEscrita}</Text>,
                                            C. {apartmentInfo.street} #{apartmentInfo.ext_num}, {apartmentInfo.division}, {apartmentInfo.city}.
                                            La cantidad de: <Text style={{ fontSize: 7, fontWeight: 600, textDecoration: "underline" }}>{numeroEscrito(pagareInfo.monthlyamount)} pesos 00/100 MXN</Text>,
                                            valor recibido a mi (nuestra) entera satisfacción. Este Pagaré forma parte de una serie numerada del
                                            <Text style={estilos.textoChicoGrueso}>1</Text> al <Text style={estilos.textoChicoGrueso}>{contractDuration} </Text>
                                            y todos están sujetos a la condición de que, al no pagarse, cualquiera de ellos a su vencimiento,
                                            serán exigibles todos los que le siguen en su número, además de los ya vencidos, desde la fecha de vencimiento de este documento hasta el día de su liquidación,
                                            causarán intereses moratorios al tipo de <Text style={estilos.textoChicoGrueso}>{chargeFee[1]} {chargeFee[0] === "percentage" ? "% mensual" : "pesos mensuales"}</Text>, pagadero
                                            en esta ciudad juntamente con el principal, más los gastos que por ello se originen.
                                        </Text>
                                    </View>

                                    <View style={estilos.parteInferior}>
                                        <View style={estilos.datosPersonas}>
                                            <View style={estilos.contenedorDatos}>
                                                <Text style={estilos.textoChicoGrueso}>SUSCRIPTOR</Text>
                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Nombre:</Text>
                                                    <Text style={estilos.textoChico}>{tenantInfo.name.toUpperCase()}</Text>
                                                </View>

                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Dirección: </Text>
                                                    <Text style={estilos.textoChico}>
                                                        {apartmentInfo.street} {apartmentInfo.ext_num}, {apartmentInfo.division}, {apartmentInfo.city}
                                                    </Text>
                                                </View>

                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Teléfono:</Text>
                                                    <Text style={estilos.textoChico}>{tenantInfo.phone}</Text>
                                                </View>
                                            </View>

                                            <View style={estilos.contenedorDatos}>
                                                <Text style={estilos.textoChicoGrueso}>AVAL</Text>
                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Nombre:</Text>
                                                    <Text style={estilos.textoChico}>{guarantorInfo.name.toUpperCase()}</Text>
                                                </View>

                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Dirección:</Text>
                                                    <Text style={estilos.textoChico}>
                                                        {guarantorInfo.street} {guarantorInfo.ext_num}, {guarantorInfo.division}, {guarantorInfo.city}, {guarantorInfo.state}
                                                    </Text>
                                                </View>

                                                <View style={{ display: "flex", flexDirection: "row", gap: 2 }}>
                                                    <Text style={estilos.textoChicoGrueso}>Teléfono:</Text>
                                                    <Text style={estilos.textoChico}>{guarantorInfo.phone}</Text>
                                                </View>
                                            </View>
                                        </View>


                                        <View style={estilos.firmas}>
                                            <View style={estilos.espacioFirma}>
                                                <View style={estilos.contenedorFirma}>
                                                    <Image src={tenantInfo.signature_url} />
                                                </View>

                                                <Text style={estilos.textoChico}>
                                                    {(tenantInfo.name + " " + tenantInfo.father_surname + " " + tenantInfo.mother_surname).toUpperCase()}
                                                </Text>
                                            </View>

                                            <View style={estilos.espacioFirma}>
                                                <View style={estilos.contenedorFirma}>
                                                    <Image />
                                                </View>

                                                <Text style={estilos.textoChico}>
                                                    {(tenantInfo.name + " " + tenantInfo.father_surname + " " + tenantInfo.mother_surname).toUpperCase()}
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

    return (
        <FullDocument />
    )
};