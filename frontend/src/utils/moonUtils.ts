import SunCalc from "suncalc";

type MoonInfo = {
  phase: number;
  azimuth: number;
  altitude: number;
  moonrise: Date | null;
  moonset: Date | null;
  visibilityStart: Date | null;
  alwaysUp: boolean;
  alwaysDown: boolean;
};

const toDeg = (rad: number) => rad * (180 / Math.PI);

function startOfLocalDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function endOfLocalDay(d: Date) {
  const e = startOfLocalDay(d);
  e.setDate(e.getDate() + 1);
  return e;
}

function findMoonriseBetween(tStart: Date, tEnd: Date, lat: number, lng: number, stepMinutes = 5): Date | null {
  let tPrev = new Date(tStart);
  let altPrev = SunCalc.getMoonPosition(tPrev, lat, lng).altitude;

  const t = new Date(tStart);
  while (t <= tEnd) {
    const alt = SunCalc.getMoonPosition(t, lat, lng).altitude;

    if (altPrev <= 0 && alt > 0) {
      const frac = alt / (alt - altPrev);
      const dt = +t - +tPrev;
      return new Date(+t - Math.round(frac * dt));
    }

    tPrev = new Date(t);
    altPrev = alt;
    t.setMinutes(t.getMinutes() + stepMinutes);
  }
  return null;
}

function findNextMoonrise(after: Date, lat: number, lng: number, maxHours = 72, stepMinutes = 5): Date | null {
  const tEnd = new Date(+after + maxHours * 3600_000);
  return findMoonriseBetween(after, tEnd, lat, lng, stepMinutes);
}

export function getMoonInfo(lat: number, lng: number, date = new Date()): MoonInfo {
  const moon = SunCalc.getMoonIllumination(date);
  const pos  = SunCalc.getMoonPosition(date, lat, lng);

  const dayStart = startOfLocalDay(date);
  const dayEnd   = endOfLocalDay(date);

  const moonTimes = SunCalc.getMoonTimes(dayStart, lat, lng);
  const sunTimes  = SunCalc.getTimes(dayStart, lat, lng);

  let moonrise: Date | null = moonTimes.rise ?? null;
  let moonset:  Date | null = moonTimes.set  ?? null;

  if (moonrise && !(moonrise >= dayStart && moonrise < dayEnd)) moonrise = null;
  if (moonset  && !(moonset  >= dayStart && moonset  < dayEnd)) moonset  = null;

  const alwaysUp = !!moonTimes.alwaysUp;
  const alwaysDown = !!moonTimes.alwaysDown;

  if (!moonrise && !alwaysUp && !alwaysDown) {
    moonrise = findMoonriseBetween(dayStart, dayEnd, lat, lng, 2)
            ?? findNextMoonrise(dayEnd, lat, lng, 72, 5);
  }

  const visibilityStart = sunTimes.sunset
    ? new Date(sunTimes.sunset.getTime() + 30 * 60 * 1000)
    : null;

  return {
    phase: moon.phase,
    azimuth: toDeg(pos.azimuth),
    altitude: toDeg(pos.altitude),
    moonrise,
    moonset,
    visibilityStart,
    alwaysUp,
    alwaysDown,
  };
}