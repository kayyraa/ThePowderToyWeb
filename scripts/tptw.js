import { Settings } from "./settings.js";

export function print(x) {
    const LogContainer = document.getElementById("LogContainer");

    if (LogContainer) {
        const Span = document.createElement("span");
        Span.innerHTML = x;
        LogContainer.appendChild(Span);

        setTimeout(() => {
            Span.style.opacity = "0";
            setTimeout(() => {
                Span.remove();
            }, 250);
        }, 2500);
    }
}

export function RGBSG(RgbString) {
    const Match = RgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);

    if (Match) {
        return {
            R: parseInt(Match[1], 10),
            G: parseInt(Match[2], 10),
            B: parseInt(Match[3], 10)
        };
    }

    return null;
}

export function CreateElement({Name, Color, Flammable, Caustic, Radioactive, Light, Temp, Type, Category}, PositionX, PositionY) {
    const ParticleContainer = document.getElementById("ParticleContainer");
    const PowderEffect = document.body.getAttribute("powder")
    const GridSize = parseFloat(document.body.getAttribute("grid-size"));
    
    if (ParticleContainer) {
        const Element = document.createElement("div");
        Element.style.position = "absolute";
        Element.style.left = `${PositionX}px`;
        Element.style.top = `${PositionY}px`;
        Element.style.width = `${GridSize}px`;
        Element.style.height = `${GridSize}px`;
        Element.style.pointerEvents = 'none';
        Element.style.backgroundColor = PowderEffect ? `rgb(${RGBSG(Color).R + Math.floor(Math.random() * (Settings.PowderEffectStrength - (Settings.PowderEffectStrength / 4) + 1) + (Settings.PowderEffectStrength / 4))}, ${RGBSG(Color).G + Math.floor(Math.random() * (Settings.PowderEffectStrength - (Settings.PowderEffectStrength / 4) + 1) + (Settings.PowderEffectStrength / 4))}, ${RGBSG(Color).B + Math.floor(Math.random() * (Settings.PowderEffectStrength - (Settings.PowderEffectStrength / 4) + 1) + (Settings.PowderEffectStrength / 4))})` : Color;
        Element.dataset.type = Type;
        Element.dataset.color = Element.style.backgroundColor;
        Element.dataset.flammable = Flammable;
        Element.dataset.caustic = Caustic;
        Element.dataset.radioactive = Radioactive;
        Element.dataset.light = Light;
        Element.dataset.temp = Temp;
        Element.id = Name;
        ParticleContainer.appendChild(Element);

        return Element;
    }
}