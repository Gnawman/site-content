async function crusalculate() {
    // inputs from the web page
    let attackDiceAmountInput = +document.getElementById("attackDiceAmount").value;
    let attackDiceKeep = +document.getElementById("attackDiceKeep").value;
    let attackDiceNeg = +document.getElementById("attackHighLow").selectedIndex;
    let injureDiceAmountInput = +document.getElementById("injureDiceAmount").value;
    let injureDiceKeep = +document.getElementById("injureDiceKeep").value;
    let injureDiceNeg = +document.getElementById("injureHighLow").selectedIndex;
    let injureModifier = +document.getElementById("injureModifier").value;
    let bloodCheck1 = document.getElementById("bloodCheck1");
    let bloodCheck2 = document.getElementById("bloodCheck2");
    let bloodCheck3 = document.getElementById("bloodCheck3");
    let bloodCheck4 = document.getElementById("bloodCheck4");

    if (attackDiceAmountInput > 6) {
        attackDiceAmountInput = 6;
        let attackDiceAmountBox = document.getElementById("attackDiceAmount");
        attackDiceAmountBox.value = 6;
    };

    if (injureDiceAmountInput > 6) {
        injureDiceAmountInput = 6;
        let injureDiceAmountBox = document.getElementById("injureDiceAmount");
        injureDiceAmountBox.value = 6;
    };

    let diceSides = 6;

    // derived variables
    let attackDiceAmount = Math.abs(attackDiceAmountInput);
    let attackHighestRoll = diceSides * attackDiceKeep;
    let injureDiceAmount = Math.abs(injureDiceAmountInput);

    // setup variables
    let depth = 0;
    let attackRolls = [];
    let hitChanceDict = {};
    let hitChance = 0;

    // construct the array that will be iterated over in rollDice
    let attackDiceArray = [];
    for (let i = 0; i < attackDiceAmount; i++) {
        attackDiceArray.push(diceSides);
    };

    await scheduler.yield();

    // this generates a list of all possible attack rolls from the amount of dice, keeping the highest or lowest amount specified
    let attackSampleSpace = rollDice(attackDiceAmount,attackDiceNeg,attackDiceKeep,diceSides,attackDiceArray,0,depth,attackRolls)[1];
    let attackSampleSpaceLength = attackSampleSpace.length;

    // lists every possible number for attacks, and the probability of rolling that number
    for (let i = attackDiceKeep; i < attackHighestRoll+1; i++){
        hitChanceDict[i] = countOccurrences(attackSampleSpace,i)/attackSampleSpaceLength;
        if (i > 6) {
            hitChance = hitChance + Number(hitChanceDict[i]);
        };
    };

    // calculates and displays injury table for vanilla roll
    injure(0,injureDiceAmount,injureDiceNeg,injureDiceKeep,diceSides,injureModifier,depth,hitChance);

    // displays the extended table if any boxes are checked
    if (bloodCheck1.checked || bloodCheck2.checked || bloodCheck3.checked || bloodCheck4.checked) {
        document.getElementById("tableBlood").style.display = "inline";
    } else {
        document.getElementById("tableBlood").style.display = "none"
    };

    // displays only the rows the user has checked
    tableRowDisplay(bloodCheck1);
    tableRowDisplay(bloodCheck2);
    tableRowDisplay(bloodCheck3);
    tableRowDisplay(bloodCheck4);

    // calculates and displays injury table for any ticked modifiers
    if (bloodCheck1.checked) {
        injure(1,injureDiceAmount,injureDiceNeg,injureDiceKeep,diceSides,injureModifier,depth,hitChance);
    };

    if (bloodCheck2.checked) {
        injure(2,injureDiceAmount,injureDiceNeg,injureDiceKeep,diceSides,injureModifier,depth,hitChance);
    };

    if (bloodCheck3.checked) {
        injure(3,injureDiceAmount,injureDiceNeg,injureDiceKeep,diceSides,injureModifier,depth,hitChance);
    };

    if (bloodCheck4.checked) {
        injure(4,injureDiceAmount,injureDiceNeg,injureDiceKeep,diceSides,injureModifier,depth,hitChance);
    };
};

// takes the user-selected parameters and outputs a sample space of all possible rolls
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
        };

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
};

// takes the big injury chance sample space and condenses it into four breakpoints: nothing, minor hit, down, and out
function injuryProbability(injureLowestRoll,injureHighestRoll,injureSampleSpace) {
    let nothingChance = 0;
    let minorHitChance = 0;
    let downChance = 0;
    let outChance = 0;

    for (let i = injureLowestRoll; i < injureHighestRoll+1; i++){
        let injureChanceDict = {};
        injureChanceDict[i] = countOccurrences(injureSampleSpace,i)/injureSampleSpace.length;
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
    return [nothingChance,minorHitChance,downChance,outChance]
};

// checks if checkbox is checked and displays row if it is
function tableRowDisplay(rowCheck) {
    let row = document.getElementById("tableRowBlood"+rowCheck.id.slice(10));
    if (rowCheck.checked) {
        row.style.display = "table-row";
    } else {
        row.style.display = "none";
    };
};

// takes user-selected parameters as well as hit chance, calls rollDice() to generate sample space, condenses sample space with injuryProbability(), and writes output to page
// bloodChoice is 0:vanilla, 1-3:number of blood tokens spent, 4:bloodbath
function injure(bloodChoice,injureDiceAmount,injureDiceNeg,injureDiceKeep,diceSides,injureModifier,depth,hitChance) {
    let injureDiceAmountMod = bloodChoice;
    // checks if bloodbath is selected
    if (bloodChoice == 4 ) {
        injureDiceAmountMod = 0;
        injureDiceAmount += 1;
        injureDiceKeep += 1;
    };

    // need to make dice mod work when taking the lowest dice as well!
    if (injureDiceNeg == 1) {
        console.log("START INJUREDICENEG LOOP");
        injureDiceAmount -= injureDiceKeep;
        console.log("injureDiceAmount is "+injureDiceAmount);
        injureDiceAmount = -Math.abs(injureDiceAmount) + injureDiceAmountMod;
        console.log("injureDiceAmount is "+injureDiceAmount);
        if (injureDiceAmount >= 0) {
            injureDiceNeg = 0;
        };
        injureDiceAmount = Math.abs(injureDiceAmount) + injureDiceKeep;
        console.log("injureDiceAmount is "+injureDiceAmount);
        injureDiceAmountMod = 0;
    };

    let injureHighestRoll = (diceSides * (injureDiceKeep)) + injureModifier;
    let injureLowestRoll = injureDiceKeep + injureModifier;

    let injureDiceArray = [];
    for (let i = 0; i < injureDiceAmount+injureDiceAmountMod; i++) {
        injureDiceArray.push(diceSides);
    };

    // setting up variables to pass to 
    let injureRolls = [];

    let injureSampleSpace = rollDice(injureDiceAmount+injureDiceAmountMod,injureDiceNeg,injureDiceKeep,diceSides,injureDiceArray,injureModifier,depth,injureRolls)[1];

    [nothingChance,minorHitChance,downChance,outChance] = injuryProbability(injureLowestRoll,injureHighestRoll,injureSampleSpace);

    document.getElementById("nothingChance"+bloodChoice).innerText = ((100-hitChance*100)+(nothingChance*hitChance*100)).toFixed(2)+"%";
    document.getElementById("minorHitChance"+bloodChoice).innerText = (minorHitChance*hitChance*100).toFixed(2)+"%";
    document.getElementById("downChance"+bloodChoice).innerText = (downChance*hitChance*100).toFixed(2)+"%";
    document.getElementById("outChance"+bloodChoice).innerText = (outChance*hitChance*100).toFixed(2)+"%";

    document.getElementById("loading-background").style.display = "none";
};

function showLoading() {
    let injureDiceAmountInput = +document.getElementById("injureDiceAmount").value
    let bloodCheck2 = document.getElementById("bloodCheck2");
    let bloodCheck3 = document.getElementById("bloodCheck3");

    if (injureDiceAmountInput > 5 && (bloodCheck2.checked || bloodCheck3.checked)) {
        document.getElementById("loading-background").style.display = "block"
    };
};