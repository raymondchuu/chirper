$(document).ready(() => {
    $("#tweet-text").on('keyup', function() {
        const length = this.value.length;
        const counter = $(this).next().children(".counter");

        counter.text(140 - length);

        if (140 - length < 0) {
            counter.css("color","red")
        }
        else {
            counter.css("color","#545149")
        }
    })
})