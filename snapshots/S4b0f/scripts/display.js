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

            Particle.style.backgroundColor = `rgb(${CurrentColor.R + (Temp * 2)}, ${CurrentColor.G}, ${CurrentColor.B})`;
            Particle.style.filter = "";
            Particle.style.boxShadow = "";
        });
    } else if (Display === "blob") {
        Particles.forEach(Particle => {
            Particle.style.backgroundColor = Particle.dataset.fixedColor;
            Particle.style.filter = "blur(1px)";
        });
    } else if (Display === "fancy") {
        Particles.forEach(Particle => {
            Particle.style.filter = "";
            Particle.style.backgroundColor = Particle.dataset.fixedColor;
            if (Particle.dataset.radioactive === "true") {
                Particle.style.filter = `brightness(2) drop-shadow(0 0 8px ${Particle.dataset.fixedColor})`;
                Particle.style.boxShadow = `0 0 8px 1px ${Particle.dataset.fixedColor}`;
            } else if (Particle.dataset.light === "true") {
                Particle.style.boxShadow = `0 0 16px 4px ${Particle.dataset.fixedColor}`;
            }
        });
    } else if (Display === "height") {
        Particles.forEach(Particle => {
            const Height = Particle.offsetTop;
            const ScreenHeight = window.innerHeight;
        
            const NormalizedHeight = (Height - 0) / (ScreenHeight - 0);
            
            const RedStart = { R: 255, G: 0, B: 0 };
            const White = { R: 255, G: 255, B: 255 };
            const BlueEnd = { R: 0, G: 0, B: 255 };
        
            let Color;
        
            if (NormalizedHeight <= 0.5) {
                Color = {
                    R: RedStart.R + (White.R - RedStart.R) * (NormalizedHeight * 2),
                    G: RedStart.G + (White.G - RedStart.G) * (NormalizedHeight * 2),
                    B: RedStart.B + (White.B - RedStart.B) * (NormalizedHeight * 2)
                };
            } else {
                const t = (NormalizedHeight - 0.5) * 2;
                Color = {
                    R: White.R + (BlueEnd.R - White.R) * t,
                    G: White.G + (BlueEnd.G - White.G) * t,
                    B: White.B + (BlueEnd.B - White.B) * t
                };
            }
        
            Particle.style.backgroundColor = `rgb(${Math.round(Color.R)}, ${Math.round(Color.G)}, ${Math.round(Color.B)})`;
        });        
    }

    else {
        Particles.forEach(Particle => {
            Particle.style.filter = "";
            Particle.style.boxShadow = "";
            Particle.style.backgroundColor = Particle.dataset.fixedColor;
        });
    }

    requestAnimationFrame(Loop);
}

Loop();