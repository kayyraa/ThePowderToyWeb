import * as tptw from "./tptw.js";
import { Settings } from "./settings.js";

const AmbientTemp = parseFloat(Settings.AmbientTemp);

function Loop() {
    const Particles = tptw.GetAllParticles();
    Particles.forEach(Particle => {
        let ParticleTemp = parseFloat(Particle.dataset.temp);

        if (!isNaN(ParticleTemp)) {
            const newTemp = ParticleTemp + (AmbientTemp - ParticleTemp) / 256;
            Particle.dataset.temp = newTemp.toFixed(2);
        }
    });

    requestAnimationFrame(Loop);
}

Loop();