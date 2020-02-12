window.PbomList = (function($,module){
    _pbomTab = $("#pbomTab"),
    _taskModels = null;
    
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
        var graphNumber = $("input[name='graphNumber']").val();
        var url = 'pbom/queryEbomsByPage?graphNumber=' + encodeURI(graphNumber);
        CommonUtils.getAjaxData({url:url,type:'GET',async:true},function(data){
            PageUtils.refreshPageInfo({element:'ebomPage',url : url,callback : showEbomList},data['page']);
            showEbomList(data);
        });
        
        //工序模型列表
        var flowId = $("input[name='flowId']").val();
        CommonUtils.getAjaxData({url:'pbom/queryTaskModels?flowId=' + flowId,type:'get'},function(data){
            if (data){
                _taskModels = data;
                //初始化 新增工序数据
                _taskModels['taskModelList'] = data.taskModels;
            }
        })
        
        //查询PBOM列表
        CommonUtils.getAjaxData({url:'pbom/queryPbomList?graphNumber=' + encodeURI(graphNumber),type:'get'},function(data){
            if (data){
                //如果pbom有数据 则 是编辑页面
                if (data.length > 0){
                    _taskModels['taskModelList'] = data;
                }
            }
        })
        //如果是excel导入的 则 工序名为空
        _taskModels['excelImport'] = true;
        var html = template('pbomTemp', _taskModels);
        _pbomTab.html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 显示产线列表
     */
    function showEbomList(data){
        var html = template('ebomTemp', data);
        $("#ebomTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 增加详细
     */
    function addDetail(){
        //增加一条明细 则 模板只循环一次
        _taskModels['taskModelList'] = [_taskModels.taskModels[0]];
        var html = template('pbomTemp', _taskModels);
        _pbomTab.append(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
        bindEvent();
    }
    
    /**
     * 删除详细
     */
    function deleteDetail(){
        var list = [];//项目中要删除的id集合
        var checks = $("input[type='checkbox']");
        for (var i = 0;i < checks.length;i++){
            if ($(checks[i]).prop("checked")){
                list.push(i);
            }
        }
        if (list.length == 0){
            _pbomTab.find("tr:last").remove();
            return;
        }
        list.reverse();
        $.each(list,function(i,j){
            _pbomTab.find("tr:eq("+ j +")").remove();
        });
    }
    
    /**
     * 请求后台增加pbom详情
     */
    function addPbomDetails(){
        var pbomTrs = _pbomTab.find("tr");
        if (pbomTrs.length == 0){
            alert("pbom列表不能为空");
            return
        }
        
        var pboms = [];
        $.each(pbomTrs,function(index,obj){
            var pbom = CommonUtils.serializeToObject($(obj));
            pboms.push(pbom);
        });
        
        CommonUtils.getAjaxData({url:'pbom/addPbomDetails',data:JSON.stringify(pboms),type:'POST'},function(data){
            if (!data){
                alert("添加失败");
                return;
            }
            window.location.href = 'flow/queryFlowList';
        });
    }
    
    /**
     * 绑定事件
     */
    function bindEvent(){
        //鼠标悬停 导出显示提示
        $(".bgd_export").hover(function() {
            $(this).append("<div class='export'><p>填写Excel注意事项:</p><p>1、不可以出现多余空列和空行。</p></div>");
        }, function() {
            $(".export").remove();
        });
        
        //选择工序改变后事件
        $("select[name='taskName']").change(function(){
            var sort = $(this.selectedOptions).attr("index");
            var taskId = $(this.selectedOptions).attr("taskId");
            $(this).parent().parent().find("input[name='sort']").val(sort);
            $(this).parent().parent().find("input[name='taskId']").val(taskId);
        });
        
        //计量单位 自动联想 最大10条数据
        $("input[name='supplier']").autocomplete({
           //数据来源 根据输入值 模糊匹配
           source:function(request,response){
               CommonUtils.getAjaxData({url:'supplier/querySuppliersByName?supplierName='
                   +encodeURI(request.term),type:'get',async:'true'},function(data){
                       response($.map(data,function(item){
                           return {
                               label:item.supplierName,//下拉框显示值
                               value:item.supplierName,//选中后,填充到下拉框的值
                               id:item.supplierName//选中后,填充到id里面的值
                           }
                       }));
               });
           }
        });
        
        //计量单位 自动联想 最大10条数据
        $("input[name='materialCode']").autocomplete({
           //数据来源 根据输入值 模糊匹配
           source:function(request,response){
               //手工输入则按照模糊匹配 条件查询所有物料
               CommonUtils.getAjaxData({url:'material/queryMaterialsByMaterialCode?materialCode='
                   +encodeURI(request.term),type:'get',async:'true'},function(data){
                       response($.map(data,function(item){
                           return {
                               label:item.materialCode+'-'+item.materialName,//下拉框显示值
                               value:item.materialCode,//选中后,填充到下拉框的值
                               materialName:item.materialName,
                               model:item.model,
                               unit:item.unit
                           }
                       }));
               });
           },
           select:function(event,ui){
               $(this).parent().parent().find("input[name='materialName']").val(ui.item.materialName);
               $(this).parent().parent().find("input[name='model']").val(ui.item.model);
               $(this).parent().parent().find("input[name='unit']").val(ui.item.unit);
           }
        });
    }
    
    // 导入Excel
    function addFile(){
        $(".mask").css("display", "block");
    }
    
    // 返回列表
    function backFile(){
        $(".mask").css("display", "none");
    }
    
    module.init = init;
    module.addDetail = addDetail;
    module.deleteDetail = deleteDetail;
    module.addPbomDetails = addPbomDetails;
    module.addFile = addFile;
    module.backFile = backFile;
    return module;
}($, window.PbomList || {}));
$(function() {
    PbomList.init();
});