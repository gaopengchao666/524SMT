window.FlowDetail = (function($,module){
    
    /**
     * 初始化
     */
    function init(){
        initPageInfo();
    }
    
    /**
     * 加载页面
     */
    function initPageInfo(){
        CommonUtils.ie8TrChangeColor();
    }
    module.init = init;
    return module;
}($, window.FlowDetail || {}));
$(function() {
    FlowDetail.init();
});