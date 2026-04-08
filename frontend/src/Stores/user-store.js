import { create } from "zustand";

/**
 * Tienda de Zustand para manejar el estado global del ID del usuario logueado.
 * 
 * Esto nos permitirá realizar las consultas necesarias a la base de datos en base al usuario que inició sesión.
 */

const useUser = create((set) => ({
    loggedUser: 0,
    updateLoggedUser: (newId) => set({ loggedUser: newId })
}));

export default useUser;