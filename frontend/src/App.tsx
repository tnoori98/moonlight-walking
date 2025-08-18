import './App.css'
import { MapComponent } from './components/Map';
import { getMoonPhase } from './helpers/moonPhase';
import { useGeolocation } from './hooks/useGeolocation'
import { getMoonInfo } from './utils/moonUtils';
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

function App() {
  const  {coordinates, error} = useGeolocation();

  if(error) return <p className="text-amber-200">Error: {error}</p>
  if(!coordinates) return <p className="text-amber-200">Locating...</p>

  const moon = getMoonInfo(coordinates!.latitude, coordinates!.longitude);
  const moonphase = getMoonPhase(moon.phase);

  const walkStart = new Date(moon.visibilityStart!.getTime() + 10 * 60000);
  const walkEnd = new Date(walkStart.getTime() + 40 * 60000);

  return (
    <div>
      <Card className="w-full max-w-7xl mx-auto mt-6 bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 shadow-[0_0_30px_rgba(255,193,7,0.1)]">
        <CardHeader>
          <CardTitle className="text-amber-200 text-3xl font-semibold tracking-tight">Moonlight Walking Info</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-amber-100">
          <p>Current Moon Phase: {moon.phase.toFixed(2)}</p>
            <p>Moon Azimuth: {moon.azimuth.toFixed(2)}°</p>
            <p>Moon Altitude: {moon.altitude.toFixed(2)}°</p>
            <p>Moon Rise: {moon.moonrise!.toLocaleTimeString() ?? "-"}</p>
            <p>Moon Set: {moon.moonset!.toLocaleTimeString() ?? "-"}</p>
            <p>Moon Phase: {moonphase.emoji} {moonphase.name}</p>
            {moon.azimuth <= 0 ? <p>The moon is currently not visible</p> : <p>Enjoy your walk in the moon light</p>}
            <p>Recommended Time to walk: {walkStart.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {walkEnd.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </CardContent>
      </Card>
      <MapComponent lat={coordinates.latitude} lng = {coordinates.longitude} azimuth={moon.azimuth} />
    </div>
  )
}

export default App
