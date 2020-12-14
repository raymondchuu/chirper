/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */

 $(document).ready(() => {    
    const escape = (str) => {
        let div = document.createElement('div');
        div.appendChild(document.createTextNode(str));
        return div.innerHTML;
    }

    const createTweetElement = (tweet) => {
        const name = tweet.name;
        const avatar = tweet.avatars;
        const handle = tweet.handle;
        const text = tweet.chirp;
        const created = tweet.created_at;
        const createdDaysAgo = Math.round((Date.now() - created) / 1000 / 60 / 60 / 24);
    
        const returnTweet = 
        `
         <article class="tweet" >
            <header className="tweet-article">
            <div>
                <img src="${avatar}" alt="Avatar" />
                <span>${name}</span>
            </div>
                <span class="twitter-handle">${handle}</span>
            </header>
            <p>${escape(text)}</p>
            <footer class="tweet-footer">
            <span class="date-posted">${createdDaysAgo} Days ago</span>
            <div>
                <ion-icon name="flag"></ion-icon>
                <ion-icon name="repeat"></ion-icon>
                <ion-icon name="heart"></ion-icon>
            </div>
            </footer>
        </article>
        `
        return returnTweet;
    }

    const renderTweets = (tweets) => {
        $("#tweet-container").empty();
        tweets.forEach(tweet => {
            const newTweet = createTweetElement(tweet);
            $("#tweet-container").prepend(newTweet);
        })

    }

    const validateTweet = (length) => {
        const error = $("#error");

        if (length === 0) {
            error.append(`<ion-icon name="warning"></ion-icon> Tweet can't be empty! Share you tweet with everybody! <ion-icon name="happy-outline"></ion-icon>`)
            error.slideDown('slow');
            setTimeout(() => {
                error.slideUp('slow');
            }, 3000);
            
            return false;
        }

        else if (length > 140) {
            error.text(`Yo relax you're writing a tweet, not an entire novel! <ion-icon name="happy-outline"></ion-icon>`);
            error.slideDown('slow');
            setTimeout(() => {
                error.slideUp('slow');
            }, 3000);
            
            return false;
        }

        else {
            return true;
        }
    }

    $("#new-tweet-submit-btn").on('click', function(event) {
        const tweetText = $("#tweet-text");
        const tweetName = $("#name");
        const tweetHandle = $("#handle");
        const error = $("#error");
        const len = tweetText.val().length;
        
        event.preventDefault();
        error.empty();
        if (validateTweet(len)) {
            jQuery.post("/tweets", {
                user: {
                    name: tweetName.val(),
                    handle: tweetHandle.val(),
                },
                text: tweetText.val()
            })
            .then(() => {
                loadTweets();
            })
    
            tweetText.val("").focus();
            $(".counter").text(140);
        }
    })

    const loadTweets = () => {
        jQuery.get("/tweets")
        .then((tweets) => {
            renderTweets(tweets);
        })
    }

    $(".toggle-tweet").on('click', () => {
        if ($(".new-tweet").css("display") === "none") {
            $(".new-tweet").slideDown('slow');
        }
        else {
            $(".new-tweet").slideUp('slow');
        }
    })

    loadTweets();

 })