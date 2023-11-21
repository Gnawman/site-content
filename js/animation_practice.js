function setup() {
    createCarousel(["choose an option","choose an option"]);
}

function createCarousel(optionList) {
    var elements = document.getElementsByClassName("carousel-item");
    while (elements[0]) elements[0].parentNode.removeChild(elements[0]);
    var speenTime = 4;
    console.log(optionList);
    var array = shuffle(optionList);
    console.log(array);
    for (var i = 0; i < array.length; i++) {
        var newElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
        newElement.setAttribute("x","500");
        newElement.setAttribute("y","150");
        newElement.setAttribute("style","fill:var(--feature)");
        newElement.setAttribute("text-anchor","middle");
        newElement.setAttribute("class","carousel-item");
        
        var textNode = document.createTextNode(array[i]);
        newElement.appendChild(textNode);

        var anim = document.createElementNS("http://www.w3.org/2000/svg", "animateMotion");
        anim.setAttribute("id","carousel"+(i));
        anim.setAttribute("dur",(speenTime/array.length)+"s");
        anim.setAttribute("begin","indefinite");
        anim.setAttribute("path","m 0,0 0,200");
        if (i !== 0 ) {
            anim.setAttribute("begin","carousel"+(i-1)+".end")
        };
        if (i == array.length-1) {
            anim.setAttribute("path","m 0,0 0,104");
            anim.setAttribute("fill","freeze");
        };
        newElement.appendChild(anim);

        document.getElementById("carousel").appendChild(newElement);
    }
}

function speen(optionList) {
    createCarousel(optionList);
    var buttons = document.getElementsByTagName("button");
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
    };
    for (let i = 0; i < buttons.length; i++) {
        setTimeout(() => {
            buttons[i].disabled = false;
        }, 4000);
    };
    document.getElementById("anim").beginElement();
    document.getElementById("carousel0").beginElement();
}

function shuffle(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}