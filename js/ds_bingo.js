function bingoGen() {

    var bigarray = ["Get a Black Knight weapon", "Reach 25 Resistance","Use a Divine Blessing",
    "Kill a Forest Cat","Go through the DLC portal","Get Dragon Greatsword","Join the Darkwraiths",
    "Break the Ring of FAP","BK Halberd Secret Move","Do a ninja flip","Get a Bonewheel Shield",
    "Get Tiny Being's Ring","Red phantom in your world","Get Lordvessel","Defeat Paladin Leeroy",
    "Cast Chameleon","Ascend a weapon to Crystal","Hatch Egghead","Buy Claws","Get a Chaos/ Lightning Zwei",
    "Slow walk from one bonfire to another","Cut a Tail","Wear the Onion set","Get the Covenant of Artorias",
    "Right Hand Only","Get humanity from a rat","Sunlight Maggot shortcut","Cast Gravelord Sword Dance",
    "Make a boss-soul weapon","Get Symbol of Avarice","See all the colours of Prism Stones",
    "Kill Hollowed Crestfallen Warrior","Cast Great Chaos Fireball","Slow walk with Havel's Ring",
    "Get Key to the Seal","Wear Xanthous Crown","Get Silver Serpent Ring","Darken Anor Londo",
    "Kill three giants in Sen's","Upgrade a weapon to max","Kindle a bonfire to max","Get Skull Lantern",
    "Talk to Quelana","Get Priscilla's Dagger","Cast Power Within","Ring both Bells",
    "Kill Lautrec (in his world)","Become a Sackbro","Kill Anor Londo Fire Keeper","Kill the Hellkite Drake",
    "Look Skyward","Wear Armour of Thorns","Cast Lightning Spear","Get cursed and cure yourself",
    "Trade with Snuggly","Do a fire kick","Be a Giantdad/ Havelmum","+4 Estus",
    "Get a Blacksmith Hammer","Shoot a Greatbow","Die to a Grab Attack","Get a Lord's Soul",
    "Kill a boss with use items only","See Slappy Puke","Wear Pig Hat","Never Press R2"];

    /* numberwang generates four 32-bit hashes from the seed */
    function cyrb128(str) {
        let h1 = 1779033703, h2 = 3144134277,
            h3 = 1013904242, h4 = 2773480762;
        for (let i = 0, k; i < str.length; i++) {
            k = str.charCodeAt(i);
            h1 = h2 ^ Math.imul(h1 ^ k, 597399067);
            h2 = h3 ^ Math.imul(h2 ^ k, 2869860233);
            h3 = h4 ^ Math.imul(h3 ^ k, 951274213);
            h4 = h1 ^ Math.imul(h4 ^ k, 2716044179);
        }
        h1 = Math.imul(h3 ^ (h1 >>> 18), 597399067);
        h2 = Math.imul(h4 ^ (h2 >>> 22), 2869860233);
        h3 = Math.imul(h1 ^ (h3 >>> 17), 951274213);
        h4 = Math.imul(h2 ^ (h4 >>> 19), 2716044179);
        return [(h1^h2^h3^h4)>>>0, (h2^h1)>>>0, (h3^h1)>>>0, (h4^h1)>>>0];
    }
    
    /* more numberwang to generate a number between 0 and 1 from the previous numberwang */
    function sfc32(a, b, c, d) {
        return function() {
          a >>>= 0; b >>>= 0; c >>>= 0; d >>>= 0; 
          var t = (a + b) | 0;
          a = b ^ b >>> 9;
          b = c + (c << 3) | 0;
          c = (c << 21 | c >>> 11);
          d = d + 1 | 0;
          t = t + d | 0;
          c = c + t | 0;
          return (t >>> 0) / 4294967296;
        }
    }
    
    // gets seed from input box and feeds it to cyrb128:
    var seed = cyrb128(document.getElementById("inputField").value);
    // Four 32-bit outputs from cyrb128 provide the seed for sfc32.
    var rand = sfc32(seed[0], seed[1], seed[2], seed[3]);

    //shuffling bigarray
    let currentIndex = bigarray.length, randomIndex;
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
        // Pick a remaining element, this calls the previous numberwang which is stored in rand
        randomIndex = Math.floor(rand() * currentIndex);
        currentIndex--;
        // And swap it with the current element.
        [bigarray[currentIndex], bigarray[randomIndex]] = [bigarray[randomIndex], bigarray[currentIndex]];
    }

    //opening table and first row
    var Table = "<table><tr>";
    
    //main table constructor loop
    for (var i=0; i<25; i++) {
        //start by creating a cell and writing data from shuffled bigarray
        Table+="<td>".concat(bigarray[i],"</td>");
        //check if the cell number is divisible by 5 and not the last
        if (Number.isInteger((i + 1) / 5) && i < 24) {
        //and if it is, close the row and open a new one
            Table+="</tr><tr>"
        }
    }

    //closing last row and table
    Table += "</tr></table>";

    document.getElementById('bingodisplay').innerHTML = Table;

    //select the table
    var tablehighlight = document.querySelector('table');
    //add a click listener to all table cells
    tablehighlight.addEventListener('click', function(e) {
        //toggle the highlight class when clicked
        e.target.classList.toggle('highlight')
    })
}