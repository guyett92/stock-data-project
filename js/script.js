/*----- constants -----*/
//Images Array
const defaultImg = ['https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80', 
                    'https://images.unsplash.com/photo-1549421263-6064833b071b?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1518&q=80',
                    'https://images.unsplash.com/photo-1559589689-577aabd1db4f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
                    'https://images.unsplash.com/photo-1504607798333-52a30db54a5d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
                    'https://images.unsplash.com/photo-1579532582937-16c108930bf6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1351&q=80',
                    'https://images.unsplash.com/photo-1579532536935-619928decd08?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    'https://images.unsplash.com/photo-1513596846216-48ae70153834?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    'https://images.unsplash.com/photo-1570716253702-5c4bc0bbccbf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1350&q=80',
                    'https://images.unsplash.com/photo-1558588942-930faae5a389?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
                    'https://images.unsplash.com/photo-1585829364536-ce348dd72ebc?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'];
/*----- app's state (variables) -----*/
let userInput, stockData, stockData2, logoData, curPrice, curDaily, basePrice, baseChange;
/*----- cached element references -----*/
const $input = $('input[type="text"]');
const $logo = $('#logo');
const $name = $('#name');
const $price = $('#price');
const $daily = $('#daily');
const $form = $('form');
const currency = document.getElementById('money');

/*----- event listeners -----*/
$('form').on('submit', handleGetData);
$('button').on('click', clearData);
$('select').on('change', changeCurrency);

/*----- functions -----*/
function handleGetData(e) {
    e.preventDefault();

    if($input.val() === "") return;
    userInput = $input.val();

    $input.val("");
    $('.nyse').hide();

    //Get stock data
    $.ajax({
        url:'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=' + userInput + '&apikey=UYEFNB9NIZ2OB7BW'
    }).then(function(data) {
        stockData = data["Global Quote"];
        render();
    }, function(error){
        console.log('Bad first request: ', error);
    }
    );

    //Get stock name
    $.ajax({
        url:'https://api.worldtradingdata.com/api/v1/stock?symbol=' + userInput + '&api_token=auG6dvpnFIvffbLimM1xD5CzdwXXas6qDQmrMvWBbdoSmS81zG4yLbLTgztF'
    }).then(function(data) {
        stockData2 = data.data[0];
        render2();
    }, function(error) {
        console.log('Bad second request: ', error);
    }
    );

    //Get stock logo
    $.ajax({
        url:'https://autocomplete.clearbit.com/v1/companies/suggest?query=' + userInput
    }).then(function(data) {
        logoData = data;
        render3();
    }, function(error) {
        console.log('Bad third request: ', error);
    }
    );

    //Renders the Form link
    imgMatch();
    //Show the reset button
    $('button').show();
    //Displays info if it is hidden
    displayInfo();
    //Save the price for later conversions
    getPrice();
    //Store a count of each acronym searched
    storeCount();
    //Reset the dropdown
    $("select").val('first').change();
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
    $logo.html("<img src='" + imgUrl + "' alt='logo'>");

    //If the image fails to load
    setTimeout(function(){ 
        if ($logo[0].firstChild.naturalWidth === 0) {
            console.log('Image failed.');
            let arrayIdx = getRandomInt((defaultImg.length - 1));
            $logo.html("<img src='" + defaultImg[arrayIdx] + "' alt='logo'>")
        }
    }, 1);
}

//Random number generator based on the length of images array
function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

//Clear the data and remove the link to the form
function clearData() {
    $('.nyse').show();
    $name.html("");
    $price.html("");
    $daily.html("");
    $logo.html("<img src='img/nyse.jpg' alt='logo'>");
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
    if ($('dt').last().text() === 'Logo Incorrect?') {
        return
    } else {
    $('dl').append('<dt>Logo Incorrect?</dt><dd class="verify"><a class="link" href="https://forms.gle/9BSgavxTuaGDbhnr6" target="_blank">Click here!</a></dd>');
    }
}

//Function to display the information if it isn't showing
function displayInfo() {
    if ($('dl').css('display') === 'none') {
        $('dl').show("slow");
    }
}

//Function for currency converter
function changeCurrency() {
    let userChoice = currency.options[currency.selectedIndex].text;
    switch (userChoice) {
        case 'USD':
            usConversion();
            break;
        case 'JPY':
            japanConversion();
            break;
        case 'GBP':
            normConv(0.82 ,"£");
            break;
        case 'CNY':
            normConv(7.08, "¥");
            break;
        case 'EUR':
            normConv(0.92, "€");
            break;
        case 'AED':
            uaeConversion();
            break;
        default:
            break;
    }
}

//Function for converting when symbol is first and the decimal places are rounded to two
function normConv(rate, symbol) {
    curPrice = parseFloat(basePrice * rate).toFixed(2);
    curDaily = parseFloat(baseChange * rate).toFixed(2);
    $price.text(symbol + curPrice);
    $daily.text(symbol + curDaily);
}
//Function for US conversion
function usConversion() {
    $price.text("$" + basePrice);
    $daily.text("$" + baseChange);
}

//Function for Japan conversion
function japanConversion() {
    curPrice = parseInt(basePrice * 107.18);
    curDaily = parseInt(baseChange * 107.18);
    $price.text("¥" + curPrice);
    $daily.text("¥" + curDaily);
}

//Function for UAE conversion
function uaeConversion() {
    curPrice = parseFloat(basePrice * 3.67).toFixed(2);
    curDaily = parseFloat(baseChange * 3.67).toFixed(2);
    $price.text(curPrice + "د.إ");
    $daily.text(curDaily + "د.إ");
}

//Function to convert the price and daily change to a float
function getPrice() {
    setTimeout(function(){ 
            basePrice = parseFloat($price.text().replace(/\$/,''),10);
            baseChange = parseFloat($daily.text().replace(/\$/,''),10);
    }, 500);
}

//Function to store the count of an acronym to localstorage
function storeCount() {
    if (localStorage.getItem(userInput) !== null){
            let counter = parseInt(localStorage.getItem(userInput)) + 1;
            localStorage.setItem(userInput, counter);
    } else {
        localStorage.setItem(userInput, 1);
    }
    let currentCount = 0;
    let currentSybol;
    for (let [key, value] of Object.entries(localStorage)) {
        if (parseInt(value) > currentCount) {
            currentCount = value;
            currentSymbol = key;
        }
    }
    updateFavorite(currentSymbol, currentCount);
}

//Function to update the page after determining the local favorite
function updateFavorite(symbol, count) {
    $('#fav').html(`Your favorite search is ${symbol.toUpperCase()}: You've searched for it ${count} times.`);
}