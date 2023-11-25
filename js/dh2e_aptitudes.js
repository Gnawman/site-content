const aptitudeArray = ["weapon skill","ballistic skill","strength","toughness","agility","intelligence","perception","willpower","fellowship","offence","finesse","defence","psyker","tech","knowledge","leadership","fieldcraft","social"];

const assassinBS = [["agility","ballistic skill","perception"] , ["fieldcraft","finesse"]];
const assassinWS = [["agility","weapon skill","perception"] , ["fieldcraft","finesse"]];
const chirurgeon = [["intelligence","strength","toughness"] , ["fieldcraft","knowledge"]];
const desperado = [["agility","ballistic skill","defence"] , ["fellowship","finesse"]];
const hierophant = [["fellowship","toughness","willpower"] , ["offence","social"]];
const mystic = [["intelligence","perception","willpower"] , ["defence","knowledge"]];
const sage = [["intelligence","perception","willpower"] , ["knowledge","tech"]];
const seeker = [["fellowship","intelligence","perception"] , ["social","tech"]];
const warrior = [["ballistic skill","strength","weapon skill"] , ["defence","offence"]];

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
    };
};

function submit() {
    var roleArray = [assassinBS, assassinWS, chirurgeon, desperado, hierophant, mystic, sage, seeker, warrior];
    var roleArrayNames = ["assassin (ballistic skill)","assassin (weapon skill)","chirurgeon","desperado","hierophant","mystic","sage","seeker","warrior"];
    var desires = [];
    var checkedBoxes = document.getElementsByClassName("attributeCheckbox");
    for (var i = 0; i < checkedBoxes.length; i++) {
        if (checkedBoxes[i].checked == true) {
            desires.push(checkedBoxes[i].id);
        };
    };
 
    if (document.getElementById("psykerCheck").checked == true) {
        roleArray.splice(5,1);
        roleArrayNames.splice(5,1);
    };

    var matches = [];

    for (var i = 0; i < desires.length; i++) {
        var roleMatch = [];
        for (var j = 0; j < roleArray.length; j++) {
            if (roleArray[j][0].includes(desires[i])) {
                roleMatch.push(desires[i]);
            };
            if (roleArray[j][1].includes(desires[i])) {
                roleMatch.push(desires[i]);
            };
        };
        matches.push(roleMatch);
        console.log(roleMatch);
    };
    console.log(matches);
};