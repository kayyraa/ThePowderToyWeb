import * as TPTW from "./tptw.js";
import { Elements } from "./elements.js";

const ParticleContainer = document.getElementById("ParticleContainer");

function Random(Max, Min) {
    return Math.floor(Math.random() * (Max - Min + 1)) + Min;
}

function InitializeParticle(Particle) {
    const Direction = Math.floor(Math.random() * 4);
    const GridSize = parseInt(document.body.getAttribute("grid-size"), 10);

    const OffsetX = (Direction === 0) ? GridSize : (Direction === 2) ? -GridSize : 0;
    const OffsetY = (Direction === 1) ? GridSize : (Direction === 3) ? -GridSize : 0;

    Particle.dataset.offsetX = OffsetX;
    Particle.dataset.offsetY = OffsetY;
}

function React() {
    const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));

    Particles.forEach(Particle => {
        if (Particle.dataset.radioactive === "true") {
            const Element = Elements.find(element => element.Name === "NEUT");
            if (Element) {
                TPTW.CreateElement(Element, Particle.offsetLeft + 10, Particle.offsetTop + 10);
            }
        }
    });

    setTimeout(React, Random(10000, 1000));
}

if (ParticleContainer) {
    function Loop() {
        const BaseSimulationSpeed = 0;
        const SimulationSpeed = BaseSimulationSpeed * -parseFloat(document.body.getAttribute("speed"));

        const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));
        const GravityEnabled = document.body.getAttribute("gravity") === "true";
        const GridSize = parseInt(document.body.getAttribute("grid-size"), 10);
        const Speed = parseInt(document.body.getAttribute("speed"), 10);
        const MaxHeight = window.innerHeight;
        const MaxWidth = window.innerWidth;

        if (GravityEnabled) {
            Particles.forEach(Particle => {
                if (!Particle.dataset.offsetX || !Particle.dataset.offsetY) {
                    InitializeParticle(Particle);
                }

                const ParticleRect = Particle.getBoundingClientRect();
                const NewTop = ParticleRect.top + (12 * Speed);
                const IsCaustic = Particle.dataset.caustic === "true";
                const IsLight = Particle.dataset.light === "true";

                if (IsLight) {
                    const OffsetX = parseInt(Particle.dataset.offsetX, 10);
                    const OffsetY = parseInt(Particle.dataset.offsetY, 10);

                    Particle.style.left = `${Particle.offsetLeft + OffsetX}px`;
                    Particle.style.top = `${Particle.offsetTop + OffsetY}px`;
                }

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

                            if (IsCaustic && OtherParticle.dataset.flammable === "true") {
                                OtherParticle.dataset.type = "Gas";
                                OtherParticle.dataset.caustic = "false";
                                OtherParticle.dataset.flammable = "false";
                                OtherParticle.style.backgroundColor = "rgb(100, 100, 100)";

                                Particle.remove();
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
                        Particle.style.top = `${Particle.offsetTop - (8 * Speed)}px`;
                    } else if (Particle.dataset.type === "Liquid") {
                        Particle.style.left = `${Particle.offsetLeft + (Random(8, -8) * Speed)}px`;
                        Particle.style.top = `${Math.min(NewTop, MaxHeight)}px`;
                    }
                }

                if (Particle.offsetTop > MaxHeight) {
                    Particle.remove();
                }
            });
        }

        setTimeout(Loop, SimulationSpeed);
    }

    Loop();
}

React();
