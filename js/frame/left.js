// ------------ 获取屏幕可视区高度 -----------
var h = document.documentElement.clientHeight;
$(".wrap").css("height", h);
$("#tree").css("height", h);
// ------------ 下滑菜单列表 -----------
$(document).ready(function(){
	
	$(".level1").each(function(){	
		$(this).attr("href", "javascript:void(0)");
	});
	
	$(".level1").click(function(){
	    $(this).next().slideToggle(300);
		var arrow =  $(this).children(0).children(0);
	    if (arrow.hasClass('arrow1')) {
	    	arrow.removeClass("arrow1").addClass("arrow2");
	    } else{
	    	arrow.removeClass("arrow2").addClass("arrow1");
	    }
	});
	$(".level2").click(function(){
		$(".menu_selected").removeClass("menu_selected");
		$(this).addClass("menu_selected");
		$(".left_file").removeClass("menu_selected_icon");
		$(this).children(0).addClass("menu_selected_icon");
		
		var title = this.innerHTML.substring(this.innerHTML.indexOf("</span>") + 7);
		var url = $(this).attr("url");
		var id = $(this).attr("id"); 
		self.parent.frames.welcomeFrame.addTab(id,title,url);
	});
});