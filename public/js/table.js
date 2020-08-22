var listTr = document.getElementsByTagName('tr');
var selectedItem = listTr[1];
var baseString = 'http://35.196.95.74/chuong/';
var audio = document.getElementById("audio");

function rowClick(value) {
    selectedItem.classList.remove("active-row");

    console.log(value.innerText);
    var file = value.innerText.replace('Chuong','').replace('chuong','');
    var url = baseString + file;
    var source = document.getElementById('audioSource');
    source.src = url;
    var speed = audio.playbackRate;
    audio.load();
    audio.play();
    audio.playbackRate = speed;
    value.classList.add("active-row");
    selectedItem = value;
}


for (let index = 1; index < listTr.length; index++) {
    const element = listTr[index];
    element.addEventListener("click", function () {
        rowClick(element);
    });
}


