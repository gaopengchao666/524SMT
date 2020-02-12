window.ProductionLineAdd = (function($,module){
    _productionLineForm = $("#addForm"),
    _lineId = $("input[name='lineId']").val() || 0,
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
        _validate = _productionLineForm.validate({
            rules : {
                'lineNumber' : {
                    required : true,
                    maxlength : 200,
                    remote: {
                        url : "productionline/isProductionLineRepeat",
                        type : "GET",
                        data : {lineId:_lineId},
                        async : true,
                        cache : false,
                        contentType : 'application/json; charset=utf-8',
                        dataType : "json"
                    } 
                },
                'lineName' : {
                    required : true,
                    maxlength : 200,
                    remote: {
                        url : "productionline/isProductionLineRepeat",
                        type : "GET",
                        data : {lineId:_lineId},
                        async : true,
                        cache : false,
                        contentType : 'application/json; charset=utf-8',
                        dataType : "json"
                    } 
                },
                'remark' : {
                    maxlength : 255
                }
            },
            messages : {
                'lineNumber' : {
                    required : "产线编码不能为空",
                    maxlength : "长度不超过200",
                    remote:"产线编码不能重复"
                },
                'lineName' : {
                    required : "产线名称不能为空",
                    maxlength : "产线名称长度不超过200",
                    remote:"产线名称不能重复"
                },
                'remark' : {
                    maxlength : "最大长度为255"
                }
            }
        });
    }
    
    /**
     * 添加产线
     */
    function addProductionLine(){
        if (!_productionLineForm.valid()) {
            return;
        }
        _productionLineForm.submit();
    }
    
    module.init = init;
    module.addProductionLine = addProductionLine;
    return module;
}($, window.ProductionLineAdd || {}));
$(function() {
    ProductionLineAdd.init();
});