import { Elements } from "./elements.js";
import { Settings } from "./settings.js";
import { Displays } from "./displays.js";
import { Theme } from "./theme.js";
import * as tptw from "./tptw.js";

document.title = Settings.Version;

const LogContainer = document.getElementById("LogContainer");
const ParticleContainer = document.getElementById("ParticleContainer");

var MaxFps = 0;
var MaxTemp = Infinity;
var MinTemp = -Infinity;

var MouseX = 0;
var MouseY = 0;

const ActionLabel = document.createElement("span");
ActionLabel.innerHTML = "Default Display";
ActionLabel.style.fontSize = "24px";
ActionLabel.style.color = Theme.TertiaryColor;
ActionLabel.style.userSelect = "none";
ActionLabel.draggable = false;
ActionLabel.id = "ActionLabel";
document.body.appendChild(ActionLabel);

const StatsContainer = document.createElement("div");
StatsContainer.style.display = "flex";
StatsContainer.style.flexDirection = "column";
StatsContainer.style.alignItems = "center";
StatsContainer.style.width = "210px";
StatsContainer.style.backgroundColor = Theme.BackgroundColor;
document.body.appendChild(StatsContainer);

const AmbientTempLabel = document.createElement("span");
AmbientTempLabel.innerHTML = `AT: ${Settings.AmbientTemp.toFixed(2)}°C`;
AmbientTempLabel.style.fontSize = "16px";
AmbientTempLabel.style.color = Theme.TertiaryColor;
AmbientTempLabel.style.width = "100%";
AmbientTempLabel.style.height = "24px";
AmbientTempLabel.style.paddingTop = "12px";
AmbientTempLabel.style.textAlign = "center";
AmbientTempLabel.style.userSelect = "none";
AmbientTempLabel.draggable = false;
AmbientTempLabel.id = "AmbientTempLabel";
StatsContainer.appendChild(AmbientTempLabel);

const AverageTempLabel = document.createElement("span");
AverageTempLabel.innerHTML = `APT: 42.00°C`;
AverageTempLabel.style.fontSize = "16px";
AverageTempLabel.style.color = Theme.TertiaryColor;
AverageTempLabel.style.width = "100%";
AverageTempLabel.style.height = "24px";
AverageTempLabel.style.paddingTop = "12px";
AverageTempLabel.style.textAlign = "center";
AverageTempLabel.style.userSelect = "none";
AverageTempLabel.draggable = false;
AverageTempLabel.id = "AverageTempLabel";
StatsContainer.appendChild(AverageTempLabel);

const ClearButton = document.createElement("span");
ClearButton.innerHTML = "CLEAR";
ClearButton.style.color = Theme.PrimaryColor;
ClearButton.style.fontSize = "100%";
ClearButton.style.width = "100%";
ClearButton.style.padding = "10px";
ClearButton.style.cursor = "pointer";
ClearButton.style.textAlign = "center";
ClearButton.style.userSelect = "none";
StatsContainer.appendChild(ClearButton);

const FpsLabel = document.createElement("span");
FpsLabel.innerHTML = "FPS: ~";
FpsLabel.style.color = Theme.PrimaryColor;
FpsLabel.style.fontSize = "100%";
FpsLabel.style.width = "100%";
FpsLabel.style.padding = "10px";
FpsLabel.style.textAlign = "center";
FpsLabel.style.userSelect = "none";
StatsContainer.appendChild(FpsLabel);

const FpsGraph = document.createElement("div");
FpsGraph.style.width = "25%";
FpsGraph.style.aspectRatio = "1 / 1";
FpsGraph.style.boxSizing = "border-box";
FpsGraph.style.border = "5px solid rgb(23, 161, 191)";
FpsGraph.style.borderRadius = "100%";
FpsGraph.style.display = "flex";
FpsGraph.style.justifyContent = "center";
FpsGraph.style.alignItems = "center";
StatsContainer.appendChild(FpsGraph);

const FpsGraphVisualizer = document.createElement("div");
FpsGraphVisualizer.style.transition = "width 0.125s ease";
FpsGraphVisualizer.style.border = "5px solid white";
FpsGraphVisualizer.style.width = "0%";
FpsGraphVisualizer.style.aspectRatio = "1 / 1";
FpsGraphVisualizer.style.borderRadius = "512px";
FpsGraph.appendChild(FpsGraphVisualizer);

const ParticlesLabel = document.createElement("span");
ParticlesLabel.innerHTML = "Parts: ~";
ParticlesLabel.style.color = Theme.PrimaryColor;
ParticlesLabel.style.fontSize = "100%";
ParticlesLabel.style.width = "100%";
ParticlesLabel.style.padding = "10px";
ParticlesLabel.style.textAlign = "center";
StatsContainer.appendChild(ParticlesLabel);

const ElementContainer = document.createElement("div");
ElementContainer.style.position = "fixed";
ElementContainer.style.right = "0px";
ElementContainer.style.top = "50%";
ElementContainer.style.width = "75px";
ElementContainer.style.height = "600px";
ElementContainer.style.textAlign = "center";
ElementContainer.style.justifyContent = "center";
ElementContainer.style.alignContent = "center";
ElementContainer.style.alignItems = "center";
ElementContainer.style.transform = "translate(-50%, -50%)";
ElementContainer.style.pointerEvents = "all";
ElementContainer.id = "ElementContainer";
document.body.appendChild(ElementContainer);

const ElementLabel = document.createElement("span");
ElementLabel.innerHTML = "NONE";
ElementLabel.style.position = "fixed";
ElementLabel.style.color = Theme.TertiaryColor;
ElementLabel.style.width = "200px";
ElementLabel.style.height = "50px";
ElementLabel.style.bottom = "10px";
ElementLabel.style.left = "-10px";
ElementLabel.style.fontSize = "24px";
ElementLabel.style.paddingLeft = "10px";
ElementLabel.style.paddingRight = "10px";
ElementLabel.style.textAlign = "center";
ElementLabel.style.userSelect = "none";
ElementLabel.style.pointerEvents = "none";
document.body.appendChild(ElementLabel);

for (let Index = 0; Index < Elements.length; Index++) {
    const Element = Elements[Index];

    const ElementDiv = document.createElement("div");
    ElementDiv.innerHTML = Element.Name.toUpperCase().substring(0, 4);
    ElementDiv.style.display = "flex";
    ElementDiv.style.flexDirection = "column";
    ElementDiv.style.width = "100%";
    ElementDiv.style.height = "20px";
    ElementDiv.style.fontSize = "100%";
    ElementDiv.style.textAlign = "left";
    ElementDiv.style.justifyContent = "center";
    ElementDiv.style.alignContent = "center";
    ElementDiv.style.alignItems = "center";
    ElementDiv.style.transition = "height 0.25s ease";
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
    ElementDiv.style.zIndex = "9999";
    ElementDiv.id = Element.Name;

    const DescriptionLabel = document.createElement("span");
    DescriptionLabel.innerHTML = `${Element.Name} - ${Element.Flair} ${Element.Radioactive ? `- ${Element.Radioactivity}` : ""}`;
    DescriptionLabel.style.position = "absolute";
    DescriptionLabel.style.color = "white";
    DescriptionLabel.style.right = "-125px";
    DescriptionLabel.style.pointerEvents = "none";
    DescriptionLabel.style.width = "512px";
    DescriptionLabel.style.opacity = "0";
    DescriptionLabel.style.transition = "opacity 0.25s ease";
    DescriptionLabel.id = "DescriptionLabel";
    ElementDiv.appendChild(DescriptionLabel);

    ElementDiv.addEventListener("mouseenter", function() {
        this.style.height = "40px";
        DescriptionLabel.style.opacity = "1";

        Array.from(ElementContainer.getElementsByTagName("div")).forEach(OtherElement => {
            if (OtherElement !== this) {
                OtherElement.style.height = "20px";

                const OtherDescriptionLabel = OtherElement.querySelector("#DescriptionLabel");
                if (OtherDescriptionLabel) {
                    OtherDescriptionLabel.style.opacity = "0";
                }
            }
        });
    });

    ElementDiv.addEventListener("mouseleave", () => {
        DescriptionLabel.style.opacity = "0";
        ElementDiv.style.height = "20px";
    });

    ElementDiv.addEventListener("click", (Event) => {
        document.body.setAttribute("selected", Event.target.id);
    });

    ElementContainer.appendChild(ElementDiv);
}

const TempLabel = document.createElement("span");
TempLabel.innerHTML = "43°C";
TempLabel.style.position = "fixed";
TempLabel.style.opacity = "0";
TempLabel.style.transition = "opacity 0.25s ease";
TempLabel.style.pointerEvents = "none";
document.body.appendChild(TempLabel);

function IsMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|windows phone|opera mini/i.test(userAgent);
}

if (IsMobile()) {
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

    DisplayButton.addEventListener("click", () => {
        let Display = document.body.getAttribute("display") || Displays[0];
        const NextIndex = (Displays.indexOf(Display.charAt(0).toUpperCase() + Display.slice(1)) + 1) % Displays.length;
        Display = Displays[NextIndex];
        document.body.setAttribute("display", Display.toLowerCase());
        ActionLabel.textContent = `${Display} Display`;
    });
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
    }f
}

ClearButton.addEventListener("click", () => {
    tptw.Clear();
});

document.addEventListener("pointermove", (Event) => {
    MouseX = Event.clientX;
    MouseY = Event.clientY
});

function UpdateFps() {
    const Parts = ParticleContainer.children.length;

    LogContainer.scrollTop = LogContainer.scrollHeight;
    ParticlesLabel.innerHTML = `Parts: ${Parts}`;
 
    TempLabel.style.left = `${MouseX - 50}px`;
    TempLabel.style.top = `${MouseY - 25}px`;

    const AverageTemp = (MaxTemp + MinTemp) / 2;
    AverageTempLabel.innerHTML = `APT: ${isFinite(AverageTemp) ? AverageTemp.toFixed(2) : "N/A"}°C`;

    const Target = document.elementFromPoint(MouseX, MouseY);

    if (Target && Target.dataset.particle === "true" && Target.dataset.temp) {
        const Temp = parseFloat(Target.dataset.temp);
        const MeltingPoint = Target.dataset.meltingPoint ? parseFloat(Target.dataset.meltingPoint) : null;
        const BoilingPoint = Target.dataset.boilingPoint ? parseFloat(Target.dataset.boilingPoint) : null;

        const TempText = isFinite(Temp) ? Temp.toFixed(2) : "N/A";
        const MeltingPointText = MeltingPoint !== null ? `m${MeltingPoint.toFixed(2)}°C` : "";
        const BoilingPointText = BoilingPoint !== null ? `b${BoilingPoint.toFixed(2)}°C` : "";

        TempLabel.innerHTML = `${TempText}°C ${MeltingPointText} ${BoilingPointText}`;
        TempLabel.style.opacity = "1";
    } else {
        TempLabel.style.opacity = "0";
    }

    const CurrentTime = performance.now();
    const ElapsedTime = CurrentTime - LastTime;

    let SelectedElement = document.getElementById(document.body.getAttribute("selected"));
    ElementLabel.innerHTML = SelectedElement ? SelectedElement.id : "NONE";

    var MinTemp = Infinity;
    var MaxTemp = -Infinity;

    Array.from(ParticleContainer.getElementsByTagName("div")).forEach(Particle => {
        const Temp = parseFloat(Particle.dataset.temp);
    
        if (isFinite(Temp)) {
            if (Temp < MinTemp) {
                MinTemp = Temp;
            }
            if (Temp > MaxTemp) {
                MaxTemp = Temp;
            }
        }
    });

    if (isFinite(MinTemp) && isFinite(MaxTemp)) {
        AverageTempLabel.innerHTML = `APT: ${((MaxTemp + MinTemp) / 2).toFixed(2)}°C`;
    }

    if (ElapsedTime > 125) {
        const Fps = Math.floor(FrameCount / (ElapsedTime / 1000));
        FpsGraphVisualizer.style.width = `${(Fps / MaxFps) * 100}%`;
        FpsGraphVisualizer.style.border = `${(Fps / MaxFps) * 10}px solid white`;
        FpsLabel.innerHTML = `FPS: ${Fps}`;

        if (Fps >= MaxFps) {
            MaxFps = Fps;
        }

        LastTime = CurrentTime;
        FrameCount = 0;
    } else {
        FrameCount++;
    }

    setTimeout(UpdateFps, 0);
}

UpdateFps();