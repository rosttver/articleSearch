$(document).ready(function() {
	// http://developer.nytimes.com/io-docs
    const apikey = 'ba3b30036fbbaf1bc28b5ff1d75c6499:0:73977323';

    // Check if input was changed
    var timer;
    var doneTypingInterval = 700;
    // Selecting search input
    var search = $('#search');
    // To store query
    var q = "";
    // Initial page on NY Times
    var page = 0;
    // When start typing text in input
    search.on('input', function() {
        clearTimeout(timer);
        timer = setTimeout(apiRequest, doneTypingInterval, this.value, page);
    });
    // Stop typing
    search.on('keydown', function() {
        clearTimeout(timer);
    });
    // Function to call to the api
    function apiRequest(value, page) {
        // Check if value is not empty	
        if (value != '' && value != null) {
            callToApi(value, page);
        }
    }
    // Calling NYTimes API
    function callToApi(query, page) {
        var $article_div = $("#article_results");

        if (q != query) {
            $article_div.empty();
            page = 0;
        }

        q = query;

        $.ajax({
            'type': 'GET',
            'url': 'http://api.nytimes.com/svc/search/v2/articlesearch.json',
            data: {
                'q': query,
                'response-format': "jsonp",
                'api-key': apikey,
                'callback': 'svc_search_v2_articlesearch',
                'page': page // 0 equals to 0-9 articles
            },
            success: function(data) {
                render(data);
            }
        });

    }

    function render(data) {
        // Select article results to append html
        var $article_div = $("#article_results");

        var articles = data["response"]["docs"];
        // To HTML code
        for (var i = 0; i < articles.length; i++) {

            var url = "http://nytimes.com/";

            var content = {
                'title': articles[i]["snippet"],
                'image': articles[i]["multimedia"][0] || '/images/noimg.png',
                'url'  : articles[i]["web_url"]
            };

       		var $a = $("<a>", {
       			href: content["url"]
       		});

            // Making a main div
            var $div = $("<div>", {
                class: "col-md-4 col-sm-4 col-xs-12 news-block"
            });

            var $imgblock = $("<div>", {
                class: "news-image-block"
            });

            var $img = $("<img>", {
                class: "news-image",
                src: content['image']['url'] ? url + content['image']['url'] : "images/noimg.png",
                width: "190px",
                height: "126px"
            });

            $($img).appendTo($a);

            $($a).appendTo($imgblock);

            $($imgblock).appendTo($div);

            $a_title = $("<a>", {
            	class: "title_url",
            	href: content["url"]
            });

            // Adding title
            var $title = $("<h4>", {
                class: "news-title",
                text: content["title"]
            });

            $($title).appendTo($a_title);

            $($a_title).appendTo($div);

            // console.log(articles[i]);

            $($div).appendTo($article_div).fadeIn(300);


        }
        // Adding class to the last element
        $($div).addClass("lchild");

        // waypoint.js 
        // here we select element which will be triggered when we reach it
        var waypoint = new Waypoint({
            element: $(".lchild"),
            offset: '75%',
            handler: function(direction) {
                // Calling to api again
                // If direction is down
                if (direction === 'down') {
                	// Remove old last child
                	$(".lchild").removeClass("lchild");
                	callToApi(q, page++);
            	}
            }
        });

    }

});
