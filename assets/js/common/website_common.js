/*
| -------------------------------------------------------------------
| 定義前臺公用JS
| -------------------------------------------------------------------
| 前臺整個專案可用的皆可定義於此，方便管理
|
| -------------------------------------------------------------------
*/

// 上傳圖片使用-----------------------------------------------------------------------------

var picture_res = null;

//上傳圖片
function upload_picture(call_back) {
    var config = {
        browse_type : 1,
        pic_width : 0,
        pic_height : 0,
        pic_length : 1,
    };
    var popup_picture = null;
    var upload_length = 0;
    var upload_info = null;
    var $picture = null;
    picture_res = function(res_data) {
        if($picture.deviceType() == 1){
            var upload_data = res_data['ResultJA'];
            for(var key in upload_data){
                var base64 = 'data:image/'+upload_data[key]['Ext']+';base64,' + $picture.decode(upload_data[key]['Data']);
                $picture.base64ToBlob(base64).then(function(blob) {
                    $picture.upload(blob).then(function(data) {
                        upload_info = JSON.parse(data);
                        if(typeof call_back === 'function'){
                            call_back(upload_info);
                        }
                    });
                });
            }
        }
        else{
            var base64 = res_data;
            $picture.base64ToBlob(base64).then(function(blob) {
                $picture.upload(blob).then(function(data) {
                    upload_info = JSON.parse(data);
                    if(popup_picture !== null){
                        loading_stop();
                        popup_picture.close();
                    }
                    else{
                        if(typeof call_back === 'function'){
                            call_back(upload_info);
                        }
                    }
                });
            });
        }
    }
    $picture = new Picture(picture_res);
    $picture.loadingStart = function() {
        if($('.img-upload').length == 0){
            var color = '#0556a5';
            $('body').append('<div class="img-upload"><div class="upload-ing"><div class="loader loader--style5" title="4" style="width:80px;height:38px;position:absolute;left:0;right:0;bottom:0;top:0;margin:auto;"></div></div></div>');
            $('.img-upload').css({'position':'fixed','width':'100%','height':'100%','background':'rgba(255, 255, 255, 0.8)','z-index':'1000000','top':'0','left':'0','text-align':'center'});
            $('.img-upload').find('.loader').html('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="0" y="0" width="4" height="10" fill="'+color+'" transform="translate(0 12.2009)"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite"></animateTransform></rect><rect x="10" y="0" width="4" height="10" fill="'+color+'" transform="translate(0 1.1324)"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite"></animateTransform></rect><rect x="20" y="0" width="4" height="10" fill="'+color+'" transform="translate(0 14.4657)"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite"></animateTransform></rect></svg>');
            $('.img-upload').unbind().on('click', function(){
                alert_custom('提示','圖片轉換中...請稍候..');
            });
        }
    }
    $picture.loadingStop = function() {
        if($('.img-upload').length > 0){
            $('.img-upload').remove();
        }
    }
    $picture.website = function() {
        if($('#upload_picture_file').length == 0){
            $('body').append('<input type="file" id="upload_picture_file" accept="image/jpg,image/jpeg,image/png" style="display: none;" />');
        }
        upload_length = 0;
        $('#upload_picture_file').unbind().on('change', function(input) {
            var files = input.target.files;
            upload_length = files.length;
            for(var key in files){
                if(! isNaN(key)){
                    var file = files[key];
                    $picture.handle(file);
                }
            }
        }).val('').click();
    }
    $picture.action(config);
}

//裁切圖片
function crop_picture(pic_width, pic_height, call_back) {
    var config = {
        browse_type : 2,
        pic_width : pic_width,
        pic_height : pic_height,
        pic_length : 1,
    };
    var popup_picture = null;
    var upload_length = 0;
    var upload_info = null;
    var $picture = null;
    picture_res = function(res_data) {
        if($picture.deviceType() == 1){
            var upload_data = res_data['ResultJA'];
            for(var key in upload_data){
                var base64 = 'data:image/'+upload_data[key]['Ext']+';base64,' + $picture.decode(upload_data[key]['Data']);
                $picture.base64ToBlob(base64).then(function(blob) {
                    $picture.upload(blob).then(function(data) {
                        upload_info = JSON.parse(data);
                        if(typeof call_back === 'function'){
                            call_back(upload_info);
                        }
                    });
                });
            }
        }
        else{
            var base64 = res_data;
            $picture.base64ToBlob(base64).then(function(blob) {
                $picture.upload(blob).then(function(data) {
                    upload_info = JSON.parse(data);
                    if(popup_picture !== null){
                        loading_stop();
                        popup_picture.close();
                    }
                    else{
                        if(typeof call_back === 'function'){
                            call_back(upload_info);
                        }
                    }
                });
            });
        }
    }
    $picture = new Picture(picture_res);
    $picture.loadingStart = function() {
        if($('.img-upload').length == 0){
            var color = '#0556a5';
            $('body').append('<div class="img-upload"><div class="upload-ing"><div class="loader loader--style5" title="4" style="width:80px;height:38px;position:absolute;left:0;right:0;bottom:0;top:0;margin:auto;"></div></div></div>');
            $('.img-upload').css({'position':'fixed','width':'100%','height':'100%','background':'rgba(255, 255, 255, 0.8)','z-index':'1000000','top':'0','left':'0','text-align':'center'});
            $('.img-upload').find('.loader').html('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="0" y="0" width="4" height="10" fill="'+color+'" transform="translate(0 12.2009)"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite"></animateTransform></rect><rect x="10" y="0" width="4" height="10" fill="'+color+'" transform="translate(0 1.1324)"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite"></animateTransform></rect><rect x="20" y="0" width="4" height="10" fill="'+color+'" transform="translate(0 14.4657)"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite"></animateTransform></rect></svg>');
            $('.img-upload').unbind().on('click', function(){
                alert_custom('提示','圖片轉換中...請稍候..');
            });
        }
    }
    $picture.loadingStop = function() {
        if($('.img-upload').length > 0){
            $('.img-upload').remove();
        }
    }
    $picture.website = function() {
        //建議尺寸
        $('#crop_picture_pic_size').html($picture._data[1]+' x '+$picture._data[2]);
        //預覽畫面
        $('#crop_picture_preview').css({'touch-action':'pan-y','width':'calc(100% - 10px)','background':'linear-gradient(to bottom, rgba(51,51,51,1) 0%,rgba(102,102,102,1) 100%,rgba(102,102,102,1) 100%)', 'margin-left':'5px', 'margin-right':'5px'});
        $('#crop_picture_preview').css('height', $('#crop_picture_preview').width()).html('');
        //選擇圖片
        $('#crop_picture_select_btn').unbind().on('click',function() {
            $('#crop_picture_file').click();
        });
        //上傳圖片
        upload_length = 0;
        $('#crop_picture_file').unbind().on('change', function(input) {
            var files = input.target.files;
            upload_length = files.length;
            $('#crop_picture_upload_btn').html('圖片轉換中...');
            for(var key in files){
                if(! isNaN(key)){
                    var file = files[key];
                    $picture.handle(file, '#crop_picture_preview').then(function(data){
                        $('#crop_picture_upload_btn').html('上傳圖片').unbind().on('click', function() {
                            $('#crop_picture_upload_btn').unbind();
                            if(upload_length > 0){
                                $picture.result();
                            }
                        });
                    });
                }
            }
        }).val('');
        $('#crop_picture_upload_btn').html('上傳圖片');
    }
    $picture.action(config);
}

//上傳多張圖片
function multi_upload_picture(pic_width, pic_height, pic_length, call_back) {
    var config = {
        browse_type : 3,
        pic_width : pic_width,
        pic_height : pic_height,
        pic_length : pic_length,
    };
    var popup_picture = null;
    var upload_length = 0;
    var upload_info = null;
    var $picture = null;
    picture_res = function(res_data) {
        if($picture.deviceType() == 1){
            var upload_data = res_data['ResultJA'];
            for(var key in upload_data){
                var base64 = 'data:image/'+upload_data[key]['Ext']+';base64,' + $picture.decode(upload_data[key]['Data']);
                $picture.base64ToBlob(base64).then(function(blob) {
                    $picture.upload(blob).then(function(data) {
                        upload_info = JSON.parse(data);
                        if(typeof call_back === 'function'){
                            call_back(upload_info);
                        }
                    });
                });
            }
        }
        else{
            var base64 = res_data;
            $picture.base64ToBlob(base64).then(function(blob) {
                $picture.upload(blob).then(function(data) {
                    upload_info = JSON.parse(data);
                    if(popup_picture !== null){
                        loading_stop();
                        popup_picture.close();
                    }
                    else{
                        if(typeof call_back === 'function'){
                            call_back(upload_info);
                        }
                    }
                });
            });
        }
    }
    $picture = new Picture(picture_res);
    $picture.loadingStart = function() {
        if($('.img-upload').length == 0){
            var color = '#0556a5';
            $('body').append('<div class="img-upload"><div class="upload-ing"><div class="loader loader--style5" title="4" style="width:80px;height:38px;position:absolute;left:0;right:0;bottom:0;top:0;margin:auto;"></div></div></div>');
            $('.img-upload').css({'position':'fixed','width':'100%','height':'100%','background':'rgba(255, 255, 255, 0.8)','z-index':'1000000','top':'0','left':'0','text-align':'center'});
            $('.img-upload').find('.loader').html('<svg version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px" width="24px" height="30px" viewBox="0 0 24 30" style="enable-background:new 0 0 50 50;" xml:space="preserve"><rect x="0" y="0" width="4" height="10" fill="'+color+'" transform="translate(0 12.2009)"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0" dur="0.6s" repeatCount="indefinite"></animateTransform></rect><rect x="10" y="0" width="4" height="10" fill="'+color+'" transform="translate(0 1.1324)"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.2s" dur="0.6s" repeatCount="indefinite"></animateTransform></rect><rect x="20" y="0" width="4" height="10" fill="'+color+'" transform="translate(0 14.4657)"><animateTransform attributeType="xml" attributeName="transform" type="translate" values="0 0; 0 20; 0 0" begin="0.4s" dur="0.6s" repeatCount="indefinite"></animateTransform></rect></svg>');
            $('.img-upload').unbind().on('click', function(){
                alert_custom('提示','圖片轉換中...請稍候..');
            });
        }
    }
    $picture.loadingStop = function() {
        if($('.img-upload').length > 0){
            $('.img-upload').remove();
        }
    }
    $picture.website = function() {
        if($('#upload_picture_file').length == 0){
            $('body').append('<input type="file" id="upload_picture_file" accept="image/jpg,image/jpeg,image/png" style="display: none;" multiple />');
        }
        upload_length = 0;
        $('#upload_picture_file').unbind().on('change', function(input) {
            var files = input.target.files;
            upload_length = files.length;
            for(var key in files){
                if(! isNaN(key)){
                    var file = files[key];
                    $picture.handle(file);
                }
            }
        }).val('').click();
    }
    $picture.action(config);
}

// 生日使用-----------------------------------------------------------------------------

/**
* @Class Birthday
*/
    function Birthday(){
        this.initialize.apply(this, arguments);
    }

    Birthday.prototype.initialize = function(config) {
        var today = new Date();
        var year_class_name = '.date_year';
        var month_class_name = '.date_month';
        var day_class_name = '.date_day';

        if(typeof config === 'undefined'){
            var config = {};
        }
        //開始年份
        if(typeof config['start_year'] === 'undefined'){
            config['start_year'] = today.getFullYear();
        }
        //結束年份
        if(typeof config['end_year'] === 'undefined'){
            config['end_year'] = parseInt(config['start_year']) - 100;
        }
        //是否以民國顯示
        if(typeof config['is_ROC_show'] === 'undefined'){
            config['is_ROC_show'] = 0;
        }
        //年份選擇器名稱
        if(typeof config['year_element'] === 'undefined'){
            config['year_element'] = $(year_class_name).size() > 0?$(year_class_name):'';
        }
        //月份選擇器名稱
            if(typeof config['month_element'] === 'undefined'){
        config['month_element'] = $(month_class_name).size() > 0?$(month_class_name):'';
        }
        //日期選擇器名稱
        if(typeof config['day_element'] === 'undefined'){
            config['day_element'] = $(day_class_name).size() > 0?$(day_class_name):'';
        }
        //預設選擇年
        if(typeof config['year_sel'] === 'undefined' || config['year_sel'] == ''){
            config['year_sel'] = config['start_year'];
        }
        //預設選擇月
        if(typeof config['month_sel'] === 'undefined' || config['month_sel'] == ''){
            config['month_sel'] = '01';
        }
        //預設選擇日
        if(typeof config['day_sel'] === 'undefined' || config['day_sel'] == ''){
            config['day_sel'] = '01';
        }
        this._config = config;

        this.buildElement();
    };

    //建立元件
    Birthday.prototype.buildElement = function() {
        var that = this;

        var obj = that._config['year_element'];
        for (var i=that._config['start_year'];i>=that._config['end_year'];i--) {
            obj.append('<option value="'+ i +'">'+ (that._config['is_ROC_show'] == 1?parseInt(i) - 1911:i) +'</option>');
        }
        obj.val(that._config['year_sel']);
        that._config['year_element'].unbind().on('change', function(){
            that.changeDays();
        });

        var obj = that._config['month_element'];
        for (var i=1;i<=12;i++) {
            obj.append('<option value="'+ (i<=9?'0'+i:i) +'">'+ (i<=9?'0'+i:i) +'</option>');
        }
        obj.val(that._config['month_sel']);
        that._config['month_element'].unbind().on('change', function(){
            that.changeDays();
        });

        that.changeDays();
    };

    //改變日期選項
    Birthday.prototype.changeDays = function() {
        var that = this;
        var days = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);
        var year = that._config['year_element'].val();
        var month = that._config['month_element'].val();

        // 判斷2月份是28天還是29天
        if ((year % 4 == 0 && year % 100 != 0) || (year % 100 == 0 && year % 400 == 0)) {
            days[1] = 29;
        }

        var i_end = days[month - 1];
        var obj = that._config['day_element'];
        obj.html('');
        for (var i = 1; i <= i_end; i++) {
            obj.append('<option value="'+ (i<=9?'0'+i:i) +'">'+ (i<=9?'0'+i:i) +'</option>');
        }
        obj.val(that._config['day_sel']);
    };
