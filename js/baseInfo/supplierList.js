window.SupplierList = (function($,module){
    _supplierPage = 'supplierPage';
    
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
        var url = 'supplier/querySuppliersByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:_supplierPage,url : url,callback : showSupplierList},data['page']);
            showSupplierList(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showSupplierList(data){
        //显示任务模板列表
        var html = template('supplierTemp', data);
        $("#supplierTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除产线
     */
    function deleteSuppliers(){
        var list = [];//项目中要删除的id集合
        var checks = $("input[type='checkbox']:checked");
        var source = false;
        $.each(checks,function(index,obj){
            if ($(obj).attr("source") == 1){
                source = true;
            }
            list.push(obj.id);
        });
        
        if (list.length == 0){
            return;
        }
        
        if (source){
            alert("有ERP供应商无法删除");
            return;
        }
        
        confirm("确定要删除吗?",function(data){
            if (data){
                var deleteSuppliersUrl = 'supplier/deleteSuppliers';
                CommonUtils.getAjaxData({
                    url : deleteSuppliersUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage[_supplierPage];
                        PageUtils.pageClick(current,_supplierPage);
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
    module.deleteSuppliers = deleteSuppliers;
    return module;
}($, window.SupplierList || {}));
$(function() {
    SupplierList.init();
});