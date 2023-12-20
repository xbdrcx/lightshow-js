// Im Preparing an Application capable of creating a 2D Party Environment

// 2D PARTY LIGHT-SYSTEM in JavaScript
// PARTY SIMULATION

// TO-DO
// Import AudioJudger JS > Generate pattern of lights based on imported audio frequencies
// Create predefined layouts w/ different light numbers and positions

let maincontainer = document.getElementById("beamcontainer");
let laserContainers = document.getElementsByClassName("laser-container");
let lightbeams = document.getElementsByClassName("lightbeam");

let lasers = document.getElementsByName("laser_light");
let beam_lights = document.getElementsByName("beam_light");

let lasers_btn = document.getElementById("lasersOnOff");
let beams_btn = document.getElementById("beamsOnOff");
let flash_btn = document.getElementById("flashScreen");
let strobelights_btn = document.getElementById("strobeLights");
let strobelasers_btn = document.getElementById("strobeLasers");
let strobebeam_btn = document.getElementById("beamStrobeBtn")

stateon_color = "#00ff04";
stateoff_color = "#ff0000";

class StrobeLight {
    constructor(parent, colormode, color) {
        this.parent = parent;
        this.colormode = colormode
        this.color = color;
        this.vl1 = document.createElement("div")
        this.vl1.id = "strobe_elem";
        this.vl1.setAttribute("name", "strobe_light");
        this.vl1.classList.add("strobelight");        
        for(var i=0;i<3;i++) {
            this.ledrow = document.createElement("div");
            this.ledrow.classList.add("row")
            for(var q=0;q<4;q++) {
                this.ledbox = document.createElement("div")
                this.ledbox.classList.add("led-box");
                this.led = document.createElement("div");
                this.led.classList.add("led-white");
                this.ledbox.appendChild(this.led)
                this.ledrow.appendChild(this.ledbox)
            }
            this.vl1.appendChild(this.ledrow)
        }
        this.parent.appendChild(this.vl1)
        this.parent.style.marginLeft = (numbeams * 650) + "px";
        // console.log(this)
        return this;
    }
}

class LightBeam {
    constructor(parent, aperture, distance, colormode, color, position) {
        this.parent = parent;
        this.aperture = aperture;
        this.distance = distance;
        this.color = color;
        this.position = position;
        this.colormode = colormode
        this.vl1 = document.createElement("div")
        this.vl1.id = "beam_elem";
        this.vl1.setAttribute("name", "beam_light");
        this.vl1.style.margin = "auto";
        this.vl1.style.marginLeft = "700px";
        this.vl1.style.rotate = "0deg";
        this.vl1.style.position = "absolute";
        this.vl1.style.borderLeft = this.aperture + "px solid transparent";
        this.vl1.style.borderRight = this.aperture + "px solid transparent";
        if (this.position == 1) {
            this.vl1.style.transformOrigin = "top";
            this.vl1.style.borderBottom = this.distance + "px solid " + this.color;
            this.vl1.style.borderBottomLeftRadius = "18px";
            this.vl1.style.borderBottomRightRadius = "18px";
        } else if (this.position == 0) {
            this.vl1.style.transformOrigin = "bottom";
            this.vl1.style.borderTop = this.distance + "px solid " + this.color;
            this.vl1.style.borderTopLeftRadius = "18px";
            this.vl1.style.borderTopRightRadius = "18px";
        }
        this.vl1.style.background = "linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)";
        this.vl1.classList.add("lightbeam");
        this.parent.appendChild(this.vl1)
        this.parent.style.marginLeft = (numbeams * 650) + "px";
        // console.log(this)
        return this;
    }
}

class Laser {
    constructor(parent, num_lasers, aperture, distance, colormode, color, position, velocity) {
        this.parent = parent;
        this.num_lasers = num_lasers;
        this.aperture = aperture;
        this.distance = distance;
        this.color = color;
        this.position = position;
        this.colormode = colormode
        this.rotation = NaN;
        this.velocity = velocity;
        this.vl1 = document.createElement("div")
        this.vl1.id = "laser_elem";
        this.vl1.setAttribute("name", "laser_light");
        this.vl1.style.margin = "auto";
        this.vl1.style.marginLeft = "500px";
        this.vl1.style.rotate = "0deg";
        this.vl1.style.position = "absolute";
        this.vl1.style.borderLeft = this.aperture + "px solid transparent";
        this.vl1.style.borderRight = this.aperture + "px solid transparent";
        if (this.position == 1) {
            this.vl1.style.transformOrigin = "top";
            this.vl1.style.borderBottom = this.distance + "px solid white";
            this.vl1.style.borderBottomLeftRadius = "18px";
            this.vl1.style.borderBottomRightRadius = "18px";
        } else if (this.position == 0) {
            this.vl1.style.transformOrigin = "bottom";
            this.vl1.style.borderTop = this.distance + "px solid white";
            this.vl1.style.borderTopLeftRadius = "18px";
            this.vl1.style.borderTopRightRadius = "18px";
        }
        this.vl1.style.background = "linear-gradient(to bottom, rgba(255,255,255,1) 0%,rgba(255,255,255,0) 100%)";
        this.vl1.classList.add("col-md-12");
        this.vl1.classList.add("laser");
        this.parent.appendChild(this.vl1)
        this.parent.style.marginLeft = (lasergroups * 450) + "px";
        // console.log(this)
        return this;
    }
}

/**
 * @param {int} num Number Of Light Beams
 * @param {int} aperture Light Aperture (in Pixels)
 * @param {int} distance Light Distance (in Pixels)
 * @param {int} colormode Color Mode | 0=NoColor, 1=Color, 2=Multicolor
 * @param {color} color Light Color (String, RGBA or Hex) Only Works On colormode=1
 * @param {int} position Light Position | 0=TopToBottom, 1=BottomToTop, 2=LeftToRight, 3=RightToLeft
 * @param {int} velocity Movement Velocity (in ms)
 */
function generateLasers(num, aperture, distance, colormode, color, position, velocity) {
    var laserComponent = document.createElement("div")
    // laserComponent.style.zIndex = "9999";
    laserComponent.classList.add("container-fluid")
    laserComponent.classList.add("laser-container")
    maincontainer.appendChild(laserComponent)
    var lasers = [];
    i = 0;
    for(b=0;b<num;b++) {
        var newlaser = new Laser(laserComponent, num, aperture, distance, colormode, color, position, velocity)
        lasers.push(newlaser);
        startRotation(lasers[b], i, velocity)
        if(isPrime(b)) {
            i += 12;
        } else {
            i -= 10
        }
    }
    lasergroups += 1;
    console.log(lasers)
    created_lasers.push(lasers);
}

/**
 * @param {Beam} beam Beam Instance
 * @param {int} diff Distance difference between beams
 * @param {int} velocity Movement Velocity (in ms)
 */
function startRotation(laser, diff, velocity) {
    var startbtn = document.getElementById("lasersOnOff");
    startbtn.innerHTML = "LASERS OFF <i class='fas fa-square' style='color: "+stateon_color+"'></i>";
    startbtn.removeAttribute("onclick");
    startbtn.setAttribute("onclick", "stopRotation()");
    laser.rotation = setInterval(function() {
        if (laser.colormode == 0) {
            var color = "white";
        } else if (laser.colormode == 1) {
            var color = laser.color;
        } else {
            var randColor = "#" + Math.floor(Math.random()*16777215).toString(16);
            var color = hexToRgbA(randColor);
        }
        if (laser.position == 0) {
            laser.vl1.style.borderTop = laser.distance + "px solid " + color;
        } else if (laser.position == 1) {
            laser.vl1.style.borderBottom = laser.distance + "px solid " + color;
        }
        if (movingright) {
            laser.vl1.style.rotate = (degs + diff) + "deg";
            degs -= 1;
            if (degs == -45) {
                movingleft = true;
                movingright = false;
            }
        }
        if (movingleft) {
            laser.vl1.style.rotate = (degs + diff) + "deg";
            degs += 1;
            if (degs == 20) {
                movingleft = false;
                movingright = true;
            }
        }
    }, velocity)
}

// Stop Lasers Rotation
function stopRotation() {
    if (lasers_state == true) {
        lasers_state = false;
        lasers_btn.innerHTML = "LASERS ON <i class='fas fa-square' style='color: "+stateoff_color+"'></i>";
        Array.prototype.forEach.call(lasers, function(laser) {
            laser.style.opacity = 0;
        })
    } else {
        lasers_state = true;
        lasers_btn.innerHTML = "LASERS OFF <i class='fas fa-square' style='color: "+stateon_color+"'></i>";
        Array.prototype.forEach.call(lasers, function(laser) {
            laser.style.opacity = parseFloat(laser_opacity);
        })
    }
}

// Stop Beams
function stopLightbeams() {
    if (beams_state == true) {
        beams_state = false;
        beams_btn.innerHTML = "BEAMS ON <i class='fas fa-square' style='color: "+stateoff_color+"'></i>";
        Array.prototype.forEach.call(beam_lights, function(beam) {
            beam.style.opacity = 0;
        })
    } else {
        beams_state = true;
        beams_btn.innerHTML = "BEAMS OFF <i class='fas fa-square' style='color: "+stateon_color+"'></i>";
        Array.prototype.forEach.call(beam_lights, function(beam) {
            beam.style.opacity = 0.7;
        })
    }
}

function laserOpacity(value) {
    if(value == 10) {
        newval = 1
    } else {
        newval = "0." + value
    }
    laser_opacity = newval
    if (lasers_state == true) {
        Array.prototype.forEach.call((lasers), function(laser) {
            laser.style.opacity = parseFloat(newval)
        })
    }
}

function laserSpeed(value) {
    console.log(value)
    for(q=0;q<created_lasers.length;q++) {
        i = 0;
        for(w=0;w<created_lasers[q].length;w++) {
            console.log(created_lasers[q]);
            clearInterval(created_lasers[q][w].rotation);
            startRotation(created_lasers[q][w], i, ms_per_beat * value)
            if(isPrime(created_lasers[q][w].num_lasers)) {
                i += 12;
            } else {
                i -= 10
            }
        }
    }
}

function flashScreen() {
    document.body.style.backgroundColor = "white";
    setTimeout(function() {
        document.body.style.backgroundColor = "black";
    }, 100)
}

var strobe = false;
var strobeInterval = NaN;

function strobeLights() {
    previousBeamState = beams_state;
    previousLaserState = lasers_state;
    if(strobe==true) {
        strobe = false;
        clearInterval(strobeInterval);
    } else {
        strobe = true;
        strobeInterval = setInterval(function() {
            flash_btn.click();
            beams_btn.click();
            lasers_btn.click();
        }, 1)
    }
}

var laserStrobe = false;
var strobeLaserInterval = NaN;
var laseropacity_val = 0;
function strobeLasers() {
    if(laserStrobe==true) {
        laserStrobe = false;
        clearInterval(strobeLaserInterval);
        Array.prototype.forEach.call((laserContainers), function(laser) {
            laser.style.opacity = laseropacity_val
        })
    } else {
        laserStrobe = true;
        laseropacity_val = laserContainers[0].style.opacity;
        strobeLaserInterval = setInterval(function() {
            lasers_btn.click();
            Array.prototype.forEach.call((laserContainers), function(laser) {
                laser.style.opacity = parseFloat(randomOpacity())
            })
        }, 1)
    }
}


var beamStrobe = false;
var strobeBeamInterval = NaN;
var beamopacity_val = 0;
function strobeBeams() {
    if(beamStrobe == true) {
        beamStrobe = false;
        clearInterval(strobeBeamInterval);
        Array.prototype.forEach.call((beam_lights), function(beam) {
            beam.style.opacity = beamopacity_val
        })
    } else {
        beamStrobe = true;
        beamopacity_val = laserContainers[0].style.opacity;
        strobeBeamInterval = setInterval(function() {
            beams_btn.click();
            Array.prototype.forEach.call((beam_lights), function(beam) {
                beam.style.opacity = parseFloat(randomOpacity())
            })
        }, 1)
    }
}

function randomOpacity(){
    var opac = 0;
       opac =  Math.random();
    return opac;
}

function displayMenubar() {
    if(menubar == true) {
        menubar = false;
        document.getElementById("app-title").style.display = "none";
        document.getElementById("menu-bar").style.display = "none";
    } else {
        menubar = true;
        document.getElementById("app-title").style.display = "";
        document.getElementById("menu-bar").style.display = "";
    }
}

function updateBpmRotation(value) {
    ms_per_beat = 1000 * 60 / value // BPM to milliseconds
    laserSpeed(ms_per_beat)
}

var beammotion = false;

function beamMotion() {
    if(beammotion==true) {
        beammotion = false;
        Array.prototype.forEach.call((beam_lights), function(lightbeam) {
            // lightbeam.style.animation = "";
            lightbeam.classList.remove("horizonmotion")
        })
    } else {
        beammotion = true;
        Array.prototype.forEach.call((beam_lights), function(lightbeam) {
            // console.log(lightbeam)
            // lightbeam.style.animation = "HorizonMotion .8s alternate ease-in-out infinite;";
            lightbeam.classList.add("horizonmotion")
        })
    }
}

function beamSpeed(value) {
    if (beammotion == true) {
        Array.prototype.forEach.call((beam_lights), function(lightbeam) {
            console.log(lightbeam)
            lightbeam.style.animation = "HorizonMotion ."+value+"s alternate ease-in-out infinite;";
        })
    }
}

function beamOpacity(value) {
    if(value == 10) {
        newval = 1
    } else {
        newval = "0." + value
    }
    beam_opacity = newval
    Array.prototype.forEach.call((lightbeams), function(lightbeam) {
        lightbeam.style.opacity = beam_opacity;
    })
}

// KEYBOARD BINDS
document.body.onkeypress = function(e) {
    if(e.key == "q" || e.code == "KeyQ" || e.keyCode == 81) {
        // OnClick Q > BEAMS ON/OFF
        beams_btn.click();
    } else if (e.key == "w" || e.code == "KeyW" || e.keyCode == 87) {
        // OnClick W > BEAMS Less Opacity
        document.getElementById("beamOpacityRange").value = document.getElementById("beamOpacityRange").value - 1;
        beamOpacity(document.getElementById("beamOpacityRange").value)
    } else if (e.key == "e" || e.code == "KeyE" || e.keyCode == 0) {
        // OnClick E > BEAMS More Opacity
        document.getElementById("beamOpacityRange").value = document.getElementById("beamOpacityRange").value + 1;
        beamOpacity(document.getElementById("beamOpacityRange").value)
    } else if (e.key == "r" || e.code == "KeyR" || e.keyCode == 82) {
        // OnClick R > BEAMS Less Speed
        
    } else if (e.key == "t" || e.code == "KeyT" || e.keyCode == 84) {
        // OnClick T > BEAMS More Speed
        
    } else if (e.key == "y" || e.code == "KeyY" || e.keyCode == 89) {
        // OnClick Y > Strobe BEAMS
        strobebeam_btn.click();
    } else if (e.key == "a" || e.code == "KeyA" || e.keyCode == 0) {
        // OnClick A > LASERS ON/OFF
        lasers_btn.click();
    } else if (e.key == "s" || e.code == "KeyS" || e.keyCode == 0) {
        // OnClick S > LASERS Less Opacity
        document.getElementById("laserOpacityRange").value = document.getElementById("laserOpacityRange").value - 1;
        laserOpacity(document.getElementById("laserOpacityRange").value)
    } else if (e.key == "d" || e.code == "KeyD" || e.keyCode == 0) {
        // OnClick D > LASERS More Opacity
        document.getElementById("laserOpacityRange").value = document.getElementById("laserOpacityRange").value + 1;
        laserOpacity(document.getElementById("laserOpacityRange").value)
    } else if (e.key == "f" || e.code == "KeyF" || e.keyCode == 0) {
        // OnClick F > LASERS Less Speed
        
    } else if (e.key == "g" || e.code == "KeyG" || e.keyCode == 0) {
        // OnClick G > LASERS More Speed
    
    } else if (e.key == "h" || e.code == "KeyH" || e.keyCode == 0) {
        // OnClick H > Strobe LASERS
        strobeLasers();
    } else if (e.key == "z" || e.code == "KeyZ" || e.keyCode == 0) {
        // OnClick Z > FLASH Screen
        flashScreen();
    } else if (e.key == "x" || e.code == "KeyX" || e.keyCode == 0) {
        // OnClick X > STROBE LIGHTS
        strobeLights();
    } else if (e.key == "m" || e.code == "KeyM" || e.keyCode == 77) {
        displayMenubar();
    }
}

var menubar = true;

var audio_bpm = 128
var ms_per_beat = (1000 * 60 / audio_bpm) / 10 // BPM to milliseconds / 10

var degs = 0;
var movingleft = false;
var movingright = true;

var numbeams = 0;
var lasergroups = 0;
var created_lasers = [];

var lasers_ap = 3.5;
var lasers_dist = 700;
var lasers_velo = ms_per_beat;
var lasers_state = true;
var beams_state = false;
var laser_opacity = 1;
var lasers_color = "red";

generateLasers(num=8, aperture=lasers_ap, distance=lasers_dist, colormode=1, color=lasers_color, position=0, velocity=lasers_velo)
generateLasers(num=8, aperture=lasers_ap, distance=lasers_dist, colormode=0, color=lasers_color, position=0, velocity=lasers_velo)
generateLasers(num=8, aperture=lasers_ap, distance=lasers_dist, colormode=1, color=lasers_color, position=0, velocity=lasers_velo)

// Fix Light Beams Containers
new LightBeam(laserContainers[0], 24, 700, 2, "white", 0)
new LightBeam(laserContainers[0], 24, 700, 2, "white", 0)

// new StrobeLight(laserContainers[0], 0, "white")
// new StrobeLight(laserContainers[0], 0, "white")

lasers_btn.click();


function fileUpload(file) {
    var URL = window.URL || window.webkitURL
    var type = file.type
    var canPlay = true
    if (canPlay === '') canPlay = 'no'
    file_type = type.split("/")[0]
    console.log(file_type)
    var message = 'Can play type "' + type + '": ' + canPlay
    // var isError = canPlay === 'no'
    var isError = false;
    console.log(message)
    if (isError) {
        // playpause_btn.setAttribute("disabled")
        // playpause_btn.removeAttribute("title")
        // playpause_btn.setAttribute("title", "Play")
        // file_title.innerHTML = "Error loading file";
        // file_title.style.color = "red";
        return
    } else {
        audiobeenpaused = false;
        var fileURL = URL.createObjectURL(file)
        player.src = fileURL;
        // file_title.innerHTML = file.name;
        // file_title.style.color = "white";
        // new Waveform(cont, fileURL)
        // drawAudio(fileURL)
    }
}


var file = document.getElementById("fileimporter");
let file_importer = document.getElementById("fileimporter");
document.getElementById("importbtn").addEventListener("click", function() {
    document.getElementById("fileimporter").click();
})

file_importer.addEventListener("change", function() {
    fileUpload(this.files[0]);
})

var player = document.getElementById("player");
window.onload = function() {
    
    file.onchange = function() {
      var files = this.files;
      player.src = URL.createObjectURL(files[0]);
      player.load();
      player.play();
      
      var context = new AudioContext();
      var src = context.createMediaElementSource(player);
      var analyser = context.createAnalyser();
  
      var canvas = document.getElementById("canvas");
      canvas.width = 1600;
      canvas.height = 800;
      var ctx = canvas.getContext("2d");
  
      src.connect(analyser);
      analyser.connect(context.destination);
  
      analyser.fftSize = 256;
  
      var bufferLength = analyser.frequencyBinCount;
      console.log(bufferLength);
  
      var dataArray = new Uint8Array(bufferLength);
  
      var WIDTH = canvas.width;
      var HEIGHT = canvas.height;
  
      var barWidth = (WIDTH / bufferLength) * 1.5; 
      var barHeight;
      var x = 0;
      var groupone = 0;
      var grouptwo = 0;
      var groupthree = 0;
      var groupfour = 0;

        var groupActivation = 90;

      function renderFrame() {
        requestAnimationFrame(renderFrame);

        groupone = 0;
        grouptwo = 0;
        groupthree = 0;
        groupfour = 0;

        x = 0;
  
        analyser.getByteFrequencyData(dataArray);
  
        ctx.fillStyle = "#000";
        ctx.fillRect(0, 0, WIDTH, HEIGHT);
  
        for (var i = 0; i < bufferLength; i++) {

          barHeight = dataArray[i];

          var r = barHeight;
          var g = (i/bufferLength) + barHeight;
          var b = barHeight;
  
          ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
          ctx.fillRect(x, HEIGHT - (barHeight * 3), barWidth, barHeight * 3);
  
          x += barWidth + 1;

          if(i <= 32) {
            groupone += barHeight / 31;
          } else if (i <= 64) {
            grouptwo += barHeight / 31;
          } else if (i <= 97) {
            groupthree += barHeight / 31;
          } else if (i <= 128) {
            groupfour += barHeight / 31;
          }

        }

        if (groupone > groupActivation) {
            groupone = 1;
        } else {
            groupone = 0;
        }
        if (grouptwo > groupActivation) {
            grouptwo = 1;
        } else {
            grouptwo = 0;
        }
        if (groupthree > groupActivation) {
            groupthree = 1;
        } else {
            groupthree = 0;
        }
        if (groupfour > groupActivation) {
            groupfour = 1;
        } else {
            groupfour = 0;
        }

        group = [groupone, grouptwo, groupthree, groupfour]

        autoLights(group)

        console.log(group)

      }
  
      player.play();
      renderFrame();
    };
};

function autoLights(values) {
    if(values[0] == 1) {
        strobelasers_btn.click();
    }
    if (values[1] == 1) {
        beams_btn.click();
    }
    if (values[2] == 1) {
        // strobebeam_btn.click();
        flash_btn.click();
    }
    if (values[3] == 1) {
        flash_btn.click();
    }
}

document.getElementById("laserColor").addEventListener("change", function() {
    Array.prototype.forEach.call((lasers), function(laser) {
        laser.style.background = this.value;
        console.log("1")
        console.log(laser)
    })
})