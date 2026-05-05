import useUser from "../stores/user-store";

/**
 * Directly retrieves the logged user's id from the Zustand user store, ready to use as a hook.
 * @returns The logged user's retrieved id from the Zustand user store.
 */

export default function useLoggedUser() {
    const loggedUserId = useUser((state) => state.loggedUser);

    return loggedUserId;
};