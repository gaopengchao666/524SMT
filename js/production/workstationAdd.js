window.WorkstationAdd = (function($,module){
    _workstationForm = $("#addForm"),
    _stationId = $("input[name='stationId']").val() || 0,
    _validate = null;
    
    /**
     * 初始化
     */
    function init(){
        bindEvent();
        initPageInfo();
    }
    
    /**
     * 初始化页面信息
     */
    function initPageInfo(){
        //初始化工位不能编辑 工位名称 和 工序
        if (_stationId < 11 && _stationId != 0){
            $("input[name='stationName']").attr("readOnly",true);
            $("select[name='taskName']").attr("disabled","disabled");
        }
    }
    
    /**
     * 绑定事件
     */
    function bindEvent(){
    	
    	
    	$.validator.addMethod("okScan",function registeredScan(value, element) {
    		 if(value.length!=4|value.substr(0,1)!="A"|isNaN(value.substr(1,3))){
    		        return false;
    		  }else{
    			  return true;
    		  }
		},"");
    	
        _validate = _workstationForm.validate({
            rules : {
                'stationName' : {
                    required : true,
                    maxlength : 200,
                    remote: {
                        url : "workstation/isWorkstationRepeat",
                        type : "GET",
                        data : {stationId:_stationId},
                        async : true,
                        cache : false,
                        contentType : 'application/json; charset=utf-8',
                        dataType : "json"
                    } 
                },
                'scanAddr' : {
                    required : true,
                    maxlength : 4,
                    okScan : true
                }
            },
            messages : {
                'stationName' : {
                    required : "不能为空",
                    maxlength : "长度不超过200",
                    remote : "工位名称不能重复"
                },
                'scanAddr' : {
                    required : "不能为空",
                    maxlength : "长度不超过4",
                    okScan :  "扫码前地址格式错误"
                }
            }
        });
    }
    
    /**
     * 添加产线
     */
    function addWorkstation(){
        if (!_workstationForm.valid()) {
            return;
        }
        _workstationForm.submit();
    }
    
    module.init = init;
    module.addWorkstation = addWorkstation;
    return module;
}($, window.WorkstationAdd || {}));
$(function() {
    WorkstationAdd.init();
});