window.WHPositionList = (function($,module){
    _whPositionPage = 'whPositionPage';
    
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
        var url = 'whposition/queryWHPositionsByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:_whPositionPage,url : url,callback : showWHPositionList},data['page']);
            showWHPositionList(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showWHPositionList(data){
        //显示任务模板列表
        var html = template('whPositionTemp', data);
        $("#whPositionTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除产线
     */
    function deleteWHPositions(){
        var list = [];//项目中要删除的id集合
        var checks = $("input[type='checkbox']:checked");
        var initWarehouseFlag = false;
        $.each(checks,function(index,obj){
            var warehouseId = $(obj).attr("warehouseId");
            list.push(obj.id);
            if (parseInt(warehouseId) < 5){
                initWarehouseFlag = true;
            }
        });
        
        if (list.length == 0){
            return;
        }
        
        if (initWarehouseFlag){
            alert("包含初始化库位不能删除");
            return;
        }
        
        confirm("确定要删除吗?",function(data){
           if(data){
               var deleteWHPositionsUrl = 'whposition/deleteWHPositions';
               CommonUtils.getAjaxData({
                   url : deleteWHPositionsUrl,
                   data : JSON.stringify(list),
                   type : 'POST'
               }, function(data) {
                   if(data=="success"){
                       //刷新当前分页数据
                       var current = PageUtils._currentPage[_whPositionPage];
                       PageUtils.pageClick(current,_whPositionPage);
                   }
                   else{
                       alert("库位被占用无法删除");
                   }
               });
           } 
        });
    }
    
    /**
     * 绑定事件
     */
    function bindEvent(){
    }
    
    
    module.init = init;
    module.deleteWHPositions = deleteWHPositions;
    return module;
}($, window.WHPositionList || {}));
$(function() {
    WHPositionList.init();
});