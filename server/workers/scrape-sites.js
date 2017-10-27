// This file is not called by the application.
// This file shows how to use a scraper to collect files.


// #0 Set up
var scraperjs = require('scraperjs'),
    router = new scraperjs.Router();

router
    .otherwise(function(url) {
    console.log("Url '"+url+"' couldn't be routed.");
});

var path = {};



// #1 Identify routes to scrape by scraping a home page for all href attributes inside the anchor tags (all links on the page)
scraperjs.StaticScraper.create('https://example.com/')
  .scrape(function($) {
      return $("a").map(function() {
          return $(this).attr("href");
      }).get();
  })
  // #1.5 Print all of the links captured from that page.
  // What is returned is a JSON object of links, where each key is a number in order (1, 2, 3)
  .then(function(links) {
    console.log('***** Links captured from home page to be scraped *****')
    console.log(links);
    // #2 Scrape the links in the links array (that were just printed)
    // A route is created with the "on" promise.
    // See documentation here on the format of items to go in the on-promise: https://github.com/aaronblohowiak/routes.js#path-formats
    // Basically, this is scraping code that can be re-used on routes in this format, but ONLY in this format
    // NOT yet sure how to add multiple route formats using "on" because "addRoute" appears not to be used by scraperjs.  Maybe it is and I don't know about it.
    router.on('https://example.com/:title')
        // Next you specify the scraper for that route by either calling the promises createStatic, createDynamic or use, which will receive a scraper instantiated elsewhere.
        .createStatic()
        // scrape function is the same as before
        .scrape(function($) {
            return $("title").map(function() {
                return $(this).text();
            }).get();
        })
        // Print the contents, just as we did before
        .then(function(links) {
          console.log(links);
        })

      // #3 Loop through all of the links and print the ones with valid url paths
      for (linkNumber in links) {
        console.log("******")
        console.log("Link: ", linkNumber);
        console.log("URL: ", links[linkNumber]);
        router.route(links[linkNumber], function() {
            console.log("i'm done");
        });
      }
    });
