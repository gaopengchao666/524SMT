
window.pbomDetail = (function($,module){
    
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
        
        //更新PBOM分页信息
        var url = 'bom/queryPbomDetailByPage?graphNumber='+encodeURI(graphNumber);
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'pbomDetailPage',url : url,callback : showPbomDetail},data['page']);
            showPbomDetail(data);
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
     * 显示PBOM详情列表
     */
    function showPbomDetail(data){
        var html = template('pbomDetailTemp', data);
        $("#pbomDetailTab").html("").html(html);
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
}($, window.pbomDetail || {}));
$(function() {
    pbomDetail.init();
});