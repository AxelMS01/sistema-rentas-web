import { Text, View } from '@react-pdf/renderer';
import estilos from '../EstilosContrato';

export function OctavaNovenaClausula() {
    return (
        <View style={estilos.seccion}>
            <Text style={estilos.textoBold}>
                OCTAVA.- DE LA NULIDAD DE ACTOS CONTRACTUALES.
            </Text>

            <Text style={estilos.viñetaLetra}>
                El presente Contrato constituye una inicial relación de arrendamiento, por lo
                que con éste mismo se dejan sin efecto los Contratos de Arrendamiento que se
                celebraron con anterioridad al inicio de vigencia del presente y los sucesivos que se
                celebren durante la vigencia del mismo.
            </Text>

            <Text style={estilos.textoBold}>
                NOVENA.- DEL VALOR DE LAS CLÁUSULAS.
            </Text>

            <Text style={estilos.viñetaLetra}>
                Las partes manifiestan que todas y cada una de las declaraciones
                plasmadas en el capítulo anterior al que se clausula y forman parte integrante del
                presente contrato.
            </Text>
        </View>
    );
};