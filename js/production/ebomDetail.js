
window.EbomDetail = (function($,module){
    
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
        var graphNumber = $("input[name='graphNumber']").val();
        //更新EBOM分页信息
        var url = 'bom/queryEbomDetailByPage?graphNumber=' + encodeURI(graphNumber);
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'ebomDetailPage',url : url,callback : showEbomDetail},data['page']);
            showEbomDetail(data);
        });
    }
    
    /**
     * 显示EBOM详情列表
     */
    function showEbomDetail(data){
        var html = template('ebomDetailTemp', data);
        $("#ebomDetailTab").html("").html(html);
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
}($, window.EbomDetail || {}));
$(function() {
    EbomDetail.init();
});