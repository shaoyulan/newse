/*
| -------------------------------------------------------------------
| 擴充jquery.validate
| -------------------------------------------------------------------
| 將好用的驗證方法定義於此，方便管理
|
| -------------------------------------------------------------------
*/

$.validator.addMethod(
    "regex",
    function(value, element, regexp) {
        var re = new RegExp(regexp);
        return this.optional(element) || re.test(value);
    },
    "請輸入正確的值"
);

$.validator.addMethod(
    "ipCheck",
    function(value, element) {
        var re = /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
        return this.optional(element) || (re.test(value) && (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256));
    },
    "請輸入正確的IP位址"
);

$.validator.addMethod(
    "TWIDCheck",
    function(value, element, param) {
        var a = new Array('A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'X', 'Y', 'W', 'Z', 'I', 'O');
        var b = new Array(1, 9, 8, 7, 6, 5, 4, 3, 2, 1);
        var c = new Array(2);
        var d;
        var e;
        var f;
        var g = 0;
        var h = /^[a-z](1|2)\d{8}$/i;
        if (value.search(h) == -1)
        {
            return false;
        }
        else
        {
            d = value.charAt(0).toUpperCase();
            f = value.charAt(9);
        }
        for (var i = 0; i < 26; i++)
        {
            if (d == a[i])//a==a
            {
                e = i + 10; //10
                c[0] = Math.floor(e / 10); //1
                c[1] = e - (c[0] * 10); //10-(1*10)
                break;
            }
        }
        for (var i = 0; i < b.length; i++)
        {
            if (i < 2)
            {
                g += c[i] * b[i];
            }
            else
            {
                g += parseInt(value.charAt(i - 1)) * b[i];
            }
        }
        if ((g % 10) == f)
        {
            return true;
        }
        if ((10 - (g % 10)) != f)
        {
            return false;
        }
        return true;
    }, "請輸入有效的身份證字號!"
);

$.validator.addMethod(
    "phoneCheck",
    function(value, element) {
        var re = new RegExp('^[\\d\-\(\)\#]{1,}$');
        return this.optional(element) || re.test(value);
    },
    "電話號碼不符合格式，僅接受數字、#-()等符號"
);

$.validator.addMethod(
    "mobileTaiwan",
    function(value, element) {
        var re = new RegExp('^09[\\d]{2}[\\d\-]{1,}$');
        return this.optional(element) || re.test(value);
    },
    "手機號碼不符合格式，僅允許09開頭的數字、-符號"
);

// 比較時間 - 大於
$.validator.addMethod(
    "compareTimeByGreater",
    function(value, element, param) {
        var today = new Date();
        var now_date = today.getFullYear() + '/' + (today.getMonth()+1 < 10 ? '0'+(today.getMonth()+1) : today.getMonth()+1) + '/' + today.getDate();
        var start_time = now_date + ' ' + value;
        var end_time = now_date + ' ' + jQuery(param).val();

        var date1 = new Date(start_time);
        var date2 = new Date(end_time);
        return date1 >= date2;
    },
    '不得大於結束時間'
);

// 比較時間 - 小於
$.validator.addMethod(
    "compareTimeByLess",
    function(value, element, param) {
        var today = new Date();
        var now_date = today.getFullYear() + '/' + (today.getMonth()+1 < 10 ? '0'+(today.getMonth()+1) : today.getMonth()+1) + '/' + today.getDate();
        var start_time = now_date + ' ' + value;
        var end_time = now_date + ' ' + jQuery(param).val();

        var date1 = new Date(start_time);
        var date2 = new Date(end_time);
        return date1 <= date2;
    },
    '不得小於開始時間'
);