const ParticleContainer = document.getElementById("ParticleContainer");

if (ParticleContainer) {
    function Loop() {
        const BaseSimulationSpeed = 0;
        const SimulationSpeed = BaseSimulationSpeed / (parseInt(document.body.getAttribute("speed")) || 1);

        const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));
        const GravityEnabled = document.body.getAttribute("gravity") === "true";

        if (GravityEnabled) {
            Particles.forEach(Particle => {
                if (Particle.dataset.type === "Solid") {
                    return;
                }

                const ParticleRect = Particle.getBoundingClientRect();
                const NewTop = ParticleRect.top + (12 * parseInt(document.body.getAttribute("speed")));
                const MaxHeight = window.innerHeight - ParticleRect.height;

                let CollisionDetected = false;
                let CollisionTop = MaxHeight;

                Particles.forEach(OtherParticle => {
                    if (OtherParticle !== Particle) {
                        const OtherRect = OtherParticle.getBoundingClientRect();

                        if (
                            NewTop < OtherRect.bottom &&
                            NewTop + ParticleRect.height > OtherRect.top &&
                            ParticleRect.right > OtherRect.left &&
                            ParticleRect.left < OtherRect.right
                        ) {
                            CollisionDetected = true;
                            CollisionTop = Math.min(CollisionTop, OtherRect.top - ParticleRect.height);

                            // Resolve overlap by moving the particle upwards
                            if (ParticleRect.bottom > OtherRect.top) {
                                const Overlap = ParticleRect.bottom - OtherRect.top;
                                Particle.style.top = `${Particle.offsetTop - Overlap}px`;
                            }
                        }
                    }
                });

                if (!CollisionDetected) {
                    if (Particle.dataset.type === "Powder" || Particle.dataset.type === "Liquid") {
                        Particle.style.top = `${Math.min(NewTop, MaxHeight)}px`;
                    } else if (Particle.dataset.type === "Gas") {
                        Particle.style.top = `${Particle.offsetTop - (8 * parseInt(document.body.getAttribute("speed")))}px`;
                    }
                }

                if (Math.abs(Particle.offsetTop) > (window.innerHeight)) {
                    Particle.remove();
                }
            });
        }

        setTimeout(Loop, SimulationSpeed);
    }

    Loop();
}
