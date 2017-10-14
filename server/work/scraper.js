const scraperjs = require('scraperjs');

scraperjs.StaticScraper.create('https://news.google.com/news/headlines?ned=us&hl=en')
    .scrape(function($) {
        return $('a[role="heading"]').map(function() {
            return $(this).text();
        }).get();
    })
    .then(function(news) {
        console.log(news);
    })
