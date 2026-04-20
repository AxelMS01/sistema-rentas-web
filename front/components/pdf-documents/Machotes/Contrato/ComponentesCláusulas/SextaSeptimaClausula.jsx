import { Text, View } from '@react-pdf/renderer';
import estilos from '../EstilosContrato';

export function SextaSeptimaClausula({ ownerAlternateAddr, tenantAlternateAddr }) {
    return (
        <View style={estilos.seccion}>
            <Text style={estilos.textoBold}>
                SEXTA.- DEL TÉRMINO DEL ARRENDAMIENTO.
            </Text>

            <Text style={estilos.viñetaLetra}>
                El “ARRENDAMIENTO” se compromete al terminar el arrendamiento por
                cualquier causa a desocupar y entregar el inmueble arrendado en el mismo estado en que
                lo recibe, con todo lo que le pertenece de hecho y por derecho, siendo responsable de los
                deterioros a dicho inmueble que no sean consecuencia del uso normal y moderado del
                objeto de este arrendamiento, así como de los faltantes, siendo por cuenta suya los
                gastos de reparación de aquellos desperfectos que no impidan el uso y goce de la
                localidad en los términos del artículo 2444 del Código Civil vigente, obligándose a
                indemnizar al “ARRENDADOR” por cualquier daño en la localidad arrendada causado por
                su culpa o la de sus empleados, parientes y demás personas que acudan a la misma,
                comprometiéndose a mantener aseados y en buen estado los servicios e instalaciones
                existentes, cumpliendo con las disposiciones de higiene ecología y protección civil
                aplicables, siendo causa de rescisión cualquier práctica en contrario. En el supuesto de
                que el ARRENDATARIO se negare a entregar al ARRENDADOR el inmueble base del
                presente al término de su vigencia, deberá pagar un cien por ciento adicional al monto del
                arrendamiento correspondiente mensualmente hasta la total desocupación del inmueble,
                en el entendido de que serán a cargo del ARRENDATARIO los gastos que se generen por
                concepto de los procedimientos judiciales que se lleven a cabo para lograr la entrega
                material del multireferido bien inmueble.
            </Text>

            <Text style={estilos.textoBold}>
                SÉPTIMA.- DE LOS DOMICILIOS.
            </Text>

            <View style={{ flexDirection: "column", gap: 10 }}>
                <Text style={estilos.viñetaLetra}>
                    Para cualquier aviso o notificación que las partes deban darse de conformidad con el presente Contrato,
                    señalan como domicilios los siguientes:
                </Text>
                <View style={estilos.domicilios}>
                    <View style={estilos.bloqueDomicilio}>
                        <Text style={estilos.textoMayus}>El Arrendador</Text>

                        <Text style={estilos.textoMayus}>
                            C. {ownerAlternateAddr.calle} {ownerAlternateAddr.numExt} Fracc. {ownerAlternateAddr.fraccionamiento}, C.P. {ownerAlternateAddr.cp}, {ownerAlternateAddr.ciudad}
                        </Text>
                    </View>

                    <View style={estilos.bloqueDomicilio}>
                        <Text style={estilos.textoMayus}>El Arrendatario</Text>

                        <Text style={estilos.textoMayus}>
                            C. {tenantAlternateAddr.calle} {tenantAlternateAddr.numExt} Fracc. {tenantAlternateAddr.fraccionamiento}, {tenantAlternateAddr.ciudad}
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};