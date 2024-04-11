// Lightshow v2.1
// Developed by Bruno Cruz
// Github => https://www.github.com/xbdrcx

// General Variables
var lightsMenusState = false
var menuState = true
var ligthsPlaying = false
var lights = false
// Create Light Variables
var lightTypeButtons = document.querySelectorAll("input[name='lightType']")
var lightPositionButtons = document.querySelectorAll("input[name='lightPosition']")
var usedPositions = []
// Laser Control Variables
var laserGroups = []
var lasersColor = "red"
var lasersState = true
var lasersMoving = false
var laserAperture = 2
var numLasers = 15
var angleAperture = 450
var minLaserAngle = -(angleAperture/numLasers)
var maxLaserAngle = angleAperture/numLasers
// Beam Control Variables
var beams = []
var beamsColor = "white"
var beamsState = true
var beamsMoving = false
var beamAperture = 20
var beamIntensity = 0.6
// Light Control Variables
var movementSpeed = 150
var lightDistance = document.getElementById("lights-container").offsetHeight // Before offsetHeight, value was 750
var strobeSpeed = 100
var lightsStrobe = false;
var lightsStrobeInterval = null;
var screenStrobe = false;
var screenStrobeInterval = null;
var lightsTop = [false, false, false, false, false, false, false]
var lightsBottom = [false, false, false, false, false, false, false]
var lightsLeft = [false, false, false, false, false]
var lightsRight = [false, false, false, false, false]
var lightElements = [lightsTop, lightsBottom, lightsLeft, lightsRight]
// Containers
const menuContainer = document.getElementById("lights-menu")
const lightsContainer = document.getElementById("lights-container")
// Buttons (General)
const autoLightsButtons = document.getElementsByClassName("autolightsBtn")
const flashButton = document.getElementById("flashScreenBtn")
const strobeScreenButton = document.getElementById("strobeScreenBtn")
const strobeLightsButton = document.getElementById("strobeLightsBtn")
const confirmAddLight = document.getElementById("addLightBtn")
const openAboutButtons = document.getElementsByClassName("openAboutBtn")
const openAddLightButtons = document.getElementsByClassName("openLightBtn")
const openManageLightButtons = document.getElementsByClassName("manageLightBtn")
const showhideControlsButtons = document.getElementsByClassName("showhideControlsBtn")
// Buttons (Lasers)
const onOffLasersButton = document.getElementById("laserOnOffBtn")
const moveLasersButton = document.getElementById("moveLasersBtn")
const laserOptionsButton = document.getElementById("lasersDropdown")
// Buttons (Beams)
const onOffBeamsButton = document.getElementById("beamsOnOffBtn")
const moveBeamsButton = document.getElementById("beamMotionBtn")
const showhidemenusButton = document.getElementById("showhideMenusBtn")
// Buttons (Manage Light)
const removeLightButton = document.getElementById("removeLightBtn")


class LaserBeams {
    constructor(orientation, positionNum) {
        let numLaserBeams = document.getElementsByClassName("laserBeams").length
        this.laserBeams = document.createElement("div") 
        this.laserBeams.classList.add("laserBeams")
        this.laserBeams.id = "lasers" + numLaserBeams
        this.lightPosition = orientation + "-" + positionNum
        var marginValue = (parseInt(positionNum)+1) * 12.5
        for(let i=0; i<numLasers+1; i++) {
            var laser = document.createElement("div")
            laser.classList.add("laser")
            let degree = minLaserAngle + (4 * i);
            laser.style.transform = "rotate("+degree+"deg)";
            laser.style.borderTop = lightDistance + "px solid " + lasersColor
            laser.style.borderLeft = laserAperture + "px solid transparent"
            laser.style.borderRight = laserAperture + "px solid transparent"
            this.laserBeams.appendChild(laser)
            if(orientation == "top") {
                laser.style.transformOrigin = "top"
                this.laserBeams.style.marginLeft = marginValue + "%" 
            } else if(orientation == "bottom") {
                laser.style.transformOrigin = "bottom"
                this.laserBeams.style.marginLeft = marginValue + "%" 
            } else if(orientation == "left") {
                laser.style.transformOrigin = "left"
            } else if(orientation == "right") {
                laser.style.transformOrigin = "right"
            }
        }
        lightsContainer.appendChild(this.laserBeams)
        this.movementEffect = false;
        this.movementInterval = null;
        this.randLaserColorEffect = false;
        this.randLaserColorInterval = null;
        this.randGroupColorEffect = false;
        this.randGroupColorInterval = null;
        this.strobe()
        if(!lasersState) {
            this.laserBeams.style.display = "none"
        }
        if(lasersMoving) {
            this.movement()
        }
    }
    turnOn(){
        this.laserBeams.style.display = "";
    }
    turnOff(){
        this.laserBeams.style.display = "none";
    }
    changeColor(value) {
        for(var i=0; i<this.laserBeams.children.length; i++) {
            this.laserBeams.children[i].style.borderTop = lightDistance + "px solid " + value
        }
    }
    randomGroupColor() {
        if(this.randGroupColorEffect) {
            this.randGroupColorEffect = false
            clearInterval(this.randGroupColorInterval)
            var color = document.getElementById("laserColor").value
            for(var i=0; i<this.laserBeams.children.length; i++) {
                this.laserBeams.children[i].style.backgroundColor = color
            }
        } else {
            var elem = this.laserBeams
            this.randGroupColorEffect = true
            this.randGroupColorInterval = setInterval(function() {
                randGroupColor(elem)
            }, 50)
        }
    }
    randomLaserColor() {
        if(this.randLaserColorEffect) {
            this.randLaserColorEffect = false
            clearInterval(this.randLaserColorInterval)
            for(var i=0; i<this.laserBeams.children.length; i++) {
                this.laserBeams.children[i].style.borderTop = lightDistance + "px solid " + lasersColor
            }
        } else {
            this.randLaserColorEffect = true
            var elem = this.laserBeams
            this.randLaserColorInterval = setInterval(function() {
                randLasColor(elem)
            }, 50)
        }
    }
    strobe() {
        var elem = this.laserBeams
        setInterval(function() {
            strobeLasers2(elem)
        }, 50)
    }
    movement() {
        if(this.movementEffect) {
            this.movementEffect = false;
            clearInterval(this.movementInterval)
            for(let i=0; i<this.laserBeams.children.length; i++) {
                let degree = minLaserAngle + (4 * i);
                this.laserBeams.children[i].style.transform = "rotate("+degree+"deg)";
            }
            lasersMoving = false
        } else {
            this.movementEffect = true;
            lasersMoving = true
            laserMovement(this)
        }
    }
}

function randGroupColor(elem) {
    let randColor = Math.floor(Math.random()*16777215).toString(16)
    for(var i=0; i<elem.children.length; i++) {
        elem.children[i].style.borderTop = lightDistance + "px solid " + randColor
    }
}

function randLasColor(elem) {
    for(var i=0; i<elem.children.length; i++) {
        let randColor = Math.floor(Math.random()*16777215).toString(16)
        elem.children[i].style.borderTop = lightDistance + "px solid " + randColor
    }
} 

function strobeLasers2(elem) {
    for(let i=0; i<elem.children.length; i++) {
        let randOpacity = (Math.random() * (0.9 - 0.1) + 0.1).toFixed(2)
        elem.children[i].style.opacity = randOpacity
    }
}

function laserMovement(laserGroup) {
    laserGroup.movementInterval = setInterval(function() {
        for(let i=0; i<laserGroup.laserBeams.children.length; i++) {
            var randDegree = (Math.random() * (maxLaserAngle - (minLaserAngle)) + (minLaserAngle)).toFixed(0)
            laserGroup.laserBeams.children[i].style.transform = "rotate("+randDegree+"deg)";
        }
    }, movementSpeed)
}

class LightBeam {
    constructor(orientation, positionNum) {
        let numLightBeams = document.getElementsByClassName("lightbeam").length
        this.lightbeam = document.createElement("div") 
        this.lightbeam.classList.add("lightbeam")
        this.lightbeam.id = "beam" + numLightBeams
        this.lightPosition = orientation + "-" + positionNum
        var marginValue = (parseInt(positionNum)+1) * 12.25
        this.lightbeam.style.borderLeft = beamAperture + "px solid transparent"
        this.lightbeam.style.borderRight = beamAperture + "px solid transparent"
        this.lightbeam.style.marginLeft = marginValue + "%"
        this.lightbeam.style.opacity = beamIntensity
        if(orientation == "top") {
            this.lightbeam.style.transformOrigin = "top"
            this.lightbeam.style.borderBottom = lightDistance + "px solid " + beamsColor
            this.lightbeam.style.borderBottomLeftRadius = "18px"
            this.lightbeam.style.borderBottomRightRadius = "18px"
        } else if(orientation == "bottom") {
            this.lightbeam.style.transformOrigin = "bottom"
            this.lightbeam.style.borderTop = lightDistance + "px solid " + beamsColor
            this.lightbeam.style.borderTopLeftRadius = "18px"
            this.lightbeam.style.borderTopRightRadius = "18px"
        } else if(orientation == "left") {
            this.lightbeam.style.transformOrigin = "left"
            this.lightbeam.style.borderRight = lightDistance + "px solid " + beamsColor
            this.lightbeam.style.borderTopRightRadius = "18px"
            this.lightbeam.style.borderBottomRightRadius = "18px"
        } else if(orientation == "right") {
            this.lightbeam.style.transformOrigin = "right"
            this.lightbeam.style.borderLeft = lightDistance + "px solid " + beamsColor
            this.lightbeam.style.borderTopLeftRadius = "18px"
            this.lightbeam.style.borderBottomLeftRadius = "18px"
        }
        lightsContainer.appendChild(this.lightbeam)
        this.movementEffect = false;
        this.movementInterval = null;
        this.randBeamColorEffect = false;
        this.randBeamColorInterval = null;
        if(!beamsState) {
            this.lightbeam.style.display = "none"
        }
        if(beamsMoving) {
            this.movement()
        }
    }
    turnOn(){
        this.lightbeam.style.opacity = beamIntensity;
    }
    turnOff(){
        this.lightbeam.style.opacity = 0;
    }
    changeColor(value) {
        var lightOrientation = this.lightPosition.split("-")[0]
        if(lightOrientation == "top") {
            this.lightbeam.style.borderBottom = lightDistance + "px solid " + value
        } else if (lightOrientation == "bottom") {
            this.lightbeam.style.borderTop = lightDistance + "px solid " + value
        } else if (lightOrientation == "left") {
            this.lightbeam.style.borderRight = lightDistance + "px solid " + value
        } else if (lightOrientation == "right") {
            this.lightbeam.style.borderLeft = lightDistance + "px solid " + value
        }
    }
    randomColor() {
        if(this.randBeamColorEffect) {
            this.randBeamColorEffect = false
            clearInterval(this.randBeamColorInterval)
        } else {
            this.randBeamColorEffect = true
            var elem = this.lightbeam
            this.randBeamColorInterval = setInterval(function() {
                // randLasColor(elem)
            }, 50)
        }
    }
    strobe() {
        var elem = this.lightbeam
        setInterval(function() {
            // strobeLasers2(elem)
        }, 50)
    }
    movement() {
        if(this.movementEffect) {
            this.movementEffect = false;
            beamsMoving = false
            this.lightbeam.classList.remove("horizonmotion")
        } else {
            // - Move Left to Right
            this.movementEffect = true;
            beamsMoving = true
            this.lightbeam.classList.add("horizonmotion")
        }
    }
}

// Keyboard Bindings
document.body.onkeypress = function(e) {
    if(lights) {
        if(e.key === "z" || e.code === "KeyZ") {
            flashScreen()
        } else if (e.key === "a" || e.code === "KeyA") {
            onOffLasersButton.click();
        } else if (e.key === "h" || e.code === "KeyH") {
            moveLasersButton.click();
        } else if (e.key === "q" || e.code === "KeyQ") {
            onOffBeamsButton.click();
        } else if (e.key === "y" || e.code === "KeyY") {
            moveBeamsButton.click();
        } else if (e.key === "x" || e.code === "KeyX") {
            strobeLights()
        } else if (e.key === "c" || e.code === "KeyC") {
            strobeScreen()
        } else if (e.key === "m" || e.code === "KeyM") {
            hideMenu()
        } else if (e.key === "n" || e.code === "KeyN") {
            showhidemenusButton.click()
        }
    } 
}

// recordLightsButton.addEventListener("click", function() {
//     if(isRecording) {
//         isRecording = false
//         document.getElementById("recordLightsColor").style.color = "grey"
//         // Code Stop Screen Recording Goes Here
//     } else {
//         isRecording = true
//         recordLights()
//     }
// })

// function recordLights() {
//     let constraints = {
//         video: {
//             mediaSource: "screen"
//         }
//     };
//     navigator.mediaDevices.getUserMedia(constraints).then(mediaStream => {
//         document.getElementById("recordLightsColor").style.color = "red"
//         console.log("Recording")
//         console.log(mediaStream)
//         // Code Screen Recording Goes Here
//     });
// }

// On Flash Button Click
flashButton.addEventListener("click", function(e) {
    e.preventDefault()
    e.stopPropagation();
    flashScreen()
})

function flashScreen() {
    document.body.style.backgroundColor = "white";
    document.getElementById("apptitle").style.color = "black"
    var buttons = document.getElementsByName("menuButton")
    buttons.forEach((button) => {
        button.style.color = "black"
    })
    document.getElementById("openCommands").children[0].src = "../icons/keyboard.ico"
    for (let i = 0; i < openAboutButtons.length; i++) {
        openAboutButtons[i].children[0].src = "../icons/info.png"
    }
    setTimeout(function() {
        document.body.style.backgroundColor = "black";
        document.getElementById("apptitle").style.color = "white"
        buttons.forEach((button) => {
            button.style.color = "white"
        })
        document.getElementById("openCommands").children[0].src = "../icons/keyboard_white.ico"
        for (let i = 0; i < openAboutButtons.length; i++) {
            openAboutButtons[i].children[0].src = "../icons/info_white.ico"
        }
    }, 100)
}

document.getElementById("laserSpeed").addEventListener("input", function() {
    movementSpeed = this.value
    moveLasers()
})

// Change LASERS BEAMS Opacity on range input
document.getElementById("laserIntensity").addEventListener("input", function() {
    for(let i=0; i<laserGroups.length; i++) {
        laserGroups[i].laserBeams.style.opacity = this.value / 10
    }
})

// Change LASERS BEAMS Color on color input
document.getElementById("laserColor").addEventListener("input", function() {
    for(let i=0; i<laserGroups.length; i++) {
        laserGroups[i].changeColor(this.value)
    }
})

// Change LIGHT BEAMS Opacity on range input
document.getElementById("beamIntensity").addEventListener("input", function() {
    beamIntensity = this.value / 10
    for(let i=0; i<beams.length; i++) {
        beams[i].lightbeam.style.opacity = beamIntensity
    }
})

// Change LIGHT BEAMS Color on color input
document.getElementById("beamColor").addEventListener("input", function() {
    beamsColor = this.value
    for(let i=0; i<beams.length; i++) {
        beams[i].changeColor(this.value)
    }
})

// Turns LIGHT BEAMS ON and OFF
onOffBeamsButton.addEventListener("click", function() {
    if(beamsState) {
        beamsState = false;
        document.getElementById("beamsStateColor").style.color = "red"
        for(let i=0; i<beams.length; i++) {
            beams[i].turnOff()
        }
    } else {
        beamsState = true;
        document.getElementById("beamsStateColor").style.color = "green"
        for(let i=0; i<beams.length; i++) {
            beams[i].turnOn()
        }
    }
})

// Turns LASER BEAMS ON and OFF
onOffLasersButton.addEventListener("click", function(e) {
    e.preventDefault()
    if(lasersState) {
        lasersState = false;
        document.getElementById("lasersStateColor").style.color = "red"
        for(let i=0; i<laserGroups.length; i++) {
            laserGroups[i].turnOff()
        }
    } else {
        lasersState = true;
        document.getElementById("lasersStateColor").style.color = "green"
        for(let i=0; i<laserGroups.length; i++) {
            laserGroups[i].turnOn()
        }
    }
})

// Turns LASER BEAMS Random Laser Color ON and OFF
function randomLasersColor() {
    for(let i=0; i<laserGroups.length; i++) {
        laserGroups[i].randomLaserColor()
    }
}
// Turns LASER BEAMS Random Group Color ON and OFF
function randomLaserGroupColor() {
    for(let i=0; i<laserGroups.length; i++) {
        laserGroups[i].randomGroupColor()
    }
}
// Turns LASER BEAMS Movement Effect ON and OFF
function moveLasers() {
    for(let i=0; i<laserGroups.length; i++) {
        laserGroups[i].movement()
    }
}

function beamMotion() {
    for(let i=0; i<beams.length; i++) {
        beams[i].movement()
    }
}

// Creates LASER BEAMS Group
function createLasers() {
    var laserGroup = new LaserBeams()
    laserGroups.push(laserGroup)
}

lightTypeButtons.forEach((button) => {
    button.addEventListener("click", function() {
        lightPositionButtons.forEach((button) => {
            button.removeAttribute("disabled")
        })
        for(let i=0; i<usedPositions.length; i++) {
            document.getElementById(usedPositions[i]).setAttribute("disabled", true)              
        }
    })
})

function strobeScreen() {
    if(screenStrobe) {
        screenStrobe = false
        clearInterval(screenStrobeInterval)
    } else {
        screenStrobe = true
        screenStrobeInterval = setInterval(function() {
            flashButton.click()
        }, strobeSpeed)
    }
}

function strobeLights() {
    if(lightsStrobe) {
        lightsStrobe = false
        clearInterval(lightsStrobeInterval)
    } else {
        lightsStrobe = true
        lightsStrobeInterval = setInterval(function() {
            onOffLasersButton.click()
            onOffBeamsButton.click()
        }, strobeSpeed)
    }
}

lightPositionButtons.forEach((checkbox) => {
    checkbox.addEventListener("click", function() {
        var selectedPositions = document.querySelectorAll("input[name='lightPosition']:checked")
        if(selectedPositions.length > 0) {
            confirmAddLight.removeAttribute("disabled")
        } else {
            confirmAddLight.setAttribute("disabled", true)
        }
    })
})

// Adds selected light element to the system
function addLightElement() {
    var lightType = document.querySelector('input[name="lightType"]:checked').value
    var selectedPositions = document.querySelectorAll("input[name='lightPosition']:checked")
    selectedPositions.forEach((selectedPosition) => {
        let lightOrientation = selectedPosition.value.split("-")[0]
        let lightNumber = selectedPosition.value.split("-")[1]
        if(lightType == "lightbeam") {
            var beam = new LightBeam(lightOrientation, lightNumber)
            beams.push(beam)
            document.querySelector("input[name='lightPosition']:checked").innerHTML = "B"
        } else if (lightType == "lasers") {
            var laserGroup = new LaserBeams(lightOrientation, lightNumber)
            laserGroups.push(laserGroup)
            document.querySelector("input[name='lightPosition']:checked").innerHTML = "L"
        }
        usedPositions.push(selectedPosition.value)
        if (lightOrientation == "top") {
            lightsTop[lightNumber] = true
        } else if (lightOrientation == "bottom") {
            lightsBottom[lightNumber] = true
        } else if (lightOrientation == "left") {
            lightsLeft[lightNumber] = true
        } else if (lightOrientation == "right") {
            lightsRight[lightNumber] = true
        }
    })
    // Enable Hide/Show Menu Button
    showhidemenusButton.removeAttribute("disabled")
    resetAddLightModal()
    activateButtons()
    lights = true
}

// Hide-Show Menu Bar
// function hideMenu() {
//     if(menuState) {
//         menuState = false
//         menuContainer.style.opacity = "0"
//         menuContainer.style.display = "none"
//         lightsContainer.style.minHeight = "100vh"
//         lightsContainer.style.height = "100vh"
//         for(let i=0; i<beams.length; i++) {
//             beams[i].lightbeam.style.position = "relative"
//             beams[i].lightbeam.style.top = 0
//         }
//     } else {
//         menuState = true
//         menuContainer.style.opacity = "1"
//         menuContainer.style.display = ""
//         lightsContainer.style.minHeight = "80vh"
//         lightsContainer.style.height = "80vh"
//     }
// }

function autoLights(values) {
    if(values[0] == 1) {
        onOffLasersButton.click();
    }
    if (values[1] == 1) {
        onOffBeamsButton.click();
    }
    if (values[2] == 1) {
        flashButton.click();
    }
    if (values[3] == 1) {
        moveLasers()
    }
}

// Reset AddLightModal Buttons to Initial State
function resetAddLightModal() {
    $("#addLightModal").modal("hide")
    lightPositionButtons.forEach((button) => {
        button.setAttribute("disabled", true)
    })
    confirmAddLight.setAttribute("disabled", true)
    lightPositionButtons.forEach((button) => {
        button.setAttribute("disabled", true)
    })
    var elements = document.getElementsByTagName("input");
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].type == "checkbox") {
            elements[i].checked = false;
        }
        if (elements[i].type == "radio") {
            elements[i].checked = false;
        }
    }
}

// Activate Disabled Buttons When Light is Added
function activateButtons() {
    flashButton.removeAttribute("disabled")
    strobeLightsButton.removeAttribute("disabled")
    strobeScreenButton.removeAttribute("disabled")
    for (let i = 0; i < autoLightsButtons.length; i++) {
        autoLightsButtons[i].removeAttribute("disabled")
    }
    for (let i = 0; i < openManageLights.length; i++) {
        openManageLightButtons[i].removeAttribute("disabled")
    }
    for (let i = 0; i < showhideControlsButtons.length; i++) {
        showhideControlsButtons[i].removeAttribute("disabled")
    }
}

function disabledButtons() {
    flashButton.setAttribute("disabled", true)
    strobeLightsButton.setAttribute("disabled", true)
    strobeScreenButton.setAttribute("disabled", true)
    for (let i = 0; i < autoLightsButtons.length; i++) {
        autoLightsButtons[i].setAttribute("disabled", true)
    }
    for (let i = 0; i < openManageLights.length; i++) {
        openManageLightButtons[i].setAttribute("disabled", true)
    }
    for (let i = 0; i < showhideControlsButtons.length; i++) {
        showhideControlsButtons[i].setAttribute("disabled", true)
    }
}

function removeLight() {
    let selectedType = document.querySelector("input[name='manageLightType']:checked").value
    let selectedLight = document.querySelector("input[name='manageLightPosition']:checked")
    if(selectedType == "lightbeam") {
        for(let i=0; i<beams.length; i++) {
            if(beams[i].lightPosition == selectedLight.id) {
                beams[i].lightbeam.remove()
                beams.splice(i, 1)
            }
        }
    }
    if(selectedType == "lasers") {
        for(let i=0; i<laserGroups.length; i++) {
            if(laserGroups[i].lightPosition == selectedLight.id) {
                laserGroups[i].laserBeams.remove()
                laserGroups.splice(i, 1)
            }
        }
    }
    selectedLight.setAttribute("checked", false)
    selectedLight.setAttribute("disabled", true)
    if(laserGroups.length == 0 && beams.length == 0) {
        lights = false
        disabledButtons()
    }
    usedPositions.forEach((value) => {
        if(value == selectedLight.value) {
            index = usedPositions.indexOf(value)
            usedPositions.splice(index, 1)
        }
    })
}

function randomizeLights() {
    var maxNumLights = lightsTop.length + lightsBottom.length + lightsLeft.length + lightsRight.length
    var hasBeams = Boolean(Math.round(Math.random()))
    var hasLasers = Boolean(Math.round(Math.random()))
    var orientations = ["top", "bottom", "left", "right"]
    if(hasBeams) {
        var randNumBeams = (Math.random() * maxNumLights/2).toFixed(0)
        for(let i=0; i<randNumBeams; i++) {
            let lightOrientation = orientations[Math.floor(Math.random() * orientations.length)]
            if (lightOrientation == "top") {
                let lightNumber = selectedPosition.value.split("-")[1]
            } else if (lightOrientation == "bottom") {
                let lightNumber = selectedPosition.value.split("-")[1]
            } else if (lightOrientation == "left") {
                let lightNumber = selectedPosition.value.split("-")[1]
            } else if (lightOrientation == "right") {
                let lightNumber = selectedPosition.value.split("-")[1]
            }
            var beam = new LightBeam(lightOrientation, lightNumber)
            beams.push(beam)
        }
    }
    if(hasLasers) {
        var randNumLaserGroups = (Math.random() * maxNumLights/2).toFixed(0)
    }
    // 

    if(lightType == "lightbeam") {
        var beam = new LightBeam(lightOrientation, lightNumber)
        beams.push(beam)
        document.querySelector("input[name='lightPosition']:checked").innerHTML = "B"
    } else if (lightType == "lasers") {
        var laserGroup = new LaserBeams(lightOrientation, lightNumber)
        laserGroups.push(laserGroup)
        document.querySelector("input[name='lightPosition']:checked").innerHTML = "L"
    }
    usedPositions.push(selectedPosition.value)
    if (lightOrientation == "top") {
        lightsTop[lightNumber] = true
    } else if (lightOrientation == "bottom") {
        lightsBottom[lightNumber] = true
    } else if (lightOrientation == "left") {
        lightsLeft[lightNumber] = true
    } else if (lightOrientation == "right") {
        lightsRight[lightNumber] = true
    }

}

// UTILS
// On Any Button Click, Defocus from Button Afterward
document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", function() { button.blur() })
})
$('.dropdown-menu button, .dropdown-menu label').click(function(e) {
    e.stopPropagation();
    e.preventDefault();
});
// Open-Close Modals
for (let i=0; i < openAboutButtons.length; i++) {
    openAboutButtons[i].addEventListener("click", function() {
        $('#aboutModal').modal('show');
    })
}
document.getElementById("openCommands").addEventListener("click", function() {
    $('#commandsModal').modal('show');
})

for (var i = 0; i < openAddLightButtons.length; i++) {
    openAddLightButtons[i].addEventListener("click", function() {
        for(let i=0; i<usedPositions.length; i++) {
            document.getElementById(usedPositions[i]).setAttribute("disabled", true)              
        }
        $('#addLightModal').modal('show');
    })
}

for (var i = 0; i < openManageLightButtons.length; i++) {
    openManageLightButtons[i].addEventListener("click", function() {
        let manageLightBeamsButton = document.getElementById("manageLightBeams")
        let manageLasersButton = document.getElementById("manageLasers")
        let modal = document.getElementById("manageLightsModal")
        let radioButtons = modal.querySelectorAll("input[name='manageLightPosition']")
        radioButtons.forEach((radioButton) => {
            radioButton.setAttribute("disabled", true)
        })
        if(beams.length > 0) {
            manageLightBeamsButton.removeAttribute("disabled")
        }
        if(laserGroups.length > 0) {
            manageLasersButton.removeAttribute("disabled")
        }
        manageLightBeamsButton.addEventListener("click", function() {
            // Verifica Se Existem BEAMS E Ativa Apenas RadioButtons Das Suas Posiçoes
            radioButtons.forEach((radioButton) => {
                radioButton.setAttribute("disabled", true)
                radioButton.addEventListener("click", function() {
                    removeLightButton.removeAttribute("disabled")
                })
                for(let i=0; i<beams.length; i++) {
                    if(radioButton.id == beams[i].lightPosition) {
                        radioButton.removeAttribute("disabled")
                    }
                }
            })
        })
        manageLasersButton.addEventListener("click", function() {
            // Verifica Se Existem LASERS E Ativa Apenas RadioButtons Das Suas Posiçoes
            radioButtons.forEach((radioButton) => {
                radioButton.setAttribute("disabled", true)
                radioButton.addEventListener("click", function() {
                    removeLightButton.removeAttribute("disabled")
                })
                for(let i=0; i<laserGroups.length; i++) {
                    if(radioButton.id == laserGroups[i].lightPosition) {
                        radioButton.removeAttribute("disabled")
                    }
                }
            })
        })
        $("#manageLightsModal").modal("show");
    })
}


document.getElementById("cancelAddLight").addEventListener("click", function() {
    $("#addLightModal").modal("hide");
    resetAddLightModal();
})

document.getElementById("closeManageLights").addEventListener("click", function() {
    $("#manageLightsModal").modal("hide");
})

for (let i=0; i < showhideControlsButtons.length; i++) {
    showhideControlsButtons[i].addEventListener("click", function() {
        console.log("clicking")
        if (lightsMenusState == true) {
            lightsMenusState = false
            $(".draggableDiv").fadeOut()
            for (let i=0; i < showhideControlsButtons.length; i++) {
                showhideControlsButtons[i].innerHTML = "Show Controls"
            }
        } else {
            lightsMenusState = true
            $(".draggableDiv").fadeIn()
            for (let i=0; i < showhideControlsButtons.length; i++) {
                showhideControlsButtons[i].innerHTML = "Hide Controls"
            }
        }
    })
}

function initScreen() {
    setTimeout(function() {
        document.getElementsByClassName("splash")[0].style.opacity = 0;
        setTimeout(function() {
            document.getElementsByClassName("splash")[0].style.display = "none";
        }, 500)
        $("#warningModal").modal('show')
        setTimeout(function() {
            $("#warningModal").modal('hide')
        }, 1500)
    }, 500)
}

// Make the DIV element draggable:
dragElement(document.getElementById("beamMenu"));
dragElement(document.getElementById("laserMenu"));
dragElement(document.getElementById("lightsMenu"));
function dragElement(elmnt) {
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    if (document.getElementById(elmnt.id + "Header")) {
        // if present, the header is where you move the DIV from:
        document.getElementById(elmnt.id + "Header").onmousedown = dragMouseDown;
    } else {
        // otherwise, move the DIV from anywhere inside the DIV:
        elmnt.onmousedown = dragMouseDown;
    }
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

// When Document Is Loaded
document.addEventListener("DOMContentLoaded", function() {
    initScreen()
})
