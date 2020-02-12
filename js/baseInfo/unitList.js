window.UnitList = (function($,module){
    _unitPage = 'unitPage';
    
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
        var url = 'unit/queryUnitsByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:_unitPage,url : url,callback : showUnitList},data['page']);
            showUnitList(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showUnitList(data){
        //显示任务模板列表
        var html = template('unitTemp', data);
        $("#unitTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除产线
     */
    function deleteUnits(){
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
            alert("有ERP计量单位无法删除");
            return;
        }
        
        confirm("确定要删除吗?",function(data){
            if (data){
                var deleteUnitsUrl = 'unit/deleteUnits';
                CommonUtils.getAjaxData({
                    url : deleteUnitsUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage[_unitPage];
                        PageUtils.pageClick(current,_unitPage);
                    }
                    else{
                        alert("计量单位被占用无法删除");
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
    module.deleteUnits = deleteUnits;
    return module;
}($, window.UnitList || {}));
$(function() {
    UnitList.init();
});