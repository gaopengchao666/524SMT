window.AlarmDataAdd = (function($,module){
    _alarmDataForm = $("#addForm"),
    _validate = null;
    
    /**
     * 初始化
     */
    function init(){
        bindEvent();
    }
    
    /**
     * 绑定事件
     */
    function bindEvent(){
        //开始时间
        $("input[name='createTimeStr']").datepicker({
            dateFormat : 'yy-mm-dd',
            changeYear:true,
            changeMonth:true,
            showOn:"button",
            monthNamesShort:["January","February","March","April","May","June", "July","August","September","October","November","December"],
            buttonImage:basePath+"img/button/calendar.png",
            buttonImageOnly:false 
        });
        
        _validate = _alarmDataForm.validate({
            rules : {
                'warningType' : {
                    required : true
                },
                'planNumber' : {
                    required : true,
                    maxlength : 255
                },
                'graphNumber' : {
                    required : true,
                    maxlength : 255
                },
                'projectNumber' : {
                    required : true,
                    maxlength : 255
                },
                'taskName' : {
                    maxlength : 255
                },
                'remark' : {
                    maxlength : 255
                }
            },
            messages : {
                'warningType' : {
                    required : "不能为空"
                },
                'planNumber' : {
                    required : "不能为空",
                    maxlength : "长度不超过200"
                },
                'graphNumber' : {
                    required : "不能为空",
                    maxlength : "长度不超过200"
                },
                'projectNumber' : {
                    required : "不能为空",
                    maxlength : "长度不超过200"
                },
                'taskName' : {
                    maxlength : "长度不超过200"
                },
                'remark' : {
                    maxlength : "最大长度为255"
                }
            }
        });
    }
    
    /**
     * 添加告警数据
     */
    function addAlarmData(){
        if (!_alarmDataForm.valid()) {
            return;
        }
        _alarmDataForm.submit();
    }
    
    module.init = init;
    module.addAlarmData = addAlarmData;
    return module;
}($, window.AlarmDataAdd || {}));
$(function() {
    AlarmDataAdd.init();
});