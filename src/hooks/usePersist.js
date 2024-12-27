import { useEffect } from "react";
import { useAuth } from "./useAuth";

export function usePersist() {
    const { persist, setPersist } = useAuth();

    function togglePersist() {
        setPersist((prev) => !prev);
    }

    useEffect(() => {
        localStorage.setItem("persist", persist);
    }, [persist]);

    return {
        persist,
        togglePersist
    };
}