/*=============================================================================*/
/* muki_dcloud.js v1.0
/*=============================================================================*/

/*-----------------------------------------------------------------------------*/
/**
 * 定義與 Dcloud 互動的建構式
 */
/**
 * 擴展API準備完成後要執行的操作
 * @return {[type]} [description]
 *
 * 有回傳東西回來就用 同步
 * 沒有回傳東西回來就用 異步
 */
function plusInit(){
    //定義 iosHandler 介面及方法
    var iosHandler = {
        // 換頁 (異步)
        paging : function (url_link, view_name, paging_style, view_property, view_refresh_time, is_update_page, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'paging', [callbackID, url_link, view_name, paging_style, view_property, view_refresh_time, is_update_page]);
        },
        // 取得所有 Webview (同步)
        getAllWebview : function () {
            return window.plus.bridge.execSync('iosHandler', 'getAllWebview');
        },
        // 取得目前 Webview 的名稱 (同步)
        getWebviewName : function () {
            return window.plus.bridge.execSync('iosHandler', 'getWebviewName');
        },
        // Webview是否存在 (異步)
        isWebview : function (view_name, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'isWebview', [callbackID, view_name]);
        },
        // 釋放掉 Webview (異步)
        removeWebview : function (view_name, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'removeWebview', [callbackID, view_name]);
        },
        // 開啟讀取效果 (異步)
        startLoading : function (successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'startLoading', [callbackID]);
        },
        // 關閉讀取效果 (異步)
        stopLoading : function (successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'stopLoading', [callbackID]);
        },
        // 用於另開頁面 (異步)
        shouldStartLoadWith : function (href, target, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'shouldStartLoadWith', [callbackID, href, target]);
        },
        // 取得裝置資訊 (同步)
        getAppInfo : function () {
            return window.plus.bridge.execSync('iosHandler', 'getAppInfo');
        },
        // 取得裝置權限判斷 (同步)
        //topic: 顯示訊息
        //type: 權限類型 ; 1: 定位
        checkAuthorization : function (topic, type) {
            return window.plus.bridge.execSync('iosHandler', 'checkAuthorization', [topic, type]);
        },
        // 取得經緯度 (同步)
        getCoordinate : function () {
            return window.plus.bridge.execSync('iosHandler', 'getCoordinate');
        },
        // 開啟地圖導航 (異步)
        openCoordinateByMap : function (latitude, longitude, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'openCoordinateByMap', [callbackID, latitude, longitude]);
        },
        // 開啟地圖導航 by Waze (異步)
        openCoordinateByWaze : function (latitude, longitude, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'openCoordinateByWaze', [callbackID, latitude, longitude]);
        },
        // 連結直接開啟瀏覽器 (異步)
        openUrlByBrowser : function (href, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'openUrlByBrowser', [callbackID, href]);
        },
        // 分享 line 連結 (異步)
        shareByLine : function (href, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'shareByLine', [callbackID, href]);
        },
        // 分享 facebook 連結 (異步)
        shareByFacebook : function (href, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'shareByFacebook', [callbackID, href]);
        },
        // facebook 登入 (異步)
        loginViaFB : function (successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'loginViaFB', [callbackID]);
        },
        // line 登入 (異步)
        loginViaLINE : function (successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'loginViaLINE', [callbackID]);
        },
        // 檔案是否存在 (異步)
        isFile : function (file_name, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'isFile', [callbackID, file_name]);
        },
        // 下載檔案 (異步)
        downloadFile : function (file_url, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'downloadFile', [callbackID, file_url]);
        },
        // 開啟檔案 (異步)
        openFile : function (file_url, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'openFile', [callbackID, file_url]);
        },
        // 傳送待下載檔案的列表 (異步)
        getDownloadList : function (file_json, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'getDownloadList', [callbackID, file_json]);
        },
        // 刪除單一檔案 (異步)
        deleteSingleFile : function (file_name, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'deleteSingleFile', [callbackID, file_name]);
        },
        // 刪除所有檔案 (異步)
        deleteAllFiles : function (successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'deleteAllFiles', [callbackID]);
        },
        // 取得當前已載檔案大小 (同步)
        getFilesSize : function () {
            return window.plus.bridge.execSync('iosHandler', 'getFilesSize');
        },
        // 抓取全部SDK掃描到的mac_id和強度 (同步) by 智行
        get_bluedevice_list : function () {
            return window.plus.bridge.execSync('iosHandler', 'get_bluedevice_list');
        },
        // 判斷藍芽裝置是否開啟 (同步)
        is_bluedevice : function () {
            return window.plus.bridge.execSync('iosHandler', 'is_bluedevice');
        },
        // 原生碼 Alert (異步)
        alertDialog : function (content, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'alertDialog', [callbackID, content]);
        },
        // 訊息框 (異步)
        alertToast : function (content, position, show_time_type, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'alertToast', [callbackID, content, position, show_time_type]);
        },
        // Qrcode掃描器樣式 (異步)
        openScan : function (json_data, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'openScan', [callbackID, json_data]);
        },
        // 取得畫面亮度 (同步)
        getBrightness : function () {
            return window.plus.bridge.execSync('iosHandler', 'getBrightness');
        },
        // 調節畫面亮度 (異步)
        setBrightness : function (set_value, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'setBrightness', [callbackID, set_value]);
        },
        // 傳入是否開啟指紋辨識設定給APP (異步)
        isFingerprint : function (boolean, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'isFingerprint', [callbackID, boolean]);
        },
        // 開啟指紋辨識 (異步)
        openFingerprint : function (successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'openFingerprint', [callbackID]);
        },
        // 開啟內建分享 (異步)
        openShare : function (href, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'openShare', [callbackID, href]);
        },
        // 開啟搖一搖 (異步)
        openShake : function (json_data, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'openShake', [callbackID, json_data]);
        },
        // 關閉搖一搖 (同步)
        closeShake : function (successCallback, errorCallback ){
            return window.plus.bridge.execSync('iosHandler', 'closeShake');
        },
        // 開啟手電筒 (同步)
        isFlashlight : function (successCallback, errorCallback ){
            return window.plus.bridge.execSync('iosHandler', 'isFlashlight');
        },
        //傳輸網頁資料 (異步)
        transferWebData : function (url_link, json_data, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'transferWebData', [callbackID, url_link, json_data]);
        },
        //傳輸變數 (異步)
        transferVariable : function (key, value, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'transferVariable', [callbackID, key, value]);
        },
        //取得變數 (異步)
        getVariable : function (key, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'getVariable', [callbackID, key]);
        },
        //取得上次傳輸時間 (異步)
        getTransferDatetime : function (successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'getTransferDatetime', [callbackID]);
        },
        //判斷檔案存不存在 (異步)
        isExistFile : function (url_link, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'isExistFile', [callbackID, url_link]);
        },
        //GPS 定位紀錄 (異步)
        detectionGps : function (latitude, longitude, precision, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('iosHandler', 'detectionGps', [callbackID, latitude, longitude, precision]);
        },
        //取得 GPS 定位紀錄資料 (同步)
        getEndGpsInfo : function (){
            return window.plus.bridge.execSync('iosHandler', 'getEndGpsInfo');
        }
    };
    window.plus.iosHandler = iosHandler;

    //定義 androidHandler 介面及方法
    var androidHandler = {
        // 換頁 (異步)
        paging : function (url_link, view_name, paging_style, view_property, view_refresh_time, is_update_page, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'paging', [callbackID, url_link, view_name, paging_style, view_property, view_refresh_time, is_update_page]);
        },
        // 取得所有 Webview (同步)
        getAllWebview : function () {
            return window.plus.bridge.execSync('androidHandler', 'getAllWebview');
        },
        // 取得目前 Webview 的名稱 (同步)
        getWebviewName : function () {
            return window.plus.bridge.execSync('androidHandler', 'getWebviewName');
        },
        // Webview是否存在 (異步)
        isWebview : function (view_name, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'isWebview', [callbackID, view_name]);
        },
        // 釋放掉 Webview (異步)
        removeWebview : function (view_name, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'removeWebview', [callbackID, view_name]);
        },
        // 用於另開頁面 (異步)
        shouldStartLoadWith : function (href, target, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            },
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'shouldStartLoadWith', [callbackID, href, target]);
        },
        // 取得裝置資訊 (同步)
        getAppInfo : function () {
            return window.plus.bridge.execSync('androidHandler', 'getAppInfo');
        },
        // 取得裝置權限判斷 (同步)
        //topic: 顯示訊息
        //type: 權限類型 ; 1: 定位
        checkAuthorization : function (topic, type) {
            return window.plus.bridge.execSync('androidHandler', 'checkAuthorization', [topic, type]);
        },
        // 取得經緯度 (異步)
        getCoordinate : function (successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            },
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'getCoordinate', [callbackID]);
        },
        // 開啟地圖導航 (異步)
        openCoordinateByMap : function (latitude, longitude, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            },
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'openCoordinateByMap', [callbackID, latitude, longitude]);
        },
        // 連結直接開啟瀏覽器 (異步)
        openUrlByBrowser : function (href, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            },
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'openUrlByBrowser', [callbackID, href]);
        },
        // 分享 line 連結 (異步)
        shareByLine : function (href, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'shareByLine', [callbackID, href]);
        },
        // 分享 facebook 連結 (異步)
        shareByFacebook : function (href, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'shareByFacebook', [callbackID, href]);
        },
        // 檔案是否存在 (異步)
        isFile : function (file_name, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'isFile', [callbackID, file_name]);
        },
        // 下載檔案 (異步)
        openFile : function (file_url, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'openFile', [callbackID, file_url]);
        },
        // facebook 登入 (異步)
        loginViaFB : function (successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'loginViaFB', [callbackID]);
        },
        // line 登入 (異步)
        loginViaLINE : function (successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'loginViaLINE', [callbackID]);
        },
        // 傳送待下載檔案的列表 (異步)
        getDownloadList : function (file_json, successCallback, errorCallback ) {
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'getDownloadList', [callbackID, file_json]);
        },
        // 刪除單一檔案 (異步)
        deleteSingleFile : function (file_name, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'deleteSingleFile', [callbackID, file_name]);
        },
        // 刪除所有檔案 (異步)
        deleteAllFiles : function (successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'deleteAllFiles', [callbackID]);
        },
        // 取得當前已載檔案大小 (同步)
        getFilesSize : function () {
            return window.plus.bridge.execSync('androidHandler', 'getFilesSize');
        },
        // 呼叫裁切圖片 (異步)
        callSelectPic : function (select_type, pic_w, pic_h, pic_length, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'callSelectPic', [callbackID, select_type, pic_w, pic_h, pic_length]);
        },
        // 返回動作 (異步)
        backAction : function (successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'backAction', [callbackID]);
        },
        // 抓取全部SDK掃描到的mac_id和強度 (同步) by 智行
        get_bluedevice_list : function () {
            return window.plus.bridge.execSync('androidHandler', 'get_bluedevice_list');
        },
        // 判斷藍芽裝置是否開啟 (同步)
        is_bluedevice : function () {
            return window.plus.bridge.execSync('androidHandler', 'is_bluedevice');
        },
        // 開啟藍芽裝置提示 (異步)
        open_bluedevice : function (successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'open_bluedevice', [callbackID]);
        },
        // 原生碼 Alert (異步)
        alertDialog : function (content, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'alertDialog', [callbackID, content]);
        },
        // 訊息框 (異步)
        alertToast : function (content, position, show_time_type, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'alertToast', [callbackID, content, position, show_time_type]);
        },
        // Qrcode掃描器樣式 (異步)
        openScan : function (json_data, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'openScan', [callbackID, json_data]);
        },
        // 取得畫面亮度 (同步)
        getBrightness : function () {
            return window.plus.bridge.execSync('androidHandler', 'getBrightness');
        },
        // 調節畫面亮度 (異步)
        setBrightness : function (set_value, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'setBrightness', [callbackID, set_value]);
        },
        // 傳入是否開啟指紋辨識設定給APP (異步)
        isFingerprint : function (boolean, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'isFingerprint', [callbackID, boolean]);
        },
        // 開啟指紋辨識 (異步)
        openFingerprint : function (successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'openFingerprint', [callbackID]);
        },
        // 開啟內建分享 (異步)
        openShare : function (href, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'openShare', [callbackID, href]);
        },
        // 是否有搖一搖功能 (異步)
        isShake : function (successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'isShake', [callbackID]);
        },
        // 搖一搖 (異步)
        openShake : function (json_data, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'openShake', [callbackID, json_data]);
        },
        // 關閉搖一搖 (同步)
        closeShake : function (successCallback, errorCallback ){
            return window.plus.bridge.execSync('androidHandler', 'closeShake');
        },
        // 開啟手電筒 (同步)
        isFlashlight : function (successCallback, errorCallback ){
            return window.plus.bridge.execSync('androidHandler', 'isFlashlight');
        },
        //傳輸網頁資料 (異步)
        transferWebData : function (url_link, json_data, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'transferWebData', [callbackID, url_link, json_data]);
        },
        //傳輸變數 (異步)
        transferVariable : function (key, value, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'transferVariable', [callbackID, key, value]);
        },
        //取得變數 (同步)
        getVariable : function (key, successCallback, errorCallback ){
            try {
                var result = window.plus.bridge.execSync('androidHandler', 'getVariable', ['', key]);

                return successCallback(result);
            }
            catch (exception){
                //console.log(JSON.stringify(exception));
            }
            finally {
            }
        },
        //取得上次傳輸時間 (異步)
        getTransferDatetime : function (successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'getTransferDatetime', [callbackID]);
        },
        //判斷檔案存不存在 (異步)
        isExistFile : function (url_link, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'isExistFile', [callbackID, url_link]);
        },
        //GPS 定位紀錄 (異步)
        detectionGps : function (latitude, longitude, precision, successCallback, errorCallback ){
            var success = typeof successCallback !== 'function' ? null : function(args)
            {
                successCallback(args);
            },
            fail = typeof errorCallback !== 'function' ? null : function(code)
            {
                errorCallback(code);
            };
            callbackID = window.plus.bridge.callbackId(success, fail);
            return window.plus.bridge.exec('androidHandler', 'detectionGps', [callbackID, latitude, longitude, precision]);
        },
        //取得 GPS 定位紀錄資料 (同步)
        getEndGpsInfo : function (){
            return window.plus.bridge.execSync('androidHandler', 'getEndGpsInfo');
        }
    };
    window.plus.androidHandler = androidHandler;
}

/*-----------------------------------------------------------------------------*/

// 擴展API是否準備好
if(/(Html5Plus)/i.test( window.navigator.userAgent )) {
    if( window.plus ){
        plusInit();
    }else{
        document.addEventListener('plusready', plusInit, false);
    }
}

/*-----------------------------------------------------------------------------*/