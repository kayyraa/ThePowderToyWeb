import { Buttons } from "./save.js";
import { Theme } from "./theme.js";
import { Settings } from "./settings.js";

import * as tptw from "./tptw.js";

export var ModsEnabled = [];

const Mods = [
    {
        Name: "ColorfulMod",
        Version: "1.0.0",

        Setup: () => {
            console.log("ColorfulMod");
        },

        Loop: () => {
            const Particles = tptw.GetAllParticles();
            Particles.forEach(Particle => {
                Particle.style.backgroundColor = `rgb(${tptw.Random(255, 0)}, ${tptw.Random(255, 0)}, ${tptw.Random(255, 0)})`;
            });
        },

        Stop: () => {
            const Particles = tptw.GetAllParticles();
            Particles.forEach(Particle => {
                Particle.style.backgroundColor = Particle.dataset.fixedColor;
            });
        }
    },
    {
        Name: "PerformanceMod",
        Version: "1.0.0",

        Setup: () => {
            console.log("PerformanceMod");
        },

        Loop: () => {
            const Particles = tptw.GetAllParticles();
            Particles.forEach(Particle => {
                if (Particle.dataset.type === "None") {
                    Particle.remove();
                }
            });
        },

        Stop: () => {}
    }
];

const ModsBrowser = document.createElement("div");
ModsBrowser.id = "ModsBrowser";
document.body.appendChild(ModsBrowser);

const ModsContainer = document.createElement("div");
ModsContainer.style.width = "100%";
ModsContainer.style.height = "100%";
ModsContainer.classList.add("ModsContainer");
ModsBrowser.appendChild(ModsContainer);

const Titlebar = document.createElement("span");
Titlebar.style.position = "absolute";
Titlebar.style.top = "0";
Titlebar.style.width = "100%";
Titlebar.style.height = "5%";
Titlebar.style.backgroundColor = "rgb(60, 60, 60)";
Titlebar.style.textAlign = "center";
Titlebar.style.fontSize = "100%";
Titlebar.style.alignContent = "center";
Titlebar.innerHTML = `ThePowderToyWeb Mods ${Settings.Version}`;
ModsBrowser.appendChild(Titlebar);

const ModsButton = document.createElement("div");
ModsButton.innerHTML = "MODS";
ModsButton.classList.add("BTN");
ModsButton.style.color = Theme.TertiaryColor;
ModsButton.style.order = "-1";
Buttons.appendChild(ModsButton);

function CreateModButton() {
    Mods.forEach(Mod => {
        const Name = Mod.Name;
        const Version = Mod.Version;

        const SetupFunction = Mod.Setup;
        const LoopFunction = Mod.Loop;
        const StopFunction = Mod.Stop;
        
        const ModButton = document.createElement("div");
        ModButton.classList.add("ModButton");
        ModButton.innerHTML = `${Name} - ${Version}`;
        ModsContainer.appendChild(ModButton);

        const ToggleButton = document.createElement("div");
        ToggleButton.innerHTML = "Disabled";
        ToggleButton.setAttribute("disabled", "true");
        ToggleButton.classList.add("ToggleButton");
        ModButton.appendChild(ToggleButton);

        ModButton.addEventListener("click", () => {
            ToggleButton.setAttribute("disabled", ToggleButton.getAttribute("disabled") === "true" ? "false" : "true");
            ToggleButton.innerHTML = ToggleButton.getAttribute("disabled") === "true" ? "Disabled" : "Enabled";

            if (ToggleButton.getAttribute("disabled") === "false") {
                SetupFunction();
                Loop();
            }
        });

        function Loop() {
            if (ToggleButton.getAttribute("disabled") === "false") {
                if (!ModsEnabled.includes(Mod)) {
                    ModsEnabled.push(Mod);
                }

                LoopFunction();
                requestAnimationFrame(Loop);
            } else {
                if (ModsEnabled.includes(Mod)) {
                    ModsEnabled = ModsEnabled.filter(Item => Item.Name !== Name);
                }
                StopFunction();
            }
        }
    });
}

function HandleModsButton(Event) {
    if (Event.button === 0) {
        ModsBrowser.style.visibility = getComputedStyle(ModsBrowser).visibility === "visible" ? "hidden" : "visible";
    }
}

ModsButton.addEventListener("click", HandleModsButton);
document.addEventListener("DOMContentLoaded", CreateModButton);