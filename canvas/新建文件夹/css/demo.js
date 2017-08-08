var itemH = 400,
    headH = 35;

$(document).ready(function () {
    $(document).on('click','.item-btn',function () {
        $(this).find("i").toggleClass("fa-angle-down")
        if($(this).find("i").hasClass("fa-angle-down")) {
            $(this).parent().parent().parent().find(".bim-body").slideUp();
        }else {
            $(this).parent().parent().parent().find(".bim-body").slideDown();
        }
    })
});
// $(window).resize(function () {
//     $(".bim-body").resize();
// })