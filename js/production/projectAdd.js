window.ProjectAdd = (function($,module){
    _projectForm = $("#addForm"),
    _projectId = $("input[name='projectId']").val() || 0,
    _startTimeInput = $("input[name='startTimeStr']"),
    _endTimeInput = $("input[name='endTimeStr']"),
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
        _startTimeInput.datepicker({
            dateFormat : 'yy-mm-dd',
            onSelect:function(dateText,inst){
                _endTimeInput.datepicker("option","minDate",dateText);
            }   
        });
    
        _endTimeInput.datepicker({
            dateFormat : 'yy-mm-dd',
            onSelect:function(dateText,inst){
                _startTimeInput.datepicker("option","maxDate",dateText);
            }
        });
        
        _validate = _projectForm.validate({
            rules : {
                'projectCode' : {
                    required : true,
                    maxlength : 200
                },
                'projectName' : {
                    maxlength : 200
                },
                'graphNumber' : {
                    required : true,
                    maxlength : 200
                },
                'productName' : {
                    required : true,
                    maxlength : 200
                },
                'projectSource' : {
                    required : true,
                    maxlength : 200
                }
            },
            messages : {
                'projectCode' : {
                    required : "不能为空",
                    maxlength : "长度不超过200"
                },
                'projectName' : {
                    maxlength : "长度不超过200"
                },
                'graphNumber' : {
                    required : "不能为空",
                    maxlength : "长度不超过200"
                },
                'productName' : {
                    required : "不能为空",
                    maxlength : "长度不超过200"
                },
                'projectSource' : {
                    required : "不能为空",
                    maxlength : "长度不超过200"
                }
            }
        });
    }
    
    /**
     * 添加项目
     */
    function addProject(){
        var project = CommonUtils.serializeToObject(_projectForm);
        CommonUtils.getAjaxData({url:'project/isProjectRepeat',type:'get',data:project},function(data){
            if (!_projectForm.valid()) {
                return;
            }
            if(!data){
                alert("项目编码和产品图号不能同时重复");
                return;
            }
            _projectForm.submit();
        });
    }
    
    module.init = init;
    module.addProject = addProject;
    return module;
}($, window.ProjectAdd || {}));
$(function() {
    ProjectAdd.init();
});