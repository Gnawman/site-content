function crusalculate() {
    // inputs from the web page
    let attackDiceAmountInput = +document.getElementById("attackDiceAmount").value;
    let attackDiceKeep = +document.getElementById("attackDiceKeep").value;
    let attackDiceNeg = +document.getElementById("attackHighLow").selectedIndex;
    let injureDiceAmountInput = +document.getElementById("injureDiceAmount").value;
    let injureDiceKeep = +document.getElementById("injureDiceKeep").value;
    let injureDiceNeg = +document.getElementById("injureHighLow").selectedIndex;
    let injureModifier = +document.getElementById("injureModifier").value;

    let diceSides = 6;

    // derived variables
    let attackDiceAmount = Math.abs(attackDiceAmountInput);
    let attackHighestRoll = diceSides * attackDiceKeep;
    let injureDiceAmount = Math.abs(injureDiceAmountInput);
    let injureHighestRoll = (diceSides * injureDiceKeep)+injureModifier;

    // setup variables
    let depth = 0;
    let attackRolls = [];
    let injureRolls = [];
    let hitChanceDict = {};
    let injureChanceDict = {};
    let hitChance = 0;
    let nothingChance = 0;
    let minorHitChance = 0;
    let downChance = 0;
    let outChance = 0;

    // construct the array that will be iterated over in rollDice
    let attackDiceArray = [];
    for (let i = 0; i < attackDiceAmount; i++) {
        attackDiceArray.push(diceSides);
    };

    let injureDiceArray = [];
    for (let i = 0; i < injureDiceAmount; i++) {
        injureDiceArray.push(diceSides);
    };

    // this generates a list of all possible rolls from the amount of dice, keeping the highest or lowest amount specified
    let attackSampleSpace = rollDice(attackDiceAmount,attackDiceNeg,attackDiceKeep,diceSides,attackDiceArray,0,depth,attackRolls)[1];
    let attackSampleSpaceLength = attackSampleSpace.length;

    let injureSampleSpace = rollDice(injureDiceAmount,injureDiceNeg,injureDiceKeep,diceSides,injureDiceArray,injureModifier,depth,injureRolls)[1];
    let injureSampleSpaceLength = injureSampleSpace.length;

    // lists every possible number for attacks, and the probability of rolling that number
    for (let i = attackDiceKeep; i < attackHighestRoll+1; i++){
        hitChanceDict[i] = countOccurrences(attackSampleSpace,i)/attackSampleSpaceLength;
        if (i > 6) {
            hitChance = hitChance + Number(hitChanceDict[i]);
        };
    };

    // lists every possible number for injuries, and the probability of rolling that number
    for (let i = injureDiceKeep+injureModifier; i < injureHighestRoll+1; i++){
        injureChanceDict[i] = countOccurrences(injureSampleSpace,i)/injureSampleSpaceLength;
        if (i < 2) {
            nothingChance = nothingChance + Number(injureChanceDict[i]);
        } else if (i > 1 && i < 7) {
            minorHitChance = minorHitChance + Number(injureChanceDict[i]);
        } else if (i > 6 && i < 9) {
            downChance = downChance + Number(injureChanceDict[i]);
        } else {
            outChance = outChance + Number(injureChanceDict[i]);
        };
    };

    // TODO output for testing
    console.log(hitChanceDict);
    console.log(injureChanceDict);
    // document.getElementById("hitChance").innerText = "hit chance "+(hitChance*100).toFixed(2)+"%";
    document.getElementById("nothingChance").innerText = ((100-hitChance*100)+(nothingChance*hitChance*100)).toFixed(2)+"%";
    document.getElementById("minorHitChance").innerText = (minorHitChance*hitChance*100).toFixed(2)+"%";
    document.getElementById("downChance").innerText = (downChance*hitChance*100).toFixed(2)+"%";
    document.getElementById("outChance").innerText = (outChance*hitChance*100).toFixed(2)+"%";
    
};

// this is where the magic happens
function rollDice(diceAmount,diceNeg,diceKeep,diceSides,diceArray,injureModifier,depth,rolls) {
    // first set up a loop that runs a number of times equal to the size of the dice
    for (let i = 0; i < diceSides; i++) {
        // as depth starts at zero, this will always be TRUE the first time around
        if (depth < diceAmount-1) {
            // the function is then recursively called, with the depth going up by one
            // this means that when we get deep enough in loops that we reach the number of dice specified, we stop calling the function
            // also the functions can always tell where they are in the recursive loop structure because of scope
            [diceArray,rolls] = rollDice(diceAmount,diceNeg,diceKeep,diceSides,diceArray,injureModifier,depth+1,rolls);
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

            // sorts the working dice array and grabs the X highest or X lowest, then adds them together
            workingDiceArray.sort((a, b) => (a - b));
            workingDiceArray.slice(sliceStart,sliceEnd).forEach(x => { sum += x; });
            // applies modifier and appends the result to the rolls variable
            // modifier set to zero when doing to-hit rolls
            rolls.push(sum+injureModifier);

            // TODO output for testing
            console.log("dice array "+diceArray+" | working dice array "+workingDiceArray);
        }

        // decrement a single die in the array, selected by the current depth
        diceArray[depth] = diceArray[depth]-1;

    };

    // when any loop in the recursive structure finishes, the die that has been decremented is set back to the max
    // this allows the loop to recurse on the next step and do the lower depth all over again
    diceArray[depth] = diceSides;
    // returning the diceArray means it escapes scope and is consistent for the whole recursive process
    return [diceArray,rolls];
};

// really didn't have to split this into another function but did
function countOccurrences(array, value) {
      let count = 0;
      array.forEach((v) => (v === value && count++));
      return count;
  }
