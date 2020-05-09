# Stock Market Data App v1.0
## Technologies Used
* HTML
* CSS
* JavaScript
* jQuery
* AJAX
## APIs Integrated
* Logos: [ClearBit](https://dashboard.clearbit.com/docs#autocomplete-api)
* Names: [WorldTradingData](https://www.worldtradingdata.com/documentation)
* Stock Data: [AlphaVantage](https://www.alphavantage.co/documentation/)
## Features
Users can search for the current price of a stock by using its associated acronym. The application will return the stock's full name and daily change as well. 
The application pulls data from multiple APIs to serve to users once they have made a request.
The logos are pullled from an API that uses queries to search an internal database. The application includes a matching system that parses the title and attempts to align it with the logo query in order to identify the best response. The web page will also serve an image even if one is not loaded and prompts a user to respond to a form if the logos are misaligned.
## User Stories
* Users can request to view the current value of a stock
* Users can identify the name of a stock through the acronym.
* Users will be able to view a logo if it is in a the ClearBit logo API.
## Wireframe
[Balsamiq Wireframe](https://balsamiq.cloud/siuhwm9/psuebbq)
## Pseudocode
[Pseudocode](https://drive.google.com/file/d/14o57qOiqKLFNRfv4N-TSPakvKmoaIogk/view?usp=sharing)
## Goals
* Allow a user to search with the name of a company OR its acronym.
* Add a currency selector to the application.
* Add a way to guarantee that a logo is produced.
* Add data validation to the form.
* Add more information to the home page in the form of media or a small description.