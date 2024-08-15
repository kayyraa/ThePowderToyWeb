const ParticleContainer = document.getElementById("ParticleContainer");

if (ParticleContainer) {
    function Loop() {
        const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));
        const GravityEnabled = document.body.getAttribute("gravity") === "true";

        if (GravityEnabled) {
            Particles.forEach(Particle => {
                const ParticleRect = Particle.getBoundingClientRect();
                const NewTop = ParticleRect.top + 12; // Move the particle down
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
                        }
                    }
                });

                if (CollisionDetected) {
                    Particle.style.top = `${CollisionTop}px`;
                } else {
                    if (Particle.dataset.type === "Liquid" || Particle.dataset.type === "Powder") {
                        Particle.style.top = `${Math.min(NewTop, MaxHeight)}px`;
                    }
                    
                }
            });
        }

        requestAnimationFrame(Loop);
    }

    Loop();
}
