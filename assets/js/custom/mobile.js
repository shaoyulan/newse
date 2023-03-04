/*
| -------------------------------------------------------------------
| 定義前台公用JS v.1.0
| -------------------------------------------------------------------
*/

//檢查正整數
function _check_natural_number(el){
    var is_natural_number = 1;
    if(isNaN($(el).val()) || $(el).val() < 0){
        is_natural_number = 0;
    }
    if(is_natural_number == 0){
        _alert_custom('請輸入數字','',function(){
            $(el).val('');
        });
    }
}

//數字格式化
function _number_format(num, precision, separator) {
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

//顯示換行字符
function _nl2br(str, is_xhtml) {
    var breakTag = (is_xhtml || typeof is_xhtml === 'undefined') ? '<br />' : '<br>';
    return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1'+ breakTag +'$2');
}

/*-----------------------------------------------------------------------------*/

//轉址
function _direct_url(url_link) {
    window.location.href = url_link;
}

//轉頁面 參考 routes.js
function _direct_page(route_path, is_force) {
    if (typeof route_path === 'undefined') {
        route_path = '';
    }
    if(typeof is_force === 'undefined'){
        is_force = true;
    }
    app.router.navigate(route_path, {
        ignoreCache: true,
        force: is_force
    });
}
//返回頁面 參考 routes.js
function _back_page(route_path, is_force) {
    if (typeof route_path === 'undefined') {
        route_path = '';
    }
    if(typeof is_force === 'undefined'){
        is_force = true;
    }
    app.router.back(route_path, {
        ignoreCache: true,
        force: is_force
    });
}

//重新整理頁面 參考 routes.js
function _refresh_page(route_path) {
    app.router.navigate(route_path, {
        reloadCurrent: true,
        ignoreCache: true,
    });
}

//取得裝置資訊
var mobile_info_res = null;
function _get_mobile_info() {
    mobile_info_res = function(res_data) {
        var that = this;
        if(/(AndroidMuki)/i.test(window.navigator.userAgent)) {
            $.post('/ajax/ajax_mobile/ajax_save_mobile_info', {
                'type': that.deviceType(),
                'version': res_data['os_version'],
                'app_version' : res_data['application_version'],
                'model': res_data['device'],
                'token': res_data['XGToken']
            },function(res){
                console.log(res);
            });
        }else if(/(IosMuki)/i.test( window.navigator.userAgent )) {
            $.post('/ajax/ajax_mobile/ajax_save_mobile_info', {
                'type': that.deviceType(),
                'version': res_data['os_version'],
                'app_version' : res_data['application_version'],
                'model': res_data['device'],
                'token': res_data['token']
            });
        }
    };
    var $getMobileInfo = new GetMobileInfo(mobile_info_res);
    $getMobileInfo.action();
}

//裝置判定
function _deviceType () {
    var device_type = 0;
    /*if(/(Android)/i.test( window.navigator.userAgent )) {*/
    if(/(AndroidMuki)/i.test(window.navigator.userAgent)) {
        device_type = 1;
    }
    /*else if(/(iPhone|iPad|iPod|iOS)/i.test( window.navigator.userAgent )) {*/
    else if(/(IosMuki)/i.test( window.navigator.userAgent )) {
        device_type = 2;
    }
    return device_type;
}

//設定通知數字
function _set_badge_num(badge) {
    var badge = parseInt(badge);
    var config = {
        badge,
    };
    var $setBadgeNum = new SetBadgeNum();
    $setBadgeNum.action(config);
}

//彈跳視窗
function _alert_custom(title, content, call_back){
    var config = {
        title: title,
        content : typeof content !== 'undefined'?content:'',
    };
    var $alertDialog = new AlertDialog();
    $alertDialog.website = function() {
        app.dialog.alert(content, title, function(){
            if(typeof call_back === 'function'){
                call_back();
            }
        });
    };
    $alertDialog.iOS = function() {
        this.website();
    };
    $alertDialog.android = function() {
        this.website();
    };
    $alertDialog.action(config);
}

//確認視窗
function _confirm_custom(title, content, call_back, call_cancel){
    app.dialog.confirm(content, title, function(){
        if(typeof call_back === 'function'){
            call_back();
        }
    }, function(){
        if(typeof call_cancel === 'function'){
            call_back();
        }
    });
}

//另開視窗
function _open_window(url_link) {
    if(url_link != ''){
        var config = {
            url_link: url_link,
            type: 1
        };
        var $openWindow = new OpenWindow();
        $openWindow.action(config);
    }
}

//開啟瀏覽器
function _open_browser(url_link) {
    if (location.hostname.indexOf("www.") != -1) {
        var hostname_arr = location.hostname.split("www.");
        var base_url2 = location.protocol + "//" + hostname_arr[1];
    }else{
        var base_url2 = location.protocol + "//www." + location.hostname;
    }
    var base_url = location.protocol + "//" + location.hostname;
    if (url_link.indexOf(base_url) != -1 || url_link.indexOf(base_url2) != -1) {
        if (url_link.indexOf("index") != -1) {// 首頁
            _direct_page('/index');
            return
        }
    }
    else{
         if(url_link != ''){
            var config = {
                url_link: url_link,
            };
            var $openBrowser = new OpenBrowser();
            $openBrowser.action(config);
        }
    }
}

//開啟讀取效果
function _loading_start() {
    var $loadingStart = new LoadingStart();
    $loadingStart.website = function() {
        app.preloader.show();
        // muki_loading(true);
    }
    $loadingStart.iOS = function() {
        this.website();
    }
    $loadingStart.android = function() {
        this.website();
    }
    $loadingStart.action();
}

//關閉讀取效果
function _loading_stop() {
    var $loadingStop = new LoadingStop();
    $loadingStop.website = function() {
        app.preloader.hide();
        // muki_loading(false);
    }
    $loadingStop.iOS = function() {
        this.website();
    }
    $loadingStop.android = function() {
        this.website();
    }
    $loadingStop.action();
}

//撥號
function _dial(number) {
    var config = {
        number: number,
    };
    var $dial = new Dial();
    $dial.action(config);
}

/*-----------------------------------------------------------------------------*/

//取得定位座標
var get_location_res = null;
function _get_location(call_back) {
    get_location_res = function(res_data) {
        if(typeof call_back === 'function'){
            call_back(res_data);
        }
    };
    var $getLocation = new GetLocation(get_location_res);
    $getLocation.action();
}

//開啟地圖
function _open_map(latitude, longitude) {
    var config = {
        latitude : latitude,
        longitude : longitude
    };
    var $openMap = new OpenMap();
    $openMap.action(config);
}

/*-----------------------------------------------------------------------------*/

//下載檔案
function _download_file(file_path, file_name, file_url) {
    var config = {
        file_name : file_name,
        file_path : window.location.origin + file_path
    };
    var $downloadFile = new DownloadFile();
    $downloadFile.website = function (){
        _open_window(file_url);
    };
    $downloadFile.action(config);
}

//開啟檔案
function _open_file(file_path, file_name, file_url) {
    var config = {
        file_name : file_name,
        file_path : window.location.origin + file_path
    };
    var $openFile = new OpenFile();
    $openFile.website = function (){
        _open_window(file_url);
    };
    $openFile.action(config);
}

/*-----------------------------------------------------------------------------*/

//facebook 登入
var loginFB_res = null;
function _login_fb(member_type){
    if(typeof member_type === 'undefined'){
        member_type = 'member';
    }
    loginFB_res = function(res_data) {
        var id = res_data['id'].length > 0?res_data['id']:'';
        var name = res_data['name'].length > 0?res_data['name']:'';
        var picture = res_data['picture'].length > 0?res_data['picture']:'';
        var email = res_data['email'].length > 0?res_data['email']:'';

        var send_data = {
            csrf_test_name: $('.csrf_test_name').val(),
            member_type: member_type,
            id: id,
            name: name,
            picture: picture,
            email: email
        }
        $.post('/ajax/ajax_mobile/login_fb', send_data, function(res) {
            $('.csrf_test_name').val(res['csrf_data']['hash']);
            if(res['result'] == 1){
                _alert_custom(res['message'], '', function(){
                    _direct_url(res['result_data']['url_link']);
                }, 200);
            }
            else if(res['result'] == -1){
                _alert_custom(res['message'], '', function(){
                    _direct_page(res['result_data']['url_link']);
                }, 200);
            }
            else{
                _alert_custom(res['message']);
            }
        }, 'json');
    };
    var $loginFB = new LoginByFacebook(loginFB_res);
    $loginFB.website = function() {
        //window.location.href = '/website/login_fb/'+member_type;
        _alert_custom('請使用APP開啟');
    }
    $loginFB.action();
}

//line 登入
var loginLine_res = null;
function _login_line(member_type){
    if(typeof member_type === 'undefined'){
        member_type = 'member';
    }
    loginLine_res = function(res_data) {
        var id = res_data['id'].length > 0?res_data['id']:'';
        var name = res_data['name'].length > 0?res_data['name']:'';
        var picture = res_data['picture'].length > 0?res_data['picture']:'';
        var email = res_data['email'].length > 0?res_data['email']:'';

        var send_data = {
            csrf_test_name: $('.csrf_test_name').val(),
            member_type: member_type,
            id: id,
            name: name,
            picture: picture,
            email: email
        }
        $.post('/ajax/ajax_mobile/login_line', send_data, function(res) {
            $('.csrf_test_name').val(res['csrf_data']['hash']);
            if(res['result'] == 1){
                _alert_custom(res['message'], '', function(){
                    _direct_url(res['result_data']['url_link']);
                }, 200);
            }
            else if(res['result'] == -1){
                _alert_custom(res['message'], '', function(){
                    _direct_page(res['result_data']['url_link']);
                }, 200);
            }
            else{
                _alert_custom(res['message']);
            }
        }, 'json');
    };
    var $loginLine = new LoginByLine(loginLine_res);
    $loginLine.website = function() {
        //window.location.href = '/website/login_line/'+member_type;
        _alert_custom('請使用APP開啟');
    }
    $loginLine.action();
}

//facebook 綁定
var bindFB_res = null;
function _bind_fb(member_type){
    if(typeof member_type === 'undefined'){
        member_type = 'member';
    }
    bindFB_res = function(res_data) {
        var id = res_data['id'].length > 0?res_data['id']:'';
        var name = res_data['name'].length > 0?res_data['name']:'';
        var picture = res_data['picture'].length > 0?res_data['picture']:'';
        var email = res_data['email'].length > 0?res_data['email']:'';

        var send_data = {
            csrf_test_name: $('.csrf_test_name').val(),
            member_type: member_type,
            id: id,
            name: name,
            picture: picture,
            email: email
        }
        $.post('/ajax/ajax_mobile/bind_fb', send_data, function(res) {
            $('.csrf_test_name').val(res['csrf_data']['hash']);
            if(res['result'] == 1){
                _alert_custom(res['message'], '', function(){
                    _refresh_page(res['result_data']['url_link']);
                }, 200);
            }
            else{
                _alert_custom(res['message'], '', function(){
                    //_direct_page(res['result_data']['url_link']);
                }, 200);
            }
        }, 'json');
    };
    var $bindFB = new LoginByFacebook(bindFB_res);
    $bindFB.website = function() {
        //window.location.href = '/website/bind_fb/'+member_type;
        _alert_custom('請使用APP開啟');
    }
    $bindFB.action();
}

//line 綁定
var bindLine_res = null;
function _bind_line(member_type){
    if(typeof member_type === 'undefined'){
        member_type = 'member';
    }
    bindLine_res = function(res_data) {
        var id = res_data['id'].length > 0?res_data['id']:'';
        var name = res_data['name'].length > 0?res_data['name']:'';
        var picture = res_data['picture'].length > 0?res_data['picture']:'';
        var email = res_data['email'].length > 0?res_data['email']:'';

        var send_data = {
            csrf_test_name: $('.csrf_test_name').val(),
            member_type: member_type,
            id: id,
            name: name,
            picture: picture,
            email: email
        }
        $.post('/ajax/ajax_mobile/bind_line', send_data, function(res) {
            $('.csrf_test_name').val(res['csrf_data']['hash']);
            if(res['result'] == 1){
                _alert_custom(res['message'], '', function(){
                    _refresh_page(res['result_data']['url_link']);
                }, 200);
            }
            else{
                _alert_custom(res['message'], '', function(){
                    //_direct_page(res['result_data']['url_link']);
                }, 200);
            }
        }, 'json');
    };
    var $bindLine = new LoginByLine(bindLine_res);
    $bindLine.website = function() {
        //window.location.href = '/website/bind_line/'+member_type;
        _alert_custom('請使用APP開啟');
    }
    $bindLine.action();
}

//是否為IOS13
function _is_ios_13(){
    var isIOS = (/iPad|iPhone|iPod/.test(navigator.platform) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !window.MSStream;

    return isIOS;
}

//apple 登入 (IOS13以上版本才會出現這個功能)
var loginApple_res = null;
function _login_apple(member_type){
    if(typeof member_type === 'undefined'){
        member_type = 'member';
    }
    loginApple_res = function(res_data) {
        var id = res_data['id'].length > 0?res_data['id']:'';
        var name = res_data['name'].length > 0?res_data['name']:'';
        var picture = res_data['picture'].length > 0?res_data['picture']:'';
        var email = res_data['email'].length > 0?res_data['email']:'';

        var send_data = {
            csrf_test_name: $('.csrf_test_name').val(),
            member_type: member_type,
            id: id,
            name: name,
            picture: picture,
            email: email
        }
        $.post('/ajax/ajax_mobile/login_apple', send_data, function(res) {
            $('.csrf_test_name').val(res['csrf_data']['hash']);
            if(res['result'] == 1){
                _alert_custom(res['message'], '', function(){
                    _direct_url(res['result_data']['url_link']);
                }, 200);
            }
            else if(res['result'] == -1){
                _alert_custom(res['message'], '', function(){
                    _direct_page(res['result_data']['url_link']);
                }, 200);
            }
            else{
                _alert_custom(res['message']);
            }
        }, 'json');
    };
    var $loginApple = new LoginByApple(loginApple_res);
    $loginApple.website = function() {
        //window.location.href = '/website/login_apple/'+member_type;
        _alert_custom('請使用APP開啟');
    }
    $loginApple.action();
}

//apple 綁定
var bindApple_res = null;
function _bind_apple(member_type){
    if(typeof member_type === 'undefined'){
        member_type = 'member';
    }
    bindApple_res = function(res_data) {
        var id = res_data['id'].length > 0?res_data['id']:'';
        var name = res_data['name'].length > 0?res_data['name']:'';
        var picture = res_data['picture'].length > 0?res_data['picture']:'';
        var email = res_data['email'].length > 0?res_data['email']:'';

        var send_data = {
            csrf_test_name: $('.csrf_test_name').val(),
            member_type: member_type,
            id: id,
            name: name,
            picture: picture,
            email: email
        }
        $.post('/ajax/ajax_mobile/bind_apple', send_data, function(res) {
            $('.csrf_test_name').val(res['csrf_data']['hash']);
            if(res['result'] == 1){
                _alert_custom(res['message'], '', function(){
                    _refresh_page(res['result_data']['url_link']);
                }, 200);
            }
            else{
                _alert_custom(res['message'], '', function(){
                    //_direct_page(res['result_data']['url_link']);
                }, 200);
            }
        }, 'json');
    };
    var $bindApple = new LoginByApple(bindApple_res);
    $bindApple.website = function() {
        //window.location.href = '/website/bind_apple/'+member_type;
        _alert_custom('請使用APP開啟');
    }
    $bindApple.action();
}

/*-----------------------------------------------------------------------------*/

//開啟內建分享
function _open_share(share_content) {
    var config = {
        share_content : share_content
    };
    var $openShare = new OpenShare();
    $openShare.website = function(){
        if(share_content.indexOf('http') !== -1){
            _open_window(share_content);
        }
    };
    $openShare.action(config);
}

//分享到 facebook
function _share_to_fb() {
    var config = {
        share_content : window.location.href
    };
    var $shareFB = new ShareToFacebook();
    $shareFB.action(config);
}

//分享到 line
function _share_to_line() {
    var url_coded = encodeURIComponent(window.location.href);
    var config = {
        share_content : url_coded
    };
    var $shareLine = new ShareToLine();
    $shareLine.action(config);
}

/*-----------------------------------------------------------------------------*/

var open_scan_res = null;
function _open_scan(topic, logo, call_back) {
    var config = {
        show_data : {
            'topic': topic, //畫面顯示文字
            'img_url': logo, //畫面顯示圖片
        }
    };
    open_scan_res = function(res_data) {
        if(typeof call_back === 'function'){
            call_back(res_data);
        }
    }
    var $openScan = new OpenScan(open_scan_res);
    $openScan.action(config);
}

/*-----------------------------------------------------------------------------*/

var picture_res = null;
//上傳圖片
function _upload_picture(call_back) {
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
                        _loading_stop();
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
        _loading_start();
    }
    $picture.loadingStop = function() {
        _loading_stop();
    }
    $picture.website = function() {
        $('#upload_picture_file').remove();
        $('body').append('<input type="file" id="upload_picture_file" accept="image/jpg,image/jpeg,image/png" style="display: none;" />');
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
//裁切圖片 in framework7
function _crop_picture(pic_width, pic_height, call_back) {
    var config = {
        browse_type : 2,
        pic_width : parseInt(pic_width) * 2,
        pic_height : parseInt(pic_height) * 2,
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
                            _loading_stop();
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
                        _loading_stop();
                        popup_picture.close();
                    }
                    else{
                        if(typeof call_back === 'function'){
                            _loading_stop();
                            call_back(upload_info);
                        }
                    }
                });
            });
        }
    }
    $picture = new Picture(picture_res);
    $picture.website = function() {
        popup_picture = app.popup.create({
            content: '<div class="popup popup-crop_picture">' + $('.popup-crop_picture').html() + '</div>',
            on: {
                open: function (popup) {
                    //建議尺寸
                    $('#crop_picture_pic_size').html((parseInt($picture._data[1]) * 0.5)+' x '+(parseInt($picture._data[2]) * 0.5));
                    //預覽畫面
                    // $('#crop_picture_preview').css({'touch-action':'pan-y','width':'calc(100% - 10px)','background':'linear-gradient(to bottom, rgba(51,51,51,1) 0%,rgba(102,102,102,1) 100%,rgba(102,102,102,1) 100%)', 'margin-left':'5px', 'margin-right':'5px'});
                    $('#crop_picture_preview').css('height', $('#crop_picture_preview').width());
                    //選擇圖片
                    $('#crop_picture_select_btn').unbind().on('click',function() {
                        $('#crop_picture_file').click();
                    });
                    //上傳圖片
                    upload_length = 0;
                    $('#crop_picture_file').unbind().on('change', function(input) {
                        var files = input.target.files;
                        upload_length = files.length;
                        for(var key in files){
                            if(! isNaN(key)){
                                var file = files[key];
                                $picture.handle(file, '#crop_picture_preview').then(function(data){
                                    $('#crop_picture_upload_btn').unbind().on('click', function() {
                                        $('#crop_picture_upload_btn').unbind();
                                        if(upload_length > 0){
                                            _loading_start();
                                            $picture.result();
                                        }
                                    });
                                });
                            }
                        }
                    }).val('');
                },
                opened: function (popup) {
                    //$('#crop_picture_select_btn').click();
                },
                close: function (popup) {
                    if(typeof call_back === 'function'){
                        call_back(upload_info);
                    }
                }
            }
        });
        popup_picture.open();
    }
    $picture.action(config);
}
//上傳多張圖片 in framework7
function _multi_upload_picture(pic_width, pic_height, pic_length, call_back) {
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
                console.log($picture.upload(blob));
                $picture.upload(blob).then(function(data) {
                    console.log(data)
                    upload_info = JSON.parse(data);
                    upload_info['upload_length'] = upload_length;
                    if(popup_picture !== null){
                        _loading_stop();
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
        _loading_start();
    }
    $picture.loadingStop = function() {
        _loading_stop();
    }
    $picture.website = function() {
        if($('#upload_multi_picture_file').length == 0){
            $('body').append('<input type="file" id="upload_multi_picture_file" accept="image/jpg,image/jpeg,image/png" style="display: none;" multiple />');
        }
        upload_length = 0;
        $('#upload_multi_picture_file').unbind().on('change', function(input) {
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

 /**
 * 讀取 QR Code
 * @param  Function call_back 回調方法
 * @return
 */
var re_qrcode_res = null;
function _re_qrcode(call_back) {
    var config = {
        browse_type : 1,
        pic_width : 100,
        pic_height : 100,
        pic_length : 1,
    };
    var $re_qrcode = null;
    re_qrcode_res = function(res_data) {
        if($re_qrcode.deviceType() == 1){
            var upload_data = res_data['ResultJA'];
            for(var key in upload_data){
                var base64 = 'data:image/'+upload_data[key]['Ext']+';base64,' + $re_qrcode.decode(upload_data[key]['Data']);
                $re_qrcode.base64ToBlob(base64).then(function(blob) {
                    window.qrcode.decode(window.URL.createObjectURL(blob));
                    window.qrcode.callback = function(data){
                        if(typeof call_back === 'function'){
                            call_back(data);
                        }
                    }
                });
            }
        }
        else{
            var base64 = res_data;
            $re_qrcode.base64ToBlob(base64).then(function(blob) {
                window.qrcode.decode(window.URL.createObjectURL(blob));
                window.qrcode.callback = function(data){
                    if(typeof call_back === 'function'){
                        call_back(data);
                    }
                }
            });
        }
    }
    var upload_length = 0;
    $re_qrcode = new ReQrcode(re_qrcode_res);
    $re_qrcode.website = function() {
        if($('#upload_qrcode').length == 0){
            $('body').append('<input type="file" id="upload_qrcode" accept="image/jpg,image/jpeg,image/png" style="display: none;" />');
        }
        $('#upload_qrcode').unbind().on('change', function(input) {
            var files = input.target.files;
            upload_length = files.length;
            for(var key in files){
                if(! isNaN(key)){
                    var file = files[key];
                    $re_qrcode.handle(file);
                }
            }
        }).click();
    }
    $re_qrcode.action(config);
}

/*-----------------------------------------------------------------------------*/
/**
 * @Class Pagination
 */
function Pagination(){
    this.initialize.apply(this, arguments);
}

/**
 * @param  {[type]} elementName   目標頁碼元素名稱
 * @param  {[type]} urlLink       當前網址
 * @param  {[type]} attributeList 網址參數物件
 * @param  {[type]} totalPage     總頁數
 * @param  {[type]} nowPage       當前頁碼
 */
Pagination.prototype.initialize = function(elementName, urlLink, attributeList, totalPage, nowPage) {
    this._pagination = document.querySelector(elementName);
    this._urlLink = urlLink;
    this._attributeList = attributeList;
    this._totalPage = totalPage;
    this._nowPage = nowPage;
    this._startPage = parseInt(nowPage) - 2 > 1 ?parseInt(nowPage) - 2 >  - 2 : 1;
    this._end_page = parseInt(nowPage) + 2 < totalPage ?parseInt(nowPage) + 2 : totalPage;
}

Pagination.prototype.createLinks = function() {
    if(this._totalPage > 1){
        var html = '';
        html+='<ol>';
            if(this._nowPage > 2){
                html+='<li>';
                    html+='<a data-ci-pagination-page="'+(this._nowPage - 1)+'" rel="prev"><i class="fa fa-chevron-left"></i></a>';
                html+='</li>';
            }
            for(var i=this._startPage; i<=this._end_page; i++){
                if(this._nowPage == i){
                    html+='<li class="clk mx-2">';
                        html+='<a class="active">'+i+'</a>';
                    html+='</li>';
                }
                else{
                    html+='<li class="mx-2">';
                        html+='<a data-ci-pagination-page="'+i+'">'+i+'</a>';
                    html+='</li>';
                }
            }
            if(this._nowPage < this._totalPage - 1){
                html+='<li>';
                    html+='<a data-ci-pagination-page="'+(this._nowPage + 1)+'" rel="next"><i class="fa fa-chevron-right"></i></a>';
                html+='</li>';
            }
        html+='</ol>';
        this.getElement().innerHTML = html;
        this.setLinkAction();
    }
}

Pagination.prototype.getElement = function() {
    var notes = null;
    for (var i=0; i<this._pagination.childNodes.length; i++) {
        if(this._pagination.childNodes[i].childNodes.length > 0){
            for(var j=0; j<this._pagination.childNodes[i].childNodes.length; j++) {
                if(this._pagination.childNodes[i].childNodes[j].className == 'pagination'){
                    notes = this._pagination.childNodes[i].childNodes[j];
                    break;
                }
            }
        }
    }

    return notes;
}

Pagination.prototype.setLinkAction = function() {
    var PAGINATION = this;
    var clickAction = function(evt) {
        var select_page = evt.target.getAttribute('data-ci-pagination-page');
        if(select_page !== null){
            PAGINATION._attributeList['page'] = select_page;
            var url_link = '';
            var idx = 0;
            for(var key in PAGINATION._attributeList){
                if(idx == 0){
                    url_link+='?'+key+'='+PAGINATION._attributeList[key];
                }
                else{
                    url_link+='&'+key+'='+PAGINATION._attributeList[key];
                }
                idx++;
            }
            refresh_page(PAGINATION._urlLink + url_link);
        }
    }
    for(var i=0; i<this.getElement().childNodes[0].childNodes.length; i++){
        var page_el = this.getElement().childNodes[0].childNodes[i].childNodes[0];
        if(typeof page_el.getAttribute('data-ci-pagination-page') !== 'undefined'){
            if (page_el.addEventListener) {
                page_el.addEventListener('click', clickAction);
            }
            else if(page_el.attachEvent){
                page_el.attachEvent('onclick', clickAction);
            }
        }
    }
}

/**
 * @Class Birthday
 */
function Birthday(){
    this.initialize.apply(this, arguments);
}

Birthday.prototype.initialize = function(config){
    var today = new Date();
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
        config['year_element'] = $('.birth_year').size() > 0?$('.birth_year'):'';
    }
    //月份選擇器名稱
    if(typeof config['month_element'] === 'undefined'){
        config['month_element'] = $('.birth_month').size() > 0?$('.birth_month'):'';
    }
    //日期選擇器名稱
    if(typeof config['day_element'] === 'undefined'){
        config['day_element'] = $('.birth_day').size() > 0?$('.birth_day'):'';
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
}

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
}

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
}

/*-----------------------------------------------------------------------------*/
/**
 * 格式化時間函數
 * @param {format} 時間顯示格式
 */
Date.prototype.format = function (format) {
    var date = {
        "m+": this.getMonth() + 1,
        "d+": this.getDate(),
        "H+": this.getHours(),
        "i+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S": this.getMilliseconds(),
    };
    if (/(Y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
}

Date.prototype.handle = function (str) {
    return str.replace(/-/g,"/");
}