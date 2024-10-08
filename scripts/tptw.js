import { Settings } from "./settings.js";
import { Elements } from "./elements.js";
import { NameButton, UsernameButton, Buttons, SetCurrentOpenedSave } from "./save.js";

export const ParticleContainer = document.getElementById("ParticleContainer");
export const PlaceholderContainer = document.getElementById("PlaceholderContainer");

export function Random(Max, Min) {
    return Math.floor(Math.random() * (Max - Min + 1)) + Min;
}

export function IsMobile() {
    const userAgent = navigator.userAgent.toLowerCase();
    return /android|webos|iphone|ipad|ipod|blackberry|windows phone|opera mini/i.test(userAgent);
}

export function Clear() {
    SetCurrentOpenedSave(undefined);

    ParticleContainer.innerHTML = "";
    NameButton.value = "";
    UsernameButton.value = "";

    Array.from(Buttons.getElementsByTagName("div")).forEach(Button => {
        Button.setAttribute("disabled", false);
    });
    Array.from(Buttons.getElementsByTagName("input")).forEach(Button => {
        Button.disabled = false;
    });
}

export function Notify(Title, Message, MarkIcon) {
    const Container = document.createElement("div");
    Container.style.position = "absolute";
    Container.style.left = "50%";
    Container.style.top = "50%";
    Container.style.transform = "translate(-50%, -50%)";
    Container.style.width = "75%";
    Container.style.height = "35%";
    Container.style.backgroundColor = "white";
    Container.style.color = "black";
    Container.style.transition = "all 0.125s ease";
    Container.style.overflow = "hidden";
    document.body.appendChild(Container);

    const TitleElement = document.createElement("span");
    TitleElement.style.position = "absolute";
    TitleElement.style.display = "flex";
    TitleElement.style.paddingLeft = "2.5%";
    TitleElement.style.width = "100%";
    TitleElement.style.height = "10%";
    TitleElement.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    TitleElement.style.color = "white";
    TitleElement.style.alignItems = "center";
    TitleElement.style.alignContent = "center";
    TitleElement.innerHTML = Title;
    Container.appendChild(TitleElement);

    const CloseButton = document.createElement("div");
    CloseButton.style.position = "absolute";
    CloseButton.innerHTML = "X";
    CloseButton.style.right = "4.5%";
    CloseButton.style.cursor = "pointer";
    TitleElement.appendChild(CloseButton);

    const Image = document.createElement("img");
    Image.src = MarkIcon;
    Image.draggable = false;
    Image.style.position = "absolute";
    Image.style.transform = "translate(-50%, -50%)";
    Image.style.width = "10%";
    Image.style.top = "52.5%";
    Image.style.left = "10%";
    Container.appendChild(Image);

    const MessageContent = document.createElement("div");
    MessageContent.innerHTML = Message;
    MessageContent.style.position = "absolute";
    MessageContent.style.transform = "translate(0%, -50%)";
    MessageContent.style.top = "52.5%";
    MessageContent.style.left = "20%";
    MessageContent.style.fontSize = "1.5rem";
    Container.appendChild(MessageContent);

    CloseButton.addEventListener("click", () => {
        Container.style.opacity = 0;
        setTimeout(() => {
            Container.remove();
        }, 125);
    });

    CloseButton.addEventListener("mouseenter", () => {
        CloseButton.style.color = "red";
    });

    CloseButton.addEventListener("mouseleave", () => {
        CloseButton.style.color = "white";
    });
}

export function Print(x) {
    const LogContainer = document.getElementById("LogContainer");

    if (LogContainer) {
        const Span = document.createElement("span");
        Span.innerHTML = x;
        LogContainer.appendChild(Span);

        setTimeout(() => {
            Span.style.opacity = "0";
            setTimeout(() => {
                Span.remove();
            }, 2000);
        }, 3000);
    }
}

export function PowderEffect(R, G, B, EffectStrength) {
    return {
        R: Random(R + EffectStrength, R),
        G: Random(G + EffectStrength, G),
        B: Random(B + EffectStrength, B)
    };
}

export function RgbString(RgbString) {
    const RgbArray = RgbString.match(/\d+/g).map(Number);
    return {
        R: RgbArray[0],
        G: RgbArray[1],
        B: RgbArray[2]
    };
}

export function CombustElement(CausticPart, FlammablePart) {
    GetAllParticles().forEach(Particle => {
        if (Particle !== FlammablePart && Particle.dataset.flammable === "true") {
            if (CheckCollision(FlammablePart, Particle)) {
                CreateParticle(Elements.find(element => element.Name === "SMKE"), Particle.offsetLeft, Particle.offsetTop);
                Particle.remove();
            }
        }
    });

    CreateParticle(Elements.find(element => element.Name === "SMKE"), FlammablePart.offsetLeft, FlammablePart.offsetTop);
    FlammablePart.remove();
    CausticPart.remove();
}

export function ExplodeParticle(Particle, Lifetime) {
    CreateExplosion(Random(255, 200), Random(25, 0), Random(25, 0), Particle.offsetLeft, Particle.offsetTop, Lifetime);
    Particle.remove();
}

export function CheckCollision(E0, E1) {
    const r1 = E0.getBoundingClientRect();
    const r2 = E1.getBoundingClientRect();
  
    return !(r1.right < r2.left || 
             r1.left > r2.right || 
             r1.bottom < r2.top || 
             r1.top > r2.bottom);
}

export function CreateParticle(
    {
        Name,
        Color,
        Flammable,
        Caustic,
        RadioactiveSettings,
        Light,
        Temp,
        MeltingPoint,
        BoilingPoint,
        Type,
        ColdType,
        HotType
    }, PositionX, PositionY) {
    const ParticleContainer = document.getElementById("ParticleContainer");
    const PowderStrength = Type !== "Solid" ? Settings.PowderEffectStrength : Settings.PowderEffectStrength / 4;
    const GridSize = parseFloat(document.body.getAttribute("grid-size"));

    function StringToRgb(RgbString) {
        const [R, G, B] = RgbString.match(/\d+/g).map(Number);
        return { R, G, B };
    }

    if (Name === "NONE") {
        return;
    }

    if (ParticleContainer) {
        const BaseColor = StringToRgb(Color);
        const TargetColor = `rgb(${BaseColor.R + Random(PowderStrength, -PowderStrength) / 4}, ${BaseColor.G + Random(PowderStrength, -PowderStrength) / 4}, ${BaseColor.B + Random(PowderStrength, -PowderStrength) / 4})`;

        const Particle = document.createElement("div");
        Particle.style.position = "absolute";
        Particle.style.left = `${PositionX}px`;
        Particle.style.top = `${PositionY}px`;
        Particle.style.width = `${GridSize}px`;
        Particle.style.height = `${GridSize}px`;
        Particle.style.backgroundColor = TargetColor;

        Particle.style.pointerEvents = Type === "None" ? "none" : "";

        Particle.className = Name.toUpperCase();
        Particle.dataset.name = Name;
        Particle.dataset.particle = "true";
        Particle.dataset.type = Type;
        Particle.dataset.coldType = ColdType;
        Particle.dataset.hotType = HotType;
        Particle.dataset.fixedType = Type;
        Particle.dataset.color = TargetColor;
        Particle.dataset.fixedColor = TargetColor;
        Particle.dataset.flammable = Flammable.toString();
        Particle.dataset.caustic = Caustic.toString();

        Particle.dataset.radioactive = RadioactiveSettings ? RadioactiveSettings.Radioactive.toString() : "false";
        Particle.dataset.fixedRadioactive = RadioactiveSettings ? RadioactiveSettings.Radioactive.toString() : "false";
        Particle.dataset.radioactivity = RadioactiveSettings ?  RadioactiveSettings.Radioactivity.toString() : "";
        Particle.dataset.decayParticle = RadioactiveSettings ? RadioactiveSettings.DecayParticle : "";
        
        Particle.dataset.light = Light.toString();
        Particle.dataset.temp = Temp.toString();
        Particle.dataset.meltingPoint = MeltingPoint !== undefined ? MeltingPoint.toString() : "";
        Particle.dataset.boilingPoint = BoilingPoint !== undefined ? BoilingPoint.toString() : "";
        Particle.id = Name;
        Particle.classList.add("PART");
        ParticleContainer.appendChild(Particle);

        return Particle;
    }
}

export function CreateRawParticle(X, Y) {
    const GridSize = parseFloat(document.body.getAttribute("grid-size"));

    const Particle = document.createElement("div");
    Particle.style.position = "absolute";
    Particle.style.left = `${X}px`;
    Particle.style.top = `${Y}px`;
    Particle.style.width = `${GridSize}px`;
    Particle.style.height = `${GridSize}px`;
    return Particle;
}

export function CreateExplosion(R, G, B, X, Y, Lifetime) {
    const AllParticles = GetAllParticles();

    for (let Index = 0; Index < Random(9, 0); Index++) {
        const XDirection = Random(5, -5);
        const YDirection = Random(5, -5);

        const Particle = CreateRawParticle(X, Y);
        Particle.style.backgroundColor = `rgb(${PowderEffect(R, G, B, Settings.PowderEffectStrength).R}, ${PowderEffect(R, G, B, Settings.PowderEffectStrength).G}, ${PowderEffect(R, G, B, Settings.PowderEffectStrength).B})`;
        document.body.appendChild(Particle);

        var Time = 0;

        function Update() {
            Time += 0.15;

            Particle.style.left = `${Particle.offsetLeft + XDirection}px`;
            Particle.style.top = `${Particle.offsetTop + YDirection}px`;

            Particle.style.opacity = 1 - Time / Lifetime;

            if (false) {
                AllParticles.forEach(OtherParticle => {
                    if (OtherParticle !== Particle && OtherParticle.dataset.hotType === "Explosive") {
                        if (CheckCollision(Particle, OtherParticle)) {
                            ExplodeParticle(OtherParticle, 15);
                        }
                    }
                });
            }

            const ParticleRect = Particle.getBoundingClientRect();
            const TouchingPart = document.elementFromPoint(ParticleRect.left, ParticleRect.top);
            if (TouchingPart.dataset.hotType === "Explosive") {
                CreateExplosion(RgbString(TouchingPart.dataset.color).R, RgbString(TouchingPart.dataset.color).G, RgbString(TouchingPart.dataset.color).B, TouchingPart.offsetLeft, TouchingPart.offsetTop, 15);
                TouchingPart.remove();
            }

            if (Time <= Lifetime) {
                requestAnimationFrame(Update);
            } else {
                Particle.remove();
            }
        }

        Update();
    }
}

export function DrawLineParticle(Element, StartPositionX, StartPositionY, EndPositionX, EndPositionY) {
    const GridSize = parseFloat(document.body.getAttribute("grid-size"));

    const Distance = Math.sqrt(Math.pow(EndPositionX - StartPositionX, 2) + Math.pow(EndPositionY - StartPositionY, 2));
    const NumberOfElements = Math.floor(Distance / GridSize);
    const DeltaX = (EndPositionX - StartPositionX) / NumberOfElements;
    const DeltaY = (EndPositionY - StartPositionY) / NumberOfElements;

    for (let Index = 0; Index < NumberOfElements; Index++) {
        let CurrentX = StartPositionX + DeltaX * Index;
        let CurrentY = StartPositionY + DeltaY * Index;

        CurrentX = Math.round(CurrentX / GridSize) * GridSize;
        CurrentY = Math.round(CurrentY / GridSize) * GridSize;

        CreateParticle(Element, CurrentX, CurrentY);
    }
}

export function DrawLinePlaceholder(StartPositionX, StartPositionY, EndPositionX, EndPositionY) {
    const GridSize = parseFloat(document.body.getAttribute("grid-size"));

    const Distance = Math.sqrt(Math.pow(EndPositionX - StartPositionX, 2) + Math.pow(EndPositionY - StartPositionY, 2));
    const NumberOfElements = Math.floor(Distance / GridSize);
    const DeltaX = (EndPositionX - StartPositionX) / NumberOfElements;
    const DeltaY = (EndPositionY - StartPositionY) / NumberOfElements;

    PlaceholderContainer.innerHTML = "";

    for (let Index = 0; Index < NumberOfElements; Index++) {
        let CurrentX = StartPositionX + DeltaX * Index;
        let CurrentY = StartPositionY + DeltaY * Index;

        CurrentX = Math.round(CurrentX / GridSize) * GridSize;
        CurrentY = Math.round(CurrentY / GridSize) * GridSize;

        const PlaceholderItem = document.createElement("div");
        PlaceholderItem.style.position = "absolute";
        PlaceholderItem.style.backgroundColor = "rgb(60, 60, 60)";
        PlaceholderItem.style.width = `${GridSize}px`;
        PlaceholderItem.style.aspectRatio = "1 / 1";
        PlaceholderItem.style.left = `${CurrentX}px`;
        PlaceholderItem.style.top = `${CurrentY}px`;

        PlaceholderContainer.appendChild(PlaceholderItem);
    }
}

export function ClearLinePlaceholder() {
    PlaceholderContainer.innerHTML = "";
}

export function GetAllParticles() {
    return Array.from(ParticleContainer.getElementsByTagName("div"));
}

export function GetParticleFromPosition(X, Y) {
    let Element = document.elementFromPoint(X, Y);
    if (Element && Element.classList.contains("PART")) {
        return Element;
    }
    return null;
}

export function GetParticleFromName(Name) {
    const AllParticles = GetAllParticles();
    if (AllParticles.length > 0) {
        return AllParticles.find(Particle => Particle.dataset.name.toUpperCase() === Name.toUpperCase());
    }
}

export function GetElement(Name) {
    return Elements.find(element => element.Name === Name);
}

export function IsPlaceOccupied(X, Y, GridSize) {
    const Particles = Array.from(ParticleContainer.children);
    return Particles.some(Particle => {
        const ParticleRect = Particle.getBoundingClientRect();
        const ParticleX = Math.floor(ParticleRect.left / GridSize) * GridSize;
        const ParticleY = Math.floor(ParticleRect.top / GridSize) * GridSize;
        return ParticleX === X && ParticleY === Y;
    });
}

export class math {
    static Clamp(value, min, max) {
        return Math.min(Math.max(value, min), max);
    }

    static Lerp(a, b, t) {
        return a + (b - a) * t;
    }

    static Map(value, inMin, inMax, outMin, outMax) {
        return (value - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
    }

    static Sign(value) {
        return value < 0? -1 : value > 0? 1 : 0;
    }

    static Rad(degrees) {
        return degrees * Math.PI / 180;
    }

    static Random(Max, Min) {
        return Math.floor(Math.random() * (Max - Min + 1)) + Min;
    }

    static Gcd(A, B) {
        while (B !== 0) {
            var C = B;
            B = A % B;
            A = C;
        }
        return A;
    }

    static Lcm(A, B) {
        return (A * B) / math.Gcd(A, B);
    }

    static RoundTo(X, Y) {
        return Math.round(X / Y) * Y;
    }
}