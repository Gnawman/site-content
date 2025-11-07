function crusalculate() {
    // inputs from the web page
    let diceAmountInput = +document.getElementById("diceAmount").value;
    let diceKeep = +document.getElementById("diceKeep").value;
    let diceNeg = +document.getElementById("highLow").selectedIndex;
    let diceSides = 6;

    console.log(diceNeg);

    // derived variables
    let diceAmount = Math.abs(diceAmountInput);

    let highestRoll = diceSides * diceKeep;

    // setup variables
    let depth = 0;
    let rolls = [];
    let dictionary = {};
    let hitChance = 0;

    // construct the array that will be iterated over in rollDice
    let diceArray = [];
    for (let i = 0; i < diceAmount; i++) {
        diceArray.push(diceSides);
    };

    // this generates a list of all possible rolls from the amount of dice, keeping the highest or lowest amount specified
    let sampleSpace = rollDice(diceAmount,diceNeg,diceKeep,diceSides,diceArray,depth,rolls)[1];
    let sampleSpaceLength = sampleSpace.length;

    // lists every possible number, and the probability of rolling that number
    for (let i = diceKeep; i < highestRoll+1; i++){
        dictionary[i] = countOccurrences(sampleSpace,i)/sampleSpaceLength;
        if (i > 6) {
            hitChance = hitChance + Number(dictionary[i]);
        };
    };

    // TODO output for testing
    console.log(sampleSpace);
    console.log("dice amount "+diceAmount+" | highest roll "+highestRoll+" | sample space "+sampleSpace);
    console.log(dictionary);
    console.log("hit chance "+hitChance);
};

// this is where the magic happens
function rollDice(diceAmount,diceNeg,diceKeep,diceSides,diceArray,depth,rolls) {
    // first set up a loop that runs a number of times equal to the size of the dice
    for (let i = 0; i < diceSides; i++) {
        // as depth starts at zero, this will always be TRUE the first time around
        if (depth < diceAmount-1) {
            // the function is then recursively called, with the depth going up by one
            // this means that when we get deep enough in loops that we reach the number of dice specified, we stop calling the function
            // also the functions can always tell where they are in the recursive loop structure because of scope
            [diceArray,rolls] = rollDice(diceAmount,diceNeg,diceKeep,diceSides,diceArray,depth+1,rolls);
        };

        // could have put this in an if/else I guess oops TODO
        // checks to make sure the function is on the deepest loop
        if (depth === diceAmount-1) {
            // sets up a working array to make sure we don't fuck with the actual diceArray
            let workingDiceArray = Array.from(diceArray);
            let sum = 0;

            // accounts for keeping X highest or X lowest
            if (diceNeg) {
                sliceStart = 0;
                sliceEnd = diceKeep;
            } else {
                sliceStart = diceAmount-diceKeep;
                sliceEnd = diceAmount;
            };

            workingDiceArray.sort((a, b) => (a - b));
            // sorts the working dice array and grabs the X highest or X lowest, then adds them together
            workingDiceArray.slice(sliceStart,sliceEnd).forEach(x => { sum += x; });
            // and appends the result to the rolls variable
            rolls.push(sum);

            // TODO output for testing
            console.log("dice array "+diceArray+" | working dice array "+workingDiceArray);
        }

        // decrement a single die in the array, selected by the current depth
        diceArray[depth] = diceArray[depth]-1;

    };

    // when any loop in the recursive structure finishes, the die that has been decremented is set back to the max
    // this allows the loop to recurse on the next step and do the lower depth all over again
    diceArray[depth] = diceSides;

    console.log(diceNeg);
    // returning the diceArray means it escapes scope and is consistent for the whole recursive process
    return [diceArray,rolls];
};

// really didn't have to split this into another function but did
function countOccurrences(array, value) {
      let count = 0;
      array.forEach((v) => (v === value && count++));
      return count;
  }
