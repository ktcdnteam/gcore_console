jQuery(function($){
    
    $(document).ready(function(){        
        scrollcontroll();
        
        $(window).resize( function(){
            scrollcontroll();
        });    
        
        
        //툴팁 visible
        tooltip("tooltip_left", "tooltip_sm2");
        tooltip("tooltip_right", "tooltip_sm3");
        tooltip("tooltip_left", "tooltip_sm4");
        // 툴팁 ::before left
        function tooltip(id, tipid){
            $("."+id).on("hover", function(){
                let tooltip_sm2 = $(this).closest(".pr").find("."+tipid);
                let tooltip = tooltip_sm2.is(":visible");

                if(tooltip == false){
                    tooltip_sm2.addClass("on");
                } else {
                    tooltip_sm2.removeClass("on");
                }
            });
        }
        // 툴팁 ::before right
        function tooltip(id2, tipid2){
            $("."+id2).on("hover", function(){
                let tooltip_sm3 = $(this).closest(".pr").find("."+tipid2);
                let tooltip = tooltip_sm3.is(":visible");

                if(tooltip == false){
                    tooltip_sm3.addClass("on");
                } else {
                    tooltip_sm3.removeClass("on");
                }
            });
            
        
        }
        
     // 툴팁 ::before top화살표
        function tooltip(id3, tipid3){
            $("."+id3).on("hover", function(){
                let tooltip_sm4 = $(this).closest(".pr").find("."+tipid3);
                let tooltip = tooltip_sm4.is(":visible");
    
                if(tooltip == false){
                    tooltip_sm4.addClass("on");
                } else {
                    tooltip_sm4.removeClass("on");
                }
            });
        }
        
    });
    
    
    
    
    /* icheck Checkbox  */
      var checkBox = $('.icheck');
      var addClassCheckBox = function($input) {
        if ($input.prop('checked')) {
          $input.parent().addClass('checked');
        } else {
          $input.parent().removeClass('checked');
        }
      };
      checkBox.on('change', 'input', function() {
        addClassCheckBox($(this));
      })
      
      /*tooltip top left 자동계산*/
      $(".tx_help_tooltip").mouseover(function() {
        var no = $(this).attr('no');
        var tx_layer = $(".tx_layer_tooltip[no='" + no + "']"); 
        
        tx_layer.css( "top",$(this).position().bottom - 95 + tx_layer.parent().scrollTop() ).css( "left",$(this).position().left - 11 );      
                
        //$(".tx_layer_tooltip").show();
        
        var cont = (tx_layer.css("display") === "none") 
        ? "block"
        : "none"; 
        tx_layer.css("display", cont); 
      });
  
      $(".tx_help_tooltip").mouseout(function() {
        var no = $(this).attr('no');
        var tx_layer = $(".tx_layer_tooltip[no='" + no + "']"); 
        
        tx_layer.css( "top",$(this).position().bottom + -95 + tx_layer.parent().scrollTop() ).css( "left",$(this).position().left + 11 ); 
        
        //$(".tx_layer_tooltip").hide();
                
        var cont = (tx_layer.css("display") === "none") 
        ? "block"
        : "none"; 
        tx_layer.css("display", cont); 
      });
        
      
//      selectbox_design();    
        
});



//셀렉박스 디자인
function selectbox_design(obj){
    var x, i, j, l, ll, selElmnt, a, b, c;
    x = document.getElementsByClassName("custom-select");
    
    l = x.length;
    for (i = 0; i < l; i++) {
        selElmnt = x[i].getElementsByTagName("select")[0];
        if ( selElmnt == undefined || selElmnt == null )    {       // class 태그를 잘못 입력했을 경우에도 에러발생하지 않도록 예외처리 추가. 2022.04.12 captainPark
            continue;
        }
        
        if(obj != undefined){
            if(obj.attr("id") != selElmnt.getAttribute("id")){
                continue;
            }else{
                $("#"+selElmnt.getAttribute("id")).parent().find(".select-selected").remove();
                $("#"+selElmnt.getAttribute("id")).parent().find(".select-items").remove();              
            }
        }
        ll = selElmnt.length;
        if(ll == 0){
            continue;
        }
        
        /*for each element, create a new DIV that will act as the selected item:*/
        
        if(selElmnt.options[selElmnt.selectedIndex].getAttribute("style") == "display:none;"){
            a = document.createElement("DIV");
            a.setAttribute("class", "select-selected");
            var text_length = parseInt(selElmnt.getAttribute("text_length"));
            if(a.innerHTML.length > text_length ){
                a.innerHTML = a.innerHTML.substring(0,text_length)+"..";
            }
            
            if(selElmnt.getAttribute("text_length")){
                var text_length = parseInt(selElmnt.getAttribute("text_length"));
                if(a.innerHTML.length > text_length ){
                    a.innerHTML = a.innerHTML.substring(0,text_length)+"..";
                }
            } else if(a.innerHTML.length > 20 && !selElmnt.classList.contains('ltxt') ){
                a.innerHTML = a.innerHTML.substring(0,45)+"..";
            }

            x[i].appendChild(a);
            /*for each element, create a new DIV that will contain the option list:*/

            b = document.createElement("DIV");
            b.setAttribute("class", "select-items select-hide");
            b.setAttribute("id", "vm_slim");
            
            
            if(selElmnt.getAttribute("id") == "text_month" || selElmnt.getAttribute("id") == "text_date" || selElmnt.getAttribute("id") == "text_date1" || selElmnt.getAttribute("id") == "select_month"){
                b.setAttribute("style", "max-height:103px; overflow-y:auto;");
            }else{
                b.setAttribute("style", "max-height:250px; overflow-y:auto;");
            }
            
            
        }else{
            a = document.createElement("DIV");
            a.setAttribute("class", "select-selected");
            a.innerHTML = selElmnt.options[selElmnt.selectedIndex].innerHTML;
            
            if(selElmnt.getAttribute("text_length")){
                var text_length = parseInt(selElmnt.getAttribute("text_length"));
                if(a.innerHTML.length > text_length ){
                    a.innerHTML = a.innerHTML.substring(0,text_length)+"..";
                }
            }else if(a.innerHTML.length > 25 && !selElmnt.classList.contains('ltxt')){
                    a.innerHTML = a.innerHTML.substring(0,45)+"..";
            }
            
            x[i].appendChild(a);
            /*for each element, create a new DIV that will contain the option list:*/
            
            //스크롤 추가
            /*
            f = document.createElement("DIV");
            f.setAttribute("class", "slimscrollcls scroll_test_hide");
            f.setAttribute("id", "vm_slim");
            */
            b = document.createElement("DIV");
            b.setAttribute("class", "select-items select-hide");
            b.setAttribute("id", "vm_slim");
            
            
            if(selElmnt.getAttribute("id") == "text_month" || selElmnt.getAttribute("id") == "text_date" || selElmnt.getAttribute("id") == "text_date1" || selElmnt.getAttribute("id") == "select_month"){
                b.setAttribute("style", "max-height:103px; overflow-y:auto;");
            }else{
                b.setAttribute("style", "max-height:250px; overflow-y:auto;");
            }
            
            
        }

        for (j = 0; j < ll; j++) {
            /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
            if(selElmnt.options[j].getAttribute("style") == "display:none;"){
                continue;
            }
            c = document.createElement("DIV");
            c.innerHTML = selElmnt.options[j].innerHTML;
            c.setAttribute("value",selElmnt.options[j].value);
            c.addEventListener("click", function(e) {
                /*when an item is clicked, update the original select box,
            and the selected item:*/
                var y, i, k, s, h, sl, yl;
                s = this.parentNode.parentNode.getElementsByTagName("select")[0];
                sl = s.length;
                h = this.parentNode.previousSibling;
                for (i = 0; i < sl; i++) {
                    if (s.options[i].value == this.getAttribute('value')) {
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        if(s.getAttribute("text_length")){
                            var text_length = parseInt(s.getAttribute("text_length"));
                            if(h.innerHTML.length > text_length ){
                                h.innerHTML = h.innerHTML.substring(0,text_length)+"..";
                            }
                        } else if(h.innerHTML.length > 20 && !selElmnt.classList.contains('ltxt')){
                            h.innerHTML = h.innerHTML.substring(0,45)+"..";
                        }

                        s.options[i].setAttribute("selected","selected");
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        $("#"+s.getAttribute("id")).trigger("change");
                    }else if (s.options[i].innerHTML == this.innerHTML){
                        s.selectedIndex = i;
                        h.innerHTML = this.innerHTML;
                        
                        if(s.getAttribute("text_length")){
                            var text_length = parseInt(s.getAttribute("text_length"));
                            if(h.innerHTML.length > text_length ){
                                h.innerHTML = h.innerHTML.substring(0,text_length)+"..";
                            }
                        } else if(h.innerHTML.length > 20 && !selElmnt.classList.contains('ltxt')){
                            h.innerHTML = h.innerHTML.substring(0,45)+"..";
                        }

                        s.options[i].setAttribute("selected","selected");
                        y = this.parentNode.getElementsByClassName("same-as-selected");
                        yl = y.length;
                        for (k = 0; k < yl; k++) {
                            y[k].removeAttribute("class");
                        }
                        this.setAttribute("class", "same-as-selected");
                        $("#"+s.getAttribute("id")).trigger("change");
                    
                    }else{
                        s.options[i].removeAttribute("selected");
                    }
                }
                h.click();
            });
            b.appendChild(c);
        }
        x[i].appendChild(b);
        
        a.addEventListener("click", function(e) {
            /*when the select box is clicked, close any other select boxes,
          and open/close the current select box:*/
            
            e.stopPropagation();
            
            if(this.parentElement.children[0].getAttribute("disabled") == "disabled"){
                return;
            }
            closeAllSelect(this);
            this.nextSibling.classList.toggle("select-hide");
            this.classList.toggle("select-arrow-active");
            scrollOff();
            
        });
        
    }
    
    document.addEventListener("click", closeAllSelect);
    
}




function closeAllSelect(elmnt) {
    /*a function that will close all select boxes in the document,
      except the current select box:*/
    var x, y, z , i, xl, yl,zl, arrNo = [];
    x = document.getElementsByClassName("select-items");
    y = document.getElementsByClassName("select-selected");
    xl = x.length;
    yl = y.length;

    for (i = 0; i < yl; i++) {
        if (elmnt == y[i]) {
            arrNo.push(i)
        } else {
            y[i].classList.remove("select-arrow-active");
            scrollOn();
        }
    }
    
    for (i = 0; i < xl; i++) {
        if (arrNo.indexOf(i)) {
            x[i].classList.add("select-hide");
            scrollOn();
        }

    }

}

//셀렉트 이외 스크롤 막음
function scrollOff(){
    
    $('.custom-select').on('scroll touchmove mousewheel', function(e) {
           e.stopPropagation();
        });

}

//막음 해제
function scrollOn(){
    $('.custom-select').off('scroll touchmove mousewheel');
    
}


//텍스트 박스만 스크롤 고정
function scrollcontroll(){
    
    var mainmenusize = document.body.offsetWidth;
    var csN = [".cs1", ".cs2", ".cs3", ".cs4", ".cs5",".ds3",".vs3"];
    var innerN = ["#inner_lnb_div1", "#inner_lnb_div2"];
    
    if(mainmenusize <= 1910 && mainmenusize > 1740) {
        
            //scroll_notab
            if($('.scroll_notab').hasClass("usage") || $('.scroll_notab').hasClass("lg2") || $('.scroll_notab').hasClass("lg") || $('.scroll_notab').hasClass("dnstatis")){
                $(".sub_con_box_c").find('.slimScrollBar').css("visibility","hidden");
                $('.sub_con_box_c').on('scroll touchmove mousewheel', function(e) {
                       e.stopPropagation();
                    });        
                
                for(var i=0; i<csN.length;i++){
                    $(".vmsel").find(csN[i]).css("overflow","auto");
                }
                
            }else{
                $(".sub_con_box_c").find('.slimScrollBar').css("visibility","visible");
                $('.sub_con_box_c').off('scroll touchmove mousewheel');
                
                for(var i=0; i<csN.length;i++){
                    $(".vmsel").find(csN[i]).css("overflow","hidden");
                }
                for(var a=0; a<innerN.length;a++){
                    $(".vmsel").find(innerN[a]).css("overflow","hidden");
                }
                            
            }
        
        
    }else if(mainmenusize <= 1740 && mainmenusize > 1510) {
        
            //scroll_notab & scroll_tab
            if($('.scroll_tab').hasClass("lg2") || $('.scroll_tab').hasClass("lg") || $('.scroll_notab').hasClass("usage") || $('.scroll_notab').hasClass("lg2") || $('.scroll_notab').hasClass("lg") || $('.scroll_notab').hasClass("dnstatis")){
                $(".sub_con_box_c").find('.slimScrollBar').css("visibility","hidden");
                $('.sub_con_box_c').on('scroll touchmove mousewheel', function(e) {
                       e.stopPropagation();
                    });
                
                for(var i=0; i<csN.length;i++){
                    $(".vmsel").find(csN[i]).css("overflow","auto");                    
                }
            }else{
                $(".sub_con_box_c").find('.slimScrollBar').css("visibility","visible");
                $('.sub_con_box_c').off('scroll touchmove mousewheel');
                
                for(var i=0; i<csN.length;i++){
                    $(".vmsel").find(csN[i]).css("overflow","hidden");
                }
                for(var a=0; a<innerN.length;a++){
                    $(".vmsel").find(innerN[a]).css("overflow","hidden");
                }
            }
        
        
    }else if(mainmenusize <= 1510) {
            $(".sub_con_box_c").find('.slimScrollBar').css("visibility","hidden");
            $('.sub_con_box_c').on('scroll touchmove mousewheel', function(e) {
                   e.stopPropagation();
                });
            
            for(var i=0; i<csN.length;i++){
                $(".vmsel").find(csN[i]).css("overflow","auto");
            }
            
            for(var a=0; a<innerN.length;a++){
                $(".vmsel").find(innerN[a]).css("overflow","auto");
            }
            
            //해당 박스 마우스 오버시 스크롤 고정후 박스 슬림스크롤 활성화
            /*$('#categoryLi5_scrollCls').on('mouseover', function(e) {
                $('.sub_con_box_c').off('scroll touchmove mousewheel');
                
                $('.custom-select').on('scroll touchmove mousewheel', function(e) {
                    e.stopPropagation();
                });
            });*/
            
            //해당 박스 마우스 아웃시 스크롤 고정후 박스 슬림스크롤 활성화 해제
            /*$('#categoryLi5_scrollCls').on('mouseout', function(e) {
                $('.sub_con_box_c').on('scroll touchmove mousewheel', function(e) {
                       e.stopPropagation();
                });
                
                $('.custom-select').off('scroll touchmove mousewheel');
            });*/
            
            
        }else{
            $(".sub_con_box_c").find('.slimScrollBar').css("visibility","visible");
            $('.sub_con_box_c').off('scroll touchmove mousewheel');
            
            for(var i=0; i<csN.length;i++){
                $(".vmsel").find(csN[i]).css("overflow","hidden");
            }
            
            for(var a=0; a<innerN.length;a++){
                $(".vmsel").find(innerN[a]).css("overflow","hidden");
            }
            
        }
    
    
    // AI API -Free Trial    
    if(mainmenusize <= 1910) {
        $(".sub_con_box_trl").find('.slimScrollBar').css("visibility","hidden");
        $('.sub_con_box_trl').on('scroll touchmove mousewheel', function(e) {
               e.stopPropagation();
            });
    }else{

        $(".sub_con_box_trl").find('.slimScrollBar').css("visibility","visible");
        $('.sub_con_box_trl').off('scroll touchmove mousewheel');
    }
    
    
    
    
    
    
    if(mainmenusize <= 1280) {
        $(".sub_con_box").find('.slimScrollBar').css("visibility","hidden");
        $('.sub_con_box').on('scroll touchmove mousewheel', function(e) {
               e.stopPropagation();
            });
    }else{

        $(".sub_con_box").find('.slimScrollBar').css("visibility","visible");
        $('.sub_con_box').off('scroll touchmove mousewheel');
    }
    

    
    //서버생성 - 고급 -분산배치
    $(".in_t").on('onmouseover  focus',function(){
        $('.in_t').on('scroll touchmove mousewheel', function(e) {
               e.stopPropagation();
            });
    });
    
    $('.in_t').off('scroll touchmove mousewheel');

    
    $(".pop_txt_area").on('onmouseover  focus',function(){
        $('.pop_txt_area').on('scroll touchmove mousewheel', function(e) {
               e.stopPropagation();
            });
    });
    
    $('.pop_txt_area').off('scroll touchmove mousewheel');
    
    var textbox1 = document.getElementsByClassName('pop_txt_area');
    var textbox2 = document.getElementsByClassName('in_t');
    
    
    var xl = textbox1.length;
    var yl = textbox2.length;
    
    for (i = 0; i < xl; i++) {
        
            textbox1[i].addEventListener('DOMMouseScroll',function(e) {
                e.stopPropagation();
            });
        
            textbox1[i].addEventListener('DOMMouseScroll',function(e) {
                e.stopPropagation();
            });
            
    }

    
    for (i = 0; i < yl; i++) {
    
            textbox2[i].addEventListener('DOMMouseScroll',function(e) {
                e.stopPropagation();
            });
    

            textbox2[i].addEventListener('DOMMouseScroll',function(e) {
                e.stopPropagation();
            });

        
    }

}