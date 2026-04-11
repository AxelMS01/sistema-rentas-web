import { Text, View } from '@react-pdf/renderer';
import estilos from '../EstilosContrato';
import { numeroEscrito } from '../../../../../utils/numero-escrito';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function TerceraClausula() {
    const info = {
        precioRenta: 4000,
    };

    return (
        <View style={estilos.seccion}>
            <Text style={estilos.textoBold}>
                TERCERA.- DEL MONTO DEL ARRENDAMIENTO.
            </Text>

            <Text style={estilos.viñetaLetra}>
                Durante la vigencia de este contrato, las partes pactan por concepto de renta
                mensual por el arrendamiento la suma de - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                - - - - - <Text style={estilos.textoBold}>
                    ${info.precioRenta} (<Text>{numeroEscrito(info.precioRenta)} PESOS 00/100 M.N.</Text>)
                </Text>, MENSUALES pagaderos por adelantado dentro de los primeros treinta días de cada mes.
            </Text>

            <Text style={estilos.viñetaLetra}>
                Adicionalmente, El ARRENDATARIO se obliga a pagar al ARRENDADOR
                por concepto de depósito, la cantidad de - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
                - - - - - <Text style={estilos.textoBold}>
                    ${info.precioRenta} (<Text>{numeroEscrito(info.precioRenta)} PESOS 00/100 M.N.</Text>)
                </Text>, misma que será reembolsada
                por el ARRENDADOR al término de la vigencia del presente en el supuesto de que el
                ARRENDATARIO devuelva el inmueble arrendado en las mismas condiciones en que le
                fue entregado y en términos del ANEXO ÚNICO que se agrega al presente.
            </Text>
        </View>
    );
};