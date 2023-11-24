const aptitudeArray = ["weapon skill","ballistic skill","strength","toughness","agility","intelligence","perception","willpower","fellowship","offence","finesse","defence","psyker","tech","knowledge","leadership","fieldcraft","social"];
const assassinBS = ["agility","ballistic skill","fieldcraft","finesse","perception"];
const assassinWS = ["agility","weapon skill","fieldcraft","finesse","perception"];
const chirurgeon = ["fieldcraft","intelligence","knowledge","strength","toughness"];
const desperado = ["agility","ballistic skill","defence","fellowship","finesse"];
const hierophant = ["fellowship","offence","social","toughness","willpower"];
const mystic = ["defence","intelligence","knowledge","perception","willpower"];
const sage = ["intelligence","knowledge","perception","tech","willpower"];
const seeker = ["fellowshop","intelligence","perception","social","tech"];
const warrior = ["ballistic skill","defence","offence","strength","weapon skill"];

function setup() {
    var aptitudeGrid = document.getElementById("aptitudeGrid");
    for (var i = 0; i < aptitudeArray.length; i++) {
        var newDiv = document.createElement("div");
        var newInput = document.createElement("input");
        var newLabel = document.createElement("label");
        var textNode = document.createTextNode(aptitudeArray[i]);
        newInput.setAttribute("type","checkbox");
        newInput.setAttribute("id",aptitudeArray[i]);
        newInput.setAttribute("class","attributeCheckbox")
        newLabel.setAttribute("for",aptitudeArray[i]);
        newLabel.append(textNode);
        newDiv.append(newInput);
        newDiv.append(newLabel);
        aptitudeGrid.append(newDiv);
    }
}

function submit() {
    var roleArray = [assassinBS, assassinWS, chirurgeon, desperado, hierophant, mystic, sage, seeker, warrior];
    var desired = [];
    var elements = document.getElementsByClassName("attributeCheckbox");
    for (var i = 0; i < elements.length; i++) {
        if (elements[i].checked == true) {
            desired.push(elements[i].id);
        };
    };
    console.log("desired: "+desired);
    if (document.getElementById("psykerCheck").checked == true) {
        roleArray.splice(5,1);
    };
    console.log(roleArray);
}