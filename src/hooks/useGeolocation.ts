import { useEffect, useState } from "react";

export function useGeolocation(){
    const [coordinates, setCoordinates] = useState<GeolocationCoordinates | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(()=>{
        if(!navigator.geolocation){
            setError("Geolocation is not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (pos) => setCoordinates(pos.coords),
            (err) => setError(err.message),
            {enableHighAccuracy: true}
        );
    }, []);

    return {coordinates, error};
}