var n1 = Math.random();
var num1 = Math.floor((n1*6)+1);
var randomimage1 = "images/dice"+num1+".png";
document.querySelector(".img1").setAttribute("src",randomimage1);

var n2 = Math.random();
var num2 = Math.floor((n2*6)+1);
var randomimage2 = "images/dice"+num2+".png";
document.querySelector(".img2").setAttribute("src",randomimage2);

var img1 = document.querySelector(".img1").getAttribute("src");
var img2 = document.querySelector(".img2").getAttribute("src");
if(num1== num2){
    document.querySelector("h1").innerHTML="Draw!";
}
else if (num1>num2){
    document.querySelector("h1").innerHTML="Player 1 Wins";
}
else{
    document.querySelector("h1").innerHTML="Player 2 Wins";
}