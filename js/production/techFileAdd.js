window.TechFileAdd = (function($,module){
    _techFileForm = $("#addForm"),
    _fileId = $("input[name='fileId']").val() || 0,
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
        _validate = _techFileForm.validate({
            rules : {
                'fileNumber' : {
                    required : true,
                    maxlength : 200,
                    remote: {
                        url : "techfile/isTechFileRepeat",
                        type : "GET",
                        data : {fileId:_fileId},
                        async : true,
                        cache : false,
                        contentType : 'application/json; charset=utf-8',
                        dataType : "json"
                    } 
                },
                'fileName' : {
                    required : true,
                    maxlength : 200,
                    remote: {
                        url : "techfile/isTechFileRepeat",
                        type : "GET",
                        data : {fileId:_fileId},
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
                'fileNumber' : {
                    required : "不能为空",
                    maxlength : "超过200",
                    remote:"文件编号不能重复"
                },
                'fileName' : {
                    required : "不能为空",
                    maxlength : "长度不超过200",
                    remote:"文件名称不能重复"
                },
                'remark' : {
                    maxlength : "最大长度不超过255"
                }
            }
        });
    }
    
    /**
     * 添加产线
     */
    function addTechFile(){
        if (!_techFileForm.valid()) {
            return;
        }
        _techFileForm.submit();
    }
    
    module.init = init;
    module.addTechFile = addTechFile;
    return module;
}($, window.TechFileAdd || {}));
$(function() {
    TechFileAdd.init();
});