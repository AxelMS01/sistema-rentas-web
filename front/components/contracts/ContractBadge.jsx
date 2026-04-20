import { Badge } from "flowbite-react";
import { useState } from "react";

export default function ContractBadge({ contractStatus }) {
    console.log(contractStatus);
    if (contractStatus === "pending") {
        return (
            <Badge color="warning" size="sm" className="bg-amber-100 text-yellow-600!">
                Pendiente de confirmación
            </Badge>
        );
    } else if (contractStatus === "active") {
        return (
            <Badge color="success" size="sm">
                Activo
            </Badge>
        );
    } else {
        return (
            <Badge color="failure" size="sm">
                Cancelado
            </Badge>
        );
    };
};