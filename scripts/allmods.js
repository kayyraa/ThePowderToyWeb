import * as tptw from "./tptw.js";

export const Mods = [
    {
        Name: "ColorfulMod",
        Version: "1.0.0",

        Setup: () => {
            console.log("ColorfulMod");
        },

        Loop: () => {
            const Particles = tptw.GetAllParticles();
            Particles.forEach(Particle => {
                Particle.style.backgroundColor = `rgb(${tptw.Random(255, 0)}, ${tptw.Random(255, 0)}, ${tptw.Random(255, 0)})`;
            });
        },

        Stop: () => {
            const Particles = tptw.GetAllParticles();
            Particles.forEach(Particle => {
                Particle.style.backgroundColor = Particle.dataset.fixedColor;
            });
        }
    },
    {
        Name: "PerformanceMod",
        Version: "1.0.0",

        Setup: () => {
            console.log("PerformanceMod");
        },

        Loop: () => {
            const Particles = tptw.GetAllParticles();
            Particles.forEach(Particle => {
                if (Particle.dataset.type === "None") {
                    Particle.remove();
                }
            });
        },

        Stop: () => {}
    },
    {
        Name: "MythicMod",
        Version: "1.0.0",

        Setup: () => {
            console.log("MythicMod");
        },

        Loop: () => {
            const Particles = tptw.GetAllParticles();
            Particles.forEach(Particle => {
                Particle.dataset.temp = tptw.Random(parseFloat(Particle.dataset.meltingPoint), 0);
            });
        },

        Stop: () => {}
    }
];