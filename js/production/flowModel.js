window.FlowModel = (function($,module){
    
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
        var url = 'flowmodel/queryFlowModelsByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'flowModelPage',url : url,callback : showFlowModel},data['page']);
            showFlowModel(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showFlowModel(data){
        //显示任务模板列表
        template.defaults.imports.dateFormat = function(date, format){
            if (date){
                return moment(date).format(format);
            }
            return '';
        };
        var html = template('flowModelTemp', data);
        $("#flowModelTab").html("").html(html);
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
}($, window.FlowModel || {}));
$(function() {
    FlowModel.init();
});