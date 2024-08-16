const Cursor = document.createElement("div");
Cursor.style.position = "fixed";
Cursor.style.border = "2px solid #fff";
Cursor.style.borderRadius = "100%";
Cursor.style.width = "64px";
Cursor.style.aspectRatio = "1 / 1";
Cursor.style.transition = "width 0.0625s";
Cursor.style.pointerEvents = "none";
Cursor.draggable = false;
document.body.appendChild(Cursor);

const Clamp = (Val, Min, Max) => Math.min(Math.max(Val, Min), Max);

let MouseX = 0;
let MouseY = 0;
let IsDragging = false;

document.addEventListener("pointermove", (Event) => {
    MouseX = Event.clientX;
    MouseY = Event.clientY;

    if (IsDragging && ParticleContainer) {
        const GridSize = parseInt(document.body.getAttribute("grid-size"));
        const CursorSize = parseInt(document.body.getAttribute("cursor-size"));
        const Radius = CursorSize / 2;

        const SnappedX = Math.floor(MouseX / GridSize) * GridSize;
        const SnappedY = Math.floor(MouseY / GridSize) * GridSize;

        let SelectedElement = document.getElementById(document.body.getAttribute("selected"));
        if (SelectedElement !== null) {
            let ElementColor = SelectedElement.style.backgroundColor;
            let ElementType = SelectedElement.dataset.type;

            if (CursorSize > 1) {
                for (let x = -Radius; x < Radius; x += GridSize) {
                    for (let y = -Radius; y < Radius; y += GridSize) {
                        if (Math.sqrt(x * x + y * y) <= Radius) {
                            const Element = document.createElement("div");
                            Element.style.position = "absolute";
                            Element.style.left = `${SnappedX + x}px`;
                            Element.style.top = `${SnappedY + y}px`;
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
                }
            } else {
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
                Element.style.zIndex = -9999;
                Element.id = document.body.getAttribute("selected");
                ParticleContainer.appendChild(Element);
            }
        }
    }
});

document.addEventListener("wheel", (Event) => {
    let CurrentCursorSize = parseInt(document.body.getAttribute("cursor-size"));
    let NewCursorSize = Math.floor(Clamp(CurrentCursorSize - (Event.deltaY / 2), 1, 512));

    document.body.setAttribute("cursor-size", NewCursorSize.toString());
});

document.addEventListener("mousedown", () => {
    IsDragging = true;
});

document.addEventListener("mouseup", () => {
    IsDragging = false;
});

function Loop() {
    Cursor.style.top = `${MouseY - (Cursor.offsetHeight / 2)}px`;
    Cursor.style.left = `${MouseX - (Cursor.offsetWidth / 2)}px`;
    Cursor.style.width = `${parseInt(document.body.getAttribute("cursor-size"))}px`;

    requestAnimationFrame(Loop);
}

Loop();