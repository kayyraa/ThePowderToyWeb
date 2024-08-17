const ParticleContainer = document.getElementById("ParticleContainer");

if (ParticleContainer) {
    function Loop() {
        const BaseSimulationSpeed = 0;
        const SimulationSpeed = BaseSimulationSpeed * -(parseFloat(document.body.getAttribute("speed")));

        const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));
        const GravityEnabled = document.body.getAttribute("gravity") === "true";
        
        if (GravityEnabled) {
            Particles.forEach(Particle => {
                const ParticleRect = Particle.getBoundingClientRect();
                const NewTop = ParticleRect.top + (12 * parseInt(document.body.getAttribute("speed")));
                const MaxHeight = window.innerHeight - ParticleRect.height;

                const IsCaustic = Particle.dataset.caustic === "true";
                const IsFlammable = Particle.dataset.flammable === "true";

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

                            const OtherIsCaustic = OtherParticle.dataset.caustic === "true";
                            const OtherIsFlammable = OtherParticle.dataset.flammable === "true";

                            if (IsCaustic && OtherIsFlammable) {
                                OtherParticle.dataset.type = "Gas";
                                OtherParticle.dataset.caustic = "false";
                                OtherParticle.dataset.flammable = "false";
                                OtherParticle.style.backgroundColor = "rgb(100, 100, 100)";

                                Particle.remove()
                            }
                        }
                    }
                });

                if (CollisionDetected) {
                    Particle.style.top = `${CollisionTop}px`;
                } else {
                    if (Particle.dataset.type === "Powder") {
                        Particle.style.top = `${Math.min(NewTop, MaxHeight)}px`;
                    } else if (Particle.dataset.type === "Gas") {
                        Particle.style.top = `${Particle.offsetTop - (8 * parseInt(document.body.getAttribute("speed")))}px`;
                    } else if (Particle.dataset.type === "Liquid") {
                        Particle.style.top = `${Math.min(NewTop, MaxHeight)}px`;
                    }
                }

                if (Math.abs(Particle.offsetTop) > window.innerHeight) {
                    Particle.remove();
                }
            });
        }

        setTimeout(Loop, SimulationSpeed);
    }

    Loop();
}