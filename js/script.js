/*----- constants -----*/

/*----- app's state (variables) -----*/
let userInput, stockData, stockData2;

/*----- cached element references -----*/
const $input = $('input[type="text"]');
const $logo = $('#logo');
const $name = $('#name');
const $price = $('#price');
const $daily = $('#daily');

/*----- event listeners -----*/
$('form').on('submit', handleGetData);

/*----- functions -----*/
function handleGetData(e) {
    // clearData();
    e.preventDefault();

    if($input.val() === "") return;
    userInput = $input.val();

    $input.val("");

    $.ajax({
        url:'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + userInput + '&apikey=UYEFNB9NIZ2OB7BW'
    }).then(function(data) {
        stockData = data["Global Quote"];
        render();
    }, function(error){
        console.log('Bad first request: ', error);
    }
    );

    $.ajax({
        url:'https://api.worldtradingdata.com/api/v1/stock?symbol=' + userInput + '&api_token=auG6dvpnFIvffbLimM1xD5CzdwXXas6qDQmrMvWBbdoSmS81zG4yLbLTgztF'
    }).then(function(data) {
        stockData2 = data.data[0];
        render2();
    }, function(error) {
        console.log('Bad second request: ', error);
    }
    );
}

function render() {
    $price.html("$" + parseFloat(stockData["05. price"]).toFixed(2));
    $daily.html("$" + parseFloat(stockData["09. change"]).toFixed(2));
}

function render2() {
    logo();
    $name.html(stockData2.name);
}

function clearData() {
    $name.html("");
    $price.html("");
    $daily.html("");
    logo.html("FIX ME ADD IMG");
}

function logo() {
    let firstWord = userInput.replace(/ . */,'');
    if (imageExists("https://logo.clearbit.com/" + userInput + ".com")) {
        $logo.html("<img src=\"https://logo.clearbit.com/" + userInput + ".com\">");
    } else if (imageExists("https://logo.clearbit.com/" + stockData2.name + ".com")) {
        $logo.html("<img src=\"https://logo.clearbit.com/" + stockData2.name + ".com\">");
    } else if (imageExists("https://logo.clearbit.com/" + firstWord + ".com")) {
        $logo.html("<img src=\"https://logo.clearbit.com/" + firstWord + ".com\">");
    } else {
        $logo.html("FIXME: ADD FAILED IMAGES");
    }
}

// function imageExists(imageUrl) {
//     $.get(imageUrl)
//     .done(function() {
//         return true;
//     }).fail(function() {
//         return false;
//     });
// }