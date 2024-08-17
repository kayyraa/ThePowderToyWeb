import * as TPTW from "./tptw.js";
import { Elements } from "./elements.js";

const ParticleContainer = document.getElementById("ParticleContainer");

function Random(Max, Min) {
    return Math.floor(Math.random() * (Max - Min + 1)) + Min;
}

function InitializeParticle(Particle) {
    const Direction = Math.floor(Math.random() * 4);
    const GridSize = parseInt(document.body.getAttribute("grid-size"), 10);

    let OffsetX = 0;
    let OffsetY = 0;

    switch (Direction) {
        case 0:
            OffsetX = GridSize;
            break;
        case 1:
            OffsetY = GridSize;
            break;
        case 2:
            OffsetX = -GridSize;
            break;
        case 3:
            OffsetY = -GridSize;
            break;
    }

    Particle.dataset.offsetX = OffsetX;
    Particle.dataset.offsetY = OffsetY;
}

function React() {
    const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));

    Particles.forEach(Particle => {
        if (Particle.dataset.radioactive === "true") {
            const Element = Elements.find(element => element.Name === "NEUT");
            if (Element) {
                Particle.dataset.temp = parseFloat(Particle.dataset.temp) + Random(32, 8);
                TPTW.CreateElement(Element, Particle.offsetLeft + 20, Particle.offsetTop / 1.25);
            }
        }
    });

    setTimeout(React, Random(20000, 1000));
}

if (ParticleContainer) {
    function Loop() {
        const BaseSimulationSpeed = 0;
        const SimulationSpeed = BaseSimulationSpeed * -(parseFloat(document.body.getAttribute("speed")));

        const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));
        const GravityEnabled = document.body.getAttribute("gravity") === "true";

        if (GravityEnabled) {
            Particles.forEach(Particle => {
                if (!Particle.dataset.offsetX || !Particle.dataset.offsetY) {
                    InitializeParticle(Particle);
                }

                const ParticleRect = Particle.getBoundingClientRect();
                const NewTop = ParticleRect.top + 12;
                const MaxHeight = window.innerHeight - ParticleRect.height;

                const IsCaustic = Particle.dataset.caustic === "true";
                const IsLight = Particle.dataset.light === "true";

                let CollisionDetected = false;
                let CollisionTop = MaxHeight;

                if (IsLight) {
                    const OffsetX = parseInt(Particle.dataset.offsetX, 10);
                    const OffsetY = parseInt(Particle.dataset.offsetY, 10);

                    const CurrentLeft = parseFloat(Particle.style.left) || Particle.offsetLeft;
                    const CurrentTop = parseFloat(Particle.style.top) || Particle.offsetTop;

                    Particle.style.left = `${CurrentLeft + OffsetX}px`;
                    Particle.style.top = `${CurrentTop + OffsetY}px`;
                }

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
                                if (!OtherIsCaustic) {
                                    const Element = Elements.find(element => element.Name === "SMKE");
                                    if (Element) {
                                        TPTW.CreateElement(Element, OtherParticle.offsetLeft, OtherParticle.offsetTop);
                                    }
                                }
                                
                                OtherParticle.remove();
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

React();