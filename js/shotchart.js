function setup() {
    //setting up event listeners on every field so any change updates values
    document.getElementById("toHit").addEventListener("input", numberWang);
    document.getElementById("damageMod").addEventListener("input", numberWang);
    document.getElementById("damageDice").addEventListener("input", numberWang);
    document.getElementById("targetAC").addEventListener("input", numberWang);
    document.getElementById("advSelect").addEventListener("change", numberWang);
}

// calculates final hit chance using advantage state. Penalty should be -5 when sharpshooting
function getHitChance(toHit,toHitPenalty,targetAC,advState) {
    var hitChanceNoClamp = (21 - (targetAC - (toHit+toHitPenalty)))/20;
    var hitChanceRaw = Math.min(Math.max(hitChanceNoClamp, 0.05), 0.95);
    switch (advState) {
        case 0:
            var hitChance = hitChanceRaw;
            break;
        case 1:
            var hitChance = 1 - (1-hitChanceRaw) * (1-hitChanceRaw);
            break;
        case 2:
            var hitChance = 1 - (1-hitChanceRaw) * (1-hitChanceRaw) * (1-hitChanceRaw);
            break;
        case 3:
            var hitChance = hitChanceRaw * hitChanceRaw;
            break;
    };
    return hitChance;
};

function getCritDamage(damageDice,damageMod,advState) {
    switch (advState) {
        case 0:
            var critChance = 0.05;
            break;
        case 1:
            var critChance = 0.0975;
            break;
        case 2:
            var critChance = 0.142625;
            break;
        case 3:
            var critChance = 0.0025;
            break;
    };
    var critDamage = critChance * ((2 * damageDice) + damageMod);
    return critDamage;
}

function numberWang() {
    // grabbing variables from input
    var toHit = +document.getElementById("toHit").value;
    var damageMod = +document.getElementById("damageMod").value;
    var damageDice = +document.getElementById("damageDice").value;
    var targetAC = +document.getElementById("targetAC").value;
    // returns index of [no advantage, advantage, triple-advantage, disadvantage]
    var advState = +document.getElementById("advSelect").selectedIndex; 

    // uses advantage state to get hit chance without and with sharpshooter
    var hitChance = getHitChance(toHit,0,targetAC,advState);
    var hitChanceSharp = getHitChance(toHit,-5,targetAC,advState);

    // uses advantage state to get weighted crit damage
    var critDamage = getCritDamage(damageDice,damageMod,advState);

    var hitDamage = damageDice + damageMod;
    var finalDamage = (hitChance * hitDamage) + critDamage;
    var finalDamageSharp = (hitChanceSharp * (hitDamage+10)) + critDamage;

    if (finalDamageSharp > finalDamage) {
        sharpshootDisplay = "<h2 style='color:#70A288'>SHARPSHOOT</h2>";
    } else {
        sharpshootDisplay = "<h2 style='color:#B48EAE'> DON'T SHARPSHOOT</h2>";
    };

    document.getElementById("sharpshootDisplay").innerHTML = sharpshootDisplay;    
    
    document.getElementById("critDamage").innerHTML = "advantage-weighted crit damage: "+critDamage.toFixed(3);
    document.getElementById("hitChance").innerHTML = "hit chance adjusted for advantage: "+hitChance.toFixed(3);
    document.getElementById("finalDamage").innerHTML = "average damage: "+finalDamage.toFixed(3);

    document.getElementById("hitChanceSharp").innerHTML = "sharpshooter hit chance: "+hitChanceSharp.toFixed(3);
    document.getElementById("finalDamageSharp").innerHTML = "average sharpshooter damage: "+finalDamageSharp.toFixed(3);
};

function accordion(elementId) {
    var x = document.getElementById(elementId);
    if (x.classList.contains("accordion-hide")) {
        x.className = x.className.replace("accordion-hide", "accordion-show");
    } else {
        x.className = x.className.replace("accordion-show", "accordion-hide");
    }
}