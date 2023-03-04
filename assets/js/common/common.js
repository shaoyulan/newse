/*
| -------------------------------------------------------------------
| 定義公用JS
| -------------------------------------------------------------------
| 共用的皆可定義於此，方便管理
|
| -------------------------------------------------------------------
*/

/**
 * 只可輸入數字
 *
 * @param   element     e              元素
 * @param   string      content        輸入內容
 * @return  boolen
 */

	function ValidateNumber(e, content)
	{
	    if (!/^\d+[.]?\d*$/.test(content))
	    {
	        $(e).val(/^\d+[.]?\d*/.exec($(e).val()));
	    }

	    return false;
	}

/**
 * 連續觸發事件時執行最後一次觸發的事件。
 * 後一次事件會覆蓋前一次事件，如果超過指定時間還沒有新的事件，就執行最後一個事件
 *
 * @param   string      id       名稱
 * @param   function    fn       執行函式
 * @param   int         wait     等待秒數
 */

	function delay_till_last(id, fn, wait)
    {
	    if (_timer[id]) {
	        window.clearTimeout(_timer[id]);
	        delete _timer[id];
	    }

	    return _timer[id] = window.setTimeout(function() {
	        fn();
	        delete _timer[id];
	    }, wait);
	}

/**
 * 焦點在單選下的文字輸入框時將指定的單選選取
 *
 * @param   string      elem_name       元素名稱
 */

    function radio_text_focus(elem_name)
    {
        $('#' + elem_name).prop('checked',true);
    }