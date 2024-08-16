const ParticleContainer = document.getElementById("ParticleContainer");

function StringToRgb(RgbString) {
    const match = RgbString.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (match) {
        return {
            R: parseInt(match[1], 10),
            G: parseInt(match[2], 10),
            B: parseInt(match[3], 10)
        };
    }
    return { R: 0, G: 0, B: 0 };
}

function HandleDisplayChange(Display) {
    Array.from(ParticleContainer.getElementsByTagName("div")).forEach(Particle => {
        const OriginalColor = StringToRgb(Particle.dataset.color);
        const Temp = parseInt(Particle.dataset.temp) || 0;

        if (Display === "heat") {
            Particle.style.backgroundColor = `rgb(${OriginalColor.R}, ${OriginalColor.G}, ${OriginalColor.B + Temp})`;
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