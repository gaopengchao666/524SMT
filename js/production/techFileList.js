window.TechFileList = (function($,module){
    
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
        var url = 'techfile/queryTechFilesByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'techFilePage',url : url,callback : showTechFileList},data['page']);
            showTechFileList(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showTechFileList(data){
        //显示任务模板列表
        template.defaults.imports.dateFormat = function(date, format){
            if (date){
                return moment(date).format(format);
            }
            return '';
        };
        var html = template('techFileTemp', data);
        $("#techFileTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 删除产线
     */
    function deleteTechFiles(){
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
                // 删除工艺文件
                var deleteTechFilesUrl = 'techfile/deleteTechFiles';
                CommonUtils.getAjaxData({
                    url : deleteTechFilesUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage['techFilePage'];
                        PageUtils.pageClick(current,'techFilePage');
                    }
                    else{
                        alert("工艺文件被占用无法删除");
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
    module.deleteTechFiles = deleteTechFiles;
    return module;
}($, window.TechFileList || {}));
$(function() {
    TechFileList.init();
});