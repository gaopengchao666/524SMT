window.ProductionLine = (function($,module){
    
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
        var url = 'productionline/queryProductionLinesByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'productionLinePage',url : url,callback : showProductionLine},data['page']);
            showProductionLine(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showProductionLine(data){
        //显示任务模板列表
        template.defaults.imports.dateFormat = function(date, format){
            if (date){
                return moment(date).format(format);
            }
            return '';
        };
        var html = template('productionLineTemp', data);
        $("#productionLineTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除产线
     */
    function deleteProductionLines(){
        var list = [];//项目中要删除的id集合
        var checks = $("input[type='checkbox']:checked");
        $.each(checks,function(index,obj){
            list.push(obj.id);
        });
        
        if (list.length == 0){
            return;
        }
        
        confirm("确定要删除吗?",function(data){
            if (data){
                // 删除产线
                var deleteProductionsUrl = 'productionline/deleteProductionLines';
                CommonUtils.getAjaxData({
                    url : deleteProductionsUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage['productionLinePage'];
                        PageUtils.pageClick(current,'productionLinePage');
                    }
                    else{
                        alert("车间产线被占用无法删除");
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
    
    /**
     * 跳转更新产线页面
     */
    function updateFlowInstance(productionLineId){
    }
    
    module.init = init;
    module.updateFlowInstance = updateFlowInstance;
    module.deleteProductionLines = deleteProductionLines;
    return module;
}($, window.ProductionLine || {}));
$(function() {
    ProductionLine.init();
});