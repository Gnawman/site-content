function setup() {
    //setting up event listeners on every field so any change updates values
    document.getElementById("toHit").addEventListener("input", render);
    document.getElementById("damageMod").addEventListener("input", render);
    document.getElementById("damageDice").addEventListener("input", render);
    document.getElementById("targetAC").addEventListener("input", render);
    document.getElementById("advSelect").addEventListener("change", render);
    render();
}

// called every time any field updates, calls numberwang, updates display, draws chart
function render() {

    // grabbing variables from input
    var toHit = +document.getElementById("toHit").value;
    var damageMod = +document.getElementById("damageMod").value;
    var damageDice = +document.getElementById("damageDice").value;
    var targetAC = +document.getElementById("targetAC").value;
    // returns index of [no advantage, advantage, triple-advantage, disadvantage]
    var advState = +document.getElementById("advSelect").selectedIndex; 

    //numberWang returns an array as follows [finalDamage,finalDamageSharp,hitChance,hitChanceSharp,critDamage]
    var returns = numberWang(toHit,damageMod,damageDice,targetAC,advState);

    document.getElementById("finalDamage").innerHTML = "average damage<br>no sharpshooter:<br>"+returns[0].toFixed(2);
    document.getElementById("finalDamageSharp").innerHTML = "average damage<br>sharpshooter:<br>"+returns[1].toFixed(2);

    if (returns[1] > returns[0]) {
        sharpshootDisplay = "<h2 style='color:#70A288'>SHARPSHOOT</h2>";
    } else {
        sharpshootDisplay = "<h2 style='color:#B48EAE'>DON'T SHARPSHOOT</h2>";
    };

    document.getElementById("sharpshootDisplay").innerHTML = sharpshootDisplay;

    var chart = makeChart();
    document.getElementById("chartDisplay").innerHTML = chart;

    document.getElementById("hitChance").innerHTML = "normal hit chance: "+returns[2].toFixed(3);
    document.getElementById("hitChanceSharp").innerHTML = "sharpshooter hit chance: "+returns[3].toFixed(3);
    document.getElementById("critDamage").innerHTML = "weighted crit damage: "+returns[4].toFixed(3);

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
}

// uses hardcoded crit chance to determine crit damage
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

//numberWang returns an array as follows [finalDamage,finalDamageSharp,hitChance,hitChanceSharp,critDamage]
function numberWang(toHit,damageMod,damageDice,targetAC,advState) {

    // uses advantage state to get hit chance without and with sharpshooter
    var hitChance = getHitChance(toHit,0,targetAC,advState);
    var hitChanceSharp = getHitChance(toHit,-5,targetAC,advState);

    // uses advantage state to get weighted crit damage
    var critDamage = getCritDamage(damageDice,damageMod,advState);

    // calculates final returns
    var hitDamage = damageDice + damageMod;
    var finalDamage = (hitChance * hitDamage) + critDamage;
    var finalDamageSharp = (hitChanceSharp * (hitDamage+10)) + critDamage;

    return [finalDamage,finalDamageSharp,hitChance,hitChanceSharp,critDamage];
}

function makeChart() {
    // grabbing variables from input TODO remove this because it's doubled in render()
    var toHit = +document.getElementById("toHit").value;
    var damageMod = +document.getElementById("damageMod").value;
    var damageDice = +document.getElementById("damageDice").value;
    var targetAC = +document.getElementById("targetAC").value;
    // returns index of [no advantage, advantage, triple-advantage, disadvantage]
    var advState = +document.getElementById("advSelect").selectedIndex; 

    var chart = "<svg height='500' width='500'>";
    chart += "<line x1='0' y1='500' x2='0' y2='0' style='stroke:#84857E;stroke-width:2' />";
    chart += "<line x1='0' y1='500' x2='500' y2='500' style='stroke:#84857E;stroke-width:2' />";
    chart += "<line x1='"+ (targetAC-5)*20 +"' y1='500' x2='"+ (targetAC-5)*20 +"' y1='0' style='stroke:#84857E;stroke-width:1' />";
    
    // generating x-axis scale lines
    for (var i=20; i<501; i+=20) {
        chart += "<line x1='"+ i +"' y1='500' x2='"+ i +"' y2='490' style='stroke:#84857E;stroke-width:1' />";
    };

    var damagePointsRaw = [];
    var damagePointsRawSharp = [];
    for (var i=0; i<26; i++) {
        //numberWang returns an array as follows [finalDamage,finalDamageSharp,hitChance,hitChanceSharp,critDamage]
        damagePointsRaw.push(numberWang(toHit,damageMod,damageDice,i+5,advState)[0]);
        damagePointsRawSharp.push(numberWang(toHit,damageMod,damageDice,i+5,advState)[1]);
    };

    if (damagePointsRawSharp[0] > damagePointsRaw[0]) {
        var yAxisCase = (~~damagePointsRawSharp[0]+1)
        var normaliseRatio = yAxisCase / 500;
    } else {
        var yAxisCase = (~~damagePointsRaw[0]+1)
        var normaliseRatio = yAxisCase / 500;
    };

    var yAxisDecrement = (~~(yAxisCase/5)+1);
    console.log(yAxisCase);
    console.log(yAxisDecrement);
    console.log(yAxisCase-yAxisDecrement)

    // generating y-axis scale lines
    for (var i=yAxisCase; i>0; i-=yAxisDecrement) {
        lineHeight = i/normaliseRatio;
        chart += "<line x1='0' y1='"+lineHeight+"' x2=500 y2='"+lineHeight+"' style='stroke:#84857E;stroke-width:1' />";
    };

    var damagePointsNormal = [];
    var damagePointsNormalSharp = [];
    for (var i=0; i<26; i++) {
        damagePointsNormal.push(damagePointsRaw[i]/normaliseRatio);
        damagePointsNormalSharp.push(damagePointsRawSharp[i]/normaliseRatio);
    }

    // constructing array of AC & finalDamage pairs
    var points = [];
    for (var i=0; i<26; i++) {
        //numberWang returns an array as follows [finalDamage,finalDamageSharp,hitChance,hitChanceSharp,critDamage]
        points.push(i*20);
        points.push(500-damagePointsNormal[i]);
    };

    var pointsSharp = [];
    for (var i=0; i<26; i++) {
        //numberWang returns an array as follows [finalDamage,finalDamageSharp,hitChance,hitChanceSharp,critDamage]
        pointsSharp.push(i*20);
        pointsSharp.push(500-damagePointsNormalSharp[i]);
    };

    // plotting line
    chart += "<polyline points='"
    for (var i=0; i<52; i++) {
        chart += points[i]+",";
        i++;
        chart += points[i]+" ";
    };
    chart += "' style='fill:none;stroke:#B48EAE;stroke-width:3' />";

    // plotting sharpshooter line
    chart += "<polyline points='"
    for (var i=0; i<52; i++) {
        chart += pointsSharp[i]+",";
        i++;
        chart += pointsSharp[i]+" ";
    };
    chart += "' style='fill:none;stroke:#70A288;stroke-width:3' />";

    chart += "</svg>";
    return chart;
}

function accordion(elementId) {
    var x = document.getElementById(elementId);
    if (x.classList.contains("accordion-hide")) {
        x.className = x.className.replace("accordion-hide", "accordion-show");
    } else {
        x.className = x.className.replace("accordion-show", "accordion-hide");
    }
}