import useUser from "../stores/user-store";

export default function useLoggedUser() {
    const loggedUserId = useUser((state) => state.loggedUser);

    return loggedUserId;
};