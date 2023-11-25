const aptitudeArray = ["weapon skill","ballistic skill","strength","toughness","agility","intelligence","perception","willpower","fellowship","offence","finesse","defence","psyker","tech","knowledge","leadership","fieldcraft","social"];

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
    var assassinBS = [["agility","ballistic skill","perception"] , ["fieldcraft","finesse"]];
    var assassinWS = [["agility","weapon skill","perception"] , ["fieldcraft","finesse"]];
    var chirurgeon = [["intelligence","strength","toughness"] , ["fieldcraft","knowledge"]];
    var desperado = [["agility","ballistic skill","defence"] , ["fellowship","finesse"]];
    var hierophant = [["fellowship","toughness","willpower"] , ["offence","social"]];
    var mystic = [["intelligence","perception","willpower"] , ["defence","knowledge"]];
    var sage = [["intelligence","perception","willpower"] , ["knowledge","tech"]];
    var seeker = [["fellowship","intelligence","perception"] , ["social","tech"]];
    var warrior = [["ballistic skill","strength","weapon skill"] , ["defence","offence"]];
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

    for (var i = 0; i < roleArray.length; i++) {
        for (var j = 0; j < desires.length; j++) {
            if (roleArray[i][0].includes(desires[j])) {
                var index = roleArray[i][0].indexOf(desires[j]);
                roleArray[i][0].splice(index,1);
            };
            if (roleArray[i][1].includes(desires[j])) {
                var index = roleArray[i][1].indexOf(desires[j]);
                roleArray[i][1].splice(index,1);
            };
        };
    };

    for (var i = 0; i < roleArray.length; i++) {
        if (roleArray[i][0].length == 0 && roleArray[i][1].length ==0 ) {
            console.log(roleArrayNames[i]);
        };
    };
};
