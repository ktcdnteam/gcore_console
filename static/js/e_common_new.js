$(document).ready(function(){
    
    //체크박스, 라디오버튼 디자인
    if($("label.chkwrap, label.rdowrap").children("input").is( ":checked" )){
        $("label input:checked").parent("label").addClass("on");
    }
    if($("label.chkwrap, label.rdowrap").children("input").is( ":disabled" )){
        $("label input:disabled").parent("label").addClass("disabled");
    }
    $("input.input_txt[disabled='disabled']").addClass("disable");

    $("input.chkbox").on("click focus", function(){
        //var sameInput = $("input[name='"+$(this).attr("name")+"']");
    
        if($(this).not(":disabled")){            
            if($(this).prop( "checked" ) == true){
                    $(this).parent("label").addClass("on");
            }else{
                $(this).parent("label").removeClass("on");
            }
        }
        DisableInput();
    });

    $("input.rdo").on("click focus", function(){
        var sameInput = $("input[name='"+$(this).attr("name")+"']");
    
        if($(this).not(":disabled")){            
            if($(this).prop( "checked" ) == true){
                if(sameInput.length != 0){
                    sameInput.parent("label.rdowrap").removeClass("on");
                    $(this).parent("label").addClass("on");
                }else{
                    $(this).parent("label").addClass("on");
                }
            }else{
                $(this).parent("label").removeClass("on");
            }
        }
    });
    
    //좌측메뉴 영역 자동높이
    $("#lnb div.menu").height(document.documentElement.clientHeight-$("#lnb>div.login").height());
    window.onresize= function(){$("#lnb div.menu").height(document.documentElement.clientHeight-$("#lnb>div.login").height())}


    //좌측메뉴 활성화
    //1차메뉴

    $("#lnb div.menu dd>ul>li>a").on("click", function(){
        if($(this).is(".on")){
            $(this).removeClass("on");        
        }else{
            if($(this).parent("li").children("ul").length != 0){            
                $(this).addClass("on");
            }else{
                $("#lnb div.menu dd>ul>li>a").removeClass("on");
                $(this).addClass("on");
            }            
        }    
    });
    //2차메뉴
    $("#lnb div.menu dd>ul>li>ul>li>a").on("click", function(){
        $("#lnb div.menu dd>ul>li>ul").hide();
        $(this).parent("li").parent("ul").show();
        $("#lnb div.menu dd>ul>li>a").removeClass("on");
        $(this).parent("li").parent("ul").parent("li").children("a").addClass("on");
        $("#lnb div.menu dd>ul>li>ul>li>a").removeClass("on");
        $(this).addClass("on");
    });

    //테이블 링크 마우스오버시 tr 활성화
    $("table.type1 tbody td").hover(function(){
        if($("table.type1 tbody").is(".sortable-list")){
            $(this).css("cursor","pointer");
        }else{
            $(this).parent("tr").addClass("active");
        }
    }, function(){
        if($("table.type1 tbody").is(".sortable-list")){
            $(this).css("cursor","pointer");
        }else{
            $(this).parent("tr").removeClass("active");
        }
    });
    
    //탭메뉴 활성화
    $(".tabmenu li, .subtab li span").on("click", function(){
        $(this).addClass("on").siblings().removeClass("on");
    });
    
    //트리구조
    $("dl.tree dd ul li span").on("click", function(){
        if($(this).is(".open")){
            $(this).removeClass("open");    
            if($(this).parent("li").children("ul").legnth != 0){
                $(this).parent("li").children("ul").hide();
            }            
        }else{
            $(this).addClass("open");
            if($(this).parent("li").children("ul").legnth != 0){
                $(this).parent("li").children("ul").show();            
            }
        }
    });
    $("dl.tree dd ul li span em.folder").on("click", function(){
        if($(this).is(".open")){
            $(this).removeClass("open");    
            if($(this).parent("span").parent("li").children("ul").legnth != 0){
                $(this).parent("span").parent("li").children("ul").hide();
            }            
        }else{
            $(this).addClass("open");
            if($(this).parent("span").parent("li").children("ul").legnth != 0){
                $(this).parent("span").parent("li").children("ul").show();            
            }
        }
    });


    //팝업 닫기 버튼
    $(".pop_header .close").on("click", function(){
        window.close();
    });

    DisableInput();

});


//좌측메뉴 하위메뉴 보기
function showLeftmenu(obj){
    if($(obj).parent("li").children("ul:hidden").length != 0){
        $(obj).parent("li").children("ul").show();
    }else{
        $(obj).parent("li").children("ul").hide();
    }
}

//체크박스 모두 체크
function chkAll(obj,chkname){
    if($(obj).parent("label").is( ".on" )){        
        $("input[name='"+chkname+"']").prop("checked", false);
        $("input[name='"+chkname+"']").parent("label.chkwrap").removeClass("on");        
    }else{
        $("input[name='"+chkname+"']").prop("checked", true);
        $("input[name='"+chkname+"']").parent("label.chkwrap").removeClass("on").addClass("on");;
    }

}

//상세리스트(뉴스제작) 항목 접기/펼치기
function foldding(obj){
    if($(obj).parent().next("table").children(".expand").children("tr:hidden").length != 0){
        $(obj).parent().next("table").children(".expand").children("tr").show();
        $(obj).removeClass("close").html("접기");        
    }else{
        $(obj).parent().next("table").children(".expand").children("tr").eq(2).nextAll("tr").hide();        
        $(obj).addClass("close").html("펼치기");
        //마지막 행(상세내용) 보이기
        if($(obj).parent().next("table").children(".expand").children("tr:last-child").is(".newsContent")){
            $(obj).parent().next("table").children(".expand").children("tr:last-child").show();
        }
    }
}


function viewHide(obj,targetID){

    if(targetID == undefined){
        if($(obj).next("div:hidden").length != 0){
            $(obj).next("div:hidden").show();
            $(obj).children("img").attr("src", "../../images/c_common/gnb_btn_dropdown_sel.png");
        }else{
            $(obj).next("div:visible").hide();
            $(obj).children("img").attr("src", "../../images/c_common/gnb_btn_dropdown_nor.png");        
        }
    }else{
        if($(targetID).is(":visible")){
            $(targetID).hide();
            $(obj).children("img").attr("src", "../images/c_common/gnb_btn_dropdown_sel.png")
        }else{
            $(targetID).show();
            $(obj).children("img").attr("src", "../images/c_common/gnb_btn_dropdown_nor.png");
        }
    }


}

//영역 자동 높이
function optiHeight(divID,minusH){
    $(divID).height(document.documentElement.clientHeight-minusH);
}

//체크박스, 라디오버튼 실행 함수
function chkInput(){

    //체크박스, 라디오버튼 디자인
    if($("label.chkwrap, label.rdowrap").children("input").is( ":checked" )){
        $("label input:checked").parent("label").addClass("on");
    }
    if($("label.chkwrap, label.rdowrap").children("input").is( ":disabled" )){
        $("label input:disabled").parent("label").addClass("disabled");
    }

    $("input.chkbox").on("click focus", function(){
        //var sameInput = $("input[name='"+$(this).attr("name")+"']");
    
        if($(this).not(":disabled")){            
            if($(this).prop( "checked" ) == true){
                    $(this).parent("label").addClass("on");
            }else{
                $(this).parent("label").removeClass("on");
            }
        }
    });

    $("input.rdo").on("click focus", function(){
        var sameInput = $("input[name='"+$(this).attr("name")+"']");
    
        if($(this).not(":disabled")){            
            if($(this).prop( "checked" ) == true){
                if(sameInput.length != 0){
                    $(this).parent("label").addClass("on").siblings().removeClass("on");
                }else{
                    $(this).parent("label").addClass("on");
                }
            }else{
                $(this).parent("label").removeClass("on");
            }
        }
    });

}

//트리구조 실행 함수
function treeStruc(){
    //트리구조
    $("dl.tree dd ul li span").on("click", function(){
        if($(this).is(".open")){
            $(this).removeClass("open");    
            if($(this).parent("li").children("ul").legnth != 0){
                $(this).parent("li").children("ul").hide();
            }            
        }else{
            $(this).addClass("open");
            if($(this).parent("li").children("ul").legnth != 0){
                $(this).parent("li").children("ul").show();            
            }
        }
    });
    $("dl.tree dd ul li span em.folder").on("click", function(){
        if($(this).is(".open")){
            $(this).removeClass("open");    
            if($(this).parent("span").parent("li").children("ul").legnth != 0){
                $(this).parent("span").parent("li").children("ul").hide();
            }            
        }else{
            $(this).addClass("open");
            if($(this).parent("span").parent("li").children("ul").legnth != 0){
                $(this).parent("span").parent("li").children("ul").show();            
            }
        }
    });
}

//Disable Input 의 스타일
function DisableInput(){
    /*
    if($("input.input_txt").is(":disabled")){
        $("input.input_txt[disabled='disabled']").css({
        "background-color" : "#ebebeb"
        });
    }else{
        $("input.input_txt").css({
        "background-color" : "#ffffff"
        });    
    }
    */
    if($("label.chkwrap, label.rdowrap").children("input").is( ":disabled" )){
        $("label input:disabled").parent("label").addClass("disabled");
    }else{
        $("label input").parent("label").removeClass("disabled");
    }
}



 
$(function(){
    $('#inner_content_div').slimScroll({
        height: '300px',
        color: '#c6c6c4',
        width:'300px'
    });
});

$(function(){
    $('#inner_gnb_pop_div').slimScroll({
        height: '450px',
        color: '#c6c6c4',
        width:'auto'
    });
});

/*$(function(){
    $('#inner_lnb_div').slimScroll({
        height: '100%',
        color: '#898989',
        width:'60px',
        size: '3px'

    });
});*/
/*상태알림 스크롤*/
$(function(){
    $('#inner_content_div01').slimScroll({
        height: '200px',
        color: '#c6c6c4',
        width:'265px'
    });
});

/*리스트 스크롤 공통 */
$(function(){
    $('#inner_content_divsc').slimScroll({
        height: '104px',
        color: '#c6c6c4',
        width:'50px'
    });
});

//$(function(){
//    $('#searchDl2').slimScroll({
//        height: '180px',
//        color: '#c6c6c4',
//        width:'170px'
//    });
//});


$(function(){
    $('#inner_content_div_batch').slimScroll({
        height: '115px',
        color: '#c6c6c4',
        //width:'300px'
    });
});

/*$(function(){
    $('#inner_lnb_div_vml').slimScroll({
        height: '115px',
        color: '#c6c6c4',
        width:'200px'
    });
});

$(function(){
    $('#inner_lnb_div_vm2').slimScroll({
        height: '115px',
        color: '#c6c6c4',
        //width:'300px'
    });
});*/

