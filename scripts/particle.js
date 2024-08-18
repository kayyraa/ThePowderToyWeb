import * as TPTW from "./tptw.js";
import { Elements } from "./elements.js";

const ParticleContainer = document.getElementById("ParticleContainer");
const IgnoreList = new Set();

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
    Particle.dataset.previousTop = Particle.offsetTop;
    Particle.dataset.previousLeft = Particle.offsetLeft;
}

function React() {
    const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));

    if (Particles.length > 0) {
        Particles.forEach(Particle => {
            if (Particle.dataset.radioactive === "true") {
                const Element = Elements.find(element => element.Name === "NEUT");
                if (Element) {
                    setTimeout(() => {
                        Particle.dataset.temp = parseFloat(Particle.dataset.temp) + Random(32, 8);
                        TPTW.CreateElement(Element, Particle.offsetLeft + Random(40, 20), Particle.offsetTop - Random(40, 20)); 
                    }, Random(2500, 500 / Random(2, 1.25)));
                }
            }
        });
    }

    setTimeout(React, Random(30000, 2500 / Random(2, 1.25)));
}

if (ParticleContainer) {
    function Loop() {
        const BaseSimulationSpeed = 0;
        const SimulationSpeed = BaseSimulationSpeed * -(parseFloat(document.body.getAttribute("speed")));

        const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));
        const GravityEnabled = document.body.getAttribute("gravity") === "true";

        if (GravityEnabled) {
            if (Particles.length > 0) {
                Particles.forEach(Particle => {
                    if (IgnoreList.has(Particle)) return;

                    if (Math.abs(Particle.offsetTop) > window.innerHeight || Math.abs(Particle.offsetLeft) > window.innerWidth) {
                        Particle.remove();
                    }

                    if (!Particle.dataset.offsetX || !Particle.dataset.offsetY) {
                        InitializeParticle(Particle);
                    }

                    const ParticleRect = Particle.getBoundingClientRect();
                    const NewTop = ParticleRect.top + 12;
                    const MaxHeight = window.innerHeight - ParticleRect.height;

                    const IsCaustic = Particle.dataset.caustic === "true";
                    const IsLight = Particle.dataset.light === "true";
                    const IsGas = Particle.dataset.type === "Gas";

                    let CollisionDetected = false;
                    let CollisionTop = MaxHeight;

                    if (IsLight) {
                        const OffsetX = parseInt(Particle.dataset.offsetX, 10);
                        const OffsetY = parseInt(Particle.dataset.offsetY, 10);

                        const CurrentLeft = parseFloat(Particle.style.left) || Particle.offsetLeft;
                        const CurrentTop = parseFloat(Particle.style.top) || Particle.offsetTop;

                        Particle.style.left = `${CurrentLeft + OffsetX}px`;
                        Particle.style.top = `${CurrentTop + -Math.abs(OffsetY)}px`;

                        return;
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
                        if (IsGas) {
                            let DisplacementAllowed = true;
                            Particles.forEach(OtherParticle => {
                                if (OtherParticle !== Particle && !IgnoreList.has(OtherParticle)) {
                                    const OtherType = OtherParticle.dataset.type;
                                    if (OtherType === "Powder" || OtherType === "Solid") {
                                        const OtherRect = OtherParticle.getBoundingClientRect();
                                        if (
                                            NewTop < OtherRect.bottom &&
                                            NewTop + ParticleRect.height > OtherRect.top &&
                                            ParticleRect.right > OtherRect.left &&
                                            ParticleRect.left < OtherRect.right
                                        ) {
                                            DisplacementAllowed = false;
                                        }
                                    }
                                }
                            });

                            if (DisplacementAllowed) {
                                Particle.style.top = `${Particle.offsetTop - (8 * parseInt(document.body.getAttribute("speed")))}px`;
                            }
                        } else if (Particle.dataset.type === "Powder") {
                            Particle.style.top = `${Math.min(NewTop, MaxHeight)}px`;
                        } else if (Particle.dataset.type === "Liquid") {
                            Particle.style.top = `${Math.min(NewTop, MaxHeight)}px`;
                        }
                    }

                    const IsMoving = (
                        Particle.offsetTop !== parseFloat(Particle.dataset.previousTop) ||
                        Particle.offsetLeft !== parseFloat(Particle.dataset.previousLeft)
                    );

                    if (!IsMoving && Particle.dataset.type !== "Gas") {
                        IgnoreList.add(Particle);
                    }

                    Particle.dataset.previousTop = Particle.offsetTop;
                    Particle.dataset.previousLeft = Particle.offsetLeft;
                });

                IgnoreList.forEach(Particle => {
                    const ParticleRect = Particle.getBoundingClientRect();
                    let SurroundingClear = true;

                    Particles.forEach(OtherParticle => {
                        if (OtherParticle !== Particle) {
                            const OtherRect = OtherParticle.getBoundingClientRect();
                            if (
                                (ParticleRect.top < OtherRect.bottom && ParticleRect.bottom > OtherRect.top &&
                                ParticleRect.left < OtherRect.right && ParticleRect.right > OtherRect.left)
                            ) {
                                SurroundingClear = false;
                            }
                        }
                    });

                    if (SurroundingClear) {
                        IgnoreList.delete(Particle);
                    }
                });
            }
        }

        setTimeout(Loop, SimulationSpeed);
    }

    Loop();
}

React();