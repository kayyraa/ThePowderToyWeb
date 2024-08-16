import { Elements } from "./elements.js";

const ParticleContainer = document.getElementById("ParticleContainer");

const ActionLabel = document.createElement("span");
ActionLabel.innerHTML = "Default Display";
ActionLabel.style.fontSize = "24px";
ActionLabel.style.position = "absolute";
ActionLabel.style.top = "2%";
ActionLabel.style.left = "50%";
ActionLabel.style.transform = "translate(-50%, -50%)";
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
StatsContainer.style.width = "10%";
StatsContainer.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
StatsContainer.style.zIndex = 9999;
document.body.appendChild(StatsContainer);

const ClearButton = document.createElement("span");
ClearButton.innerHTML = "CLEAR";
ClearButton.style.color = "rgb(23, 161, 191)";
ClearButton.style.fontSize = "24px";
ClearButton.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
ClearButton.style.padding = "10px";
ClearButton.style.cursor = "pointer";
ClearButton.style.textAlign = "center";
ClearButton.style.userSelect = "none";
StatsContainer.appendChild(ClearButton);

const FpsLabel = document.createElement("span");
FpsLabel.innerHTML = "FPS: ~";
FpsLabel.style.color = "rgb(23, 161, 191)";
FpsLabel.style.fontSize = "24px";
FpsLabel.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
FpsLabel.style.padding = "10px";
FpsLabel.style.textAlign = "center";
FpsLabel.style.userSelect = "none";
StatsContainer.appendChild(FpsLabel);

const ParticlesLabel = document.createElement("span");
ParticlesLabel.innerHTML = "Parts: ~";
ParticlesLabel.style.color = "rgb(23, 161, 191)";
ParticlesLabel.style.fontSize = "24px";
ParticlesLabel.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
ParticlesLabel.style.padding = "10px";
ParticlesLabel.style.textAlign = "center";
ParticlesLabel.style.userSelect = "none";
StatsContainer.appendChild(ParticlesLabel);

const ElementContainer = document.createElement("div");
ElementContainer.style.position = "absolute";
ElementContainer.style.right = "0.75%";
ElementContainer.style.top = "10%";
ElementContainer.style.width = "4%";
ElementContainer.style.height = "75%";
ElementContainer.style.textAlign = "center";
ElementContainer.style.userSelect = "none";
ElementContainer.style.justifyContent = "center";
ElementContainer.style.alignContent = "center";
ElementContainer.style.alignItems = "center";
ElementContainer.style.zIndex = -9999;
document.body.appendChild(ElementContainer);

const ElementLabel = document.createElement("span");
ElementLabel.innerHTML = "Empty";
ElementLabel.style.position = "absolute";
ElementLabel.style.right = "1%";
ElementLabel.style.color = "rgb(172, 172, 172)";
ElementLabel.style.fontSize = "24px";
ElementLabel.style.paddingLeft = "10px";
ElementLabel.style.paddingRight = "10px";
ElementLabel.style.textAlign = "center";
ElementLabel.style.userSelect = "none";
document.body.appendChild(ElementLabel);

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

    const CurrentTime = performance.now();
    const ElapsedTime = CurrentTime - LastTime;

    let SelectedElement = document.getElementById(document.body.getAttribute("selected"));
    if (SelectedElement === null) {
        ElementLabel.innerHTML = "Empty";
    } else {
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