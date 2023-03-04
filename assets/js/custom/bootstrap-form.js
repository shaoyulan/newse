var block_type_list = [{
  type: 'topic',
  title: '標題描述',
  icon: 'fa-info-circle',
  is_item: 0
}, {
  type: 'text',
  title: '單行文字',
  icon: 'fa-font',
  is_item: 0
}, {
  type: 'textarea',
  title: '多行文字',
  icon: 'fa-text-height',
  is_item: 0
}, {
  type: 'radio',
  title: '單選題',
  icon: 'fa-dot-circle-o',
  is_item: 1
}, {
  type: 'checkbox',
  title: '多選題',
  icon: 'fa-check-square-o',
  is_item: 1
}, {
  type: 'select',
  title: '下拉選單',
  icon: 'fa-caret-square-o-down',
  is_item: 1
}, {
  type: 'itemsort',
  title: '項目排序',
  icon: 'fa-list-ol',
  is_item: 1
},
{
  type: 'slider',
  title: '數字滑桿',
  icon: 'fa-exchange',
  is_item: 0
}, {
  type: 'star',
  title: '星級評分',
  icon: 'fa-star',
  is_item: 0
}, {
  type: 'number',
  title: '數字框',
  icon: 'fa-sort-numeric-asc',
  is_item: 0
},
{
  type: 'date',
  title: '日期',
  icon: 'fa-calendar',
  is_item: 0
},
{
  type: 'time',
  title: '時間',
  icon: 'fa-clock-o',
  is_item: 0
},
{
  type: 'email',
  title: '電子郵件',
  icon: 'fa-envelope',
  is_item: 0
},
{
  type: 'phone',
  title: '行動電話',
  icon: 'fa-mobile-phone',
  is_item: 0
},
{
  type: 'tel',
  title: '市內電話',
  icon: 'fa-phone',
  is_item: 0
},
{
  type: 'address',
  title: '地址',
  icon: 'fa-map-marker',
  is_item: 0
},
{
  type: 'url_link',
  title: '網址',
  icon: 'fa-link',
  is_item: 0
},
{
  type: 'hr',
  title: '分隔線',
  icon: 'fa-ellipsis-h',
  is_item: 0
}];
//取得有含項目的類型
var item_type_list = new Array();
for (var key in block_type_list) {
  if (block_type_list[key]['is_item'] == 1) {
    item_type_list.push(block_type_list[key]['type']);
  }
}

var dragulaItem = new Array();
$(function () {
  if (window.sessionStorage) {
    window.sessionStorage.setItem('backSerialNumber', 0); //題號顯示設定
    window.sessionStorage.removeItem('backRelated[jump]'); //關聯跳題
  }

  //取得題號顯示設定
  if ($('[name="is_serial_number"]').length > 0) {
    if ($('[name="is_serial_number"]').prop('checked')) {
      if (window.sessionStorage) {
        window.sessionStorage.setItem('backSerialNumber', 1);
      }
    }
  }

  template_init();
});

//產生模板
var item_template_html = new Array();
var item_content_html = new Array();
function template_init() {
  var idx = 0;
  var left_html = right_html = template_html = '';
  var block_content_html = new Array();
  var block_type_count = parseInt(Object.keys(block_type_list).length);
  for (var key in block_type_list) {
    var info = block_type_list[key];
    idx++;

    //選擇面板
    if (idx <= Math.ceil(block_type_count * 0.5)) {
      left_html += "\n\t\t\t<div class=\"ace-settings-item\">\n\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-white btn-sm btn-warning\" id=\"block_type_" + info['type'] + "\" data-type=\"" + info['type'] + "\" onclick=\"block_add('" + info['type'] + "', 0);\">\n\t\t\t\t\t<span style=\"display: block; min-width: 90px; text-align: left;\"><i class=\"fa " + info['icon'] + "\"></i> " + info['title'] + "</span>\n\t\t\t\t\t<div class=\"block_tmp_box\"></div>\n\t\t\t\t</a>\n\t\t\t</div>";
    } else {
      right_html += "\n\t\t\t<div class=\"ace-settings-item\">\n\t\t\t\t<a href=\"javascript:;\" class=\"btn btn-white btn-sm btn-warning\" id=\"block_type_" + info['type'] + "\" data-type=\"" + info['type'] + "\" onclick=\"block_add('" + info['type'] + "', 0);\">\n\t\t\t\t\t<span style=\"display: block; min-width: 90px; text-align: left;\"><i class=\"fa " + info['icon'] + "\"></i> " + info['title'] + "</span>\n\t\t\t\t\t<div class=\"block_tmp_box\"></div>\n\t\t\t\t</a>\n\t\t\t</div>";
    }

    //主模板
    template_html += "\n\t\t<!-- " + info['title'] + "\u6A21\u677F -->\n\t\t<div class=\"" + info['type'] + "_template\">\n\t\t\t<div class=\"form-row show form-group block_info " + info['type'] + "_mainIdx\" id=\"block_info_mainIdx\" data-idx=\"mainIdx\">\n\t\t\t\t<div class=\"hidden_info block_hidden_info\">\n\t\t\t\t\t<input type=\"hidden\" name=\"block_list[mainIdx][sort_id]\" value=\"\">\n\t\t\t\t\t<input type=\"hidden\" name=\"block_list[mainIdx][is_del]\" value=\"0\" class=\"is_del\">\n\t\t\t\t\t<input type=\"hidden\" name=\"block_list[mainIdx][block_type]\" value=\"" + info['type'] + "\" class=\"block_type\">\n\t\t\t\t\t<input type=\"hidden\" name=\"block_list[mainIdx][is_required]\" value=\"0\" class=\"is_required\">\n\t\t\t\t</div>\n\t\t\t\t<div class=\"btn_list\">\n\t\t\t\t\t<button type=\"button\" class=\"btn btn-xs btn-info block_move_btn\">\n\t\t\t\t\t\t<i class=\"ace-icon fa fa-bars bigger-110 icon-only\"></i>\n\t\t\t\t\t</button>\n\t\t\t\t\t<button type=\"button\" class=\"btn btn-xs btn-info serial_number\"></button>\n\t\t\t\t\t<button type=\"button\" class=\"btn btn-xs btn-success\" title=\"" + info['title'] + "\">\n\t\t\t\t\t\t<i class=\"ace-icon fa " + info['icon'] + " bigger-110 icon-only\"></i> " + info['title'] + "\n\t\t\t\t\t</button>";

    //多選題
    if (info['type'] == 'checkbox') {
      template_html += "\n\t\t\t\t\t<label class=\"up_to_items\">\n\t\t\t\t\t\t\u6700\u591A\u53EF\u9078\u64C7 <input type=\"number\" name=\"block_list[mainIdx][block_set]\" class=\"block_set\" placeholder=\"0\" > \u9805\n\t\t\t\t\t</label>";
    }
    template_html += "<div class=\"btn_edit_list\">\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-xs\" title=\"\u8907\u88FD\u5340\u584A\" onclick=\"block_copy('" + info['type'] + "_mainIdx', '" + info['type'] + "');\">\n\t\t\t\t\t\t\t<i class=\"ace-icon fa fa-copy bigger-110 icon-only\"></i> \u8907\u88FD\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-xs\" title=\"\u522A\u9664\u5340\u584A\" onclick=\"block_del('" + info['type'] + "_mainIdx', 'hidden');\">\n\t\t\t\t\t\t\t<i class=\"ace-icon fa fa-trash-o bigger-110 icon-only\"></i> \u522A\u9664\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t";

    //不為標題、分隔線
    if (info['type'] != 'topic' && info['type'] != 'hr') {
      template_html += "<button type=\"button\" class=\"btn btn-xs block_required_btn\" title=\"\u8A2D\u70BA\u5FC5\u586B\" onclick=\"block_required('" + info['type'] + "_mainIdx');\">\n\t\t\t\t\t\t\t<i class=\"ace-icon fa fa-star-o bigger-110 icon-only\"></i> \u5FC5\u586B\n\t\t\t\t\t\t</button>";
    }
    template_html += "</div></div>\n\t\t\t\t<div class=\"block_content\"></div>\n\t\t\t</div>\n\t\t</div>";

    //主內容
    block_content_html.push({
      type: info['type'],
      html: $('.block_' + info['type']).html()
    });

    //項目區塊
    if(info['is_item'] == 1){
      var html = "\n\t\t\t<div class=\"" + info['type'] + "_mainIdx_item_template\">\n\t\t\t\t<div class=\"form-row show form-group block_item_info " + info['type'] + "_mainIdx_item_subIdx\" data-idxx=\"subIdx\">\n\t\t\t\t\t<div class=\"hidden_info block_item_hidden_info\">\n\t\t\t\t\t\t<input type=\"hidden\" name=\"item_list[mainIdx_subIdx][sort_id]\" value=\"\">\n\t\t        \t\t<input type=\"hidden\" name=\"item_list[mainIdx_subIdx][is_del]\" value=\"0\" class=\"is_del\">\n\t\t        \t\t<input type=\"hidden\" name=\"item_list[mainIdx_subIdx][is_other]\" value=\"0\" class=\"is_other\">\n\t\t\t\t\t</div>\n\t\t\t\t\t<div class=\"block_item_content\" style=\"display: inline-block;\"></div>\n\t\t\t\t\t<div class=\"item_btn_list\" style=\"display: inline-block;\">\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-link block_item_move_btn\">\n\t\t\t\t\t\t\t<i class=\"ace-icon fa fa-bars bigger-110 icon-only\"></i>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-link\" title=\"\u522A\u9664\u9078\u9805\" onclick=\"block_item_del('" + info['type'] + "_mainIdx_item', '" + info['type'] + "_mainIdx_item_subIdx', 'hidden');\">\n\t\t\t\t\t\t\t<i class=\"fa fa-minus\"></i>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t\t<button type=\"button\" class=\"btn btn-link\" title=\"\u65B0\u589E\u9078\u9805\" onclick=\"block_item_add('" + info['type'] + "_mainIdx_item');\">\n\t\t\t\t\t\t\t<i class=\"fa fa-plus\"></i>\n\t\t\t\t\t\t</button>\n\t\t\t\t\t</div>\n\t\t\t\t</div>\n\t\t\t</div>";

      //項目模板
      item_template_html.push({
        type: info['type'],
        html: html
      });

      //項目內容
      item_content_html.push($('.block_' + info['type']).find('.block_item_template').html());
    }
  }

  $('#ace-settings-box').find('.pull-left').eq(0).html(left_html + '<div>&nbsp;</div>');
  $('#ace-settings-box').find('.pull-left').eq(1).html(right_html + '<div>&nbsp;</div>');
  $('#template_list').html(template_html);
  $('.block_template').remove();

  //題型按鈕拖曳至目的區塊
  for (var key in block_content_html) {
    var html = block_content_html[key]['html'];
    var type = block_content_html[key]['type'];
    $('#template_list').find('.' + type + '_template').find('.block_content').html(html);
    dragula([document.querySelector('#block_box'), document.querySelector('#block_type_' + type)], {
      moves: function moves(el, source, handle, sibling) {
        if ($(source).attr('id') != 'block_box') {
          return true;
        }
      },
      accepts: function accepts(el, target, source, sibling) {
        if ($(source).attr('id') != 'block_box') {
          return true;
        }
      },
      copy: function copy(el, source) {
        if ($(source).attr('id') != 'block_box') {
          return true;
        }
      },
      removeOnSpill: true
    }).on('drop', function (el, target, source, sibling) {
      if ($(source).attr('id') != 'block_box') {
        var type = $(source).attr('data-type');
        block_add(type, el);
      }
    });
  }

  for (var key in item_template_html) {
    var info = item_template_html[key];

    //模板
    $('#template_list').find('.' + info['type'] + '_template').find('.block_item_template').html(info['html']);

    //內容
    $('#template_list').find('.' + info['type'] + '_template').find('.block_item_content').html(item_content_html[key]);

    //設為其他按鈕
    if (info['type'] == 'radio' || info['type'] == 'checkbox') {
      var html = "\n\t\t\t<button type=\"button\" class=\"btn btn-link block_item_other_btn\" title=\"\u8A2D\u70BA\u5176\u4ED6\u6587\u5B57\u6B04\u4F4D\" onclick=\"block_item_other('" + info['type'] + "_mainIdx_item_subIdx');\">\n\t\t\t\t\u5176\u4ED6\n\t\t\t</button>\n\t\t\t";
      $('#template_list').find('.' + item_template_html[key]['type'] + '_template').find('.item_btn_list').append(html);
    }

    //設定關聯按鈕
    if (info['type'] == 'radio') {
      var html = "\n\t\t\t<button type=\"button\" class=\"btn btn-link block_item_related_btn\" title=\"\u8A2D\u5B9A\u95DC\u806F\" onclick=\"block_item_related('" + info['type'] + "_mainIdx_item_subIdx', 'mainIdx', 'subIdx', 'jump');\">\n\t\t\t\t\u95DC\u806F\n\t\t\t</button>\n\t\t\t";
      $('#template_list').find('.' + item_template_html[key]['type'] + '_template').find('.item_btn_list').append(html);
    }
  }

  //目的區塊內拖曳事件
  dragula([document.querySelector('#block_box')], {
    moves: function moves(el, source, handle, sibling) {
      if (handle.classList.contains('block_move_btn')) {
        return true;
      } else if (handle.classList.contains('fa-bars') && $(handle).parent()[0].classList.contains('block_move_btn')) {
        return true;
      }
    }
  }).on('drop', function (el, target, source, sibling) {
    //取得『請點選或拖曳右方題型！』的提示
    set_block_tips();
  });
}

//顯示換行字符
function nl2br(str, is_xhtml) {
  var breakTag = is_xhtml || typeof is_xhtml === 'undefined' ? '<br />' : '<br>';
  return (str + '').replace(/([^>\r\n]?)(\r\n|\n\r|\r|\n)/g, '$1' + breakTag + '$2');
}

//取代變數
function replace_reg(html, reg, new_str) {
  var re = new RegExp(reg, 'g');
  html = html.replace(re, new_str);
  return html;
}

//新增
function block_add(type, element) {
  var nowIdx = $('#block_box .block_info').size(),
      showNow = $('#block_box .block_info').hasClass('show').length;

  //取得範本HTML
  if ($('.' + type + '_template').length > 0) {
    var html = $('.' + type + '_template').html();
    html = html.replace(/mainIdx/g, nowIdx);

    //產生到指定位置
    if (element != 0) {
      $(element).html(html);
    }
    //新增到 block_box
    else {
      $('#block_box').append(html);
    }

    //數字滑桿
    if (type == 'slider') {
      $('.' + type + '_' + nowIdx).find('.slider_bar').attr({
        'id': 'slider_bar_' + nowIdx
      });
      $('#slider_bar_' + nowIdx).slider({
        value: 40,
        range: "min",
        animate: true
      });
      $('#slider_bar_' + nowIdx).slider('disable');
    }

    //地址
    if (type == 'address') {
      $('.' + type + '_' + nowIdx).find('.twzipcode').attr({
        'id': 'twzipcode_' + nowIdx
      });
      $('.' + type + '_' + nowIdx).find('.address').attr({
        'id': 'address_' + nowIdx
      });
      $('#twzipcode_' + nowIdx).twzipcode({
        'countySel': '',
        'districtSel': '',
        'css': ['county', 'district'],
        'zipcodeIntoDistrict': true
      });
      $('#twzipcode_' + nowIdx).css({
        'display': 'inline-block',
        'width': '300px'
      });
      $('#twzipcode_' + nowIdx).find('select').removeAttr('name').addClass('form-control').css({
        'display': 'inline-block',
        'width': '150px',
        'background': '#EDEDED',
        'color': '#BFBFBF'
      }).attr({
        'disabled': 'disabled'
      });
      $('#twzipcode_' + nowIdx).find('input').removeAttr('name').addClass('form-control');
      $('#address_' + nowIdx).css({
        'display': 'inline-block',
        'width': 'calc(100% - 304px)'
      });
    }

    //取得『請點選或拖曳右方題型！』的提示
    set_block_tips();

    //新增項目
    if ($.inArray(type, item_type_list) != '-1') {
      block_item_add(type + '_' + nowIdx + '_item');
    }
  }
}

//刪除
function block_del(name, type) {
  bootbox.confirm('確定刪除嗎？', function (result) {
    if (result) {
      var sel_idx = $('.' + name).attr('data-idx');
      var main = $('#block_box').find('.radio_jump_info');

      for (var i = 0; i < main.length; i++) {
        var sub = main.eq(i).find('.sel_serial_number');

        for (var j = 0; j < sub.length; j++) {
          var idx = sub.eq(j).attr('data-idx');

          if (idx == sel_idx) {
            sub.eq(j).remove();
          }
        }
      }

      var backRelated = window.sessionStorage.getItem('backRelated[jump]');
      var select_data = new Object();
      var data = new Object();

      if (backRelated !== null) {
        select_data = JSON.parse(backRelated);

        for (var idx in select_data) {
          for (var idxx in select_data[idx]) {
            if (typeof data[idx] === 'undefined') {
              data[idx] = new Object();
            }

            if (idx != sel_idx) {
              data[idx] = select_data[idx];
            } else {
              if (select_data[idx][idxx] != sel_idx) {
                if (typeof data[idx][idxx] === 'undefined') {
                  data[idx][idxx] = new Object();
                }

                data[idx][idxx] = select_data[idx][idxx];
              }
            }
          }
        }
      }

      window.sessionStorage.setItem('backRelated[jump]', JSON.stringify(data));

      if (type == 'remove') {
        $('.' + name).remove();
      } else {
        $('.' + name).addClass('d-none');
        $('.' + name).removeClass('show');
        $('.' + name).find('.is_del').val(1);
      }

      //取得『請點選或拖曳右方題型！』的提示
      set_block_tips();
    }
  });
}

//複製
function block_copy(name, type) {
  var sourceIdx = name.replace(type + '_', '');
  var nowIdx = $('#block_box .block_info').size(),
      showNow = $('#block_box .block_info').hasClass('show').length;

  //取得範本HTML
  var html = $('.' + name).html();
  html = replace_reg(html, 'block_list\\[' + sourceIdx + '\\]', 'block_list[' + nowIdx + ']');
  html = replace_reg(html, type + '_' + sourceIdx, type + '_' + nowIdx);
  html = replace_reg(html, '\\[' + sourceIdx + '_subIdx\\]', '[' + nowIdx + '_subIdx]');

  if (type == 'radio') {
    html = replace_reg(html, 'customRadio_' + sourceIdx, 'customRadio_' + nowIdx);
  } else if (type == 'checkbox') {
    html = replace_reg(html, 'customCheckbox_' + sourceIdx, 'customCheckbox_' + nowIdx);
  } else if (type == 'slider') {
    html = replace_reg(html, 'slider_bar_' + sourceIdx, 'slider_bar_' + nowIdx);
  }

  var insert_html = '<div class="form-row show form-group block_info ' + type + '_' + nowIdx + '" id="block_info_' + nowIdx + '" data-idx="' + nowIdx + '">' + html + '</div>';
  $('#block_box').append(insert_html);

  //取得『請點選或拖曳右方題型！』的提示
  set_block_tips();

  //處理項目
  var name = type + '_' + nowIdx + '_item';
  $('.' + type + '_' + nowIdx).find('.block_item_list').attr('id', name + '_list');
  $('.' + type + '_' + nowIdx).find('.block_id').remove();
  $('.' + type + '_' + nowIdx).find('.block_item_id').remove();
  $('.' + type + '_' + nowIdx).find('.block_item_template').find('.block_item_related_btn').removeAttr('onclick').attr('onclick', 'block_item_related(\'' + name + '_subIdx\', \'' + nowIdx + '\', \'subIdx\', \'jump\');');
  var element = $('#' + name + '_list');
  var html = element.html();

  if (element.find('.block_item_info').length > 0) {
    for (var i = 0; i < element.find('.block_item_info').length; i++) {
      html = replace_reg(html, '\\[' + sourceIdx + '_' + i + '\\]', '[' + nowIdx + '_' + i + ']');
    }
    element.html(html);

    for (var i = 0; i < element.find('.block_item_info').length; i++) {
      element.find('.block_item_info').eq(i).find('.block_item_related_btn').removeAttr('onclick').attr('onclick', 'block_item_related(\'' + name + '_' + i + '\', \'' + nowIdx + '\', \'' + i + '\', \'jump\');');
    }

    //處理項目內容
    for (var i = 0; i < element.find('.block_item_info').length; i++) {
      $('[name="item_list[' + nowIdx + '_' + i + '][sort_id]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][sort_id]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][is_del]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][is_del]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][is_other]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][is_other]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][item_content]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][item_content]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][item_min]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][item_min]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][item_max]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][item_max]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][item_unit]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][item_unit]"]').val());
    }
  } else {
    if (type != 'text' && type != 'textarea') {
      html = element.parents('.block_content').html();
      html = replace_reg(html, '\\[' + sourceIdx + '_0\\]', '[' + nowIdx + '_0]');
      element.parents('.block_content').html(html);
      var i = 0;
      $('[name="item_list[' + nowIdx + '_' + i + '][sort_id]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][sort_id]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][is_del]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][is_del]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][is_other]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][is_other]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][item_content]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][item_content]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][item_min]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][item_min]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][item_max]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][item_max]"]').val());
      $('[name="item_list[' + nowIdx + '_' + i + '][item_unit]"]').val($('[name="item_list[' + sourceIdx + '_' + i + '][item_unit]"]').val());
    }
  }

  element.find('.radio_jump_info').remove();
  $('[name="block_list[' + nowIdx + '][sort_id]"]').val($('[name="block_list[' + sourceIdx + '][sort_id]"]').val());
  $('[name="block_list[' + nowIdx + '][is_del]"]').val($('[name="block_list[' + sourceIdx + '][is_del]"]').val());
  $('[name="block_list[' + nowIdx + '][is_required]"]').val($('[name="block_list[' + sourceIdx + '][is_required]"]').val());
  $('[name="block_list[' + nowIdx + '][block_name]"]').val($('[name="block_list[' + sourceIdx + '][block_name]"]').val());
  $('[name="block_list[' + nowIdx + '][block_description]"]').val($('[name="block_list[' + sourceIdx + '][block_description]"]').val());

  //拖曳事件
  if (typeof dragulaItem[name] !== 'undefined') {
    dragulaItem[name].destroy();
  }

  dragulaItem[name] = dragula([document.querySelector('#' + name + '_list')], {
    moves: function moves(el, source, handle, sibling) {
      if (handle.classList.contains('block_item_move_btn')) {
        return true;
      } else if (handle.classList.contains('fa-bars') && $(handle).parent()[0].classList.contains('block_item_move_btn')) {
        return true;
      }
    }
  });
}

//設為必填
function block_required(name) {
  if ($('.' + name).find('.is_required').val() == 0) {
    $('.' + name).find('.is_required').val(1);
    $('.' + name).find('.block_required_btn').addClass('btn-danger');
  } else {
    $('.' + name).find('.is_required').val(0);
    $('.' + name).find('.block_required_btn').removeClass('btn-danger');
  }
}

//取得『請點選或拖曳右方題型！』的提示
function set_block_tips() {
  var count = 0;
  var number = 0;
  for (var i = 0; i < $('#block_box').find('.block_info').length; i++) {
    if ($('#block_box').find('.block_info').eq(i).hasClass('show')) {
      count++;
      var block_type = $('#block_box').find('.block_info').eq(i).find('.block_type').val();

      if (block_type != 'topic' && block_type != 'hr') {
        number++;

        //設置題號
        var number_label = (number < 10 ? '0' : '') + number;
        $('#block_box').find('.block_info').eq(i).find('.serial_number').html(number_label);
      }
    }
  }

  if (count == 0) {
    $('#block_tips').show();
  } else {
    $('#block_tips').hide();
  }

  //取得關聯選取項
  var main = $('#block_box').find('.radio_jump_info');
  for (var i = 0; i < main.length; i++) {
    var idx = main.eq(i).parents('.block_item_info').parents('.block_info').attr('data-idx');
    var idxx = main.eq(i).parents('.block_item_info').attr('data-idxx');
    var type = main.eq(i).parents('.block_item_info').parents('.block_info').find('.block_type').val();
    var name = type + '_' + idx + '_item_' + idxx;
    var sub = main.eq(i).find('.sel_serial_number');
    var count = 0;
    var html = '';

    for (var j = 0; j < sub.length; j++) {
      var sel_idx = sub.eq(j).attr('data-idx');
      count++;
      html += show_raduo_jump(name, count, sel_idx);
    }

    if (html != '') {
      //main.eq(i).html('跳至 # '+html);
      main.eq(i).html('作答後，顯示 ' + html);
    } else {
      main.eq(i).remove();
    }
  }
}
// ------------------------------------------------------------------------
//項目新增
function block_item_add(name) {
  var nowIdx = $('#' + name + '_list .block_item_info').size(),
      showNow = $('#' + name + '_list .show').size();

  //取得範本HTML
  if ($('.' + name + '_template').length > 0) {
    var html = $('.' + name + '_template').html();
    html = html.replace(/subIdx/g, nowIdx);
    $('#' + name + '_list').append(html);

    //拖曳事件
    if (typeof dragulaItem[name] !== 'undefined') {
      dragulaItem[name].destroy();
    }

    dragulaItem[name] = dragula([document.querySelector('#' + name + '_list')], {
      moves: function moves(el, source, handle, sibling) {
        if (handle.classList.contains('block_item_move_btn')) {
          return true;
        } else if (handle.classList.contains('fa-bars') && $(handle).parent()[0].classList.contains('block_item_move_btn')) {
          return true;
        }
      }
    });
  }
}

//項目刪除
function block_item_del(main, name, type) {
  if ($('#' + main + '_list .show').size() > 1) {
    if ($('.' + name).find('.radio_jump_info').length > 0) {
      var sel_idx = $('.' + name).find('.radio_jump_info').attr('data-idx');
      var sel_idxx = $('.' + name).find('.radio_jump_info').attr('data-idxx');

      //清除關聯選取記錄
      clear_block_item_related('jump', sel_idx, sel_idxx);
    }

    $('#' + main + '_list .show').find('.item_content').removeAttr('required');

    if (type == 'remove') {
      $('.' + name).remove();
    } else {
      $('.' + name).addClass('d-none');
      $('.' + name).removeClass('show');
      $('.' + name).find('.is_del').val(1);
    }
  }
}

//項目設為其他
function block_item_other(name) {
  if ($('.' + name).find('.is_other').val() == 0) {
    $('.' + name).find('.is_other').val(1);
    $('.' + name).find('.item_content').attr({
      'disabled': 'disabled',
      'placeholder': '作答者自行輸入…',
      'data-tmp': $('.' + name).find('.item_content').val()
    }).val('');
  } else {
    $('.' + name).find('.is_other').val(0);
    $('.' + name).find('.item_content').removeAttr('disabled').attr('placeholder', '選項內容').val($('.' + name).find('.item_content').attr('data-tmp')).removeAttr('data-tmp');
  }
}

//項目設定關聯
function block_item_related(name, idx, idxx, related_type) {
  //記錄關聯類型
  $('#set_item_related_btn').attr({
    'data-name': name,
    'data-idx': idx,
    'data-idxx': idxx,
    'data-related_type': related_type
  });

  //題號
  var serial_number = $('.' + name).parents('.block_info').find('.serial_number').html();

  //題號 (數字型態)
  var sel_serial_number = parseInt(serial_number);

  //區塊標題
  var block_title = $('.' + name).parents('.block_content').find('.block_name').val();

  //選項標題
  var item_title = $('.' + name).find('.item_content').val();

  //Modal 標題
  var title = serial_number + '. ' + block_title; //題號+區塊標題

  //選取區塊 >> 選項
  title += "\n\t<small style=\"margin: 0 6px; font-size: 16px; font-weight: normal; color: #8089a0;\">\n\t\t<i class=\"ace-icon fa fa-angle-double-right\"></i> " + item_title + "\n\t</small>";
  $('#set_item_related_title').html(title);

  //根據關聯類型處理
  var related_info = {
    title: '', //選取事件說明
    action: '', //執行事件
    close_txt: '', //關閉按鈕文字
  };

  if (related_type == 'jump') {
    related_info = {
      title: '設定作答後，欲顯示的題目（可複選）',//'請選擇要跳至的題目',
      action: 'set_radio_jump(\'' + name + '\',' + idx + ',' + idxx + ');',
      close_txt: '取消設定'
    };
  }

  //列出除了被選取區塊之外的所有區塊
  var block_html = '';
  var count = 0;
  var number = 0;
  var list = new Array();

  for (var i = 0; i < $('#block_box').find('.block_info').length; i++) {
    var element = $('#block_box').find('.block_info').eq(i);

    if (element.hasClass('show')) {
      count++;
      var block_idx = element.attr('data-idx');
      var block_type = element.find('.block_type').val();
      var block_name = element.find('.block_name').val();
      block_name = typeof block_name !== 'undefined' ? block_name : '<b>分隔線</b>';
      list.push(block_idx);

      if (block_type != 'topic' && block_type != 'hr') {
        number++;

        if (sel_serial_number != number) {
          //設置題號
          var number_label = (number < 10 ? '0' : '') + number;
          block_html += "\n\t\t\t\t\t<div class=\"item_related_row\">\n\t\t\t\t\t\t<input type=\"checkbox\" class=\"custom-control-input\" id=\"radio_related_" + block_idx + "\" name=\"radio_related[]\" value=\"" + block_idx + "\" onchange=\"" + related_info['action'] + "\">\n\t\t\t\t\t\t<label for=\"radio_related_" + block_idx + "\">\n\t\t\t\t\t\t\t<span class=\"item_related_no\">" + number_label + "</span>\n\t\t\t\t\t\t\t<span class=\"item_related_name\">" + block_name + "</span>\n\t\t\t\t\t\t\t<i class=\"fa fa-check\"></i>\n\t\t\t\t\t\t</label>\n\t\t\t\t\t</div>";
        }
      }
    }
  }

  //Modal 內容
  var content = "<div class=\"item_related_table\">\n\t<div class=\"item_related_row\"><div class=\"item_related_no\">#</div><div class=\"item_related_name\">" + related_info['title'] + "</div></div>\n\t" + block_html + "</div>";
  $('#set_item_related_content').html(content);

  //取出選取過的資料
  if (window.sessionStorage) {
    var backRelated = window.sessionStorage.getItem('backRelated[' + related_type + ']');
    var select_data = new Object();

    if (backRelated !== null) {
      select_data = JSON.parse(backRelated);
    }

    if (typeof select_data[idx] !== 'undefined') {
      if (typeof select_data[idx][idxx] !== 'undefined') {
        for (var key in list) {
          if ($.inArray(String(list[key]), select_data[idx][idxx]) != -1) {
            is_chk = 1;
            $('#radio_related_' + list[key]).prop('checked', true);
          }
        }
      }
    }
  }

  //Modal 關閉按紐
  $('#set_item_related_close_btn').html(related_info['close_txt']).unbind().on('click', function () {
    var name = $('#set_item_related_btn').attr('data-name');
    var sel_idx = $('#set_item_related_btn').attr('data-idx');
    var sel_idxx = $('#set_item_related_btn').attr('data-idxx');
    var related_type = $('#set_item_related_btn').attr('data-related_type');

    //清除關聯選取記錄
    clear_block_item_related(related_type, sel_idx, sel_idxx);

    //取消關聯選取項
    if ($('.' + name).find('.radio_jump_info').length > 0) {
      $('.' + name).find('.radio_jump_info').remove(); //$('[name="radio_related"]').prop('checked',false);

      $('[name="radio_related[]"]').prop('checked', false);
    }

    $('#relatedModalClose').click();
  });

  //讓Model出現在畫面上
  $('#set_item_related_btn').click();
}

//清除關聯選取記錄
function clear_block_item_related(related_type, sel_idx, sel_idxx) {
  var backRelated = window.sessionStorage.getItem('backRelated[' + related_type + ']');
  var select_data = new Object();
  var data = new Object();

  if (backRelated !== null) {
    select_data = JSON.parse(backRelated);

    for (var idx in select_data) {
      for (var idxx in select_data[idx]) {
        if (typeof data[idx] === 'undefined') {
          data[idx] = new Object();
        }

        if (idx != sel_idx) {
          data[idx] = select_data[idx];
        } else {
          if (idxx != sel_idxx) {
            if (typeof data[idx][idxx] === 'undefined') {
              data[idx][idxx] = new Object();
            }

            data[idx][idxx] = select_data[idx][idxx];
          }
        }
      }
    }
  }

  window.sessionStorage.setItem('backRelated[' + related_type + ']', JSON.stringify(data));
}
// ------------------------------------------------------------------------
//單選題設定關聯
function set_radio_jump(name, idx, idxx) {
  var list = new Array();
  var sel_idx = '';

  //var sel_element = $('[name="radio_related"]');
  var sel_element = $('[name="radio_related[]"]');
  var count = 0;
  var html = '';
  $('.' + name).find('.radio_jump_info').remove();

  for (var i = 0; i < sel_element.length; i++) {
    if (sel_element.eq(i).prop('checked')) {
      //取得選取的關聯選項 idx
      sel_idx = sel_element.eq(i).val();
      list.push(sel_idx);
      count++;
      html += show_raduo_jump(name, count, sel_idx);
    }
  }

  if (html != '') {
    //$('.'+name).append('<div class="radio_jump_info" data-idx="'+idx+'" data-idxx="'+idxx+'">跳至 # '+html+'</div>');
    $('.' + name).append('<div class="radio_jump_info" data-idx="' + idx + '" data-idxx="' + idxx + '">作答後，顯示 ' + html + '</div>');
  }

  //儲存關聯選取項
  if (window.sessionStorage) {
    var backRelated = window.sessionStorage.getItem('backRelated[jump]');
    var data = new Object();

    if (backRelated !== null) {
      data = JSON.parse(backRelated);
    }

    if (typeof data[idx] === 'undefined') {
      data[idx] = new Object();
    }

    if (typeof data[idx][idxx] === 'undefined') {
      data[idx][idxx] = new Object();
    }

    data[idx][idxx] = list;
    window.sessionStorage.setItem('backRelated[jump]', JSON.stringify(data));
  }
}

//產生關聯選取項題號
function show_raduo_jump(name, count, idx) {
  var html = '';

  if (count > 1) {
    html += '、';
  }

  var serial_number = $('#block_info_' + idx).find('.serial_number').html();

  //題號
  html += '<span class="sel_serial_number" data-idx="' + idx + '">' + serial_number + '</span>';

  return html;
}
// ------------------------------------------------------------------------
//代入編輯資料
function get_block_data(block_json) {
  var block_list = JSON.parse(block_json);
  var related_data = new Object();
  var idx = 0;

  for (var nowIdx in block_list) {
    idx++;
    var type = block_list[nowIdx]['block_type'];
    block_add(type, 0);
    $('.' + type + '_' + nowIdx).find('.block_hidden_info').append('<input type="hidden" name="block_list[' + nowIdx + '][id]" class="block_id" value="">');

    if ($.inArray(type, item_type_list) != '-1') {
      for (var nowIdxx in block_list[nowIdx]['item_list']) {
        if (nowIdxx > 0) {
          block_item_add(type + '_' + nowIdx + '_item');
        }

        $('.' + type + '_' + nowIdx + '_item_' + nowIdxx).find('.block_item_hidden_info').append('<input type="hidden" name="item_list[' + nowIdx + '_' + nowIdxx + '][id]" class="block_item_id" value="">');
      }
    } else {
      if (type == 'slider' || type == 'star') {
        var nowIdxx = 0;
        $('#' + type + '_' + nowIdx + '_item_list').find('.block_item_hidden_info').append('<input type="hidden" name="item_list[' + nowIdx + '_' + nowIdxx + '][id]" class="block_item_id" value="">');
      }
    }

    var info = block_list[nowIdx];
    $('[name="block_list[' + nowIdx + '][id]"]').val(info['id']);
    $('[name="block_list[' + nowIdx + '][sort_id]"]').val(info['sort_id']);
    $('[name="block_list[' + nowIdx + '][is_del]"]').val(0);

    if (info['is_required'] == 1) {
      block_required(type + '_' + nowIdx);
    }
    $('[name="block_list[' + nowIdx + '][block_name]"]').val(info['block_name']);
    $('[name="block_list[' + nowIdx + '][block_description]"]').val(decodeURIComponent(info['block_description']));
    $('[name="block_list[' + nowIdx + '][block_set]"]').val(info['block_set']);
    var idxx = 0;

    for (var i in block_list[nowIdx]['item_list']) {
      idxx++;
      var value = block_list[nowIdx]['item_list'][i];
      $('[name="item_list[' + nowIdx + '_' + i + '][id]"]').val(value['id']);
      $('[name="item_list[' + nowIdx + '_' + i + '][sort_id]"]').val(value['sort_id']);
      $('[name="item_list[' + nowIdx + '_' + i + '][is_del]"]').val(0);

      if (value['is_other'] == 1) {
        block_item_other(type + '_' + nowIdx + '_item_' + i);
      }

      $('[name="item_list[' + nowIdx + '_' + i + '][item_content]"]').val(value['item_content']);
      $('[name="item_list[' + nowIdx + '_' + i + '][item_min]"]').val(value['item_min']);
      $('[name="item_list[' + nowIdx + '_' + i + '][item_max]"]').val(value['item_max']);
      $('[name="item_list[' + nowIdx + '_' + i + '][item_unit]"]').val(value['item_unit']);

      if (type == 'radio') {
        if (value['related_list'] !== null) {
          var related_list = Array.isArray(value['related_list'])?value['related_list']:value['related_list'].split(',');

          if (typeof related_data[nowIdx] === 'undefined') {
            related_data[nowIdx] = new Object();
          }

          if (typeof related_data[nowIdx][i] === 'undefined') {
            related_data[nowIdx][i] = new Object();
          }

          related_data[nowIdx][i] = related_list;
          window.sessionStorage.setItem('backRelated[jump]', JSON.stringify(related_data));

          //顯示關聯選取項
          var name = type + '_' + nowIdx + '_item_' + i;
          var count = 0;
          var html = '';

          for (var key in related_list) {
            count++;
            html += show_raduo_jump(name, count, related_list[key]);
          }

          if (html != '') {
            //$('.'+name).append('<div class="radio_jump_info" data-idx="'+nowIdx+'" data-idxx="'+i+'">跳至 # '+html+'</div>');
            $('.' + name).append('<div class="radio_jump_info" data-idx="' + nowIdx + '" data-idxx="' + i + '">作答後，顯示 ' + html + '</div>');
          }
        }
      }
    }
  }

  //取得『請點選或拖曳右方題型！』的提示
  set_block_tips();
}
// ------------------------------------------------------------------------
//加入驗證
function validation_add() {
  for (var i = 0; i < $('#block_box').find('.block_info').length; i++) {
    var main = $('#block_box').find('.block_info').eq(i);
    var type = main.find('.block_type').val();

    if (type != 'hr') {
      var block_name = main.find('.block_name').attr('name');

      if (main.hasClass('show')) {
        $('[name="' + block_name + '"]').rules('add', 'required');

        if ($.inArray(type, item_type_list) != '-1') {
          for (var j = 0; j < main.find('.block_item_list').find('.block_item_info').length; j++) {
            var sub = main.find('.block_item_list').find('.block_item_info').eq(j);
            var ipt_name = sub.find('.item_content').attr('name');

            if (sub.hasClass('show')) {
              $('[name="' + ipt_name + '"]').rules('add', 'required');
            } else {
              $('[name="' + ipt_name + '"]').rules('remove', 'required');
            }
          }
        } else if (type == 'slider') {
          var ipt_name = main.find('.item_min').attr('name');
          $('[name="' + ipt_name + '"]').rules('add', 'required');
          var ipt_name = main.find('.item_max').attr('name');
          $('[name="' + ipt_name + '"]').rules('add', 'required');
          var ipt_name = main.find('.item_unit').attr('name');
          $('[name="' + ipt_name + '"]').rules('add', 'required');
        } else if (type == 'star') {
          var ipt_name = main.find('.item_max').attr('name');
          $('[name="' + ipt_name + '"]').rules('add', 'required');
        }
      } else {
        $('[name="' + block_name + '"]').rules('remove', 'required');

        for (var j = 0; j < main.find('.item_content').length; j++) {
          var ipt_name = main.find('.item_content').eq(j).attr('name');
          $('[name="' + ipt_name + '"]').rules('remove', 'required');
        }

        for (var j = 0; j < main.find('.item_min').length; j++) {
          var ipt_name = main.find('.item_min').eq(j).attr('name');
          $('[name="' + ipt_name + '"]').rules('remove', 'required');
        }

        for (var j = 0; j < main.find('.item_max').length; j++) {
          var ipt_name = main.find('.item_max').eq(j).attr('name');
          $('[name="' + ipt_name + '"]').rules('remove', 'required');
        }

        for (var j = 0; j < main.find('.item_unit').length; j++) {
          var ipt_name = main.find('.item_unit').eq(j).attr('name');
          $('[name="' + ipt_name + '"]').rules('remove', 'required');
        }
      }
    }
  }
}
// ------------------------------------------------------------------------
//顯示預覽
function get_preview() {
  var is_serial_number = 0;

  if (window.sessionStorage) {
    is_serial_number = window.sessionStorage.getItem('backSerialNumber');
  }

  //清空預覽區塊
  $('#preview_box').html('');
  var count = 0;
  var number = 0;

  for (var i = 0; i < $('#block_box').find('.block_info').length; i++) {
    if ($('#block_box').find('.block_info').eq(i).hasClass('show')) {
      count++;
      var html = '';
      var element = $('#block_box').find('.block_info').eq(i);
      var idx = element.attr('data-idx');
      var main_key = 'block_' + idx;
      var type = element.find('.block_type').val();
      //標題
      var title = element.find('.block_name').val();
      //描述
      var description = element.find('.block_description').val();
      //設定
      var set = element.find('.block_set').val();
      //必填
      var is_required = element.find('.is_required').val();
      //分隔線
      if (type == 'hr') {
        html += '<hr>';
      }
      //標題描述
      else if (type == 'topic') {
          html += '<div class="page_title"><h2><b>' + title + '</b></h2><p>' + nl2br(description) + '</p></div>';
        } else {
          number++;
          var number_label = (number < 10 ? '0' : '') + number;

          //題目
          var question = "\n\t\t\t\t<div class=\"title\">\n\t\t\t\t\t<h4>" + (is_serial_number == 1 ? '<span>' + number_label + '</span>. ' : '') + "<b>" + title + "</b>" + (is_required == 1 ? '&nbsp;<i class="fa red">*</i>' : '');

          //多選題
          if (type == 'checkbox' && set != '') {
            question += "<span style=\"margin-left: 5px; font-size: 12px;\">\u6700\u591A\u53EF\u9078\u64C7 " + set + " \u9805</span>";
          }

          question += "</h4></div>";

          //內容
          var content = '';

          //單選題, 多選題, 下拉選單, 項目排序
          if ($.inArray(type, item_type_list) != '-1') {
            var item_html = '';
            var option_item = left_item = right_item = '';

            for (var j = 0; j < element.find('.block_item_list').find('.block_item_info').length; j++) {
              if (element.find('.block_item_list').find('.block_item_info').eq(j).hasClass('show')) {
                var item_element = element.find('.block_item_list').find('.block_item_info').eq(j);
                var idxx = item_element.attr('data-idxx');
                var sub_key = main_key + '_item_' + idxx;
                //選項
                var option = item_element.find('.item_content').val();
                //設為其他
                var is_other = item_element.find('.is_other').val();
                //單選題
                if (type == 'radio') {
                  item_html += "\n\t\t\t\t\t\t\t\t<div class=\"radio custom-radio\">\n\t\t\t\t\t\t\t\t\t<div class=\"custom-control custom-radio\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"radio\" class=\"custom-control-input\" id=\"" + sub_key + "\" name=\"" + main_key + "\" value=\"" + idxx + "\" onchange=\"preview_radio_jump(" + count + ", " + idx + ", " + idxx + ");\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"custom-control-label\" for=\"" + sub_key + "\"> " + (is_other == 1 ? '其他，<input type="text" class="form-control" placeholder="作答者自行輸入…" />' : option) + "</label>";
                  item_html += "</div>\n\t\t\t\t\t\t\t\t</div>";
                }
                //多選題
                if (type == 'checkbox') {
                  item_html += "\n\t\t\t\t\t\t\t\t<div class=\"checkbox custom-checkbox\">\n\t\t\t\t\t\t\t\t\t<div class=\"custom-control custom-checkbox\">\n\t\t\t\t\t\t\t\t\t\t<input type=\"checkbox\" class=\"custom-control-input\" id=\"" + sub_key + "\" name=\"" + main_key + "[]\" value=\"" + idxx + "\">\n\t\t\t\t\t\t\t\t\t\t<label class=\"custom-control-label\" for=\"" + sub_key + "\">  " + (is_other == 1 ? '其他，<input type="text" class="form-control" placeholder="作答者自行輸入…" />' : option) + "</label>\n\t\t\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t\t</div>";
                }
                //下拉選單
                if (type == 'select') {
                  option_item += '<option value="' + idxx + '">' + option + '</option>';
                }
                //項目排序
                if (type == 'itemsort') {
                  left_item += '<div style="border: 1px solid #ced4da;">' + (idxx < 10 ? '0' : '') + idxx + '</div>';
                  right_item += '<div class="itemsort_info" style="border: 1px dotted #D4D4D4; padding-left: 5px; cursor: move;"><input type="hidden" name="' + main_key + '[]" value="' + idxx + '">' + option + '</div>';
                }
              }
            }
            //下拉選單
            if (type == 'select') {
              item_html += "\n\t\t\t\t\t\t<select name=\"" + main_key + "\" class=\"form-control\">\n\t\t\t\t\t\t\t<option value=\"\">\u8ACB\u9078\u64C7</option>" + option_item + "\n\t\t\t\t\t\t</select>";
            }
            //項目排序
            if (type == 'itemsort') {
              item_html += "\n\t\t\t\t\t\t<div class=\"itemsort\" data-name=\"" + main_key + "\">\n\t\t\t\t\t\t\t<div style=\"float: left; line-height: 30px; width: 25px; text-align: center;\">" + left_item + "</div>\n\t\t\t\t\t\t\t<div style=\"float: left; line-height: 30px; width: calc(100% - 25px);\" class=\"itemsort_list\" id=\"itemsort_list_" + main_key + "\">" + right_item + "</div>\n\t\t\t\t\t\t\t<div style=\"clear: both;\"></div>\n\t\t\t\t\t\t</div>";
            }
            content += item_html;
          } else {
            //單行文字
            if (type == 'text') {
              content += '<p><input type="text" name="' + main_key + '" class="form-control" /></p>';
            }
            //多行文字
            if (type == 'textarea') {
              content += '<p><textarea name="' + main_key + '" rows="5" class="form-control"></textarea></p>';
            }
            //數字滑桿
            if (type == 'slider') {
              var slider_min = element.find('.item_min').val();
              var slider_max = element.find('.item_max').val();
              var slider_step = element.find('.item_unit').val() != '' ? element.find('.item_unit').val() : 1;
              content += "\n\t\t\t\t\t\t<div class=\"slider\" data-name=\"" + main_key + "\">\n\t\t\t\t\t\t\t<input type=\"number\" name=\"" + main_key + "\" min=\"" + slider_min + "\" max=\"" + slider_max + "\" step=\"" + slider_step + "\" value=\"" + slider_min + "\" style=\"display: none;\" />\n\t\t\t\t\t\t\t<div class=\"slider_bar\" id=\"slider_bar_" + main_key + "\" data-name=\"" + main_key + "\" data-min=\"" + slider_min + "\" data-max=\"" + slider_max + "\" data-step=\"" + slider_step + "\"></div>\n\t\t\t\t\t\t\t<div>\n\t\t\t\t\t\t\t\t<span style=\"float: left;\">" + slider_min + "</span>\n\t\t\t\t\t\t\t\t<span style=\"float: right;\">" + slider_max + "</span>\n\t\t\t\t\t\t\t\t<div style=\"clear: both;\"></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>";
            }
            //星級評分
            if (type == 'star') {
              var star_count = element.find('.item_max').val();
              var is_half = element.find('.item_unit').val() == 1 ? false : true;
              content += "\n\t\t\t\t\t\t<div class=\"star\" data-name=\"" + main_key + "\" data-star_count=\"" + star_count + "\" data-is_half=\"" + is_half + "\">\n\t\t\t\t\t\t\t<div class=\"rating\" id=\"rating_" + main_key + "\"></div>\n\t\t\t\t\t\t</div>";
            }
            //數字框
            if (type == 'number') {
              var number_min = parseInt(element.find('.item_min').val());
              var number_max = parseInt(element.find('.item_max').val());
              var number_unit = element.find('.item_unit').val();
              content += "\n\t\t\t\t\t\t<p>\n\t\t\t\t\t\t\t<input type=\"number\" name=\"" + main_key + "\" class=\"form-control\" min=\"" + number_min + "\" max=\"" + number_max + "\" style=\"display: inline-block; width: 100px;\" />\n\t\t\t\t\t\t\t<span style=\"display: inline-block;\">" + number_unit + "</span>\n\t\t\t\t\t\t</p>";
            }
            //日期
            if (type == 'date') {
              content += '<p><input type="text" name="' + main_key + '" class="form-control datepicker" placeholder="yyyy/mm/dd" /></p>';
            }
            //時間
            if (type == 'time') {
              content += '<p><input type="text" name="' + main_key + '" class="form-control timepicker" placeholder="hh:mm:ss" /></p>';
            }
            //電子郵件
            if (type == 'email') {
              content += '<p><input type="email" name="' + main_key + '" class="form-control" placeholder="example@email.com" /></p>';
            }
            //行動電話
            if (type == 'phone') {
              content += '<p><input type="text" name="' + main_key + '" class="form-control" placeholder="0987-654321" /></p>';
            }
            //市內電話
            if (type == 'tel') {
              content += '<p><input type="text" name="' + main_key + '" class="form-control" placeholder="(04)24522419" /></p>';
            }
            //地址
            if (type == 'address') {
              content += "\n\t\t\t\t\t\t<div class=\"twzipcode\" id=\"twzipcode_" + main_key + "\">\n\t\t\t\t\t\t\t<div data-role=\"zipcode\" data-name=\"" + main_key + "[zipcode]\" data-style=\"form-control\">\n                            </div>\n                            <div data-role=\"county\" data-name=\"" + main_key + "[city_name]\" data-style=\"form-control\">\n                            </div>\n                            <div data-role=\"district\" data-name=\"" + main_key + "[area_name]\" data-style=\"form-control\">\n                            </div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class=\"address\" id=\"address_" + main_key + "\" data-name=\"" + main_key + "\">\n\t\t\t\t\t\t\t<input type=\"text\" name=\"" + main_key + "[address]\" class=\"form-control\" placeholder=\"\u5730\u5740\" />\n\t\t\t\t\t\t</div>";
            }
            //網址
            if (type == 'url_link') {
              content += '<p><input type="url" name="' + main_key + '" class="form-control" placeholder="https://" /></p>';
            }
          }
          html += question + content;
        }
      $('#preview_box').append('<div class="preview_info" id="preview_info' + idx + '" data-idx="' + idx + '" data-count="' + count + '" data-key="' + idx + '">' + html + '</div>');
    }
  }
  //項目排序
  if ($('#preview_box').find('.itemsort').length > 0) {
    for (var i = 0; i < $('#preview_box').find('.itemsort').length; i++) {
      var main_key = $('#preview_box').find('.itemsort').eq(i).attr('data-name');
      dragula([document.querySelector('#itemsort_list_' + main_key)]);
    }
  }
  //數字滑桿
  if ($('#preview_box').find('.slider').length > 0) {
    for (var i = 0; i < $('#preview_box').find('.slider').length; i++) {
      var main_key = $('#preview_box').find('.slider').eq(i).attr('data-name');
      //定義滑桿選擇器
      var slider_element = $('#slider_bar_' + main_key);
      slider_element.slider({
        value: slider_element.data('min'),
        min: slider_element.data('min'),
        max: slider_element.data('max'),
        step: slider_element.data('step'),
        range: "min",
        animate: true,
        create: function create() {
          var value = $(this).slider('value');
          $(this).find('.ui-slider-handle').attr({
            'title': value
          });
        },
        slide: function slide(event, ui) {
          var value = ui.value;
          $(this).find('.ui-slider-handle').attr({
            'title': value
          });
          $('input[name="' + $(this).data('name') + '"]').val(value);
        }
      });
    }
  }
  //星級評分
  if ($('#preview_box').find('.star').length > 0) {
    for (var i = 0; i < $('#preview_box').find('.star').length; i++) {
      var main_key = $('#preview_box').find('.star').eq(i).attr('data-name');
      var star_count = $('#preview_box').find('.star').eq(i).attr('data-star_count');
      var is_half = $('#preview_box').find('.star').eq(i).attr('data-is_half');
      var hints_list = new Array();

      for (var j = 0; j < star_count; j++) {
        hints_list[j] = '';
      }

      //定義星級選擇器
      $('#rating_' + main_key).raty({
        title: main_key,
        number: star_count,
        hints: hints_list,
        scoreName: main_key,
        half: is_half,
        cancel: false,
        cancelPlace: 'right',
        starType: 'i',
        targetText: '請選擇'
      });
    }
  }
  //日期
  if ($('#preview_box').find('.datepicker').length > 0) {
    //定義日期選擇器
    $('#preview_box').find('.datepicker').datepicker({
      autoclose: true, // 自動關閉
      todayHighlight: true, // 今天高亮
      format: 'yyyy/mm/dd', // 日期格式
    });
  }
  //時間
  if ($('#preview_box').find('.timepicker').length > 0) {
    //定義時間選擇器
    $('#preview_box').find('.timepicker').datetimepicker({
      format: 'HH:mm:ss'
    });
  }
  //地址
  if ($('#preview_box').find('.address').length > 0) {
    for (var i = 0; i < $('#preview_box').find('.address').length; i++) {
      var main_key = $('#preview_box').find('.address').eq(i).attr('data-name');
      $('#twzipcode_' + main_key).twzipcode({
        'readonly': true,
        'zipcodeIntoDistrict': true
      });
      $('#twzipcode_' + main_key).find('input[type="text"]').eq(0).parent().addClass('d-none');
      $('#address_' + main_key).css({
        'display': 'inline-block',
        'width': 'calc(100% - ' + $('#twzipcode_' + main_key).width() + 'px)'
      });
    }
  }
  //處理關聯呈現
  if (window.sessionStorage) {
    var backRelated;
    var select_data;
    var related_list;
    var key1;
    var key2;
    var key;
    var key2;
    var option;

    (function () {
      var get_related = function get_related(is_chk, chk_key, chk_data) {
        if (is_chk == 1) {
          //將所有被關聯題目設為隱藏
          $('#preview_info' + chk_key).removeClass('d-none');
          for (var i = 0; i < $('.preview_info').length; i++) {
            if (parseInt($('.preview_info').eq(i).attr('data-key')) > chk_key) {
              if ($('.preview_info').eq(i).attr('data-is_related') == 1) {
                $('.preview_info').eq(i).addClass('d-none');
              }
            }
          }
        }

        if (typeof chk_key !== 'undefined') {
          //若有以下關聯
          if (typeof chk_data !== 'undefined') {
            var list = JSON.parse(chk_data);

            for (var key in list) {
              //賦予當前選取為以上關聯
              $('#preview_info' + list[key]).removeClass('d-none');
              $('#preview_info' + list[key]).attr({
                'data-up_key': chk_key,
                'data-up_data': chk_data
              });
            }
          }

          //若有以上關聯
          var up_data = $('#preview_info' + chk_key).attr('data-up_data');
          if (typeof up_data !== 'undefined') {
            var list = JSON.parse(up_data);

            for (var key in list) {
              $('#preview_info' + list[key]).removeClass('d-none');
            }
          }

          //遞迴
          get_related(0, $('#preview_info' + chk_key).attr('data-up_key'));
        }
      };

      backRelated = window.sessionStorage.getItem('backRelated[jump]');
      select_data = new Object();
      if (backRelated !== null) {
        select_data = JSON.parse(backRelated);
      }

      related_list = select_data;
      for (key1 in related_list) {
        for (key2 in related_list[key1]) {
          $('#preview_info' + related_list[key1][key2]).attr('data-is_related', 1);
        }
      }

      for (var key in related_list) {
        //將有關聯的題目下所有選項加上選取事件
        $('#preview_info' + key).find('[type="radio"]').unbind().on('change', function () {
          var chk_key = $(this).parents('.preview_info').attr('data-key');

          if ($(this).prop('checked')) {
            get_related(1, chk_key);
          }
        });
        //指定關聯選項的選取事件
        for (key2 in related_list[key]) {
          option = JSON.stringify(related_list[key][key2]);
          $('#preview_info' + key).find('[type="radio"]').eq(key2).attr('data-option', option).unbind().on('change', function () {
            var chk_key = $(this).parents('.preview_info').attr('data-key');
            var chk_data = $(this).attr('data-option');

            if ($(this).prop('checked')) {
              get_related(1, chk_key, chk_data);
            }
          });
        }
      }
    })();
  }
}
//預覽跳題 (連續型隱藏題目，適用於單選)
function preview_radio_jump(sel_count, idx, idxx) {}
/*if( window.sessionStorage ){
	var backRelated = window.sessionStorage.getItem('backRelated[jump]');
	var select_data = new Object();
	if(backRelated !== null){
		select_data = JSON.parse(backRelated);
	}

	if(typeof select_data[idx] !== 'undefined'){
		var element = $('#preview_box').find('.preview_info');
		var list = new Array();
		var sel_data;
		for(var key in select_data[idx]){
			if(key != idxx){
				list.push(select_data[idx][key][0]);
			}
			else{
				sel_data = select_data[idx][idxx][0];
			}
		}
		for(var key in list){
			var data = list[key];
			var count = 0;
			var is_break = 0;
			for(var i=0; i<element.length; i++){
				count++;
				var idx = element.eq(i).attr('data-idx');
				var data_count = $('#preview_info'+data).attr('data-count');
				if(count > sel_count && sel_count < data_count){
					if(idx == data){
						is_break = 1;
					}
					if(is_break == 0){
						element.eq(i).removeClass('d-none');
					}
				}
			}
		}
		if(typeof sel_data !== 'undefined'){
			var count = 0;
			var is_break = 0;
			for(var i=0; i<element.length; i++){
				count++;
				var idx = element.eq(i).attr('data-idx');
				var data_count = $('#preview_info'+sel_data).attr('data-count');
				if(count > sel_count && sel_count < data_count){
					if(idx == sel_data){
						is_break = 1;
					}
					if(is_break == 0){
						element.eq(i).addClass('d-none');
					}
				}
			}
		}
	}
}*/
//儲存關聯結果
function save_radio_related() {
  var html = '';
  if (window.sessionStorage) {
    var backRelated = window.sessionStorage.getItem('backRelated[jump]');
    var select_data = new Object();

    if (backRelated !== null) {
      select_data = JSON.parse(backRelated);
    }

    for (var idx in select_data) {
      if (Object.keys(select_data[idx]).length > 0) {
        for (var idxx in select_data[idx]) {
          html += '<input type="hidden" name="related_list[jump][' + idx + '_' + idxx + ']" value="' + select_data[idx][idxx] + '">';
        }
      }
    }
  }
  $('#preview_box').html(html);
}