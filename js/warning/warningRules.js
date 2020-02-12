window.WarningRules = (function($,module){
    _warningType = {'5':'一次交验合格率','6':'直通率低','7':'缺料','8':'设备异常'},
    _validate = null,
    _ruleForm = $("#addRuleForm"),
    _ruleTr = $("#ruleTr");
    
    /**
     * 初始化
     */
    function init(){
        bindEvent();
        initPage();
    }
    
    /**
     * 初始化页面信息
     */
    function initPage(){
        //初始化页面 增加校验
        var lenth =  _ruleTr.find("tr").length;
        //超过2条 说明是自定义规则 需要添加校验
        if (lenth > 2){
            for (var i=0;i<length-2;i++){
                addValidate(lenth+4+i);
            }
        }
    }
    
    /**
     * 绑定事件
     */
    function bindEvent(){
        _validate = _ruleForm.validate({
            rules : {
                'rules[0].lowerThreshold' : {
                    required : true,
                    digits:true,
                    min:0,
                    max:1000
                },
                'rules[1].lowerThreshold' : {
                    required : true,
                    digits:true,
                    min:0,
                    max:1000
                },
                'rules[2].lowerThreshold' : {
                    required : true,
                    digits:true,
                    range:[0,50]
                },
                'rules[2].higherThreshold' : {
                    required : true,
                    digits:true,
                    range:[0,50]
                },
                'rules[3].lowerThreshold' : {
                    required : true,
                    digits:true,
                    range:[0,100]
                },
                'rules[3].higherThreshold' : {
                    required : true,
                    digits:true,
                    range:[0,100]
                },
                'rules[4].lowerThreshold' : {
                    required : true,
                    digits:true
                },
                'rules[5].lowerThreshold' : {
                    required : true,
                    digits:true
                }
            },
            messages : {
                'rules[0].lowerThreshold' : {
                    required : "不能为空",
                    digits:"必须为整数",
                    min:"最小值为0",
                    max:"最大值为1000"
                },
                'rules[1].lowerThreshold' : {
                    required : "不能为空",
                    digits:"必须为整数",
                    min:"最小值为0",
                    max:"最大值为1000"
                },
                'rules[2].lowerThreshold' : {
                    required : "不能为空",
                    digits:"必须为整数",
                    range:"请输入0-50摄氏度"
                },
                'rules[2].higherThreshold' : {
                    required : "不能为空",
                    digits:"必须为整数",
                    range:"请输入0-50摄氏度"
                },
                'rules[3].lowerThreshold' : {
                    required : "不能为空",
                    digits:"必须为整数",
                    range:"请输入0-100"
                },
                'rules[3].higherThreshold' : {
                    required : "不能为空",
                    digits:"必须为整数",
                    range:"请输入0-100"
                },
                'rules[4].lowerThreshold' : {
                    required : "不能为空",
                    digits:"必须为整数"
                },
                'rules[5].lowerThreshold' : {
                    required : "不能为空",
                    digits:"必须为整数"
                }
            }
        });
        
        CommonUtils.ie8TrChangeColor();
    }
    
    /**
     * 保存示警规则
     */
    function saveWarningRules(){
        if (!_ruleForm.valid()){
            return;
        }
        var temHigh = $("input[name='rules[2].higherThreshold']").val();
        var temLow = $("input[name='rules[2].lowerThreshold']").val();
        
        var humHigh = $("input[name='rules[3].higherThreshold']").val();
        var humLow = $("input[name='rules[3].lowerThreshold']").val();
        if (parseInt(temHigh) <= parseInt(temLow)){
            alert("温度上限不能小于下限");
            return;
        }
        if (parseInt(humHigh) <= parseInt(humLow)){
            alert("湿度上限不能小于下限");
            return;
        }
        
        var rules = [];
        var length = $(".ruleTable").find("tr").length;
        for (var i=0;i<length-1;i++){
            var rule = CommonUtils.serializeToObject(_ruleForm,"rules["+i+"]");
            rules.push(rule);
        }
        CommonUtils.getAjaxData({type:'post',url:'warningrules/saveWarningRules',data:JSON.stringify(rules)},function(data){
            if (data != 'success'){
                alert("保存失败");
            }
            else{
                alert("保存成功");
            }
        });
    }
    
    /**
     * 添加示警规则tr
     */
    function addDetail(){
        var lenth =  _ruleTr.find("tr").length;
        //自定义规则 默认最大数量为10
        if (lenth >= 12){
            return;
        }
        var index = lenth + 4;
        var html = template('warningRulesTemp',{'index':index});
        _ruleTr.append(html);
        CommonUtils.ie8TrChangeColor();
        //添加校验规则
        addValidate(index);
    }
    
    /**
     * 增加校验规则
     */
    function addValidate(index) {
        //增加校验规则
        var ruleName = "rules["+ index + "].typeName";
        var lowerThreshold = "rules["+ index + "].lowerThreshold";
        var rules = {};
        rules[ruleName] = {
            required : true,
            maxlength : 255
        };
        rules[lowerThreshold] = {
            required : true,
            digits : true
        };
        $.extend(_validate.settings.rules, rules);
        var messages = {};
        messages[ruleName] = {
                required : "不能为空",
                maxlength : "最大长度255"
        };
        messages[lowerThreshold] = {
                required : "不能为空",
                digits : "必须为整数"
        };
        $.extend(_validate.settings.messages, messages);
    }
    
    /**
     * 删除tr
     */
    function deleteDetail(){
        var tr = _ruleTr.find("tr:last");
        if (_ruleTr.find("tr").length > 2){
            $(tr).remove();
        }
    }
    module.init = init;
    module.saveWarningRules = saveWarningRules;
    module.addDetail = addDetail;
    module.deleteDetail = deleteDetail;
    return module;
}($, window.WarningRules || {}));
$(function() {
    WarningRules.init();
});