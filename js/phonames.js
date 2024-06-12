function returnPhoname() {
    // TODO replace this with reading from a dropdown or button
    var lengthWeight = 0.7;
    var spice = 0;

    var firstName = constructPhoname(lengthWeight,spice);
    var secondName = constructPhoname(lengthWeight,spice);
    var fullName = firstName.concat(" ", secondName);

    document.getElementById('namedisplay').innerHTML = fullName;
}

function constructPhoname(lengthWeight,spice) {
    var name = [];

    name+=constructPhoneme(spice);

    while (true) {
        if (Math.random() < lengthWeight) {
            name+=constructPhoneme();
            lengthWeight = lengthWeight - 0.34;
        } else {
            if (name.length == 1) {
                name+=constructPhoneme();
                console.log("NOT JUST VOWEL")
            }
            return name;
        }
    }
}

function constructPhoneme(spice) {
    var phoneme = []
    var consonants = ["b","d","f","g","h","l","m","n","p","r","s","t","y"];
    if (spice == 1) {
        consonants = consonants.concat("ng","zh","ch","sh","th","z","w","v","j","k");
    }
    var vowels = ["a","e","i","o","u"];

    if (Math.random() > 0.3) {
        phoneme+=consonants[Math.floor(Math.random() * consonants.length)];
        phoneme+=vowels[Math.floor(Math.random() * vowels.length)];
    } else {
        phoneme+=vowels[Math.floor(Math.random() * vowels.length)];
    }
    if (Math.random() > 0.3) {
        phoneme+=consonants[Math.floor(Math.random() * consonants.length)];
    }
    return phoneme;
}