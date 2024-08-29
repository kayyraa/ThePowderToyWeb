import * as tptw from "./tptw.js";
import { Settings } from "./settings.js";

const AmbientTemp = Settings.AmbientTemp;

function Loop() {
    const Particles = tptw.GetAllParticles();
    Particles.forEach(Particle => {
        let ParticleTemp = parseFloat(Particle.dataset.temp);

        if (ParticleTemp !== AmbientTemp) {
            ParticleTemp += (AmbientTemp - ParticleTemp) / 512;
            Particle.dataset.temp = ParticleTemp;
        }
    });

    requestAnimationFrame(Loop);
}

Loop();