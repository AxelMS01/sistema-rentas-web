import { Text, View } from '@react-pdf/renderer';
import estilos from '../EstilosContrato';

export function DeclaracionesArrendador({nombreVivienda, calle, numero, colonia, nacionalidad}) {

    return (
        <View style={estilos.seccion}>
            <Text style={estilos.textoSeparado}>
                Declaraciones
            </Text>

            <Text style={estilos.textoBold}>
                I.- Declara EL ARRENDADOR:
            </Text>

            <Text style={estilos.viñetaLetra}>
                <Text style={estilos.textoBold}>
                    a).-
                </Text>

                Que es una persona física, de nacionalidad {nacionalidad}, de ocupación comerciante
                y con capacidad legal suficiente para obligarse en términos del presente contrato.
            </Text>

            <Text style={estilos.viñetaLetra}>
                <Text style={estilos.textoBold}>
                    b).-
                </Text>

                Que comparece al presente acto en calidad de propietario legal de la habitación
                ubicada dentro del inmueble en Calle {calle} No. {numero}, Colonia {colonia} 
                en esta Ciudad Capital, identificada como {nombreVivienda}, mismo que cuenta con dos tarimas y colchones individuales, dos mesas de trabajo, dos sillas,
                persianas, baño individual, espejo fijo, clóset, juego de llaves, etc.
            </Text>

            <Text style={estilos.viñetaLetra}>
                <Text style={estilos.textoBold}>
                    c).-
                </Text>

                Que EL INMUEBLE se encuentra al corriente de los pagos de impuesto predial, energía eléctrica y consumos de agua.
            </Text>

            <Text style={estilos.viñetaLetra}>
                <Text style={estilos.textoBold}>
                    d).-
                </Text>

                Que el inmueble objeto del presente contrato se encuentra en buen estado de uso y conservación para los fines a los cuales se destinará.
            </Text>
        </View>
    );
};