import * as tptw from "./tptw.js";

const ElementContainer = document.getElementById("ElementContainer");
const ParticleContainer = document.getElementById("ParticleContainer");

var MouseX = 0;
var MouseY = 0;

var LineStartX = 0;
var LineStartY = 0;
var LineEndX = 0;
var LineEndY = 0;
var IsLining = false;

var IsDragging = false;

document.addEventListener("pointermove", (Event) => {
    MouseX = Event.clientX;
    MouseY = Event.clientY;
});

document.addEventListener("mousedown", (Event) => {
    if (Event.button === 0) {
        if (Event.target.offsetParent !== ElementContainer) {
            IsDragging = true;
        }

        if (Event.shiftKey) {
            LineStartX = Event.clientX;
            LineStartY = Event.clientY;
            IsLining = true;
        }

        MouseX = Event.clientX;
        MouseY = Event.clientY;
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
    if (IsDragging && !IsLining && ParticleContainer) {
        const SelectedElementId = document.body.getAttribute("selected");
        const SelectedElement = document.getElementById(SelectedElementId);

        const GridSize = parseInt(document.body.getAttribute("grid-size"));

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
                const Light = SelectedElement.dataset.light === "true";
                const Temp = parseFloat(SelectedElement.dataset.temp) || 0;
                const MeltingPoint = parseFloat(SelectedElement.dataset.meltingPoint) || undefined;
                const BoilingPoint = parseFloat(SelectedElement.dataset.boilingPoint) || undefined;

                const Element = {
                    Name: SelectedElement.id,
                    Color: ElementColor,
                    Flammable: Flammable,
                    Caustic: Caustic,
                    Radioactive: Radioactive,
                    Radioactivity: Radioactivity,
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

    requestAnimationFrame(Loop);
}

Loop();