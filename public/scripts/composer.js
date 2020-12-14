$(window).on('scroll', () => {
    if (window.scrollY === 0) {
        $("#scroll-top").css("height", "0px");
        $("#scroll-top").css("opacity", "0");
  
    }
    if (window.scrollY > 0) {
        $("#scroll-top").css("opacity", "1");
        $("#scroll-top").css("height", "60px");
    }

})

$("#scroll-top").on('click', () => {
    window.scrollTo(0, 0);
})