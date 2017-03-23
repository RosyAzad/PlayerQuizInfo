// function showMessage() {
//   console.log("Hi ,Method Called")
// }

// $('#List').click(function() { 
//         // $('#div_1').hide();
//         // $('#div_2').show();
//         loadDoc();
//     });
loadDoc();
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      myFunction(this);
    }
  };
  xhttp.open("GET", "./js/famous_scientists.json", true);
  xhttp.send();
}

function myFunction(obj) {
  var doc = obj.response;
  //console.log(doc["quizName"])
  var myData = JSON.parse(doc);

  var quesPlayerList = document.getElementById("List");
  var tableElement = document.getElementById("Table");
  var graphElement = document.getElementById("Chart");

  var mainQuesListUL = document.createElement('ul');
  quesPlayerList.appendChild(mainQuesListUL);
  var mainQuesListLI = document.createElement('li');
  mainQuesListLI.innerText = 'Question List';
  mainQuesListUL.appendChild(mainQuesListLI);


  var quesNo = 0;
  myData.questions.forEach(function (quesInfo) {
    var newUL = document.createElement('ul');
    mainQuesListLI.appendChild(newUL);
    //document.body.appendChild(newUL);
    quesNo += 1;
    var newLI = document.createElement('li');
    newLI.innerText = "Ques No : " + quesNo;
    newUL.appendChild(newLI);
    var newUL2 = document.createElement('ul');
    newUL.appendChild(newUL2);
    var correctResponses = 0;
    var incorrectResponses = 0;
    var quesText = quesInfo.questionText;
    var newLI2 = document.createElement('li');
    newLI2.innerText = "Question Text : " + quesText;
    newUL2.appendChild(newLI2);
    myData.responses.forEach(function (responseInfo) {
      if (responseInfo["questionId"].includes(quesInfo["_id"]) && responseInfo["response"] ==
        quesInfo["answerIndex"]) {
        correctResponses += 1;
      }
      else if (responseInfo["questionId"].includes(quesInfo["_id"]) && responseInfo["response"] != quesInfo["answerIndex"]) {
        incorrectResponses += 1;
      }

    })

    var newLI3 = document.createElement('li');
    newLI3.innerText = "Correct Responses : " + correctResponses;
    newUL2.appendChild(newLI3);
    var newLI4 = document.createElement('li');
    newLI4.innerText = "Incorrect Responses : " + incorrectResponses;
    newUL2.appendChild(newLI4);
    var perOfCorrectResponse = (correctResponses / (correctResponses + incorrectResponses)) * 100;
    var newPerLi = document.createElement('li');
    newPerLi.innerText = "Percentage of correct responses: " + perOfCorrectResponse;
    newUL2.appendChild(newPerLi);


  })
  var mainPlayerListUL = document.createElement('ul');
  quesPlayerList.appendChild(mainPlayerListUL);
  var mainPlayerListLI = document.createElement('li');
  mainPlayerListLI.innerText = 'Player List';
  mainPlayerListUL.appendChild(mainPlayerListLI);
  myData.players.forEach(function (player) {
    var newUL = document.createElement('ul');
    mainPlayerListLI.appendChild(newUL);
    //document.body.appendChild(newUL);
    //quesNo += 1;
    var newLI = document.createElement('li');
    newLI.innerText = "Player Name : " + player['id'];
    newUL.appendChild(newLI);
    var newUL2 = document.createElement('ul');
    newUL.appendChild(newUL2);

    var correctResponses = 0;
    var incorrectResponses = 0;
    myData.questions.forEach(function (quesInfo) {
      myData.responses.forEach(function (response) {
        if (response["questionId"].includes(quesInfo["_id"]) && response["response"] ==
          quesInfo["answerIndex"] && response["playerId"] == player["id"]) {
          correctResponses += 1;

        }
        else if (response["questionId"].includes(quesInfo["_id"]) && response["response"] != quesInfo["answerIndex"] && response["playerId"] == player["id"]) {
          incorrectResponses += 1;
        }

      })
    })
    var newLI3 = document.createElement('li');
    newLI3.innerText = "Correct Responses : " + correctResponses;
    newUL2.appendChild(newLI3);
    var newLI4 = document.createElement('li');
    newLI4.innerText = "Incorrect Responses : " + incorrectResponses;
    newUL2.appendChild(newLI4);
    var perOfCorrectResponse = (correctResponses / (correctResponses + incorrectResponses)) * 100;
    var newPerLi = document.createElement('li');
    newPerLi.innerText = "Percentage of correct responses: " + perOfCorrectResponse;
    newUL2.appendChild(newPerLi);
  })




  var newTable = document.createElement('table');
  newTable.border = 10
  var newRow = document.createElement('tr');
  tableElement.appendChild(newTable);
  newTable.appendChild(newRow);
  var newHeader = document.createElement('th');
  newHeader.innerText = "QUESTIONS";
  newRow.appendChild(newHeader);
  myData.players.forEach(function (playerInfo) {
    var tableHeader = document.createElement('th');
    tableHeader.innerText = playerInfo["id"];
    newRow.appendChild(tableHeader);
  })
  myData.questions.forEach(function (ques) {
    var tableRow = document.createElement('tr');
    var tableData = document.createElement('td');
    tableData.innerText = ques["questionText"];
    newTable.appendChild(tableRow);
    tableRow.appendChild(tableData);

    myData.players.forEach(function (player) {
      myData.responses.forEach(function (responseInfo) {
        if (responseInfo["questionId"].includes(ques["_id"]) && responseInfo["response"] ==
          ques["answerIndex"] && responseInfo["playerId"] == player["id"]) {
          var checkData = document.createElement('td');
          //checkData.innerText = checkData.write('&#8730');
          checkData.innerText = "✔";
          tableRow.appendChild(checkData);
        }
        else if (responseInfo["questionId"].includes(ques["_id"]) && responseInfo["playerId"] == player["id"]) {
          var uncheckData = document.createElement('td');
          //uncheckData.style.fontFamily = 'Arial Unicode MS, Lucida Grande';
          // uncheckData.innerText = uncheckData.write('&#8730');
          uncheckData.innerText = "✗";
          tableRow.appendChild(uncheckData);
        }
      })
    })
  })
  $(function () {
    var quesChart = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Correct Response per Question'
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45
        }
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: 'No. of correct responses'
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Correct Response',
        data: []

      }]
    };
    myData.questions.forEach(function (quesInfo) {
      var correctResponses = 0;
      myData.responses.forEach(function (responseInfo) {
        if (responseInfo["questionId"].includes(quesInfo["_id"]) && responseInfo["response"] ==
          quesInfo["answerIndex"]) {
          correctResponses += 1;
        }
      })
      quesChart.series[0].data.push({
        'name': quesInfo["questionText"],
        'y': correctResponses
      }
      );
    })


    var myCharts = Highcharts.chart('Chart1', quesChart);

    var playersChart = {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Correct Response per Player'
      },
      xAxis: {
        type: 'category',
        labels: {
          rotation: -45
        }
      },
      yAxis: {
        allowDecimals: false,
        min: 0,
        title: {
          text: 'No. of correct responses'
        }
      },
      legend: {
        enabled: false
      },
      series: [{
        name: 'Correct Response',
        data: []

      }]
    };



    myData.players.forEach(function (player) {
      var correctResponses = 0;

      myData.questions.forEach(function (ques) {
        myData.responses.forEach(function (responseInfo) {
          if (responseInfo["questionId"].includes(ques["_id"]) && responseInfo["response"] ==
            ques["answerIndex"] && responseInfo["playerId"] == player["id"]) {
            correctResponses += 1;

          }
        })
      })
      playersChart.series[0].data.push({
        'name': player["id"],
        'y': correctResponses
      }
      );
    })

    var myCharts2 = Highcharts.chart('Chart2', playersChart);

  });
}

