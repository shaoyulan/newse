function AccordionMenu(elem) {
    if ($(elem).next().is(":hidden")) {
        $(elem).addClass('clk');
    } else {
        $(elem).removeClass('clk');
    }
    $(elem).next().slideToggle();
}

function AccordionMenu(elem, list_class, btn_class) {
    var status = 0;
    $(list_class).slideUp();
    $(btn_class).removeClass('clk');

    if ($(elem).next().is(":hidden")) {
        $(elem).addClass('clk');
        $(elem).next().slideDown();

    } else {
        $(elem).removeClass('clk');
        $(elem).next().slideUp();
    }
}
