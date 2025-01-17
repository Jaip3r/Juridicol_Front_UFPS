
import { useQuery } from "@tanstack/react-query";
import { useAxiosPrivate } from "../useAxiosPrivate";
import { getProfile } from "../../services/userService";

export function useProfileQuery() {

    const axiosPrivate = useAxiosPrivate(); // Instancia de axios con autenticación.

    return useQuery({
        queryKey: ['profile'],
        queryFn: getProfile(axiosPrivate),
    })

}