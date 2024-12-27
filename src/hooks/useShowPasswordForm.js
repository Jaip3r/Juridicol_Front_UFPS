import { useState } from "react";

export function useShowPasswordForm() {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show); 

    return {
        show,
        handleClick
    };
}