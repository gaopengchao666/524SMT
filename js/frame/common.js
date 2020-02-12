// ie8隔行变色
$(".tablelist tr:odd").css("background", "rgb(245, 245, 245)");
$(".tablelist tr:even").css("background", "white");

window.ScreenChange = (function($,module){
	var i=1;
    function changeBtn(para,content){
    	if(i%3==0){
    		$('#'+ para +'1').removeClass().addClass("con1");
    		$('#'+ para +'2').removeClass().addClass("con2");
    		$('#'+ para +'3').removeClass().addClass("con3");
    		$('#'+ para +'1').animate({top:"-100%"},500);
			$('#'+ para +'2').animate({top:"0"},500);
			$('#'+ para +'3').animate({top:"100%"},500);
			$('#'+ para +'3').css("z-index", "100");
    		$('#'+ para +'2').css("z-index", "200");
    		$('#'+ para +'1').css("z-index", "150");
    		$('#'+ para +'2').text(content);
    	}else if(i%3==1){
    		$('#'+ para +'1').animate({top:"100%"},500);
			$('#'+ para +'2').animate({top:"-100%"},500);
			$('#'+ para +'3').animate({top:"0%"},500);
        	$('#'+ para +'3').css("z-index", "300");
        	$('#'+ para +'3').text(content);
        	
        	$('#'+ para +'1').removeClass("con1").addClass("con3");
        	$('#'+ para +'2').removeClass("con2").addClass("con1");
        	$('#'+ para +'3').removeClass("con3").addClass("con2");
    	}else{
    		$('#'+ para +'2').animate({top:"100%"},500);
			$('#'+ para +'3').animate({top:"-100%"},500);
			$('#'+ para +'1').animate({top:"0%"},500);
        	$('#'+ para +'1').css("z-index", "300"); 
        	$('#'+ para +'1').text(content);
        	
        	$('#'+ para +'1').removeClass("con1").addClass("con3");
        	$('#'+ para +'2').removeClass("con2").addClass("con1");
        	$('#'+ para +'3').removeClass("con3").addClass("con2");
    	}
    	i++;
    }
	
	module.changeBtn = changeBtn;
	return module;
	
}($,window.ScreenChange || {}));



//获取绝对路径
function getRealPath(){
	var localObj = window.location;
	var contextPath = localObj.pathname.split("/")[1];
	var basePath = localObj.protocol + "//" + localObj.host + "/" + contextPath;
	return basePath;                                                       
}