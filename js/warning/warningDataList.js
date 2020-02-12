window.WarningDataList = (function($,module){
    _status = {'0':'未处理','1':'已处理'},
    _warningDataPage = "warningDataPage";
    
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
        var warningType = $("input[name='warningType']").val();
        var url = 'warningdata/queryWarningDatasByPage?warningType=' + warningType;
        CommonUtils.getAjaxData({url:url,type:'GET'},function(data){
            PageUtils.refreshPageInfo({element:'warningDataPage',url : url,callback : showWarningDataList},data['page']);
            showWarningDataList(data);
        });
    }
    
    /**
     * 显示产线列表
     */
    function showWarningDataList(data){
        //显示任务模板列表
        template.defaults.imports.statusFormat = function(data){
            return _status[data];
        };
        template.defaults.imports.dateFormat = function(date, format){
            if (date){
                return moment(date).format(format);
            }
            return '';
        };
        var html = template('warningDataTemp', data);
        $("#warningDataTab").html("").html(html);
        // ie8隔行变色
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 绑定事件
     */
    function bindEvent(){
        //开始时间
        $("input[name='receiveTimeStr']").datepicker({
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
     * 完成预警信息
     */
    function completeWarning(warningId,planNumber,graphNumber,source){
        
        confirm("确定要处理该预警吗?",function(flag){
            if (flag){
                var params = {'planNumber':planNumber,'graphNumber':graphNumber};
                //判断该示警信息 是否满足 完成条件
                CommonUtils.getAjaxData({url:'warningdata/queryPlanOrderStatus',type:'GET',data:params},function(data){
                    if (source == 0 && data == '未排产'){
                        alert("该订单还未排产不能关闭该预警");
                        return;
                    }
                    else if(source == 1 && data == '生产中'){
                        alert("该订单还在生产中不能关闭该预警");
                        return;
                    }
                    
                    CommonUtils.getAjaxData({url:'warningdata/completeWarning?warningId='+warningId,type:'GET'},function(data){
                        if (data == 'success'){
                            //刷新当前分页数据
                            var current = PageUtils._currentPage[_warningDataPage];
                            PageUtils.pageClick(current,_warningDataPage);
                        }
                    })
                });
            }
        });
    }
    
    module.init = init;
    module.completeWarning = completeWarning;
    return module;
}($, window.WarningDataList || {}));
$(function() {
    WarningDataList.init();
});