/**
 * Transforma un numero comun en un numero escrito.
 *
 * Ej. 4000 -> "cuatro mil"
 * @param {number|string} numero
 * @returns {string}
 */

function convertirCentenas(numero) {
    const unidades = [
        "",
        "uno",
        "dos",
        "tres",
        "cuatro",
        "cinco",
        "seis",
        "siete",
        "ocho",
        "nueve",
    ];

    const especiales = {
        10: "diez",
        11: "once",
        12: "doce",
        13: "trece",
        14: "catorce",
        15: "quince",
        16: "dieciseis",
        17: "diecisiete",
        18: "dieciocho",
        19: "diecinueve",
        20: "veinte",
        21: "veintiuno",
        22: "veintidos",
        23: "veintitres",
        24: "veinticuatro",
        25: "veinticinco",
        26: "veintiseis",
        27: "veintisiete",
        28: "veintiocho",
        29: "veintinueve",
    };

    const decenas = [
        "",
        "",
        "",
        "treinta",
        "cuarenta",
        "cincuenta",
        "sesenta",
        "setenta",
        "ochenta",
        "noventa",
    ];

    const centenas = [
        "",
        "ciento",
        "doscientos",
        "trescientos",
        "cuatrocientos",
        "quinientos",
        "seiscientos",
        "setecientos",
        "ochocientos",
        "novecientos",
    ];

    if (numero === 0) return "";
    if (numero === 100) return "cien";
    if (numero < 10) return unidades[numero];
    if (especiales[numero]) return especiales[numero];

    if (numero < 100) {
        const decena = Math.floor(numero / 10);
        const unidad = numero % 10;
        return unidad === 0 ? decenas[decena] : `${decenas[decena]} y ${unidades[unidad]}`;
    }

    const centena = Math.floor(numero / 100);
    const resto = numero % 100;
    return resto === 0 ? centenas[centena] : `${centenas[centena]} ${convertirCentenas(resto)}`;
}

function apocoparUno(texto) {
    return texto
        .replace(/(^|\s)veintiuno$/u, "$1veintiun")
        .replace(/ y uno$/u, " y un")
        .replace(/(^|\s)uno$/u, "$1un")
        .trim();
}

function numeroEscrito(numero) {
    const numeroNormalizado = Number.parseInt(numero, 10);

    if (Number.isNaN(numeroNormalizado)) return "";
    if (numeroNormalizado === 0) return "cero";
    if (numeroNormalizado < 0) return "";

    const miles = Math.floor(numeroNormalizado / 1000);
    const resto = numeroNormalizado % 1000;
    const partes = [];

    if (miles > 0) {
        if (miles === 1) {
            partes.push("mil");
        } else {
            partes.push(`${apocoparUno(convertirCentenas(miles))} mil`);
        }
    }

    if (resto > 0) {
        partes.push(convertirCentenas(resto));
    }

    return partes.join(" ").trim();
}

export { numeroEscrito };
