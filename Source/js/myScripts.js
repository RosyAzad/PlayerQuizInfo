function showMessage()
{
console.log("Hi ,Method Called")
}

$('#List').click(function() { 
        // $('#div_1').hide();
        // $('#div_2').show();
        loadDoc();
    });

function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 ) {
    myFunction(this);
    }
  };
  xhttp.open("GET", "./js/famous_scientists.json", true);
  xhttp.send();
}

function myFunction(obj)
{
var doc =obj.response;
//console.log(doc["quizName"])
var data = JSON.parse(doc);
var newUL = document.createElement('ul');
//for(var i in data)
//{
var newLI = document.createElement('li');
newLI.innerText = data["_id"];
newUL.appendChild(newLI);
//}
document.body.appendChild(newUL);
}

