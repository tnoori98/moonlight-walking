import SunCalc from "suncalc";

export function getMoonInfo(lat: number, lng: number, date = new Date()) {
    const moon = SunCalc.getMoonIllumination(date);
    const moonPosition = SunCalc.getMoonPosition(date, lat, lng);
    const moonTimes = SunCalc.getMoonTimes(date, lat, lng);
    const sunTimes = SunCalc.getTimes(date, lat, lng);
    const sunset = sunTimes.sunset;
    const nightStart = new Date(sunset.getTime() + 30 * 60000);

    return {
        phase: moon.phase,
        azimuth: moonPosition.azimuth * (180/Math.PI), //convert rad to deg
        altitude: moonPosition.altitude * (180/Math.PI),
        moonrise: moonTimes.rise,
        moonset: moonTimes.set,
        visibilityStart: nightStart
    };
}