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

export function CreateElement({ Name, Color, Flammable, Caustic, Radioactive, Radioactivity, Light, Temp, MeltingPoint, BoilingPoint, Type, ColdType, HotType }, PositionX, PositionY) {
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
        Particle.dataset.coldType = ColdType;
        Particle.dataset.hotType = HotType;
        Particle.dataset.fixedType = Type;
        Particle.dataset.color = TargetColor;
        Particle.dataset.fixedColor = TargetColor;
        Particle.dataset.flammable = Flammable.toString();
        Particle.dataset.caustic = Caustic.toString();
        Particle.dataset.radioactive = Radioactive.toString();
        Particle.dataset.fixedRadioactive = Radioactive.toString();
        Particle.dataset.radioactivity = Radioactivity ? Radioactivity.toString(): "";
        Particle.dataset.light = Light.toString();
        Particle.dataset.temp = Temp.toString();
        Particle.dataset.meltingPoint = MeltingPoint !== undefined ? MeltingPoint.toString() : "";
        Particle.dataset.boilingPoint = BoilingPoint !== undefined ? BoilingPoint.toString() : "";
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

    static Random(Max, Min) {
        return Math.floor(Math.random() * (Max - Min + 1)) + Min;
    }
}

export class vector2 {
    static LookAt(X, Y) {
        return Math.atan2(X, Y);
    }

    static Distance(X1, Y1, X2, Y2) {
        const dx = X2 - X1;
        const dy = Y2 - Y1;
        return Math.sqrt(dx * dx + dy * dy);
    }

    static Normalize(X, Y) {
        const distance = Math.sqrt(X * X + Y * Y);
        if (distance > 0) {
            return { X: X / distance, Y: Y / distance };
        } else {
            return { X: 0, Y: 0 };
        }
    }

    static Add(X1, Y1, X2, Y2) {
        return { X: X1 + X2, Y: Y1 + Y2 };
    }

    static Subtract(X1, Y1, X2, Y2) {
        return { X: X1 - X2, Y: Y1 - Y2 };
    }

    static Multiply(X, Y, Scalar) {
        return { X: X * Scalar, Y: Y * Scalar };
    }

    static Dot(X1, Y1, X2, Y2) {
        return X1 * X2 + Y1 * Y2;
    }

    static Cross(X1, Y1, X2, Y2) {
        return X1 * Y2 - Y1 * X2;
    }

    static AngleBetween(X1, Y1, X2, Y2) {
        return Math.atan2(Y2 - Y1, X2 - X1);
    }
}