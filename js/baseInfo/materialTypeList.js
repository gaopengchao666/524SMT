window.MaterialTypeList = (function($,module){
    _materialTypePage = 'materialTypePage';
    
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
        var url = 'materialtype/queryMaterialTypesByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:_materialTypePage,url : url,callback : showMaterialTypeList},data['page']);
            showMaterialTypeList(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showMaterialTypeList(data){
        //显示任务模板列表
        var html = template('materialTypeTemp', data);
        $("#materialTypeTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除产线
     */
    function deleteMaterialTypes(){
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
            alert("含有物料类型来自ERP,无法删除");
            return;
        }
        
        window.confirm("确定要删除吗?",function(data){
            if (data){
                var deleteMaterialTypesUrl = 'materialtype/deleteMaterialTypes';
                CommonUtils.getAjaxData({
                    url : deleteMaterialTypesUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage[_materialTypePage];
                        PageUtils.pageClick(current,_materialTypePage);
                    }
                    else{
                        window.alert("物料类型被占用无法删除")
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
    module.deleteMaterialTypes = deleteMaterialTypes;
    return module;
}($, window.MaterialTypeList || {}));
$(function() {
    MaterialTypeList.init();
});