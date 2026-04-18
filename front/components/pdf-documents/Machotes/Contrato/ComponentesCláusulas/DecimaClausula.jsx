import { Text, View, Image } from '@react-pdf/renderer';
import estilos from '../EstilosContrato';

export function DecimaClausula({
    nombreArrendador,
    apellidoPatArrendador,
    apellidoMatArrendador,
    nombreArrendatario,
    apellidoMatArrendatario,
    nombreTestigo1,
    apellidoPatTestigo1,
    apellidoMatTestigo1
}) {
    const nombreComArrendador = nombreArrendador + " " + apellidoPatArrendador + " " + apellidoMatArrendador;
    const nombreComArrendatario = nombreArrendatario + " " + apellidoPatArrendatario + " " + apellidoMatArrendatario;
    const nombreComTestigo1 = nombreTestigo1 + " " + apellidoPatTestigo1 + " " + apellidoMatTestigo1;

    return (
        <View style={estilos.seccion}>
            <Text style={estilos.textoBold}>
                DÉCIMA,. DE LA JURISDICCIÓN.
            </Text>

            <Text style={estilos.viñetaLetra}>
                El presente Contrato constituye una inicial relación de arrendamiento, por lo
                que con éste mismo se dejan sin efecto los Contratos de Arrendamiento que se
                celebraron con anterioridad al inicio de vigencia del presente y los sucesivos que se
                celebren durante la vigencia del mismo.
            </Text>

            <Text style={estilos.viñetaLetra}>
                LEÍDO QUE FUE EL PRESENTE CONTRATO POR LAS PARTES QUIENES
                ENTERADAS DEL CONTENIDO, VALOR Y CONSECUENCIAS LEGALES DE TODAS Y
                CADA UNA DE SUS CLÁUSULAS AL HABER TENIDO A SU VISTA LOS CÓDIGOS Y
                LEYES REGLAMENTARIAS DEL PRESENTE CONTRATO, LO FIRMAN POR
                DUPLICADO ANTE LA FE DE LOS TESTIGOS QUE FIRMAN Y DAN FE.
            </Text>

            <View style={estilos.dosFirmas}>
                <View style={estilos.espacioFirma}>
                    <Text style={estilos.textoBold}>EL ARRENDADOR</Text>

                    <View style={estilos.contenedorFirmaImg}>
                        <Image>
                            {/* Incluir aquí la firma del arrendador */}
                        </Image>
                    </View>

                    <Text style={estilos.textoBold}>
                        {nombreComArrendador.toUpperCase()}
                    </Text>
                </View>

                <View style={estilos.espacioFirma}>
                    <Text style={estilos.textoBold}>EL ARRENDATARIO</Text>

                    <View style={estilos.contenedorFirmaImg}>
                        <Image>
                            {/* Incluir aquí la firma del arrendatario */}
                        </Image>
                    </View>

                    <Text style={estilos.textoBold}>
                        {nombreComArrendatario.toUpperCase()}
                    </Text>
                </View>
            </View>

            <Text style={{textAlign: "center", marginTop: 20, fontWeight: 600, fontSize: 12}}>TESTIGOS</Text>

            <View style={estilos.dosFirmas}>
                <View style={estilos.espacioFirma}>
                    <View style={estilos.contenedorFirmaImg}>
                        <Image>
                            {/* Incluir aquí la firma del arrendador */}
                        </Image>
                    </View>

                    <Text style={estilos.textoBold}>
                        {nombreComTestigo1.toUpperCase()}
                    </Text>
                </View>

                <View style={estilos.espacioFirma}>
                    <View style={estilos.contenedorFirmaImg}>
                        <Image>
                            {/* Incluir aquí la firma del arrendatario */}
                        </Image>
                    </View>

                    <Text style={estilos.textoBold}>
                        NOMBRE TESTIGO 2
                    </Text>
                </View>
            </View>
        </View>
    );
};