gamePattern = [];
userClickedPattern = [];
var level =0;
buttonColors = ["red", "blue", "green", "yellow"];
function nextSequence(){
    var randomNumber = Math.floor((Math.random()*4));
    var randomChosenColour = buttonColors[randomNumber];
    gamePattern.push(randomChosenColour);
    var classSound = "."+randomChosenColour;
    $(classSound).fadeOut(100).fadeIn(100);
    var colorAudio = "sounds/"+randomChosenColour+".mp3";
    playSound(colorAudio);
    level++;
    var heading = "Level "+ level;
    $("h1").text(heading);
    
}
function playSound(name){
    
    var audio = new Audio(name);
    audio.play();
}
$(".btn").on("click",function() {
    var userChosenColour = $(this).attr("id");
    animatePress(userChosenColour);
    userClickedPattern.push(userChosenColour);
    var colorAudio = "sounds/"+userChosenColour+".mp3";
    playSound(colorAudio);
    console.log(userClickedPattern);
    checkAnswer(userClickedPattern.length-1);
  });

function animatePress(currentColor){
    var colorpressclass = "."+currentColor;
    $(colorpressclass).addClass("pressed");
        setTimeout(function(){
            $(colorpressclass).removeClass("pressed");
        },100);

}
$(document).on("keypress",function(){
    if(level ==0){
    nextSequence();
    }
})

function checkAnswer(currentlevel){
    if(gamePattern[currentlevel]=== userClickedPattern[currentlevel]){
        console.log("success");
    }
    else{
        playSound("sounds/wrong.mp3")
        $("body").addClass("game-over");
        setTimeout(function(){
            $("body").removeClass("game-over");
        },200);
        $("h1").text( "Game Over, Press Any Key to Restart");
        startOver();
    }
    if((currentlevel+1) === level){
        userClickedPattern=[];
        setTimeout(function() {
            nextSequence();
        }, 1000);
    }
}

function startOver(){
    gamePattern=[];
    level=0;
    userClickedPattern=[];
}