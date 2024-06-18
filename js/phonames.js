function returnPhoname() {
    // TODO replace this with reading from a dropdown or button
    let spice = document.getElementById("spice").value;

    let spiceAdj = Math.random()+0.5;
    let firstNameSpice = spice*spiceAdj;
    let secondNameSpice = spice/spiceAdj;

    let firstName = constructPhoname(firstNameSpice);
    let secondName = constructPhoname(secondNameSpice);
    let fullName = firstName.concat(" ", secondName);

    document.getElementById('namedisplay').innerHTML = fullName;
}

function constructPhoname(spice) {
    let name = [];
    let nameSpice = 0;
    let consonants = ["b","d","f","g","h","l","m","n","p","r","s","t"];
    let consonantsSpice = ["b","d","f","g","h","l","m","n","p","r","s","t","y","ch","sh","th","z","w","v","j","k"];
    let vowels = ["a","e","i","o","u"];
    let consonantStreak = 1;
    let vowelStreak = 1;
    console.log(spice);

    while (nameSpice < spice) {
        if (consonantStreak > 1) {
            name+=vowels[Math.floor(Math.random() * vowels.length)];
            consonantStreak = 0;
            vowelStreak = 1;
            nameSpice += 25;
        }
        if (vowelStreak > 1) {
            name+=consonants[Math.floor(Math.random()*consonants.length)];
            vowelStreak = 0;
            consonantStreak = 1;
            nameSpice += 30;
        }

        if (vowelStreak == 1) {
            if (Math.random() < 0.9) {
                name+=consonantsSpice[Math.floor(Math.random()*consonantsSpice.length)];
                vowelStreak = 0;
                consonantStreak += 1;
                nameSpice += 20;
            } else {
                name+=vowels[Math.floor(Math.random() * vowels.length)];
                consonantStreak = 0;
                vowelStreak += 1;
                nameSpice += 35;
            }
        }

        if (consonantStreak == 1) {
            if (Math.random() < 0.9) {
                name+=vowels[Math.floor(Math.random() * vowels.length)];
                consonantStreak = 0;
                vowelStreak += 1;
                nameSpice += 20;
            } else {
                name+=consonants[Math.floor(Math.random()*consonants.length)];
                vowelStreak = 0;
                consonantStreak += 1;
                nameSpice += 35;
            }
        }
    }

    if (name.length == 1) {
        name+=vowels[Math.floor(Math.random() * vowels.length)];
        name+=consonants[Math.floor(Math.random()*consonants.length)];
    }
    return name;
}