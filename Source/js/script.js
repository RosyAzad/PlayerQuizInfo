loadDoc();
function loadDoc() {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4) {
      CreateTabs(this);
    }
  };
  xhttp.open("GET", "./js/famous_scientists.json", true);
  xhttp.send();
}

function CreateTabs(obj) {
  var doc = obj.response;
  var myData = JSON.parse(doc);

  var quesPlayerList = document.getElementById("List");
  var tableElement = document.getElementById("Table");
  var graphElement = document.getElementById("Chart");

  // Fetching Data
  var quesPlayerResponseMap = GetQuesPlayerReponseMap(myData);
  var quesResponseMap = GetQuesResponseMap(myData);
  var playerResponseMap = GetPlayerResponseMap(myData);

  // Table Tab
  var newTable = document.createElement('table');
  newTable.border = 10
  var newRow = document.createElement('tr');
  newTable.appendChild(newRow);
  var newHeader = document.createElement('th');
  newHeader.innerText = "QUESTIONS";
  newRow.appendChild(newHeader);
  myData.players.forEach(function (playerInfo) {
    var tableHeader = document.createElement('th');
    tableHeader.innerText = playerInfo["id"];
    newRow.appendChild(tableHeader);
  })


  quesPlayerResponseMap.forEach(function (quesPlayerResponseData) {
    var tableRow = document.createElement('tr');
    var tableData = document.createElement('td');
    tableData.innerText = quesPlayerResponseData['quesText'];
    newTable.appendChild(tableRow);
    tableRow.appendChild(tableData);
    quesPlayerResponseData['quesInfo'].forEach(function (playerResponseData) {
      if (playerResponseData['response'] == 1) {
        var checkData = document.createElement('td');
        checkData.innerText = "✔";
        tableRow.appendChild(checkData);
      }
      else {
        var uncheckData = document.createElement('td');
        uncheckData.innerText = "✗";
        tableRow.appendChild(uncheckData);
      }
    })
  })
  tableElement.appendChild(newTable);


  // List Tab
  var mainQuesListUL = document.createElement('ul');
  //quesPlayerList.appendChild(mainQuesListUL);
  var mainQuesListLI = document.createElement('li');
  mainQuesListLI.innerText = 'Question List';
  mainQuesListUL.appendChild(mainQuesListLI);

  var quesNo = 0;
  quesResponseMap.forEach(function (quesInfo) {
    var newUL = document.createElement('ul');
    mainQuesListLI.appendChild(newUL);
    quesNo += 1;
    var newLI = document.createElement('li');
    newLI.innerText = "Ques No : " + quesNo;
    newUL.appendChild(newLI);
    var newUL2 = document.createElement('ul');
    newUL.appendChild(newUL2);
    var quesText = quesInfo['quesText'];
    var newLI2 = document.createElement('li');
    newLI2.innerText = "Question Text : " + quesText;
    newUL2.appendChild(newLI2);

    var newLI3 = document.createElement('li');
    newLI3.innerText = "Correct Responses : " + quesInfo['correctResponses'];
    newUL2.appendChild(newLI3);
    var newLI4 = document.createElement('li');
    newLI4.innerText = "Incorrect Responses : " + quesInfo['incorrectResponses'];
    newUL2.appendChild(newLI4);
    var perOfCorrectResponse = (quesInfo['correctResponses'] / (quesInfo['correctResponses'] + quesInfo['incorrectResponses'])) * 100;
    var newPerLi = document.createElement('li');
    newPerLi.innerText = "Percentage of correct responses: " + perOfCorrectResponse;
    newUL2.appendChild(newPerLi);
  })
  quesPlayerList.appendChild(mainQuesListUL);



  //Chart Tab
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
    quesResponseMap.forEach(function (quesInfo) {

      quesChart.series[0].data.push({
        'name': quesInfo["quesText"],
        'y': quesInfo['correctResponses']
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



    playerResponseMap.forEach(function (player) {

      playersChart.series[0].data.push({
        'name': player['playerId'],
        'y': player['correctResponses']
      }
      );
    })

    var myCharts2 = Highcharts.chart('Chart2', playersChart);

  });
}

function GetQuesResponseMap(mappingData) {
  var quesResponseArray = [];
  mappingData.questions.forEach(function (ques) {
    var correctResponses = 0;
    var incorrectResponses = 0;
    mappingData.responses.forEach(function (responseInfo) {
      if (responseInfo["questionId"].includes(ques["_id"]) && responseInfo["response"] ==
        ques["answerIndex"]) {
        correctResponses += 1;
      }
      else if (responseInfo["questionId"].includes(ques["_id"])) {
        incorrectResponses += 1;
      }
    })
    mapData = new Object();
    mapData['quesId'] = ques["_id"];
    mapData['quesText'] = ques["questionText"];
    mapData['correctResponses'] = correctResponses;
    mapData['incorrectResponses'] = incorrectResponses;
    quesResponseArray.push(mapData);
  })
  return quesResponseArray;
}

function GetPlayerResponseMap(mappingData) {
  var playerResponseArray = [];

  mappingData.players.forEach(function (player) {
    var correctResponses = 0;
    var incorrectResponses = 0;

    mappingData.questions.forEach(function (ques) {
      mappingData.responses.forEach(function (responseInfo) {
        if (responseInfo["questionId"].includes(ques["_id"]) && responseInfo["response"] ==
          ques["answerIndex"] && responseInfo["playerId"] == player["id"]) {
          correctResponses += 1;

        }
        else if (responseInfo["questionId"].includes(ques["_id"]) && responseInfo["playerId"] == player["id"]) {
          incorrectResponses += 1;
        }
      })
    })
    mapData = new Object();
    mapData['playerId'] = player["id"];
    mapData['correctResponses'] = correctResponses;
    mapData['incorrectResponses'] = incorrectResponses;
    playerResponseArray.push(mapData);
  })
  return playerResponseArray;
}

function GetQuesPlayerReponseMap(mappingData) {
  var quesArray = [];
  mappingData.questions.forEach(function (ques) {
    quesIdMapData = new Object();
    quesIdMapData['quesId'] = ques["_id"];
    quesIdMapData['quesText'] = ques["questionText"];
    var playerResponseArray = [];
    mappingData.players.forEach(function (player) {
      mappingData.responses.forEach(function (responseInfo) {
        if (responseInfo["questionId"].includes(ques["_id"]) && responseInfo["response"] ==
          ques["answerIndex"] && responseInfo["playerId"] == player["id"]) {
          playerResponseMapData = new Object();
          playerResponseMapData['playerId'] = player["id"];
          playerResponseMapData['response'] = 1;
          playerResponseArray.push(playerResponseMapData);
        }
        else if (responseInfo["questionId"].includes(ques["_id"]) && responseInfo["playerId"] == player["id"]) {
          playerResponseMapData = new Object();
          playerResponseMapData['playerId'] = player["id"];
          playerResponseMapData['response'] = 0;
          playerResponseArray.push(playerResponseMapData);
        }
      })
    })
    quesIdMapData['quesInfo'] = playerResponseArray;
    quesArray.push(quesIdMapData);
  })
  return quesArray;
}
