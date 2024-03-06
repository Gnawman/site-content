function setup() {
    var imgs = document.getElementsByTagName('img');
        for(var i = 0; i < imgs.length; i++) {
            var img = imgs[i];
            if(img.classList.contains("lightbox_thumb")) {
                var imgsrc = img.src.split("/")
                imgsrc.splice(0,3)
                imgsrc.splice(1,1)
                var imgsrc = "/"+imgsrc.join("/")
                addOnclick (img,imgsrc)
            }
        }
}

function hidelightbox() {
    document.getElementById("lightbox_background").style.display = "none"
    document.getElementById("lightbox_img").style.display = "none"
}

function addOnclick (img,imgsrc) {
    img.onclick = function() {
    document.getElementById("lightbox_background").style.display = "block"
    var lightbox_img = document.getElementById("lightbox_img")
    lightbox_img.style.display = "block"
    lightbox_img.setAttribute("src", imgsrc);
    console.log(imgsrc) }
}