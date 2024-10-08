import { Displays } from "./displays.js";
import * as tptw from "./tptw.js";

const ActionLabel = document.getElementById("ActionLabel");

document.addEventListener("touchend", () => {
    const Cursor = document.getElementById("Cursor");
    if (Cursor !== null) {
        Cursor.style.opacity = "0";
    }
});

document.addEventListener("touchstart", () => {
    const Cursor = document.getElementById("Cursor");
    if (Cursor !== null) {
        Cursor.style.opacity = "1";
    }
});

document.addEventListener("keydown", (Event) => {
    if (["INPUT", "TEXTAREA"].includes(document.activeElement.tagName) || document.activeElement.isContentEditable) {
        return;
    }

    if (Event.key === "c") {
        tptw.Clear();
    }

    if (Event.key === "d") {
        let Display = document.body.getAttribute("display") || Displays[0];
        
        const NextIndex = (Displays.indexOf(Display.charAt(0).toUpperCase() + Display.slice(1)) + 1) % Displays.length;
        Display = Displays[NextIndex];
        
        document.body.setAttribute("display", Display.toLowerCase());
        ActionLabel.textContent = `${Display} Display`;
    }
});

document.addEventListener("contextmenu", (Event) => {
    Event.preventDefault();
});