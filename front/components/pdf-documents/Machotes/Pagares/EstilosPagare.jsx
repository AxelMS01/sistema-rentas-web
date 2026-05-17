import { StyleSheet } from "@react-pdf/renderer";

const estilos = StyleSheet.create({
    textoChico: {
        fontSize: 8,
    },
    textoChicoGrueso: {
        fontSize: 8,
        fontWeight: 600,
    },
    textoChicoDerecha: {
        fontSize: 8,
        textAlign: "right",
    },
    textoNormal: {
        fontSize: 10,
        fontWeight: 400,
    },
    textoNormalGrueso: {
        fontSize: 10,
        fontWeight: 700,
    },
    hoja: {
        padding: 30,
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    contenedorPagare: {
        display: "flex",
        flexDirection: "column",
        gap: 8,
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        padding: 8
    },
    encabezado: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },
    enumerador: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
        alignItems: "center",
        justifyContent: "center",
    },
    cuadroEnumerador: {
        borderWidth: 1,
        borderStyle: "solid",
        borderColor: "black",
        padding: 2
    },
    valorPagare: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
    },
    fecha: {
        display: "flex",
        flexDirection: "row",
        gap: 5,
        justifyContent: "flex-end",
        alignSelf: "stretch",
    },
    cuerpoContenedor: {
        alignSelf: "stretch",
        gap: 2,
        paddingRight: 6,
    },
    cuerpo: {
        fontSize: 8,
        lineHeight: "150%",
        textAlign: "justify",
        flexShrink: 1,
    },
    parteInferior: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",

    },
    datosPersonas: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
    },
    contenedorDatos: {
        display: "flex",
        flexDirection: "column",
        gap: 5,
    },
    contenedorFirma: {
        padding: 5,
        width: "100%",
        minHeight: 34,
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "black,"
    },
    firmas: {
        display: "flex",
        flexDirection: "row",
        alignItems: "flex-end",
        justifyContent: "center",
        width: "50%",
    },
    espacioFirma: {
        display: "flex",
        flexDirection: "column",
        gap: 4,
        alignItems: "center",
        justifyContent: "center",
        width: "50%",
        paddingHorizontal: 6,
    },
    nombreFirma: {
        fontSize: 7,
        textAlign: "center",
        width: "100%",
        lineHeight: "130%",
    },
    nombreFirmaLargo: {
        fontSize: 6.2,
    },
    nombreFirmaMuyLargo: {
        fontSize: 5.4,
    },
});

export default estilos;
