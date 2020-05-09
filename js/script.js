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