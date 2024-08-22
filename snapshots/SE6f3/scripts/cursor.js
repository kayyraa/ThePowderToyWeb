import * as tptw from "./tptw.js";

let MouseX = 0;
let MouseY = 0;
let IsDragging = false;

document.addEventListener("pointermove", (Event) => {
    MouseX = Event.clientX;
    MouseY = Event.clientY;
});

document.addEventListener("mousedown", (Event) => {
    if (Event.button === 0) {
        IsDragging = true;
        MouseX = Event.clientX;
        MouseY = Event.clientY;
    }
});

document.addEventListener("mouseup", (Event) => {
    if (Event.button === 0) {
        IsDragging = false;
    }
});

document.addEventListener("touchstart", (Event) => {
    if (Event.touches.length === 1) {
        const touch = Event.touches[0];
        IsDragging = true;
        MouseX = touch.clientX;
        MouseY = touch.clientY;
    }
});

document.addEventListener("touchend", () => {
    IsDragging = false;
});

document.addEventListener("touchmove", (Event) => {
    if (Event.touches.length === 1) {
        const touch = Event.touches[0];
        MouseX = touch.clientX;
        MouseY = touch.clientY;
        Event.preventDefault();
    }
}, { passive: false }); 

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
    if (IsDragging && ParticleContainer) {
        let SelectedElement = document.getElementById(document.body.getAttribute("selected"));

        const GridSize = parseInt(document.body.getAttribute("grid-size"));

        if (SelectedElement !== null) {
            const SnappedX = Math.floor((MouseX + (SelectedElement.dataset.type !== "Solid" ? tptw.math.Random(20, -20) : 0)) / GridSize) * GridSize;
            const SnappedY = Math.floor((MouseY + (SelectedElement.dataset.type !== "Solid" ? tptw.math.Random(20, -20) : 0)) / GridSize) * GridSize;
            
            if (!IsPlaceOccupied(SnappedX, SnappedY, GridSize)) {
                const ElementColor = getComputedStyle(SelectedElement).backgroundColor;
                const ElementType = SelectedElement.dataset.type;
                const Flammable = SelectedElement.dataset.flammable;
                const Caustic = SelectedElement.dataset.caustic;
                const Radioactive = SelectedElement.dataset.radioactive;
                const Radioactivity = SelectedElement.dataset.radioactivity;
                const Light = SelectedElement.dataset.light;
    
                const Element = {
                    Name: SelectedElement.id,
                    Color: ElementColor,
                    Flammable: Flammable,
                    Caustic: Caustic,
                    Radioactive: Radioactive,
                    Radioactivity: Radioactivity !== null ? Radioactivity : 0,
                    Light: Light,
                    Temp: SelectedElement.dataset.temp,
                    MeltingPoint: SelectedElement.dataset.meltingPoint,
                    BoilingPoint: SelectedElement.dataset.boilingPoint,
                    Type: ElementType,
                }

                tptw.CreateElement(Element, SnappedX, SnappedY)
            }
        }
    }

    requestAnimationFrame(Loop);
}

Loop();