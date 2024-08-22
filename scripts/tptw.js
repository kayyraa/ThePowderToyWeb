import { Settings } from "./settings.js";
import { Elements } from "./elements.js";

export const ParticleContainer = document.getElementById("ParticleContainer");

export function Random(Max, Min) {
    return Math.floor(Math.random() * (Max - Min + 1)) + Min;
}

export function Clear() {
    document.body.setAttribute("selected", "none");
    Array.from(ParticleContainer.getElementsByTagName("div")).forEach(Particle => {
        Particle.remove();
    });
}

export function Print(x) {
    const LogContainer = document.getElementById("LogContainer");

    if (LogContainer) {
        const Span = document.createElement("span");
        Span.innerHTML = x;
        LogContainer.appendChild(Span);

        setTimeout(() => {
            Span.style.opacity = "0";
            setTimeout(() => {
                Span.remove();
            }, getComputedStyle(Span).transitionDelay);
        }, 500);
    }
}

export function RgbString(RgbString) {
    const RgbArray = RgbString.match(/\d+/g).map(Number);
    return {
        R: RgbArray[0],
        G: RgbArray[1],
        B: RgbArray[2]
    };
}

export function CombustElement(CausticPart, FlammablePart) {
    CreateElement(Elements.find(element => element.Name === "SMKE"), FlammablePart.offsetLeft, FlammablePart.offsetTop);
    FlammablePart.remove();
    CausticPart.remove();
}

export function CreateElement({Name, Color, Flammable, Caustic, Radioactive, Radioactivity, Light, Temp, MeltingPoint, BoilingPoint, Type}, PositionX, PositionY) {
    const ParticleContainer = document.getElementById("ParticleContainer");
    const PowderStrength = Type !== "Solid" ? Settings.PowderEffectStrength : Settings.PowderEffectStrength / 4;
    const GridSize = parseFloat(document.body.getAttribute("grid-size"));

    if (ParticleContainer) {
        const TargetColor = `rgb(${RgbString(Color).R + Random(PowderStrength, -PowderStrength) / 4}, ${RgbString(Color).G + Random(PowderStrength, -PowderStrength) / 4}, ${RgbString(Color).B + Random(PowderStrength, -PowderStrength) / 4})`;

        const Particle = document.createElement("div");
        Particle.style.position = "absolute";
        Particle.style.left = `${PositionX}px`;
        Particle.style.top = `${PositionY}px`;
        Particle.style.width = `${GridSize}px`;
        Particle.style.height = `${GridSize}px`;
        Particle.style.backgroundColor = TargetColor;

        Particle.style.pointerEvents = `${Type === "None" ? "none" : ""}`;

        Particle.className = Name.toUpperCase();
        Particle.dataset.name = Name;
        Particle.dataset.particle = "true";
        Particle.dataset.type = Type;
        Particle.dataset.fixedType = Type;
        Particle.dataset.color = TargetColor;
        Particle.dataset.Flammable = Flammable;
        Particle.dataset.caustic = Caustic;
        Particle.dataset.radioactive = Radioactive;
        Particle.dataset.fixedRadioactive = Radioactive;
        Particle.dataset.radioactivity = Radioactivity;
        Particle.dataset.light = Light;
        Particle.dataset.temp = Temp;
        Particle.dataset.meltingPoint = MeltingPoint;
        Particle.dataset.boilingPoint = BoilingPoint;
        Particle.id = Name;
        ParticleContainer.appendChild(Particle);

        return Particle;
    }
}

export function GetAllParticles() {
    return Array.from(ParticleContainer.getElementsByTagName("div"));
}

export function GetParticleFromPosition(X, Y) {
    let Element = document.elementFromPoint(X, Y);
    if (Element && Element.classList.contains('particle')) {
        return Element;
    }
    return null;
}

export function GetParticleFromName(Name) {
    const AllParticles = GetAllParticles();
    if (AllParticles.length > 0) {
        return AllParticles.find(Particle => Particle.dataset.name.toUpperCase() === Name.toUpperCase());
    }
}

export function GetElement(Name) {
    return Elements.find(element => element.Name === Name);
}

export function IsPlaceOccupied(X, Y, GridSize) {
    const Particles = Array.from(ParticleContainer.children);
    return Particles.some(Particle => {
        const ParticleRect = Particle.getBoundingClientRect();
        const ParticleX = Math.floor(ParticleRect.left / GridSize) * GridSize;
        const ParticleY = Math.floor(ParticleRect.top / GridSize) * GridSize;
        return ParticleX === X && ParticleY === Y;
    });
}

export class math {
    static Clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static Lerp(a, b, t) {
        return a + (b - a) * t;
    }

    static Map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    static Sign(value) {
        return value < 0? -1 : value > 0? 1 : 0;
    }

    static Rad(degrees) {
        return degrees * Math.PI / 180;
    }
}