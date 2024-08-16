const ActionLabel = document.getElementById("ActionLabel");

const Displays = [
    "Heat",
    "Default",
];

let SpeedIsZero = false;
let Display = document.body.getAttribute("display");

document.addEventListener("keydown", (Event) => {
    if (Event.key === " " || Event.key === "Space") {
        SpeedIsZero = !SpeedIsZero;
        document.body.setAttribute("speed", SpeedIsZero ? "0" : "1");
    }

    if (Event.keyCode === 68) {
        Display = Displays[(Displays.indexOf(Display) + 1) % Displays.length];
        document.body.setAttribute("display", Display.toLowerCase());
        ActionLabel.textContent = `${Display} Display`;
    }
});