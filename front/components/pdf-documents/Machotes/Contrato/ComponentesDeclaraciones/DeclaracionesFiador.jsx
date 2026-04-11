import { Text, View } from '@react-pdf/renderer';
import estilos from '../EstilosContrato';

export function DeclaracionesFiador() {
    

    const nacionalidad = "mexicana";

    return (
        <View style={estilos.seccion}>
            <Text style={estilos.textoBold}>
                III.- Declara EL FIADOR:
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

                Que se obliga de manera solidaria en todas y cada una de las obligaciones contraídas en el presente contrato.
            </Text>

            <Text style={estilos.viñetaLetra}>
                <Text style={estilos.textoBold}>
                    c).-
                </Text>

                Que se identifica en términos de ____ con clave ___________.
            </Text>
        </View>
    )
}