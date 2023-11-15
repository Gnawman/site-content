function setup() {
    //setting up event listeners on every field so any change updates values
    document.getElementById("toHit").addEventListener("input", render);
    document.getElementById("damageMod").addEventListener("input", render);
    document.getElementById("damageDice").addEventListener("input", render);
    document.getElementById("targetAC").addEventListener("input", render);
    document.getElementById("advSelect").addEventListener("change", render);
    render();
    for (i=0; i<26; i++) {
        var damagePointId = "damagePoint"+i;
        var damagePointSharpId = "damagePointSharp"+i;
        document.getElementById(damagePointId).addEventListener("mouseover", showDamageTooltip, false);
        document.getElementById(damagePointSharpId).addEventListener("mouseover", showDamageTooltip, false);
    }
}

function showDamageTooltip(evt) {
    var pointPos = evt.currentTarget.getBoundingClientRect();
    var pointDamage = +evt.currentTarget.dataset.damage;
    var chartPos = document.getElementById("chart").getBoundingClientRect();
    console.log(chartPos.y);
    var tooltipDamage = document.getElementById("tooltipDamage");
    tooltipDamage.style.left = window.scrollX + pointPos.x - 8 + "px";
    tooltipDamage.style.top = window.scrollY + pointPos.y - 16 + "px";
    tooltipDamage.style.display = "block";
    tooltipDamage.innerHTML = pointDamage.toFixed(2);
//    console.log(pointPos,chartPos);
}

// called every time any field updates, calls damageArray, updates display, draws chart
function render() {
    // grabbing variables from input
    var toHit = +document.getElementById("toHit").value;
    var damageMod = +document.getElementById("damageMod").value;
    var damageDice = +document.getElementById("damageDice").value;
    var targetAC = +document.getElementById("targetAC").value;
    // returns index of [no advantage, advantage, triple-advantage, disadvantage]
    var advState = +document.getElementById("advSelect").selectedIndex; 

    //damageArray returns an array as follows [finalDamage,finalDamageSharp,hitChance,hitChanceSharp,critDamage]
    var returns = damageArray(toHit,damageMod,damageDice,targetAC,advState);

    document.getElementById("finalDamage").innerHTML = "average damage<br>no sharpshooter:<br>"+returns[0].toFixed(2);
    document.getElementById("finalDamageSharp").innerHTML = "average damage<br>sharpshooter:<br>"+returns[1].toFixed(2);

    if (returns[1] > returns[0]) {
        sharpshootDisplay = "<h2 style='color:#70A288'>SHARPSHOOT</h2>";
    } else {
        sharpshootDisplay = "<h2 style='color:#B48EAE'>DON'T SHARPSHOOT</h2>";
    };

    document.getElementById("sharpshootDisplay").innerHTML = sharpshootDisplay;

    var chart = makeChart(toHit,damageMod,damageDice,targetAC,advState);
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

// we use advantage state to select hardcoded crit chance and determine crit damage
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

//damageArray returns an array as follows [finalDamage,finalDamageSharp,hitChance,hitChanceSharp,critDamage]
function damageArray(toHit,damageMod,damageDice,targetAC,advState) {

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

function makeChart(toHit,damageMod,damageDice,targetAC,advState) {

    // setting up size and drawing axes
    var chart = "<svg height='500' width='500' id='chart'>";
    chart += "<line x1='0' y1='500' x2='0' y2='0' style='stroke:#84857E;stroke-width:2' />";
    chart += "<line x1='0' y1='500' x2='500' y2='500' style='stroke:#84857E;stroke-width:2' />";
    // drawing line at current targetAC position
    chart += "<line x1='"+ (targetAC-5)*20 +"' y1='500' x2='"+ (targetAC-5)*20 +"' y1='0' style='stroke:#84857E;stroke-width:1' />";
    
    // generating x-axis scale lines
    for (var i=20; i<501; i+=20) {
        chart += "<line id='xScaleLine"+i+"' x1='"+ i +"' y1='500' x2='"+ i +"' y2='490' style='stroke:#84857E;stroke-width:1' />";
    };

    // getting damage points for each value of targetAC 5-30
    var damagePointsRaw = [];
    var damagePointsRawSharp = [];
    for (var i=0; i<26; i++) {
        //damageArray returns an array as follows [finalDamage,finalDamageSharp,hitChance,hitChanceSharp,critDamage]
        damagePointsRaw.push(damageArray(toHit,damageMod,damageDice,i+5,advState)[0]);
        damagePointsRawSharp.push(damageArray(toHit,damageMod,damageDice,i+5,advState)[1]);
    };

    // now we begin some numberwang
    // highest damage will always be attacking 5AC, so we check index [0]
    if (damagePointsRawSharp[0] > damagePointsRaw[0]) {
        // double bitwiseNOT the highest damage to remove any fractions, then add 1 
        var yAxisCase = (~~damagePointsRawSharp[0]+1)
        // set up a ratio between that and 500, because that's how tall the chart is
        var normaliseRatio = yAxisCase / 500;
    } else {
        // normal will only do more damage at 5AC if your to-hit is negative, but it's good to support edge cases
        var yAxisCase = (~~damagePointsRaw[0]+1)
        var normaliseRatio = yAxisCase / 500;
    };

    // now we're really numberwanging
    // Dividing the yAxis into 5 results in 3-4 lines, which are pleasing and reasonable numbers
    var yAxisDecrement = (~~(yAxisCase/5)+1);

    // generating y-axis scale lines normalised between 0 and 500
    for (var i=yAxisCase; i>0; i-=yAxisDecrement) {
        var x = 0;
        lineHeight = i/normaliseRatio;
        chart += "<line id='yAxisLine'" + x + "' x1='0' y1='"+lineHeight+"' x2=500 y2='"+lineHeight+"' style='stroke:#84857E;stroke-width:1' />";
        
        x += 1;
    };

    // and now we normalise the damage points as well
    var damagePointsNormal = [];
    var damagePointsNormalSharp = [];
    for (var i=0; i<26; i++) {
        damagePointsNormal.push(damagePointsRaw[i]/normaliseRatio);
        damagePointsNormalSharp.push(damagePointsRawSharp[i]/normaliseRatio);
    }

    // constructing arrays of AC & finalDamage pairs for normal and sharpshooter
    var linePoints = [];
    for (var i=0; i<26; i++) {
        linePoints.push(i*20);
        linePoints.push(500-damagePointsNormal[i]);
    };

    var linePointsSharp = [];
    for (var i=0; i<26; i++) {
        linePointsSharp.push(i*20);
        linePointsSharp.push(500-damagePointsNormalSharp[i]);
    };

    // drawing lines from the damage points
    chart += "<polyline points='"
    for (var i=0; i<52; i++) {
        chart += linePoints[i]+",";
        i++;
        chart += linePoints[i]+" ";
    };
    chart += "' style='fill:none;stroke:#B48EAE;stroke-width:3' />";

    chart += "<polyline points='"
    for (var i=0; i<52; i++) {
        chart += linePointsSharp[i]+",";
        i++;
        chart += linePointsSharp[i]+" ";
    };
    chart += "' style='fill:none;stroke:#70A288;stroke-width:3' />";

    // drawing points from damage points
    for (var i=0; i<52;i++) {
        chart += "<circle data-damage='"+damagePointsRaw[i/2]+"' id='damagePoint"+i/2+"' cx='"+linePoints[i];
        i++;
        chart += "' cy='"+linePoints[i]+"' r='3' style='fill:#B48EAE' />";
    };

    for (var i=0; i<52;i++) {
        chart += "<circle data-damage='"+damagePointsRawSharp[i/2]+"' id='damagePointSharp"+i/2+"' cx='"+linePointsSharp[i];
        i++;
        chart += "' cy='"+linePointsSharp[i]+"' r='3' style='fill:#70A288' />";
    };    

    // finally closing the svg 
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