import { Text, View } from '@react-pdf/renderer';
import estilos from '../EstilosContrato';

export function CuartaClausula() {
    const info = {
        tasaInteres: 8,
    };

    return (
        <View style={estilos.seccion}>
            <Text style={estilos.textoBold}>
                CUARTA.- DE LAS OBLIGACIONES DEL ARRENDATARIO.
            </Text>

            <Text style={estilos.viñetaLetra}>
                Expresamente se prohíbe al “ARRENDATARIO” traspasar subarrendar o
                ceder onerosa o gratuitamente toda o parte de la localidad arrendada sin previo permiso
                por escrito del “ARRENDADOR”, conservando aquel en todo caso las responsabilidades
                que adquiere en este contrato en los términos del artículo 2480 del Código Civil para el
                Distrito Federal vigente, siendo causa de rescisión cualquier acto en contravención a esta
                cláusula conforme a lo dispuesto por la fracción III del artículo 2489 del mencionado
                código.
            </Text>

            <Text style={estilos.viñetaLetra}>
                Será obligación del ARRENDATARIO cubrir el monto mensual de
                arrendamiento dentro de los primeros treinta días de cada mes, en la inteligencia de que,
                de no ser así, el ARRENDADOR quedará facultado para cobrar el {info.tasaInteres}% de interés diario
                sobre el monto del arrendamiento hasta la total liquidación del adeudo.
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

            <Text style={estilos.viñetaLetra}>
                No podrá el “ARRENDATARIO” sin consentimiento por escrito del
                “ARRENDADOR” variar la forma de la localidad arrendada, comprometiéndose a
                devolverla en el estado en que la recibió. Para efectuar cualquier mejora o instalación en
                el inmueble objeto de este arrendamiento, deberá obtener autorización por escrito del
                “ARRENDADOR”, ya que en caso contrario todas aquellas que puedan ser aprovechables
                quedarán en beneficio del inmueble sin que exista obligación del propietario del inmueble
                a cubrir importe pagado por las mismas, siendo causa de rescisión cualquier práctica en
                contrario en los términos de la fracción II del artículo 2489 del Código Civil para el Distrito
                Federal vigente.
            </Text>

            <Text style={estilos.viñetaLetra}>
                El “ARRENDATARIO” no podrá poner sustancias peligrosas, corrosivas,
                deletéreas o flamables en el inmueble arrendado.
            </Text>

            <Text style={estilos.viñetaLetra}>
                En caso de siniestro producido en el inmueble objeto de este arrendamiento,
                el “ARRENDATARIO” deberá cubrir a el “ARRENDADOR”, vecinos y/o terceros afectados
                los daños y/o perjuicios que se les ocasione, en tanto no sean fortuitos o causas de fuerza
                mayor en los términos de los artículos 2435, 2437,2439 y demás relativos del Código Civil
                para el Distrito Federal vigente.
            </Text>

            <Text style={estilos.viñetaLetra}>
                El “ARRENDATARIO” no podrá bajo ninguna circunstancia realizar acto u
                omisión alguno que afecte o comprometa la estabilidad, seguridad, salubridad, o
                comodidad del inmueble arrendado.
            </Text>
        </View>
    );
};