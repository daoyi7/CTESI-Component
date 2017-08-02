<script>
$(document).ready(function() {
    var innerHTML = '<div class="right_click_menu">'+
        '<div class="right_click_menu_wrap">'+
        '<div class="right_click_menu_list">'+
        '<div class="right_click_menu_list_text" info="菜单１">菜单１</div>'+
        '<div class="right_click_menu_list_icon"></div>'+
        '</div>'+
        '<div class="right_click_menu_list">'+
        '<div class="right_click_menu_list_text">菜单2</div>'+
        '<div class="right_click_menu_list_icon"></div>'+
        '</div>'+
        '<div class="right_click_menu_list">'+
        '<div class="right_click_menu_list_text">菜单3</div>'+
        '<div class="right_click_menu_list_icon"></div>'+
        '</div>'+
        '<div class="right_click_menu_list_line"></div>'+
        '<div class="right_click_menu_list">'+
        '<div class="right_click_menu_list_text">菜单4</div>'+
        '<div class="right_click_menu_list_icon"></div>'+
        '</div>'+
        '<div class="right_click_menu_list">'+
        '<div class="right_click_menu_list_text">菜单5</div>'+
        '<div class="right_click_menu_list_icon"></div>'+
        '</div>'+
        '<div class="right_click_menu_list_line"></div>'+
        '</div>'+
        '<div class="right_click_menu_wrap">'+
        '<div class="right_click_menu_list">'+
        '<div class="right_click_menu_list_text">菜单2</div>'+
        '<div class="right_click_menu_list_icon"></div>'+
        '</div>'+
        '<div class="right_click_menu_list">'+
        '<div class="right_click_menu_list_text">菜单2</div>'+
        '<div class="right_click_menu_list_icon"></div>'+
        '</div>'+
        '<div class="right_click_menu_list_line"></div>'+
        '<div class="right_click_menu_list">'+
        '<div class="right_click_menu_list_text">菜单3</div>'+
        '<div class="right_click_menu_list_icon"></div>'+
        '</div>'+
        '<div class="right_click_menu_list_line"></div>'+
        '<div class="right_click_menu_list">'+
        '<div class="right_click_menu_list_text">菜单4</div>'+
        '<div class="right_click_menu_list_icon"></div>'+
        '</div>'+
        '<div class="right_click_menu_list">'+
        '<div class="right_click_menu_list_text">菜单5</div>'+
        '<div class="right_click_menu_list_icon"></div>'+
        '</div>'+
        '</div>'+
        '</div>';

    $("#Form1").append(innerHTML);

    $("body").bind('contextmenu', function(e) {
        var eTarget = e.target;
        var Target = $(eTarget);
        if(Target.parents().is('.datagrid-view2')) {
            var index = Array.prototype.slice.call(eTarget.parentNode.parentNode.children).indexOf(eTarget.parentNode);
            $(".right_click_menu").css({
                'display':'block',
                'left': e.pageX,
                'top': e.pageY,
            });
            $(".right_click_menu_wrap").siblings().hide().eq(index).show();

            $(".right_click_menu_list_text").click(function() {
                alert($(this).attr("info"))
            })
            return false
        }
        if($(".right_click_menu").css("display")=="block") {
            $(".right_click_menu").hide()
        }
    });
    $("body").bind("click",function() {
        if($(".right_click_menu").css("display")=="block") {
            $(".right_click_menu").hide()
        }
    })
})
</script>