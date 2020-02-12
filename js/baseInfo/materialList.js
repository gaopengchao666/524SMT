window.MaterialList = (function($,module){
    _materialPage = 'materialPage';
    
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
        var url = 'material/queryMaterialsByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:_materialPage,url : url,callback : showMaterialList},data['page']);
            showMaterialList(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showMaterialList(data){
        //显示任务模板列表
        var html = template('materialTemp', data);
        $("#materialTab").html("").html(html);
        
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除产线
     */
    function deleteMaterials(){
        var list = [];//项目中要删除的id集合
        var checks = $("input[type='checkbox']:checked");
        var source = false;
        $.each(checks,function(index,obj){
            if ($(obj).attr("source") == 1){
                source = true;
            }
            list.push({materialId:obj.id,materialCode:$(obj).attr("materialCode")});
        });
        
        if (list.length == 0){
            return;
        }
        
        if (source){
            alert("有ERP物料无法删除");
            return;
        }
        
        confirm("确定要删除吗?",function(data){
            if (data){
                var deleteMaterialsUrl = 'material/deleteMaterials';
                CommonUtils.getAjaxData({
                    url : deleteMaterialsUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage[_materialPage];
                        PageUtils.pageClick(current,_materialPage);
                    }
                    else{
                        alert("物料被占用无法删除");
                        return;
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
    module.deleteMaterials = deleteMaterials;
    return module;
}($, window.MaterialList || {}));
$(function() {
    MaterialList.init();
});