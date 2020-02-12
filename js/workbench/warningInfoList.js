window.WarningInfoList = (function($,module){
    _warningType = {'1':'未按时排产','2':'未按时完工','3':'温度告警','4':'湿度告警','5':'一次交验合格率',
            '6':'直通率低','7':'安全库存补料延期','8':'机损补料延期','9':'安全库存不足','10':'安全库存超限',
            '11':'有效期临近','12':'有效期超出','13':'齐套补料延期'}
    
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
        //更新页签的预警和待办事项数量
        self.parent.menuFrame.updateWorkBeach();
        //更新page信息
        var url = 'warning/queryWarningInfosByPage';
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'warningInfoPage',url : url,callback : showWarningInfo},data['page']);
            showWarningInfo(data);
        });
    }
    
    /**
     * 绑定事件
     */
    function bindEvent(){
        //开始时间
        $("input[name='createTime']").datepicker({
            dateFormat : 'yy-mm-dd',
            changeYear:true,
            changeMonth:true,
            showOn:"button",
            monthNamesShort:["January","February","March","April","May","June", "July","August","September","October","November","December"],
            buttonImage:basePath+"img/button/calendar.png",
            buttonImageOnly:false 
        });
    }
    
    /**
     * 显示列表
     */
    function showWarningInfo(data){
        //显示任务模板列表
        template.defaults.imports.dateFormat = function(date, format){
            if (date){
                return moment(date).format(format);
            }
            return '';
        };
        template.defaults.imports.typeFormat = function(data){
            //车间生产异常预警
            if ([11,12].indexOf(data) > -1){
                return "有效期预警";
            }
            else if ([9,10].indexOf(data) > -1){
                return "安全库存预警";
            }
            else{
                return "生产异常预警";
            }
        };
        var html = template('warningInfoTemp', data);
        $("#warningInfoTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 更新待办事项状态
     */
    function updateStatus(id,warningType){
        //安全库存不足  需要跳转页面确定后才能修改状态
    }
    
    module.init = init;
    module.updateStatus = updateStatus;
    return module;
}($, window.WarningInfoList || {}));
$(function() {
    WarningInfoList.init();
});