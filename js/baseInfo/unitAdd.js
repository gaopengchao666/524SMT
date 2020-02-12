window.UnitAdd = (function($,module){
    _unitForm = $("#addForm"),
    _unitId = $("input[name='unitId']").val() || 0,
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
        _validate = _unitForm.validate({
            rules : {
                'unit' : {
                    required : true,
                    maxlength : 255
                },
                'subUnit' : {
                    required : true,
                    maxlength : 255
                },
                'scaling' : {
                    required : true,
                    number: true,
                    range : [1,10000]
                },
                'remark' : {
                    maxlength : 255
                }
            },
            messages : {
                'unit' : {
                    required : "不能为空",
                    maxlength : "长度不超过255"
                },
                'subUnit' : {
                    required : "不能为空",
                    maxlength : "长度不超过255"
                },
                'scaling' : {
                    required : "不能为空",
                    number: "必须为数字",
                    range : "范围为1-10000"
                },
                'remark' : {
                    maxlength : "长度不超过255"
                }
            }
        });
    }
    
    /**
     * 添加产线
     */
    function addUnit(){
        if (!_unitForm.valid()) {
            return;
        }
        var unit = CommonUtils.serializeToObject(_unitForm);
        CommonUtils.getAjaxData({url:'unit/isUnitRepeat',type:'get',data:unit},function(data){
            if(!data){
                alert("包装单位 使用单位 换算关系不能同时重复");
                return;
            }
            _unitForm.submit();
        });
    }
    
    module.init = init;
    module.addUnit = addUnit;
    return module;
}($, window.UnitAdd || {}));
$(function() {
    UnitAdd.init();
});