const Elements = [
    {
        Name: "SAND",
        Color: "rgb(194, 178, 128)",
        Type: "Powder"
    },
    {
        Name: "WATR",
        Color: "rgb(15, 94, 156)",
        Type: "Liquid"
    },
    {
        Name: "COAL",
        Color: "rgb(68, 69, 69)",
        Type: "Solid"
    }
];

const FpsLabel = document.createElement("span");
FpsLabel.innerHTML = "FPS: ~";
FpsLabel.style.color = "rgb(80, 120, 255)";
FpsLabel.style.fontSize = "24px";
FpsLabel.style.backgroundColor = "rgba(255, 255, 255, 0.15)";
FpsLabel.style.paddingLeft = "10px";
FpsLabel.style.paddingRight = "10px";
FpsLabel.style.textAlign = "center";
FpsLabel.style.userSelect = "none";
document.body.appendChild(FpsLabel);

const ElementContainer = document.createElement("div");
ElementContainer.style.position = "absolute";
ElementContainer.style.right = "1%";
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
    ElementDiv.style.height = "11.25%";
    ElementDiv.style.fontSize = "100%";
    ElementDiv.style.textAlign = "center";
    ElementDiv.style.justifyContent = "center";
    ElementDiv.style.alignContent = "center";
    ElementDiv.style.alignItems = "center";
    ElementDiv.style.backgroundColor = Element.Color;
    ElementDiv.style.color = InvertColor(Element.Color);
    ElementDiv.innerHTML = Element.Name.toUpperCase();
    ElementDiv.dataset.type = Element.Type;
    ElementDiv.style.zIndex = 9999;
    ElementDiv.id = Element.Name;

    ElementDiv.addEventListener("mousemove", (Event) => {
        document.body.setAttribute("selected", Event.target.id);
    });

    ElementContainer.appendChild(ElementDiv);
}

function UpdateFps() {
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

    requestAnimationFrame(UpdateFps);
}

UpdateFps();