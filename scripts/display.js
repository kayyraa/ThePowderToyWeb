const ParticleContainer = document.getElementById("ParticleContainer");

function StringToRgb(rgbString) {
    const [R, G, B] = rgbString.match(/\d+/g).map(Number);
    return { R, G, B };
}

function HandleDisplayChange(Display) {
    Array.from(ParticleContainer.getElementsByTagName("div")).forEach(Particle => {
        const OriginalColor = StringToRgb(Particle.dataset.color);
        const Temp = parseInt(Particle.dataset.temp) || 0;

        if (Display === "heat") {
            Particle.style.backgroundColor = `rgb(${OriginalColor.R + Temp}, ${OriginalColor.G}, ${OriginalColor.B})`;
        } else {
            Particle.style.backgroundColor = Particle.dataset.color;
        }
    });
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