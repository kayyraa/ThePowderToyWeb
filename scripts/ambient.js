import * as tptw from "./tptw.js";
import { Settings } from "./settings.js";

const AmbientTemp = parseFloat(Settings.AmbientTemp);

function Loop() {
    const Particles = tptw.GetAllParticles();
    Particles.forEach(Particle => {
        let ParticleTemp = parseFloat(Particle.dataset.temp);

        if (!isNaN(ParticleTemp)) {
            const NewTemp = ParticleTemp + (AmbientTemp - ParticleTemp) / 256;
            Particle.dataset.temp = NewTemp.toFixed(2);
        }
    });

    requestAnimationFrame(Loop);
}

Loop();