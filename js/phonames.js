function returnPhoname() {
    // TODO replace this with reading from a dropdown or button
    var spice = 0.5;

    var firstName = constructPhoname(spice);
    var secondName = constructPhoname(spice);
    var fullName = firstName.concat(" ", secondName);

    document.getElementById('namedisplay').innerHTML = fullName;
}

function constructPhoname(spice) {
    var name = [];

    name+=constructPhoneme();

    while (true) {
        if (Math.random() > 0.5) {
            name+=constructPhoneme();
        } else {
            console.log(name);
            return name;
        }
    }
}

function constructPhoneme() {
    var phoneme = []
    var consonants = ["b","d","f","g","h","j","k","l","m","n","ng","p","r","s","t","v","w","y","z","zh","ch","sh","th"];
    var vowels = ["a","e","i","o","u"];

    if (Math.random() > 0.2) {
        phoneme+=consonants[Math.floor(Math.random() * consonants.length)];
        phoneme+=vowels[Math.floor(Math.random() * vowels.length)];
    } else {
        phoneme+=vowels[Math.floor(Math.random() * vowels.length)];
    }
    if (Math.random() > 0.3) {
        phoneme+=consonants[Math.floor(Math.random() * consonants.length)];
    }

    console.log(phoneme);
    return phoneme;
}