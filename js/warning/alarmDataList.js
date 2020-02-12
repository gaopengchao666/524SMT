window.AlarmDataList = (function($,module){
    _warningType = {'3':'温度告警','4':'湿度告警','5':'一次交验合格率','6':'直通率低','7':'缺料','8':'设备异常'}
    
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
        var url = 'alarmdata/queryAlarmDatasByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'alarmDataPage',url : url,callback : showAlarmDataList},data['page']);
            showAlarmDataList(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showAlarmDataList(data){
        //显示任务模板列表
        template.defaults.imports.typeFormat = function(data){
            return _warningType[data];
        };
        template.defaults.imports.dateFormat = function(date, format){
            if (date){
                return moment(date).format(format);
            }
            return '';
        };
        var html = template('alarmDataTemp', data);
        $("#alarmDataTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
        //更新待办事项状态
        self.parent.menuFrame.updateWorkBeach();
    }
    
    /**
     * 删除告警数据
     */
    function deleteAlarmDatas(){
        var list = [];//项目中要删除的id集合
        var checks = $("input[type='checkbox']:checked");
        $.each(checks,function(index,obj){
            list.push({alarmId:obj.id,warningType:$(obj).attr("warningType"),params:$(obj).attr("params")});
        });
        
        if (list.length == 0){
            return;
        }
        
        confirm("确定要删除吗?",function(data){
            if (data){
                // 删除告警数据
                var deleteAlarmDatasUrl = 'alarmdata/deleteAlarmDatas';
                CommonUtils.getAjaxData({
                    url : deleteAlarmDatasUrl,
                    data : JSON.stringify(list),
                    type : 'POST'
                }, function(data) {
                    if(data=="success"){
                        //刷新当前分页数据
                        var current = PageUtils._currentPage['alarmDataPage'];
                        PageUtils.pageClick(current,'alarmDataPage');
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
    module.deleteAlarmDatas = deleteAlarmDatas;
    return module;
}($, window.AlarmDataList || {}));
$(function() {
    AlarmDataList.init();
});