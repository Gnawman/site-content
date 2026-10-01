const svgNS = "http://www.w3.org/2000/svg";

function setup() {
    //setting up event listeners on every field so any change updates values
    document.getElementById("move").addEventListener("input", rangeCalc);
    document.getElementById("advance").addEventListener("change", rangeCalc);
    //i've decided that since you don't have foreknowledge of your charge roll before you choose to advance, rerolls shouldn't be counted
    //also that sounds hard
    //maybe I should make an advancererollulator that tells you the expected value of rerolling your advance?
    //that also sounds hard
//  document.getElementById("advanceReroll").addEventListener("change", rangeCalc);
    document.getElementById("chargeModifier").addEventListener("input", rangeCalc);
    document.getElementById("chargeReroll").addEventListener("change", rangeCalc);
    rangeCalc();
};

function rangeCalc() {
    //assigning variables from input
    let move = +document.getElementById("move").value;
    let advance = document.getElementById("advance").checked;
//    let advanceReroll = document.getElementById("advanceReroll").checked;
    let chargeModifier = +document.getElementById("chargeModifier").value;
    let chargeReroll = document.getElementById("chargeReroll").checked;

    //there is in fact a need to treat movement and charge modifier differently
    //leaving this as a monument to my hubris
    // let moveTotal = move + chargeModifier;

    //this is a big array of all possible combinations of rolls on 2d6 or 3d6, depending on if you're advancing or not
    let rolls = generateRolls(advance);

    //and this draws up the svgs
    drawChart(rolls,move,chargeModifier,chargeReroll);
};

function generateRolls(advance) {
    let rolls = [];
    for (let i = 1; i <= 6; i++) {
        //for every possible result on the first die, a second die is rolled
        for (let j = 1; j <= 6; j++) {
            //and then a third is rolled, if the advance option is ticked
            if (advance == true) {
                for (let k = 1; k <= 6; k++) {
                    rolls.push([i,j,k]);
                };
            } else {
                rolls.push([i,j]);
            };
        };
    };
    return rolls;
};

//all the svg stuff is handled in here
function drawChart(rolls,move,chargeModifier,chargeReroll) {
    let chart = document.getElementById("chart");

    // gotta wipe the chart to draw the chart
    for (let i = 0; i < chart.children.length; ) {
        chart.children[i].remove();
    };

    //this line is part of the basic elements of the chart and never changes,
    //but drawing it every time is easier than figuring out how to not delete it
    let line = document.createElementNS(svgNS, "line");
    line.setAttribute("x1",24);
    line.setAttribute("y1",524);
    line.setAttribute("x2",524);
    line.setAttribute("y2",524);
    line.setAttribute("style","stroke:#84857E;stroke-width:2");

    //same for this text
    let text = document.createElementNS(svgNS, "text");
    text.setAttribute("x",274);
    text.setAttribute("y",540);
    text.setAttribute("style","fill:#84857E");
    text.setAttribute("text-anchor","middle")
    text.textContent = "threat range";

    let lowestRoll = sumArray(rolls[0])+move+chargeModifier
    let highestRoll = sumArray(rolls[rolls.length-1])+move+chargeModifier;

    //this is a big (but smaller than rolls) array with percentage chances for each target number to be rolled
    let successPercentage = generateSuccessPercentages(rolls,lowestRoll,highestRoll,rolls.length,move,chargeModifier,chargeReroll);

    let highestPercentage = 0;
    let highestPercentageIndex = 0;

    //gotta know the biggest box so we can scale everything else off it
    //it has come to my attention that the first box will always be the biggest but oh well
    for (let i = 0; i < successPercentage.length; i++) {
        if (successPercentage[i][1] > highestPercentage) {
            highestPercentage = successPercentage[i][1];
            highestPercentageIndex = i;
        };
    };

    //these variables help with sizing the boxes, and don't change between loops
    let columnWidth = (500/successPercentage.length)-1;
    let heightRatio = 500/successPercentage[highestPercentageIndex][1];

    //iterates through successPercentage, and draws a box, label, and percentage chance for each value
    for (let i = 0; i < successPercentage.length; i++) {
        //had to activate my neurons and think about ratios for this part, don't want to do it again
        //lmao I had to do it again
        let height = successPercentage[i][1]*heightRatio;

        let x = 24+(columnWidth*i)+i;
        let y = 524-height;

        let colour;
        if (successPercentage[i][1] >= 0.76) {
            colour = "#70A288"
        } else if (successPercentage[i][1] >= 0.49) {
            colour = "#FFEAA8"
        } else {
            colour = "#B48EAE"
        };

        //then call the drawing functions to actually make the svgs
        chart.appendChild(drawBox(columnWidth,height,x,y,colour));
        chart.appendChild(drawPercentageText(columnWidth,height,x,successPercentage[i][1]));
        chart.appendChild(drawLabelText(columnWidth,x,successPercentage[i][0]));
    };

    //the unchanging elements get attached last
    chart.appendChild(line);
    chart.appendChild(text);
};

function generateSuccessPercentages(rolls,lowestRoll,highestRoll,rollsLength,move,chargeModifier,chargeReroll) {
    let successPercentage = []
    //this loop counts through possible totals from lowest to highest -- these are treated as target numbers
    for (let i = lowestRoll; i <= highestRoll; i++) {
        let rollSuccessCount = 0;
        //this loop counts through all possible rolls
        for (let j = 0; j < rollsLength; j++) {
            let rollsSum = sumArray(rolls[j]);
            if (chargeReroll != true) {
                //checks the roll (plus mods) against the target number 
                //goddammit dan pointing out that charges of 2" always fail
                //had to account for rolling snake eyes -- if there's three dice because advance it just picks the first two which is probably acceptable??
                if (rollsSum+move+chargeModifier >= i && rolls[j][0]+rolls[j][1]+chargeModifier > 2) {
                    rollSuccessCount++;
                };
            } else {
                // this is where I'll do the reroll shit
                //thank you dan
                if (rollsSum+move+chargeModifier >= i && rolls[j][0]+rolls[j][1]+chargeModifier > 2) {
                    rollSuccessCount += 36;
                } else {
                    //this loop is slightly different (just sets up the variables and adds them instead of pushing them to a variable)
                    //why? The rolls don't have to exist outside this loop and also I got bored
                    let rollScratch = sumArray(rolls[j].slice(0, -2));
                    for (let l = 1; l <= 6; l++) {
                        //for every possible result on the first die, a second die is rolled
                        for (let m = 1; m <= 6; m++) {
                            //then the rolls are added up lazily since we don't have to preserve the scratch array
                            //thank you dan
                            if (rollScratch+l+m+move+chargeModifier >= i && l+m+chargeModifier > 2) {
                                rollSuccessCount++
                            };
                        };
                    };
                };
            };
        };
        //gotta do this bit because if we're rerolling the sample space is 36 times bigger
        let outcomesPerRoll = 0;
        if (chargeReroll == true) {
            outcomesPerRoll = 36;
        } else {
            outcomesPerRoll = 1;
        };
        //this bit just sets up the output array by comparing number of successes to total sample space
        let percentage = rollSuccessCount/(rollsLength*outcomesPerRoll);
        successPercentage.push([i,percentage]);
    };
    return successPercentage;
};

//draws a box using various values, also bakes in a value to the dataset so it can be surfaced by the tooltip later
function drawBox(width,height,x,y,colour) {
    let box = document.createElementNS(svgNS, "rect");
    box.setAttribute("width",width);
    box.setAttribute("height",height);
    box.setAttribute("x",x);
    box.setAttribute("y",y);
    box.setAttribute("fill",colour);

    return box;
};

//sticks percentages on top of the boxes
function drawPercentageText(width,height,x,percentageChance) {
    let percentageText = document.createElementNS(svgNS, "text");
    percentageText.setAttribute("x",x+(width/2));
    //since we know how tall boxes will be based on percentages, it's easy to place text just above them
    percentageText.setAttribute("y",520-height);
    //since realising 99.9% is the highest possible chance, I don't need to shrink the text since we can't get 100.0% anymore hehe
    percentageText.setAttribute("style","fill:var(--feature); font-size:10px");
    percentageText.setAttribute("text-anchor","middle")
    //100.0% looked bad and I was thinking about cutting trailing zeroes but turns out that's impossible
    //thank you dan but for real
    //except it is ugh
    if (parseFloat(percentageChance*100).toFixed(1)+"%" === "100.0%") {
        percentageText.textContent = "100%"
    } else {
        percentageText.textContent = parseFloat(percentageChance*100).toFixed(1)+"%";
    };
    return percentageText;
};

//numbers at bottom of boxes that tell you what value each box corresponds to
function drawLabelText(width,x,columnNumber) {
    let labelText = document.createElementNS(svgNS, "text");
    labelText.setAttribute("x",x+(width/2));
    labelText.setAttribute("y",521);
    labelText.setAttribute("style","fill:#101217")
    labelText.setAttribute("text-anchor","middle")
    labelText.textContent = columnNumber;

    return labelText;
};

//almost a pointless function, but I do it just enough (4 times) that it's probably worth splitting it out 
function sumArray(array) {
    let output = 0;
    for (let i = 0; i < array.length; i++) {
        output += array[i];
    };
    return output;
};