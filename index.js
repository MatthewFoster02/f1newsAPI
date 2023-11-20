// Set port
const PORT = process.env.PORT || 5044;

// Set dependencies
const express = require('express');
const cheerio = require('cheerio');
const axios = require('axios');
const fs = require('fs');
const cors = require("cors");

const corsOptions = {
   origin: '*', 
   credentials: true,            //access-control-allow-credentials:true
   optionSuccessStatus: 200,
}

// Set app
const app = express();

app.use(cors(corsOptions)); // Use this after the variable declaration

// Load in f1 news sources to scrape
let rawdata = fs.readFileSync('f1sources.json');
let news_sources = JSON.parse(rawdata);

// Define articles array, list of recent f1 news articles from the sources
let articles = [];
const refresh = function refreshContent()
{
    loadContent();
}
function loadContent()
{
    articles = [];
    for(let key in news_sources)
    {
        getArticles(key, news_sources[key]);
    }
}
loadContent();

// Home page route
app.get('/', (req, res) =>
{
    res.json('Home route. Use /news, or /news/{source_name} to get data back...');
});

// All news page route
app.get('/news', (req, res) =>
{
    res.json(articles);
});

// Get the news from just one source
app.get('/news/:sourceID', (req, res) =>
{
    const sourceID = req.params.sourceID;
    specified_articles = [];
    articles.forEach(article =>
    {
        if(article.source == sourceID)
        {
            specified_articles.push(article);
        }
    });
    res.json(specified_articles);
});

// Listen for app running
app.listen(PORT, () => console.log(`Server is running on PORT ${PORT}.`));

// Get articles function which adds recent articles to the articles array
function getArticles(name, news_source)
{
    // Getting the html of each of the sources
    axios.get(news_source.address).then(res => 
    {
        const html = res.data;
        const $ = cheerio.load(html);   // Defining cheerio object

        let previosLinks = [];
        // Finding all a tags in the html
        $('a', html).each(function ()
        {
            const link = $(this).attr('href'); // Getting the link value
            if(link == undefined) return; // Guard on undefined link

            // Switch based on which source as each requires unique parsing
            switch(name)
            {
                case 'f1':
                    // F1, check link has specific substring
                    if(link.includes('latest/article'))
                    {
                        // Add to articles, title of article, link to article, and the source
                        articles.push(
                            {
                                title: cleanTitle(name, $(this).text()),
                                url: news_source.base + link,
                                source: name
                            }
                        );
                    }
                    break;
                case 'skyf1':
                    // Check for substring, this is same for all...
                    if(link.includes('www.skysports.com/f1/news'))
                    {
                        if(link.includes('/topic/')) return; // Guard on links containing certain keywords
                        if(previosLinks.filter(x => x==link).length == 1) // The second occurence of each link contains the correct title
                        {
                            articles.push(
                                {
                                    title: cleanTitle(name, $(this).text()),
                                    url: news_source.base + link,
                                    source: name
                                }
                            );
                        }
                        previosLinks.push(link);
                    }
                    break;
                case 'BBCF1':
                    if(link.includes('/sport/formula1/'))
                    {
                        let prefixLength = '/sport/formula1/'.length;
                        let article = link.substring(prefixLength);
                        if(parseInt(article) > 60000000) // Ensuring we are viewing only current articles.
                        {
                            articles.push(
                                {
                                    title: cleanTitle(name, $(this).text()),
                                    url: news_source.base + link,
                                    source: name
                                }
                            );
                        }
                    }
                    break;
                case 'WTF1':
                    if(link.includes('/post/'))
                    {
                        // Guard on certain keywords that shouldn't be present in final article links
                        if(link.includes('author') || link.includes('#respond') || link.includes('series_circuit') || link.includes('#comments')) return;
                        if(previosLinks.filter(x => x==link).length == 2) // If this is the 3rd occurence, it has the correct title
                        {
                            articles.push(
                                {
                                    title: cleanTitle(name, $(this).text()),
                                    url: news_source.base + link,
                                    source: name
                                }
                            );
                        }
                        previosLinks.push(link);
                    }
                    break;
                case 'autosport':
                    if(link.includes('/f1/news/'))
                    {
                        let prefixLength = '/f1/news/'.length;
                        if(link.length <= prefixLength) return; // Guard which stops links containing only '/f1/news/'
                        if(link.includes('?p=')) return; // Guard on links with this substring
                        if(previosLinks.filter(x => x==link).length == 1) // The second occurence of each link contains the correct title
                        {
                            articles.push(
                                {
                                    title: cleanTitle(name, $(this).text()),
                                    url: news_source.base + link,
                                    source: name
                                }
                            );
                        }
                        previosLinks.push(link);
                    }
                    break;
            }
        });
    }).catch(err => console.log(err));
}

function cleanTitle(name, title)
{
    title = title.replaceAll("’", "'");
    title = title.replaceAll("‘", "'");
    switch(name)
    {
        case 'f1':
            title = title.replaceAll('Feature', '');
            title = title.replaceAll('News', '');
            title = title.replaceAll('Report', '');
            title = title.replaceAll('Video', '');
            title = title.replaceAll('Poll', '');
            title = title.replaceAll('Image Gallery', '');
            break;
        case 'skyf1':
            break;
        case 'BBCF1':
            break;
        case 'WTF1':
            break;
        case 'autosport':
            title = title.replaceAll("\"", "'");
            break;
    }
    title = title.trim();
    return title;
}

setInterval(refresh, 1000*60); // Refresh content every minute
