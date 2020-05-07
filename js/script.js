/*----- constants -----*/

/*----- app's state (variables) -----*/
let userInput, stockData, stockData2, logoData;
/*----- cached element references -----*/
const $input = $('input[type="text"]');
const $logo = $('#logo');
const $name = $('#name');
const $price = $('#price');
const $daily = $('#daily');
const $form = $('form');

/*----- event listeners -----*/
$('form').on('submit', handleGetData);
$('button').on('click', clearData);

/*----- functions -----*/
function handleGetData(e) {
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

    $.ajax({
        url:'https://autocomplete.clearbit.com/v1/companies/suggest?query=' + userInput
    }).then(function(data) {
        logoData = data;
        render3();
    }, function(error) {
        console.log('Bad third request: ', error);
    }
    );

    imgMatch();
    $('button').show();
    displayInfo();
}

//Render the stock data
function render() {
    $price.html("$" + parseFloat(stockData["05. price"]).toFixed(2));
    $daily.html("$" + parseFloat(stockData["09. change"]).toFixed(2));
}

//Render the name
function render2() {
    $name.html(stockData2.name);
}

//Render the logo
function render3() {
    let imgUrl = logo();
    $logo.html("<img src=\"" + imgUrl+ "\">");
}

//Clear the data and remove the link to the form
function clearData() {
    $name.html("");
    $price.html("");
    $daily.html("");
    $logo.html("FIX ME ADD IMG");
    $('dt').last().remove();
    $('dd').last().remove();
    $('dl').css('display', 'none');
    $('button').css('display', 'none');
}

//Parse the array of objects and find the best match
function logo() {
    let names = [];
    let result, bestGuess;
    for (let i = 0; i < logoData.length; i++) {
        names.push(logoData[i].name);
    }
    result = names.filter(words => words.toLowerCase().includes(userInput.toLowerCase()));
    for (let i = 0; i < logoData.length; i++) {
        if (logoData[i].name === result[0]) {
            return logoData[i].logo;
        }
    }
}

//Ask user if the image matches
function imgMatch() {
    $('dl').append('<dt>Logo Incorrect?</dt><dd class="verify"><a href="https://forms.gle/9BSgavxTuaGDbhnr6" target="_blank">Click here!</a></dd>');
}

//Function to display the information if it isn't showing
function displayInfo() {
    if ($('dl').css('display') === 'none') {
        $('dl').show("slow");
    }
}