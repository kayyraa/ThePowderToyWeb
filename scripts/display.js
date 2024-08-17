const ParticleContainer = document.getElementById("ParticleContainer");
let LastDisplay

function Loop() {
    Array.from(ParticleContainer.getElementsByTagName("div")).forEach(Particle => {
        const OriginalColor = StringToRgb(Particle.dataset.color);
        const Temp = parseInt(Particle.dataset.temp) || 0;

        if (LastDisplay === "heat") {
            Particle.style.backgroundColor = `rgb(${OriginalColor.R + Temp}, ${OriginalColor.G}, ${OriginalColor.B})`;
            Particle.style.filter = "";
        } else if (Display === "blob") {
            Particle.style.filter = "blur(1px)";
        }

        else {
            Particle.style.backgroundColor = Particle.dataset.color;
            Particle.style.filter = "";
        }
    });

    setTimeout(Loop, 0);
}

function StringToRgb(rgbString) {
    const [R, G, B] = rgbString.match(/\d+/g).map(Number);
    return { R, G, B };
}

function HandleDisplayChange(Display) {
    LastDisplay = Display;
}

const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === "attributes" && mutation.attributeName === "display") {
            HandleDisplayChange(document.body.getAttribute("display"));
        }
    });
});

observer.observe(document.body, {
    attributes: true
});

Loop();