window.FlowList = (function($,module){
    _addForm = $("#addForm"),
    _graphNumberInput = $("#graphNumber"),
    _flowId = 0,
    _validate = null,
    _flowModelPage = 'flowModelPage',
    _dialogTitle = $(".processTitle");
    
    
    /**
     * 初始化
     */
    function init(){
        initPageInfo();
        
        bindEvent();
    }
    
    /**
     * 加载页面
     */
    function initPageInfo(){
        //更新page信息
        var url = 'flow/queryFlowListsByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'flowModelPage',url : url,callback : showFlowList},data['page']);
            showFlowList(data);
        });
        
        //如果是待办事项跳转
        if (_graphNumberInput.val() != ''){
            showFlowDialog();
        }
    }
    
    /**
     * 显示工艺流程列表
     */
    function showFlowList(data){
        var html = template('flowModelTemp', data);
        $("#flowModelTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除工艺流程
     */
    function deleteFlowModels(){
        var list = [];//项目中要删除的id集合
        var checks = $("input[type='checkbox']:checked");
        $.each(checks,function(index,obj){
            list.push({flowId:obj.id,actId:$(obj).attr("actId"),
                deploymentId:$(obj).attr("deploymentId")});
        });
        
        if (list.length == 0){
            return;
        }
        
        confirm("确定要删除吗?",function(data){
            if (data){
                // 删除产线
                var deleteFlowModelsUrl = 'flow/deleteFlowModels';
                CommonUtils.getAjaxData({
                    url : deleteFlowModelsUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage[_flowModelPage];
                        PageUtils.pageClick(current,_flowModelPage);
                    }
                });
            }
        });
    }
    
    /**
     * 绑定事件
     */
    function bindEvent(){
        jQuery.validator.addMethod("isGraphNumberRepeat",function(value, element) {
            var flag = false;
            CommonUtils.getAjaxData({url:'flow/isFlowModelRepeat',type:'GET',
                data:{'graphNumber':value,'flowId':_flowId}},function(data){
                flag = data;
            })
            return flag;
        }, "图号不能重复");
        
        _validate = _addForm.validate({
            rules : {
                'graphNumber' : {
                    required : true,
                    maxlength : 255,
                    isGraphNumberRepeat:true
                },
                'flowName' : {
                    required : true,
                    maxlength : 255
                },
                'fileId' : {
                    required : true
                }
            },
            messages : {
                'graphNumber' : {
                    required : "不能为空",
                    maxlength : "长度不超过200",
                    isGraphNumberRepeat:"图号不能重复"
                },
                'flowName' : {
                    required : "不能为空",
                    maxlength : "长度不超过200"
                },
                'fileId' : {
                    required : "不能为空"
                }
            }
        });
    }
    
    /**
     * 显示工艺流程创建对话框
     */
    function showFlowDialog(){
        if (isIe8Browser()){
            return;
        }
        _dialogTitle.text("工艺流程基本信息(添加)");
        $(".mask").css("display", "block");
    }
    
    /**
     * 隐藏对话框
     */
    function backDialog(){
        $(".mask").css("display", "none");
        _addForm.find(":input").val("");
        _addForm.find("select").prop('selectedIndex', 0);
        $("label[class='error']").remove();
        _graphNumberInput.removeClass("error").attr("disabled",false);
        _flowId = 0;
    }
    
    /**
     * 判断是否ie8 浏览器是的话 弹窗提示用户 使用火狐浏览器
     */
    function isIe8Browser(){
        if (navigator.userAgent.indexOf("MSIE 8.0") > 0){
            alert("请使用火狐50.01浏览器进行工艺流程设置");
            return true;
        }
        return false
    }
    
    /**
     * 添加工艺流程
     */
    function addFlowModel(){
        if (!_addForm.valid()) {
            return;
        }
        
        //根据路径判断 是否是添加
        var isAddModel = _dialogTitle.text().indexOf("添加") > 0;
        var url = isAddModel ? 'flow/addFlowModel' : 'flow/updateFlowModel';
        var flowModel = CommonUtils.serializeToObject(_addForm);
        flowModel['flowId'] = _flowId;
        CommonUtils.getAjaxData({'url':basePath+url,'data':JSON.stringify(flowModel),'type':'POST'},function(data){
            if (!data){
                alert("操作失败");
                return;
            }
            //如果是添加工艺流程 跳转工艺流程编辑页面
            if (isAddModel){
                //更新待办事项状态
                self.parent.menuFrame.updateWorkBeach();
                window.location.href = basePath + 'modeler.html?modelId=' + data.actId + '&flowId=' + data.flowId;
            }
            //如果是编辑 则刷新 列表页面
            else{
                backDialog();
                var current = PageUtils._currentPage[_flowModelPage];
                PageUtils.pageClick(current,_flowModelPage);
            }
        });
    }
    
    /**
     * 打开更新工艺流程信息窗口 并填充数据
     */
    function updateFlowBasic(obj){
        _flowId = obj.flowId;
        //弹出框表头修改
        _dialogTitle.text("工艺流程基本信息(修改)");
        //图号不能编辑
        _graphNumberInput.attr("disabled",true);
        $(".mask").css("display", "block");
        //重新绑定校验事件
        CommonUtils.fillForm(_addForm,obj);
    }
    
    /**
     * 编辑工艺流程跳转
     */
    function editFlowDiagram(modelId,flowId){
        if (isIe8Browser()){
            return;
        }
        window.location.href = basePath + "modeler.html?modelId="+modelId+"&flowId="+flowId;
    }
    
    /**
     * 编辑工艺流程跳转
     */
    function editFlowPboms(modelId,flowId){
        CommonUtils.getAjaxData({'url':basePath+'flow/queryTaskIdsByFlowId?flowId='+flowId,'type':'GET'},function(data){
            if (data.length == 0){
                alert("该工艺流程下无工序,无法编辑pbom");
                return;
            }
            window.location.href = basePath + 'pbom/queryEbomList?flowId=' + flowId + '&modelId=' + modelId + '&isEditPbom=' + true;
        });
    }
    
    module.init = init;
    module.backDialog = backDialog;
    module.showFlowDialog = showFlowDialog;
    module.addFlowModel = addFlowModel;
    module.deleteFlowModels = deleteFlowModels;
    module.updateFlowBasic = updateFlowBasic;
    module.editFlowDiagram = editFlowDiagram;
    module.editFlowPboms  = editFlowPboms ;
    return module;
}($, window.FlowList || {}));
$(function() {
    FlowList.init();
});