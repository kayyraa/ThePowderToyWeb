const Cursor = document.createElement("div");
Cursor.style.position = "fixed";
Cursor.style.border = "2px solid #fff";
Cursor.style.borderRadius = "100%";
Cursor.style.aspectRatio = "1 / 1";
Cursor.style.transition = "width 0.0625s";
Cursor.style.pointerEvents = "none";
Cursor.draggable = false;
document.body.appendChild(Cursor);

const Clamp = (Val, Min, Max) => Math.min(Math.max(Val, Min), Max);

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

document.addEventListener("wheel", (Event) => {
    if (Event.ctrlKey) {
        Event.preventDefault();
        const CurrentGameSpeed = parseInt(document.body.getAttribute("speed"));
        const NewGameSpeed = Clamp(CurrentGameSpeed + Math.sign(-Event.deltaY), -8, 8);
        document.body.setAttribute("speed", NewGameSpeed);
    }
}, { passive: false });

document.addEventListener("contextmenu", (Event) => {
    Event.preventDefault();
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
            let ElementColor = SelectedElement.style.backgroundColor;
            let ElementType = SelectedElement.dataset.type;

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
            Element.dataset.flammable = SelectedElement.dataset.flammable;
            Element.dataset.caustic = SelectedElement.dataset.caustic;
            Element.dataset.temp = 22;
            Element.id = document.body.getAttribute("selected");
            ParticleContainer.appendChild(Element);
        }
    }

    requestAnimationFrame(Loop);
}

Loop();