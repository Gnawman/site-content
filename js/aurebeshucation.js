function setup() {
    //first one's free
    renderWord();
    //sets up listeners for the text box -- hotkeys are important!
    var typedText = document.getElementById("typedtext")
    typedText.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
          event.preventDefault();
          renderWord();
        };
    });
    //runs checkText function whenever text in box changes
    typedText.addEventListener("input", function(event) {
        checkText();
    });
     
};

//reads a hidden list of words, splits on whitespace, and returns a random one
function getWord() {
    let wordListArray = document.getElementById('wordlist').innerHTML.split(/[\r\n]+/);
    let chosenWord = wordListArray[Math.floor(Math.random()*wordListArray.length)];
    let output = chosenWord.split("");
    return output;
};

//creats a series of <span>s, possibly aurebeshified
function renderWord() {
    let wordDisplay = document.getElementById("worddisplay");
    let replacedLetters = document.getElementById("replacedletters").value.split("");
    wordDisplay.innerHTML = '';
    document.getElementById("typedtext").value = "";
    //chooses a random word from a hidden element
    let wordArray = getWord();
    let spice = document.getElementById("spice").value;
    //iterates through each letter and creates a <span> for each
    for (var i=0; i<wordArray.length; i++) {
        let letter = document.createElement("span")
        letter.innerText = wordArray[i];
        //makes the <span> aurebesh if the spice is spicy
        if (Math.random()*100 < spice && replacedLetters.includes(letter.innerText)) {
            letter.classList.add("aurebesh")
            letter.classList.add("feature-colour")
        };
        wordDisplay.appendChild(letter);
    };
};

//compared typed text with the displayed word, and colours letters based on right/wrong
function checkText() {
    let wordDisplay = document.getElementById("worddisplay").children;
    let typedText = document.getElementById("typedtext").value;
    let lowestLength = Math.min(wordDisplay.length, typedText.length);
    //this bit ensures colours are set correctly when typed letters are deleted
    //had to do the lowestLength and wordDisplay.length thing to avoid overflow errors
    for (var i=lowestLength; i<wordDisplay.length; i++) {
        let letterDisplay = wordDisplay[i];
        wipeStyle(letterDisplay);
        if (letterDisplay.classList.contains("aurebesh")) {
            letterDisplay.classList.add("feature-colour");
        };
    };
    //actually does the colouring
    for (var i=0; i<lowestLength; i++) {
        let letterDisplay = wordDisplay[i];
        if (letterDisplay.innerText == typedText[i]) {
            //important to wipe style or aurebesh will still be --feature coloured
            wipeStyle(letterDisplay);
            wordDisplay[i].classList.add("aurebeshucation-correct");
        } else {
            wipeStyle(letterDisplay);
            wordDisplay[i].classList.add("aurebeshucation-incorrect");
        };
    };
};

//split out from parent function to avoid repeated code
function wipeStyle(element) {
    element.classList.remove("feature-colour");
    element.classList.remove("aurebeshucation-correct");
    element.classList.remove("aurebeshucation-incorrect");
};

//boilerplate accordion code
function accordion(elementId) {
    var x = document.getElementById(elementId);
    if (x.classList.contains("accordion-hide")) {
        x.className = x.className.replace("accordion-hide", "accordion-show");
    } else {
        x.className = x.className.replace("accordion-show", "accordion-hide");
    }
}