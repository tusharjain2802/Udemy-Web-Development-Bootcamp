$("h1").addClass("big-title");

$("button").html("<em>click me</em")

$(".button").text("<em>click me</em")

console.log($("img").attr("src"));

$("a").attr("href","https://www.yahoo.com" );

$("h1").click(function(){
    $("h1").css("color","purple");
})

$("button").click(function(){
    $("h1").css("color","green");
})

$("input").keypress(function(event){
    console.log(event.key);
});

$(document).keypress(function(event){
    var press = event.key;
    $("h1").html(press);
})

$("h1").on("mouseover",function(){
    $("h1").css("color", "blue");
})

// You can put any event like click in place if mouseover

$("h1").before("<button>New</button");
$("h1").after("<button>Old</button");
$("h1").append("<button>New</button");
// adds the html after opening of h1 tag
$("h1").prepend("<button>Old</button");
//adds the html just before the closing oh h1 tag

// $("button").remove();  removes all the button

$("button").on("click",function(){
    $("h1").slideToggle();
})

// similarly fadeIn, fadeOut, fadeToggle, slideIn, S=slideOut

$("button").on("click",function(){
    $("h1").animate({
        opacity:0.5
    });
})

$(".button").on("click",function(){
    $("h1").slideUp().slideDown().animate({
        margin:"20%"
    })
})


