type MoonPhase = {
  name: string;
  emoji: string;
};

const moonphases: MoonPhase[] = [
    {name: "New Moon", emoji: "🌑" },
    { name: "Waxing Crescent", emoji: "🌒" },
    { name: "First Quarter", emoji: "🌓" },
    { name: "Waxing Gibbous", emoji: "🌔" },
    { name: "Full Moon", emoji: "🌕" },
    { name: "Waning Gibbous", emoji: "🌖" },
    { name: "Last Quarter", emoji: "🌗" },
    { name: "Waning Crescent", emoji: "🌘" },
]

export function getMoonPhase(phase: number): MoonPhase {
    const index = Math.round((phase * 8) % 8);
    return moonphases[index];
}