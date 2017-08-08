$(document).ready(function () {
    var innerBTN = '<p id="color_choose" title="调整颜色"></p>',
        innerDiv = ' <div class="color_chooseBox">' +
            '<div class="color-wrap">' +
            '<div class="color-item">' +
            '<span id="color_noBegin" class="color_itemBtn">计划未开工</span>' +
            '</div>' +
            '<div class="color-item">' +
            '<span id="color_Begin" class="color_itemBtn">计划已开工</span>' +
            '</div>' +
            '<div class="color-item">' +
            '<span id="color_rnoBegin" class="color_itemBtn">实际未开工</span>' +
            '</div>' +
            '<div class="color-item">' +
            '<span id="color_rBegin" class="color_itemBtn">实际已开工</span>' +
            '</div>' +
            '<div class="color-item">' +
            '<span id="color_Late" class="color_itemBtn">进度滞后</span>' +
            '</div>' +
            '</div>' +
            '<div class="color_submit">' +
            '<p class="color_add">确定</p>' +
            '<p class="color_move">取消</p>' +
            '</div>' +
            '</div>';

    $("#VC_Entity_WBSListToolbar_Module").append(innerBTN);
    $("#VC_Entity_WBSListToolbar_Module").append(innerDiv);

    var colorBtn = $("#color_choose"),
        colorRight = $(".color_add"),
        colorMove = $(".color_move"),
        colorItemBtn = $(".color_itemBtn");


    colorBtn.click(function () {
        $(".color_chooseBox").toggle();
    });
    colorRight.click(function () {
        console.log($("#VC_Entity_WBSListToolbar_Module").find(".l-btn").eq(0))
        console.log($(this).parents(".color_chooseBox").find(".color_itemBtn").eq(0).css("backgroundColor"));


        var focusBtn = $("#VC_Entity_WBSListToolbar_Module").find(".l-btn").eq(0);
        var focusColor = $(this).parents(".color_chooseBox").find(".color_itemBtn").eq(0).css("backgroundColor");

        focusBtn.css("background", focusColor);
        for (var i = 0; i < colorItemBtn.length; i++) {
            var focusColor = $(this).parents(".color_chooseBox").find(".color_itemBtn").eq(i).css("background"),
                focusBtn = $("#VC_Entity_WBSListToolbar_Module").find(".l-btn").eq(i);

            focusBtn.css("background", focusColor);
        }

    });
    colorMove.click(function () {
        $(".color_chooseBox").hide();
    })
})