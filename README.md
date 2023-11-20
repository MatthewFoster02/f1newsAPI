# Latest F1 News API
This GitHub repository is the source code for an [express-js](https://expressjs.com/) server, which has API endpoints that return JSON data for the latest F1 articles from F1, BBC, SKY, WTF1, and Autosport.
The [cheerio](https://www.npmjs.com/package/cheerio) library is used to scrape the aforementioned websites for the links to their articles.

Cheerio - scrapes the source html of each of the F1 news sources (F1, BBC, SKY, WTF1, Autosport). Each article link becomes an object with title, link, and source.
Express-js - Runs the server, hosts the two endpoints. /news - returns all articles, /news/:sourceID - returns all articles with sourceID.
Axois - accesses the source websites so cheerio can scrape.

The server is hosted on the free tier of [Render](https://render.com/), which can mean delays when trying to access endpoints as the server shutsdown during periods with no traffic 
and must reboot when a request is received. 

### Want to access the data yourself, visit the following endpoints:

[https://f1newsapi.onrender.com/news](https://f1newsapi.onrender.com/news) to get all articles

[https://f1newsapi.onrender.com/news/:sourceID](https://f1newsapi.onrender.com/news/f1) and enter your own prefered source (f1 [default], bbcf1, skyf1, wtf1, autosport)
