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

    $.post(url_link, send_data, function(res) {
        if( typeof callback === 'function' ){
            callback(res);
        } else {
            that.showPrice(res);
        }
    }, 'json').fail(function(res) { console.log('err', res); });
}

// 顯示價格
GetProductData.prototype.showPrice = function(res){
    var that = this;

    $('.csrf_test_name').val(res['csrf_data']['hash']);

    if (res['result'] === 1) {
        // 資料回傳成功
        var data = res['result_data'];
        var current_spec_data = data['current_spec_data'];
        var spec2_option_data = data['spec2_option_data'];

        $('#spec_2').empty();

        if(that._spec_2 > 0) {
            $.each(spec2_option_data, function(key, value) {
                $('#spec_2').append('<option value="' + value.spec_detail_id_2 + '">' + value.spec_detail_name_2 + '</option>');
            });

        }

        $('#product_id').val(current_spec_data.product_id);
        $('#product_spec_id').val(current_spec_data.product_spec_id);

        // 第一規格選取內容
        $('#spec_1 option[value=' + current_spec_data.spec_detail_id_1 + ']').prop('selected', true);


        // 第二規格選取內容
        if (current_spec_data.spec_detail_id_2 > 0) {
            // 設定參數
            that.setSpec(current_spec_data.product_id, current_spec_data.spec_detail_id_1, current_spec_data.spec_detail_id_2);

            $('#spec_2 option[value=' + current_spec_data.spec_detail_id_2 + ']').prop('selected', true);
        }

        // 判斷是否有銷售價
        if (current_spec_data.sale_price === 0) {
            // 無銷售價
            $('.product-price .dis .num').html(current_spec_data.ori_price_format)
            $('.product-price .org').addClass('d-none');
        } else {
            // 有銷售價
            $('.product-price .dis .num').html(current_spec_data.sales_price_format)
            $('.product-price .org').removeClass('d-none').find('.num').html(current_spec_data.ori_price_format);
        }

        // 定義當前數量
        var amount_current = ($('#amount').length > 0) ? $('#amount').val(): 1;

        // 清空數量區塊內容
        $('#amount_area').empty();

        //若一開始沒庫存則須判斷
        if (current_spec_data.stock > 0) {
            // 複製有庫存區塊，並修改相對應欄位資料
            var $amount_area = $('#stock_area_clone').clone();
            $amount_area.find('#stock_area_clone').attr('id', 'stock_area');
            $amount_area.find('#amount_clone').attr('id', 'amount');
            $amount_area.find('#amount_str_clone').attr('id', 'amount_str');
            $amount_area.find('#amount').val(amount_current);
            $amount_area.find('#amount').attr('max', current_spec_data.stock);
            $amount_area.find('#amount_str').text(current_spec_data.stock);

            // 放上數量區塊內容
            $('#amount_area').html($amount_area);

            // 如果超過最大庫存量 即跳為最大庫存量
            if (parseInt(amount_current) > parseInt(current_spec_data.stock)) {
                swal({
                    text: '目前最大庫存量為' + current_spec_data.stock_format,
                    type: 'info',
                });
                $('#amount').val(current_spec_data.stock);
            }
            $('.stocks span').html(current_spec_data.stock_format);

            // 不存在加入購物車按鈕，就讓其複製一個出來
            if ($('#add_cart_button').length == 0){
                // 複製購物車按鈕，並修改相對應欄位資料
                var $add_cart_button_area = $('#add_cart_button_clone').clone();
                $add_cart_button_area.attr('id', 'add_cart_button');

                $('#button_area').append($add_cart_button_area);
            }
        } else {
            // 複製無庫存區塊，並修改相對應欄位資料
            var $amount_area = $('#no_stock_area_clone').clone();
            $amount_area.find('#no_stock_area_clone').attr('id', 'stock_area');
            $amount_area.find('#no_stocks_clone').attr('id', 'no_stocks');

            // 放上數量區塊內容
            $('#amount_area').html($amount_area);

            // 移除加入購物車按鈕
            $('#add_cart_button').remove();
        }
    } else {
        that.errorMsg();
    }
}

// 錯誤提示
GetProductData.prototype.errorMsg = function(){
    swal({
        text: '沒有找到產品規格資料',
        type: 'warning',
    });
}


// 購物車
function Cart(){
    this.initialize.apply(this, arguments);
}

Cart.prototype.initialize = function(){
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
        var data = '';
        if(res['result'] === 1) {
            // 成功
            that.setCalcData(res);
        } else {
            // 錯誤
            var msg = res['message'];
            that.errorMsg(msg);
        }

        $('.csrf_test_name').val(res['csrf_data']['hash']);
    }, 'json').fail(function(res) { console.log('err', res); });
}

// 設定計算資料
Cart.prototype.setCalcData = function(res){
    var that = this;

    this._product_price = 0; //產品小計

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
}

// 刪除購物車項目
Cart.prototype.deleteCart = function(product_id, product_spec_id, el){
    console.log("send");
    console.log(el);
    var that = this;

    var csrf_test_name = $('.csrf_test_name').size() > 0 ? $('.csrf_test_name').val() : '';
    var url_link = '/ajax/shopping/ajax_shopping_cart/ajax_cart_items_process';
    var send_data = {
        'product_id': product_id,
        'product_spec_id': product_spec_id,
        'action_type': 'delete',
        'csrf_test_name': csrf_test_name
    };
   
    $.post(url_link, send_data, function(res) {
        var data = '';
        if(res['result'] === 1) {
            // 若是在第一步
            if( $('.hex-wrapper.first.active').size() > 0){
                that.changeSubTotal(res, el);
            }

            // 刪除畫面項目
            $(el).parents('.inquiry-box').remove();

            var msg = res['message'];
            that.successMsg(msg);
        } else {
            // 錯誤
            var msg = res['message'];
            that.errorMsg(msg);
        }

        if(res['num_rows'] == 0){
            var msg = '洽詢車無商品';
            that.errorMsg(msg, function(){
                window.location.href = window.location.origin;
            });
        }

        $('.csrf_test_name').val(res['csrf_data']['hash']);
    }, 'json').fail(function(res) { console.log('err', res); });

}

Cart.prototype.setProductData = function(product_category_id, product_id, product_spec_id, amount, action_type){
    this._product_category_id = product_category_id;
    this._product_id = product_id;
    this._product_spec_id = product_spec_id;
    this._amount = amount;
    this._action_type = action_type;
}

Cart.prototype.addCart = function(product_category_id, product_id, product_spec_id, amount, action_type, el){
    var that = this;

    $(el).attr('disabled', 'disabled');

    that.setProductData(product_category_id, product_id, product_spec_id, amount, action_type)

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
    console.log('send_data');
    console.log(send_data);
    ShopCart.setNum(send_data.amount);
    $.post(url_link, send_data, function(res) {
        $(el).removeAttr('disabled');

        var data = '';
        if(res['result'] === 1) {
            // 若是在第一步
            if( $('.hex-wrapper.first.active').size() > 0){
                that.changeSubTotal(res, el);
            } else {
                $('#num_rows').html(res.num_rows);
                var msg = res['message'];
                that.successMsg(msg);
            }
        } else if(res['result'] === -4){
            // 庫存不足
            for(var key in res.result_data){
                var info = res.result_data[key];

                if(that._product_spec_id == info['product_spec_id']){
                    // 修正購物車數量
                    $(el).val(info['stock']);
                    that.addCart(send_data['product_category_id'], send_data['product_id'], send_data['product_spec_id'], info['stock'], send_data['action_type'], el);
                }
            }
            // 錯誤
            var msg = res['message'];
            that.errorMsg(msg);
        } else {
            // 錯誤
            var msg = res['message'];
            if($(el).val() <= 0){
                // 修正購物車數量
                $(el).val(1);
                that.addCart(send_data['product_category_id'], send_data['product_id'], send_data['product_spec_id'], 1, send_data['action_type'], el);

                msg = '填寫數量不得小於等於 0';
            }
            that.errorMsg(msg);
        }

        //$('.csrf_test_name').val(res['csrf_data']['hash']);
    }, 'json').fail(function(res) { console.log('err', res); });
}

// 購物車更改數量更換小計
Cart.prototype.changeSubTotal = function(res, el){
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

    $(el).parents('.list-item').find('.item-subtotal .num').text(that.numberFormat(subtotal));
    that.totalPrice();
}

// 勾選的產品
Cart.prototype.isSelectCat = function(){
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
    that.isSelectCat();

    var order_price = 0;
    var discount_total = 0;
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
                // Coupon計算
                that.couponCalc(order_price);

                if(value['operator'] == '+'){
                    order_price+=that._coupon_price;
                }
                else if(value['operator'] == '-'){
                    order_price-=that._coupon_price;
                }

                // 紀錄折扣總金額
                discount_total+= parseInt(that._coupon_price);

                break;

            // 折扣紅利
            case 'discount_coin':
                // 紅利計算
                that.dividendCalc(order_price);

                if(value['operator'] == '+'){
                    order_price+=that._coin_price;
                }
                else if(value['operator'] == '-'){
                    order_price-=that._coin_price;
                }

                // 紀錄折扣總金額
                discount_total+= parseInt(that._coin_price);

                break;

            // 運費
            case 'freight':
                // 運費計算
                that.freightCalc(discount_total);

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
    $('#sub_total').text('+' + that._product_price);
    $('#grand_total').text(that.numberFormat(that._order_price));

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

    //參考紅利
    var reference_coin = member_coin;
    if(member_coin >= max_use_coin){
        reference_coin = max_use_coin;
    }

    //計算紅利
    var coin_price = 0;
    if(that._is_use_coin == 1){
        coin_price = that._use_coin;
        if(that._use_coin > reference_coin){
            coin_price = reference_coin;
            $('[name="use_coin"]').val(reference_coin);
        }
    }
    that._coin_price = coin_price;

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
                $('[name="coupon_id"]').eq(i).prop('checked', true);
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
    $('[name="coupon_id"]').prop('checked', false);
    var coupon_code = that._coupon_code;
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
                                price = order_price - Math.floor(order_price * info['discount_price'] / 100 );
                            }
                            //滿額固定折扣
                            else{
                                price = info['discount_price'];
                            }
                            coupon_el.prop('checked', true);
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
                            price = order_price - Math.floor(order_price * info['discount_price'] / 100 );
                        }
                        //滿額固定折扣
                        else{
                            price = info['discount_price'];
                        }
                        coupon_el.prop('checked', true);
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
    $('.coupon-total .num').text('-' + that._coupon_price);

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
    var temperature_level_prices = new Object();
    for(var key in freight_data){
        temperature_level_prices[key] = 0;
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
        if(temperature_level_prices[key] > 0){
            idx++;
            if(idx == 1){
                temperature_level_prices[key]-=discount_total;
                temperature_level_prices[key] = temperature_level_prices[key]>=0?temperature_level_prices[key]:0;
            }
        }
    }

    //根據各金額依據各溫層的級距取出運費
    var freight_list = new Object();
    for(var key1 in freight_data){
        for(var key2 in freight_data[key1]){
            if(temperature_level_prices[key1] >= freight_data[key1][key2]['start_achieve_price']){
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
        $('.freight-level').eq(i).hide().find('.num').html('+0');
    }
    //填入新數值
    for(var key in freight_list){
        if($('.freight-level'+key).size() > 0){
            $('.freight-level'+key).find('.num').html('+' + freight_list[key]);
            if(freight_list[key] > 0){
                $('.freight-level'+key).show();
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

// 成功提示
Cart.prototype.successMsg = function(msg){
    swal({
        text: msg,
        type: 'success',
    }).then(function(result){
    }).catch(swal.noop);
}

// 錯誤提示
Cart.prototype.errorMsg = function(msg, callback){
    swal({
        text: msg,
        type: 'warning',
    }).then(function(result){
        if(result){
            if(typeof callback === 'function'){
                callback();
            }
        }
    }).catch(swal.noop);
}
