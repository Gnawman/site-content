function returnPhoname() {
    var consonants = ["b","d","f","g","h","j","k","l","m","n","ng","p","r","s","t","v","w","y","z","zh","ch","sh","th"];
    var vowels = ["a","e","i","o","u"];
    // TODO replace this with reading from a dropdown or button
    var spice = 0.5;

    var firstName = constructPhoname(spice,consonants,vowels);
    var secondName = constructPhoname(spice,consonants,vowels);
    var fullName = firstName.concat(" ", secondName);

    document.getElementById('namedisplay').innerHTML = fullName;
}

function constructPhoname(spice,consonants,vowels) {
    var name = "";

    if (Math.random() > 0.2) {
        name+=consonants[Math.floor(Math.random() * consonants.length)];
        name+=vowels[Math.floor(Math.random() * vowels.length)];
    } else {
        name+=vowels[Math.floor(Math.random() * vowels.length)];
    }

    while (true) {
        if (Math.random() > 0.5) {
            name+=consonants[Math.floor(Math.random() * consonants.length)];
            name+=vowels[Math.floor(Math.random() * vowels.length)];
        }
        if (Math.random() > 0.5) {
            name+=vowels[Math.floor(Math.random() * vowels.length)];
        }
        if (Math.random() > 0.5) {
            name+=consonants[Math.floor(Math.random() * consonants.length)];
        }
        if (Math.random() > 0.5) {
            return name;
        }
    }
}