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
        return
    } else {
        audiobeenpaused = false;
        var fileURL = URL.createObjectURL(file)
        player.src = fileURL;
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
            console.log(group)

            autoLights(group)
        }
  
        document.getElementById("playLights").removeAttribute("disabled")

        document.getElementById("playLights").addEventListener("click", function() {
            if(ligthsPlaying) {
                ligthsPlaying = false
                document.getElementById("playLights").children[0].src = "../icons/play-white.ico"
                player.pause();
            } else {
                ligthsPlaying = true
                document.getElementById("playLights").children[0].src = "../icons/pause-white.ico"
                player.play();
                renderFrame();
            }
        })

        player.addEventListener("ended", function() {
            ligthsPlaying = false
            document.getElementById("playLights").children[0].src = "../icons/play-white.ico"
            if(!menuState) {
                menuState = true
                menuContainer.style.opacity = "1"
            }
        })

    };
};