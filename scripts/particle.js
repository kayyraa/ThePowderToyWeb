import * as TPTW from "./tptw.js";
import { Elements } from "./elements.js";

const ParticleContainer = document.getElementById("ParticleContainer");
const IgnoreList = new Set();

function Random(Max, Min) {
    return Math.floor(Math.random() * (Max - Min + 1)) + Min;
}

function IsPlaceOccupied(x, y, gridSize) {
    const Particles = Array.from(ParticleContainer.children);
    return Particles.some(Particle => {
        const ParticleRect = Particle.getBoundingClientRect();
        const ParticleX = Math.floor(ParticleRect.left / gridSize) * gridSize;
        const ParticleY = Math.floor(ParticleRect.top / gridSize) * gridSize;
        return ParticleX === x && ParticleY === y;
    });
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
    let RadioactiveParticles = [];

    if (Particles.length > 0) {
        const RandomIndex = Math.floor(Math.random() * Particles.length);
        const Particle = Particles[RandomIndex];

        if (Particle.dataset.radioactive === "true") {
            RadioactiveParticles.push(Particle);
            setTimeout(() => {
                Particle.dataset.temp = parseFloat(Particle.dataset.temp) + Random(32, 8);
                TPTW.CreateElement(Elements.find(element => element.Name === "NEUT"), Particle.offsetLeft, Particle.offsetTop); 
            }, (RadioactiveParticles.length * 1000) - (parseFloat(Particle.dataset.radioactivity) * 1000));
        }
    }

    setTimeout(React, 0);
}

if (ParticleContainer) {
    function Loop() {
        const Particles = Array.from(ParticleContainer.getElementsByTagName("div"));

        if (Particles.length > 0) {
            Particles.forEach(Particle => {
                if (IgnoreList.has(Particle)) return;
            
                if (
                    Math.abs(Particle.offsetTop) > window.innerHeight || 
                    Math.abs(Particle.offsetLeft) > (window.innerWidth - Particle.offsetWidth)
                ) {
                    Particle.remove();
                    return;
                }
            
                if (!Particle.dataset.offsetX || !Particle.dataset.offsetY) {
                    InitializeParticle(Particle);
                }
            
                const ParticleRect = Particle.getBoundingClientRect();
                const NewTop = ParticleRect.top + 12;

                const GridSize = parseInt(document.body.getAttribute("grid-size"));
                const MaxHeight = window.innerHeight - ParticleRect.height;
                const MaxWidth = window.innerWidth - ParticleRect.width;

                const MeltingPoint = Particle.dataset.meltingPoint;
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

                    return;
                }

                if (MeltingPoint !== undefined) {
                    const Temp = parseFloat(Particle.dataset.temp);
                    if (Temp >= parseFloat(MeltingPoint)) {
                        const NewParticle = {
                            Name: `MOLTEN ${Particle.dataset.name}`,
                            Color: Particle.dataset.color,
                            Flammable: false,
                            Caustic: true,
                            Radioactive: false,
                            Radioactivity: parseFloat(Particle.dataset.radioactivity),
                            Light: Particle.dataset.light,
                            Temp: parseFloat(Particle.dataset.meltingPoint),
                            MeltingPoint: parseFloat(Particle.dataset.meltingPoint),
                            BoilingPoint: parseFloat(Particle.dataset.boilingPoint),
                            Type: "Liquid"
                        };

                        TPTW.CreateElement(NewParticle, Particle.offsetLeft, Particle.offsetTop);
                        Particle.remove();
                    }
                }
            
                Particles.forEach(OtherParticle => {
                    if (OtherParticle !== Particle) {
                        if (Particle.dataset.light === "true" || OtherParticle.dataset.light === "true") {
                            return;
                        }

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
            
                            const Temp = parseFloat(Particle.dataset.temp);
                            const OtherTemp = parseFloat(OtherParticle.dataset.temp);
                                
                            if (Temp !== OtherTemp) {
                                const AverageTemp = (Temp + OtherTemp) / 2;
                                Particle.dataset.temp = AverageTemp;
                                OtherParticle.dataset.temp = AverageTemp;
                            }

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
                    if (Particle.dataset.type === "Gas") {
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
                                        if (OtherParticle.dataset.flammable === "true") {
                                            TPTW.CombustElement(Particle, OtherParticle);
                                        }
            
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

                        const NewLeft = Math.min(Math.round((Particle.offsetLeft + Random(25, -25)) / GridSize) * GridSize, MaxWidth);
                        if (!IsPlaceOccupied(NewLeft, Particle.offsetTop, GridSize)) {
                            Particle.style.left = `${NewLeft}px`;
                        }
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
                            ParticleRect.top < OtherRect.bottom &&
                            ParticleRect.bottom > OtherRect.top &&
                            ParticleRect.left < OtherRect.right &&
                            ParticleRect.right > OtherRect.left
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

        requestAnimationFrame(Loop);
    }

    Loop();
}

React();