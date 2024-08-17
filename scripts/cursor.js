import { Settings } from "./settings.js";

const Cursor = document.createElement("div");
Cursor.style.position = "fixed";
Cursor.style.border = "2px solid #fff";
Cursor.style.borderRadius = "100%";
Cursor.style.aspectRatio = "1 / 1";
Cursor.style.transition = "width 0.0625s";
Cursor.style.pointerEvents = "none";
Cursor.draggable = false;
document.body.appendChild(Cursor);

let MouseX = 0;
let MouseY = 0;
let IsDragging = false;

function updateCursorPosition(x, y) {
    MouseX = x;
    MouseY = y;
}

function handleDragStart(x, y) {
    IsDragging = true;
    updateCursorPosition(x, y);
}

function handleDragEnd() {
    IsDragging = false;
}

document.addEventListener("pointermove", (Event) => {
    updateCursorPosition(Event.clientX, Event.clientY);
});

document.addEventListener("mousedown", (Event) => {
    if (Event.button === 0) {
        handleDragStart(Event.clientX, Event.clientY);
    }
});

document.addEventListener("mouseup", (Event) => {
    if (Event.button === 0) {
        handleDragEnd();
    }
});

document.addEventListener("touchstart", (Event) => {
    if (Event.touches.length === 1) {
        const touch = Event.touches[0];
        handleDragStart(touch.clientX, touch.clientY);
    }
});

document.addEventListener("touchend", () => {
    handleDragEnd();
});

document.addEventListener("touchmove", (Event) => {
    if (Event.touches.length === 1) {
        const touch = Event.touches[0];
        updateCursorPosition(touch.clientX, touch.clientY);
        Event.preventDefault();
    }
}, { passive: false });

function Loop() {
    Cursor.style.top = `${MouseY - (Cursor.offsetHeight / 2)}px`;
    Cursor.style.left = `${MouseX - (Cursor.offsetWidth / 2)}px`;
    Cursor.style.width = `${parseInt(document.body.getAttribute("cursor-size"))}px`;

    if (IsDragging && ParticleContainer) {
        const GridSize = parseInt(document.body.getAttribute("grid-size"));

        const SnappedX = Math.floor(MouseX / GridSize) * GridSize;
        const SnappedY = Math.floor(MouseY / GridSize) * GridSize;

        let SelectedElement = document.getElementById(document.body.getAttribute("selected"));
        if (SelectedElement !== null) {
            const ElementColor = SelectedElement.style.backgroundColor;
            const ElementType = SelectedElement.dataset.type;
            const Flammable = SelectedElement.dataset.flammable;
            const Caustic = SelectedElement.dataset.caustic;

            if (ParticleContainer.children.length < Settings.MaxParticleCount && SelectedElement.id.toUpperCase() !== "NONE") {
                const Element = document.createElement("div");
                Element.style.position = "absolute";
                Element.style.left = `${SnappedX}px`;
                Element.style.top = `${SnappedY}px`;
                Element.style.width = `${GridSize}px`;
                Element.style.height = `${GridSize}px`;
                Element.style.pointerEvents = 'none';
                Element.style.backgroundColor = ElementColor;
                Element.dataset.type = ElementType;
                Element.dataset.color = ElementColor;
                Element.dataset.flammable = Flammable;
                Element.dataset.caustic = Caustic;
                Element.dataset.temp = 22;
                Element.id = SelectedElement.id;
                ParticleContainer.appendChild(Element);
            }
        }
    }

    requestAnimationFrame(Loop);
}

Loop();