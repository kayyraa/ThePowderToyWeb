import { Settings } from "./settings.js";

const Cursor = document.createElement("div");
Cursor.style.position = "fixed";
Cursor.style.border = "2px solid #fff";
Cursor.style.width = "4px";
Cursor.style.borderRadius = "100%";
Cursor.style.aspectRatio = "1 / 1";
Cursor.style.transition = "left 125ms, top 125ms, opacity 250ms";
Cursor.style.pointerEvents = "none";
Cursor.draggable = false;
Cursor.id = "Cursor";
document.body.appendChild(Cursor);

let MouseX = 0;
let MouseY = 0;
let IsDragging = false;

function UpdateCursorPosition(x, y) {
    MouseX = x;
    MouseY = y;
}

function HandleDragStart(x, y) {
    IsDragging = true;
    UpdateCursorPosition(x, y);
}

function HandleDragEnd() {
    IsDragging = false;
}

document.addEventListener("pointermove", (Event) => {
    UpdateCursorPosition(Event.clientX, Event.clientY);
});

document.addEventListener("mousedown", (Event) => {
    if (Event.button === 0) {
        HandleDragStart(Event.clientX, Event.clientY);
    }
});

document.addEventListener("mouseup", (Event) => {
    if (Event.button === 0) {
        HandleDragEnd();
    }
});

document.addEventListener("touchstart", (Event) => {
    if (Event.touches.length === 1) {
        const touch = Event.touches[0];
        HandleDragStart(touch.clientX, touch.clientY);
    }
});

document.addEventListener("touchend", () => {
    HandleDragEnd();
});

document.addEventListener("touchmove", (Event) => {
    if (Event.touches.length === 1) {
        const touch = Event.touches[0];
        UpdateCursorPosition(touch.clientX, touch.clientY);
        Event.preventDefault();
    }
}, { passive: false });

function RGBSG(RgbString) {
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

function IsPlaceOccupied(x, y, gridSize) {
    const Particles = Array.from(ParticleContainer.children);
    return Particles.some(Particle => {
        const ParticleRect = Particle.getBoundingClientRect();
        const ParticleX = Math.floor(ParticleRect.left / gridSize) * gridSize;
        const ParticleY = Math.floor(ParticleRect.top / gridSize) * gridSize;
        return ParticleX === x && ParticleY === y;
    });
}

function Loop() {
    Cursor.style.top = `${MouseY - (Cursor.offsetHeight / 2)}px`;
    Cursor.style.left = `${MouseX - (Cursor.offsetWidth / 2)}px`;
    Cursor.style.width = `${parseInt(document.body.getAttribute("cursor-size"))}px`;

    if (IsDragging && ParticleContainer) {
        const GridSize = parseInt(document.body.getAttribute("grid-size"));

        const SnappedX = Math.floor(Cursor.offsetLeft / GridSize) * GridSize;
        const SnappedY = Math.floor(Cursor.offsetTop / GridSize) * GridSize;
        const PowderEffect = document.body.getAttribute("powder");

        let SelectedElement = document.getElementById(document.body.getAttribute("selected"));
        if (SelectedElement !== null && !IsPlaceOccupied(SnappedX, SnappedY, GridSize)) {
            const ElementColor = SelectedElement.style.backgroundColor;
            const ElementType = SelectedElement.dataset.type;
            const Flammable = SelectedElement.dataset.flammable;
            const Caustic = SelectedElement.dataset.caustic;
            const Radioactive = SelectedElement.dataset.radioactive;
            const Light = SelectedElement.dataset.light;

            if (ParticleContainer.children.length < Settings.MaxParticleCount && SelectedElement.id.toUpperCase() !== "NONE") {
                const Element = document.createElement("div");
                Element.style.position = "absolute";
                Element.style.left = `${SnappedX}px`;
                Element.style.top = `${SnappedY}px`;
                Element.style.width = `${GridSize}px`;
                Element.style.height = `${GridSize}px`;
                Element.style.pointerEvents = 'none';
                Element.style.backgroundColor = PowderEffect ? `rgb(${RGBSG(ElementColor).R + Math.floor(Math.random() * (Settings.PowderEffectStrength - (Settings.PowderEffectStrength / 4) + 1) + (Settings.PowderEffectStrength / 4))}, ${RGBSG(ElementColor).G + Math.floor(Math.random() * (Settings.PowderEffectStrength - (Settings.PowderEffectStrength / 4) + 1) + (Settings.PowderEffectStrength / 4))}, ${RGBSG(ElementColor).B + Math.floor(Math.random() * (Settings.PowderEffectStrength - (Settings.PowderEffectStrength / 4) + 1) + (Settings.PowderEffectStrength / 4))})` : ElementColor;
                Element.dataset.type = ElementType;
                Element.dataset.color = Element.style.backgroundColor;
                Element.dataset.flammable = Flammable;
                Element.dataset.caustic = Caustic;
                Element.dataset.radioactive = Radioactive;
                Element.dataset.light = Light;
                Element.dataset.temp = 22;
                Element.id = SelectedElement.id;
                ParticleContainer.appendChild(Element);
            }
        }
    }

    requestAnimationFrame(Loop);
}

Loop();