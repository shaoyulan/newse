/**
 * 問卷功能的基本類別
 *
 * @Class FrontQuestion
 */
function FrontQuestion(){
    this.initialize.apply(this, arguments);
}
FrontQuestion.prototype.initialize = function(form_el, template_el, target_el, is_serial_number, related_json, call_back) {
    this._validate = false;
    this._form_el = form_el; //表單
    this._template_el = template_el; //範本
    this._target_el = target_el; //目標
    this._is_serial_number = typeof is_serial_number !== 'undefined'?is_serial_number:0; //是否顯示題號
    this._related_json = related_json; //關聯資料
    this._call_back = call_back; //回傳
    //整理範本
    var template = $(this._template_el).clone();
    for(var i=0; i<$(template).find('.form-row').length; i++){
        var block_el = $(template).find('.form-row').eq(i);
        var q_type = block_el.data('block_type');
        var q_id = block_el.data('id');
        var q_key = block_el.data('key');
        var q_required = block_el.data('is_required') == 1?block_el.find('.question_title').addClass('required_star'):'';
        var q_related = block_el.data('is_related') == 1?block_el.addClass('d-none'):'';
        //加入檢查用的樣式
        block_el.addClass('preview_info').addClass('preview_info_mainIdx').addClass('question_'+q_type).addClass('question_mainIdx_'+q_id);
        block_el.attr({'data-form_idx':'mainIdx','id':'preview_info_mainIdx_'+q_key});
    }
    this._template_html = $(template).html();
    this._template_idx = $(target_el).length;
    //放入目標位置
    for(var idx=0; idx<$(target_el).length; idx++){
        var q_id = parseInt(idx)+1;
        var q_html = this._template_html.replace(/mainIdx/g,q_id);
        var q_name = this._target_el.substr(1);
        $(target_el).eq(idx).attr({'id':q_name+'_'+q_id,'data-idx':q_id}).append(q_html);
    }
    //處理驗證
    this.validation();
    //區塊初始化
    for(var i=0; i<$(target_el).length; i++){
        this.blockInit($(target_el).eq(i));
    }
}
//建立
FrontQuestion.prototype.create = function(target) {
    var that = this;
    var q_id = that._template_idx = that._template_idx + 1;
    var q_html = that._template_html.replace(/mainIdx/g,that._template_idx);
    var q_name = that._target_el.substr(1);
    $(target).append('<div class="'+q_name+'" id="'+q_name+'_'+q_id+'" data-idx="'+q_id+'">'+q_html+'</div>');
    //區塊初始化
    that.blockInit($(that._target_el).last());
}
//移除
FrontQuestion.prototype.remove = function(target) {
	var that = this;
	if($(that._target_el).length <= 1){
		swal('目前已是最後一筆');
	}
	else{
		swal({
	        title: "",
	        text: "是否確認刪除?",
	        type: "warning",
	        showCancelButton: true,
	        confirmButtonText: "確定",
	        cancelButtonText: "取消",
	    }).then(function(result){
	    	if(result){
	    		$(target).remove();
	    	}
	    }).catch(swal.noop);
	}
}
//區塊初始化
FrontQuestion.prototype.blockInit = function(main_el) {
    this.setRadio(main_el);
    this.setCheck(main_el);
    this.setSlider(main_el);
    this.setStar(main_el);
    this.setOther(main_el);
    this.getRequired();
    this.setSerialNumber();
}
//題號
FrontQuestion.prototype.setSerialNumber = function() {
    var that = this;
    if(that._is_serial_number == 1){
        for(var i=0; i<$(that._target_el).length; i++){
            var element = $(that._target_el).eq(i).find('.serial_number');
            if(element.length > 0){
                var num = 0;
                for(var idx=0; idx<element.length; idx++){
                    if(!element.eq(idx).parents('.form-row').hasClass('d-none')){
                        num++;
                        element.eq(idx).html(num+'.&nbsp;');
                    }
                }
            }
        }
    }
}
//必填
FrontQuestion.prototype.getRequired = function() {
    var that = this;
    if(that._validate){
        var preview_element = $(that._target_el).find('.preview_info');
        for(var i=0; i<preview_element.length; i++){
            //將全部的必填移除
            for(var j=0; j<preview_element.eq(i).find('.form-control').length; j++){
                var ipt_name = preview_element.eq(i).find('.form-control').eq(j).attr('name');
                if(ipt_name.indexOf('zipcode') == '-1'){
                    $('[name="'+ipt_name+'"]').rules('remove', 'required');
                }
            }
            for(var j=0; j<preview_element.eq(i).find('.form-check-input').length; j++){
                var ipt_name = preview_element.eq(i).find('.form-check-input').eq(j).attr('name');
                $('[name="'+ipt_name+'"]').rules('remove', 'required');
            }
            //根據顯示的題目區塊賦予必填
            if(!preview_element.eq(i).hasClass('d-none')){
                if(preview_element.eq(i).data('is_required') == 1){
                    for(var j=0; j<preview_element.eq(i).find('.form-control').length; j++){
                        var ipt_name = preview_element.eq(i).find('.form-control').eq(j).attr('name');
                        if(ipt_name.indexOf('zipcode') == '-1'){
                            $('[name="'+ipt_name+'"]').rules('add', 'required');
                        }
                    }
                    for(var j=0; j<preview_element.eq(i).find('.form-check-input').length; j++){
                        var ipt_name = preview_element.eq(i).find('.form-check-input').eq(j).attr('name');
                        $('[name="'+ipt_name+'"]').rules('add', 'required');
                    }
                }
            }
        }
    }
}
//單選題
FrontQuestion.prototype.setRadio = function(main_el) {
    var that = this;
    var element = main_el.find('.question_radio');
    if(element.length > 0){
        if(that._related_json != '[]'){
            var related_list = JSON.parse(that._related_json);
            for(var idx=0; idx<element.length; idx++){
                var key = element.eq(idx).data('key');
                for(var key1 in related_list){
                    if(key1 == key){
                        //將有關聯的題目下所有選項加上選取事件
                        element.eq(idx).find('[type="radio"]').unbind().on('change', function(){
                            var form_idx = $(this).parents('.preview_info').data('form_idx');
                            var chk_key = $(this).parents('.preview_info').data('key');
                            if($(this).prop('checked')){
                                that.getRelated(1, form_idx, chk_key);
                            }
                        });
                        //指定關聯選項的選取事件
                        for(var key2 in related_list[key1]){
                            var option = JSON.stringify(related_list[key1][key2]);
                            element.eq(idx).find('[type="radio"]').eq(parseInt(key2 - 1)).attr('data-option',option).unbind().on('change', function(){
                                var form_idx = $(this).parents('.preview_info').data('form_idx');
                                var chk_key = $(this).parents('.preview_info').data('key');
                                var chk_data = $(this).data('option');
                                if($(this).prop('checked')){
                                    that.getRelated(1, form_idx, chk_key, chk_data);
                                }
                            });
                        }
                    }
                }
            }
        }
    }
}
//取得單選題關聯
FrontQuestion.prototype.getRelated = function(is_chk, form_idx, chk_key, chk_data){
    var that = this;
    if(is_chk == 1){
        $('#preview_info_'+form_idx+'_'+chk_key).removeClass('d-none');
        //將所有被關聯題目設為隱藏
        for(var i=0; i<$('.preview_info_'+form_idx).length; i++){
            if(parseInt($('.preview_info_'+form_idx).eq(i).data('key')) > chk_key){
                if($('.preview_info_'+form_idx).eq(i).data('is_related') == 1){
                    $('.preview_info_'+form_idx).eq(i).addClass('d-none');
                }
            }
        }
    }
    if(typeof chk_key !== 'undefined'){
        //若有以下關聯
        if(typeof chk_data !== 'undefined'){
            var list = chk_data;
            for(var key in list){
                var k = parseInt(list[key]) + 1;
                $('#preview_info_'+form_idx+'_'+k).removeClass('d-none');
                if(k != chk_key){
                    //賦予當前選取為以上關聯
                    $('#preview_info_'+form_idx+'_'+k).attr({'data-up_key':chk_key, 'data-up_data':chk_data});
                }
            }
        }
        //若有以上關聯
        var up_data = $('#preview_info_'+form_idx+'_'+chk_key).data('up_data');
        if(typeof up_data !== 'undefined'){
            var list = JSON.parse(up_data);
            for(var key in list){
                var k = parseInt(list[key]) + 1;
                $('#preview_info_'+form_idx+'_'+k).removeClass('d-none');
            }
        }
        //遞迴
        var up_key = $('#preview_info_'+form_idx+'_'+chk_key).data('up_key');
        that.getRelated(0, form_idx, up_key);
        that.getRequired();
        that.setSerialNumber();
    }
}
//多選題
FrontQuestion.prototype.setCheck = function(main_el) {
    var that = this;
    if(that._validate){
        var element = main_el.find('.question_checkbox');
        if(element.length > 0){
            for(var idx=0; idx<element.length; idx++){
                var maxlength = element.eq(idx).data('maxlength');
                if(maxlength > 0){
                    var ipt_name = element.eq(idx).find('[type="checkbox"]').eq(0).attr('name');
                    $('[name="'+ipt_name+'"]').rules('add', 'q_checkbox');
                }
            }
        }
    }
}
//數字滑桿
FrontQuestion.prototype.setSlider = function(main_el) {
    var that = this;
    var element = main_el.find('.question_slider');
    if(element.length > 0){
        element.find('[type="number"]').hide();
        for(var idx=0; idx<element.length; idx++){
            var element_name = element.eq(idx).find('.slider_bar').attr('id');
            var handle = $('#'+element_name).find('.ui-slider-handle');
            $('#'+element_name).slider({
                value: $('#'+element_name).data('min'),
                min: $('#'+element_name).data('min'),
                max: $('#'+element_name).data('max'),
                step: $('#'+element_name).data('step'),
                range: 'min',
                animate: true,
                create: function () {
                    handle.text($(this).slider("value"));
                },
                slide: function (event, ui) {
                    var value = ui.value;
                    handle.text(value);
                    $(this).parents('.input-group-ranger').find('[type="number"]').val(value).attr('value',value).attr('aria-invalid',false);
                    $(this).parents('.input-group-ranger').find('.help-block').remove();
                }
            });
        }
    }
}
//星級評分
FrontQuestion.prototype.setStar = function(main_el) {
    var that = this;
    var element = main_el.find('.question_star');
    if(element.length > 0){
        for(var idx=0; idx<element.length; idx++){
            var rating_bar = element.eq(idx);
            rating_bar.each(function () {
                var star_rating = $(this).find('.form-check-label.fa-star-o');
                var set_rating_star = function () {
                    return star_rating.each(function () {
                        if (parseInt(star_rating.siblings('input.rating_value').val()) >= parseInt($(this).data('rating'))) {
                            return $(this).removeClass('fa-star-o').addClass('fa-star');
                        }
                        else {
                            return $(this).removeClass('fa-star').addClass('fa-star-o');
                        }
                    });
                };
                star_rating.unbind().on('click', function () {
                    $(this).siblings('input.rating_value').val($(this).data('rating'));
                    return set_rating_star();
                });
            });
        }
    }
}
//其他
FrontQuestion.prototype.setOther = function(main_el) {
    var that = this;
    var element = main_el.find('.ipt_other');
    if(element.length > 0){
        for(var idx=0; idx<element.length; idx++){
            var other_ipt = '#' + element.eq(idx).attr('for');
            var other_name = $(other_ipt).attr('name');
            var other_value = $(other_ipt).val();
            $('[name="'+other_name+'"]').attr('data-other_value',other_value);
            $('[name="'+other_name+'"]').on('change', function(){
            	var ipt_value = $(this).val();
            	//單選題
            	if($(this).parents('.form-row').data('block_type') == 'radio'){
            		$(this).parents('.form-row').find('.ipt_other').find('.other_label').html('其他');
            	}
                //被選取
                if($(this).prop('checked')){
                    if(ipt_value == $(this).data('other_value')){
                        var form_idx = $(this).parents('.form-row').data('form_idx');
                        $(this).parent().find('.ipt_other').find('.other_label').html('其他'+'<input type="text" class="form-control" placeholder="自行輸入" name="answer_'+form_idx+'['+ipt_value+']" />');
                        $(this).parent().find('.ipt_other').find('[type="text"]').show();
                    }
                }
                //多選題
                if($(this).parents('.form-row').data('block_type') == 'checkbox'){
                	for(var i=0; i<$(this).parents('.form-row').find('[type="checkbox"]').length; i++){
                		var ipt_el = $(this).parents('.form-row').find('[type="checkbox"]').eq(i);
                		var ipt_value = ipt_el.val();
                		if(!ipt_el.prop('checked') && ipt_value == ipt_el.data('other_value')){
                			ipt_el.parent().find('.ipt_other').find('.other_label').html('其他');
                		}
                	}
            	}
            });
        }
    }
}
//驗證
FrontQuestion.prototype.validation = function() {
    var that = this;
    var group_list = new Array();
    var group_set = new Array();
    var validate = $(that._form_el).validate({
        errorElement: 'div',
        errorClass: 'help-block',
        focusInvalid: true,
        ignore: "",
        rules: {
            question_id: {
                required: true
            }
        },
        messages: {
        },
        //單項證驗失敗，參數是驗證對向
        highlight: function (element, errorClass, validClass){
            $(element).closest('.form-row').removeClass('has-info').addClass('has-error');
        },
        //單項證驗成功，參數是驗證對向
        unhighlight: function (element, errorClass, validClass){
        },
        //單項證驗成功，參數是error，不是驗證的對向，也可以是文字，如果文字會加入error的class中
        success: function (error) {
            $(error).closest('.form-row').removeClass('has-error').addClass('has-info');
            $(error).remove();
        },
        //error 元素的加入function
        errorPlacement: function (error, element) {
            var elementName = element.attr('name');
            var lastInGroup = $.map(group_set, function(fields, name) {
                var fieldsArr;
                if (fields.indexOf(elementName) >= 0) {
                    fieldsArr = fields.split(" ");
                    return fieldsArr[fieldsArr.length - 1];
                } else {
                    return null;
                }
            })[0];

            var controls = element.parents('.form-row');
            if(element.is('input[type=checkbox]') || element.is('input[type=radio]')) {
                controls.append(error);
            }
            else if ($.inArray(lastInGroup, group_list) != '-1') {
                var group_name = lastInGroup.replace('[address]', '');
                if(elementName == (group_name+'[zip_code]') || elementName == (group_name+'[city_name]') || elementName == (group_name+'[area_name]') || elementName == (group_name+'[address]')) {
                    if(controls.find('.help-block').length == 0){
                        controls.append(error);
                    }
                } else {
                    error.insertAfter(element);
                }
            }
            else error.insertAfter(element.parent());
        },
        //在提交表單之前，且驗證失敗
        invalidHandler: function () {
        },
        //在提交表單之前，且所有驗證成功，可以在這裡改成用$.ajax()送出
        submitHandler: function (form) {
            event.preventDefault();
            that.submit(form, function(form){
                $('.send_btn').attr('disabled','disabled');
                form.submit();
            });
        }
    });
    //多選題驗證
    $.validator.addMethod('q_checkbox', function (value, element, arg) {
        var ipt_name = $(element).attr('name');
        var maxlength = $(element).parents('.question_checkbox').data('maxlength');
        return $('input[name="'+ipt_name+'"]:checked').length <= maxlength;
    }, function (value, element, arg){
        var maxlength = $(element).parents('.question_checkbox').data('maxlength');
        return "最多選擇 " + maxlength + " 項";
    });
    that._validate = true;
}
//提交表單
FrontQuestion.prototype.submit = function(form, call_back) {
    var that = this;
    swal({
        title: "",
        text: "是否確定送出?",
        type: "warning",
        showCancelButton: true,
        confirmButtonText: "確定",
        cancelButtonText: "取消",
    }).then(function(result){
        if (result) {
            $('.send_btn').attr('disabled','disabled');
            //將沒有顯示的題目區塊直接清空內容
            for(var i=0; i<$(form).find('.preview_info').length; i++){
                if($(form).find('.preview_info').eq(i).hasClass('d-none')){
                    $(form).find('.preview_info').eq(i).remove();
                }
            }
            setTimeout(function(){
                if(typeof that._call_back === 'function'){
                    that._call_back(form);
                }
                else{
                    call_back(form);
                }
            }, 100);
        }
    }).catch(swal.noop);
}
//代入表單填寫資料
FrontQuestion.prototype.setReplyData = function(reply_json) {
    var that = this;
    var reply_list = JSON.parse(reply_json);
    var form_id = 0;
    for(var idx in reply_list){
        form_id++;
        //預設資料
        for(var key in reply_list[idx]['member_info']){
            var member_info = reply_list[idx]['member_info'];
            var ipt_name = 'member_info[' + form_id + '][' + key + ']';
            var ipt_el = $('[name="'+ipt_name+'"]');
            var answer = member_info[key];
            ipt_el.val(answer);
        }
        //生成資料
        for(var key in reply_list[idx]['block_list']){
            var value = reply_list[idx]['block_list'][key];
            if(typeof value['question_block_id'] !== 'undefined'){
                var ipt_name = 'block_' + form_id + '[' + value['question_block_id'] + ']';
                var ipt_el = $('[name="'+ipt_name+'"]');
                var block_type = value['block_type'];
                var answer = value['answer'];

                //多行文字
                if(block_type == 'textarea'){
                    answer = decodeURIComponent(answer);
                    ipt_el.val(answer);
                }
                //單選題
                else if(block_type == 'radio'){
                    item_id = value['question_block_item_id'];
                    for(var i=0; i<ipt_el.length; i++){
                        if(ipt_el.eq(i).val() == item_id){
                            ipt_el.eq(i).prop('checked',true).change();
                            if($('[name="answer_' + form_id + '[' + item_id + ']"]').length > 0){
                                $('[name="answer_' + form_id + '[' + item_id + ']"]').val(answer);
                            }
                        }
                    }
                }
                //多選題
                else if(block_type == 'checkbox'){
                    var answer_list = Object.keys(answer);
                    for(var i=0; i<$('[name="'+ipt_name+'[]"]').length; i++){
                        if($.inArray($('[name="'+ipt_name+'[]"]').eq(i).val(), answer_list) != '-1'){
                            $('[name="'+ipt_name+'[]"]').eq(i).prop('checked',true).change();
                            var item_id = $('[name="'+ipt_name+'[]"]').eq(i).val();
                            if($('[name="answer_' + form_id + '[' + item_id + ']"]').length > 0){
                                $('[name="answer_' + form_id + '[' + item_id + ']"]').val(answer[item_id]);
                            }
                        }
                    }
                }
                //下拉選單
                else if(block_type == 'select'){
                    answer = value['question_block_item_id'];
                    ipt_el.val(answer);
                }
                //數字滑桿
                else if(block_type == 'slider'){
                    ipt_el.val(answer);
                    var slider_element = ipt_el.parents('.slider');
                    $('#' + slider_element.find('.slider_bar').attr('id')).slider('value', answer);
                    slider_element.find('.ui-slider-handle').attr('data-value', answer).html(answer);
                }
                //星級評分
                else if(block_type == 'star'){
                    ipt_el.val(answer);
                    for(var i=0; i<=$('[name="'+ipt_name+'[]"]').length; i++){
                        if((i + 1) <=answer){
                            $('[name="'+ipt_name+'[]"]').eq(i).next().click();
                        }
                    }
                }
                else{
                    ipt_el.val(answer);
                }
            }
        }
    }
}

/*-----------------------------------------------------------------------------*/
/**
 * 取得 Framework7 問卷
 *
 * @Class Framework7Question
 */
function Framework7Question() {
    this.initialize.apply(this, arguments);
}

Framework7Question.prototype = Object.create(FrontQuestion.prototype);
Framework7Question.constructor = Framework7Question;

Framework7Question.prototype.initialize = function(form_el, template_el, target_el, is_serial_number, related_json, call_back) {
    FrontQuestion.prototype.initialize.call(this, form_el, template_el, target_el, is_serial_number, related_json, call_back);
}

//區塊初始化
Framework7Question.prototype.blockInit = function(main_el) {
    this.setRadio(main_el);
    this.setCheck(main_el);
    this.setSelect(main_el);
    this.setSlider(main_el);
    this.setStar(main_el);
    this.setOther(main_el);
    this.getRequired();
    this.setSerialNumber();
}
//移除
Framework7Question.prototype.remove = function(target) {
    var that = this;
    if($(that._target_el).length <= 1){
        app.dialog.alert('目前已是最後一筆','提示');
    }
    else{
        app.dialog.confirm('是否確認刪除?','提示',function(){
            $(target).remove();
        });
    }
}
//下拉選單
Framework7Question.prototype.setSelect = function(main_el) {
    var that = this;
    if(typeof that.picker === 'undefined'){
        that.picker = new Object();
    }
    if(that._validate){
        var element = main_el.find('.question_select');
        if(element.length > 0){
            for(var idx=0; idx<element.length; idx++){
                var picker_el = element.eq(idx).find('input');
                picker_el.attr('data-idx',idx);
                var picker_data = picker_el.data('picker');
                picker_data = JSON.parse(decodeURIComponent(picker_data));
                var display = new Array();
                var values = new Array();
                for(var key in picker_data){
                    display.push(picker_data[key]['item_content']);
                    values.push(picker_data[key]['id']);
                }

                that.picker[idx] = app.picker.create({
                    inputEl: '#' + picker_el.attr('id'),
                    rotateEffect: true,
                    cols: [
                        {
                            textAlign: 'center',
                            values: values,
                            displayValues: display,
                            onChange: function (picker, values, displayValues) {
                            },
                        },
                    ],
                    formatValue: function (values, displayValues) {
                        return displayValues;
                    },
                    on: {
                        //開啟選單事件
                        open: function (picker) {
                            picker.$inputEl.attr('data-reset',0);
                            //定義清除事件
                            picker.$el.find('.toolbar-clear-link').on('click', function () {
                                picker.$inputEl.attr('data-reset',1);
                                picker.$inputEl.val('');
                                picker.close();
                            });
                        },
                        //關閉選單事件
                        close: function (picker) {
                            var is_reset = picker.$inputEl.attr('data-reset');
                            var value = is_reset == 0?picker.value[0]:0;
                            picker.$inputEl.attr('data-value',value);
                        }
                    }
                });
            }
        }
    }
}
//數字滑桿
Framework7Question.prototype.setSlider = function(main_el) {
    var that = this;
    if(typeof that.range === 'undefined'){
        that.range = new Object();
    }
    var element = main_el.find('.question_slider');
    if(element.length > 0){
        element.find('[type="number"]').hide();
        for(var idx=0; idx<element.length; idx++){
            var slider_el = element.eq(idx).find('.slider_bar');
            slider_el.attr('data-idx',idx);
            slider_el.addClass('range-slider range-slider-init');
            slider_el.html('<input type="range" data-name="'+slider_el.data('name')+'" />');

            that.range[idx] = app.range.create({
                el: '#' + slider_el.attr('id'),
                label: true,
                step: slider_el.data('step'),
                min: slider_el.data('min'),
                max: slider_el.data('max'),
                on: {
                    changed: function (range, value) {
                        var ipt_name = range.$inputEl.attr('data-name');
                        $('[name="'+ipt_name+'"]').attr('value',value).val(value);
                    }
                }
            });
        }
    }
}
//提交表單
Framework7Question.prototype.submit = function(form, call_back) {
    var that = this;
    app.dialog.confirm('是否確定送出?','提示',function(){
        $('.send_btn').attr('disabled','disabled');
        //將沒有顯示的題目區塊直接清空內容
        for(var i=0; i<$(form).find('.preview_info').length; i++){
            if($(form).find('.preview_info').eq(i).hasClass('d-none')){
                $(form).find('.preview_info').eq(i).remove();
            }
        }
        setTimeout(function(){
            if(typeof that._call_back === 'function'){
                that._call_back(form);
            }
            else{
                call_back(form);
            }
        }, 100);
    });
}
//取得題型屬性
Framework7Question.prototype.getBlockType = function() {
    var that = this;
    var block_type_data = new Object();
    for(var i=0; i<$(that._template_el).find('.form-row').length; i++){
        var key = $(that._template_el).find('.form-row').eq(i).attr('data-id');
        var block_type = $(that._template_el).find('.form-row').eq(i).attr('data-block_type');
        block_type_data[key] = block_type;
    }
    return block_type_data;
}
//整理送出內容
Framework7Question.prototype.getFormData = function(formData) {
    var that = this;
    var send_data = new Object();
    var info_key = 'member_info[1]';
    var form_key = 'block_1';
    var answer_key = 'answer_1';
    send_data['member_info'] = new Object();
    send_data['member_info'][1] = new Object();
    send_data[form_key] = new Object();
    send_data[answer_key] = new Object();
    var block_type_list = that.getBlockType();
    for(var key in formData){
        var value = formData[key];
        if(key.indexOf(form_key) != -1){
            if(Array.isArray(value)){
                var key_arr = key.match(/block_1\[(.*)\]\[(.*)\]/);
                var block_id = key_arr[1];
                var block_type = block_type_list[block_id];
                //若不為星級評分
                if(block_type != 'star'){
                    send_data[form_key][block_id] = value;
                }
            }
            else{
                var key_arr = key.match(/block_1\[(.*)\]/);
                var block_id = key_arr[1];
                var block_type = block_type_list[block_id];
                //若為下拉選單
                if(block_type == 'select'){
                    var answer = typeof $('[name="'+key+'"]').data('value') !== 'undefined'?$('[name="'+key+'"]').data('value'):'';
                    send_data[form_key][block_id] = answer;
                }
                else{
                    send_data[form_key][block_id] = value;
                }
            }
        }
        else if(key.indexOf(answer_key) != -1){
            var key_arr = key.match(/answer_1\[(.*)\]/);
            var block_item_id = key_arr[1];
            send_data[answer_key][block_item_id] = value;
        }
        else if(key.indexOf(info_key) != -1){
            var key_arr = key.match(/member_info\[1\]\[(.*)\]/);
            var arr_name = key_arr[1];
            send_data['member_info'][1][arr_name] = value;
        }
        else{
            send_data[key] = value;
        }
    }
    return send_data;
}
//代入表單填寫資料
Framework7Question.prototype.setReplyData = function(reply_json) {
    var that = this;
    var reply_list = JSON.parse(reply_json);
    var form_id = 0;
    for(var idx in reply_list){
        form_id++;
        //預設資料
        for(var key in reply_list[idx]['member_info']){
            var member_info = reply_list[idx]['member_info'];
            var ipt_name = 'member_info[' + form_id + '][' + key + ']';
            var ipt_el = $('[name="'+ipt_name+'"]');
            var answer = member_info[key];
            ipt_el.val(answer);
        }
        //生成資料
        for(var key in reply_list[idx]['block_list']){
            var value = reply_list[idx]['block_list'][key];
            if(typeof value['question_block_id'] !== 'undefined'){
                var ipt_name = 'block_' + form_id + '[' + value['question_block_id'] + ']';
                var ipt_el = $('[name="'+ipt_name+'"]');
                var block_type = value['block_type'];
                var answer = value['answer'];

                //多行文字
                if(block_type == 'textarea'){
                    answer = decodeURIComponent(answer);
                    ipt_el.val(answer);
                }
                //單選題
                else if(block_type == 'radio'){
                    item_id = value['question_block_item_id'];
                    for(var i=0; i<ipt_el.length; i++){
                        if(ipt_el.eq(i).val() == item_id){
                            ipt_el.eq(i).prop('checked',true).change();
                            if($('[name="answer_' + form_id + '[' + item_id + ']"]').length > 0){
                                $('[name="answer_' + form_id + '[' + item_id + ']"]').val(answer);
                            }
                        }
                    }
                }
                //多選題
                else if(block_type == 'checkbox'){
                    var answer_list = Object.keys(answer);
                    for(var i=0; i<$('[name="'+ipt_name+'[]"]').length; i++){
                        if($.inArray($('[name="'+ipt_name+'[]"]').eq(i).val(), answer_list) != '-1'){
                            $('[name="'+ipt_name+'[]"]').eq(i).prop('checked',true).change();
                            var item_id = $('[name="'+ipt_name+'[]"]').eq(i).val();
                            if($('[name="answer_' + form_id + '[' + item_id + ']"]').length > 0){
                                $('[name="answer_' + form_id + '[' + item_id + ']"]').val(answer[item_id]);
                            }
                        }
                    }
                }
                //下拉選單
                else if(block_type == 'select'){
                    answer = value['question_block_item_id'];
                    var picker_data = ipt_el.data('picker');
                    picker_data = JSON.parse(decodeURIComponent(picker_data));
                    for(var key in picker_data){
                        if(answer == picker_data[key]['id']){
                            ipt_el.attr('data-value',answer).val(picker_data[key]['item_content']);
                        }
                    }
                }
                //數字滑桿
                else if(block_type == 'slider'){
                    ipt_el.attr('value',answer).val(answer);
                    var slider_idx = ipt_el.parents('.ranger-slider-group').find('.slider_bar').data('idx');
                    if(typeof that.range !== 'undefined'){
                        if(typeof that.range[slider_idx] !== 'undefined'){
                            that.range[slider_idx].setValue(answer);
                        }
                    }
                }
                //星級評分
                else if(block_type == 'star'){
                    ipt_el.val(answer);
                    for(var i=0; i<=$('[name="'+ipt_name+'[]"]').length; i++){
                        if((i + 1) <=answer){
                            $('[name="'+ipt_name+'[]"]').eq(i).next().click();
                        }
                    }
                }
                else{
                    ipt_el.val(answer);
                }
            }
        }
    }
}