const lightsContainer = document.getElementById("lights-container")
var laserGroups = []
var lasersState = true;

// LASERS
// - Multiple laser beams
// - Smooth movement
// - Random distance between them
// - 
class LaserBeams {
    constructor() {
        let numLaserBeams = document.getElementsByClassName("laserBeams").length
        this.laserBeams = document.createElement("div") 
        this.laserBeams.classList.add("laserBeams")
        this.laserBeams.id = "lasers" + numLaserBeams
        this.laserBeams.style.marginLeft = 200 + ((numLaserBeams+1) * 300) + "px" 
        for(let i=0; i<21; i++) {
            var laser = document.createElement("div")
            laser.classList.add("laser")
            laser.style.transformOrigin = "bottom"
            let degree = -40 + (4 * i);
            laser.style.transform = "rotate("+degree+"deg)";
            this.laserBeams.appendChild(laser)
        }
        lightsContainer.appendChild(this.laserBeams)
        this.strobeEffect = false;
        this.strobeInterval = null;
        this.movementEffect = false;
        this.movementInterval = null;
    }
    turnOn(){
        this.laserBeams.style.display = "";
    }
    turnOff(){
        this.laserBeams.style.display = "none";
    }
    changeColor(value) {
        for(var i=0; i<this.laserBeams.children.length; i++) {
            this.laserBeams.children[i].style.backgroundColor = value
        }
    }
    strobe() {
        if(this.strobeEffect) {
            this.strobeEffect = false;
            clearInterval(this.strobeInterval)
            for(var i=0; i<this.laserBeams.children.length; i++) {
                this.laserBeams.children[i].style.opacity = "1"
            }
        } else {
            // - Create [random number between 0.4 and 0.5] * [number of lasers]
            this.strobeEffect = true;
            for(var i=0; i<this.laserBeams.children.length; i++) {
                this.laserBeams.children[i].style.opacity = "0.4"
                this.strobeInterval = setInterval(function() {
                    this.laserBeams.children[i].style.opacity = "1"
                }, 500)
            }
        }
    }
    movement() {
        if(this.movementEffect) {
            this.movementEffect = false;
            // Movement OFF Code Here
        } else {
            this.movementEffect = true;
            // Movement ON Code Here
            // - Create [random number between -40 and 40] * [number of lasers]
        }
    }
}

// Change LASERS BEAMS Opacity on range input
document.getElementById("laserOpacity").addEventListener("input", function() {
    for(let i=0; i<laserGroups.length; i++) {
        console.log(laserGroups[i].laserBeams)
        laserGroups[i].laserBeams.style.opacity = this.value / 10
    }
})

// Change LASERS BEAMS Color on color input
document.getElementById("laserColor").addEventListener("input", function() {
    for(let i=0; i<laserGroups.length; i++) {
        laserGroups[i].changeColor(this.value)
    }
})

// Turns LASER BEAMS ON and OFF
document.getElementById("laserOnOffBtn").addEventListener("click", function() {
    if(lasersState) {
        lasersState = false;
        for(let i=0; i<laserGroups.length; i++) {
            laserGroups[i].turnOff()
        }
    } else {
        lasersState = true;
        for(let i=0; i<laserGroups.length; i++) {
            laserGroups[i].turnOn()
        }
    }
})

// Turns LASER BEAMS Strobe Effect ON and OFF
function strobeLasers() {
    for(let i=0; i<laserGroups.length; i++) {
        laserGroups[i].strobe()
    }
}

// Creates LASER BEAMS Group
function createLasers() {
    var laserGroup = new LaserBeams()
    laserGroups.push(laserGroup)
    console.log(laserGroups)
}

// Fades Out Splash Screen
function fadeOutSplash() {
    setTimeout(function() {
        document.getElementsByClassName("splash")[0].style.opacity = 0;
        setTimeout(function() {
            document.getElementsByClassName("splash")[0].style.display = "none";
        }, 1000)
    }, 1000)
}

// When Document Is Loaded
document.addEventListener("DOMContentLoaded", function() {
    fadeOutSplash()
})
