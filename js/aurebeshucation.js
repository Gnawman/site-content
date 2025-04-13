function setup() {
    renderWord();
    //sets up listeners for the text box -- hotkeys are important!
    var typedText = document.getElementById("typedtext")
    typedText.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          renderWord();
        };
    });
    typedText.addEventListener("input", function(event) {
        checkText();
    });
     
}

//reads a hidden list of words, splits on whitespace, and returns a random one
function getWord() {
    let wordListArray = document.getElementById('wordlist').innerHTML.split(/[\r\n]+/);
    let chosenWord = wordListArray[Math.floor(Math.random()*wordListArray.length)];
    let output = chosenWord.split("");
    return output;
};

//returns a string of 0s with a spice-weighted chance to flip some to 1s
//this will be used to aurebeshify characters at the indexes of the 1s
function makeScrampleArray(wordArray, spice) {
    let output = "";
    for (var i=0; i<wordArray.length; i++) {
        if (Math.random()*100 < spice) {
            output+="1";
        } else {
            output+="0";
        };
    };
    return output;
};

function renderWord() {
    let wordDisplay = document.getElementById("worddisplay");
    wordDisplay.innerHTML = '';
    document.getElementById("typedtext").value = "";
    let wordArray = getWord();
    let spice = document.getElementById("spice").value;
    let scrampleArray = makeScrampleArray(wordArray,spice);
    for (var i=0; i<wordArray.length; i++) {
        let letter = document.createElement("span")
        letter.innerText = wordArray[i];
        if (scrampleArray[i] == "1") {
            letter.classList.add("aurebesh")
            letter.classList.add("feature-colour")
        };
        wordDisplay.appendChild(letter);
    };
};

function checkText() {
    let wordDisplay = document.getElementById("worddisplay").children;
    let typedText = document.getElementById("typedtext").value;
    let lowestLength = Math.min(wordDisplay.length, typedText.length);
    for (var i=lowestLength; i<wordDisplay.length; i++) {
        let letterDisplay = wordDisplay[i];
        wipeStyle(letterDisplay);
        if (letterDisplay.classList.contains("aurebesh")) {
            letterDisplay.classList.add("feature-colour");
        };
    };
    for (var i=0; i<lowestLength; i++) {
        let letterDisplay = wordDisplay[i];
        if (letterDisplay.innerText == typedText[i]) {
            wipeStyle(letterDisplay);
            wordDisplay[i].classList.add("aurebeshucation-correct");
        } else {
            wipeStyle(letterDisplay);
            wordDisplay[i].classList.add("aurebeshucation-incorrect");
        };
    };
};

function wipeStyle(element) {
    element.classList.remove("feature-colour");
    element.classList.remove("aurebeshucation-correct");
    element.classList.remove("aurebeshucation-incorrect");
};

/*
function getWord() {
    //read the hidden wordlist paragraph and split on whitespace
    let wordlistArray = document.getElementById('wordlist').innerHTML.split(/[\r\n]+/);

    //pick a random item from the array, do numberwang to adjust for length of array, then replace a hidden div
    let chosenWord = wordlistArray[Math.floor(Math.random()*wordlistArray.length)];
    document.getElementById('chosenword').innerHTML = chosenWord
    
    let spice = document.getElementById("spice").value;

    document.getElementById('input').addEventListener("keypress", function(event) {
        // If the user presses the "Enter" key on the keyboard
        if (event.key === "Enter") {
          // Cancel the default action, if needed
          event.preventDefault();
          // Trigger the button element with a click
          document.getElementById("checkText").click();
        }
    }); 

    //replace the placeholder worddisplay <p> with output
    document.getElementById('worddisplay').innerHTML = scrample(chosenWord, spice);

}

function scrample(wordInput, spice) {
    let output = "";
    for (var i=0; i<wordInput.length; i++) {
        if (Math.random()*100 < spice) {
            output+='<span style = "font-family:aurebesh">'+wordInput.charAt(i)+'</span>'+" ";
        } else {
            output+='<span>'+wordInput.charAt(i)+'</span>'+" ";
        }
    }
    return output;
}

function checkText() {
    let textInput = document.getElementById('input').value;
    let chosenWord = document.getElementById('chosenword').innerHTML;
    console.log(textInput);
    console.log(chosenWord);
    if (textInput == chosenWord) {
        document.getElementById('worddisplay').style["color"] = "#70A288";
    } else {
        document.getElementById('worddisplay').style["color"] = "#B48EAE";
    }
}
*/