import * as tptw from "./tptw.js";

const ElementContainer = document.getElementById("ElementContainer");
const ParticleContainer = document.getElementById("ParticleContainer");
const Buttons = document.getElementById("Buttons");
const BrowserContainer = document.getElementById("BrowserContainer");

var MouseX = 0;
var MouseY = 0;

var LineStartX = 0;
var LineStartY = 0;
var LineEndX = 0;
var LineEndY = 0;
var IsLining = false;

var IsRemoving = false;
var IsDragging = false;

const LineInfo = document.createElement("div");
LineInfo.innerHTML = "SX: 52, SY: 12, EX: 65, EY: 21";
LineInfo.style.position = "fixed";
LineInfo.style.width = "75px";
LineInfo.style.opacity = "0";
LineInfo.style.transition = "opacity 0.25s ease";
document.body.appendChild(LineInfo);

document.addEventListener("pointermove", (Event) => {
    MouseX = Event.clientX;
    MouseY = Event.clientY;
    LineInfo.style.left = `${MouseX - LineInfo.offsetWidth}px`;
    LineInfo.style.top = `${MouseY - LineInfo.offsetHeight}px`;
});

document.addEventListener("mousedown", (Event) => {
    if (Event.button === 0) {
        if (document.body.getAttribute("selected") === "NONE") {
            IsRemoving = true;
        }

        if (
            Event.target.offsetParent !== ElementContainer
            &&
            Event.target.offsetParent !== Buttons
            &&
            Event.target !== Buttons
            &&
            Event.target !== BrowserContainer
            &&
            Event.target.offsetParent !== BrowserContainer
        ) {
            IsDragging = true;
        }

        if (Event.shiftKey) {
            LineStartX = Event.clientX;
            LineStartY = Event.clientY;
            IsLining = true;
        }

        MouseX = Event.clientX;
        MouseY = Event.clientY;
    } else if (Event.button === 2) {
        IsRemoving = true;
    }
});

document.addEventListener("mouseup", (Event) => {
    if (Event.button === 0) {
        IsDragging = false;

        if (IsLining) {
            LineEndX = Event.clientX;
            LineEndY = Event.clientY;

            const Element = tptw.GetElement(document.body.getAttribute("selected").toUpperCase());
            Element ? tptw.DrawLineParticle(Element, LineStartX, LineStartY, LineEndX, LineEndY) : "";
            tptw.ClearLinePlaceholder();
            
            IsLining = false;
        }
    } else if (Event.button === 2) {
        if (document.body.getAttribute("selected") !== "NONE") {
            IsRemoving = false;
        }
    }
});

document.addEventListener("touchstart", (Event) => {
    if (Event.touches.length === 1) {
        const Touch = Event.touches[0];
        IsDragging = true;
        MouseX = Touch.clientX;
        MouseY = Touch.clientY;
    }
});

document.addEventListener("touchend", () => {
    IsDragging = false;
});

document.addEventListener("touchmove", (Event) => {
    if (Event.touches.length === 1) {
        const Touch = Event.touches[0];
        MouseX = Touch.clientX;
        MouseY = Touch.clientY;
        Event.preventDefault();
    }
}, { passive: false });

document.addEventListener('wheel', function (Event) {
    if (Event.ctrlKey) {
        Event.preventDefault();
    }
}, { passive: false });

function IsPlaceOccupied(X, Y, GridSize) {
    const Particles = Array.from(ParticleContainer.children);
    return Particles.some(Particle => {
        const ParticleRect = Particle.getBoundingClientRect();
        const ParticleX = Math.floor(ParticleRect.left / GridSize) * GridSize;
        const ParticleY = Math.floor(ParticleRect.top / GridSize) * GridSize;
        return ParticleX === X && ParticleY === Y;
    });
}

function Loop() {
    if (IsLining) {
        const GridSize = parseInt(document.body.getAttribute("grid-size"));

        LineInfo.style.opacity = "1";
        LineInfo.innerHTML = `X1: ${Math.floor(LineStartX / GridSize) * GridSize} Y1: ${Math.floor(LineStartY / GridSize) * GridSize} X2: ${parseInt(Math.floor(MouseX / GridSize) * GridSize)} Y2: ${parseInt(Math.floor(MouseY / GridSize) * GridSize)}`;
    } else {
        LineInfo.style.opacity = "0";
    }

    if (IsRemoving) {
        const Particle = tptw.GetParticleFromPosition(MouseX, MouseY);
        Particle ? Particle.remove() : "";
    }

    if (IsDragging && !IsLining && ParticleContainer) {
        const GridSize = parseInt(document.body.getAttribute("grid-size"));

        const SelectedElementId = document.body.getAttribute("selected");
        const SelectedElement = document.getElementById(SelectedElementId);

        if (SelectedElement !== null) {
            const SnappedX = Math.floor((MouseX + (SelectedElement.dataset.type !== "Solid" ? tptw.math.Random(20, -20) : 0)) / GridSize) * GridSize;
            const SnappedY = Math.floor((MouseY + (SelectedElement.dataset.type !== "Solid" ? tptw.math.Random(20, -20) : 0)) / GridSize) * GridSize;

            if (!IsPlaceOccupied(SnappedX, SnappedY, GridSize)) {
                const ElementColor = getComputedStyle(SelectedElement).backgroundColor;
                const ElementType = SelectedElement.dataset.type;
                const Flammable = SelectedElement.dataset.flammable === "true";
                const Caustic = SelectedElement.dataset.caustic === "true";
                const Radioactive = SelectedElement.dataset.radioactive === "true";
                const Radioactivity = SelectedElement.dataset.radioactivity ? parseFloat(SelectedElement.dataset.radioactivity) : 0;
                const DecayParticle = Radioactive ? SelectedElement.dataset.decayParticle : "";
                const Light = SelectedElement.dataset.light === "true";
                const Temp = parseFloat(SelectedElement.dataset.temp) || 0;
                const MeltingPoint = parseFloat(SelectedElement.dataset.meltingPoint) || undefined;
                const BoilingPoint = parseFloat(SelectedElement.dataset.boilingPoint) || undefined;

                const Element = {
                    Name: SelectedElement.id,
                    Color: ElementColor,
                    Flammable: Flammable,
                    Caustic: Caustic,

                    RadioactiveSettings: {
                        Radioactive: Radioactive,
                        Radioactivity: Radioactivity,
                        DecayParticle: DecayParticle,
                    },
                    
                    Light: Light,
                    Temp: Temp,
                    MeltingPoint: MeltingPoint,
                    BoilingPoint: BoilingPoint,
                    Type: ElementType,
                    ColdType: SelectedElement.dataset.coldType,
                    HotType: SelectedElement.dataset.hotType
                }

                tptw.CreateParticle(Element, SnappedX, SnappedY);
            }
        }
    } else if (IsLining) {
        tptw.DrawLinePlaceholder(LineStartX, LineStartY, MouseX, MouseY);
    }

    setTimeout(Loop, 1)
}

Loop();