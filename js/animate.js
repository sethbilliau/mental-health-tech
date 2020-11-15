//https://github.com/michalsnik/aos

AOS.init({
    offset: 100,
    easing: 'ease-in-quart',
    duration: 800,
});


function showcitation(){
    document.getElementById("citation").innerHTML = 
        "Literature References: <a onclick='hidecitation()' href='javascript:void(0);'>Sources (Click to Hide)</a><br>"
}

function hidecitation(){
    document.getElementById("citation").innerHTML = "Literature References: <a onclick='showcitation()' href='javascript:void(0);'>Sources (Click to Expand)</a>";
}