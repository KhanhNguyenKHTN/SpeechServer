var buttons = document.getElementsByClassName('btn');
var limit = document.getElementById('limit');
var currentPage = buttons[0].innerText;

for (let index = 1; index < buttons.length; index++) {
    const element = buttons[index];
    if(element.classList.length == 2){
        currentPage = element.innerText;
    }
}

function previousPage() {
    var i = parseInt(currentPage, 10);
    if(i != 1)
    {
        window.location.href = '/audio/?limit=' + limit.innerText + '&page=' + (i - 1);
    }
}

function nextPage() {
    var i = parseInt(currentPage, 10);
    window.location.href = '/audio/?limit=' + limit.innerText + '&page=' + (i + 1);
}


var input = document.getElementById('input-search');
input.addEventListener("keyup", function(event) {
    if (event.keyCode === 13) {
      event.preventDefault();
      window.location.href = '/audio/?search=' + input.value;
    }
  });