import { Theme } from "./theme.js";
import { Settings } from "./settings.js";
import * as tptw from "./tptw.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const ParticleContainer = document.getElementById("ParticleContainer");

const BrowserContainer = document.createElement("div");
BrowserContainer.style.fontSize = "100%";
BrowserContainer.style.width = "60%";
BrowserContainer.style.height = "75%";
BrowserContainer.style.position = "absolute";
BrowserContainer.style.top = "50%";
BrowserContainer.style.left = "50%";
BrowserContainer.style.backgroundColor = Theme.BackgroundColor;
BrowserContainer.style.visibility = "hidden";
BrowserContainer.style.transform = "translate(-50%, -50%)";
BrowserContainer.style.alignContent = "center";
BrowserContainer.style.alignItems = "center";
BrowserContainer.id = "BrowserContainer";
document.body.appendChild(BrowserContainer);

const BrowserTitlebar = document.createElement("div");
BrowserTitlebar.innerHTML = `ThePowderToyWeb Browser ${Settings.Version}`;
BrowserTitlebar.style.position = "absolute";
BrowserTitlebar.style.top = "0";
BrowserTitlebar.style.width = "100%";
BrowserTitlebar.style.height = "24px";
BrowserTitlebar.style.alignContent = "center";
BrowserTitlebar.style.alignItems = "center";
BrowserTitlebar.style.textAlign = "center";
BrowserTitlebar.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
BrowserContainer.appendChild(BrowserTitlebar);

const BrowserAddressbar = document.createElement("input");
BrowserAddressbar.style.width = "100%";
BrowserAddressbar.style.height = "24px";
BrowserAddressbar.style.position = "absolute";
BrowserAddressbar.style.top = "24px";
BrowserAddressbar.style.width = "100%";
BrowserAddressbar.style.height = "24px";
BrowserAddressbar.style.alignContent = "center";
BrowserAddressbar.style.alignItems = "center";
BrowserAddressbar.style.textAlign = "center";
BrowserAddressbar.style.backgroundColor = "rgba(255, 255, 255, 0.1)";
BrowserAddressbar.placeholder = "eg. 1992731";
BrowserContainer.appendChild(BrowserAddressbar);

const SavesContainer = document.createElement("div");
SavesContainer.style.display = "flex";
SavesContainer.style.flexDirection = "row";
SavesContainer.style.justifyContent = "center";
SavesContainer.style.alignContent = "center";
SavesContainer.style.alignItems = "center";
SavesContainer.style.width = "100%";
SavesContainer.style.height = "75%";
SavesContainer.style.overflow = "hidden";
BrowserContainer.appendChild(SavesContainer);

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
Buttons.style.width = "100%";
Buttons.style.height = "32px";
Buttons.id = "Buttons";
document.body.appendChild(Buttons);

const BrowseButton = document.createElement("div");
BrowseButton.innerHTML = "BROWSE";
BrowseButton.classList.add("BTN");
BrowseButton.style.color = Theme.TertiaryColor;
BrowseButton.style.fontSize = "100%";
BrowseButton.style.height = "100%";
BrowseButton.style.width = "100%";
BrowseButton.style.alignContent = "center";
BrowseButton.style.alignItems = "center";
Buttons.appendChild(BrowseButton);

const SaveCloudButton = document.createElement("div");
SaveCloudButton.innerHTML = "UPLOAD";
SaveCloudButton.classList.add("BTN");
SaveCloudButton.style.color = Theme.TertiaryColor;
SaveCloudButton.style.height = "100%";
SaveCloudButton.style.width = "100%";
SaveCloudButton.style.alignContent = "center";
SaveCloudButton.style.alignItems = "center";
Buttons.appendChild(SaveCloudButton);

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

const PublicityButton = document.createElement("div");
PublicityButton.innerHTML = "PUBLIC";
PublicityButton.classList.add("BTN");
PublicityButton.style.color = Theme.TertiaryColor;
PublicityButton.style.width = "100%";
PublicityButton.style.height = "100%";
PublicityButton.style.textAlign = "center";
PublicityButton.style.alignContent = "center";
PublicityButton.id = "PublicityButton";
Buttons.appendChild(PublicityButton);

export const NameButton = document.createElement("input");
NameButton.autocomplete = "false";
NameButton.type = "text";
NameButton.placeholder = "Simulation Name";
NameButton.style.width = "200%";
NameButton.style.height = "100%";
NameButton.style.textAlign = "center";
NameButton.classList.add("ENC");
NameButton.id = "NameButton";
Buttons.appendChild(NameButton);

export const UsernameButton = document.createElement("input");
UsernameButton.autocomplete = "false";
UsernameButton.type = "text";
UsernameButton.placeholder = "Username";
UsernameButton.style.width = "200%";
UsernameButton.style.height = "100%";
UsernameButton.style.textAlign = "center";
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
}

async function SaveToFirebase() {
    if (!UsernameButton.value || !NameButton.value) {
        UsernameButton.style.backgroundColor = !UsernameButton.value ? "rgba(255, 0, 0, 0.15)" : "transparent";
        NameButton.style.backgroundColor = !NameButton.value ? "rgba(255, 0, 0, 0.15)" : "transparent";

        setTimeout(() => {
            UsernameButton.style.backgroundColor = "transparent";
            NameButton.style.backgroundColor = "transparent";
        }, 250);

        return;
    } else {
        UsernameButton.style.backgroundColor = "transparent";
        NameButton.style.backgroundColor = "transparent";
    }

    const Username = UsernameButton.value;
    const SimulationName = NameButton.value;

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

    function FormatDate(date) {
        const Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    
        const Day = String(date.getDate());
        const Month = Months[date.getMonth()].slice(0, 3);
        const Year = date.getFullYear();
        const Minutes = String(date.getMinutes()).padStart(2, '0');
        const Hours = String(date.getHours()).padStart(2, '0');
    
        return `${Day} ${Month} ${Year}, ${Hours}:${Minutes}`;
    }
    
    const CurrentDate = new Date();

    const DocumentData = {
        username: Username,
        simulationName: SimulationName,
        particles: Particles,
        timestamp: FormatDate(CurrentDate),
        public: CurrentPublicity,
        saveId: Array.from({length: 8}, () => 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'.charAt(Math.floor(Math.random() * 62))).join('').toUpperCase()
    };

    Array.from(ParticleContainer.getElementsByTagName("div")).forEach(Particle => {
        const ParticleMetadata = {
            Name: Particle.id,
            Temp: parseFloat(Particle.dataset.temp),
            PosX: Particle.offsetLeft,
            PosY: Particle.offsetTop,
        };
    
        DocumentData.particles.push(ParticleMetadata);
    });

    const savesCollection = collection(Db, 'saves');
    const docRef = await addDoc(savesCollection, DocumentData);
    if (!CurrentPublicity) {
      await navigator.clipboard.writeText(docRef.id);
    }
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

let CurrentPage = 1;
let CurrentPublicity = true;
const SavesPerPage = 9;

async function LoadSaves(Page = 1) {
    SavesContainer.innerHTML = "LOADING";

    const SavesCollection = collection(Db, 'saves');
    const SavesSnapshot = await getDocs(SavesCollection);
    
    const SavesList = SavesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));

    const TotalPages = Math.ceil(SavesList.length / SavesPerPage);
    CurrentPage = Math.max(1, Math.min(Page, TotalPages));

    const PaginatedSaves = SavesList.slice((CurrentPage - 1) * SavesPerPage, CurrentPage * SavesPerPage);

    if (PaginatedSaves.length > 0) {
        SavesContainer.innerHTML = "";
        SavesContainer.style.display = "flex";
        SavesContainer.style.flexWrap = "wrap";
        SavesContainer.style.gap = "5px";

        PaginatedSaves.forEach(Save => {
            if (!Save.public) { return; }

            const Username = Save.username;
            const SimulationName = Save.simulationName;
            const Particles = Save.particles;
            const Timestamp = Save.timestamp;
    
            const SaveButton = document.createElement("div");
            SaveButton.style.display = "flex";
            SaveButton.style.flexDirection = "column";
            SaveButton.style.position = "relative";
            SaveButton.style.width = "30%";
            SaveButton.style.height = "25%";
            SaveButton.style.backgroundColor = "rgb(60, 60, 60)";
            SaveButton.style.cursor = "pointer";
            SaveButton.style.boxSizing = "border-box";
            SaveButton.style.padding = "10px";
            SaveButton.style.overflow = "hidden";
            SaveButton.classList.add("SAVE");
            SavesContainer.appendChild(SaveButton);
    
            const Author = document.createElement("i");
            Author.innerHTML = Username;
            Author.style.fontSize = "75%";
            Author.style.marginBottom = "8px";
            SaveButton.appendChild(Author);
    
            const SaveName = document.createElement("span");
            SaveName.innerHTML = SimulationName;
            SaveName.style.display = "block";
            SaveButton.appendChild(SaveName);

            const TimestampLabel = document.createElement("span");
            TimestampLabel.innerHTML = Timestamp;
            TimestampLabel.style.display = "block";
            SaveButton.appendChild(TimestampLabel);

            const IdLabel = document.createElement("span");
            IdLabel.innerHTML = Save.id;
            IdLabel.style.position = "absolute";
            IdLabel.style.color = "rgb(255, 255, 0)";
            IdLabel.style.bottom = "4px";
            IdLabel.style.left = "8px";
            SaveButton.appendChild(IdLabel);

            const RemoveButton = document.createElement("span");
            RemoveButton.innerHTML = "X";
            RemoveButton.style.color = "red";
            RemoveButton.style.cursor = "pointer";
            RemoveButton.style.fontSize = "100%";
            RemoveButton.style.position = "absolute";
            RemoveButton.style.right = "8px";
            RemoveButton.style.top = "4px";
            SaveButton.appendChild(RemoveButton);

            IdLabel.addEventListener("click", () => {
                navigator.clipboard.writeText(Save.id);
            });

            RemoveButton.addEventListener("click", async () => {
                try {
                    await deleteDoc(doc(Db, "saves", Save.id));
                    SaveButton.remove();
                    await LoadSaves(CurrentPage);
                } catch (e) {
                    console.error(`Error removing save: ${Save.id}, ${e}`);
                }
            });
    
            SaveButton.addEventListener("click", (Event) => {
                if (Event.target !== RemoveButton && Event.target !== IdLabel) {
                    BrowserContainer.style.visibility = "hidden";
                    ParticleContainer.innerHTML = "";
                    Particles.forEach(Particle => {
                        const Element = tptw.GetElement(Particle.Name);
                        tptw.CreateParticle(Element, Particle.PosX, Particle.PosY).dataset.temp = Particle.Temp;
                    });
                } else if (Event.target === IdLabel) {
                    IdLabel.innerHTML = "Copied";
                    setTimeout(() => {
                        IdLabel.innerHTML = Save.id;
                    }, 1000);
                }
            });
        });

        AddPaginationControls(TotalPages);
    } else {
        SavesContainer.innerHTML = "NO DATA FOUND";
    }
}

async function LoadSave(SaveId) {
    if (!SaveId.startsWith("-")) {return;}

    const DocRef = doc(Db, "saves", SaveId.replace("-", ""));
    const DocSnap = await getDoc(DocRef);
    if (DocSnap.exists()) {
        BrowserContainer.style.visibility = "hidden";
        const DocumentData = DocSnap.data();
        const Particles = DocumentData.particles;
        ParticleContainer.innerHTML = "";
        Particles.forEach(Particle => {
            const Element = tptw.GetElement(Particle.Name);
            const CreatedParticle = tptw.CreateParticle(Element, Particle.PosX, Particle.PosY);
            CreatedParticle.dataset.temp = Particle.Temp;
        });
    }
}

function AddPaginationControls(TotalPages) {
    const ExistingControls = document.querySelector(".pagination-controls");
    if (ExistingControls) {
        ExistingControls.remove();
    }

    if (TotalPages > 1) {
        const ControlsContainer = document.createElement("div");
        ControlsContainer.className = "pagination-controls";
        ControlsContainer.style.textAlign = "center";
        ControlsContainer.style.marginTop = "10px";

        const PreviousButton = document.createElement("div");
        PreviousButton.innerHTML = "Previous";
        PreviousButton.style.cursor = "pointer";
        PreviousButton.setAttribute("disabled", CurrentPage === 1)
        PreviousButton.addEventListener("click", () => LoadSaves(CurrentPage - 1));
        PreviousButton.classList.add("ABTN");
        ControlsContainer.appendChild(PreviousButton);

        const PageInfo = document.createElement("span");
        PageInfo.innerHTML = `Page ${CurrentPage} of ${TotalPages}`;
        ControlsContainer.appendChild(PageInfo);

        const NextButton = document.createElement("div");
        NextButton.innerHTML = "Next";
        NextButton.style.cursor = "pointer";
        NextButton.setAttribute("disabled", CurrentPage === TotalPages)
        NextButton.addEventListener("click", () => LoadSaves(CurrentPage + 1));
        NextButton.classList.add("ABTN");
        ControlsContainer.appendChild(NextButton);

        BrowserContainer.appendChild(ControlsContainer);
    }
}

function HandleLoadSave(Event) {
    if (Event.key === "Enter") {
        LoadSave(BrowserAddressbar.value);
    }
}
 
function Browse() {
    LoadSaves();
    BrowserContainer.style.visibility = getComputedStyle(BrowserContainer).visibility === "visible" ? "hidden" : "visible";
}

function TogglePublicity() {
    CurrentPublicity = !CurrentPublicity;
    PublicityButton.innerHTML = !CurrentPublicity ? "PRIVATE" : "PUBLIC";
}

BrowserAddressbar.addEventListener("keypress", HandleLoadSave);
PublicityButton.addEventListener("click", TogglePublicity);
BrowseButton.addEventListener("click", Browse);
SaveCloudButton.addEventListener("click", SaveToFirebase);
SaveButton.addEventListener("click", SaveToFile);
LoadButton.addEventListener("click", LoadFromFile);