window.EdgeMaterial = (function($,module){
    
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
        var url = 'edgematerial/queryEdgeMaterialsByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'edgeMaterialPage',url : url,callback : showEdgeMaterials},data['page']);
            showEdgeMaterials(data);
        });
    }
    
    /**
     * 显示线边物资列表
     */
    function showEdgeMaterials(data){
        //显示任务模板列表
        template.defaults.imports.dateFormat = function(date, format){
            if (date){
                return moment(date).format(format);
            }
            return '';
        };
        var html = template('edgeMaterialTemp', data);
        $("#edgeMaterialTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    
    /**
     * 绑定事件
     */
    function bindEvent(){
    }
    
    
    module.init = init;
    return module;
}($, window.EdgeMaterial || {}));
$(function() {
    EdgeMaterial.init();
});