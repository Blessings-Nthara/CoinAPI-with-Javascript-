String.prototype.replaceAt = function (index, character) {
  return (
    this.substr(0, index) + character + this.substr(index + character.length)
  );
};

String.prototype.insert = function (index, string) {
  if (index > 0)
    return (
      this.substring(0, index) + string + this.substring(index, this.length)
    );
  else return string + this;
};

var typeValue, typeText, cardType, cardName, cardNumber, cardDate, cardId;

$(".overlay").hide();

$("#add").on("click", function (e) {
  e.preventDefault();
  $(".overlay").fadeIn(300);
});

$(".activity").not(".activity.active").hide();

function tabTrigger() {
  $(".card").click(function (e) {
    e.preventDefault();
    $(".card").removeClass("active");
    $(this).addClass("active");

    $(".activity").hide();
    $('.activity[data-id="' + $.attr(this, "data-id") + '"').fadeIn();
  });
}

tabTrigger();

/*$(".card-form .button").on("click", function (e) {
  cardName = $("#cardName").val();
  cardNumber = $("#cardNumber").val();
  for (var i = 0; i < 12; i++) {
    cardNumber = cardNumber.replaceAt(i, "*");
  }
  cardDate = $("#cardDate").val();
  cardCVS = $("#cardCVS").val();

  if ($(".type-form").length) {
    alert("Please complete card type.");
  } else if (cardName == "") {
    alert("Card name appears to be empty.");
  } else if (cardNumber == "") {
    alert("Card number appears to be empty.");
  } else if (cardNumber.length != 16) {
    alert("Card number appears to be less then 16 characters.");
  } else if (cardDate == "") {
    alert("Card date appears to be empty.");
  } else if (cardCVS == "") {
    alert("Card CVS appears to be empty.");
  } else {
    for (var i = 1; i < 4; i++) {
      cardNumber = cardNumber.insert(5 * i - 1, " ");
    }

    cardType = $(".type").text();

    cardId = cardNumber.charAt(15);
    cardId += cardNumber.charAt(16);
    cardId += cardNumber.charAt(17);
    cardId += cardNumber.charAt(18);

    e.preventDefault();
    $(".overlay").fadeOut(300);

    $(".cards .content").append(
      '<div class="card" data-id="' +
        cardId +
        '"><img src="https://s3-us-west-2.amazonaws.com/s.cdpn.io/169963/' +
        cardType +
        '.png"/> <div class="number">' +
        cardNumber +
        '</div> <div class="expiration">Valid Thru: ' +
        cardDate +
        "</div> </div>"
    );

    $(".wallet").append(
      $(
        '<div data-id="' +
          cardId +
          '" class="activity"> <header> <h2>Balance</h2><span>$0.<i>00</i></span> </header> <div class="content"> <div class="transaction transaction-empty">It seems you have no recent transactions.</div></div>'
      ).hide()
    );

    tabTrigger();
    // Addin Account Balance

    $(".form input").val("");
  }
});*/

$(".close").on("click", function (e) {
  $(".overlay").fadeOut(300);
});

function typeChange() {
  typeText = $(".type").text();

  $(".type").on("click", function () {
    $(this).replaceWith(
      '<input class="type-form" type="text" value="' + typeText + '" />'
    );
  });
}

typeChange();

$(document).on("keydown", ".type-form", function (e) {
  if (e.keyCode == 13) {
    e.preventDefault();

    typeValue = $(".type-form").val();

    $(".type-form").replaceWith('<div class="type">' + typeValue + "</div>");

    typeChange();
  }
});

let Coins = {};
var total = 0;

$(document).ready(function () {
  $(".card-form .button").click(function () {
    var coin = $("#cardName").val();
    var amount = $("#cardNumber").val();
    var settings = {
      url: "https://rest.coinapi.io/v1/exchangerate/" + coin + "/USD",
      method: "GET",
      timeout: 0,
      headers: {
        "X-CoinAPI-Key": "2AB81F30-2612-4550-A7A9-7133313AE493",
      },
    };

    $.ajax(settings).done(function (response) {
      const rate = response.rate;
      if (!Coins.hasOwnProperty(coin)) {
        Coins[coin] = rate * amount;
        var cln = document
          .getElementsByClassName("content")[0]
          .children[0].cloneNode(true);
        cln.children[1].children[0].children[0].innerHTML = coin;
        var num = Coins[coin].toFixed(2);
        var num1 = (num + "").split(".")[0];
        var num2 = (num + "").split(".")[1];
        cln.children[1].children[1].innerHTML = "$" + num1 + ".";
        var cn = document.getElementsByTagName("i")[1];
        var bn = cn.cloneNode(true);
        bn.innerHTML = num2;
        document.getElementsByClassName("content")[0].appendChild(cln);
        cln.getElementsByClassName("info")[0].children[1].innerHTML = coin;
        cln.children[1].children[1].appendChild(bn);
        const event = new Date();
        cln.getElementsByClassName("info")[0].children[3].innerHTML =
          "Rate: $" + rate.toFixed(2) + " " + event.toDateString();
        cln.getElementsByClassName("info")[0].children[2].innerHTML = amount;

        total += Coins[coin];
        $(".form input").val("");
        $(".overlay").hide();
      } else {
        var _coindv = document.getElementsByClassName("description");

        for (var i = 0; i < _coindv.length; i++) {
          if (_coindv[i].children[0].children[0].innerHTML == coin) {
            Coins[coin] += rate * amount;
            _coindv[i].getElementsByClassName("info")[0].children[2].innerHTML =
              parseFloat(
                _coindv[i].getElementsByClassName("info")[0].children[2]
                  .innerHTML
              ) + parseFloat(amount);
            var num = Coins[coin].toFixed(2);
            var num1 = (num + "").split(".")[0];
            var num2 = (num + "").split(".")[1];
            _coindv[i].getElementsByClassName("price")[0].innerHTML =
              "$" + num1 + "." + "<i>" + num2 + "<i>";
            total += rate * amount;
            $(".description").show();
            $(".icon").show();
            $(".form input").val("");
            $(".overlay").hide();
          }
        }
      }
      var num_ = total.toFixed(2);
      var num1 = (num_ + "").split(".")[0];
      var num2 = (num_ + "").split(".")[1];

      document.getElementsByTagName("header")[2].children[1].innerHTML =
        "$" + num1 + "." + "<i>" + num2 + "<i>";
    });
  });
});
function myfunction(name) {
  var profit, percent;

  var selectedCoin =
    name.parentNode.nextElementSibling.children[0].children[0].innerHTML;
  var settings = {
    url: "https://rest.coinapi.io/v1/exchangerate/" + selectedCoin + "/USD",
    method: "GET",
    timeout: 0,
    headers: {
      "X-CoinAPI-Key": "2AB81F30-2612-4550-A7A9-7133313AE493",
    },
  };

  $.ajax(settings).done(function (response) {
    const exchangeRate = response.rate;

    availableCoins =
      name.parentNode.nextElementSibling.children[0].children[2].innerHTML;
    profit = (exchangeRate * availableCoins - Coins[selectedCoin]).toFixed(2);
    document.getElementById("prft").innerHTML = " " + "$" + profit;

    percent = ((profit / Coins[selectedCoin]) * 100).toFixed(2);
    if (profit <= 0) {
      document.getElementById("prft").style.color = "red";
    } else document.getElementById("prft").style.color = "green";

    document.getElementById("percent").innerHTML = " " + " " + percent + "%";

    if (percent <= 0) {
      document.getElementById("percent").style.color = "red";
    } else document.getElementById("percent").style.color = "green";

    total -= Coins[selectedCoin];
    var num_ = total.toFixed(2);
    var num1 = (num_ + "").split(".")[0];
    var num2 = (num_ + "").split(".")[1];

    document.getElementsByTagName("header")[2].children[1].innerHTML =
      "$" + num1 + "." + "<i>" + num2 + "<i>";
    delete Coins[selectedCoin];
    $(name.parentNode.nextElementSibling).hide();

    $(name).hide();
  });
}
