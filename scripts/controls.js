const ActionLabel = document.getElementById("ActionLabel");

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