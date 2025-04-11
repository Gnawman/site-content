function getword() {
    //read the hidden wordlist paragraph and split on whitespace
    let wordlistArray = document.getElementById('wordlist').innerHTML.split(',');
    //pick a random item from the array, doing numberwang to adjust for length of array
    let wordlistOutput = wordlistArray[Math.floor(Math.random()*wordlistArray.length)];
    let spice = document.getElementById("spice").value;

    //replace the placeholder worddisplay <p> with output
    document.getElementById('worddisplay').innerHTML = scrample(wordlistOutput, spice);
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