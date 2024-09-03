import { Theme } from "./theme.js";
import * as tptw from "./tptw.js";

const ParticleContainer = document.getElementById("ParticleContainer");

const Buttons = document.createElement("div");
Buttons.style.position = "absolute";
Buttons.style.display = "flex";
Buttons.style.textAlign = "center";
Buttons.style.alignContent = "center";
Buttons.style.alignItems = "center";
Buttons.style.justifyContent = "space-evenly";
Buttons.style.flexDirection = "row";
Buttons.style.fontSize = "100%";
Buttons.style.bottom = "0";
Buttons.style.left = "0";
Buttons.style.backgroundColor = Theme.BackgroundColor;
Buttons.style.width = "50%";
Buttons.style.height = "32px";
document.body.appendChild(Buttons);

const SaveButton = document.createElement("div");
SaveButton.innerHTML = "SAVE";
SaveButton.classList.add("BTN");
SaveButton.style.height = "100%";
SaveButton.style.width = "100%";
SaveButton.style.alignContent = "center";
SaveButton.style.alignItems = "center";
Buttons.appendChild(SaveButton);

const LoadButton = document.createElement("div");
LoadButton.innerHTML = "LOAD";
LoadButton.classList.add("BTN");
LoadButton.style.height = "100%";
LoadButton.style.width = "100%";
LoadButton.style.alignContent = "center";
LoadButton.style.alignItems = "center";
Buttons.appendChild(LoadButton);

const NameButton = document.createElement("input");
NameButton.type = "text";
NameButton.placeholder = "Simulation Name";
NameButton.style.width = "200%";
NameButton.style.height = "100%";
NameButton.style.fontSize = "16px";
NameButton.style.textAlign = "center";
Buttons.appendChild(NameButton);

const ParticleData = [];

function SaveToFile() {
    Array.from(ParticleContainer.getElementsByTagName("div")).forEach(Particle => {
        const ParticleMetadata = {
            Name: Particle.id,
            Temp: parseFloat(Particle.dataset.temp),
            PosX: Particle.offsetLeft,
            PosY: Particle.offsetTop,
        };
    
        ParticleData.push(ParticleMetadata);
    });

    const DataString = JSON.stringify(ParticleData);
    const BlobObject = new Blob([DataString], { type: "application/json" });
    const Url = URL.createObjectURL(BlobObject);
    const A = document.createElement("a");
    A.href = Url;
    A.download = `${NameButton.value}.json`;
    A.click();
    URL.revokeObjectURL(Url);
}

function LoadFromFile() {
    const Input = document.createElement("input");
    Input.type = "file";
    Input.accept = ".json";
    
    Input.addEventListener("change", (event) => {
        const File = event.target.files[0];
        if (File) {
            const Reader = new FileReader();
            Reader.onload = (e) => {
                try {
                    ParticleContainer.innerHTML = "";

                    const DataString = e.target.result;
                    const ParticleData = JSON.parse(DataString);
                    
                    while (ParticleContainer.firstChild) {
                        ParticleContainer.removeChild(ParticleContainer.firstChild);
                    }

                    ParticleData.forEach(Particle => {
                        const CreatedParticle = tptw.CreateParticle(tptw.GetElement(Particle.Name), Particle.PosX, Particle.PosY);
                        CreatedParticle.dataset.temp = Particle.Temp;
                    });
                } catch (error) {
                    return;
                }
            };
            Reader.readAsText(File);
        }
    });

    Input.click(); 
}

SaveButton.addEventListener("click", SaveToFile);
LoadButton.addEventListener("click", LoadFromFile);