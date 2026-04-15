import { Text, View } from '@react-pdf/renderer';
import estilos from '../EstilosContrato';

export function DeclaracionesArrendatario(curp, nombreArrendador, nombrePatArrendador, apellidoMatArrendador) {
    const infoDeclaraciones = {
        curp: "PUAJ010302HNENLNA7",
        nombreArrendador: "Betzái",
        apellidoPatArrendador: "Cháidez",
        apellidoMatArrendador: "Lechuga",
    };

    const nacionalidad = "mexicana";
    const nombreCompletoArrendador = infoDeclaraciones.nombreArrendador + " " + infoDeclaraciones.apellidoPatArrendador + " " + infoDeclaraciones.apellidoMatArrendador;

    return (
        <View style={estilos.seccion}>
            <Text style={estilos.textoBold}>
                II.- Declara EL ARRENDATARIO:
            </Text>

            <Text style={estilos.viñetaLetra}>
                <Text style={estilos.textoBold}>
                    a).-
                </Text>

                Que es una persona física, de nacionalidad {nacionalidad} y que cuenta con la
                capacidad legal necesaria para obligarse en términos de los dispuesto en este contrato.
            </Text>

            <Text style={estilos.viñetaLetra}>
                <Text style={estilos.textoBold}>
                    b).-
                </Text>

                Que cuenta con la capacidad económica para solventar las obligaciones que contrae por este contrato.
            </Text>

            <Text style={estilos.viñetaLetra}>
                <Text style={estilos.textoBold}>
                    c).-
                </Text>

                Que conoce el inmueble objeto de este arrendamiento, mismo que se encuentra en buen estado de uso y
                conservación para los fines que lo destinará, así como que cuenta con las condiciones de salubridad e higiene
                necesarias para la habitabilidad del inmueble.
            </Text>

            <Text style={estilos.viñetaLetra}>
                <Text style={estilos.textoBold}>
                    d).-
                </Text>

                Que se identifica en términos de CURP con clave {infoDeclaraciones.curp}
            </Text>

            <Text style={estilos.viñetaLetra}>
                <Text style={estilos.textoBold}>
                    d).-
                </Text>

                Que ha solicitado a <Text style={estilos.textoBold}>{nombreCompletoArrendador.toUpperCase()}</Text> la celebración del presente contrato.
            </Text>
        </View>
    )
}