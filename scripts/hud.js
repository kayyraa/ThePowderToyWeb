import { Elements } from "./elements.js";

const ParticleContainer = document.getElementById("ParticleContainer");

const Cursor = document.createElement("div");
Cursor.style.position = "fixed";
Cursor.style.border = "2px solid #fff";
Cursor.style.borderRadius = "100%";
Cursor.style.aspectRatio = "1 / 1";
Cursor.style.transition = "width 0.0625s";
Cursor.style.pointerEvents = "none";
Cursor.draggable = false;
document.body.appendChild(Cursor);

const ActionLabel = document.createElement("span");
ActionLabel.innerHTML = "Default Display";
ActionLabel.style.fontSize = "24px";
ActionLabel.style.color = "rgb(172, 172, 172)";
ActionLabel.style.transition = "opacity 0.25s ease";
ActionLabel.style.opacity = 1;
ActionLabel.style.userSelect = "none";
ActionLabel.draggable = false;
ActionLabel.id = "ActionLabel";
document.body.appendChild(ActionLabel);

const StatsContainer = document.createElement("div");
StatsContainer.style.display = "flex";
StatsContainer.style.flexDirection = "column";
StatsContainer.style.width = IsMobile() ? "100px" : "210px";
StatsContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
StatsContainer.style.zIndex = 9999;
document.body.appendChild(StatsContainer);

const ClearButton = document.createElement("span");
ClearButton.innerHTML = "CLEAR";
ClearButton.style.color = "rgb(23, 161, 191)";
ClearButton.style.fontSize = "100%";
ClearButton.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
ClearButton.style.padding = "10px";
ClearButton.style.cursor = "pointer";
ClearButton.style.textAlign = "center";
ClearButton.style.userSelect = "none";
StatsContainer.appendChild(ClearButton);

const FpsLabel = document.createElement("span");
FpsLabel.innerHTML = "FPS: ~";
FpsLabel.style.color = "rgb(23, 161, 191)";
FpsLabel.style.fontSize = "100%";
FpsLabel.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
FpsLabel.style.padding = "10px";
FpsLabel.style.textAlign = "center";
FpsLabel.style.userSelect = "none";
StatsContainer.appendChild(FpsLabel);

const ParticlesLabel = document.createElement("span");
ParticlesLabel.innerHTML = "Parts: ~";
ParticlesLabel.style.color = "rgb(23, 161, 191)";
ParticlesLabel.style.fontSize = "100%";
ParticlesLabel.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
ParticlesLabel.style.padding = "10px";
ParticlesLabel.style.textAlign = "center";
ParticlesLabel.style.userSelect = "none";
StatsContainer.appendChild(ParticlesLabel);

const GameSpeedLabel = document.createElement("span");
GameSpeedLabel.innerHTML = "SPD: 1";
GameSpeedLabel.style.color = "rgb(23, 161, 191)";
GameSpeedLabel.style.fontSize = "100%";
GameSpeedLabel.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
GameSpeedLabel.style.padding = "10px";
GameSpeedLabel.style.textAlign = "center";
GameSpeedLabel.style.userSelect = "none";
StatsContainer.appendChild(GameSpeedLabel);

const ElementContainer = document.createElement("div");
ElementContainer.style.position = "fixed";
ElementContainer.style.right = "20px";
ElementContainer.style.top = "50px";
ElementContainer.style.width = "50px";
ElementContainer.style.height = "600px";
ElementContainer.style.textAlign = "center";
ElementContainer.style.userSelect = "none";
ElementContainer.style.justifyContent = "center";
ElementContainer.style.alignContent = "center";
ElementContainer.style.alignItems = "center";
ElementContainer.style.zIndex = 9999;
document.body.appendChild(ElementContainer);

const ElementLabel = document.createElement("span");
ElementLabel.innerHTML = "NONE";
ElementLabel.style.position = "fixed";
ElementLabel.style.color = "rgb(172, 172, 172)";
ElementLabel.style.width = "200px";
ElementLabel.style.height = "50px";
ElementLabel.style.bottom = "10px";
ElementLabel.style.left = "10px";
ElementLabel.style.fontSize = "24px";
ElementLabel.style.paddingLeft = "10px";
ElementLabel.style.paddingRight = "10px";
ElementLabel.style.textAlign = "center";
ElementLabel.style.userSelect = "none";
ElementLabel.style.pointerEvents = "none";
ElementContainer.appendChild(ElementLabel);

function IsMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|windows phone|opera mini/i.test(userAgent);
}

if (IsMobile()) {
    const GameSpeedUpButton = document.createElement("span");
    GameSpeedUpButton.innerHTML = "+";
    GameSpeedUpButton.style.color = "rgb(23, 161, 191)";
    GameSpeedUpButton.style.fontSize = "100%";
    GameSpeedUpButton.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
    GameSpeedUpButton.style.cursor = "pointer";
    GameSpeedUpButton.style.textAlign = "center";
    GameSpeedUpButton.style.userSelect = "none";
    StatsContainer.appendChild(GameSpeedUpButton);

    const GameSpeedDownButton = document.createElement("span");
    GameSpeedDownButton.innerHTML = "-";
    GameSpeedDownButton.style.color = "rgb(23, 161, 191)";
    GameSpeedDownButton.style.fontSize = "100%";
    GameSpeedDownButton.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
    GameSpeedDownButton.style.padding = "10px";
    GameSpeedDownButton.style.cursor = "pointer";
    GameSpeedDownButton.style.textAlign = "center";
    GameSpeedDownButton.style.userSelect = "none";
    StatsContainer.appendChild(GameSpeedDownButton);

    const DisplayButton = document.createElement("span");
    DisplayButton.innerHTML = "Display";
    DisplayButton.style.color = "rgb(23, 161, 191)";
    DisplayButton.style.fontSize = "100%";
    DisplayButton.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
    DisplayButton.style.padding = "10px";
    DisplayButton.style.cursor = "pointer";
    DisplayButton.style.textAlign = "center";
    DisplayButton.style.userSelect = "none";
    StatsContainer.appendChild(DisplayButton);

    GameSpeedUpButton.addEventListener("click", () => {
        document.body.setAttribute("speed", (parseInt(document.body.getAttribute("speed")) + 1));
    });
    GameSpeedDownButton.addEventListener("click", () => {
        document.body.setAttribute("speed", (parseInt(document.body.getAttribute("speed")) - 1));
    });
    DisplayButton.addEventListener("click", () => {
        const Displays = ["Heat", "Default"];
        let Display = document.body.getAttribute("display") || Displays[0];
        const NextIndex = (Displays.indexOf(Display.charAt(0).toUpperCase() + Display.slice(1)) + 1) % Displays.length;
        Display = Displays[NextIndex];
        document.body.setAttribute("display", Display.toLowerCase());
        ActionLabel.textContent = `${Display} Display`;
    });
}

let LastTime = performance.now();
let FrameCount = 0;

function InvertColor(RgbString) {
    let Match = RgbString.match(/\d+/g);
    let R = 255 - parseInt(Match[0]);
    let G = 255 - parseInt(Match[1]);
    let B = 255 - parseInt(Match[2]);
    return `rgb(${R}, ${G}, ${B})`;
}

for (let Index = 0; Index < Elements.length; Index++) {
    const Element = Elements[Index];
    const ElementDiv = document.createElement("div");
    ElementDiv.style.width = "100%";
    ElementDiv.style.height = "7.5%";
    ElementDiv.style.fontSize = "100%";
    ElementDiv.style.textAlign = "center";
    ElementDiv.style.justifyContent = "center";
    ElementDiv.style.alignContent = "center";
    ElementDiv.style.alignItems = "center";
    ElementDiv.style.backgroundColor = Element.Color;
    ElementDiv.style.color = InvertColor(Element.Color);
    ElementDiv.innerHTML = Element.Name.toUpperCase();
    ElementDiv.dataset.type = Element.Type;
    ElementDiv.dataset.flammable = Element.Flammable;
    ElementDiv.dataset.caustic = Element.Caustic;
    ElementDiv.style.zIndex = 9999;
    ElementDiv.id = Element.Name;

    ElementDiv.addEventListener("mousemove", (Event) => {
        document.body.setAttribute("selected", Event.target.id);
    });

    ElementContainer.appendChild(ElementDiv);
}

ClearButton.addEventListener("click", () => {
    ParticleContainer.innerHTML = "";
    document.body.setAttribute("selected", "none");
});

function UpdateFps() {
    ParticlesLabel.innerHTML = `Parts: ${ParticleContainer.children.length}`;
    GameSpeedLabel.innerHTML = `SPD: ${document.body.getAttribute("speed")}`;

    const CurrentTime = performance.now();
    const ElapsedTime = CurrentTime - LastTime;

    let SelectedElement = document.getElementById(document.body.getAttribute("selected"));
    if (SelectedElement === null) {
        ElementLabel.innerHTML = "NONE";
    } else {
        ElementLabel
        ElementLabel.innerHTML = SelectedElement.id;
    }

    if (ElapsedTime > 250) {
        const Fps = Math.floor(FrameCount / (ElapsedTime / 1000));
        FpsLabel.innerHTML = `FPS: ${Fps}`;
        LastTime = CurrentTime;
        FrameCount = 0;
    } else {
        FrameCount++;
    }

    setTimeout(UpdateFps, 0);
}

UpdateFps();

let MouseX = 0;
let MouseY = 0;
let IsDragging = false;

document.addEventListener("pointermove", (Event) => {
    MouseX = Event.clientX;
    MouseY = Event.clientY;
});

document.addEventListener("wheel", (Event) => {
    if (Event.ctrlKey) {
        Event.preventDefault();
        const CurrentGameSpeed = parseInt(document.body.getAttribute("speed"));
        const NewGameSpeed = Math.min(Math.max(CurrentGameSpeed + Math.sign(-Event.deltaY), -8), 8);
        document.body.setAttribute("speed", NewGameSpeed);
    }
}, { passive: false });

document.addEventListener("contextmenu", (Event) => {
    Event.preventDefault();
});

document.addEventListener("mousedown", (Event) => {
    if (Event.button === 0) {
        IsDragging = true;
    }
});

document.addEventListener("mouseup", (Event) => {
    if (Event.button === 0) {
        IsDragging = false;
    }
});

document.addEventListener("touchstart", (Event) => {
    if (Event.touches.length === 1) {
        IsDragging = true;
    }
});

document.addEventListener("touchend", (Event) => {
    IsDragging = false;
});

document.addEventListener("touchmove", (Event) => {
    if (Event.touches.length === 1) {
        const Touch = Event.touches[0];
        MouseX = Touch.clientX;
        MouseY = Touch.clientY;
    }
});

function Loop() {
    Cursor.style.top = `${MouseY - (Cursor.offsetHeight / 2)}px`;
    Cursor.style.left = `${MouseX - (Cursor.offsetWidth / 2)}px`;
    Cursor.style.width = `${parseInt(document.body.getAttribute("cursor-size"))}px`;

    if (IsDragging && ParticleContainer) {
        const GridSize = parseInt(document.body.getAttribute("grid-size"));
        const SnappedX = Math.floor(MouseX / GridSize) * GridSize;
        const SnappedY = Math.floor(MouseY / GridSize) * GridSize;

        if (Event.button === 2 && Event.currentTarget !== null) {
            Event.currentTarget.remove();
        }
    }

    requestAnimationFrame(Loop);
}

Loop();