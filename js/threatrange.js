const svgNS = "http://www.w3.org/2000/svg";

function setup() {
    //setting up event listeners on every field so any change updates values
    document.getElementById("move").addEventListener("input", rangeCalc);
    document.getElementById("advance").addEventListener("change", rangeCalc);
//    document.getElementById("advanceReroll").addEventListener("change", rangeCalc);
    document.getElementById("chargeModifier").addEventListener("input", rangeCalc);
//    document.getElementById("chargeReroll").addEventListener("change", rangeCalc);
    rangeCalc();
};

async function rangeCalc() {
    //assigning variables from input
    let move = +document.getElementById("move").value;
    let advance = document.getElementById("advance").checked;
//    let advanceReroll = document.getElementById("advanceReroll").checked;
    let chargeModifier = +document.getElementById("chargeModifier").value;
//    let chargeReroll = document.getElementById("chargeReroll").checked;

    //no need to treat movement and charge modifier differently
    let moveTotal = move + chargeModifier;

    let sampleSpace = await generateSampleSpace(moveTotal,advance);

    drawChart(sampleSpace);
};

//creates an array of all possible dice rolls then counts how many times each total appears
function generateSampleSpace(moveTotal,advance) {
    let workingSpace = [];
    let sampleSpace = [];
    let workingCount = 0;

    //simulates every possible roll
    //this is the first die
    for (let i = 0; i < 6; i++) {
        //for every possible result on the first die, a second die is rolled
        for (let j = 0; j < 6; j++) {
            //and then a third is rolled, if the advance option is ticked
            if (advance == true) {
                for (let k = 0; k < 6; k++) {
                    //3 is added to avoid off-by-one errors -- the counters are 1 less than the faces of the dice
                    workingSpace.push(i+j+k+3+moveTotal);
                };
            } else {
                workingSpace.push(i+j+2+moveTotal);
            };
        };
    };

    //this counts how many times each total appears in the working space
    //this gets the lowest number in the working space, then the highest, then increments
    for (let i = workingSpace[0]; i <= workingSpace[workingSpace.length-1]; i++) {
        workingCount = 0;
        //this goes through all the elements in the working space and compares them to the current number
        for (let j = 0; j < workingSpace.length; j++) {
            if (workingSpace[j] === i) {
                workingCount++;
            };
        };
        sampleSpace.push([i,workingCount]);
    };

    return sampleSpace;
};

//all the svg stuff is handled in here
function drawChart(sampleSpace) {
    console.log(sampleSpace);
    let chart = document.getElementById("chart");

    for (let i = 0; i < chart.children.length; ) {
        chart.children[i].remove();
    };

    let sampleSpaceSize = 0;

    //the total number of results is needed for calculating percentages later
    for (let i = 0; i < sampleSpace.length; i++) {
        sampleSpaceSize+=sampleSpace[i][1];
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

    //these variables help with sizing the boxes, and don't change between loops
    let columnWidth = (500/sampleSpace.length)-1;
    let heightRatio = 500/sampleSpace[(sampleSpace.length/2).toFixed(0)-1][1];

    //this keeps track of cumulative percentages across loops, so the tooltip text can be generated
    let runningTotal = 0;

    //iterates through sampleSpace, and draws a box, label, and percentage chance for each value
    for (let i = 0; i < sampleSpace.length; i++) {
        //had to activate my neurons and think about ratios for this part, don't want to do it again
        let height = sampleSpace[i][1]*heightRatio;
        let x = 24+(columnWidth*i)+i;
        let y = 524-height;
        //percentage chance of each result is calculated by comparing to the total number of results
        let percentageChance = (sampleSpace[i][1]/sampleSpaceSize);
        //every subsequest result gets less likely, so we take away the sum of all previous results
        let cumulativeChance = 1-runningTotal;
        runningTotal = runningTotal + percentageChance;
        //then call the drawing functions to actually make the svgs
        chart.appendChild(drawBox(columnWidth,height,x,y,cumulativeChance));
        chart.appendChild(drawPercentageText(columnWidth,height,x,percentageChance,cumulativeChance));
        chart.appendChild(drawLabelText(columnWidth,x,sampleSpace[i][0]));
    };

    //the unchanging elements get attached last
    chart.appendChild(line);
    chart.appendChild(text);

    //this is just for the table at the bottom -- will probably be removed at some point
    let chargeArray = [sampleSpace[0][0],sampleSpace[(sampleSpace.length/2).toFixed(0)-1][0],sampleSpace[sampleSpace.length-1][0]];
    updateText(chargeArray);
};

//will probably remove this
function updateText(chargeArray) {
    document.getElementById("minimumCharge").innerText = chargeArray[0];
    document.getElementById("averageCharge").innerText = chargeArray[1];
    document.getElementById("maximumCharge").innerText = chargeArray[2];
};

//draws a box using various values, also bakes in a value to the dataset so it can be surfaced by the tooltip later
function drawBox(width,height,x,y,cumulativeChance) {
    let box = document.createElementNS(svgNS, "rect");
    box.setAttribute("width",width);
    box.setAttribute("height",height);
    box.setAttribute("x",x);
    box.setAttribute("y",y);
    box.setAttribute("fill","var(--feature)");
    box.setAttribute("data-cumulativechance",cumulativeChance);
    box.addEventListener("mouseover", showPercentageTooltip, false);

    return box;
};

//sticks percentages on top of the boxes
function drawPercentageText(width,height,x,percentageChance) {
    let percentageText = document.createElementNS(svgNS, "text");
    percentageText.setAttribute("x",x+(width/2));
    percentageText.setAttribute("y",520-height);
    percentageText.setAttribute("style","fill:red; font-size:10px");
    percentageText.setAttribute("text-anchor","middle")
    percentageText.textContent = parseFloat(percentageChance*100).toFixed(1);

    return percentageText;
};

//numbers at bottom of boxes which tell you what value each corresponds to
function drawLabelText(width,x,columnNumber) {
    let labelText = document.createElementNS(svgNS, "text");
    labelText.setAttribute("x",x+(width/2));
    labelText.setAttribute("y",521);
    labelText.setAttribute("style","fill:#84857E")
    labelText.setAttribute("text-anchor","middle")
    labelText.textContent = columnNumber;

    return labelText;
};

//shows cumulative percentage datum when hovering over boxes
function showPercentageTooltip(evt) {
    let boxPos = evt.currentTarget.getBoundingClientRect();
    let tooltipPercentage = evt.currentTarget.dataset.cumulativechance*100;
    let tooltipChance = document.getElementById("tooltipChance");

    tooltipChance.style.left = window.scrollX + boxPos.x + "px";
    tooltipChance.style.top = window.scrollY + boxPos.y + "px";
    tooltipChance.style.display = "block";
    tooltipChance.innerText = parseFloat(tooltipPercentage).toFixed(1);
};