import { useEffect, useState } from "react";
import { GoogleMap, useLoadScript, DirectionsRenderer } from "@react-google-maps/api";

interface MapProps {
    lat: number;
    lng: number;
    azimuth: number;
}

function offsetLocation(lat: number, lng: number, distanceInKm: number, azimuthDeg: number){
  const radius = 6371; // Earth radius in km
  const bearing = (azimuthDeg * Math.PI) / 180;
  const distanceRatio = distanceInKm / radius;

  const lat1 = (lat * Math.PI) / 180;
  const lng1 = (lng * Math.PI) / 180;

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(distanceRatio) +
    Math.cos(lat1) * Math.sin(distanceRatio) * Math.cos(bearing)
  );

  const lng2 = lng1 + Math.atan2(
    Math.sin(bearing) * Math.sin(distanceRatio) * Math.cos(lat1),
    Math.cos(distanceRatio) - Math.sin(lat1) * Math.sin(lat2)
  );

  return {
    lat: (lat2 * 180) / Math.PI,
    lng: (lng2 * 180) / Math.PI
  };
}

export function MapComponent({lat, lng, azimuth}: MapProps){
    const {isLoaded} = useLoadScript({
        googleMapsApiKey: import.meta.env.VITE_API_KEY ?? ""
    });

    const [routes, setRoutes] = useState<google.maps.DirectionsResult>();

    useEffect(()=>{
        if(!isLoaded) return;

        const directionService = new google.maps.DirectionsService();
        const azimuthInDegrees = (azimuth * 180) / Math.PI;
        const destination = offsetLocation(lat, lng, 3, azimuthInDegrees);

        directionService.route(
            {
                origin: {lat, lng},
                destination,
                travelMode: google.maps.TravelMode.WALKING
            },
            (result, status) => {
                if(status === "OK" && result) setRoutes(result);
            }
        );
    }, [isLoaded, lat, lng])

    if(!isLoaded) return <p>Calculating Route...</p>

    return (
        <GoogleMap center={{lat, lng}} zoom={16} mapContainerStyle={{width: "100%", height: "400px"}}>
            {routes && <DirectionsRenderer directions={routes}/>}
        </GoogleMap>
    )
}