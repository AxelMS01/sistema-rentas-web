import toast from "react-hot-toast";

function mensajeExito(mensaje) {
    toast.success(mensaje, { duration: 2000 });
};

export default mensajeExito;