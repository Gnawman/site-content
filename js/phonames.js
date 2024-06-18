function returnPhoname() {
    // TODO replace this with reading from a dropdown or button
    let spice = document.getElementById("spice").value;

    let firstName = constructPhoname(spice);
    let secondName = constructPhoname(spice);
    let fullName = firstName.concat(" ", secondName);

    document.getElementById('namedisplay').innerHTML = fullName;
}

function constructPhoname(spice) {
    let name = [];
    let phonemeSeed = Math.floor(Math.random()*spice);
    console.log(phonemeSeed);

    if (phonemeSeed > 120) {
        name+=phoneme(0);
        name+=phoneme(0);
        name+=phoneme(4);
        name+=phoneme(4);
        if (Math.random() < 0.4) {
            name+=phoneme(6);
        }
    } else if (phonemeSeed > 80) {
        name+=phoneme(0);
        name+=phoneme(1);
        name+=phoneme(4);
        if (Math.random() < 0.4) {
            name+=phoneme(6);
        }
    } else if (phonemeSeed > 60) {
        name+=phoneme(0);
        name+=phoneme(2);
        name+=phoneme(6);
        if (Math.random() < 0.7) {
            name+=phoneme(5);
        }
    } else if (phonemeSeed > 30) {
        name+=phoneme(2);
        name+=phoneme(3);
    } else if (phonemeSeed > 5) {
        name+=phoneme(2);
    } else {
        name+=phoneme(4);
    }

    return name;
}

function phoneme(phonemeCase) {
    let phoneme = [];
    let consonants = ["b","d","f","g","h","l","m","n","p","r","s","t"];
    let consonantsSpice = ["b","d","f","g","h","l","m","n","p","r","s","t","y","ng","zh","ch","sh","th","z","w","v","j","k"];
    let vowels = ["a","e","i","o","u"];

    switch (phonemeCase) {
        case 0:
            phoneme+=consonantsSpice[Math.floor(Math.random()*consonantsSpice.length)];
            phoneme+=vowels[Math.floor(Math.random() * vowels.length)];
            phoneme+=consonantsSpice[Math.floor(Math.random()*consonantsSpice.length)];
            break;
        case 1:
            phoneme+=consonantsSpice[Math.floor(Math.random()*consonantsSpice.length)];
            phoneme+=vowels[Math.floor(Math.random() * vowels.length)];
            phoneme+=consonants[Math.floor(Math.random()*consonants.length)];
            break;
        case 2:
            phoneme+=consonants[Math.floor(Math.random()*consonants.length)];
            phoneme+=vowels[Math.floor(Math.random() * vowels.length)];
            phoneme+=consonants[Math.floor(Math.random()*consonants.length)];
            break;
        case 3:
            phoneme+=consonants[Math.floor(Math.random()*consonants.length)];
            phoneme+=vowels[Math.floor(Math.random() * vowels.length)];
            break;
        case 4:
            phoneme+=vowels[Math.floor(Math.random() * vowels.length)];
            phoneme+=consonants[Math.floor(Math.random()*consonants.length)];
            break;
        case 5:
            phoneme+=consonants[Math.floor(Math.random()*consonants.length)];
            break;
        case 6:
            phoneme+=vowels[Math.floor(Math.random() * vowels.length)];
            break;
    }

    return phoneme;
}