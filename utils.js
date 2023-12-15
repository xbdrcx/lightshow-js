// Activate Button Tooltip
$(function () {
    $('[data-toggle="tooltip"]').tooltip();
})

// On Any Button Click, Defocus from Button Afterward
document.querySelectorAll("button").forEach((button) => {
    button.addEventListener("click", function() { button.blur() })
})

// Open Modals
document.getElementById("openAbout").addEventListener("click", function() {
    $('#aboutModal').modal('show');
})
document.getElementById("openCommands").addEventListener("click", function() {
    $('#commandsModal').modal('show');
})

// Convert Hex Color To RGBA
function hexToRgbA(hex){
    var c;
    if(/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)){
        c= hex.substring(1).split('');
        if(c.length== 3){
            c= [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c= '0x'+c.join('');
        return 'rgba('+[(c>>16)&255, (c>>8)&255, c&255].join(',')+',1)';
    }
    throw new Error('Bad Hex');
}

// Check If Number Is Prime
function isPrime(num) {
    var sqrtnum=Math.floor(Math.sqrt(num));
      var prime = num != 1;
      for(var i=2; i<sqrtnum+1; i++) { // sqrtnum+1
          if(num % i == 0) {
              prime = false;
              break;
          }
      }
      return prime;
}

// When Document is Loaded
document.addEventListener("DOMContentLoaded", function() {
    let splashScreen = document.querySelector('.splash');
    setTimeout(function() {
        splashScreen.style.opacity = 0;
        setTimeout(()=>{
            splashScreen.classList.add('hidden')
            $("#warningModal").modal('show')
            setTimeout(function() {
                $("#warningModal").modal('hide')
            }, 2000)
        },610)
    }, 500)
})

// Avoid Dropdowns Closing on Click Inside
// (Lightbeam JS Beams Lasers Dropdowns)
$(function(){
    // Handle Show/Hide Toggle Yourself
    $(".dropdown-menu").on("click",function(e) {
        if($(e.currentTarget).hasClass("open"))
            $(e.currentTarget).toggleClass("open",false);
        else 
            $(e.currentTarget).toggleClass("open",true);
        e.preventDefault(); 
        return false;
    });
    // Suppressing Default Behavior
    $(".dropdown-menu").on("hide.bs.dropdown", doNothing);
    $(".dropdown-menu").on("show.bs.dropdown", doNothing);
    function doNothing(e) {
        e.preventDefault(); 
        return false;
    }
});



