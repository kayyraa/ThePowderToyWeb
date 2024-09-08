import { Theme } from "./theme.js";
import * as tptw from "./tptw.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const ParticleContainer = document.getElementById("ParticleContainer");

const BrowserContainer = document.createElement("div");
BrowserContainer.style.display = "flex";
BrowserContainer.style.flexDirection = "row";
BrowserContainer.style.justifyContent = "center";
BrowserContainer.style.alignContent = "center";
BrowserContainer.style.alignItems = "center";
BrowserContainer.style.fontSize = "24px";
BrowserContainer.style.width = "60%";
BrowserContainer.style.height = "75%";
BrowserContainer.style.position = "absolute";
BrowserContainer.style.top = "50%";
BrowserContainer.style.left = "50%";
BrowserContainer.style.backgroundColor = Theme.BackgroundColor;
BrowserContainer.style.borderRadius = "8px";
BrowserContainer.style.border = "2px solid white";
BrowserContainer.style.visibility = "hidden";
BrowserContainer.style.transform = "translate(-50%, -50%)";
BrowserContainer.id = "BrowserContainer";
document.body.appendChild(BrowserContainer);

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
Buttons.style.borderTopRightRadius = "8px";
Buttons.id = "Buttons";
document.body.appendChild(Buttons);

const BrowseButton = document.createElement("div");
BrowseButton.innerHTML = "BROWSE";
BrowseButton.classList.add("BTN");
BrowseButton.style.color = Theme.TertiaryColor;
BrowseButton.style.height = "100%";
BrowseButton.style.width = "100%";
BrowseButton.style.alignContent = "center";
BrowseButton.style.alignItems = "center";
Buttons.appendChild(BrowseButton);

const SaveButton = document.createElement("div");
SaveButton.innerHTML = "SAVE";
SaveButton.classList.add("BTN");
SaveButton.style.color = Theme.TertiaryColor;
SaveButton.style.height = "100%";
SaveButton.style.width = "100%";
SaveButton.style.alignContent = "center";
SaveButton.style.alignItems = "center";
Buttons.appendChild(SaveButton);

const LoadButton = document.createElement("div");
LoadButton.innerHTML = "LOAD";
LoadButton.classList.add("BTN");
LoadButton.style.color = Theme.TertiaryColor;
LoadButton.style.height = "100%";
LoadButton.style.width = "100%";
LoadButton.style.alignContent = "center";
LoadButton.style.alignItems = "center";
Buttons.appendChild(LoadButton);

export const NameButton = document.createElement("input");
NameButton.autocomplete = false;
NameButton.type = "text";
NameButton.placeholder = "Simulation Name";
NameButton.style.width = "200%";
NameButton.style.height = "100%";
NameButton.style.textAlign = "center";
NameButton.classList.add("ENC");
NameButton.id = "NameButton";
Buttons.appendChild(NameButton);

export const UsernameButton = document.createElement("input");
UsernameButton.autocomplete = false;
UsernameButton.type = "text";
UsernameButton.placeholder = "Username";
UsernameButton.style.width = "200%";
UsernameButton.style.height = "100%";
UsernameButton.style.textAlign = "center";
UsernameButton.style.borderTopRightRadius = "8px";
UsernameButton.classList.add("ENC");
UsernameButton.id = "UsernameButton";
Buttons.appendChild(UsernameButton);

const ParticleData = [];

const FirebaseConfig = {
  apiKey: "AIzaSyCWcUsQWn4xNSrZ5wQIdvJSeS1qr3KMCLo",
  authDomain: "thepowdertoy-750c7.firebaseapp.com",
  databaseURL: "https://thepowdertoy-750c7-default-rtdb.firebaseio.com",
  projectId: "thepowdertoy-750c7",
  storageBucket: "thepowdertoy-750c7.appspot.com",
  messagingSenderId: "860529669764",
  appId: "1:860529669764:web:50d0c59b170e8ae1e6b4d1",
  measurementId: "G-TBC2KPQMS4"
};

const App = initializeApp(FirebaseConfig);
const Db = getFirestore(App);

function GenerateUsername() {
    const Letters = "abcdefghijklmnopqrstuvwxyz";
    let Username = "";
    for (let i = 0; i < 8; i++) {
        Username += Letters[Math.floor(Math.random() * Letters.length)];
    }
    return Username;
}

function SaveToFile() {
    ParticleData.push(NameButton.value);

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
    A.download = `${NameButton.value != "" ? NameButton.value : "UntitledSimulation"}.json`;
    A.click();
    URL.revokeObjectURL(Url);

    SaveToFirebase();
}

function SaveToFirebase() {
    const Username = UsernameButton.value === "" ? GenerateUsername() : UsernameButton.value;
    const SimulationName = NameButton.value || "UntitledSimulation";

    var Particles = [];

    Array.from(ParticleContainer.getElementsByTagName("div")).forEach(Particle => {
        const ParticleMetadata = {
            Name: Particle.id,
            Temp: parseFloat(Particle.dataset.temp),
            PosX: Particle.offsetLeft,
            PosY: Particle.offsetTop,
        };
    
        Particles.push(ParticleMetadata);
    });

    const ParticleDataToSave = {
        username: Username,
        simulationName: SimulationName,
        particles: Particles
    };

    Array.from(ParticleContainer.getElementsByTagName("div")).forEach(Particle => {
        const ParticleMetadata = {
            Name: Particle.id,
            Temp: parseFloat(Particle.dataset.temp),
            PosX: Particle.offsetLeft,
            PosY: Particle.offsetTop,
        };
    
        ParticleDataToSave.particles.push(ParticleMetadata);
    });

    const savesCollection = collection(Db, 'saves');
    addDoc(savesCollection, ParticleDataToSave).catch((error) => {
        console.error('Error saving to Firebase: ', error);
    });
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
                    NameButton.value = JSON.parse(e.target.result)[0];

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

async function LoadSaves() {
    BrowserContainer.innerHTML = "";

    const SavesCollection = collection(Db, 'saves');
    const SavesSnapshot = await getDocs(SavesCollection);
    
    const SavesList = SavesSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    if (SavesList.length > 0) {
        BrowserContainer.innerHTML = "";

        SavesList.forEach(Save => {
            const Username = Save.username;
            const SimulationName = Save.simulationName;
            const Particles = Save.particles;
    
            const SaveButton = document.createElement("div");
            SaveButton.style.display = "flex";
            SaveButton.style.flexDirection = "column";
            SaveButton.style.position = "relative";
            SaveButton.style.width = "30%";
            SaveButton.style.height = "25%";
            SaveButton.style.backgroundColor = Theme.BackgroundColor;
            SaveButton.style.marginLeft = "20px";
            SaveButton.style.borderRadius = "8px";
            BrowserContainer.appendChild(SaveButton);
    
            const Author = document.createElement("i");
            Author.innerHTML = Username;
            Author.style.fontSize = "16px";
            Author.style.marginTop = "8px";
            Author.style.marginLeft = "8px";
            SaveButton.appendChild(Author);
    
            const SaveName = document.createElement("span");
            SaveName.innerHTML = SimulationName;
            SaveName.style.marginLeft = "8px";
            SaveButton.appendChild(SaveName);

            const RemoveButton = document.createElement("span");
            RemoveButton.innerHTML = "X";
            RemoveButton.style.color = "red";
            RemoveButton.style.cursor = "pointer";
            RemoveButton.style.fontSize = "32px";
            RemoveButton.style.position = "absolute";
            RemoveButton.style.left = `${SaveButton.offsetWidth - 22}px`;
            SaveButton.appendChild(RemoveButton);

            RemoveButton.addEventListener("click", () => {
                try {
                    const DocRef = doc(Db, "saves", Save.id);
                    deleteDoc(DocRef);
                    SaveButton.remove();
                } catch (e) {
                    console.error(`Error removing save: ${Save.id}, ${e}`);
                }
            });
    
            SaveButton.addEventListener("click", () => {
                Particles.forEach(Particle => {
                    const Element = tptw.GetElement(Particle.Name);
                    tptw.CreateParticle(Element, Particle.PosX, Particle.PosY);
                });
            });
        });
    } else {
        BrowserContainer.innerHTML = "NO SAVES";
    }
}

function Browse() {
    LoadSaves();
    BrowserContainer.style.visibility = getComputedStyle(BrowserContainer).visibility === "visible" ? "hidden" : "visible";
}

BrowseButton.addEventListener("click", Browse);
SaveButton.addEventListener("click", SaveToFile);
LoadButton.addEventListener("click", LoadFromFile);