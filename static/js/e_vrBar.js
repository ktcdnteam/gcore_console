
jQuery(function($){
    // Vertical Navigation
    var vNav = $('.vNav');
    var vNav_i = vNav.find('.vdepth1');
    var vNav_ii = vNav.find('.vdepth2');
    
    var vNav_iii = vNav.find('>ul>li>ul>li>ul>li');
    
    //전체 메뉴 닫기
    vNav_i.find('ul').hide();
    vNav_ii.find('ul').hide();
    vNav_iii.find('ul').hide();
        
    vNav.find('>ul>li>ul>li>ul>li[class=active]').parents('li').attr('class','active');
    vNav.find('>ul>li>ul>li[class=active]').parents('li').attr('class','active');
    vNav.find('>ul>li[class=active]').find('>ul').show();
        
    function vNavToggle(event){
        event.preventDefault();
        var t = $(this);
        console.log(t)
        vNav_i.removeClass('active');
        
        if (t.find('ul').first().is(':hidden')) {            //닫혀있는상태
            vNav_i.find('ul').slideUp(100);            //다른 모든 UL 닫기(1depth)
            t.find('ul').first().slideDown(100);    //현재 클릭한 UL 열기(1depth)
            t.addClass('active');
            
            var prev_position = t.offset().top;
            
            setTimeout(function(){
                set_re_position(t, prev_position);
            }, 100);
        } else if (t.find('ul').first().is(':visible')){    //열려있는 상태
            t.find('ul').slideUp(100);                //현재 클릭한 UL 닫기(1depth)
            t.removeClass('active');
        } else if (!t.next('ul').langth) {            //ul이 없는 경우
            vNav_i.find('ul').slideUp(100);
            t.removeClass('active');
        }
//        vNav_i.removeClass('active');
//        vNav_ii.removeClass('active');
        
        return false;
    }
    
    function url(event){
        event.preventDefault();
        var t = $(this);
        window.location.href = t.find("a").attr("href");
        
        return false;
    }
    
    function set_re_position(t, prev_position) {
        var curr_position = t.offset().top;
        var curr_scrlltop = $('#inner_lnb_div').scrollTop();
        
        if(curr_position < 0) {
            $('#inner_lnb_div').scrollTop(0);
        } else if(curr_position < 100) {
            $('#inner_lnb_div').scrollTop(curr_scrlltop - 100);
        }
        
        if(t.find("ul") &&
           t.find("ul").attr("id") &&
           t.find("ul").attr("id").split("sid_") &&
           t.find("ul").attr("id").split("sid_").length == 2) {
            var service_name = t.find("ul").attr("id").split("sid_")[1];
            cnb_resource_count(service_name);
        }
        
//        else if(prev_position != curr_position) {
//            $('#inner_lnb_div').scrollTop(prev_position);
//        }
        
/*        var main_menu_objs = parent_div.children("div").children("ul").children("li");
        
        main_menu_objs.each(function() {
            if($(this).hasClass("vdepth1") && $(this).hasClass(svc_name)) {
                    $(this).addClass("active");
            }
        });*/
    }
        
    $('.vdepth2').click(url);
    $('.vdepth1').click(vNavToggle);
//    $('.vdepth2').click(vNavToggle2);
    
    
    vNav.find('>ul>li>ul').prev('a').append('<span class="i"></span>');
    vNav.find('>ul>li>ul>li>ul').prev('a').append('<span class="i"></span>');
        
});
