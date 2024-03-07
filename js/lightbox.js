// script for handling lightboxes
// all thumbnail images should be in a folder called "thumbs" which replicates the file structure of the actual image library 

// called by onload of page
function lightboxsetup() {
    // add lightbox display elements boilerplate
    // creates the hidden lightbox background <div>
    var lightboxbackground = document.createElement("div")
    lightboxbackground.id = "lightbox-background"
    lightboxbackground.classList.add("lightbox-background")
    lightboxbackground.innerHTML = "click to close"
    lightboxbackground.onclick = function() {hidelightbox()}
    // and the hidden lightbox display <img>
    var lightboximg = document.createElement("img")
    lightboximg.id = "lightbox-img"
    lightboximg.classList.add("lightbox-img")
    lightboximg.onclick = function() {hidelightbox()}
    // appends both to body
    document.body.appendChild(lightboxbackground)
    document.body.appendChild(lightboximg)

    // iterate through all lightbox-thumb imgs
    var imgs = document.getElementsByTagName('img')
    for(var i = 0; i < imgs.length; i++) {
        var img = imgs[i];
        if(img.classList.contains("lightbox-thumb")) {
            // removes /thumb/ from img source path 
            var imgsrc = img.src.split("/")
            imgsrc.splice(0,3)
            imgsrc.splice(1,1)
            var imgsrc = "/"+imgsrc.join("/")
            // calls script to add the lightbox display code to thumb's onclick
            addOnclick (img,imgsrc)
        }
    }
}

// called when lightbox or background are clicked
function hidelightbox() {
    document.getElementById("lightbox-background").style.display = "none"
    var lightboximg = document.getElementById("lightbox-img")
    lightboximg.setAttribute("src", "")
    lightboximg.style.display = "none"
}

// called by setup() script, is contained in function for scoping issues
function addOnclick (img,imgsrc) {
    img.onclick = function() {
        // makes lightbox background visible
        document.getElementById("lightbox-background").style.display = "block"
        var lightboximg = document.getElementById("lightbox-img")
        lightboximg.setAttribute("src", imgsrc)
        lightboximg.style.display = "block"
    }
}