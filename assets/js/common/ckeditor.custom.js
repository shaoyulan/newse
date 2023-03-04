/*
| -------------------------------------------------------------------
| ckeditor 相關函式
| -------------------------------------------------------------------
| 將好用的函式定義於此，方便管理
|
| -------------------------------------------------------------------
*/

/**
 * 插入文字
 * @param   object  $element        HTML元素
 * @param   string  $value          要插入的值
 * @param   string  $type           類型(text:文字、html:html文字)
 */
function editorInsertValue(element,value,type)
{
    if(type == 'text') {
        ce1.instances[element.attr('name')].insertText(value);
    } else if(type == 'html') {
        ce1.instances[element.attr('name')].insertHtml(value);
    }
}

/**
 * 設定文字
 * @param   object  $element        HTML元素
 * @param   string  $value          要設定的值
 */
function editorSetData(element,value)
{
    ce1.instances[element.attr('name')].setData(value);
}

