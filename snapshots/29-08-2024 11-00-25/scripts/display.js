const ParticleContainer = document.getElementById("ParticleContainer");

function StringToRgb(RgbString) {
    const [R, G, B] = RgbString.match(/\d+/g).map(Number);
    return { R, G, B };
}

function Loop() {
    const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));
    const Display = document.body.getAttribute("display");

    if (Display === "heat") {
        Particles.forEach(Particle => {
            const Temp = parseFloat(Particle.dataset.temp) || 0;
            const CurrentColor = StringToRgb(getComputedStyle(Particle).backgroundColor);

            Particle.style.backgroundColor = `rgb(${CurrentColor.R + Temp}, ${CurrentColor.G}, ${CurrentColor.B})`;
            Particle.style.filter = "";
            Particle.style.boxShadow = "";
        });
    } else if (Display === "blob") {
        Particles.forEach(Particle => {
            Particle.style.filter = "blur(1px)";
        });
    } else if (Display === "fancy") {
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

    requestAnimationFrame(Loop);
}

Loop();