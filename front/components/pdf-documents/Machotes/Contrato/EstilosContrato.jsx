import { StyleSheet } from "@react-pdf/renderer";

const estilos = StyleSheet.create({
    hoja: {
        padding: 50,
        gap: 10,
    },
    seccion: {
        gap: 10,
    },
    texto: {
        fontSize: 12,
        lineHeight: "150%",
        textAlign: "justify",
    },
    textoBold: {
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "150%",
    },
    textoMayus: {
        fontSize: 12,
        textTransform: "uppercase",
        lineHeight: "150%",
    },
    textoSeparado: {
        fontSize: 12,
        fontWeight: 600,
        lineHeight: "150%",
        textTransform: "uppercase",
        textAlign: "center"
    },
    boldItalic: {
        fontSize: 12,
        fontWeight: "600",
        fontStyle: "italic",
        lineHeight: "150%",
    },
    centrado: {
        fontSize: 12,
        textAlign: "center",
        fontWeight: 600,
        lineHeight: "150%",
    },
    tituloSeccion: {
        fontSize: 12,
        textAlign: "center",
        fontWeight: 600,
        lineHeight: "150%",
        textAlign: "center",
    },
    viñetaLetra: {
        textIndent: 20,
        fontSize: 12,
        flexDirection: "row",
        gap: 2,
        lineHeight: "150%",
        textAlign: "justify",
    },
    textoSangria: {
        fontSize: 12,
        textIndent: 20,
        lineHeight: "150&",
        textAlign: "justify",
    },
    textoSubrayado: {
        fontSize: 12,
        lineHeight: "150%",
        textAlign: "justify",
        textDecoration: "underline"
    },
    bloqueDomicilio: {
        flexDirection: "column",
        gap: 15,
        maxWidth: "50%",
    },
    domicilios: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "flex-start"
    },
    dosFirmas: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "between",
        alignItems: "center",
        gap: 30,
        marginTop: 20,
    },
    espacioFirma: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
    firmaInferior: {
        display: "flex",
        flexDirection: "column",
        gap: 10,
        width: "55%",
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "center",
        marginTop: 24,
    },
    contenedorFirmaImg: {
        padding: 5,
        width: "100%",
        borderBottomWidth: 1,
        borderBottomStyle: "solid",
        borderBottomColor: "black,"
    },
});

export default estilos;
