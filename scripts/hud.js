import { Elements } from "./elements.js";
import { Settings } from "./settings.js";
import { Displays } from "./displays.js";
import { Theme } from "./theme.js";
import * as tptw from "./tptw.js";

document.title = Settings.Version;

const ParticleContainer = document.getElementById("ParticleContainer");

var MouseX = 0;
var MouseY = 0;

export const SidebarContainer = document.createElement("div");
SidebarContainer.style.position = "absolute";
SidebarContainer.style.display = "flex";
SidebarContainer.style.flexDirection = "column";
SidebarContainer.style.alignItems = "center";
SidebarContainer.style.width = !IsMobile() ? "210px" : "120px";
SidebarContainer.style.backgroundColor = Theme.BackgroundColor;
document.body.appendChild(SidebarContainer);

const ActionLabel = document.createElement("span");
ActionLabel.innerHTML = "Default Display";
ActionLabel.style.textAlign = "center";
ActionLabel.style.fontSize = "18px";
ActionLabel.style.paddingTop = "9px";
ActionLabel.style.color = Theme.TertiaryColor;
ActionLabel.style.userSelect = "none";
ActionLabel.draggable = false;
ActionLabel.id = "ActionLabel";
SidebarContainer.appendChild(ActionLabel);

const ClearButton = document.createElement("span");
ClearButton.innerHTML = "CLEAR";
ClearButton.style.color = Theme.PrimaryColor;
ClearButton.style.fontSize = "100%";
ClearButton.style.width = "100%";
ClearButton.style.padding = "10px";
ClearButton.style.cursor = "pointer";
ClearButton.style.textAlign = "center";
ClearButton.style.userSelect = "none";
SidebarContainer.appendChild(ClearButton);

const DisplayButton = document.createElement("span");
DisplayButton.innerHTML = "DISPLAY";
DisplayButton.style.color = Theme.PrimaryColor;
DisplayButton.style.fontSize = "100%";
DisplayButton.style.width = "100%";
DisplayButton.style.padding = "10px";
DisplayButton.style.cursor = "pointer";
DisplayButton.style.textAlign = "center";
DisplayButton.style.userSelect = "none";
SidebarContainer.appendChild(DisplayButton);

const FpsLabel = document.createElement("span");
FpsLabel.innerHTML = "FPS: ~";
FpsLabel.style.color = Theme.PrimaryColor;
FpsLabel.style.fontSize = "100%";
FpsLabel.style.width = "100%";
FpsLabel.style.padding = "10px";
FpsLabel.style.textAlign = "center";
FpsLabel.style.userSelect = "none";
SidebarContainer.appendChild(FpsLabel);

const ParticlesLabel = document.createElement("span");
ParticlesLabel.innerHTML = "Parts: ~";
ParticlesLabel.style.color = Theme.PrimaryColor;
ParticlesLabel.style.fontSize = "100%";
ParticlesLabel.style.width = "100%";
ParticlesLabel.style.padding = "10px";
ParticlesLabel.style.textAlign = "center";
SidebarContainer.appendChild(ParticlesLabel);

const ElementContainer = document.createElement("div");
ElementContainer.id = "ElementContainer";
document.body.appendChild(ElementContainer);

export const ElementLabel = document.createElement("span");
ElementLabel.innerHTML = "NONE";
ElementLabel.classList.add("ElementLabel");
ElementLabel.style.color = Theme.TertiaryColor;
SidebarContainer.appendChild(ElementLabel);

Elements.forEach(Element => {
    const ElementDiv = document.createElement("div");
    ElementDiv.classList.add("ELEMENT");
    ElementDiv.innerHTML = Element.Name.toUpperCase().substring(0, 4);
    ElementDiv.style.backgroundColor = Element.Color;
    ElementDiv.style.color = InvertColor(Element.Color, false);
    
    ElementDiv.dataset.type = Element.Type;
    ElementDiv.dataset.coldType = Element.ColdType;
    ElementDiv.dataset.hotType = Element.HotType;
    ElementDiv.dataset.flammable = Element.Flammable.toString();
    ElementDiv.dataset.caustic = Element.Caustic.toString();
    ElementDiv.dataset.radioactive = Element.Radioactive.toString();
    ElementDiv.dataset.radioactivity = Element.Radioactivity !== undefined ? Element.Radioactivity.toString() : "";
    ElementDiv.dataset.light = Element.Light.toString();
    ElementDiv.dataset.temp = Element.Temp.toString();
    ElementDiv.dataset.meltingPoint = Element.MeltingPoint !== undefined ? Element.MeltingPoint : undefined;
    ElementDiv.dataset.boilingPoint = Element.BoilingPoint !== undefined ? Element.BoilingPoint : undefined;
    ElementDiv.dataset.name = Element.Name;
    ElementDiv.id = Element.Name;

    const DescriptionLabel = document.createElement("span");
    DescriptionLabel.innerHTML = `${Element.Name} - ${Element.Flair} ${Element.Radioactive ? `- ${Element.Radioactivity}` : ""}`;
    DescriptionLabel.style.right = !IsMobile() ? "-150px" : "-156px";
    DescriptionLabel.id = "DescriptionLabel";
    ElementDiv.appendChild(DescriptionLabel);

    ElementDiv.addEventListener("mouseenter", function() {
        this.style.height = "5%";
        DescriptionLabel.style.opacity = "1";

        Array.from(ElementContainer.getElementsByTagName("div")).forEach(OtherElement => {
            if (OtherElement !== this) {
                OtherElement.style.height = "3%";

                const OtherDescriptionLabel = OtherElement.querySelector("#DescriptionLabel");
                if (OtherDescriptionLabel) {
                    OtherDescriptionLabel.style.opacity = "0";
                }
            }
        });
    });

    ElementDiv.addEventListener("mouseleave", () => {
        DescriptionLabel.style.opacity = "0";
        ElementDiv.style.height = "17.5px";
    });

    ElementDiv.addEventListener("click", (Event) => {
        document.body.setAttribute("selected", Event.target.id);
    });

    ElementContainer.appendChild(ElementDiv);
});

const TempLabel = document.createElement("span");
TempLabel.innerHTML = "43°C";
TempLabel.style.position = "fixed";
TempLabel.style.opacity = "0";
TempLabel.style.transition = "opacity 0.25s ease";
TempLabel.style.pointerEvents = "none";
TempLabel.id = "TempLabel";
document.body.appendChild(TempLabel);

function IsMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|windows phone|opera mini/i.test(userAgent);
}

if (IsMobile()) {
    ElementContainer.style.width = "50px";
    ElementContainer.style.right = "-15px";
}

let LastTime = performance.now();
let FrameCount = 0;

function InvertColor(RgbString, TrueColor) {
    let Match = RgbString.match(/\d+/g);
    let R = parseInt(Match[0]);
    let G = parseInt(Match[1]);
    let B = parseInt(Match[2]);

    if (TrueColor) {
        return {
            R: 255 - R,
            G: 255 - G,
            B: 255 - B
        };    
    } else {
        let Average = (R + G + B) / 3;
        if (Average > 128) {
            return 'rgb(0, 0, 0)';
        } else {
            return 'rgb(255, 255, 255)';
        }
    }
}

DisplayButton.addEventListener("click", () => {
    let Display = document.body.getAttribute("display") || Displays[0];
    const NextIndex = (Displays.indexOf(Display.charAt(0).toUpperCase() + Display.slice(1)) + 1) % Displays.length;
    Display = Displays[NextIndex];
    document.body.setAttribute("display", Display.toLowerCase());
    ActionLabel.textContent = `${Display} Display`;
});

ClearButton.addEventListener("click", () => {
    tptw.Clear();
});

document.addEventListener("pointermove", (Event) => {
    MouseX = Event.clientX;
    MouseY = Event.clientY
});

function Update() {
    const Parts = ParticleContainer.children.length;

    ParticlesLabel.innerHTML = `Parts: ${Parts}`;
 
    TempLabel.style.left = `${MouseX - 50}px`;
    TempLabel.style.top = `${MouseY - 25}px`;

    const Target = document.elementFromPoint(MouseX, MouseY);

    if (Target && Target.dataset.particle === "true" && Target.dataset.temp) {
        const Temp = parseFloat(Target.dataset.temp);
        const MeltingPoint = Target.dataset.meltingPoint ? parseFloat(Target.dataset.meltingPoint) : null;
        
        const TempText = isFinite(Temp) ? Temp.toFixed(2) : "N/A";
        const MeltingPointText = MeltingPoint !== null ? `/ ${MeltingPoint.toFixed(2)}°C` : "";
        
        TempLabel.style.color = `rgb(255, ${255 - ((Temp / MeltingPoint) * 100)}, ${255 - ((Temp / MeltingPoint) * 100)})`;

        TempLabel.innerHTML = `${Target.id} - ${TempText}°C ${isFinite(MeltingPoint) ? MeltingPointText : ""}`;
        TempLabel.style.opacity = "1";
    } else {
        TempLabel.style.opacity = "0";
    }

    const CurrentTime = performance.now();
    const ElapsedTime = CurrentTime - LastTime;

    let SelectedElement = document.getElementById(document.body.getAttribute("selected"));
    ElementLabel.innerHTML = SelectedElement ? SelectedElement.id : "NONE";

    if (ElapsedTime > 125) {
        const Fps = Math.floor(FrameCount / (ElapsedTime / 1000));
        FpsLabel.innerHTML = `FPS: ${Fps}`;

        LastTime = CurrentTime;
        FrameCount = 0;
    } else {
        FrameCount++;
    }

    requestAnimationFrame(Update);
}

Update();