function randName() {
        //read the hidden firstnames paragraph and split on whitespace
        var firstNameArray = document.getElementById('firstnames').innerHTML.split(/\s+/);
        //pick a random item from the array, doing numberwang to adjust for length of array
        var firstNameOutput = firstNameArray[Math.floor(Math.random()*firstNameArray.length)];

        //same for lastnames
        var lastNameArray = document.getElementById('lastnames').innerHTML.split(/\s+/);
        var lastNameOutput = lastNameArray[Math.floor(Math.random()*lastNameArray.length)];

        //replace the placeholder namedisplay <p> with concat'd outputs
        document.getElementById('namedisplay').innerHTML = firstNameOutput.concat(" ", lastNameOutput);
}