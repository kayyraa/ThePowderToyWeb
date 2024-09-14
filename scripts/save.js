import { Theme } from "./theme.js";
import { Settings } from "./settings.js";
import * as sc from "./hud.js";
import * as tptw from "./tptw.js";

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, getDoc, deleteDoc, doc, setDoc, query, where } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

var LocalId = undefined;
var CurrentPublicity = true;

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

const UsersCollection = collection(Db, "users");
const SavesCollection = collection(Db, 'saves');

async function json(url) {
    return fetch(url).then(res => res.json());
}

async function CheckUserDoc() {
    const IP = await json(`https://api.ipdata.co?api-key=b1bf8f09e6f8fd273c85562c3adf823f22cb40a5d06762baba6cd04b`).then(data => {
        return data.ip;
    });
    if (!IP) return;

    LocalId = IP;

    const UserDocRef = doc(UsersCollection, IP);
    const DocSnapshot = await getDoc(UserDocRef);

    if (!DocSnapshot.exists()) {
        setDoc(UserDocRef, {
            register: Math.floor(Date.now() / 1000),
            ip: IP
        });
    }
}

const ParticleContainer = document.getElementById("ParticleContainer");

const BrowserContainer = document.createElement("div");
BrowserContainer.style.width = "75%";
BrowserContainer.style.height = "75%";
BrowserContainer.style.position = "absolute";
BrowserContainer.style.top = "50%";
BrowserContainer.style.left = "50%";
BrowserContainer.style.backgroundColor = "rgb(40, 40, 40)";
BrowserContainer.style.visibility = "hidden";
BrowserContainer.style.transform = "translate(-50%, -50%)";
BrowserContainer.style.alignContent = "center";
BrowserContainer.style.alignItems = "center";
BrowserContainer.style.overflow = "hidden";
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
BrowserTitlebar.style.backgroundColor = "rgb(50, 50, 50)";
BrowserContainer.appendChild(BrowserTitlebar);

const BrowserAddressbar = document.createElement("input");
BrowserAddressbar.classList.add("BrowserAddressbar");
BrowserAddressbar.placeholder = "eg. 1992731";
BrowserAddressbar.style.backgroundColor = "rgb(50, 50, 50)";
BrowserContainer.appendChild(BrowserAddressbar);

const SavesContainer = document.createElement("div");
SavesContainer.classList.add("SavesContainer");
BrowserContainer.appendChild(SavesContainer);

export const Buttons = document.createElement("div");
Buttons.classList.add("Buttons");
Buttons.style.backgroundColor = Theme.BackgroundColor;
Buttons.id = "Buttons";
document.body.appendChild(Buttons);

const BrowseButton = document.createElement("div");
BrowseButton.innerHTML = "BROWSE";
BrowseButton.classList.add("BTN");
BrowseButton.style.color = Theme.TertiaryColor;
Buttons.appendChild(BrowseButton);

const SaveCloudButton = document.createElement("div");
SaveCloudButton.innerHTML = "UPLOAD";
SaveCloudButton.classList.add("BTN");
SaveCloudButton.style.color = Theme.TertiaryColor;
Buttons.appendChild(SaveCloudButton);

const SaveButton = document.createElement("div");
SaveButton.innerHTML = "SAVE";
SaveButton.classList.add("BTN");
SaveButton.style.color = Theme.TertiaryColor;
Buttons.appendChild(SaveButton);

const LoadButton = document.createElement("div");
LoadButton.innerHTML = "LOAD";
LoadButton.classList.add("BTN");
LoadButton.style.color = Theme.TertiaryColor;
Buttons.appendChild(LoadButton);

const PublicityButton = document.createElement("div");
PublicityButton.innerHTML = "PUBLIC";
PublicityButton.classList.add("BTN");
PublicityButton.style.color = Theme.TertiaryColor;
PublicityButton.id = "PublicityButton";
Buttons.appendChild(PublicityButton);

export const NameButton = document.createElement("input");
NameButton.autocomplete = "off";
NameButton.type = "text";
NameButton.placeholder = "Simulation Name";
NameButton.classList.add("ENC");
NameButton.id = "NameButton";
Buttons.appendChild(NameButton);

export const UsernameButton = document.createElement("input");
UsernameButton.autocomplete = "off";
UsernameButton.type = "text";
UsernameButton.placeholder = "Username";
UsernameButton.classList.add("ENC");
UsernameButton.id = "UsernameButton";
Buttons.appendChild(UsernameButton);

const ParticleData = [];

export function SaveToFile() {
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
    }

    UsernameButton.style.backgroundColor = "transparent";
    NameButton.style.backgroundColor = "transparent";

    const Username = UsernameButton.value;
    const SimulationName = NameButton.value;

    const Particles = Array.from(ParticleContainer.getElementsByTagName("div")).map(Particle => ({
        Name: Particle.id,
        Temp: parseFloat(Particle.dataset.temp),
        PosX: Particle.offsetLeft,
        PosY: Particle.offsetTop,
    }));

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
        localId: LocalId,
        description: ""
    };

    const DocRef = await addDoc(SavesCollection, DocumentData);
    if (!CurrentPublicity) {
        await navigator.clipboard.writeText(DocRef.id);
    }
}

function LoadFromFile() {
    const Input = document.createElement("input");
    Input.type = "file";
    Input.accept = ".json";
    
    Input.addEventListener("change", (event) => {        
        const File = event.target.files[0];
        if (File) {
            if (!File.name.endsWith(".json")) {
                tptw.Notify("Load From File Error", "Cannot load file: Incorrect file type.", "../images/MessageBox/Error.svg");
                return;
            }

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
const SavesPerPage = 6;

var RemoveButtons = [];
var SaveButtons = [];

function CreateSaveButton(Save, Page) {
    if (!Save.public) return;

    let ClickCount = 0;

    const Username = Save.username;
    const SimulationName = Save.simulationName;
    const Particles = Save.particles;
    const Timestamp = Save.timestamp;
    const SaveId = String(Save.localId).trim();

    const SaveButton = document.createElement("div");
    SaveButton.style.display = "flex";
    SaveButton.style.flexDirection = "column";
    SaveButton.style.position = "relative";
    SaveButton.style.cursor = "pointer";
    SaveButton.style.boxSizing = "border-box";
    SaveButton.style.padding = "10px";
    SaveButton.style.overflow = "hidden";
    SaveButton.classList.add("SAVE");
    SavesContainer.appendChild(SaveButton);
    SaveButtons.push(SaveButton);

    const Author = document.createElement("i");
    Author.innerHTML = Username;
    Author.style.fontSize = "75%";
    SaveButton.appendChild(Author);

    const SaveName = document.createElement("span");
    SaveName.innerHTML = SimulationName;
    SaveName.style.display = "block";
    SaveButton.appendChild(SaveName);

    const TimestampLabel = document.createElement("span");
    TimestampLabel.innerHTML = Timestamp;
    TimestampLabel.style.display = "block";
    TimestampLabel.style.fontSize = "13px";
    SaveButton.appendChild(TimestampLabel);

    const DescriptionLabel = document.createElement("span");
    DescriptionLabel.innerHTML = Save.description !== undefined ? Save.description : "";
    DescriptionLabel.style.display = "block";
    DescriptionLabel.style.fontSize = "22px";
    DescriptionLabel.style.color = "rgb(120, 120, 120)";
    DescriptionLabel.style.visibility = "hidden";
    SaveButton.appendChild(DescriptionLabel);

    const ThumbnailPhoto = document.createElement("div");
    ThumbnailPhoto.style.position = "relative";
    ThumbnailPhoto.style.overflow = "hidden";
    ThumbnailPhoto.style.visibility = "hidden";
    ThumbnailPhoto.style.width = "75%";
    ThumbnailPhoto.style.height = "100%";
    ThumbnailPhoto.style.alignSelf = "center";
    ThumbnailPhoto.style.backgroundColor = "rgba(40, 40, 40)";
    ThumbnailPhoto.style.boxSizing = "border-box";
    ThumbnailPhoto.style.border = "3px solid black";
    SaveButton.appendChild(ThumbnailPhoto);

    const ThumbnailWidth = ThumbnailPhoto.offsetWidth;
    const ThumbnailHeight = ThumbnailPhoto.offsetHeight;

    const OriginalCanvasWidth = ParticleContainer.offsetWidth / 2;
    const OriginalCanvasHeight = ParticleContainer.offsetHeight / 2;

    const ScaleFactorX = ThumbnailWidth / OriginalCanvasWidth;
    const ScaleFactorY = ThumbnailHeight / OriginalCanvasHeight;

    const ScaleFactor = Math.min(ScaleFactorX, ScaleFactorY);

    const OffsetX = (ThumbnailWidth - (OriginalCanvasWidth * ScaleFactor)) / 2;
    const OffsetY = (ThumbnailHeight - (OriginalCanvasHeight * ScaleFactor)) / 2;

    Particles.forEach(Particle => {
        const Container = document.createElement("div");
        Container.style.position = "absolute";
        Container.style.width = "100%";
        Container.style.height = "100%";
        ThumbnailPhoto.appendChild(Container);

        const GeneratedParticle = document.createElement("div");
        const GridSize = parseFloat(document.body.getAttribute("grid-size"));

        const PosX = Particle.PosX * ScaleFactor + OffsetX;
        const PosY = Particle.PosY * ScaleFactor + OffsetY;
    
        GeneratedParticle.style.backgroundColor = tptw.GetElement(Particle.Name).Color;
        GeneratedParticle.style.position = "absolute";
        GeneratedParticle.style.left = `${PosX}px`;
        GeneratedParticle.style.top = `${PosY}px`;
        GeneratedParticle.style.width = `${GridSize * ScaleFactor}px`;
        GeneratedParticle.style.aspectRatio = "1 / 1";
        Container.appendChild(GeneratedParticle);
    });

    const DescriptionInput = document.createElement("textarea");
    DescriptionInput.style.width = "75%";
    DescriptionInput.style.height = "50%";
    DescriptionInput.style.marginTop = "2%";
    DescriptionInput.style.visibility = "hidden";
    DescriptionInput.style.alignSelf = "center";
    DescriptionInput.value = Save.description || "";
    DescriptionInput.placeholder = "Description here...";
    SaveButton.appendChild(DescriptionInput);

    const SaveChangesButton = document.createElement("div");
    SaveChangesButton.innerHTML = "Save Changes";
    SaveChangesButton.classList.add("BUTTON");
    SaveChangesButton.style.visibility = "hidden";
    SaveButton.appendChild(SaveChangesButton);

    const OpenSaveButton = document.createElement("div");
    OpenSaveButton.innerHTML = "Open Save";
    OpenSaveButton.classList.add("BUTTON");
    OpenSaveButton.style.visibility = "hidden";
    SaveButton.appendChild(OpenSaveButton);

    const IdLabel = document.createElement("span");
    IdLabel.innerHTML = Save.id;
    IdLabel.style.position = "absolute";
    IdLabel.style.color = "rgb(255, 255, 0)";
    IdLabel.style.bottom = "4px";
    IdLabel.style.left = "8px";
    SaveButton.appendChild(IdLabel);

    const RemoveButton = document.createElement("span");
    RemoveButton.innerHTML = "REMOVE";
    RemoveButton.classList.add("RemoveButton");
    RemoveButton.style.color = "red";
    RemoveButton.style.cursor = "pointer";
    RemoveButton.style.fontSize = "100%";
    RemoveButton.style.position = "absolute";
    RemoveButton.style.alignSelf = "center";
    RemoveButton.style.top = "4px";
    RemoveButton.style.visibility = getComputedStyle(BrowserContainer).visibility === "visible" ? SaveId === LocalId ? "visible" : "hidden" : "hidden";
    SaveButton.appendChild(RemoveButton);
    RemoveButtons.push(RemoveButton);

    const CloseButton = document.createElement("span");
    CloseButton.innerHTML = "X";
    CloseButton.style.color = "red";
    CloseButton.style.cursor = "pointer";
    CloseButton.style.fontSize = "100%";
    CloseButton.style.position = "absolute";
    CloseButton.style.right = "8px";
    CloseButton.style.top = "4px";
    CloseButton.style.visibility = "hidden";
    SaveButton.appendChild(CloseButton);

    IdLabel.addEventListener("click", () => {
        navigator.clipboard.writeText(Save.id);
    });

    RemoveButton.addEventListener("click", async () => {
        await deleteDoc(doc(Db, "saves", Save.id));
        SaveButton.remove();
        await LoadSaves(CurrentPage, {
            Forload: false
        });
    });

    SaveButton.addEventListener("click", function(Event) {
        if (
            Event.target !== RemoveButton && 
            Event.target !== IdLabel && 
            Event.target !== DescriptionInput &&
            Event.target !== SaveChangesButton &&
            Event.target !== OpenSaveButton
        ) {
            if (ClickCount !== 1) {
                ClickCount++
            }

            CloseButton.style.visibility = ClickCount === 1 ? getComputedStyle(BrowserContainer).visibility === "visible" ? "visible" : "hidden" : "hidden";
            ThumbnailPhoto.style.visibility = ClickCount === 1 ? getComputedStyle(BrowserContainer).visibility === "visible" ? "visible" : "hidden" : "hidden";
            DescriptionLabel.style.visibility = ClickCount === 1 ? getComputedStyle(BrowserContainer).visibility === "visible" ? "visible" : "hidden" : "hidden";
            OpenSaveButton.style.visibility = ClickCount === 1 ? getComputedStyle(BrowserContainer).visibility === "visible" ? "visible" : "hidden" : "hidden";

            DescriptionInput.style.visibility = ClickCount === 1 ? getComputedStyle(BrowserContainer).visibility === "visible" ? SaveId === LocalId ? "visible" : "hidden" : "hidden" : "hidden";
            SaveChangesButton.style.visibility = ClickCount === 1 ? getComputedStyle(BrowserContainer).visibility === "visible" ? SaveId === LocalId ? "visible" : "hidden" : "hidden" : "hidden";

            if (ClickCount === 1) {
                this.style.position = "absolute";
                this.style.height = "75%";
                this.style.width = "75%";
                this.style.zIndex = "1";
                IdLabel.style.visibility = "hidden";

                SaveButtons.forEach(SaveButton => {
                    if (this !== SaveButton) {
                        SaveButton.style.opacity = "0";
                    }
                });
            } else {
                ClickCount = 0
            }
        } else if (Event.target === IdLabel) {
            IdLabel.innerHTML = "Copied";
            setTimeout(() => {
                IdLabel.innerHTML = Save.id;
            }, 1000);
        }
    });

    SaveChangesButton.addEventListener("click", async () => {
        const Description = DescriptionInput.value !== "" ? DescriptionInput.value : "";
    
        try {
            const docRef = doc(Db, "saves", Save.id);
            await setDoc(docRef, {
                description: Description
            }, { merge: true });
            LoadSaves(Page, {
                Forload: false
            });
        } catch (error) {
            console.error("Error updating document: ", error);
        }
    });

    CloseButton.addEventListener("click", () => {
        LoadSaves(Page, {
            Forload: false
        });
    });
    
    OpenSaveButton.addEventListener("click", () => {
        SaveButton.style.height = "25%";
        SaveButton.style.width = "30%";
        SaveButton.style.zIndex = "0";
        SaveButton.style.opacity = "0";

        ThumbnailPhoto.style.visibility = "hidden";
        SaveButton.style.visibility = "hidden";
        SaveChangesButton.style.visibility = "hidden";
        OpenSaveButton.style.visibility = "hidden";
        BrowserContainer.style.visibility = "hidden";
        ParticleContainer.innerHTML = "";

        Particles.forEach(Particle => {
            const Element = tptw.GetElement(Particle.Name);
            tptw.CreateParticle(Element, Particle.PosX, Particle.PosY).dataset.temp = Particle.Temp;
        });

        UsernameButton.value = Username;
        NameButton.value = SimulationName;

        RemoveButtons.forEach(RemoveButton => {
            RemoveButton.style.visibility = "hidden";
        });
        Array.from(Buttons.getElementsByTagName("div")).forEach(Button => {
            if (Button !== BrowseButton) {
                Button.setAttribute("disabled", true);
            }
        });
        Array.from(Buttons.getElementsByTagName("input")).forEach(Button => {
            Button.disabled = true;
        });
    });
}

async function LoadSaves(Page = 1, {Forload = false}) {
    SavesContainer.innerHTML = "LOADING";

    RemoveButtons = [];
    SaveButtons = [];

    const SavesCollectionRef = collection(Db, 'saves');
    const SavesSnapshot = await getDocs(SavesCollectionRef);
    
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
            if (Forload) {
                if (Save.localId === LocalId) {
                    CreateSaveButton(Save, Page);
                }
            } else {
                CreateSaveButton(Save, Page);
            }
        });

        AddPaginationControls(TotalPages);
    } else {
        SavesContainer.innerHTML = "NO DATA FOUND";
    }
}

function AddPaginationControls(TotalPages) {
    const ExistingControls = document.querySelector(".pagination-controls");
    if (ExistingControls) {
        ExistingControls.remove();
    }

    const ControlsContainer = document.createElement("div");
    ControlsContainer.className = "pagination-controls";
    ControlsContainer.style.textAlign = "center";
    ControlsContainer.style.marginTop = "10px";
    BrowserContainer.appendChild(ControlsContainer);

    const ReloadButton = document.createElement("div");
    ReloadButton.innerHTML = "Reload";
    ReloadButton.style.cursor = "pointer";
    ReloadButton.addEventListener("click", () => LoadSaves(CurrentPage, {
        Forload: false
    }));
    ReloadButton.classList.add("ABTN");
    ControlsContainer.appendChild(ReloadButton);

    if (TotalPages > 1) {
        const PreviousButton = document.createElement("div");
        PreviousButton.innerHTML = "Previous";
        PreviousButton.style.cursor = "pointer";
        PreviousButton.setAttribute("disabled", CurrentPage === 1)
        PreviousButton.addEventListener("click", () => LoadSaves(CurrentPage - 1, {
            Forload: false
        }));
        PreviousButton.classList.add("ABTN");
        ControlsContainer.appendChild(PreviousButton);

        const PageInfo = document.createElement("span");
        PageInfo.innerHTML = `Page ${CurrentPage} of ${TotalPages}`;
        ControlsContainer.appendChild(PageInfo);

        const NextButton = document.createElement("div");
        NextButton.innerHTML = "Next";
        NextButton.style.cursor = "pointer";
        NextButton.setAttribute("disabled", CurrentPage === TotalPages)
        NextButton.addEventListener("click", () => LoadSaves(CurrentPage + 1, {
            Forload: false
        }));
        NextButton.classList.add("ABTN");
        ControlsContainer.appendChild(NextButton);
    }
}

async function LoadSave(SaveId) {
    if (SaveId.startsWith("save:")) {
        const SaveDocRef = doc(Db, "saves", SaveId.replace("save:", ""));
        const SaveDocSnap = await getDoc(SaveDocRef);

        BrowserContainer.style.visibility = "hidden";
        const SaveData = SaveDocSnap.data();
        const Particles = SaveData.particles;
        ParticleContainer.innerHTML = "";
        BrowserAddressbar.value = "";

        PublicityButton.innerHTML = SaveData.public ? "PUBLIC" : "PRIVATE";
        UsernameButton.value = SaveData.username;
        NameButton.value = SaveData.simulationName;

        RemoveButtons.forEach(RemoveButton => {
            RemoveButton.style.visibility = "hidden";
        });

        Array.from(Buttons.getElementsByTagName("div")).forEach(Button => {
            if (Button !== BrowseButton) {
                Button.setAttribute("disabled", true);
            }
        });

        Array.from(Buttons.getElementsByTagName("input")).forEach(Button => {
            Button.disabled = true;
        });

        Particles.forEach(Particle => {
            const Element = tptw.GetElement(Particle.Name);
            const CreatedParticle = tptw.CreateParticle(Element, Particle.PosX, Particle.PosY);
            CreatedParticle.dataset.temp = Particle.Temp;
        });

    } else if (SaveId.startsWith("user:")) {
        LoadSaves(CurrentPage, {
            Forload: true
        });
    } else if (SaveId === "") {
        LoadSaves(CurrentPage, {
            Forload: false
        });
    }
}

function HandleLoadSave(Event) {
    if (Event.key === "Enter") {
        LoadSave(BrowserAddressbar.value);
    }
}
 
function Browse() {
    LoadSaves(CurrentPage, false);
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
document.addEventListener("DOMContentLoaded", CheckUserDoc);