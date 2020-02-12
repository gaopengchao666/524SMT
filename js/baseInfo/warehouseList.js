window.WarehouseList = (function($,module){
    _warehousePage = 'warehousePage';
    
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
        var url = 'warehouse/queryWarehousesByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:_warehousePage,url : url,callback : showWarehouseList},data['page']);
            showWarehouseList(data);
        });
    }
    
    /**
     * 显示产线列表\
     */
    function showWarehouseList(data){
        //显示任务模板列表
        template.defaults.imports.dateFormat = function(date, format){
            if (date){
                return moment(date).format(format);
            }
            return '';
        };
        var html = template('warehouseTemp', data);
        $("#warehouseTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除产线
     */
    function deleteWarehouses(){
        var list = [];//项目中要删除的id集合
        var checks = $("input[type='checkbox']:checked");
        var isInitWarehouse = false;
        $.each(checks,function(index,obj){
            list.push(obj.id);
            if (obj.id <= 5){
                isInitWarehouse = true;
            }
        });
        
        if (list.length == 0){
            return;
        }
        if (isInitWarehouse){
            alert("包含初始化仓库不能删除");
            return;
        }
        
        confirm("确定要删除吗?",function(data){
            if (data){
                var deleteWarehousesUrl = 'warehouse/deleteWarehouses';
                CommonUtils.getAjaxData({
                    url : deleteWarehousesUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage[_warehousePage];
                        PageUtils.pageClick(current,_warehousePage);
                    }
                    else{
                        alert("仓库被占用无法删除");
                    }
                });
            }
        })
    }
    
    /**
     * 绑定事件
     */
    function bindEvent(){
    }
    
    
    module.init = init;
    module.deleteWarehouses = deleteWarehouses;
    return module;
}($, window.WarehouseList || {}));
$(function() {
    WarehouseList.init();
});