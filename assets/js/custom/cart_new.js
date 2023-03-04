// 取得產品規格資料
function GetProductData() {
    this.initialize.apply(this, arguments);
}

GetProductData.prototype.initialize = function(product_id, spec_1, spec_2) {
    var that = this;

    //設定參數
    that.setSpec(product_id, spec_1, spec_2);

    //規格一事件
    $('#spec_1').unbind().on('change',function(){
        var spec_1 = $(this).val();
        that.changeSpec(that._product_id, spec_1, that._spec_2);
    });
    //規格二事件
    if($('#spec_2').size() > 0){
        $('#spec_2').unbind().on('change',function(){
            var spec_2 = $(this).val();
            that.changeSpec(that._product_id, that._spec_1,  spec_2);
        });
    }
}

// 設定參數
GetProductData.prototype.setSpec = function(product_id, spec_1, spec_2) {
    this._product_id = product_id;
    this._spec_1 = spec_1;
    this._spec_2 = spec_2;
}

// 變更規格
GetProductData.prototype.changeSpec = function(product_id, spec_1, spec_2, callback){
    var that = this;

    // 設定參數
    that.setSpec(product_id, spec_1, spec_2);

    var csrf_test_name = $('.csrf_test_name').size() > 0 ? $('.csrf_test_name').val() : '';

    var send_data = {
        'product_id': that._product_id,
        'spec_detail_id_1': that._spec_1,
        'spec_detail_id_2': that._spec_2,
        'csrf_test_name': csrf_test_name
    };
    var url_link = '/ajax/ajax_product/ajax_get_product_spec_data';

    return new Promise(function(resolve, reject) {
        $.post(url_link, send_data, function(res) {
            $('.csrf_test_name').val(res['csrf_data']['hash']);
            if( typeof callback === 'function' ){
                callback(res);
            } else {
                resolve(res);
                that.showPrice(res);
            }
        }, 'json').fail(function(xhr, status, errorThrown) { console.log('status', status); reject(status); });
    });
}

// 顯示價格/庫存
GetProductData.prototype.showPrice = function(res){
    var that = this;

    if (res['result'] === 1) {
        // 資料回傳成功
        var data = res['result_data'];

        $('#product_id').val(data.product_id);
        $('#product_spec_id').val(data.product_spec_id);

        // 第一規格選取內容
        $('#spec_1 option[value=' + data.spec_detail_id_1 + ']').prop('selected', true);

        // 第二規格選取內容
        if (data.spec_detail_id_2 > 0) {
            $('#spec_2 option[value=' + data.spec_detail_id_2 + ']').prop('selected', true);
        }

        // 判斷是否有銷售價
        if (data.sale_price === 0) {
            // 無銷售價
            $('.price .dis .num').html(data.ori_price_format)
            $('.price .org').addClass('d-none');
        } else {
            // 有銷售價
            $('.price .dis .num').html(data.sales_price_format)
            $('.price .org').removeClass('d-none').find('.num').html(data.ori_price_format);
        }

        if (data.stock !== 0) {
            $('#amount').attr('max', data.stock);

            // 如果超過最大庫存量 即跳為最大庫存量
            if ($('#amount').val() > data.stock) {
                that.commonMsg('目前最大庫存量為' + data.stock_format, function(){
                    $('#amount').val(data.stock);
                });
            }
            // 顯示庫存剩餘量
            $('.stocks span').html(data.stock_format);
        }
    } else {
        that.errorMsg('沒有找到產品規格資料');
    }
}

// 錯誤提示
GetProductData.prototype.errorMsg = function(msg, callback){
    swal({
        text: msg,
        type: 'warning',
    }).then(function(result){
        if(result){
            if( typeof callback === 'function' ){
                callback();
            }
        }
    }).catch(swal.noop);
}



// 購物車
function Cart(){
    this.initialize.apply(this, arguments);
}

Cart.prototype.initialize = function(define){
    this._define = define;
    this.getCalcData();
}

// 取得計算資料
Cart.prototype.getCalcData = function(){
    var that = this;

    var csrf_test_name = $('.csrf_test_name').size() > 0 ? $('.csrf_test_name').val() : '';
    var url_link = '/ajax/shopping/ajax_orders/ajax_get_calculation_data';
    var send_data = {
        'csrf_test_name': csrf_test_name
    }

    $.post(url_link, send_data, function(res) {
        $('.csrf_test_name').val(res['csrf_data']['hash']);
        var data = '';
        if(res['result'] === 1) {
            that.setCalcData(res);
        } else {
            var msg = res['message'];
            that.errorMsg(msg);
        }
    }, 'json');
}

// 設定計算資料
Cart.prototype.setCalcData = function(res){
    var that = this;

    this._is_use_coin = 0; //是否使用
    this._use_coin = 0; //使用紅利
    this._coin_price = 0;

    this._coupon_code = ''; //coupon 代碼
    this._coupon_price = 0;

    this._freight_location = 1; //收件地區: 台灣
    this._freight_price = 0; //運費

    //設定紅利資料
    this._available_coin = res.calculation_data.coin_data.available_coin ; //可用紅利
    this._coin_ratio = res.calculation_data.coin_data.coin_ratio ; //紅利比率，多少紅利可折抵1元
    this._use_limit = res.calculation_data.coin_data.use_limit ; //"紅利使用上限(%)

    this._member_coin = Math.floor(this._available_coin / this._coin_ratio); //會員當前紅利
    this._member_coin = isNaN(this._member_coin)?0:this._member_coin;

    //設定coupon資料
    this._coupon_data = res.calculation_data.coupon_data;

    //設定通用coupon資料
    this._common_coupon_data = res.calculation_data.common_coupon_data;

    //設定運費資料
    this._freight_data = res.calculation_data.freight_data; //運費資料
    this._orders_freight_discount_priority = res.calculation_data.orders_freight_discount_priority; //訂單運費折扣優先資料

    //設定計算優先權
    this._orders_various_price = res.calculation_data.orders_various_price;

    //設定購物車資料
    this._cart_num_rows = res.calculation_data.shopping_cart_data.num_rows;
    this._cart_result_data = res.calculation_data.shopping_cart_data.result_data;

    this._select_product = new Array();
    this._product_price = 0; //產品小計

    this.isSelectCart();

    if(typeof this._define !== 'undefined'){
        var define = this._define;

        this._is_use_coin = typeof define['is_use_coin'] !== 'undefined'?define['is_use_coin']:0; //是否使用
        this._use_coin = typeof define['use_coin'] !== 'undefined'?define['use_coin']:0; //使用紅利
        this._coin_price = typeof define['coin_price'] !== 'undefined'?define['coin_price']:0;

        this._coupon_code = typeof define['coupon_code'] !== 'undefined'?define['coupon_code']:''; //coupon 代碼
        this._coupon_price = typeof define['coupon_price'] !== 'undefined'?define['coupon_price']:0;

        this._freight_location = typeof define['freight_location'] !== 'undefined'?define['freight_location']:1; //收件地區: 台灣
        this._freight_price = typeof define['freight_price'] !== 'undefined'?define['freight_price']:0; //運費
    }

    this.totalPrice();
}

Cart.prototype.setProductData = function(product_category_id, product_id, product_spec_id, amount, action_type){
    this._product_category_id = product_category_id;
    this._product_id = product_id;
    this._product_spec_id = product_spec_id;
    this._amount = amount;
    this._action_type = action_type;
}

// 刪除購物車項目
Cart.prototype.deleteCart = function(product_id, product_spec_id, el, none_pages_url){
    var that = this;

    var csrf_test_name = $('.csrf_test_name').size() > 0 ? $('.csrf_test_name').val() : '';
    var url_link = '/ajax/shopping/ajax_shopping_cart/ajax_cart_items_process';
    var send_data = {
        'product_id': product_id,
        'product_spec_id': product_spec_id,
        'action_type': 'delete',
        'csrf_test_name': csrf_test_name
    };

    return new Promise(function(resolve, reject) {
        $.post(url_link, send_data, function(res) {
            $('.csrf_test_name').val(res['csrf_data']['hash']);
            var data = '';
            if(res['result'] === 1) {
                that.changeSubTotal('del', res, el);

                var msg = res['message'];
                that.successMsg(msg);
            } else {
                var msg = res['message'];
                that.errorMsg(msg);
            }
            resolve(res);
        }, 'json').fail(function(xhr, status, errorThrown) { console.log('status', status); reject(status); });
    });
}

// 加入購物車
Cart.prototype.addCart = function(product_category_id, product_id, product_spec_id, amount, action_type, el){
    var that = this;

    that.setProductData(product_category_id, product_id, product_spec_id, amount, action_type);

    var csrf_test_name = $('.csrf_test_name').size() > 0 ? $('.csrf_test_name').val() : '';
    var url_link = '/ajax/shopping/ajax_shopping_cart/ajax_cart_items_process';
    var send_data = {
        'product_category_id': that._product_category_id,
        'product_id': that._product_id,
        'product_spec_id': that._product_spec_id,
        'amount': that._amount,
        'action_type': that._action_type,
        'csrf_test_name': csrf_test_name
    };

    return new Promise(function(resolve, reject) {
        $.post(url_link, send_data, function(res) {
            $('.csrf_test_name').val(res['csrf_data']['hash']);
            var data = '';
            if(res['result'] === 1) {
                // 若是在第一步
                if( window.location.pathname.indexOf('/website_shopping/cart_step1') !== -1 ){
                    that.changeSubTotal('add', res, el);
                }
                else{
                    var msg = res['message'];
                    if(that._action_type == 'change_rewrite'){
                        msg = '數量修改成功';
                    }
                    that.successMsg(msg, resolve(res));
                }
            }
            else{
                var msg = res['message'];
                if($(el).val() <= 0){
                    msg = '填寫數量不得小於等於 0';
                }
                that.errorMsg(msg);
            }
            resolve(res);
        }, 'json').fail(function(xhr, status, errorThrown) { console.log('status', status); reject(status); });
    });
}

// 直接購買
Cart.prototype.directCart = function(product_category_id, product_id, product_spec_id, amount){
    var that = this;

    return new Promise(function(resolve, reject) {
        that.addCart(product_category_id, product_id, product_spec_id, amount, 'change_addition').then(function(res){
            resolve(res);
        });
    });
}

// 購物車更改數量更換小計
Cart.prototype.changeSubTotal = function(change_type, res, el){
    var that = this;

    var cart_data = that._cart_result_data = res['result_data'];
    var change_id = that._product_spec_id;

    var subtotal = 0;
    for(var key in cart_data){
        var info = cart_data[key];

        if(change_id == info['product_spec_id']){
            subtotal = info['sub_total'];
        }
    }

    //處理顯示
    if(typeof el !== 'undefined'){
        if($(el).parents('.list-item').length > 0){
            if(change_type == 'add'){
                $(el).parents('.list-item').find('.item-subtotal .num').text(that.numberFormat(subtotal));
            }
            else if(change_type == 'del'){
                $(el).parents('.list-item').remove();
            }
        }
    }

    that.totalPrice();
}

// 勾選的產品
Cart.prototype.isSelectCart = function(){
    var that = this;

    var cart_data = that._cart_result_data;

    //取得勾選的產品
    var select_product = new Array();
    for(var i=0; i<$('.cart-checkbox').length; i++){
        if($('.cart-checkbox').eq(i).prop('checked')){
            select_product.push($('.cart-checkbox').eq(i).val());
        }
    }
    that._select_product = select_product;

    //計算勾選的產品小計
    var sub_total = 0;
    for(var key in cart_data){
        var info = cart_data[key];
        for(var key1 in select_product){
            if(select_product[key1] == info['product_spec_id']){
                sub_total+=info['sub_total'];
            }
        }
    }
    that._product_price = sub_total;
}

// 勾選全部產品
Cart.prototype.selectAllCart = function(){
    var that = this;
    $('.cart-checkbox').prop('checked', true);
    that.totalPrice();
}

// 清除全部產品
Cart.prototype.clearAllCart = function(){
    var that = this;
    $('.cart-checkbox').prop('checked', false);
    that.totalPrice();
}

// 產品的金額總計
Cart.prototype.totalPrice = function(){
    var that = this;

    that.isSelectCart();

    // 紅利計算
    that.dividendCalc(that._product_price);

    // Coupon計算
    that.couponCalc(that._product_price);

    // 運費計算
    that.freightCalc(that._coupon_price + that._coin_price);

    var order_price = 0;
    for(var key in that._orders_various_price){
        var value = that._orders_various_price[key];
        // 根據不同的變數名稱，計算各項金額
        switch (value['variable_name']) {
            // 原始總價
            case 'ori_total':
                if(value['operator'] == '+'){
                    order_price+=that._product_price;
                }
                else if(value['operator'] == '-'){
                    order_price-=that._product_price;
                }
                break;

            // 折扣coupon
            case 'discount_coupon':
                if(value['operator'] == '+'){
                    order_price+=that._coupon_price;
                }
                else if(value['operator'] == '-'){
                    order_price-=that._coupon_price;
                }
                break;

            // 折扣紅利
            case 'discount_coin':
                if(value['operator'] == '+'){
                    order_price+=that._coin_price;
                }
                else if(value['operator'] == '-'){
                    order_price-=that._coin_price;
                }
                break;

            // 運費
            case 'freight':
                if(value['operator'] == '+'){
                    order_price+=that._freight_price;
                }
                else if(value['operator'] == '-'){
                    order_price-=that._freight_price;
                }
                break;
        }
    }
    that._order_price = order_price;

    // 顯示在前台
    $('.subtotal .num').text(that._product_price);
    $('.grand-total .num').text(that.numberFormat(that._order_price));

    //處理付款方式顯示
    that.handlePayMethod();
    //處理出貨方式顯示
    that.handleDeliveryMethod();
}

// 紅利計算
Cart.prototype.isUseCoin = function(is_use_coin){
    this._is_use_coin = is_use_coin;
}

Cart.prototype.setUseCoin = function(use_coin){
    this._use_coin = use_coin;
}

Cart.prototype.dividendCalc = function(order_price){
    var that = this;

    var price = 0;

    //設定紅利資料
    var available_coin = that._available_coin; //可用紅利
    var coin_ratio = that._coin_ratio; //紅利比率，多少紅利可折抵1元
    var use_limit = that._use_limit; //"紅利使用上限(%)

    var member_coin = that._member_coin; //會員當前紅利

    var max_use_coin = Math.floor(order_price * use_limit * coin_ratio); //最大使用紅利
    $('[name="use_coin"]').attr('data-reference_price', order_price);
    $('[name="use_coin"]').attr('data-max_use_coin', max_use_coin);

    //參考紅利
    var reference_coin = member_coin;
    if(member_coin >= max_use_coin){
        reference_coin = max_use_coin;
    }
    $('[name="use_coin"]').attr('data-member_coin', member_coin);
    $('[name="use_coin"]').attr('data-reference_coin', reference_coin);

    $('.reference_coin').html(reference_coin);
    if($('.coin_tooltip').length > 0){
        $('.coin_tooltip').tooltip('dispose');
        var html = $('.coin_tooltip').attr('data-original-title');
        var reg = '(.*)最高可折抵<span class=\'num\'>(.*)</span>點(.*)';
        var re = new RegExp(reg,'g');
        html = html.replace(re, '$1最高可折抵<span class=\'num\'>' + reference_coin + '</span>點$3');
        $('.coin_tooltip').attr('data-original-title', html).tooltip();
    }

    //計算紅利
    var coin_price = 0;
    if(that._is_use_coin == 1){
        coin_price = that._use_coin;
        if(that._use_coin > reference_coin){
            coin_price = reference_coin;
        }
        $('[name="use_coin"]').val(coin_price);
    }
    that._coin_price = price = coin_price;
    $('.coin-total .content.num').text(coin_price);

    return price;
}

// Coupon計算
Cart.prototype.setCalcCode = function(coupon_code){
    var that = this;

    var coupon_data = that._common_coupon_data;
    var is_coupon = 0;
    for(var key in coupon_data){
        var info = coupon_data[key];
        if(coupon_code == info['fixed_code']){
            is_coupon = 1;
            $('#common_coupon_discount_content').html(info['discount_content']);
            $('#common_coupon_end_date').html(info['end_date_format']);
        }
    }
    if(is_coupon == 0){
        $('#common_coupon_discount_content').html('-');
        $('#common_coupon_end_date').html('-');
    }
    else{
        for(var i=0; i<$('[name="coupon_id"]').length; i++){
            if($('[name="coupon_id"]').eq(i).val() == 'common'){
                $('[name="coupon_id"]').eq(i).prop('checked', true).attr('data-checked', 1);
            }
        }
    }

    that._coupon_code = coupon_code;
}

Cart.prototype.couponCalc = function(order_price){
    var that = this;

    var price = 0;
    var coupon_data = that._coupon_data;

    var coupon_el = $('[name="coupon_id"]:checked');
    var coupon_sel = $('[name="coupon_id"]:checked').val();
    var coupon_code = that._coupon_code;

    $('[name="coupon_id"]').prop('checked', false).removeAttr('data-checked');
    for(var key in coupon_data){
        var info = coupon_data[key];
        //訂單總金額 > 門檻金額
        if(order_price > info['achieve_price']){
            $('[name="coupon_id"]').eq(key).removeAttr('disabled');
        }
        else{
            $('[name="coupon_id"]').eq(key).attr('disabled', true);
        }
    }

    if(coupon_sel !== null){
        //通用
        if(coupon_sel == 'common'){
            coupon_data = that._common_coupon_data;
            if(coupon_code != ''){
                for(var key in coupon_data){
                    var info = coupon_data[key];
                    if(coupon_code == info['fixed_code']){
                        //訂單總金額 > 門檻金額
                        if(order_price > info['achieve_price']){
                            //滿額折扣
                            if(info['discount_type'] == 1){
                                price = Math.floor(order_price * info['discount_price'] / 100 );
                            }
                            //滿額固定折扣
                            else{
                                price = info['discount_price'];
                            }
                            coupon_el.prop('checked', true).attr('data-checked', 1);
                        }
                    }
                }
            }
        }
        else{
            for(var key in coupon_data){
                var info = coupon_data[key];
                if(coupon_sel == info['id']){
                    //訂單總金額 > 門檻金額
                    if(order_price > info['achieve_price']){
                        //滿額折扣
                        if(info['discount_type'] == 1){
                            price = Math.floor(order_price * info['discount_price'] / 100 );
                        }
                        //滿額固定折扣
                        else{
                            price = info['discount_price'];
                        }
                        coupon_el.prop('checked', true).attr('data-checked', 1);
                    }
                }
            }
        }
    }
    that._coupon_price = price;
    $('.coupon-total').show();
    if(that._coupon_price <= 0){
        $('.coupon-total').hide();
    }
    $('.coupon-total .num').text(that._coupon_price);

    return price;
}

Cart.prototype.setFreightLocation = function(freight_location){
    this._freight_location = freight_location;
}

// 運費計算
Cart.prototype.freightCalc = function(discount_total){
    var that = this;

    //根據地區選擇資料
    var freight_data = typeof that._freight_data[that._freight_location] !== 'undefined'?that._freight_data[that._freight_location]:{};
    var orders_freight_discount_priority = that._orders_freight_discount_priority;
    var cart_data = that._cart_result_data;
    var select_product = that._select_product;

    //計算各溫層總金額
    var product_price = new Object();
    for(var key in freight_data){
        product_price[key] = 0;
    }
    for(var key in cart_data){
        for(var key1 in select_product){
            if(select_product[key1] == cart_data[key]['product_spec_id']){
                product_price[cart_data[key]['temperature_level']]+=cart_data[key]['sub_total'];
            }
        }
    }

    //扣除第一筆溫層運費折扣
    var idx = 0;
    for(var key in orders_freight_discount_priority){
        if(product_price[key] > 0){
            idx++;
            if(idx == 1){
                product_price[key]-=discount_total;
                product_price[key] = product_price[key]>=0?product_price[key]:0;
            }
        }
    }

    //根據各金額依據各溫層的級距取出運費
    var freight_list = new Object();
    for(var key1 in freight_data){
        for(var key2 in freight_data[key1]){
            if(product_price[key1] > freight_data[key1][key2]['start_achieve_price']){
                freight_list[key1] = freight_data[key1][key2]['freight'];
            }
        }
    }
    that._freight_list = freight_list;

    //進行運費加總
    var price = 0;
    for(var key in freight_list){
        price+=freight_list[key];
    }
    that._freight_price = price;

    //顯示在前台
    that.showFreight();

    return price;
}

Cart.prototype.showFreight = function(){
    var that = this;

    var freight_list = that._freight_list;

    //重置顯示
    for(var i=0; i<$('.freight-level').length; i++){
        $('.freight-level').eq(i).addClass('d-none').find('.num').text('0');
    }
    //填入新數值
    for(var key in freight_list){
        if($('.freight-level'+key).size() > 0){
            $('.freight-level'+key).find('.num').text(freight_list[key]);
            if(freight_list[key] > 0){
                $('.freight-level'+key).removeClass('d-none');
            }
        }
    }
}

Cart.prototype.handlePayMethod = function() {
    var order_price = this._order_price; //訂單實付金額
    if($('[name="payment_method"]').length > 0 && $('[name="payment_method"]').attr('type') == 'checkbox'){
        this._payment_method = $('[name="payment_method"]:checked').val() == 'nopay'?this._payment_method:$('[name="payment_method"]:checked').val();
        $('[name="payment_method"]').prop('checked', false);
        $('.pay-invoice').find('.custom-radio').addClass('d-none');

        for(var i=0; i<$('[name="payment_method"]').length; i++){
            var el = $('[name="payment_method"]').eq(i);
            //無須付款
            if(el.val() == 'nopay'){
                if(order_price > 0){
                    el.parent().addClass('d-none');
                }
                else{
                    el.parent().removeClass('d-none');
                }
            }
            //信用卡
            else if(el.val() == 'credit'){
                if(order_price > 0 && order_price >= 6 && order_price <= 500000){
                    el.parent().removeClass('d-none');
                }
                else{
                    el.parent().addClass('d-none');
                }
            }
            //ATM(虛擬帳號)
            else if(el.val() == 'atm'){
                if(order_price > 0 && order_price >= 11 && order_price <= 100000){
                    el.parent().removeClass('d-none');
                }
                else{
                    el.parent().addClass('d-none');
                }
            }
            //宅配貨到付款
            else if(el.val() == 'home_delvery_getitem_pay'){
                //if(order_price > 0 && order_price <= achive_price_store){
                if(order_price > 0 && order_price <= 50000){
                    el.parent().removeClass('d-none');
                }
                else{
                    el.parent().addClass('d-none');
                }
            }
            //超商取貨付款
            else if(el.val() == 'cvs_getitem_pay'){
                if(order_price > 0 && order_price >= 31 && order_price <= 20000){
                    el.parent().removeClass('d-none');
                }
                else{
                    el.parent().addClass('d-none');
                }
            }
            //超商代碼
            else if(el.val() == 'cvs'){
                if(order_price > 0 && order_price >= 31 && order_price <= 20000){
                    el.parent().removeClass('d-none');
                }
                else{
                    el.parent().addClass('d-none');
                }
            }
            //超商條碼
            else if(el.val() == 'barcode'){
                //手機板不支援
                if(/(Android|iPhone|iPad|iPod|iOS)/i.test( window.navigator.userAgent )) {
                    el.parent().addClass('d-none');
                }
                else{
                    if(order_price > 0 && order_price >= 16 && order_price <= 20000){
                        el.parent().removeClass('d-none');
                    }
                    else{
                        el.parent().addClass('d-none');
                    }
                }
            }
            //其他付款方式
            else{
                if(order_price > 0){
                    el.parent().removeClass('d-none');
                }
                else{
                    el.parent().addClass('d-none');
                }
            }
        }

        if($('#payment_method_' + this._payment_method).parent().hasClass('d-none')){
            var is_change = 0;
            for(var i=0; i<$('[name="payment_method"]').length; i++){
                var el = $('[name="payment_method"]').eq(i);
                if(!el.parent().hasClass('d-none') && is_change == 0){
                    is_change = 1;
                    this._payment_method = el.val();
                }
            }
        }

        if($('[name="payment_method"]:checked').length == 0){
            if(!$('#payment_method_nopay').parent().hasClass('d-none')){
                this._payment_method = 'nopay';
            }
        }

        $('#payment_method_' + this._payment_method).prop('checked', true);
    }
}

Cart.prototype.handleDeliveryMethod = function() {
    var order_price = this._order_price; //訂單實付金額

    //定義 超商取貨 有哪些選項
    var market_method = new Array();
    market_method.push('market_unimart'); //7-ELEVEN超商
    market_method.push('market_fami'); //全家
    market_method.push('market_hilife'); //萊爾富

    if($('[name="delivery_method"]').length > 0 && $('[name="delivery_method"]').attr('type') == 'checkbox'){
        this._delivery_method = $('[name="delivery_method"]:checked').val();
        $('input[name="delivery_method"]').prop('checked', false);
        $('.pay-deliver').find('.custom-radio').hide();

        //門市付款
        if(this._payment_method == 'store'){
            //$('#delivery_method_store').parent('.custom-radio').css('display', 'inline-flex');//.show();
            $('.pay-deliver').find('.custom-radio').css('display', 'inline-flex');
        }
        //宅配貨到付款
        else if(this._payment_method == 'home_delvery_getitem_pay'){
            this._delivery_method = 'home_delivery';
            $('#delivery_method_home_delivery').parent('.custom-radio').css('display', 'inline-flex');//.show();
        }
        //超商取貨付款
        else if(this._payment_method == 'cvs_getitem_pay'){
            var is_include = 0;
            for(var key1 in market_method){
                if(market_method[key1] == this._delivery_method){
                    is_include++;
                }
            }
            if(is_include == 0){
                this._delivery_method = market_method[0];
            }
            for(var i=0; i<market_method.length; i++){
                $('#delivery_method_'+market_method[i]).parent('.custom-radio').css('display', 'inline-flex');//.show();
            }
        }
        //其他付款方式
        else{
            $('.pay-deliver').find('.custom-radio').css('display', 'inline-flex');//.show();
        }

        $('#delivery_method_' + this._delivery_method).prop('checked', true);

        //宅配才顯示收件地區
        $('.freight_location').addClass('d-none');
        if(this._delivery_method == 'home_delivery'){
            $('.freight_location').removeClass('d-none');
            for(var i=0; i<$('input[name="freight_location"]').length; i++){
                if($('input[name="freight_location"]').eq(i).val() == this._freight_location){
                    $('input[name="freight_location"]').eq(i).prop('checked', true);
                }
            }
        }
    }
}

// 格式化數字
Cart.prototype.numberFormat = function(num, precision, separator) {
    var parts;
    // 判斷是否為數字
    if (!isNaN(parseFloat(num)) && isFinite(num)) {
      num = Number(num);
      // 處理小數點位數
      num = (typeof precision !== 'undefined' ? num.toFixed(precision) : num).toString();
      // 分離數字的小數部分和整數部分
      parts = num.split('.');
      // 整數部分加[separator]分隔, 借用一個著名的正則表達式
      parts[0] = parts[0].toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + (separator || ','));

      return parts.join('.');
    }
    return NaN;
}

// 通用提示
Cart.prototype.commonMsg = function(msg, callback){
    swal({
        text: msg,
        type: 'info',
    }).then(function(result){
        if(result){
            if( typeof callback === 'function' ){
                callback();
            }
        }
    }).catch(swal.noop);
}

// 成功提示
Cart.prototype.successMsg = function(msg, callback){
    swal({
        text: msg,
        type: 'success',
    }).then(function(result){
        if(result){
            if( typeof callback === 'function' ){
                callback();
            }
        }
    }).catch(swal.noop);
}

// 錯誤提示
Cart.prototype.errorMsg = function(msg, callback){
    swal({
        text: msg,
        type: 'warning',
    }).then(function(result){
        if(result){
            if( typeof callback === 'function' ){
                callback();
            }
        }
    }).catch(swal.noop);
}
