function setup() {
    //setting up event listeners on every field so any change updates values
    document.getElementById("move").addEventListener("input", rangeCalc);
    document.getElementById("advance").addEventListener("change", rangeCalc);
    document.getElementById("advanceReroll").addEventListener("change", rangeCalc);
    document.getElementById("chargeModifier").addEventListener("input", rangeCalc);
    document.getElementById("chargeReroll").addEventListener("change", rangeCalc);
    rangeCalc();
};

function rangeCalc() {
    let move = +document.getElementById("move").value;
    let advance = document.getElementById("advance").checked;
    let advanceReroll = document.getElementById("advanceReroll").checked;
    let chargeModifier = +document.getElementById("chargeModifier").value;
    let chargeReroll = document.getElementById("chargeReroll").checked;

    move += chargeModifier;

    let chargeArray = [move,move,move];

    let advanceArray = [0,0,0];
    if (advance === true) {
        if (advanceReroll === true) {
            advanceArray = [1,4.25,6];
        } else {
            advanceArray = [1,3.5,6];
        };
    };

    let chargeAdd = [];
    if (chargeReroll === true) {
        chargeAdd = [1,8.5,12];
    } else {
        chargeAdd = [1,7,12];
    };

    for (let i = 0; i < chargeArray.length; i++) {
        chargeArray[i] += advanceArray[i];
        chargeArray[i] += chargeAdd[i];
    };

    document.getElementById("minimumCharge").innerText = chargeArray[0];
    document.getElementById("averageCharge").innerText = chargeArray[1];
    document.getElementById("maximumCharge").innerText = chargeArray[2];
};