import { Navigate } from "react-router-dom";

export default function CheckAlreadyLogged({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token && role === "owner") {
        return <Navigate to="/viviendas" replace />;
    } else if (token && role === "tenant") {
        return <Navigate to="/home" replace />
    };

    return children;
};