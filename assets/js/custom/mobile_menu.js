
$(function () {
    var mobile_header = 0;

    // 判斷header高
    mobile_header = $('#mobile_header').height();

    $('#hb_menu').css({
        "height": "calc(100% - " + mobile_header + "px)",
        top: mobile_header + "px"
    });

});


function mobile_menu(path) {
    var hb_menu_s = 0;
    var mobile_header = $('#mobile_header').height(),
        menu_width=  $('#hb_menu').width() + 200,
        menu_height= $('#hb_menu').height();

    // 右滑出
    if (path == "right") {
        $('#hb_menu').css({ "right":-menu_width+"px" });
        $('#hb_btn').click(function () {
            if (hb_menu_s == 0) {
                $('#hb_menu').css("right", "0");
                $('.hide_menu_box').css("display", "block");
                hb_menu_s = 1;
            } else {
                $('#hb_menu').css("right", -menu_width+"px");
                $('.hide_menu_box').css("display", "none");
                hb_menu_s = 0;
            }
        });

        $('.hide_menu_box').click(function () {
            $('#hb_menu').css("right", -menu_width+"px");
            $('.hide_menu_box').css("display", "none");
            hb_menu_s = 0;
        });
    }

    // 左滑出
    else if (path == "left") {
        $('#hb_menu').css({ "left": "-445px" });
        $('#hb_btn').click(function () {
            if (hb_menu_s == 0) {
                $('#hb_menu').css("left", "0");
                $('.hide_menu_box').css("display", "block");
                hb_menu_s = 1;
            } else {
                $('#hb_menu').css("left", -menu_width+"px");
                $('.hide_menu_box').css("display", "none");
                hb_menu_s = 0;
            }
        });

        $('.hide_menu_box').click(function () {
            $('#hb_menu').css("left", -menu_width+"px");
            $('.hide_menu_box').css("display", "none");
            hb_menu_s = 0;
        });
    }

    // 上滑出
    else if (path == "top") {
        $('#hb_menu').css({ "left": "0", "top": "-1000px"});
        $('#hb_btn').click(function () {
            if (hb_menu_s == 0) {
                $('#hb_menu').css("top", mobile_header + "px");
                $('.hide_menu_box').css("display", "block");
                hb_menu_s = 1;
            } else {
                $('#hb_menu').css("top", "-1000px");
                $('.hide_menu_box').css("display", "none");
                hb_menu_s = 0;
            }
        });

        $('.hide_menu_box').click(function () {
            $('#hb_menu').css("top", -menu_height+"px");
            $('.hide_menu_box').css("display", "none");
            hb_menu_s = 0;
        });
    }

}
