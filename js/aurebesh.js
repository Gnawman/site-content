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