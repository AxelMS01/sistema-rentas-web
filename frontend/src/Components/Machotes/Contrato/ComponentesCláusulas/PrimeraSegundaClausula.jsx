import { Text, View } from '@react-pdf/renderer';
import estilos from '../EstilosContrato';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function PrimeraSegundaClausula() {
    const info = {
        nombreVivienda: "HABITACIÓN NÚMERO 8",
        calle: "República de Uruguay",
        numExt: "410",
        colonia: "Francisco Zarco",
        inicioContrato: new Date(2026, 2, 31),
        finContrato: new Date(2027, 30, 2),
    };

    const nacionalidad = "colombiana";

    return (
        <View style={estilos.seccion}>
            <Text style={estilos.textoSeparado}>
                Cláusulas
            </Text>

            <Text style={estilos.textoBold}>
                PRIMERA.- DEL OBJETO.-
            </Text>

            <Text style={estilos.viñetaLetra}>
                Por virtud de la celebración del presente instrumento, el "ARRENDADOR", da en arrendamiento al "ARRENDATARIO" la habitación ubicada dentro del inmueble en
                <Text style={estilos.textoSubrayado}> Calle {info.calle} No. {info.numExt} de la Colonia {info.colonia} en esta Ciudad Capital,</Text>
                identificada como "{info.nombreVivienda}", quien la recibe de conformidad, a cambio del pago de una cantidad rentaria en los términos expuestos
                en el clausulado siguiente.
            </Text>

            <Text style={estilos.textoBold}>
                SEGUNDA.- DE LA VIGENCIA.
            </Text>

            <Text style={estilos.viñetaLetra}>
                Las partes contratantes pactan que el presente contrato se celebra con una duración forzosa de <Text style={estilos.textoBold}>DOS MESES</Text> para
                ambas partes, sin que pueda prorrograrse por ningún motivo, y en todo caso a su terminación, de ser procedente las partes suscribirán nuevo contrato,
                el cual deberá constar por escrito.
            </Text>

            <Text style={estilos.viñetaLetra}>
                Las partes convienen en que el plazo al que se hace referencia en el párraf anterior empezará a tener vigencia el día {format(info.inicioContrato, "PPP", { locale: es })},
                y terminará el día {format(info.finContrato, "PPP", { locale: es })}.
            </Text>

            <Text style={estilos.viñetaLetra}>
                Al término de duración del presente instrumento, deberá EL
                ARRENDATARIO desocupar EL INMUEBLE sin necesidad de declaración judicial previa.
                Para el caso de que el “ARRENDATARIO” deseare continuar arrendando el inmueble,
                deberá solicitarlo por escrito a la “ARRENDADORA” con una anticipación de 30 (treinta)
                días al vencimiento del plazo antes señalado con el aumento en el monto de las
                mensualidades del arrendamiento que previamente señale EL ARRENDADOR, sin que
                esto implique previa aceptación, novación o prórroga a este contrato.
            </Text>
        </View>
    );
};