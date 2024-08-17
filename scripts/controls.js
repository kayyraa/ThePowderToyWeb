import { Settings } from "./settings.js";

const ActionLabel = document.getElementById("ActionLabel");
const Clamp = (Val, Min, Max) => Math.min(Math.max(Val, Min), Max);

let SpeedIsZero = false;

document.addEventListener("keydown", (Event) => {
    if (Event.key === " " || Event.key === "Space") {
        SpeedIsZero = !SpeedIsZero;
        document.body.setAttribute("speed", SpeedIsZero ? "0" : "1");
    }

    if (Event.keyCode === 68) {
        const Displays = ["Heat", "Default"];

        let Display = document.body.getAttribute("display") || Displays[0];
        
        const NextIndex = (Displays.indexOf(Display.charAt(0).toUpperCase() + Display.slice(1)) + 1) % Displays.length;
        Display = Displays[NextIndex];
        
        document.body.setAttribute("display", Display.toLowerCase());
        ActionLabel.textContent = `${Display} Display`;
    }
});

document.addEventListener("wheel", (Event) => {
    if (Event.ctrlKey) {
        Event.preventDefault();
        var CurrentGameSpeed = parseFloat(document.body.getAttribute("speed"));
        
        if (Event.deltaY < 0) {
            const NewGameSpeed = Clamp(CurrentGameSpeed + Settings.SpeedChange, -8, 8);
            document.body.setAttribute("speed", NewGameSpeed.toString());
        } else if (Event.deltaY > 0) {
            const NewGameSpeed = Clamp(CurrentGameSpeed - Settings.SpeedChange, -8, 8);
            document.body.setAttribute("speed", NewGameSpeed.toString());
        }
    }
}, { passive: false });

document.addEventListener("contextmenu", (Event) => {
    Event.preventDefault();
});