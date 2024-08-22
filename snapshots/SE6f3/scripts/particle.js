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
    let RadioactiveParticles = [];

    if (Particles.length > 0) {
        const RandomIndex = Math.floor(Math.random() * Particles.length);
        const Particle = Particles[RandomIndex];

        if (Particle.dataset.radioactive === "true") {
            RadioactiveParticles.push(Particle);
            setTimeout(() => {
                Particle.dataset.temp = parseFloat(Particle.dataset.temp) + Random(128, 8);
                TPTW.CreateElement(Elements.find(element => element.Name === "NEUT"), Particle.offsetLeft, Particle.offsetTop); 
            }, (RadioactiveParticles.length * 1000) - (parseFloat(Particle.dataset.radioactivity) * 1000));
        }
    }

    requestAnimationFrame(React);
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
                
                    if (Temp > MeltingPoint) {
                        Particle.dataset.type = "Liquid";
                        Particle.dataset.radioactive = false;
                    } else {
                        Particle.dataset.type = Particle.dataset.fixedType;
                        Particle.dataset.radioactive = Particle.dataset.fixedRadioactive;
                    }
                }
                
            
                Particles.forEach(OtherParticle => {
                    if (OtherParticle !== Particle) {
                        if (Particle.dataset.light === "true" || OtherParticle.dataset.light === "true") {
                            return;
                        }

                        const OtherRect = OtherParticle.getBoundingClientRect();
                        const Collision = (
                            NewTop < OtherRect.bottom &&
                            NewTop + ParticleRect.height > OtherRect.top &&
                            ParticleRect.right > OtherRect.left &&
                            ParticleRect.left < OtherRect.right
                        );

                        if (Collision) {
                            CollisionDetected = true;
                            CollisionTop = Math.min(CollisionTop, OtherRect.top - ParticleRect.height);
                        
                            const OtherIsCaustic = OtherParticle.dataset.caustic === "true";
                            const OtherIsFlammable = OtherParticle.dataset.flammable === "true";
                        
                            const Temp = parseFloat(Particle.dataset.temp);
                            const OtherTemp = parseFloat(OtherParticle.dataset.temp);
                        
                            if (Temp.toFixed(1) !== OtherTemp.toFixed(1)) {
                                const AverageTemp = (Temp + OtherTemp) / 2;
                                Particle.dataset.temp = AverageTemp.toFixed(1);
                                OtherParticle.dataset.temp = AverageTemp.toFixed(1);
                            }
                        
                            if (IsCaustic && OtherIsFlammable && !OtherIsCaustic) {
                                TPTW.CombustElement(Particle, OtherParticle);
                            }
                        }
                    }
                });
            
                if (CollisionDetected) {
                    Particle.style.top = `${CollisionTop}px`;
                } else {
                    if (Particle.dataset.type === "Gas") {
                        let DisplacementAllowed = true;

                        const ParticleRect = Particle.getBoundingClientRect();

                        Particles.forEach(OtherParticle => {
                            if (OtherParticle !== Particle && !IgnoreList.has(OtherParticle)) {
                                const OtherType = OtherParticle.dataset.type;

                                if (OtherType === "Powder" || OtherType === "Solid" || OtherType === "Liquid") {
                                    const OtherRect = OtherParticle.getBoundingClientRect();

                                    if (
                                        ParticleRect.right > OtherRect.left &&
                                        ParticleRect.left < OtherRect.right &&
                                        ParticleRect.top < OtherRect.bottom &&
                                        ParticleRect.bottom > OtherRect.top
                                    ) {
                                        DisplacementAllowed = false;

                                        if (OtherParticle.dataset.flammable === "true") {
                                            TPTW.CombustElement(Particle, OtherParticle);
                                        }
                                    
                                        if (OtherType === "Powder" || OtherType === "Liquid") {
                                            const DisplacementX = ParticleRect.left - OtherRect.left;
                                            const DisplacementY = ParticleRect.top - OtherRect.top;
                                        
                                            OtherParticle.style.left = `${OtherParticle.offsetLeft + DisplacementX}px`;
                                            OtherParticle.style.top = `${OtherParticle.offsetTop + DisplacementY}px`;
                                        }
                                    }
                                }
                            }
                        });

                        if (DisplacementAllowed) {
                            Particle.style.top = `${Particle.offsetTop - 6}px`;
                        }
                    } else if (Particle.dataset.type === "Powder") {
                        Particle.style.top = `${Math.min(NewTop, MaxHeight)}px`;
                    } else if (Particle.dataset.type === "Liquid") {
                        Particle.style.top = `${Math.min(NewTop, MaxHeight)}px`;

                        const NewLeft = Math.min(Math.round((Particle.offsetLeft + Random(GridSize * 2, -GridSize * 2)) / GridSize) * GridSize, MaxWidth);
                        
                        if (!Particles.some(OtherParticle => {
                            const OtherRect = OtherParticle.getBoundingClientRect();
                            return (
                                OtherRect.left === NewLeft &&
                                OtherParticle.dataset.type === "Liquid"
                            );
                        })) {
                            Particle.style.left = `${NewLeft}px`;
                        }
                    }
                }
            
                const IsMoving = (
                    Particle.offsetTop !== parseFloat(Particle.dataset.previousTop) ||
                    Particle.offsetLeft !== parseFloat(Particle.dataset.previousLeft)
                );
            
                if (!IsMoving) {
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