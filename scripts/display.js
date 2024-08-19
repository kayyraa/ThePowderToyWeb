const ParticleContainer = document.getElementById("ParticleContainer");
let LastDisplay

function Loop() {
    const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));

    if (LastDisplay === "heat") {
        Particles.forEach(Particle => {
            const Temp = parseInt(Particle.dataset.temp) || 0;
            const OriginalColor = StringToRgb(Particle.dataset.color);
            Particle.style.backgroundColor = `rgb(${OriginalColor.R + (Temp * 2)}, ${OriginalColor.G}, ${OriginalColor.B})`;
            Particle.style.filter = "";
            Particle.style.boxShadow = "";
        });
    } else if (LastDisplay === "blob") {
        Particles.forEach(Particle => {
            Particle.style.filter = "blur(1px)";
        });
    } else if (LastDisplay === "fancy") {
        Particles.forEach(Particle => {
            Particle.style.filter = "";
            if (Particle.dataset.radioactive === "true") {
                Particle.style.filter = `brightness(2) drop-shadow(0 0 8px ${Particle.dataset.color})`;
                Particle.style.boxShadow = `0 0 8px 1px ${Particle.dataset.color}`;
            } else if (Particle.dataset.light === "true") {
                Particle.style.boxShadow = `0 0 16px 4px ${Particle.dataset.color}`;
            }
        });
    }

    else {
        Particles.forEach(Particle => {
            Particle.style.filter = "";
            Particle.style.boxShadow = "";
            Particle.style.backgroundColor = Particle.dataset.color;
        });
    }

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