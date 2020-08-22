var listTr = document.getElementsByTagName('tr');
var curIndex = 1;
var currentId = 1;
var speed = document.getElementById("speed-audio");
var audio = document.getElementById("audio");
audio.playbackRate = 1.2;
speed.innerText = audio.playbackRate.toFixed(2);

function updateData(){
    for (let index = 1; index < listTr.length; index++) {
        const element = listTr[index];
        if(element.classList.length == 1){
            var temp = element.innerText.replace('Chuong','').replace('chuong','').replace('.mp3','').trim();
            currentId = parseInt(temp, 10);
            currentStore = element;
            curIndex = index;
        }
    }
}

updateData();
console.log(listTr[curIndex]);
listTr[curIndex].click();

function previous(){
    updateData();
    curIndex = curIndex - 1;
    if(curIndex < 1) {
        document.getElementById('previous').click();
    } else
    {
        listTr[curIndex].click();
    }
}
function next(){
    updateData();
    curIndex = curIndex + 1;
    if(curIndex > listTr.length -1) {
        document.getElementById('next').click();
    } else
    {
        listTr[curIndex].click();
    }
}
function fast(){
    audio.playbackRate += 0.1;
    speed.innerText=audio.playbackRate.toFixed(2);
}
function slow(){
    audio.playbackRate -= 0.1;
    speed.innerText=audio.playbackRate.toFixed(2);
}

speed.onclick = function() {
    if(!audio.paused) {
        audio.pause();
    }else{
        audio.play();
    }
}

audio.onended = function() {
    var soundEffect = document.getElementsByClassName('effect');
    for (let i = 0; i < soundEffect.length; i++) {
        const element = soundEffect[i];
        element.classList.remove('effect-hidden');
        element.classList.add('effect-hidden');
    }
    next();
};

audio.onplay = function() {
    var soundEffect = document.getElementsByClassName('effect');
    for (let i = 0; i < soundEffect.length; i++) {
        const element = soundEffect[i];
        element.classList.remove('effect-hidden');
    }
};

audio.onpause = function() {
    var soundEffect = document.getElementsByClassName('effect');
    for (let i = 0; i < soundEffect.length; i++) {
        const element = soundEffect[i];
        element.classList.remove('effect-hidden');
        element.classList.add('effect-hidden');
    }
};