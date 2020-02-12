window.WorkstationList = (function($,module){
    
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
        var url = 'workstation/queryWorkstationsByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'workstationPage',url : url,callback : showWorkstationList},data['page']);
            showWorkstationList(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showWorkstationList(data){
        //显示任务模板列表
        template.defaults.imports.dateFormat = function(date, format){
            if (date){
                return moment(date).format(format);
            }
            return '';
        };
        var html = template('workstationTemp', data);
        $("#workstationTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除产线
     */
    function deleteWorkstations(){
        var list = [];//项目中要删除的id集合
        var checks = $("input[type='checkbox']:checked");
        var isInitWorkstation = false;
        $.each(checks,function(index,obj){
            if (obj.id < 11){
                isInitWorkstation = true;
            }
            list.push(obj.id);
        });
        
        if (list.length == 0){
            return;
        }
        
        if (isInitWorkstation){
            alert("包含初始化工位不能删除");
            return;
        }
        
        confirm("确定要删除吗?",function(data){
            if (data){
                // 删除产线
                var deleteWorkstationsUrl = 'workstation/deleteWorkstations';
                CommonUtils.getAjaxData({
                    url : deleteWorkstationsUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage['workstationPage'];
                        PageUtils.pageClick(current,'workstationPage');
                    }
                    else{
                        alert("工位被使用无法删除");
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
    module.deleteWorkstations = deleteWorkstations;
    return module;
}($, window.WorkstationList || {}));
$(function() {
    WorkstationList.init();
});