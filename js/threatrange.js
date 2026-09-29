const svgNS = "http://www.w3.org/2000/svg";

function setup() {
    //setting up event listeners on every field so any change updates values
    document.getElementById("move").addEventListener("input", rangeCalc);
    document.getElementById("advance").addEventListener("change", rangeCalc);
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

    //no need to treat movement and charge modifier differently
    let moveTotal = move + chargeModifier;

    let rolls = generateRolls(advance);

    drawChart(rolls,moveTotal,chargeReroll);
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
function drawChart(rolls,moveTotal,chargeReroll) {
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

    let lowestRoll = sumArray(rolls[0])+moveTotal
    let highestRoll = sumArray(rolls[rolls.length-1])+moveTotal;

    let successPercentage = generateSuccessPercentages(rolls,lowestRoll,highestRoll,rolls.length,moveTotal,chargeReroll);

    let highestPercentage = 0;
    let highestPercentageIndex = 0;

    //the total number of results is needed for calculating percentages later
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
        console.log(successPercentage[i][1]);
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

function generateSuccessPercentages(rolls,lowestRoll,highestRoll,rollsLength,moveTotal,chargeReroll) {
    let successPercentage = []
    for (let i = lowestRoll; i <= highestRoll; i++) {
        let rollSuccessCount = 0;
        for (let j = 0; j < rollsLength; j++) {
            if (chargeReroll != true) {
                if (sumArray(rolls[j])+moveTotal >= i) {
                    rollSuccessCount++;
                };
            } else {
                // this is where I'll do the reroll shit
                if (sumArray(rolls[j])+moveTotal >= i) {
                    rollSuccessCount += 36;
                } else {
                    let rollScratch = sumArray(rolls[j].slice(0, -2));
                    for (let l = 1; l <= 6; l++) {
                        //for every possible result on the first die, a second die is rolled
                        for (let m = 1; m <= 6; m++) {
                            //then the rolls are added up lazily since we don't have to preserve the scratch array
                            if (rollScratch+l+m+moveTotal >= i) {
                                rollSuccessCount++
                            };
                        };
                    };
                };
            };
        };
        let outcomesPerRoll = 0;
        if (chargeReroll == true) {
            outcomesPerRoll = 36;
        } else {
            outcomesPerRoll = 1;
        };
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
    percentageText.setAttribute("y",520-height);
    percentageText.setAttribute("style","fill:var(--feature); font-size:10px");
    percentageText.setAttribute("text-anchor","middle")
    percentageText.textContent = parseFloat(percentageChance*100).toFixed(1)+"%";

    return percentageText;
};

//numbers at bottom of boxes which tell you what value each corresponds to
function drawLabelText(width,x,columnNumber) {
    let labelText = document.createElementNS(svgNS, "text");
    labelText.setAttribute("x",x+(width/2));
    labelText.setAttribute("y",521);
    labelText.setAttribute("style","fill:#101217")
    labelText.setAttribute("text-anchor","middle")
    labelText.textContent = columnNumber;

    return labelText;
};

function sumArray(array) {
    let output = 0;
    for (let i = 0; i < array.length; i++) {
        output += array[i];
    };
    return output;
};