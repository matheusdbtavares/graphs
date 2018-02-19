/**
 *
 * Configurações globais:
 *
 */
var refreshTime = 1000000;
var monthNames = [
  "Jan",
  "Fev",
  "Mar",
  "Abr",
  "Mai",
  "Jun",
  "Jul",
  "Ago",
  "Set",
  "Out",
  "Nov",
  "Dez"
];

//UX
//var adoptionColors = ['#ff0000', '#a7ca2d', '#0000ff', '#ff8000', '#909090', '#941576', '#159433', '#157694', '#943315', '#10c5cf', '#c5cf10', '#cf27c1'];
var colors = [
  "#51C7E3",
  "#1B75BC",
  "#E4A03C",
  "#6F7E0C",
  "#AAC137",
  "#FF8948",
  "#FF8948",
  "#51C7E3",
  "#81913F",
  "#A03C70",
  "#AA9B8A"
];

//Red
//var adoptionColors = ['#800000', '#8C3362', '#1B75BC', '#6F7E0C', '#AAC137', '#E4A03C', '#F37733', '#51C7E3', '#956619', '#A3712D', '#AA9B8A', '#cf27c1'];

//Prototipo
//var adoptionColors = ['#67c7e2','#36ac9d','#deb418','#2fa200','#8acf3c','#bdcc25'];

var graph = null;
var serverTreatedData = null;
var blockedNames = [];

Number.prototype.formatMoney = function(c, d, t) {
  var n = this,
    c = isNaN((c = Math.abs(c))) ? 2 : c,
    d = d == undefined ? "." : d,
    t = t == undefined ? "," : t,
    s = n < 0 ? "-" : "",
    i = String(parseInt((n = Math.abs(Number(n) || 0).toFixed(c)))),
    j = (j = i.length) > 3 ? j % 3 : 0;
  return (
    s +
    (j ? i.substr(0, j) + t : "") +
    i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) +
    (c
      ? d +
        Math.abs(n - i)
          .toFixed(c)
          .slice(2)
      : "")
  );
};

/**
 *
 * Área do gráfico de adoção: Parte esquerda superior da tela.
 *
 */

function getOperationSummaryData() {
  var url = "http://localhost:8082/s2m-project-productivity-management/v1/total-by-phase";
  //var url = "http://180.239.98.96:9776/s2m-project-productivity-management/v1/total-by-phase";

  $.get(url, function(data, status) {
    processOperationData(data);
  }).fail(function(a, b, c) {
    console.error("Error: " + b);
  });
}

function processOperationData(data) {
  var tbody = $("#tbResumoOperacao tbody");
  tbody.children().remove();

  for (var i = 0; i < data.phaseList.length; i++) {
    var tr = $("<tr/>")
      .append(
        $("<td/>", {
          class: "phase",
          text: data.phaseList[i].phase
        })
      )
      .append(
        $("<td/>", {
          class: "total",
          text: data.phaseList[i].total
        })
      )
      .append(
        $("<td/>", {
          text: data.phaseList[i].backlog
        })
      )
      .append(
        $("<td/>", {
          text: data.phaseList[i].inProgress
        })
      )
      .append(
        $("<td/>", {
          text: data.phaseList[i].pending
        })
      )
      .append(
        $("<td/>", {
          text: data.phaseList[i].done
        })
      );
    tbody.append(tr);
  }

  var tr = $("<tr/>")
    .append(
      $("<td/>", {
        class: "phase",
        text: data.listTotals.phase
      })
    )
    .append(
      $("<td/>", {
        class: "total",
        text: data.listTotals.total
      })
    )
    .append(
      $("<td/>", {
        text: data.listTotals.backlog
      })
    )
    .append(
      $("<td/>", {
        text: data.listTotals.inProgress
      })
    )
    .append(
      $("<td/>", {
        text: data.listTotals.pending
      })
    )
    .append(
      $("<td/>", {
        text: data.listTotals.done
      })
    );
  tbody
    .parent()
    .children("tfoot")
    .append(tr);
}

//RefreshVariables
var lastRefresh = null;
var lastI = null;
$(document).ready(function() {
  refreshPage();
});

function refreshPage() {
  refreshPage(false);
}
var updated = false;
function refreshPage(forced) {
  var mock = false;

  if (updated && !forced) {
    return;
  }

  if (lastRefresh == null || new Date() - lastRefresh > refreshTime) {
    lastRefresh = new Date();

    if (!mock) {
      getOperationSummaryData();
    } else {
      if (lastI == null || lastI >= graphResponse.length - 1) {
        lastI = -1;
      }
      lastI++;

      processGraphData(graphResponse[lastI]);
    }
    setTimeout(refreshPage, refreshTime);
  }
}