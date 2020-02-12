window.ProjectList = (function($,module){
    
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
        var url = 'project/queryProjectsByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'projectPage',url : url,callback : showProjectList},data['page']);
            showProjectList(data);
        });
    }
    
    /**
     * 显示项目列表
     */
    function showProjectList(data){
        //显示任务模板列表
        template.defaults.imports.dateFormat = function(date, format){
            if (date){
                return moment(date).format(format);
            }
            return '';
        };
        var html = template('projectTemp', data);
        $("#projectTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除项目
     */
    function deleteProjects(){
        var list = [];//项目中要删除的id集合
        var checks = $("input[type='checkbox']:checked");
        $.each(checks,function(index,obj){
            list.push(obj.id);
        });
        
        if (list.length == 0){
            return;
        }
        
        confirm("确定要删除吗?",function(data){
            if (data){
                // 删除项目
                var deleteProjectsUrl = 'project/deleteProjects';
                CommonUtils.getAjaxData({
                    url : deleteProjectsUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage['projectPage'];
                        PageUtils.pageClick(current,'projectPage');
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
    module.deleteProjects = deleteProjects;
    return module;
}($, window.ProjectList || {}));
$(function() {
    ProjectList.init();
});