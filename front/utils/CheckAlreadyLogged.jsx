import { Navigate } from "react-router-dom";

export default function CheckAlreadyLogged({ children }) {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");

    if (token) {
        if (role === "owner") {
            return <Navigate to="/system/viviendas" replace />;
        } else {
            return <Navigate to="/system/home" replace />
        };
    };

    return children;
};