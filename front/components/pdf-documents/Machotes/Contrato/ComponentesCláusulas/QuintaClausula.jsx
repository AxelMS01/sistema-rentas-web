import { Text, View } from '@react-pdf/renderer';
import estilos from '../EstilosContrato';

export function QuintaClausula() {
    return (
        <View style={estilos.seccion}>
            <Text style={estilos.textoBold}>
                QUINTA.- DEL PAGO DE LOS SERVICIOS.
            </Text>

            <Text style={estilos.viñetaLetra}>
                El suministro de luz, agua, gas e internet serán por cuenta del
                “ARRENDADOR”, en el entendido de que si el ARRENDATARIO deseara un servicio
                extra, será a cuenta propia debiendo informar al ARRENDADOR sobre los mismos, en la
                inteligencia de que al verificarse la entrega material del inmueble, el ARRENDATARIO
                demostrará fehacientemente estar al corriente en los pagos de los servicios
                extraordinarios, quedando a salvo el derecho del ARRENDADOR para reclamar el pago
                total del mismo en el supuesto de contravenir este acuerdo.
            </Text>

            <Text style={estilos.viñetaLetra}>
                Para el supuesto de que el ARRENDATARIO desee contar con un cajón de
                estacionamiento, deberá previamente negociar con el ARRENDADOR el costo extra,
                recabándose para tal efecto un documento que detalle dicho servicio, y para los efectos
                legales a que haya lugar, será agregado al presente para que forme parte de su
                clausulado.
            </Text>

            <Text style={estilos.viñetaLetra}>
                Por el pago y cumplimiento de los arrendamientos aquí pactados, el
                ARRENDATARIO firmará doce documentos mercantiles de los denominados
                “pagaré” que respaldarán los arrendamientos base del presente, mismos que serán
                devueltos al ARRENDATARIO al momento de liquidar la mensualidad
                correspondiente y a su vez fungirán éstos como recibos de pago de arrendamiento
                correspondiente, so pena de hacerlos valer de manera subsidiaria en las vías
                judiciales conducentes en el supuesto de impago antes previsto.
            </Text>
        </View>
    );
};