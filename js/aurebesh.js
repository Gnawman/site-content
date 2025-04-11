function getword() {
    //read the hidden wordlist paragraph and split on whitespace
    let wordlistArray = document.getElementById('wordlist').innerHTML.split(',');

    //pick a random item from the array, do numberwang to adjust for length of array, then replace a hidden div
    let chosenWord = wordlistArray[Math.floor(Math.random()*wordlistArray.length)];
    document.getElementById('chosenword')
    
    let spice = document.getElementById("spice").value;

    //replace the placeholder worddisplay <p> with output
    document.getElementById('worddisplay').innerHTML = scrample(chosenWord, spice);

}

function scrample(wordInput, spice) {
    let output = "";
    for (var i=0; i<wordInput.length; i++) {
        if (Math.random()*100 < spice) {
            output+='<span style = "font-family:aurebesh; color:#FFEAA8">'+wordInput.charAt(i)+'</span>'+" "
            console.log(output);
        } else {
            output+='<span>'+wordInput.charAt(i)+'</span>'+" "
            console.log(output);
        }
    }
    return output;
}

function checkText() {
    let textInput = ""
}