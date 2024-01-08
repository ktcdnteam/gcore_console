var cnb_in_flag = false;
var current_service = "";
var active_service_list = [];
var ent_user_info = null;
var ent_tier_info = null;
var d_vpc_info = null;
var dedicated_cluster_info = null;
var ipcMemberInfo = null;

var site_lang_cd = "KOR";

var os_tier_info = null;

var main_tier_list = new Array();
var sub_tier_list = new Array();
var total_overlay_network_list = new Array();

var iamServicePolicy = null; // IAM 사용자 서비스 정책 : 조성훈, 2020. 03. 20
var iamGroupPolicy = null; // IAM 사용자 그룹 정책 : 조성훈, 2020. 03. 20

var active_popup_list = new Array();

var bTierLoaded = false;    // Tier 로딩이 끝났는지 체크

//2022.02.03 captainPark Multi Zone 적용
var osTierList = [];        // 사용자가 사용 가능한 Tier 목록
var osZoneList = [];        // 사용자가 사용 가능한 Zone 목록
var osStackList = [];       // 사용자 Stack 목록
var osZoneLoaded = false;   // Zone목록을 재조회할건지 여부
var osTierLoaded = false;   // Tier목록을 재조회할건지 여부
var tierReqCnt = 0;         // Tier목록 요청 횟수
var tierResCnt = 0;         // Tier목록에 대한 응답 횟수

$(document).ready(commonReady);

function commonReady() {
    var current_url = location.href;

    if(!(current_url.match("platform")) && !current_url.match("osd1")) {
        showMenuLoadingBox();
    }

    if( navigator.userAgent.indexOf('Firefox') >= 0 ) {
        var eventNames = ["mousedown", "mouseover", "mouseout",
            "mousemove", "mousedrag", "click", "dblclick",
            "keydown", "keypress", "keyup" ];

        for( var i = 0 ; i < eventNames.length; i++ ) {
            window.addEventListener( eventNames[i], function(e) {
                window.event = e;
            }, true );
        }
    }

    // IAM 사용자인 경우 사용자 포탈 접근 못함 : 조성훈, 2020. 03. 20
    if($.cookie("iamid")) {
        getUserServicePolcy();
        getUserGroupPolcy();
    }

    fill_svcid();

    getVPCUserInfo();
    getEntUserInfo();    // enterprise 사용자 정보 조회, enterprise2.0..
    chkIpcMember();
/*
    window.addEventListener('click',function(event){
        dupLoginSessionCr();
    });
*/
    set_slim_scroll();
    set_all_tooltip();
    set_popup_auto_close();
    selectbox_design();
    set_site_lang_cd_info();

    $('.toggle_tab').unbind("click").bind("click", function(e){
        $(this).parent().find(".on").removeClass("on");
        $(this).children("span").addClass("on");
    });

    $(".commonPopClose").unbind("click").bind("click", function(e){
        e.preventDefault();
        var curr_popup = $(this).parent().parent().parent().attr("id");
        $("#"+curr_popup).dialog("close");
    });

    if(!current_url.match("osd1")) {
        //get_ent2_tier_info();
    }
    // 2022.02.04 captainPark 멀티존에 따른 사용자 가능한 zone정보 조회
    // getZoneInfo();
}

// //2022.02.04 멀티존 추가------------------------------------------------------------------------------------------------
//     function getZoneInfo()  {
//     // 2022.01.21 zone목록이 비어 있거나, 목록갱신이 필요할 경우 재조회함
//     var current_url = location.href;

//     osZoneLoaded = getStroageValue("osZoneLoaded");
//     if ( osZoneLoaded == "" )  {
//         osZoneLoaded = false;
//     }
//     if ( osZoneList.length == 0 || !osZoneLoaded )   {
//         chkZoneList();
//     }
//     // 2022.02.03 tier목록이 비어 있거나, 목록갱신이 필요할 경우 재조회함
//     if(!current_url.match("osd1")) {
//         //get_ent2_tier_info();
//         osTierLoaded = getStroageValue("osTierLoaded");
//         if ( osTierLoaded == "" )  {
//             osTierLoaded = false;
//         }
//         if ( main_tier_list.length == 0 || !osTierLoaded )   {
//             tierReqCnt = osStackList.length;
//             tierResCnt = 0;
//             if(main_tier_list != null && main_tier_list.length > 0) {
//                 main_tier_list.splice(0, main_tier_list.length);
//             }
//             if(osTierList != null && osTierList.length > 0) {
//                 osTierList.splice(0, osTierList.length);
//             }

//             // 사용자 Zone 목록이 하나라도 있을 경우에만
//             if ( osZoneList.length > 0 && !current_url.match("osmain"))    {
//                 var parameter = {
//                     command : "listNetworkPublic", /*"listNetworkPresent",*/
//                     account : $.cookie('account'),
//                     memSq : $.cookie("memsq"),
//                     group_mem_sq : $.cookie("groupmemsq")
//                 };
//                 chkTierList(parameter);
//             }
//         }
//     }
// }

function   chkZoneList() {
    //2022.01.13 captainPark 사용자별 zone목록 조회
    var param = {command:"ServerCommonCommand", subcommand:"getUserZoneList", group_mem_sq:$.cookie("groupmemsq")}
    $.ajax({
        url: "/osSvcSvrPrc",
        type: "POST",
        data: param,
        dataType: "json",
        async:false,
        complete : hideLoadingBox,
        success: chkZoneListSucc,
        error: errorAjax
    });
}

function chkZoneListSucc(json) {
    if (json.status == "00") {
        var items = json.data;
        if(items) {
            for(var i=0; i< items.length; i++) {
                osZoneList.push(items[i]);
            }
        }
        osZoneLoaded = true;
        setStroageValue("osZoneLoaded", osZoneLoaded);
    } else {
        osZoneList = [];
    }
    setDefaultZone();
}

function setDefaultZone()   {
    //2022.01.13 captainPark 특정 계정에 대한 처리. DB에 데이터가 있을 경우에는 수기로 추가하지 않음.
    if ( is_vpcd1_user() || $.cookie('memsq') == "M210774" || $.cookie('memsq') == "M212496" )    {
        var items = [];
        //osZoneList.push({zone_id:"DX-VPC-MSS",vdom_id:"DX-VPC-MSS",zone_nm:"DX-VPC-MSS",zone_sq:"DX-VPC-MSS",stack_id: "11"});
        if($.cookie('memsq') == "M210774"){
            items = osZoneList.filter(function(item){if(item.zone_id == "DX-COT" ) return item;});
            if ( items.length == 0 ) {
                osZoneList.push({zone_id:"DX-COT",vdom_id:"DX-COT",zone_nm:"DX-COT",zone_sq:"DX-COT",stack_id: "11"});
            }
        }
        items = []; // 초기화
        if($.cookie('memsq') == "M212496"){
            items = osZoneList.filter(function(item){if(item.zone_id == "DX-PGOS" ) return item;});
            if ( items.length == 0 ) {
                osZoneList.push({zone_id:"DX-PGOS",vdom_id:"DX-PGOS",zone_nm:"DX-PGOS",zone_sq:"DX-PGOS",stack_id: "11"});
            }
        }
    } else {
        // 데이터가 없을 경우 기본 항목만 추가
        if ( osZoneList != undefined && osZoneList != null && osZoneList != "" && osZoneList.length == 0 ) {
            osZoneList = [];
            osZoneList.push({zone_id:"DX-M1",vdom_id:"DX-M1",zone_nm:"DX-M1",zone_sq:"DX-M1",stack_id: "11"});
        }
    }
    //osZoneList.push({zone_id:"DX-CENTRAL",vdom_id:"DX-CENTRAL",zone_nm:"DX-CENTRAL",zone_sq:"DX-CENTRAL",stack_id: "11"});

    for(var x=0; x<osZoneList.length; x++)  {
        if(x==0)    {
            osStackList.push({stack_id:osZoneList[x].stack_id});
        } else {
            var stackItems = osStackList.filter(function(item){if(item.stack_id == osZoneList[x].stack_id ) return item;});
            if ( stackItems.length == 0 )   {
                osStackList.push({stack_id:osZoneList[x].stack_id});
                //push(...items: T[]): number;
            }
        }
    }
}

//2022.02.03 captainPark 사용자별 tier 목록 조회
function chkTierList(parameter) {
    //    var parameter = {
    //         command : "listNetworkPublic", /*"listNetworkPresent",*/
    //         account : $.cookie('account'),
    //         memSq : $.cookie("memsq"),
    //         group_mem_sq : $.cookie("groupmemsq")
    //         };
    parameter.zone_id = osZoneList[tierResCnt].zone_id;
    parameter.multi_stack_id = osZoneList[tierResCnt].stack_id;
    $.ajax({
        url: "/osSvcSvrPrc",
        type: "POST",
        data: parameter,
        dataType: "json",
        complete : hideLoadingBox,
        success: chkTierListSucc.bind(this,parameter),
        error: chkTierListError.bind(this,parameter)
    });
}

function chkTierListSucc(parameter, json)    {
    tierResCnt++;
    if (json.status == "00") {
        if ( json.data.hasOwnProperty("nc_listvpcsresponse") )  {
            var items = json.data.nc_listvpcsresponse.vpcs[0].networks;
            if(items != null && items.length > 0) {
                for(var i = 0; i < items.length ; i++) {
                    main_tier_list.push(items[i]);
                    osTierList.push(items[i]);
                }
            }
        }
    }

    if(tierResCnt < tierReqCnt) {
        chkTierList(parameter);
    } else {
        osTierLoaded = true;
        setStroageValue("osTierLoaded", osTierLoaded);
    }
}

function chkTierListError(parameter, json) {
    tierResCnt++;
    if ( tierResCnt < tierReqCnt )   {
        chkTierList(parameter);
    }
}

function getRadioSelectedValue(radio_name) {
    return $(":radio[name='" + radio_name + "']:checked").val();
}

function getRadioSelectedText(radio_name) {
    return $(":radio[name='" + radio_name + "']:checked").parent().parent().text();
}

function errorAjax()    {
    alert('ajax error');
}

function setStroageValue(attr, value)    {
    sessionStorage.setItem(attr, value);
}

function getStroageValue(attr)    {
    var rVal = sessionStorage.getItem(attr);
    if ( rVal == undefined || rVal == null || rVal == "" )  {
        rVal = "";
    }
    return rVal
}

/*
* 2023-03-09
* Zone 하나만 가입한 사용자에 대해 청약 및 LNB Hide (DX-M1 제외)
* allservice prod_nm 참조
* Central Zone Only : "autoscaling","messaging","backup","devops","k2p","flyingcube","wafpro"
* DCN-CJ Zone Only : "autoscaling","messaging","backup","devops","k2p","flyingcube","wafpro"
* */
function onlyCentralUserYn()    {
    let onlyZone = "";
    
    if ( osStackList == undefined || osStackList == null || osStackList.length == 0 )  {
        onlyZone = "";
    } else {
        if(osStackList.length == 1) {
            if (osStackList[0].stack_id == "12") {
                onlyZone = "onlyCentral"; //Central만 가입한 사용자   
            } else if (osStackList[0].stack_id == "13") {
                onlyZone = "onlyDCN"; //DCN-CJ만 가입한 사용자
            } else {
                onlyZone = ""; //DX-M1만 가입한 사용자
            }
        }
        //존이 2개 이상인 사람
    }
    return onlyZone;
}
//2022.02.04 멀티존 추가------------------------------------------------------------------------------------------------

var isMaxview = false;

function go_portal_page(to_page) {
    // IAM 사용자인 경우 사용자 포탈 접근 못함 : 조성훈, 2020. 03. 20
    if($.cookie("iamid")) {
        return;
    }

	//2023.05.11
    if(to_page.indexOf("/portal/user-guide") > -1) {
	    window.open("https://manual.cloud.kt.com/kt/", "_blank").focus();
		return;
    }

	//2023.05.25
    if(to_page.indexOf("manual.cloud.kt.com") > -1) {
	    window.open(to_page, "_blank").focus();
		return;
    }

    var dest_page = get_eng_url(to_page);

    if(dest_page.match("https://cloud.kt.com")) {
        dest_page = dest_page.replace("https://cloud.kt.com", "");
    }

    if(window.location.origin) { // IE 9 이하에선 없음...
        dest_page = window.location.origin + dest_page;
    }

    window.open(dest_page, "_blank").focus();

    return;
}

function set_current_user() {
    if($.cookie("iamid")){
        $("#id_current_user").text($.cookie("iamid"));
        $("#memberNav").find("#menu").find("li.m1").show();
    }else if($.cookie("memid")) {
//        $("#id_current_user").text($.cookie("memid"));
        $("#memberNav").find("#menu").find("li.m1").show();
//        $("#current_user_name").text($.cookie("memnm"));
    }else {
        $("#memberNav").find("#menu").find("li.m1").hide();
    }
}

//로그아웃
function logoutldap(nextpage) {
    var times = new Date().getTime();
    var memid = $.cookie('memid');
    $.ajax({
        url: WebROOT + "plogout",
        type: "POST",
        async: false,
        dataType: "json",
        success: function(data) {
            var totTime = new Date().getTime() - times;
            if(data.response.result == 0){
                //EPC COOKIES 2010.11.02 시작
                $.cookie('svcid', null, {path : WebROOT});
                $.cookie('memsq', null, {path : WebROOT});
                $.cookie('memid', null, {path : WebROOT});
                $.cookie('memnm', null, {path : WebROOT});
                $.cookie('emailauthyn', null, {path : WebROOT});
                $.cookie('iamYN', null, {path : WebROOT});
                //EPC COOKIES 2010.11.02 끝
                // 2013 11 29 권용록 그룹계정 쿠키값 삭제
                $.cookie('groupmemsq', null, {path : WebROOT});
                $.cookie('groupmemnm', null, {path : WebROOT});
                $.cookie('groupmemid', null, {path : WebROOT});

                $.cookie('cloudpid', null, {path : WebROOT});
                $.cookie('ktid', null, {path : WebROOT});
                $.cookie('companyid', null, {path : WebROOT});
                $.cookie('cloudname', null, {path : WebROOT});

                $.cookie('kthname', null, {path : WebROOT});
                $.cookie('service_name', null, {path : WebROOT});
                $.cookie('cs_account', null, {path : WebROOT});
                $.cookie('cs_pwd', null, {path : WebROOT});

 
                $.cookie('dediid', null, {path : WebROOT});
                $.cookie('memlangcd', null, {path : WebROOT});

                $.cookie('zonesq', null, {path : WebROOT});

                $.cookie('ubzsaas', null, {path : WebROOT});
                $.cookie('ubzsaas', null, {domain : ".kt.com" , path : WebROOT});
                $.cookie('ubziaas', null, {path : WebROOT});
                $.cookie('ubziaas', null, {domain : ".kt.com" , path : WebROOT});
                $.cookie('ubzml', null, {path : WebROOT});
                $.cookie('ubzml', null, {domain : ".kt.com" , path : WebROOT});
                $.cookie('ubzts', null, {path : WebROOT});
                $.cookie('ubzts', null, {domain : ".kt.com" , path : WebROOT});

                // server+용 user_id 삭제
                $.cookie('ensuid', null, {path : "/"});
                $.cookie('ensuid', null, {domain : ".ucloudbiz.kt.com" , path : "/"});

                $.cookie('iamid', null, {path : WebROOT});
                $.cookie('memplatform', null, {path : WebROOT});

                g_mem_id = null;
                g_mem_nm = null;
                g_email_auth_yn = null;        //가입용 이메일 인증 여부
                g_dediid = null;        //Cloud Stack ID 생성완료 여부(서비스 신청 여부)

                g_iam_id = null;

                logoutcloud();
                logcollect("logOut","I",memid,"LOGOUT","https://cloud.kt.com/plogout",totTime,  "",  ""    ,"","","","");
                document.location.href = "/cdn/all";
                return true;
            }
            else {
                showCommonNoLangErrorMsg("로그아웃 오류", "세션 삭제중 오류가 발생했습니다.", "잠시후 다시 시도해 주세요.");
                logcollect("logOut","E",memid,"LOGOUT","https://cloud.kt.com/plogout",totTime,  "",  ""    ,"OE003","세션삭제오류(로그아웃)","","");
            }
        },
        error: function(xhr, desc, error) {
            var totTime = new Date().getTime() - times;
            showCommonNoLangErrorMsg("로그아웃 오류", "로그아웃 호출시 오류가 발생했습니다.", "잠시후 다시 시도해 주세요.");
            logcollect("logOut","S",memid,"LOGOUT","https://cloud.kt.com/plogout",totTime,  "",  ""    ,"OE004","로그아웃호출오류(로그아웃)","","");
        }
    });
}

// 로그아웃
function logoutcloud() {
    var g_mySession = null;
    var g_account = null;
    var g_domainid = null;
    var g_timezoneoffset = null;
    var g_timezone = null;

    $.cookie('JSESSIONID', null, {path : WebROOT});
    $.cookie('account', null, {path : WebROOT});
    $.cookie('domainid', null, {path : WebROOT});
    $.cookie('networktype', null, {path : WebROOT});
    $.cookie('timezoneoffset', null, {path : WebROOT});
    $.cookie('timezone', null, {path : WebROOT});
}

function set_scroll() {
    // 테이블 헤더의 높이는 정상 42임. 42보다 작게해서 스크롤이 생기도록함(colResizible 관련 크기 조정을 위해서).
    if(check_y_scroll()) {
        $("#headTableDiv").height(41);
    }else{
        if($("#table_head_area").height() == 42){
            $("#headTableDiv").height(43);
        }else{
            setTimeout(function(){
                $("#headTableDiv").height($("#table_head_area").height());
            }, 1000);
        }
    }
    // 상단테이블과 하단테이블의 스크롤이 동일하게 되도록 설정
    document.getElementById("headTableDiv").scrollLeft = document.getElementById("dtailTableDiv").scrollLeft;
}

function check_x_scroll() {
    var src_div = document.getElementById('dtailTableDiv');
    var x_scroll_yn = (src_div.scrollWidth > src_div.clientWidth)?true:false;

    return x_scroll_yn;
}

function check_y_scroll() {
    var src_div = document.getElementById('dtailTableDiv');

    var y_scroll_yn = (src_div.scrollHeight > src_div.clientHeight)?true:false;

    return y_scroll_yn;
}

function set_col_resize() {
    $("#table_head_area").colResizable({
        liveDrag:true,
        gripInnerHtml:"<div class='grip'></div>",
        draggingClass:"dragging",
        onResize:null});
    $("#table_body_area").colResizable({
        liveDrag:true,
        gripInnerHtml:"<div class='grip'></div>",
        draggingClass:"dragging",
        onResize:null});

    // body에서 split로 content를 나누어 표시하도록.
    $('div.split-pane').splitPane();
}

function reset_col_resize() {
    $("#table_head_area").colResizable({ disable : true });
    $("#table_body_area").colResizable({ disable : true });

    // 컬럼리사이즈 재기동. delay를 주는 이유는 colResizable이 항목변경 후, 변경된 컬럼을 알아채는데 시간이 걸림.
    setTimeout(function(){
        $('div.split-pane').splitPane();
        $("#table_head_area").colResizable({ liveDrag : true });
        $("#table_body_area").colResizable({ liveDrag : true });
    }, 500);

}

function set_current_language() {
    var preferred_language = get_preferred_language();

    window.name = "ucloud_console";

    var dest_lang = get_lang_cookie();

    if(dest_lang == null) {
        dest_lang = preferred_language;
        change_language(dest_lang);
    } else if(dest_lang == "en") {
        dest_lang = "en";
        $.cookie('ubizlanguage', 'en', {path : WebROOT});
    } else {
        dest_lang = "ko";
        $.cookie('ubizlanguage', 'ko', {path : WebROOT});
    }

    if(dest_lang == "ko") {
        $("#id_current_language").text("한국어");
        $("#id_locale_korea").hide();
        $("#id_locale_english").show();
    } else {
        $("#id_current_language").text("English");
        $("#id_locale_korea").show();
        $("#id_locale_english").hide();
    }

    set_current_user();
}

function change_language(dest_lang) {
    var params = {
        locale : dest_lang     // 커맨드이름
    };

    $.cookie('ubizlanguage', dest_lang, {path : WebROOT});

    $.ajax({
        url: "/changeLocale.do",
        type : "POST",
        data : params,
        success : function(json) {
            window.location.reload(true);
        },
        error: function(XMLHttpResponse) {
            window.location.reload(true);
        }
    });
}

function activate_lnb(service_name){
    cnb_show(service_name);
    var dest_obj = $("#leftcolumn");

    var li_objs = dest_obj.find("li");

    li_objs.each(function() {
        if($(this).hasClass(service_name)) {
            $(this).addClass("on");
            $(this).find("a").addClass("on");
            $(this).find("a > span").addClass("on");
        } else {
            $(this).removeClass("on");
            $(this).find("a").removeClass("on");
            $(this).find("a > span").removeClass("on");
        }
    });

    if(service_name == "home"){
        $(".l_home > a").addClass("on");
        $(".l_home > a > span").addClass("on");
        cnb_menu_close();
    }else{
        $(".l_home > a").removeClass("on");
        $(".l_home > a > span").removeClass("on");
    }

    if(service_name == "product_management"){
        $(".product_plus > a").addClass("on");
        $(".product_plus > a > span").addClass("on");
        cnb_menu_close();
    }else{
        $(".product_plus > a").removeClass("on");
        $(".product_plus > a > span").removeClass("on");
    }

    if(check_eng_member()) {
        if(service_name == "monitoring"){
            $(".monitoring_sitescope_list").remove();
            $(".monitoring_sycros").remove();
        }
    }
}

function cnb_show(svc_name) {
    var parent_div = $("#sidr");

    var div_objs = parent_div.children("div").children("div");

    div_objs.each(function() {
        if($(this).hasClass("depth2")) {
            if(svc_name == "home") {
                $(this).hide();
            } else if($(this).attr("id") == ("sid_" + svc_name)) {
                $(this).addClass("on");
                $(this).show();
                cnb_menu_open();

                if(is_dedicated_host_user()) {
                    if(svc_name == "server") {
                        $("server_dedicated_host_statistics").show();
                    }
                }
            } else {
                $(this).removeClass("on");
                $(this).hide();
            }
        }
    });
    cnb_resource_count(svc_name);
}

function activate_cnb(svc_name, sub_menu) {
    cnb_show(svc_name);

    var dest_obj = $("#sid_" + svc_name);

    var li_objs = dest_obj.find("li");

    li_objs.each(function() {
        if($(this).hasClass(sub_menu)) {
            $(this).addClass("on");
        } else {
            $(this).removeClass("on");
        }
    });
}

function deactivate_cnb() {
    var div_objs = $("#sidr").children("div").children("div");

    div_objs.each(function() {
        $(this).removeClass("on");
    });

    var dest_obj = $("#leftcolumn");

    var li_objs = dest_obj.find("li");

    li_objs.each(function() {
        $(this).removeClass("on");
        $(this).find("a").removeClass("on");
        $(this).find("a > span").removeClass("on");
    });
}

function cnb_menu_open() {
    $("#sidr").animate( {
            width: "278px", height: "100%", backgroundColor: ""},
        50,
        function() {
            $("#cnb_wrap").show();
        }
    );

    set_col_resize();
}

function cnb_menu_close() {
    $("#sidr").animate( {
            width: "0%", backgroundColor: ""},
        50,
        function() {
            $("#cnb_wrap").hide();
        }
    );

    set_col_resize();
}

function cnb_menu_out_process() {
    var curr_X_postion = getMouseX();

    if(curr_X_postion > 200) {
        var cnb_objs = $("#sidr").children("div").children("div");

        cnb_objs.each(function() {
            var li_objs = $(this).find("li");
            var tmp_id = $(this).attr("id").split("_");;
            var service_nm = tmp_id[1];

            li_objs.each(function() {
                if($(this).hasClass("on")) {
                    activate_lnb(service_nm);

                    var total_service_count = active_service_list.length;
                    var dest_service_index = 0;

                    for(var i=0; i<active_service_list.length; i++) {
                        if(active_service_list[i].service_name == service_nm ) {
                            dest_service_index = i;
                            break;
                        }
                    }

                    if(total_service_count > 10 && dest_service_index >= 10) {
                        var to_scroll = (dest_service_index -9)*70;
                        $('#inner_lnb_div').scrollTop(to_scroll);
                    } else {
                        $('#inner_lnb_div').scrollTop(0);
                    }
                }
            });
        });
    }
}

function minview(){
    isMaxview = false;

    $("#tab_wrapper").show().css("display","");

    $("#my-divider").animate({
        bottom : "80%"
    }, 500);

    $("#bottom-component").animate({
        height : "80%"
    }, 500);

    $("#top-component").animate({
        height : "20%"
    }, 500);

    setTimeout(function(){
        set_scroll();
    }, 1000);
}

function basicview(){
    isMaxview = false;
    $("#tab_wrapper").show().css("display","");
    $("#my-divider").animate({
        bottom : "60%"
    }, 500);
    $("#bottom-component").animate({
        height : "60%"
    }, 500);
    $("#top-component").animate({
        height : "40%"
    }, 500);

    setTimeout(function(){
        set_scroll();
    }, 1000);
}

function maxview() {
    var bottom_cur_height = parseInt(window.getComputedStyle(document.getElementById('bottom-component')).getPropertyValue('height'))/100*20;
    var bottom_min_height = parseInt(window.getComputedStyle(document.getElementById('bottom-component')).getPropertyValue('min-height'));
    var bottom_min_height_txt = bottom_min_height + "px";

    isMaxview = true;
    $("#tab_wrapper").hide();
    $("#my-divider").animate({
        bottom : "20%"
    }, 500);

    $("#top-component").animate({
        height : "80%"
    }, 500);

    if(bottom_min_height > bottom_cur_height) {
        $("#bottom-component").animate({
            height : bottom_min_height_txt
        }, 500);
    } else {
        $("#bottom-component").animate({
            height : "20%"
        }, 500);
    }

    setTimeout(function(){
        set_scroll();
    }, 1000);

}


function set_lnb_out() {
    //set_lnb_out
}


function set_cnb_out() {
    var mouse_x_position = getMouseX();
}

function set_lnb_in() {
    //set_lnb_in
}


function set_cnb_in() {
    //set_cnb_in
}

function set_console_default(message_name, lnb_name, cnb_name) {
    if(lnb_name == "" && cnb_name == "") { // 플랫폼, All service인 경우...
        set_current_language();
        set_noti_message_count();
        set_notice_lists();
        return;
    }

    var meta = document.createElement('meta');
    meta.httpEquiv = "X-UA-Compatible";
    meta.content = "IE=edge";
    document.getElementsByTagName('head')[0].appendChild(meta);

    get_active_member_service_lists("default", lnb_name, cnb_name);
    if(message_name == "csvolume"){
        message_name = "csserver";
    }

    if(lnb_name != "onebackup") {
        load_console_messages(message_name);
    }

    if(lnb_name != "landing") {

        // IAM 사용자의 경우 해당 서비스만 조회, 아니면 콘솔 랜딩으로...
        if($.cookie("iamid")) {
            var lnb_ul = $("#depth1_menu_ul");

            var li_objs = lnb_ul.find("li");

            li_objs.each(function() {
                if($(this).hasClass(cnb_name)) {
                    if($(this).css("display") == "none") {
                        document.location.href = "/console/main";
                    }
                }
            });
        }
        var total_service_count = active_service_list.length;
        var dest_service_index = 0;

        for(var i=0; i<active_service_list.length; i++) {
            if(active_service_list[i].service_name == lnb_name ) {
                dest_service_index = i;
                break;
            }
        }

        if(total_service_count > 10 && dest_service_index >= 10) {
            var to_scroll = (dest_service_index -9)*70;
            $('#inner_lnb_div').scrollTop(to_scroll);
        } else {
            $('#inner_lnb_div').scrollTop(0);
        }
    }

    if(lnb_name == "landing") {
        $("#memberNav").find("#menu").find("li.m1").hide();
        $("#serviceNav").find("#menu").find("li.gnbalarm").hide();
        $("#serviceNav").find("#menu").find("li.gnbnotice").hide();
        $("#serviceNav").find("#menu").find("li.gnbprice").hide();
    } else {
        $("#serviceNav").find("#menu").find("li.gnbnotice").show();
        $("#serviceNav").find("#menu").find("li.gnbprice").show();
    }

    $("#memberNav").find("#menu").find("li.m1").show();
    $("#memberNav").find("#menu").find("li.m3").show();
    $("#memberNav").find("#menu").find("li.m4").show();

    set_current_language();
    set_noti_message_count();
    set_notice_lists();

    current_service = lnb_name;
}

function set_notice_lists() {
    var notice_title    = $("#notice_title");
    var notice_content    = $("#notice_content");
    var params        = {command : "get_last_notice_list"};

    $("#noti_alm_tbody").find('tr').remove();

    $.ajax({
        url: "/ConsoleMain",
        type: "POST",
        data : params,
        dataType: "json",
        complete: function () {
            show_noti_message();
        },
        success: function(data) {
            if (data != null) {
                var id        = data.getlastnoticeresponse;
                var lists    = id.lists;

                if (lists != null && lists.length > 0) {
                    var noti_html = '<tr class="pop_tst_t notice_clss">';
                    noti_html += '<td><img src="/images/coni/Toast_Info.svg" alt="공지" />공지</td>';
                    noti_html += '<td><img src="/images/coni/toast_new.svg" alt="new" />' + lists[0].insert_date + '</td>';
                    noti_html += '</tr>';
                    noti_html += '<tr class="pop_tst_c notice_clss">';
                    noti_html += '<td colspan="3"><p>' + lists[0].title + '</p></td>';
                    noti_html += '</tr>';

                    $("#noti_alm_tbody").append(noti_html);
                }
            }

        }
    });
}

function calculate_byte( sTargetStr ) {
    var sTmpStr, sTmpChar;
    var nOriginLen = 0;
    var nStrLength = 0;

    sTmpStr = new String(sTargetStr);
    nOriginLen = sTmpStr.length;

    for ( var i=0 ; i < nOriginLen ; i++ ) {
        sTmpChar = sTmpStr.charAt(i);

        if (escape(sTmpChar).length > 4) {
            nStrLength += 2;
        }else if (sTmpChar!='\r') {
            nStrLength ++;
        }
    }
    return nStrLength;
}

function Cut_Str( sTargetStr , nMaxLen ) {
    var sTmpStr, sTmpChar, sDestStr;
    var nOriginLen = 0;
    var nStrLength = 0;
    var sDestStr = "";
    sTmpStr = new String(sTargetStr);
    nOriginLen = sTmpStr.length;

    for ( var i=0 ; i < nOriginLen ; i++ ) {
        sTmpChar = sTmpStr.charAt(i);

        if (escape(sTmpChar).length > 4) {
            nStrLength = nStrLength + 2;
        } else if (sTmpChar!='\r') {
            nStrLength ++;
        }

        if (nStrLength <= nMaxLen) {
            sDestStr = sDestStr + sTmpChar;
        } else {
            break;
        }
    }
    return sDestStr;
}

function getDateDiff(date1,date2) {
    var arrDate1 = date1.split("-");
    var getDate1 = new Date(parseInt(arrDate1[0]),parseInt(arrDate1[1])-1,parseInt(arrDate1[2]));
    var arrDate2 = date2.split("-");
    var getDate2 = new Date(parseInt(arrDate2[0]),parseInt(arrDate2[1])-1,parseInt(arrDate2[2]));

    var getDiffTime = getDate1.getTime() - getDate2.getTime();

    return Math.floor(getDiffTime / (1000 * 60 * 60 * 24));
}

function set_group_select_one(selected_gr_id, selected_gr_nm) {
    var group_user_change_select_one = $("#group_user_change_select_one");

    if(selected_gr_id.indexOf("*") > 0) {
        group_user_change_select_one.html('<li><a href="#"><span style=\"color:#ff3333;\">' + selected_gr_id + ':' +selected_gr_nm + '</span><span id="group_id_unmasking" class="ml20" style="color:#ff3333;">마스킹해제</span></a><img style=\"position: absolute;top:0px;right:0px;\" alt=\"check_icon\" class=\"mt5\" src=\"../../images/c_common/icon_check_gnb_red.png\"/></li>');
    } else {
        group_user_change_select_one.html('<li><a href="#"><span style=\"color:#ff3333;\">' + selected_gr_id + ':' +selected_gr_nm + '</a><img style=\"position: absolute;top:0px;right:0px;\" alt=\"check_icon\" class=\"mt5\" src=\"../../images/c_common/icon_check_gnb_red.png\"/></li>');
    }

    $("#group_id_unmasking").unbind("click").bind("click", function(e){
        e.preventDefault();
        cancleGroupMask();
    });
}

function hide_lnb_menu(service_name) {
    var lnb_ul = $("#depth1_menu_ul");

    var li_objs = lnb_ul.find("li");

    li_objs.each(function() {
        if($(this).hasClass(service_name)) {
            $(this).hide();
        }
    });
}

function set_lnb_menu() {
    var params        = { command : "svcList" };
    active_service_list.splice(0);

    $.ajax({
        url: WebROOT + "contractServlet",
        type: "POST",
        data: params,
        dataType: "json",
        async: false,
        success: function(data) {
            if (data.response.result == "0") {
                var list    = data.response.data;

                active_service_list = new Array();

                for (var i = 0; i < list.length; i++) {
                    if (list[i].ordSvcStCd == "10") {
                        $("#depth1_menu_ul").show();
                        break;
                    }
                }

                var tmp_svc_data = "";

                if(!check_service(list, "S1820")) {
                    hide_lnb_menu("server");
                } else {
                    tmp_svc_data = {"service_name":"server"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "NIPAGPU")) {
                    $("#sid_server").find(".gpuserver_list").hide();
                } else {
                    $("#sid_server").find(".gpuserver_list").show();
                }

                // MS Azure
                if (!check_service(list, "S4326")) {
                    hide_lnb_menu("msazure");
                } else {
                    tmp_svc_data = {"service_name":"msazure"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S4319")) {
                    hide_lnb_menu("vmware");
                } else {
                    tmp_svc_data = {"service_name":"vmware"};
                    active_service_list.push(tmp_svc_data);
                }

                if($.cookie("memsq") == "M119215"){
                    tmp_svc_data = {"service_name":"edgecloud"};
                    active_service_list.push(tmp_svc_data);
                }else{
                    hide_lnb_menu("edgecloud");
                }

                if(!check_service(list, "S3659")) {
                    hide_lnb_menu("PC");
                } else {
                    tmp_svc_data = {"service_name":"PC"};
                    active_service_list.push(tmp_svc_data);
                }

                if($.cookie("memsq") == "M186686"
                    || $.cookie("memsq") == "M186687"
                    || $.cookie("memsq") == "M186688"
                    || $.cookie("memsq") == "M186689"
                    || $.cookie("memsq") == "M186690"
                    || $.cookie("memsq") == "M186691"
                    || $.cookie("memsq") == "M186692"
                    || $.cookie("memsq") == "M186693"
                    || $.cookie("memsq") == "M186694"
                    || $.cookie("memsq") == "M119215"
                    || $.cookie("memsq") == "M186695"){
                    tmp_svc_data = {"service_name":"blockchain"};
                    active_service_list.push(tmp_svc_data);
                } else if(!check_service(list, "S4335") || !check_service(list, "S4336")){
                    hide_lnb_menu("blockchain");
                } else {
                    tmp_svc_data = {"service_name":"blockchain"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S1850")) {
                    hide_lnb_menu("cdn");
                } else {
                    tmp_svc_data = {"service_name":"cdn"};
                    active_service_list.push(tmp_svc_data);
                }

                if (!check_service(list, "S3421")) {
                    hide_lnb_menu("globalcdn");
                } else {
                    tmp_svc_data = {"service_name":"globalcdn"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S1823")) {
                    hide_lnb_menu("database");
                } else {
                    tmp_svc_data = {"service_name":"database"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S1853")) {
                    hide_lnb_menu("storage");
                } else {
                    tmp_svc_data = {"service_name":"storage"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S3891")) {
                    hide_lnb_menu("zadara");
                } else {
                    tmp_svc_data = {"service_name":"zadara"};
                    active_service_list.push(tmp_svc_data);
                }

                if (!(check_service(list, "S3888") && check_service(list, "S3889"))) {
                    hide_lnb_menu("daisy");
                } else {
                    tmp_svc_data = {"service_name":"daisy"};
                    active_service_list.push(tmp_svc_data);
                }

                if (!check_service(list, "S3641")) {
                    hide_lnb_menu("appster");
                } else {
                    tmp_svc_data = {"service_name":"appster"};
                    active_service_list.push(tmp_svc_data);
                }

                if (!check_service(list, "S2237")) {
                    hide_lnb_menu("gslb");
                } else {
                    tmp_svc_data = {"service_name":"gslb"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S1820") && !check_service(list, "S5402") && !check_service(list, "S5403") && !check_service(list, "S1962")) {
                    hide_lnb_menu("monitoring");
                } else {
                    tmp_svc_data = {"service_name":"monitoring"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S2248")) {
                    hide_lnb_menu("nas");
                } else {
                    tmp_svc_data = {"service_name":"nas"};
                    active_service_list.push(tmp_svc_data);
                    if(is_entv2_user()){
                        $(".nas_volume_list > a").attr("href", "/console/naslistm2");
                        $("#m9 > a").attr("href", "/console/naslistm2");
                        $(".subtab_nas").remove();
                        $(".nas_connect_serve").remove();
                    }
                }

                if(!check_service(list, "S1879")) {
                    hide_lnb_menu("loadbalancer");
                } else {
                    tmp_svc_data = {"service_name":"loadbalancer"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S1963")) {
                    hide_lnb_menu("waf");
                } else {
                    tmp_svc_data = {"service_name":"waf"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S4304")) {
                    hide_lnb_menu("wafpro");
                } else {
                    tmp_svc_data = {"service_name":"wafpro"};
                    active_service_list.push(tmp_svc_data);
                }

                if (!check_service(list, "S2249")) {
                    hide_lnb_menu("hpc");
                } else {
                    tmp_svc_data = {"service_name":"hpc"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S1824")) {
                    hide_lnb_menu("engine");
                } else {
                    tmp_svc_data = {"service_name":"engine"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S1960")) {
                    hide_lnb_menu("vdi");
                } else {
                    tmp_svc_data = {"service_name":"vdi"};
                    active_service_list.push(tmp_svc_data);
                }

                if (!check_service(list, "S2718")) {
                    hide_lnb_menu("encoder");
                } else {
                    tmp_svc_data = {"service_name":"encoder"};
                    active_service_list.push(tmp_svc_data);
                }

                if(check_eng_member()) {
                    hide_lnb_menu("marketplace");
                } else {
                    if (!check_service(list, "S5404")
                        && !check_service(list, "S5401")
                        && !check_service(list, "S5402")
                        && !check_service(list, "S5379")
                        && !check_service(list, "S5374")) {
                        hide_lnb_menu("marketplace");
                    } else {
                        tmp_svc_data = {"service_name":"marketplace"};
                        active_service_list.push(tmp_svc_data);
                    }
                }

                //AI API Cloud 임시
                if(!check_service(list, "S9999")) {
                    hide_lnb_menu("ai");
                } else {
                    tmp_svc_data = {"service_name":"ai"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S1820")) {
                    hide_lnb_menu("container");
                    hide_lnb_menu("arsenal");
                } else {
                    tmp_svc_data = {"service_name":"container"};
                    active_service_list.push(tmp_svc_data);
                    tmp_svc_data = {"service_name":"arsenal"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S4332")) {
                    hide_lnb_menu("phishingme");
                } else {
                    tmp_svc_data = {"service_name":"phishingme"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S4333")) {
                    hide_lnb_menu("securaider");
                } else {
                    tmp_svc_data = {"service_name":"securaider"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S4497")) {
                    hide_lnb_menu("apppush");
                } else {
                    tmp_svc_data = {"service_name":"apppush"};
                    active_service_list.push(tmp_svc_data);
                }

                if(!check_service(list, "S4604")) {
                    hide_lnb_menu("coocon");
                } else {
                    tmp_svc_data = {"service_name":"coocon"};
                    active_service_list.push(tmp_svc_data);
                }

                if($.cookie("memsq") == "M119215" || $.cookie("memsq") == "M189935"){
                    tmp_svc_data = {"service_name":"hybridcloud"};
                    active_service_list.push(tmp_svc_data);
                }else{
                    hide_lnb_menu("hybridcloud");
                }

                if($.cookie("memsq") == "M119215" || $.cookie("memsq") == "M119214"){
                    tmp_svc_data = {"service_name":"cdn_new"};
                    active_service_list.push(tmp_svc_data);
                }else{
                    hide_lnb_menu("cdn_new");
                }
            }
        }
    });
}

function check_service(src_list, svc_cd) {
    var svc_list = src_list;

    if(!svc_list || svc_list.length == 0) {
        var params        = { command : "svcList" };

        $.ajax({
            url: WebROOT + "contractServlet",
            type: "POST",
            data: params,
            dataType: "json",
            async: false,
            success: function(data) {
                if (data.response.result == "0") {
                    svc_list    = data.response.data;
                }
            }
        });
    }

    var return_val = false;

    for (var i = 0; i < svc_list.length; i++) {
        if (svc_list[i].ordSvcStCd == "10" && svc_list[i].serviceCD == svc_cd) {
            return_val = true;
            break;
        }
    }

    return return_val;
}

function set_charge_info(){
    var now = getTodayNow();
    defaultYYYY = now.substring(0,4);
    defaultMM = now.substring(6,8);
    defaultDD = now.substring(10,12);

    var params={
        command : "use_bill_charge",
        defaultYYYY : defaultYYYY,
        defaultMM : defaultMM,
        defaultDD : defaultDD,
        group_mem_sq : $.cookie("groupmemsq")
    };

    $.ajax({
        url: "/ConsoleMain"
        , async: false
        , type : "POST"
        , data : params
        , dataType : "json"
        , complete : hideLoadingBox
        , success : function(json) {
            if(json.status == "00"){
                var data = json.data;

                if(data.from_dt!=null && data.to_dt!=null) {
                    use_date = "<em>사용기간</em>";
                    use_date += data.from_dt.substring(0,7);
                }

                // 언어별 요금 처리
                var atm_user_txt = "";
                var atm_period_txt = "";
                var atm_total_txt = "";
                var atm_estimated_txt = "";
                var atm_estimated_total_txt = "";

                memid = $.cookie("memid");
                if($.cookie("groupmemsq") != null && $.cookie("groupmemsq") != ""){
                    memid = $.cookie("groupmemid");
                }

                if(check_eng_member()) {
                    if(get_lang_cookie() == "en") {
                        atm_user_txt = "<span class='b'>" + memid + "</span>'s </p>";
                        atm_period_txt = get_message_from_id("txt_lang_current_charge") + " in " + defaultMM;
                        atm_total_txt = "$" + setNumberComma(isNumber(data.result_atm)) + " >";
                        atm_estimated_txt =  " ※  Expected charge in " + defaultMM;
                        atm_estimated_total_txt =  "$" + data.expected_amt;
                    } else {
                        atm_user_txt = "<span class='b'>" + memid + "</span>" + "님의 </p>";
                        atm_period_txt = defaultMM + "월 " + " 현재까지 이용 금액";
                        atm_total_txt = setNumberComma(isNumber(data.result_atm)) + "USD >";
                        atm_estimated_txt =  defaultMM + "월 예상 청구 금액";
                        atm_estimated_total_txt =  data.expected_amt + "USD";
                    }
                } else {
                    if(get_lang_cookie() == "en") {
                        atm_user_txt = "<span class='b'>" + memid + "</span>'s </p>";
                        atm_period_txt = get_message_from_id("txt_lang_current_charge") + " in " + defaultMM;
                        atm_total_txt = setNumberComma(isNumber(data.result_atm)) + "KRW >";
                        atm_estimated_txt =  " ※  Expected charge is " + data.expected_amt + " KRW in " + defaultMM;
                        atm_estimated_total_txt =  data.expected_amt + "KRW";
                    } else {
                        atm_user_txt = "<span class='b'>" + memid + "</span>" + "님의 </p>";
                        atm_period_txt = defaultMM + "월 " + " 현재까지 이용 금액";
                        atm_total_txt = setNumberComma(isNumber(data.result_atm)) + "원 >";
                        atm_estimated_txt = defaultMM + "월 예상 청구 금액 ";
                        atm_estimated_total_txt =  data.expected_amt + "원 ";
                    }
                }

                $("#atm_period").html(atm_period_txt);
                $("#atm_total").html(atm_total_txt);
                $("#atm_estimated").html(atm_estimated_txt);
                $("#atm_estimated_total").html(atm_estimated_total_txt);
            }
        }
    });

    show_tooltip("group_mgmt_btn", "N");
}

function getTodayNow(){
    var now = "";
    var giYear = "";
    var giMonth = "";
    var giDay = "";
    $.ajax({
        url: "/bizMecaInfo",
        type: "POST",
        data: "command=serverTime&dtFormat=yyyyMMdd",
        dataType: "json",
        async : false,
        success: function(json) {
            now = json.time;
            giYear = now.substring(0,4);
            giMonth = now.substring(4,6);
            giDay = now.substring(6,8);

        },
        error: function(XMLHttpResponse) {
            return;
        }
    });

    start_net_day = getCalculatorDay(giYear,giMonth,giDay,-8); //8일 전
    end_net_day = getCalculatorDay(giYear,giMonth,giDay,-1); //하루 전
    return giYear + "년 " + giMonth + "월 " + giDay + "일 ";
}

function getNowTime(){
    var now_time = "";

    $.ajax({
        url: "/bizMecaInfo",
        type: "POST",
        data: "command=serverTime&dtFormat=yyyy-MM-dd HH:mm:ss",
        dataType: "json",
        async : false,
        success: function(json) {
            now_time = json.time;
        },
        error: function(XMLHttpResponse) {
            return;
        }
    });

    return now_time;
}

function getCalculatorDay(yy,mm,dd,day_int){
    var settingDate = new Date(parseInt(yy), parseInt(mm) - 1, parseInt(dd) + day_int);

    yy = settingDate.getFullYear();
    mm = settingDate.getMonth() + 1;
    mm = (mm < 10) ? '0' + mm : mm;
    dd = settingDate.getDate();
    dd = (dd < 10) ? '0' + dd : dd;

    return '' + yy + '-' +  mm  + '-' + dd;
}

//문자를 숫자로 변환
function isNumber(number_str) {
    var result = 0;

    try {
        if(number_str!=null) {
            result = parseInt(number_str);
        }
    } catch(e) {
        result = 0;
    }

    return result;
}

function setNumberComma(num) {
    var num1    = "";
    var num2    = "";
    var sReturn    = "";

    if(typeof num == "number") {
        num    = "" + num;
    }

    if(num.indexOf(".") == -1) {
        num1    = num;
    } else {
        num1    = num.split(".")[0];
        num2    = num.split(".")[1];
    }

    var len    = num1.length;
    var cnt    = 0;
    var c    = "";

    for(var i = len-1; i >= 0; i--) {
        c    = num1.charAt(i);

        if(c >= '0' && c <= '9') {

            if( cnt > 0 && cnt % 3 == 0) {
                sReturn    = "," + sReturn;
            }

            sReturn    = c + sReturn ;
            cnt++;
        } else {
            return num;
        }
    }

    if (num2 != "") {
        sReturn += "." + num2;
    }

    return sReturn;
}

function get_number_only(str) {
    var ptn = /[0-9]/g;
    return str.match(ptn);
}

function get_resource_cnt(dest_me_sq) {
    var now = getTodayNow();
    var defaultYYYY = now.substring(0,4);
    var defaultMM = now.substring(6,8);
    var defaultDD = now.substring(10,12);

    var rtrn_arr = [];

    var params={
        command : "service_use_condition",
        defaultYYYY : defaultYYYY,
        defaultMM : defaultMM,
        defaultDD : defaultDD,
        group_mem_sq : dest_me_sq
    };

    $.ajax({
        url: "/ConsoleMain"
        , async: false
        , type : "POST"
        , data : params
        , dataType : "json"
        , complete : hideLoadingBox
        , success : function(json) {
            if(json.status == "00"){
                var lists = json.data;

                for(var i = 0; i < lists.length; i++){
                    var data = lists[i];

                    var MDCODE            = data.MDCODE;

                    var vm_cnt            = parseInt(data.VM_CNT);
                    var disk_cnt        = parseInt(data.DISK_CNT);
                    var ip_cnt            = parseInt(data.IP_CNT);
                    var cip_cnt            = parseInt(data.CIP_CNT);
                    var snap_cnt            = parseInt(data.SNAP_CNT);
                    var download_gb    = parseInt(data.DOWNLOAD_GB);
                    var stream_gb    = parseInt(data.STREAM_GB);
                    var store_gb    = parseInt(data.STORE_GB);
                    var store_gb_ec    = parseInt(data.STORE_GB_EC);
                    var trans_gb    = parseInt(data.TRANS_GB);
                    var nas_gb            = parseInt(data.NAS_GB);

                    var idx = 0;

                    //서버정보 - 서버,디스크,IP
                    if(MDCODE == "S1820") {
                        var obj = new Object();
                        obj.type = "server";
                        obj.vm_cnt = vm_cnt;
                        obj.disk_cnt = disk_cnt;
                        obj.ip_cnt = ip_cnt;
                        obj.cip_cnt = cip_cnt;

                        rtrn_arr.push(obj);
                    }
                    //NAS - 디스크
                    else if(MDCODE == "S2248") {
                        var obj = new Object();
                        obj.type = "NAS";
                        obj.disk_cnt = disk_cnt;
                        obj.nas_gb = nas_gb;
                        obj.snap_cnt = snap_cnt;
                        rtrn_arr.push(obj);
                    }
                    //LB
                    else if(MDCODE == "S1879") {
                        var obj = new Object();
                        obj.type = "로드밸런서";
                        obj.vm_cnt = vm_cnt;
                        obj.trans_gb = trans_gb;

                        rtrn_arr.push(obj);
                    }
                    //waf
                    else if(MDCODE == "S1963") {
                        var obj = new Object();
                        obj.type = "웹방화벽";
                        obj.vm_cnt = vm_cnt;

                        rtrn_arr.push(obj);
                    }
                    //storage
                    else if(MDCODE == "S1853") {
                        var obj = new Object();
                        obj.type = "storage";
                        obj.store_gb = store_gb;
                        obj.store_gb_ec = store_gb_ec;
                        obj.trans_gb = trans_gb;
                        obj.disk_cnt = disk_cnt;
                        rtrn_arr.push(obj);
                    }
                    //CDN
                    else if(MDCODE == "S1850") {
                        var obj = new Object();
                        obj.type = "CDN";
                        obj.vm_cnt = vm_cnt;
                        obj.download_gb = download_gb;
                        obj.stream_gb = stream_gb;

                        rtrn_arr.push(obj);
                    }
                    //DB
                    else if(MDCODE == "S1823") {
                        var obj = new Object();
                        obj.type = "DB";
                        obj.vm_cnt = vm_cnt;
                        obj.nas_gb = nas_gb;
                        rtrn_arr.push(obj);
                    }
                    //GSLB
                    else if(MDCODE == "S2237") {
                        var obj = new Object();
                        obj.type = "GSLB";
                        obj.vm_cnt = vm_cnt;
                        obj.ip_cnt = ip_cnt;
                        rtrn_arr.push(obj);
                    }

                }
            }
        }
    });

    return rtrn_arr;
}

function add_noti_message(resource_url, result_message) {
    var console_noti_lists = [];

    var obj_id        = new Date().getTime();
    var event_time    = getNowTime();

    var new_noti = new Object();
    new_noti.url        = resource_url;
    new_noti.message    = result_message;
    new_noti.id        = obj_id;
    new_noti.time        = event_time;

    //Getters
    var storedData = sessionStorage.getItem("os_console_noti");

    if(storedData) {
        console_noti_lists = JSON.parse(storedData);
    }

    console_noti_lists.splice(0, 0, new_noti);

    sessionStorage.removeItem("os_console_noti");

    sessionStorage.setItem("os_console_noti",  JSON.stringify(console_noti_lists));

    set_noti_message_count();
    set_notice_lists();
}

function get_noti_message() {
    var noti_data = sessionStorage.getItem("os_console_noti");
    var console_noti_lists = [];

    if(noti_data) {
        console_noti_lists = JSON.parse(noti_data);
    }

    return console_noti_lists;
}

function show_noti_message() {
    var noti_messages = get_noti_message();

    if(noti_messages.length > 0) {
        var message_html = "";

        for(var i = 0; i < noti_messages.length; i++) {
            var message_obj = noti_messages[i];
            var svc_url            = message_obj.url;
            var message_content    = message_obj.message;
            var message_id        = message_obj.id;
            var message_time    = message_obj.time;

            var noti_html = '<tr class="pop_tst_t notice_clss_' + message_id + '">';
            noti_html += '<td><img src="/images/coni/Toast_Info.svg" alt="' + get_url_service_name(svc_url) + '" />' + get_url_service_name(svc_url) + '</td>';
            noti_html += '<td><img src="/images/coni/toast_new.svg" alt="new" />' + message_time + '</td>';
            noti_html += '<td class="notice_delete" msg_id=' + message_id + '><img src="/images/coni/trash.svg" alt="삭제" /></td>';
            noti_html += '</tr>';
            noti_html += '<tr class="pop_tst_c notice_clss_' + message_id + '">';
            noti_html += '<td colspan="3"><p>' + sanitizeXSS(message_content) + '</p></td>';
            noti_html += '</tr>';

            $("#noti_alm_tbody").append(noti_html);

            $(".notice_delete").on("click", function() {
                delete_noti_message($(this).attr("msg_id"));
                $(".notice_clss_" + $(this).attr("msg_id")).remove();
            });
        }
    }
}

function delete_noti_message(message_id) {
    var index = -1;
    var console_noti_lists = [];

    var storedData = sessionStorage.getItem("os_console_noti");

    if(storedData) {
        console_noti_lists = JSON.parse(storedData);
    }

    if(console_noti_lists.length > 0) {
        for(var i = 0; i < console_noti_lists.length; i++) {
            if(console_noti_lists[i].id == message_id) {
                index = i;
            }
        }
    }

    if(index >= 0) {
        console_noti_lists.splice(index, 1);
    }

    sessionStorage.setItem("os_console_noti",  JSON.stringify(console_noti_lists));
    set_noti_message_count();

    $(".pop_tst_c notice_clss_" + message_id).remove();
}

function set_noti_message_count() {
    noti_cnt = get_noti_message().length;

    $("#noti_message_box").show();

    if(noti_cnt == 0) {
        $("#noti_count").hide();
    } else {
        $("#noti_count").show();
        $("#noti_count").text(noti_cnt);
    }
}

function go_noti_page(message_id, svc_url) {
    delete_noti_message(message_id);
    window.location.href = svc_url;
}

function go_to_calculator() {
    if(check_eng_member()) {
        window.open('/en_portal/p_pay_calcul.html','calcul','toolbar=no,statusbar=no,location=no,scrollbars=no,resizable=yes,width=1024,height=750');
    } else {
        window.open('/calculator');
    }
}

//[s] Message Box
function showLoadingBoxSis( img_url )
{
    var loadingBox = jQuery("#dialog_loading_box");

    if( loadingBox.html() == null) {
        makeLoadingBox();
        loadingBox = jQuery("#dialog_loading_box");
    }
    loadingBox.dialog({
        width : 490,
        height : 260,
        autoOpen : false,
        modal : true,
        resizable : false,
        draggable:false,
        zIndex : 2000,
        dialogClass : "border_0"
    });
    $("#dialog_Instancesservice_Msg").siblings().remove();
    $("#dialog_Instancesservice_Msg").css("padding" , "0");
    $("#dialog_Instancesservice_Msg").parent().css("padding" , "0");

    if( img_url != undefined && img_url != "" ) {
        jQuery(".ok_pbox01 > img", loadingBox).attr("src", img_url);
    }

    jQuery(".ui-dialog-titlebar", loadingBox.parent()).hide();
    loadingBox.removeClass('ui-dialog-content');
    loadingBox.removeClass('ui-widget-content').parent().removeClass('ui-widget-content');
    loadingBox.css('width','490px').css('height','250px');

    loadingBox.dialog("open");
}


function reset_table_column(localStorageName){
    /*
     * 항목변경동작
     */
    var csserver = localStorage.getItem(localStorageName);

    if(csserver != null && csserver != "undefined") {

        var dest_label = $("input[name=m_chkwrap]:checkbox").parent().parent().parent().find("dd").find("label");
        var dest_input = $("input[name=m_chkwrap]:checkbox").parent().parent().parent().find("dd").find("input");

        $(csserver).find("label").each(function() {
            if($(this).attr("class") == "m_chkwrap on"){//체크되어있는 항목이면 보임
                var chk_index = $(this).find(".chkbox").val();

                dest_label.eq(chk_index).addClass("on");
                dest_input.eq(chk_index).attr("checked","checked");
            }
        });

        //체크박스 동작
        $("input.chkbox").on("click focus", function(){
            if($(this).not(":disabled")){
                if($(this).prop( "checked" ) == true){
                    $(this).parent("label").addClass("on");
                    $(this).parent("label").attr("value","1");
                }else{
                    $(this).parent("label").removeClass("on");
                    $(this).parent("label").attr("value","0");
                }
            }
            DisableInput();
        });

        $("input[name=m_chkwrap]:checkbox").each(function() {
            var modifyingchk = $(this).is(":checked");
            var modifyingval = $(this).val();

            if($(this).parent().attr("class") == "m_chkwrap on"){//체크되어있는 항목이면 보임
                $(".col_modifying_enteries_" + modifyingval).show("slow");
                $(".th_modifying_enteries_" + modifyingval).show("slow");
                $(".td_modifying_enteries_" + modifyingval).show("slow");
            }else{
                $(".col_modifying_enteries_" + modifyingval).hide("slow");
                $(".th_modifying_enteries_" + modifyingval).hide("slow");
                $(".td_modifying_enteries_" + modifyingval).hide("slow");
            }
        });

        reset_col_resize();
    }
}


//항목변경 - 적용 버튼
function apply_modifying_enteries(localstorage_name){
    $("input[name=m_chkwrap]:checkbox").each(function() {
        var modifyingchk = $(this).parent().hasClass("on");
        var modifyingval = $(this).val();
        if(modifyingchk){//체크되어있는 항목이면 보임
            $(".col_modifying_enteries_" + modifyingval).show("slow");
            $(".th_modifying_enteries_" + modifyingval).show("slow");
            $(".td_modifying_enteries_" + modifyingval).show("slow");
        }else{
            $(".col_modifying_enteries_" + modifyingval).hide("slow");
            $(".th_modifying_enteries_" + modifyingval).hide("slow");
            $(".td_modifying_enteries_" + modifyingval).hide("slow");
        }
    });

    localStorage.setItem(localstorage_name,$("input[name=m_chkwrap]:checkbox").parent().parent().parent().html());

//    항목변경 후, 존재하던 컬럼이 사라지면 사라진 컬럼만큼이 공백으로 표시되는 것을 막기 위해 내부적으로 한 번 더 호출하여 해결.
    setTimeout( function(){reset_col_resize()}, 500);
}

function set_new_column(localStorageName) {
    localStorage.setItem(localStorageName, $("input[name=m_chkwrap]:checkbox").parent().parent().parent().html());
    reset_col_resize();
}

function login_check_with_server(){ // 정상적인 로그인이 되었는지 확인
    var return_flag = false;

    $.ajax({
        url : "/bizMecaAPOrder",
        type : "POST",
        data : "command=check",
        dataType : "json",
        async : false,
        success : function(json) {
            var items = json.response;
            if (items.result != "0" || items.msg != "success") {
                return_flag = false;
            } else {
                return_flag = true;
            }
        }
    });

    return return_flag;
}

//모니터링 analysis/monitoring/controller/listMonitoring2.do
function set_cdp_data() {

    $.ajax({
        url: "/isSvcSvrPrc",
        type: "POST",
        data: "command=getCDPData",
        dataType: "json",
        success: function(json) {
            var items = json.data;
            if (items != null) {
                $("#memsq").val(items.mem_sq);
                $("#memnm").val(items.mem_nm);
                $("#timestamp").val(items.time_stamp);
                $("#cdpForm").attr("action", "/cdp_url.jsp").attr("method", "post").submit();
            }else{
                window.location.href="/cdn/all";
            }
        }
    });
}


function go_portal_inquiry(category, servicename, url){

    // IAM 사용자인 경우 문의하기 사용 못함 : 조성훈, 2020. 03. 20
    if($.cookie("iamid")) {
        return;
    }

    if( $("#div_for_qna_dialog").size()==0 ){
        load_div_for_qna_dialog();
        setTimeout( function(){$("#qna_dialog_popup").dialog("open")}, 1000);

        setTimeout( function(){
            var service_select = $("#selectServiceType");
            $("#pageUrl").text(url);
            var html = $("<option value='"+ category +"'  selected='selected'>" + servicename + "</option>");
            service_select.append(html);
        },1000);

    }else{
        $("#qna_dialog_popup").dialog("open");
    }
}

function load_div_for_qna_dialog(){
    var div_dlg = $('<div id="div_for_qna_dialog">');
    div_dlg.load("/portal/qnaWritePop.do" , function() {
        $("body").append(div_dlg);

        $("#qna_dialog_popup").dialog({
            width: 750,
            autoOpen: false,
            modal: true,
            resizable:false,
            draggable:true,
            zIndex: 2000
        });
        $("#qna_dialog_popup").siblings().remove();
        $("#qna_dialog_popup").css("padding" , "0");
        $("#qna_dialog_popup").parent().css("padding" , "0");
        $("#qna_dialog_popup").css("overflow","hidden");
        $("#qna_dialog_popup").dialog({draggable: false}).parent().draggable();

        if (typeof initFunc == "function") {
            initFunc();
        }

    });
}

function getService() {
    var lists = null;
    $.ajax({
        url: "/userinfo",
        type:"POST",
        data:"command=getServiceList",
        dataType:"json",
        async:false,
        success:function(data) {
            var id = data.listqnaservice;
            var service_lists = id.listservice;
            var service_select = $("#selectServiceType");
            if(service_lists != null && service_lists.length >0) {
                for(var i=0; i < service_lists.length; i++ ){
                    var html = $("<option value='"+ service_lists[i].category_sq +"'>" + service_lists[i].category_nm + "</option>");
                    service_select.append(html);
                }
            }
        }
    });
}

function getServiceType(qType) {
    var tmpService = $("#selectServiceType option:selected").val();
    var objLang = get_lang_cookie();

    if( tmpService == null || tmpService == "" || tmpService < 1){
        if(objLang=="en"){
            showCommonNoLangErrorMsg("Inquiry Service", "Please enter inquiry service. ", null);
        }else{
            showCommonNoLangErrorMsg("문의서비스", "문의서비스를 입력하여 주십시오.", null);
        }

        return false;
    }
    var lists = null;
    $.ajax({
        url: "/userinfo",
        type:"POST",
        data:"command=getServiceTypeList&qtype_sq="+tmpService+"&level="+qType,
        dataType:"json",
        async:false,
        success:function(data) {
            var id = data.listservicetype;
            var servicetype_lists = id.listservice;
            var servicetype_select = $("#selectQnaType2").empty();
            if(servicetype_lists != null && servicetype_lists.length >0) {

                if(objLang=="en"){
                    var htmlBase = "<option value='0' selected='selected'>selected</option>";

                    servicetype_select.append(htmlBase);
                    for(var i=0; i < servicetype_lists.length; i++ ){

                        var html = $("<option value='"+ servicetype_lists[i].qtype_sq +"'>" + servicetype_lists[i].qtype_nm_en+ "</option>");
                        servicetype_select.append(html);
                    }
                }else{
                    var htmlBase = "<option value='0' selected='selected'>선택하세요</option>";

                    servicetype_select.append(htmlBase);
                    for(var i=0; i < servicetype_lists.length; i++ ){
                        var html = $("<option value='"+ servicetype_lists[i].qtype_sq +"'>" + servicetype_lists[i].qtype_nm+ "</option>");
                        servicetype_select.append(html);
                    }
                }
            }
            else {
                if(objLang=="en"){
                    var html = "<option value='0' selected='selected'>selected</option>";
                }else{
                    var html = "<option value='0' selected='selected'>선택하세요</option>";
                }
                servicetype_select.append(html);
            }
        }
    });
}

// 청약이 되어 있는지 확인
function check_service_yn() {
    var return_yn = "N";

    var params        = { command : "svcList" };

    $.ajax({
        url: WebROOT + "contractServlet",
        type: "POST",
        data: params,
        dataType: "json",
        async: false,
        success: function(data) {
            if (data.response.result == "0") {
                var list    = data.response.data;

                for (var i = 0; i < list.length; i++) {
                    if (list[i].ordSvcStCd == "10") {
                        return_yn = "Y";
                        break;
                    }
                }
            }
        }
    });

    return return_yn;
}

function cnb_resource_count(type){
    var dest_type = type;

    if(type == "loadbalancer") {
        dest_type = "lb";
    } else if(type == "database") {
        dest_type = "db";
    } else if(type == "marketplace") {
        dest_type = "market";
    } else if(type == "server" || type == "cdn" || type == "storage" || type == "gslb" || type == "monitoring" || type == "nas" || type == "lb" || type == "waf" || type == "hpc" || type == "market" || type == "wafpro" || type=="cdn_new") {
        dest_type = type;
    } else {
        return;
    }

    var params={
        command : "resource_use_condition",
        group_mem_sq : $.cookie("groupmemsq"),
        type : dest_type
    };

    $.ajax({
        url: "/ConsoleMain",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(json) {
            var items = json.data;
            if (items != null) {
                if(dest_type == "server"){
                    $("#server_list").text("");

                    $("#server_list").text(get_message_from_id("txt_lang_lmcs_serverlist") + "(" + items[0].svr_cnt + ")");
                    $("#server_disk").text("");
                    $("#server_disk").text("Disk"+"("+ items[0].disk_cnt +")");
                    $("#server_network").text("");
                    $("#server_network").text(get_message_from_id("txt_lang_lmcs_network") + "(" + items[0].ip_cnt + ")");
                    $("#server_snapshot").text("");
                    $("#server_snapshot").text(get_message_from_id("txt_lang_lmcs_snapshot") + "(" + items[0].snap_cnt + ")");
                    $("#server_backkup").text("");
                    $("#server_backkup").text("backup"+"("+ items[0].backup_cnt +")");
                } else if(dest_type == "cdn"){
                    $("#button_lnbcdn_list").text("");

                    $("#button_lnbcdn_list").text(get_message_from_id("txt_lang_lmcdn_servicelist") + "(" + items[0].cdn_cnt + ")");
                } else if(dest_type == "db"){
                    $("#button_lnbdb_list").text("");

                    $("#button_lnbdb_list").text(get_message_from_id("txt_lang_lmdb_list") + "(" + items[0].db_cnt + ")");
                    $("#button_mariaDB_list").text("");

                    $("#button_mariaDB_list").text(get_message_from_id("txt_lang_lmdb_list") + "(" + items[0].maria_cnt + ")");
                } else if(dest_type == "gslb"){
                    $("#button_lnbgslb_list").text("");

                    $("#button_lnbgslb_list").text(get_message_from_id("txt_lang_lmgslb_list") + "(" + items[0].gslb_cnt + ")");
                } else if(dest_type == "monitoring"){
                    $("#button_lnbsitescope_list").text("");
                    $("#button_lnbsycros_list").text("");

                    $("#button_lnbsitescope_list").text("SiteScope (" + items[0].sitescope_cnt + ")");
                    $("#button_lnbsycros_list").text("Sycros (" + items[0].sycros_cnt + ")");
                } else if(dest_type == "nas"){
                    $("#button_lnbnas_volumelist").text("");
                    $("#button_lnbnas_snapshot").text("");

                    $("#button_lnbnas_volumelist").text(get_message_from_id("txt_lang_lmnas_volumelist") + "(" + items[0].nas_cnt + ")");
                    $("#button_lnbnas_snapshot").text(get_message_from_id("txt_lang_lmnas_snapshot") + "(" + items[0].nas_snap_cnt + ")");
                } else if(dest_type == "lb"){
                    $("#button_lnblb_list").text("");

                    $("#button_lnblb_list").text(get_message_from_id("txt_lang_lmlb_loadbalancerlist") + "(" + items[0].mpx_cnt + ")");
                } else if(dest_type == "waf"){
                    $("#button_lnbwaf_list").text("");

                    $("#button_lnbwaf_list").text(get_message_from_id("txt_lang_lmwaf_waflist") + "(" + items[0].waf_cnt + ")");
                } else if(dest_type == "hpc"){
                    $("#button_lnbhpc_serverlist").text("");
                    $("#button_lnbhpc_networklist").text("");

                    $("#button_lnbhpc_serverlist").text(get_message_from_id("txt_lang_lmhpc_serverlist") + "(" + items[0].hpc_cnt + ")");
                    $("#button_lnbhpc_networklist").text(get_message_from_id("txt_lang_lmhpc_network") + "(" + items[0].ip_cnt + ")");
                } else if(dest_type == "market"){
                    $("#button_lnbmarket_deepsecuritylist").text("");
                    $("#button_lnbmarket_shellmonitorlist").text("");
                    $("#button_lnbmarket_damolist").text("");
                    $("#button_lnbmarket_fsecurelist").text("");
                    $("#button_lnbmarket_sycroslist").text("");

                    if(items[0].deep_cnt == undefined){
                        $("#button_lnbmarket_deepsecuritylist").text("Deep Security"+"(0)");
                    }else{
                        $("#button_lnbmarket_deepsecuritylist").text("Deep Security"+"("+ items[0].deep_cnt +")");
                    }
                    $("#button_lnbmarket_shellmonitorlist").text("Shell Monitor"+"("+ items[0].shell_cnt +")");
                    $("#button_lnbmarket_damolist").text("D'Amo"+"("+ items[0].damo_cnt +")");
                    $("#button_lnbmarket_fsecurelist").text("F-Secure"+"("+ items[0].fsecure_cnt +")");
                    $("#button_lnbmarket_sycroslist").text("Sycros"+"("+ items[0].sycros_cnt +")");
                } else if(dest_type == "wafpro"){
                    var original_text = $("#button_lnbwafpro_list").attr("origin_text");

                    $("#button_lnbwafpro_list").text(original_text + "(" + items[0].wafpro_cnt + ")");
                } else if(dest_type == "cdn_new"){
                    $("#button_lnbcdn_list_new").text("CDN 서비스 리스트");
                    var original_text = $("#button_lnbcdn_list_new").text();

                    $("#button_lnbcdn_list_new").text(original_text + "(" + items[0].cdn_new_cnt + ")");
                }
            }else{
                window.location.href="/cdn/all";
            }
        }
    });
}

function get_message_from_id(dest_id) {
    var obj_name = "#" + dest_id;
    dest_obj = $(obj_name);

    return dest_obj.attr("name");
}

function get_service_lists() {
    var rtrn_list = null;

    var params        = { command : "svcList" };

    $.ajax({
        url: WebROOT + "contractServlet",
        type: "POST",
        data: params,
        dataType: "json",
        async: false,
        success: function(data) {
            if (data.response.result == "0") {
                rtrn_list    = data.response.data;
            }
        }
    });

    return rtrn_list;
}


$(function(){
    //매뉴얼
    $(".manual_open2").bind("mouseover", function(){
        var cont = ($(".manual_pop2").css("display") === "none")
            ? "block"
            : "none";
        $(".manual_pop2").css("display", cont);
    });
    $(".manual_pop2").bind("mouseleave", function(){
        var cont = ($(".manual_pop2").css("display") === "block")
            ? "none"
            : "block";
        $(".manual_pop2").css("display", cont);
    });

});


var window_x_position = 0;

if(!document.addEventListener) {
    document.attachEvent('mousemove', onMouseMove);
} else {
    document.addEventListener('mousemove', onMouseMove, false);
}

function onMouseMove(e){
    if (typeof window.position != 'undefined'){     // the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
        window_x_position = window.position.x;
    }else{
        window_x_position = e.clientX;
    }
}

function getMouseX() {
    return window_x_position;
}

function set_col_resize2(){

    var screenW = screen.width;
    var gwidth = screenW;

    $("#table_head_area").colResizable({
        liveDrag:true,
        gripInnerHtml:"<div class='grip'></div>",
        draggingClass:"dragging",
        onResize:null});
    $("#table_body_area").colResizable({
        liveDrag:true,
        gripInnerHtml:"<div class='grip'></div>",
        draggingClass:"dragging",
        onResize:null});

    // body에서 split로 content를 나누어 표시하도록.
    $('div.split-pane').splitPane();

    setTimeout(function(){
        set_scroll();
    }, 1000);
}

function imageSort(item){
    var image_list = [];
    var images = [];
    var num = 0;
    for(var j=0; j<25; j++){
        var z = j+1;
        if(z<10){
            image_list.push({
                img : "c_0"+z
            });
        } else {
            image_list.push({
                img : "c_"+z
            });
        }
    }
    for(var i=0; i<item.length; i++){
        images.push({
            name : image_list[num].img
        });
        num ++;
        if(num >= 25){
            num = 0;
        }
    }
    return images;
}

function add_new_service(dest_mdcode) {
    add_portal_css();
    setTimeout(function(){ process_service_add(dest_mdcode); }, 1000);
}

function process_service_add(dest_mdcode) {
    window.name = "ucloud_console";
    // 청약이 안되어 있는 경우(신규청약인 경우)
    if(check_service_yn() == "N") {
        if(check_eng_member()) {
            go_portal_page("/en_portal/ktcloudportal.epc.productintro.cspublic.html");
        } else {
            go_portal_page("/product/computing/server/");
        }
        return;
    }

    if(dest_mdcode == "ujserver" || dest_mdcode == "usserver" || dest_mdcode == "umsql" || dest_mdcode == "usvolume") {    // 서버 서비스와 동일
        if(check_service(null, "S1820")) {    // server가 청약되어 있는 경우 서버 페이지로 이동.
            window.location.href = "/console/serverlist";
        } else {
            applyservice_check('s_add', 'S1820');
        }
    } else if(dest_mdcode == "mcloud") {    // media cloud : 스토리지, CDN을 함께 청약함
        applyservice_check('s_add', 'mediacloud');
    } else if(dest_mdcode == "uiexport") {    // ucloud import/export 서비스, 서버 서비스가 기본으로 청약이 필요함.
        if(check_eng_member()) {
            go_portal_page("/en_portal/ktcloudportal.epc.productintro.ucloudimportexport.html");
        } else {
            go_portal_page("/portal/ktcloudportal.epc.productintro.ucloudimportexport.html");
        }
    } else if(dest_mdcode == "upackaging" || dest_mdcode == "uautoscaling" || dest_mdcode == "umessaging" || dest_mdcode == "uwatch" || dest_mdcode == "uanalysis") {    // 서버 서비스가 청약이 되어 있어야 함.
        if(check_service(null, "S1820")) {    // server가 청약되어 있는 경우 서버 페이지로 이동.
            window.location.href = "/console/serverlist";
        } else {
            applyservice_check('s_add', 'S1820');
        }
    } else if(dest_mdcode == "umanaged") {
        if(check_eng_member()) {
            go_portal_page("/en_portal/ktcloudportal.epc.productintro.managed.info.html");
        } else {
            go_portal_page("/portal/ktcloudportal.epc.productintro.managed.info.html");
        }
    } else if(dest_mdcode == "uvpc") {    // vpc
        if(check_eng_member()) {
            go_portal_page("/en_portal/ktcloudportal.epc.productintro.vpc.info2.html");
        } else {
            go_portal_page("/portal/ktcloudportal.epc.productintro.vpc.info2.html");
        }
    } else if(dest_mdcode == "entcloud") {
        if(check_eng_member()) {
            go_portal_page("/en_portal/ktcloudportal.epc.productintro.enterprise.html");
        } else {
            go_portal_page("/portal/ktcloudportal.epc.productintro.enterprise.html");
        }
    } else if(dest_mdcode == "uszone") {
        if(check_eng_member()) {
            go_portal_page("/en_portal/ktcloudportal.epc.productintro.security1.html");
        } else {
            go_portal_page("/portal/ktcloudportal.epc.productintro.security1.html");
        }
    } else if(dest_mdcode == "umsecurity") {    // 컨설팅을 통한 서비스
        if(check_eng_member()) {
            go_portal_page("/en_portal/ktcloudportal.epc.productintro.security3.html");
        } else {
            go_portal_page("/portal/ktcloudportal.epc.productintro.security3.html");
        }
    } else if(dest_mdcode == "S2257" && (!check_service(null, "S2257"))) {    //ucloud MapReduce
        if(check_eng_member()) {
            go_portal_page("/en_portal/ktcloudportal.epc.productintro.mapreduce.html");
        } else {
            go_portal_page("/portal/ktcloudportal.epc.productintro.mapreduce.html");
        }
    } else if(dest_mdcode == "S1820") {
        if(!check_service(null, "S1820")) {    // server
            applyservice_check('s_add', 'S1820');
        }
    } else {
        applyservice_check('s_add', dest_mdcode);
    }
}

function delete_old_service(dest_mdcode) {

    var check_service_del_flag = check_service_del_possible();

    if(check_service_del_flag == "no_allow"){
        showCommonMsg($("#service_cancel_err"),"csserver");

        $("#service_cancel_err_ok").unbind("click").bind("click" , function(e) {
            $("#service_cancel_err").dialog("close");
        });

        return;
    }else{
        showCommonMsg($("#service_cancel_confirm"),"csserver");

        //CIP 연결 해제 확인
        $("#btn_service_cancel_ok").unbind("click").bind("click" , function(e) {
            add_portal_css();
            setTimeout(function(){ process_service_delete(dest_mdcode); }, 1000);
            $("#service_cancel_confirm").dialog("close");
        });
    }


}

function process_service_delete(dest_mdcode) {
    window.name = "ucloud_console";

    if(check_service(null, dest_mdcode)) {
        serviceCancel(dest_mdcode);
    }
}

function add_portal_css() {

    var portal_script01 = document.createElement('script');

    if(check_eng_member()) {
        portal_script01.setAttribute('src', '/en_scripts/portal.applyservice.seller.js');
    } else {
        portal_script01.setAttribute('src', '/scripts/portal.applyservice.seller.js?ver=20200326');
    }

    portal_script01.setAttribute('id', 'portal_script01');
    document.getElementsByTagName('head')[0].appendChild(portal_script01);

    var portal_script02 = document.createElement('script');

    if(check_eng_member()) {
        portal_script02.setAttribute('src', '/en_scripts/common.js');
    } else {
        portal_script02.setAttribute('src', '/scripts/common.js?ver=20200326');
    }

    portal_script02.setAttribute('id', 'portal_script02');
    document.getElementsByTagName('head')[0].appendChild(portal_script02);

    var portal_script03 = document.createElement('script');

    if(check_eng_member()) {
        portal_script03.setAttribute('src', '/en_scripts/portal.common.js');
    } else {
        portal_script03.setAttribute('src', '/scripts/portal.common.js?ver=20200326');
    }
    portal_script03.setAttribute('id', 'portal_script03');
    document.getElementsByTagName('head')[0].appendChild(portal_script03);

    var portal_script04 = document.createElement('script');

    if(check_eng_member()) {
        portal_script04.setAttribute('src', '/en_scripts/portal.myinfo.applyservice.common.js');
    } else {
        portal_script04.setAttribute('src', '/scripts/portal.myinfo.applyservice.common.js?ver=20200326');
    }

    portal_script04.setAttribute('id', 'portal_script04');
    document.getElementsByTagName('head')[0].appendChild(portal_script04);

    var portal_script05 = document.createElement('script');

    if(check_eng_member()) {
        portal_script05.setAttribute('src', '/en_scripts/portal.include.js');
    } else {
        portal_script05.setAttribute('src', '/scripts/portal.include_sm.js?ver=20200326');
    }

    portal_script05.setAttribute('id', 'portal_script05');
    document.getElementsByTagName('head')[0].appendChild(portal_script05);
}

function delete_portal_css() {

    if(document.getElementById('portal_script01')) {
        document.getElementById('portal_script01').remove();
    }

    if(document.getElementById('portal_script02')) {
        document.getElementById('portal_script02').remove();
    }

    if(document.getElementById('portal_script03')) {
        document.getElementById('portal_script03').remove();
    }

    if(document.getElementById('portal_script04')) {
        document.getElementById('portal_script04').remove();
    }

    if(document.getElementById('portal_script05')) {
        document.getElementById('portal_script05').remove();
    }
}

function get_preferred_language() {
    var return_language = "ko";

    if (navigator.appName == 'Netscape') {
        return_language = navigator.language;
    } else {
        return_language = navigator.browserLanguage;
    }

    if (return_language.indexOf('ko') > -1){
        return_language = "ko";
    } else {
        return_language = "en";
    }

    return return_language;
}

//최초 서버 청약 후 콘솔 접속시 로그 아웃 되는 문제 방지
function fill_svcid() {
    var memsq = $.cookie("memsq");

    var params={
        command : "setSessionSvcId" ,
        memsq    : memsq,
        svcid    : $.cookie("account")
    };

    $.ajax({
        url: "/isSvcSvrPrc",
        type : "POST",
        data : params,
        dataType : "json",
        async : false
    });
}

//--Start 2016. 01. 05, 오승남 : 서비스 해지시 이전 요청에서 5분 경과된 경우만 처리 가능하도록...
function check_service_del_possible() {
    var return_value    = "";
    var params            = { command : "check_service_del_possible", memSq:$.cookie("memsq")};

    $.ajax({
        url: WebROOT + "bizMecaAPOrder",
        type: "POST",
        data: params,
        dataType: "json",
        async : false,
        success: function(data) {
            if(data.response.result == "yes") {
                return_value = "allow";
            } else {
                return_value = "no_allow";
            }
        }
    });

    return return_value;
}
//--End 2016. 01. 05, 오승남 : 서비스 해지시 이전 요청에서 5분 경과된 경우만 처리 가능하도록...

function check_eng_member() {
    if(site_lang_cd == "ENG"){
        return true;
    }else{
        return false;
    }
}

function check_kor_member() {
    if(!$.cookie("memlangcd")) {
        return true;
    } else {
        if($.cookie("memlangcd") != "ENG") {
            return true;
        } else {
            return false;
        }
    }
}

function replace_price_unit() {
    if(check_eng_member()) {
        if($("#msgwon") && $("#msgwon").val()) {
            $("#msgwon").val($("#msgwon").val().replace("원", "달러"));
            $("#msgwon").val($("#msgwon").val().replace("KRW", ""));
        }

        if($("#msgwontime") && $("#msgwontime").val()) {
            $("#msgwontime").val($("#msgwontime").val().replace("원", "달러"));
            $("#msgwontime").val($("#msgwontime").val().replace("KRW", ""));
        }

        if($("#msgwonmonth") && $("#msgwonmonth").val()) {
            $("#msgwonmonth").val($("#msgwonmonth").val().replace("원", "달러"));
            $("#msgwonmonth").val($("#msgwonmonth").val().replace("KRW", ""));
        }

        if($("#msgwonyear") && $("#msgwonyear").val()) {
            $("#msgwonyear").val($("#msgwonyear").val().replace("원", "달러"));
            $("#msgwonyear").val($("#msgwonyear").val().replace("KRW", ""));
        }

        if($("#msgwonTimeprice") && $("#msgwonTimeprice").val()) {
            $("#msgwonTimeprice").val($("#msgwonTimeprice").val().replace("원", "달러"));
            $("#msgwonTimeprice").val($("#msgwonTimeprice").val().replace("KRW", "$"));
        }

        if($("#msgwonmonthprice") && $("#msgwonmonthprice").val()) {
            $("#msgwonmonthprice").val($("#msgwonmonthprice").val().replace("원", "달러"));
            $("#msgwonmonthprice").val($("#msgwonmonthprice").val().replace("KRW", "$"));
        }

        if($("#msg10700month") && $("#msg10700month").val()) {
            if(get_current_set_language() == "English") {
                $("#msg10700month").val("$ 0.631/Month for every 10GB");
            } else {
                $("#msg10700month").val("10GB당 0.7달러/월");
            }
        }

        if($("#msg101time") && $("#msg101time").val()) {
            if(get_current_set_language() == "English") {
                $("#msg101time").val("$ 0.001/Hour for every 10GB");
            } else {
                $("#msg101time").val("10GB당 0.001달러/시간");
            }
        }
    }
}

function get_price_with_unit(price) {
    if(check_eng_member() && get_current_set_language() == "English") {
        return "$ " + price;
    } else {
        return price;
    }
}

function remove_price_unit(price) {
    var return_price = price;

    return_price = price.replace("달러", "");
    return_price = return_price.replace("원", "");
    return_price = return_price.replace("KRW", "");

    return return_price;
}

function get_current_set_language() {
    var current_language = $("#id_current_language").text();

    if(current_language == "English") {
        return "English";
    } else {
        return "Korean";
    }
}

function is_enterprise_user() {
    var rtrn_val = false;

    $.ajax({
        url: "/isSvcSvrPrc",
        async:false,
        type: "POST",
        data: "command=checkEnterpriseUser",
        dataType: "json",
        success: function(json) {
            rtrn_val = json.ent_user;
        }
    });

    return rtrn_val;
}

//다른페이지에서 넘어오는 get방식 파라미터를 받는다.
function get_param(pramNm) {

    var paramStep = location.href;        //다른페이지에서 넘어온 URL

    //주소다음부분부터 받음
    paramStep = paramStep.substring(paramStep.lastIndexOf("?")+1, paramStep.length);

    if (paramStep.indexOf(pramNm+"=") == -1) {
        paramStep = false;
    }
    else {
        paramStep = paramStep.split(pramNm+"=")[1];
        if (paramStep.indexOf("&") != -1) {
            paramStep = paramStep.split("&")[0];
        }
        else if (paramStep.indexOf("%26") != -1) {
            paramStep = paramStep.split("%26")[0];
        }
    }
    return paramStep;
}

function get_eng_url(current_url) {
    var return_url = current_url;

    if(current_url.match("portal.myinfo.base")
        || current_url.match("portal.myinfo.quit")
        || current_url.match("portal.myinfo.qna.list")
        || current_url.match("portal.myinfo.group")
        || current_url.match("portal.myinfo.applyservice.record")
        || current_url.match("portal.notice.html")
        || current_url.match("portal.myinfo.useinfo")) {
        if(check_eng_member()) {
            if(current_url.match("/portal/")) {
                return current_url.replace("/portal/", "/en_portal/");
            } else if(current_url.match("/popup/")) {
                return current_url.replace("/popup/", "/en_popup/");
            } else if(current_url.match("/commonpop/")) {
                return current_url.replace("/commonpop/", "/en_commonpop/");
            }
        }
    } else if(current_url == "/portal/portal.myinfo.allinfo.html") {
        if(check_eng_member()) {
            return "/en_portal/portal.myinfo.useinfo.html";
        }
    } else if(get_current_set_language() == "English") {
        if(current_url.match("/popup/")) {
            return current_url.replace("/popup/", "/en_popup/");
        } else if(current_url.match("/commonpop/")) {
            return current_url.replace("/commonpop/", "/en_commonpop/");
        }
    }

    return return_url;
}

function inputCheck(Ev, type){
    if (Ev.keyCode == 86 && Ev.ctrlKey)
    {
        Ev.keyCode = 0;
        Ev.cancelBubble = true;
    }
    var checkPattern;
    switch (type){
        case 1 : //알파벳 숫자, 하이픈(-), 언더바(_), 점(.) 만 가능//알파벳 만 가능
            checkPattern = /[^\.a-zA-Z0-9\-\_\/\*]/;
            break;
        case 2 : //알파벳, 숫자, 하이픈(-), 점(.), 콤마(,) 만 가능//알파벳 만 가능
            checkPattern = /[^\.a-zA-Z0-9\-\,]/;
            break;
        case 3 : //알파벳 만가능
            checkPattern = /[^a-zA-Z]/;
            break;
        case 4 : //숫자 만 가능
            checkPattern = /[^0-9]/;
            break;
        case 5 : //알파벳, 숫자 만 가능
            checkPattern = /[^a-zA-Z0-9]/;
            break;
        case 6 : //숫자, ".", "/", ","만 가능
            checkPattern = /[^0-9\/\.\,\~]/;
            break;
        case 7 : //알파벳, 숫자, ".", "/", "-", "_" 만 가능
            checkPattern = /[^a-zA-Z0-9\/\.\-\_]/;
            break;
        case 8 : //알파벳, 숫자 , 여러 특수 기호, 공백 가능
            checkPattern = /[^a-zA-Z0-9\/\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\|\\\[\{\]\}\?\"\'\:\;\.\<\>\,\s]/;
            break;
        case 9 : //숫자, "," 만 가능
            checkPattern = /[^0-9\,]/;
            break;
        case 10 : //알파벳, 숫자 , 여러 특수 기호 가능
            checkPattern = /[^a-zA-Z0-9\/\~\`\!\@\#\$\%\^\&\*\(\)\-\_\+\=\|\\\[\{\]\}\?\"\'\:\;\.\<\>\,]/;
            break;
        case 11 : //숫자, "-" 만 가능
            checkPattern = /[^0-9\-]/;
            break;
        case 12 : //숫자, ".", "/" 만 가능
            checkPattern = /[^0-9\.\/]/;
            break;
    }
    if(Ev.value.match(checkPattern)) {
        Ev.value = Ev.value.replace(checkPattern,"");
    }
}

/********************************************
 * Ent 유저 체크 START - 정종호
 ********************************************/
function entUserChk(){
    var chk = "N";
    if($.cookie('memid')==null || $.cookie('memid')==""){
        return;
    }

    $.ajax({
        url: "/userinfo",
        type: "POST",
        data: "command=entUserChk&memsq=" + $.cookie('memsq'),
        async:false,
        dataType: "json",
        success: function(data) {
            chk = data.ent_user_chk_response;
            result = chk;
        }
    });
    return chk;
}
/********************************************
 * Ent 유저 체크 END - 정종호
 ********************************************/

function inputMouseChk(e){
    alert(e.which);
}

function getStackId(data_type, data_value){
    /*
    $.ajax({
        url: "/isSvcSvrPrc",
        type: "POST",
        data: "command=getStackId&data_type=" + data_type + "&data_value=" + data_value,
        async:false,
        dataType: "json",
        success: function(json) {
            statck_id = json.data;
        }
    });
    */
    var stack_id = 11;
    if ( osZoneList.length > 0 )    {
        var items = osZoneList.filter(function(item){if(item.zone_id == data_value ) return item;});
        if ( items.length > 0 ) {
            stack_id = items[0].stack_id;
        }
    }
    return stack_id;
}

function set_default_search() {
    dataSetting();

    if($("#msglocate").val()) {
        $("#searchWord").append('<span onclick="clickSearch()" id="firstName" class="test3">' + $("#msglocate").val() + '<img style="vertical-align: middle;" src="../../images/c_common/pagination_next_01_sel.png"/></span>');
        $("#searchDiv").data("name", $("#msglocate").val());
    } else     if($("#msglocation").val()) {
        $("#searchWord").append('<span onclick="clickSearch()" id="firstName" class="test3">' + $("#msglocation").val() + '<img style="vertical-align: middle;" src="../../images/c_common/pagination_next_01_sel.png"/></span>');
        $("#searchDiv").data("name", $("#msglocation").val());
    } else {
        $("#searchWord").append('<span onclick="clickSearch()" id="firstName" class="test3">' + objLang.zone + '<img style="vertical-align: middle;" src="../../images/c_common/pagination_next_01_sel.png"/></span>');
        $("#searchDiv").data("name", objLang.zone);
    }

    $("#searchWord").append('<span onclick="depthAction()" id="secondName" class="'+default_zone_id+'">'+default_zone_nm+'</span>');
    $("#searchWord").data("value", default_zone_id);
    $("#searchDiv").removeClass('box_bottom_line');
    $("#sch_word").hide();
}


//CIP 연결시 network에 VR이 있는 지 확인
function check_listRouters(networkid, zoneid) {
    rtrnVal = false;

    var stackid = getStackId("zone", zoneid);

    $.ajax({
        url: "/isSvcSvrPrc",
        type: "POST",
        async:false,
        data: "command=check_listRouters&networkid=" + networkid + "&multi_stack_id=" + stackid,
        dataType: "json",
        success: function(json) {
            if(json.status == "00") {
                rtrnVal = true;
            }
        }
    });
    return rtrnVal;
}


function getDomains(srcDomainId) {
    var result;

    if(!srcDomainId) {
        srcDomainId = $.cookie("domainid");
    }

    var params = {
        command : "getDomainInfo",     // 커맨드이름
        domainid : srcDomainId
    };

    $.ajax({
        url: "/isSvcSvrPrc",
        type: "POST",
        data: params,
        dataType: "json",
        async:false,
        success: function(json) {
            result = json.data;
        }
    });
    return result;
}

function is_new_stack(zoneid) {
    if(zoneid &&
        zoneid == "d7d0177e-6cda-404a-a46f-a5b356d2874e") {
        return  true;
    } else {
        return false;
    }
}

function process_m2_server(zone_sq, dest_type) {
    var return_type = dest_type;

    if(getStackId("zone", zone_sq) != 1 || dest_type == "MCBS"|| dest_type == "JEUS"|| dest_type == "WEBTOB") { /* 운영 KOR-Seoul M2 */
        $("#displaynodatadisk").show();
        $("#disktypedt").hide();
        $("#disktypedd").hide();
        $("#disktypespan").hide();

        if(!dest_type.match("L")) {
            return_type += "L";
        }
    } else {

        $("#displaynodatadisk").hide();
        $("#disktypedt").show();
        $("#disktypedd").show();
        $("#disktypespan").show();
    }

    return return_type;
}

function get_gpu_server_count() {
    var return_val = null;

    if (!group_mem_sq || group_mem_sq == ""){
        group_mem_sq = $.cookie("memsq");
    }

    var parameter = {command : "getGpuServerCount", group_mem_sq : group_mem_sq};

    $.ajax({
        url: "/isSvcSvrPrc",
        type: "POST",
        data: parameter,
        async: false,
        dataType: "json",
        success: function(json) {
            if (json.status == "00") {
                return_val = json;
            }
        }
    });

    return return_val;
}

function check_contractable(zone_sq, server_type, os_info) {
    // 1. 영문사용인지 확인
    if(check_eng_member()) {
        return false;
    }

    if(!check_contractable_user()) {
        return false;
    }

    // 2. zone 확인
    if(!(zone_sq == "eceb5d65-6571-4696-875f-5a17949f3317" ||    // KOR-Central A
        zone_sq == "9845bd17-d438-4bde-816d-1b12f37d5080" ||    // KOR-Central B
        zone_sq == "dfd6f03d-dae5-458e-a2ea-cb6a55d0d994" ||    // KOR-HA
        zone_sq == "95e2f517-d64a-4866-8585-5177c256f7c7" ||    // KOR-Seoul M
        zone_sq == "d7d0177e-6cda-404a-a46f-a5b356d2874e" ||  // KOR-Seoul M2
        zone_sq == "95eeb71c-8233-42a0-94ce-7656f5798e02" ||    // ent-pub
        zone_sq == "d29e11a5-c3fc-4a64-bca0-76ecc54eae8c")) {    // ent-priv
        return false;
    }

    // 3. GPU Server인지 확인
    if(server_type.indexOf("GPU") >-1) {
        return false;
    }

    // 4. Deep Learning인지 확인
    if(server_type.indexOf("DEEP") >-1) {
        return false;
    }

    // 5. 선택한 OS 확인
    if(os_info.indexOf("REDHAT") >-1 || os_info.indexOf("SUSE") >-1 || os_info.indexOf("MACHBASE") >-1) {
        return false;
    }

    // 5. TMAX인지 확인
    if(server_type.indexOf("TMAX") >-1) {
        return false;
    }

    // 6. JEUS&WebtoB인지 확인
    if(server_type.indexOf("JEUS") >-1 || server_type.indexOf("WEBTOB") >-1) {
        return false;
    }

    return true;
}

// 2022.11.29
function check_contractable_os(zone_sq, sel_detpth1, sel_detpth2, sel_detpth3) {
    // 1. 영문사용인지 확인
    if(check_eng_member()) {
        return false;
    }
    
    // HAC인지 확인
    if(sel_detpth1 == "aiAccelerator") {
        return false;
    }
    // GPU Server인지 확인
    if(sel_detpth1 == "GPUSERVER") {
        return false;
    }
    // DB TIBERO인지 확인
    if(sel_detpth2.indexOf("TIBERO") >-1) {
        return false;
    }
    // REDHAT 확인
    if(sel_detpth3.indexOf("REDHAT") >-1) {
        return false;
    }
    return true;
}


function check_contractable_user() {
    var return_val = true;

    if (!group_mem_sq || group_mem_sq == ""){
        group_mem_sq = $.cookie("memsq");
    }

    var parameter = {command : "checkContractableCount", group_mem_sq : group_mem_sq};

    $.ajax({
        url: "/isSvcSvrPrc",
        type: "POST",
        data: parameter,
        async: false,
        dataType: "json",
        success: function(json) {
            if (json.status == "00") {
                return_val = json.year_price_possible;
            }
        }
    });

    return return_val;
}

/********************************************
 * Ent 유저 정보 조회 : enterprise 2.0 포함
 ********************************************/
function getEntUserInfo(){
    $.ajax({
        url: "/userinfo",
        type: "POST",
        data: "command=getEntuserUserInfo",
        async:false,
        dataType: "json",
        success: function(json) {
            ent_user_info = json.data;
        }
    });
}

function is_ent_user() {
    if(ent_user_info) {
        return true;
    } else {
        return false;
    }
}

function is_entv2_user() {
    if(ent_user_info && ent_user_info.entyn == "Y2") {
        return true;
    } else {
        return false;
    }
}

function is_dedicated_host_user() {
    if(ent_user_info && ent_user_info.entyn == "DC") {
        return true;
    } else {
        return false;
    }
}

function is_ent_admin() {
    if(ent_user_info && ent_user_info.adminyn == "Y") {
        return true;
    } else {
        return false;
    }
}

function is_giga_genie_user(zone_sq) {
    if(!zone_sq) {
        zone_sq = $.cookie("zonesq");
    }

    if(zone_sq == '08f9f475-135c-40b2-9194-828822668586' || //{    //  giga-genie-1
        zone_sq == '8470adf5-2087-4847-80eb-57a83339eacd' || //{    // giga-genie-dev
        zone_sq == '77fbfafb-3b36-4e3e-a2a7-7c2a48f32682') {    // giga-genie-dev
        return true;
    } else {
        return false;
    }
}

function set_network_menu() {
    var dest_obj = $(".subtab");

    var li_objs = dest_obj.find("li");

    if(li_objs) {
        li_objs.each(function() {
            if($(this).find("a")) {
                var href_val = $(this).find("a").attr("href");

                if(is_entv2_user()) {
                    if(href_val == "/console/internalpath") {
                        $(this).attr("style", "display:none;");
                    } else if(href_val == "/console/tierlist") {
                        $(this).attr("style", "display:block;");
                    } else if(href_val == "/console/overlaylist") {
                        if($.cookie("zonesq") != "e09f2ae7-af8e-43da-8174-48ed3e32645c") {
                            $(this).attr("style", "display:block;");
                        }
                    } else if(href_val == "/console/ciphybrid") {
                        $(this).attr("style", "display:none;");
                    } else if(href_val == "/portal/ktcloudportal.epc.productintro.partnershipcloud_ConnectHub.html") {
                        if($.cookie("zonesq") == "e09f2ae7-af8e-43da-8174-48ed3e32645c") {
                            $(this).attr("style", "display:block;");
                        }
                    }
                } else {
                    if(href_val == "/console/internalpath") {
                        $(this).attr("style", "display:block;");
                    } else if(href_val == "/console/tierlist") {
                        $(this).attr("style", "display:none;");
                    } else if(href_val == "/console/overlaylist") {
                        $(this).attr("style", "display:block;");
                    } else if(href_val == "/console/ciphybrid") {
                        $(this).attr("style", "display:block;");
                    }
                }

                // ent 계정이거나 VPC 계정인 경우 overlay 메뉴 감춤.
                var mem_dedicate_id = $.cookie("dediid");

                if(is_ent_user() || (mem_dedicate_id != null && mem_dedicate_id.length > 0)) {
                    if(href_val == "/console/overlaylist") {
                        $(this).attr("style", "display:none;");
                    }
                }
            }
        });
    }
}

// 사버 생성 시 enterprise 2.0용 tier 조회
function call_ent2_tiers(destObj,zoneid) {
    var zone = zoneid;

    if(zone == "" || zone ==null) {
        zone = $.cookie("zonesq");
    } else {
        zone = zoneid;
    }

    if (group_zone_sq != ""){
        zone = group_zone_sq;
    }

    if(destObj == null) {
        var zone_temp = getSelectZoneid_pop();

        if(zone_temp != null && zone_temp != ""){
            zone = zone_temp;
        }
    }

    var mem_sq = $.cookie("memsq");
    var group_mem_sq = $.cookie("group_mem_sq");

    if ( group_mem_sq == undefined || group_mem_sq == null )    {
        group_mem_sq = "";
    }

    if (group_mem_sq != "" ){
        mem_sq = group_mem_sq;
    }

    var params={
        command : "sharedNetwork",
        zone : zone,
        memSq : mem_sq,
        group_mem_sq : group_mem_sq
    };

    params.multi_stack_id = getStackId("zone", zone);

    if(destObj == null) {
        destObj = $("#select_ent2_tier");
        destObj.empty();
    }

    $.ajax({
        url: "/isSvcSvrPrc"
        , type : "POST"
        , data : params
        , async : false
        , dataType : "json"
        , success : function(json) {
            if (json.status == "00") {
                items = json.data;

                ent_tier_info = items;

                if(items != null && items.length > 0) {
                    for(var i = 0; i < items.length ; i++) {
                        destObj.append("<option value="+ items[i].id + ">" + items[i].name + "</option>");
                    }
                }

                var ent_zone_list = getUserZones();

                if(ent_zone_list != null && ent_zone_list.length > 0) {
                    for(var i = 0; i < ent_zone_list.length ; i++) {
                        if(zone == ent_zone_list[i].zone_sq) {
                            break;
                        }else{
                            add_ent_tier_info(ent_zone_list[i].zone_sq);
                        }
                    }
                }
            }
        }
    });
}

//사버 생성 시 enterprise 2.0용 tier 조회
function call_ent2_vpcs(destObj,zoneid) {
    var zone = zoneid;

    if(zone == "" || zone ==null) {
        zone = $.cookie("zonesq");
    } else {
        zone = zoneid;
    }

    if (group_zone_sq != ""){
        zone = group_zone_sq;
    }

    if(destObj == null) {
        var zone_temp = getSelectZoneid_pop();

        if(zone_temp != null && zone_temp != ""){
            zone = zone_temp;
        }
    }

    var mem_sq = $.cookie("memsq");

    /*captainPark 2021.09.29 그룹기능 추가로 파라미터 변경*/
    //if (group_mem_sq != ""){
    //    mem_sq = group_mem_sq;
    //}
    if ( zone == "" || zone == undefined || zone == null )  {
        zone = "DX-M1";
    }

    var params = {
        command         : "listNetworkPublic"
        , zone_id         : zone
        , account         : $.cookie('account')
        , memSq           : mem_sq
        , group_mem_sq    : group_mem_sq
        , multi_stack_id  : getStackId("zone",zone)
    };

    if(destObj == null) {
        destObj = $("#select_ent2_tier");
        destObj.empty();
    }

    $.ajax({
        url: "/osSvcSvrPrc"
        , type : "POST"
        , data : params
        , async : false
        , dataType : "json"
        , success : function(json) {
            items = json.data.nc_listvpcsresponse.vpcs[0].networks;
            ent_tier_info = items;

            if(items != null && items.length > 0) {
                for(var i = 0; i < items.length ; i++) {
                    if(items[i].osnetworkid == "" || items[i].osnetworkid == undefined){
                        continue;
                    }
                    destObj.append("<option value="+ items[i].osnetworkid + " iptype=" + items[i].type + " cidr=" + items[i].cidr + " >" + items[i].name + "</option>");
                }
                selectbox_design(destObj);
            }

        }
    });
}

function get_tier_name(id) {
    if(ent_tier_info != null && ent_tier_info.length > 0) {
        for(var i = 0; i < ent_tier_info.length ; i++) {
            if(id == ent_tier_info[i].id) {
                return ent_tier_info[i].name;
            }
        }
    }
}

//사버 생성 시 enterprise 2.0용 tier 조회
function get_ent2_supercidr() {
    var s_cidr = null;

    var zone = $.cookie("zonesq");

    if (group_zone_sq != ""){
        zone = group_zone_sq;
    }

    var mem_sq = $.cookie("memsq");

    /*captainPark 2021.09.29 그룹기능 추가로 파라미터 변경*/
    //if (group_mem_sq != ""){
    //    mem_sq = group_mem_sq;
    //}

    if ( zone == "" || zone == undefined || zone == null )  {
        zone = "DX-M1";
    }
    var params={
        command : "listNetworkPublic",
        zone_id : zone,
        account : $.cookie('account'),
        memSq : mem_sq,
        group_mem_sq : group_mem_sq,
        multi_stack_id : getStackId("zone", zone)
    };

    $.ajax({
        url: "/osSvcSvrPrc"
        , type : "POST"
        , data : params
        , async : false
        , dataType : "json"
        , success : function(json) {
            s_cidr = json.nc_listvpcsresponse.vpcs[0].supercidr;
        }
    });

    return s_cidr;
}

function makeSelfAuthMsgPop(c) {
    if( $("#dialog_selfauth").html() != null ) {
        $("#dialog_selfauth").remove();
    }
    var arrHtml = [];
    arrHtml.push("  <div class=\"popup size_s\" id=\"dialog_selfauth\" style=\" background-color:#fff; display:none; z-index:0;\">");
    arrHtml.push("    <a href=\"#\" class=\"popup_first btn_dummy\">&nbsp;</a>");
    arrHtml.push("    <div class=\"ps_t clfix\">");
    arrHtml.push("      <h1 id=\"dlg_service_title\" style=\"line-height: 44px; font-weight: bold !important;\"> 로그인 오류 </h1>");
    arrHtml.push("    </div>");
    arrHtml.push("    <div class=\"ps_m clfix\" style=\"background-color: #fff;\">");
    arrHtml.push("      <div class=\"cont_p1 ac content_area\">");
    if(c == "ERRORE"){
        arrHtml.push("        <p id=\"dlg_service_text1\"><strong> 회원님의 계정은 현재 휴면 상태 입니다.<br/> 휴면 계정 해제 후 이용하시기 바랍니다. </strong></p>");
    }else{
        arrHtml.push("        <p id=\"dlg_service_text1\"><strong> 5회이상 로그인에 실패하였습니다.<br/>5회이상 로그인에 실패하여 계정잠김 상태가 되었습니다. <br/>계정 잠김 해제 후 이용하시기 바랍니다. </strong></p>");
        arrHtml.push("        <p class=\" mt10 ac\"><a href=\"#\" class=\"btn_link\" id=\"selfauth\"><span style=\"color:#fff\">계정 잠금 해제 하기</span></a></p><br/> ");
    }
    arrHtml.push("      </div>");
    arrHtml.push("    </div>");
    arrHtml.push("    <div class=\"ps_b clfix\">");
    arrHtml.push("    <span>");
    arrHtml.push("      <a class=\"btn_nexts m110\" id=\"selfauth_btnCancel\" href=\"#\" title=\"팝업닫기 실행\"><span >확인</span></a>");
    arrHtml.push("    </span>");
    arrHtml.push("    </div>");
    arrHtml.push("    <a href=\"#\" class=\"closeBtn\" id=\"selfauth_btnTopClose\" title=\"레이어팝업 닫기실행\"><img src=\"../../images/popup/btn_close.gif\" alt=\"닫기\" /></a>");
    arrHtml.push("  </div>");

    $(arrHtml.join("\n")).appendTo($("body"));

    // Dummy 클릭 이벤트 처리
    $(".btn_dummy").unbind("click").bind("click", function(e) {
        e.preventDefault();
    });

    var dlgForm = $("#dialog_selfauth");

    dlgForm.dialog({
        width: 480,
        autoOpen: false,
        modal: true,
        resizable:false,
        draggable:false,
        zIndex: 2000,
        dialogClass : "border_0",
        close : function(event, ui) {
            if (typeof closeFunc == "function") {
                closeFunc();
            }
        }
    });

    dlgForm.siblings().remove();
    dlgForm.css("padding" , "0");
    dlgForm.parent().css("padding" , "0");

    dlgForm.find("#selfauth_btnCancel").unbind("click").bind("click", function(e) {
        e.preventDefault();
        dlgForm.dialog("close");
    });
    dlgForm.find("#selfauth_btnTopClose").unbind("click").bind("click", function(e) {
        e.preventDefault();
        dlgForm.dialog("close");
    });
}

function get_ent2_tier_info() {
    var account = $.cookie("account");
    var domainid = $.cookie("domainid");
    var mem_sq = $.cookie("memsq");
    var group_mem_sq = $.cookie("groupmemsq");

    if(main_tier_list != null && main_tier_list.length > 0) {
        main_tier_list.splice(0, main_tier_list.length);
    }

    /*captainPark 2021.09.29 그룹기능 추가로 파라미터 변경*/
    var zone = "DX-M1";
    params = {
        command : "listNetworkPublic",
        zone_id : zone,
        account : $.cookie('account'),
        memSq : mem_sq,
        group_mem_sq : group_mem_sq,
        multi_stack_id : getStackId("zone", zone)
    };

    $.ajax({
        url: "/osSvcSvrPrc",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(json) {
            bTierLoaded = true;
            if(json.status == '00'){
                var items = json.data.nc_listvpcsresponse.vpcs[0].networks;

                if(items != null && items.length > 0) {
                    for(var i = 0; i < items.length ; i++) {
                        main_tier_list.push(items[i]);
                    }
                }
            }
        }
    });
}

function set_vm_create_tier_list(dest_obj) {
    var dest_obj = $("#select_ent2_tier");
    dest_obj.empty();

    if(main_tier_list != null && main_tier_list.length > 0) {
        for(var i = 0; i < main_tier_list.length ; i++) {
            if(main_tier_list[i].maintieryn == "N" || main_tier_list[i].maintieryn == "") {    // subtier
                continue;
            }
            dest_obj.append("<option value='"+ main_tier_list[i].osnetworkid + "' data='"+main_tier_list[i].cidr+"'>" + main_tier_list[i].name + "</option>");
        }
    }

    selectbox_design(dest_obj);
}

function get_main_tier_list() {
    if(main_tier_list != null && main_tier_list.length > 0) {
        for(var tier_index=0; tier_index < main_tier_list.length; tier_index++) {
            if(total_overlay_network_list != null && total_overlay_network_list.length > 0) {
                for(var on_index=0; on_index < total_overlay_network_list.length; on_index++) {
                    if(main_tier_list[tier_index].id == total_overlay_network_list[on_index].id) {
                        main_tier_list.splice(tier_index, 1);
                    }
                }
            }
        }
    }

    return main_tier_list;
}

function get_sub_tier_list() {
    if(sub_tier_list != null && sub_tier_list.length > 0) {
        for(var tier_index=0; tier_index < sub_tier_list.length; tier_index++) {
            if(total_overlay_network_list != null && total_overlay_network_list.length > 0) {
                for(var on_index=0; on_index < total_overlay_network_list.length; on_index++) {
                    if(sub_tier_list[tier_index].id == total_overlay_network_list[on_index].id) {
                        sub_tier_list.splice(tier_index, 1);
                    }
                }
            }
        }
    }

    return sub_tier_list;
}

function get_total_overlay_networks() {
    var params={
        command : "NCGetOverlay",
        account : $.cookie("account"),
        domainid : $.cookie("domainid"),
        mem_sq : $.cookie("memsq")
    };

    if(total_overlay_network_list != null && total_overlay_network_list.length > 0) {
        total_overlay_network_list.splice(0, total_overlay_network_list.length);
    }

    $.ajax({
        url: "/isSvcIpPrc",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(json) {
            if(json.status == '00') {
                var overlay_items = json.data;

                if(overlay_items != null && overlay_items.length > 0) {
                    for(var i = 0; i < overlay_items.length ; i++) {
                        var network_items = overlay_items[i].overlaynetworks;

                        if(network_items != null && network_items.length > 0) {
                            for(var j = 0; j < network_items.length ; j++) {
                                total_overlay_network_list.push(network_items[j]);
                            }
                        }
                    }
                }
            }
        }
    });
}

function is_overlay_network(network_id) {
    var return_flag = false;

    if(total_overlay_network_list != null && total_overlay_network_list.length > 0) {
        for(var on_index=0; on_index < total_overlay_network_list.length; on_index++) {
            if(network_id == total_overlay_network_list[on_index].id) {
                return_flag = true;
                break;
            }
        }
    }

    return return_flag;
}

//    dedicated host cluster 정보 조회
function call_dh_lists() {
    var params={
        command : "getDedicatedHostClusterId",
    };

    $.ajax({
        url: "/userinfo",
        type: "POST",
        data : params,
        dataType : "json",
        async : false,
        success : function(json) {
            if (json.status == "00") {
                items = json.data;

                dedicated_cluster_info = items;

                if(items != null && items.length > 0) {
                    for(var i = 0; i < items.length ; i++) {
                        get_cluster_hosts(items[i].clusterid);
                    }
                }
            }
        }
    });
}

function set_vm_create_cluster_list() {
    var dest_obj = $("#select_dh_cluster");
    dest_obj.empty();

    if(dedicated_cluster_info != null && dedicated_cluster_info.length > 0) {
        for(var ci = 0; ci < dedicated_cluster_info.length ; ci++) {
            var host_list = dedicated_cluster_info[ci].hosts;

            if(host_list != null && host_list.length > 0) {
                for(var hi = 0; hi < host_list.length ; hi++) {
                    dest_obj.append("<option value="+ dedicated_cluster_info[ci].clusterid + " affinitygroupid="+ dedicated_cluster_info[ci].affinitygroupid + " hostid="+ host_list[hi].host_uuid + ">" + get_disp_cluster_name(dedicated_cluster_info[ci].clusternm) + "-" + get_disp_host_name(host_list[hi].name) + "</option>");
                }
            }
        }

        dest_obj.append("<option value=public affinitygroupid="+ dedicated_cluster_info[0].affinitygroupid + ">Public</option>");
    }
}

function set_vm_create_hosts_list(cluster_id) {
    var dest_obj = $("#select_vm_dh_host");
    dest_obj.empty();

    if(dedicated_cluster_info != null && dedicated_cluster_info.length > 0) {
        for(var ci = 0; ci < dedicated_cluster_info.length ; ci++) {
            if(dedicated_cluster_info[ci].clusterid == cluster_id) {
                var host_list = dedicated_cluster_info[ci].hosts;

                if(host_list != null && host_list.length > 0) {
                    for(var hi = 0; hi < host_list.length ; hi++) {
                        dest_obj.append("<option value="+ host_list[hi].host_uuid + ">" + get_disp_host_name(host_list[hi].name) + "</option>");
                    }
                }

                break;
            }
        }
    }
}

function get_cluster_hosts(cluster_id) {
    var params={
        command : "listHosts",
        clusterid : cluster_id,
        multi_stack_id : 2
    };


    params.domainid    = $.cookie("domainid");
    params.account    = $.cookie("account");
    params.zoneid    = $.cookie("zonesq");

    $.ajax({
        url: "/gwapi",
        type: "POST",
        data : params,
        dataType : "json",
        async : false,
        success : function(json) {
            var cluster_info = json.listhostsresponse.response.dedicatedcluster;

            if(cluster_info != null && cluster_info.length > 0) {
                var dest_items = [];

                for(var i=0; i<cluster_info.length; i++) {
                    if(cluster_info[i].clusterid == cluster_id) {
                        var items = cluster_info[i].hosts;

                        for(var j=0; j<items.length; j++) {
                            if(items[j].resourcestate.toUpperCase() == "ENABLED") {
                                items[j].name = items[j].host_name;
                                dest_items.push(items[j]);
                            }
                        }

                        break;
                    }
                }



                for(var i=0; i<dest_items.length; i++) {
                    set_use_data_to_portal(dest_items[i]);
                }

                set_cluster_hosts(cluster_id, dest_items);
            }
        }
    });
}

function set_cluster_hosts(cluster_id, host_info) {
    if(dedicated_cluster_info != null && dedicated_cluster_info.length > 0) {
        for(var i = 0; i < dedicated_cluster_info.length ; i++) {
            if(dedicated_cluster_info[i].clusterid == cluster_id) {
                dedicated_cluster_info[i].hosts = host_info;
            }
        }
    }
}

function get_cluster_data_by_host_id(host_id, type) {
    if(dedicated_cluster_info != null && dedicated_cluster_info.length > 0) {
        for(var ci = 0; ci < dedicated_cluster_info.length ; ci++) {
            var host_list = dedicated_cluster_info[ci].hosts;

            if(host_list != null && host_list.length > 0) {
                for(var hi = 0; hi < host_list.length ; hi++) {
                    if(host_list[hi].host_uuid == host_id) {
                        if(type == "name") {
                            return dedicated_cluster_info[ci].clusternm;
                        } else if(type == "host") {
                            return host_list[hi];
                        } else if(type == "id") {
                            return dedicated_cluster_info[ci].clusterid;
                        } else {
                            return "";
                        }
                    }
                }
            }
        }
    }

    return "";
}

function get_host_name(host_id) {
    var host_info = get_cluster_data_by_host_id(host_id, "host");

    if(host_info != null) {
        if(host_info.name) {
            return host_info.name;
        }
    }
}

function get_dedicated_host_location(host_id) {
    var origin_cluster_name  = get_cluster_data_by_host_id(host_id, "name");
    var origin_host_name  = get_host_name(host_id);
    var dest_cluster_name = get_disp_cluster_name(origin_cluster_name);
    var dest_host_name = get_disp_host_name(origin_host_name);

    return  dest_cluster_name + "/" + dest_host_name;
}

function get_disp_cluster_name(origin_name) {
    if(origin_name && origin_name.split("cluster").length > 1) {
        return "cluster" + origin_name.split("cluster")[1];
    } else {
        return "";
    }
}

function get_disp_host_name(origin_name) {
    if(origin_name) {
        return origin_name.split("-")[0];
    } else {
        return "";
    }
}

function set_vm_migrate_hosts_list(host_id) {
    var cluster_id = get_cluster_data_by_host_id(host_id, "id");
    var dest_obj = $("#dest_cnode");
    dest_obj.empty();

    if(dedicated_cluster_info != null && dedicated_cluster_info.length > 0) {
        for(var ci = 0; ci < dedicated_cluster_info.length ; ci++) {
            if(dedicated_cluster_info[ci].clusterid == cluster_id) {
                var host_list = dedicated_cluster_info[ci].hosts;

                if(host_list != null && host_list.length > 0) {
                    for(var hi = 0; hi < host_list.length ; hi++) {
                        if(host_id != host_list[hi].host_uuid) {
                            dest_obj.append("<option value="+ host_list[hi].host_uuid + ">" + get_disp_host_name(host_list[hi].name) + " (CPU " +  host_list[hi].portalcpuuserate + "%, 메모리 "+ host_list[hi].portalmemoryuserate + "% 사용중)" + "</option>");
                        }
                    }
                }

                break;
            }
        }
    }
}


function set_use_data_to_portal(dest_host) {
    var cpu_total = dest_host.max_cpu;
    var cpu_used = dest_host.used_cpu;
    var cpu_used_rate = dest_host.percent_used_cpu.toFixed(2);

    var memory_total = dest_host.max_memory;;
    var memory_used = dest_host.used_memory;
    var memory_used_rate = dest_host.percent_used_memory.toFixed(2);

    dest_host.portalcputotal = cpu_total;
    dest_host.portalcpuused = cpu_used;
    dest_host.portalcpuuserate = cpu_used_rate;

    dest_host.portalmemorytotal = memory_total;
    dest_host.portalmemoryused = memory_used;
    dest_host.portalmemoryuserate = memory_used_rate;
}

function check_cluster_exist() {
    if(dedicated_cluster_info == null || dedicated_cluster_info.length < 1) {
        return false;
    } else {
        return true;
    }
}

function get_session_mem_info() {
    var result = new Array();
    $.ajax({
        url: "/userinfo",
        type: "POST",
        data: "command=getsessioninfo",
        async: false,
        dataType: "json",
        success: function(json) {
            result[0] = json.userid;
            result[1] = json.usernm;
        },
        error: function(XMLHttpResponse) {
            showInstancesdlgError_Msg("오류", "", "서버와의 연결에 실패했습니다!!!!.");
        }
    });

    return result;
}

function getsession_check_dedi_info() {
    var result = "";
    $.ajax({
        url: "/userinfo",
        type: "POST",
        data: "command=getsession_check_dedi_info",
        async: false,
        dataType: "json",
        success: function(json) {
            result = json.result;
        },
        error: function(XMLHttpResponse) {
            showInstancesdlgError_Msg("오류", "", "서버와의 연결에 실패했습니다!!!!.");
        }
    });

    return result;
}

function get_session_check_info(checkid) {
    var result = "";
    $.ajax({
        url: "/userinfo",
        type: "POST",
        data: "command=get_session_check_info&checkid="+checkid,
        async: false,
        dataType: "json",
        success: function(json) {
            result = json.result;
        },
        error: function(XMLHttpResponse) {
            showInstancesdlgError_Msg("오류", "", "서버와의 연결에 실패했습니다!!!!.");
        }
    });

    return result;
}

function get_zone_firewall_count(network_id, zone_id) {
    var fw_count = 0;

    var stackid = getStackId("zone", zone_id);

    $.ajax({
        url: "/gwapi",
        type: "POST",
        data: "command=listFirewallRules&networkid=" + network_id + "&group_mem_sq=" + group_mem_sq + "&group_svc_id=" + group_svc_id + "&multi_stack_id=" + stackid,
        async: false,
        dataType: "json",
        success: function(json) {
            if(json.status) {
                return 0;
            }

            if(json.listfirewallrulesresponse.count) {
                fw_count = json.listfirewallrulesresponse.count;
            }
        },
        error: function(XMLHttpResponse) {
            showCommonNoLangErrorMsg(objLang.serverNetworkPop14_title, objLang.serverNetworkPop14_desc);
        }
    });

    return fw_count;
}

function get_zone_portforwarding_count(network_id, zone_id) {
    var fw_count = 0;

    var stackid = getStackId("zone", zone_id);

    $.ajax({
        url: "/gwapi",
        type: "POST",
        data: "command=listPortForwardingRules&networkid=" + network_id + "&group_mem_sq=" + group_mem_sq + "&group_svc_id=" + group_svc_id + "&multi_stack_id=" + stackid,
        async: false,
        dataType: "json",
        success: function(json) {
            if(json.status) {
                return 0;
            }

            if(json.listportforwardingrulesresponse.count) {
                fw_count = json.listportforwardingrulesresponse.count;
            }
        }
    });

    return fw_count;
}

function cancleGroupMask(){
    var el_dialog = $("#dialog_unmask_group_id");

    if (el_dialog.html() == null) {
        var arrHtml        = [];


        arrHtml.push("<div class='popUp' id='dialog_unmask_group_id' style='width:380px !important; top:auto !important overflow:hidden;'>");
        arrHtml.push('    <div class="head htpop clfix">');
        arrHtml.push('    <h1> <span class="del" id="commonErrMsgCloseX"><a href="#"><img src="/images/coni/Cancel.svg" alt=""></a></span></h1> ');
        arrHtml.push('    </div> ');
        arrHtml.push("    <div class='body'>");
        arrHtml.push("        <div class='con'>");
        arrHtml.push("            <div class='all_list_box' style='width:300px;'>");
        arrHtml.push("                <dl>");
        arrHtml.push("                    <dt class='' style=\"width: 100%;\">비밀번호를 입력해주세요. d</dt>");
        arrHtml.push("                    <dd class='mt10'>");
        arrHtml.push("                        <div class='' style='width:300px;'>");
        arrHtml.push("                            <input title='text' type='password' class='i_popup2' id='input_user_pwd' style='width:70%' value='' maxlength='63'><br/>");
        arrHtml.push("                        </div>");
        arrHtml.push("                    </dd>");
        arrHtml.push("                </dl>");
        arrHtml.push("            </div>");
        arrHtml.push("        </div>");
        arrHtml.push("    </div>");
        arrHtml.push("    <div class='btn_box mt40'>");
        arrHtml.push("        <div class='pop_btn_left btnl_secondary commonMsgClose' id='btn_unmasking_cancel'><a href='#'>취소</a></div>");
        arrHtml.push("        <div class='pop_btn_right btnl_primary' id='btn_unmasking_ok'><a href='#'>확인</a></div>");
        arrHtml.push("    </div>");
        arrHtml.push("</div>");

        $(arrHtml.join("")).appendTo("body");
        el_dialog = $("#dialog_unmask_group_id");
    }

    el_dialog.dialog({
        width: 380,
        autoOpen: false,
        modal: true,
        resizable:true,
        draggable:false,
        zIndex: 2000,
        dialogClass : "border_0"
    });

    el_dialog.siblings().remove();
    el_dialog.css("padding" , "0");
    el_dialog.parent().css("padding" , "0");

    el_dialog.attr("style", "overflow:hidden");
    el_dialog.dialog("open");

    $("#btn_unmasking_ok").unbind("click").bind("click" , function(e) {
        var maskpwd = el_dialog.find("#input_user_pwd").val();

        var param = {command : 'cancleGroupIdMask', maskpwd : maskpwd};

        $.ajax({
            url  : "/userinfo",
            type : "POST",
            data : param,
            dataType:"json",
            async : false,
            success : function(json) {
                if(json.canclegroupidmaskresponse && json.canclegroupidmaskresponse == "success") {
                    showCommonNoLangErrorMsg("Masking 해제", "Masking 해제 처리 완료하였습니다.", "");
                    el_dialog.dialog("close");
                    el_dialog.find("#input_user_pwd").val("");
                    set_group_select();
                } else {
                    showCommonNoLangErrorMsg("오류", "비밀번호가 틀렸습니다.", "비밀번호가 틀렸습니다.");
                    el_dialog.find("#input_user_pwd").val("");
                    el_dialog.find("#input_user_pwd").focus();
                }
            },
            error: function(XMLHttpResponse){
                showCommonNoLangErrorMsg("오류", "Masking 해제 실패.", "다시 시도 하여 주시길 바랍니다.");
                el_dialog.dialog("close");
                el_dialog.find("#input_user_pwd").val("");
            }
        });
    });

    $("#btn_unmasking_cancel").unbind("click").bind("click" , function(e) {
        $("#dialog_unmask_group_id").dialog("close");
    });
}

function showdlglogout_MsgCr(sTitle, sText1, sText2, closeFunc, __param_not_use_any_more__though_dont_delete__ , cancelFunc, no_btn_show) {
    makeShowdlgLogout_MsgPopCr();
    var dlgForm = $("#dialog_dup_logout");

    dlgForm.dialog({
        width: 480,
        autoOpen: false,
        modal: true,
        resizable:false,
        draggable:false,
        zIndex: 2000,
        dialogClass : "border_0",
        close : function(event, ui) {
            if (typeof closeFunc == "function") {
                closeFunc();
            }
        }
    });
    dlgForm.siblings().remove();
    dlgForm.css("padding" , "0");
    dlgForm.parent().css("padding" , "0");


    dlgForm.find("#dialog_dup_logout_title").text(sTitle ? sTitle : '');

    if( typeof sText1 == "string" && sText1 != "" && typeof sText2 == "string" && sText2 != "" ) {
        dlgForm.find("#dialog_dup_logout_text1").show().html(sText1);
        dlgForm.find("#dialog_dup_logout_text2").show().css('margin-top','14px').find('strong').html(sText2);
    } else if( sText1 ) {
        dlgForm.find("#dialog_dup_logout_text1").show().html(sText1);
        dlgForm.find("#dialog_dup_logout_text2").hide().css('margin-top','14px').find('strong').html('');
    } else if( sText2 ) {
        dlgForm.find("#dialog_dup_logout_text1").show().html(sText2);
        dlgForm.find("#dialog_dup_logout_text2").hide().css('margin-top','14px').find('strong').html('');
    } else {
        dlgForm.find("#dialog_dup_logout_text1").show().css('margin-top','0px').find('strong').html('');
        dlgForm.find("#dialog_dup_logout_text2").hide().css('margin-top','14px').find('strong').html('');
    }

    window.onkeydown = function(e){
        if (e.keyCode == '27') {
            e.preventDefault();
            sessionStorage.removeItem("duplog");
            logoutldap();
        }
    }
    dlgForm.find("#btn_service_err_top_close").unbind("click").bind("click", function(e) {
        e.preventDefault();
        dlgForm.dialog("close");
        sessionStorage.removeItem("duplog");
        logoutldap();
    });
    dlgForm.find("#logout_btnCancel").unbind("click").bind("click", function(e) {
        e.preventDefault();
        dlgForm.dialog("close");
        sessionStorage.removeItem("duplog");
        logoutldap();
    });

    if( no_btn_show ) {
        dlgForm.find("#logout_btnCancel").parent().hide();
    }else {
        dlgForm.find("#logout_btnCancel").parent().show();
    }

    dlgForm.dialog("open");
}


function makeShowdlgLogout_MsgPopCr() {
    if( $("#dialog_dup_logout").html() == null ) {
        var arrHtml = [];


        arrHtml.push("<div class=\"popUp\" id=\"dialog_dup_logout\" style=\"width: 447px; top: auto !important; padding: 0px; min-height: 148px; max-height: none; height: auto; overflow: hidden;\"> <!-- pop_frame --> <!--width, top 조절 --> ");
        arrHtml.push("    <div class=\"head htpop clfix\">                                                                                                                                                                                         ");
        arrHtml.push("        <h1><!--타이틀--> <span class=\"del\"><a href=\"#\"><img src=\"/images/coni/Cancel.svg\" alt=\"\"></a></span></h1>                                                                                                                                                                                       ");
        arrHtml.push("    </div>                                                                                                                                                                                                           ");
        arrHtml.push("    <div class=\"body\">                                                                                                                                                                                            ");
        arrHtml.push("        <div class=\"con\">                                                                                                                                                                                         ");
        arrHtml.push("            <div class=\"box_txtl ac\" id =\"dialog_dup_logout_text1\">HA 사용을 정지 하시겠습니까?</div>                                                                                                                                    ");
        arrHtml.push("        </div>                                                                                                                                                                                                       ");
        arrHtml.push("    </div>                                                                                                                                                                                                           ");
        arrHtml.push("    <div class=\"btn_box mt60\">                                                                                                                                                                                            ");
        arrHtml.push("      <div class=\"btnl_primary pop_btn_right\" id=\"logout_btnCancel\"><a href=\"#\">예</a></div>                                                                                                                                      ");
        arrHtml.push("    </div>                                                                                                                                                                                                           ");
        arrHtml.push("</div>");

        $(arrHtml.join("\n")).appendTo($("body"));

        // Dummy 클릭 이벤트 처리
        $(".btn_dummy").unbind("click").bind("click", function(e) {
            e.preventDefault();
        });
    }
}

function logcollect(operation,restype,userid,event,page,duration,  stype,  sdetail, lampcode, lampdesc, lampdetail, personalInfoList ){
//    if(window.name != "ucloud_portal"){
    var lparams = {"operation":operation,"restype":restype, "userid":userid, "event":event, "page" : page, "duration" : duration
        , "type" : stype,"sdetail" : sdetail
        , "lampcode":lampcode,"lampdesc":lampdesc,"lampdetail":lampdetail,"personalInfoList":personalInfoList };

    $.ajax({
        url: "/uclamp",
        type: "POST",
        data: lparams,
        dataType: "json",
        success : function(json) {
            return;
        },
        error: function(xhr, desc, error) {
            return;
        }
    });
//    }
}

function logcollect_new2(operation,restype,userid,event,page,duration,  stype,  sdetail, lampcode, lampdesc, lampdetail, personalInfoList, reason, readOther){
    var lparams = {"operation":operation,"restype":restype, "userid":userid, "event":event, "page" : page, "duration" : duration
        , "type" : stype,"sdetail" : sdetail
        , "lampcode":lampcode,"lampdesc":lampdesc,"lampdetail":lampdetail,"personalInfoList":personalInfoList
        , "reason" : reason,"readOther" : readOther
    };

    $.ajax({
        url: "/uclamp",
        type: "POST",
        data: lparams,
        dataType: "json",
        success : function(json) {
//            console.log("lamp 정상 등록");
        },
        error: function(xhr, desc, error) {
//            console.log("lamp 등록 실패");
        }
    });
//}
}

//테이블 sort 처리
function getSort(orderby_string, sort_id_string, orderby, sort_id){
    var result = "";
    if(localStorage.getItem(orderby_string) && localStorage.getItem(sort_id_string)){
        orderby = localStorage.getItem(orderby_string);
        sort_id = localStorage.getItem(sort_id_string);
        result = orderby+","+sort_id;
    }

    return result;

}
//테이블 sort 처리
function setSort(orderby_string, orderby, sort_id_string,  sort_id){
    localStorage.setItem(orderby_string , orderby);
    localStorage.setItem(sort_id_string , sort_id);
}


function dupLoginSessionCr(){
    if ($.cookie("memid") != null && $.cookie("memid") != "" && window.name != "ucloud_portal") {
        $.ajax({
            url: "/userinfo"
            , type: "POST"
            , data: {command : "sessionCheck"}
            , dataType: "json"
            ,async:true
            , success: function(json) {
                var result = json.status;
                if(result == "999"){
                    sessionStorage.setItem("duplog", "out");
                    showdlglogout_MsgCr("로그아웃", "다른 곳에서 로그인이 되어 로그아웃 됩니다.","");
                }else{
                    console_sesscheck();
                }
            }
        });
    }
}

function setCdSearch(){
    var params = {};

    params.cd_id = "publickeymodulus";
    params.cd_grp_id = "g0003";
    params.command = "etccodecall";
    requestData(params, cdVal);

    params.command = "etccodecall";
    params.cd_id = "publickeyexponent";
    params.cd_grp_id = "g0003";
    requestData(params, cdVal);
}

/* ajax request */
function requestData(paramData, actionType) {
    $.ajax({
        url: "/rsakey"
        , type: "post"
        , data: paramData
        , async : false
        , dataType: "json"
        , timeout: 10000
        , success: function(resultVal) {
            if (typeof actionType) {
                actionType(resultVal);
            } else {
                alert("오류가 발생하였습니다.\n다시 시도해 주세요.");
            }
        }
        , error: function(e) {
            alert("오류가 발생하였습니다.\n다시 시도해 주세요.");
        }
    });
}

/*RSA 암호화용 공개 key 조회*/
function cdVal(result){
    var cdVal = "", cdId = "";
    if (result.status == "00") {
        cdVal = result.data.cd_val;
        cdId = result.data.cd_id;
        if(cdId == "publickeymodulus"){
            $("#publicKeyModulus").val(cdVal);
        }else{
            $("#publicKeyExponent").val(cdVal);
        }
    }else {
        if ((result.errMsg != undefined)||(result.errMsg != "")) {
            alert("오류가 발생하였습니다.\n(" + result.errMsg + ")");
        } else {
            alert("오류가 발생하였습니다.");
        }
    }
}

// IAM 사용자 정책 조회 : 조성훈, 2020. 03. 20
function getUserServicePolcy() {
    $.ajax({
        url: "/iam"
        , type: "post"
        , data: {command : "getUserServicePolicy"}
        , dataType: "json"
        , success: function(json) {
            if (json == null) {
                return;
            }

            var result = json.status;

            if(result == "-1") { // 로그아웃된 경우
                document.location.href = "/cdn/all";
            } else {
                iamServicePolicy = json.data;
            }
        }
    });
}

//IAM 사용자 정책 조회 : 조성훈, 2020. 03. 20
function getUserGroupPolcy() {
    $.ajax({
        url: "/iam"
        , type: "post"
        , data: {command : "getUserGroupPolicy"}
        , dataType: "json"
        , success: function(json) {
            if (json == null) {
                return;
            }

            var result = json.status;

            if(result == "-1") { // 로그아웃된 경우
                document.location.href = "/cdn/all";
            } else {
                iamGroupPolicy = json.data;
            }
        }
    });
}

//사버 생성 시 enterprise 2.0용 tier 조회
function add_ent_tier_info(zoneid) {
    var zone = zoneid;


    var mem_sq = $.cookie("memsq");

    /*captainPark 2021.09.29 그룹기능 추가로 파라미터 변경*/
    //if (group_mem_sq != ""){
    //    mem_sq = group_mem_sq;
    //}
    if ( zone == "" || zone == undefined || zone == null )  {
        zone = "DX-M1";
    }
    var params={
        command : "listNetworkPublic",
        zone_id : zone,
        account : $.cookie('account'),
        memSq : mem_sq,
        group_mem_sq : group_mem_sq,
        multi_stack_id : getStackId("zone", zone)
    };

    $.ajax({
        url: "/osSvcSvrPrc"
        , type : "POST"
        , data : params
        , async : false
        , dataType : "json"
        , success : function(json) {
            items = json.data.nc_listvpcsresponse.vpcs[0].networks;
            ent_tier_info = items;
        }
    });
}


//사버 생성 시 openStack용 tier 조회
function call_os_vpcs(destObj,zoneid) {
    var zone = zoneid;

    if(destObj == null) {
        var zone_temp = getSelectZoneid_pop();

        if(zone_temp != null && zone_temp != ""){
            zone = zone_temp;
        }
    }

    var mem_sq = $.cookie("memsq");

    /*captainPark 2021.09.29 그룹기능 추가로 파라미터 변경*/
    //if (group_mem_sq != ""){
    //    mem_sq = group_mem_sq;
    //}

    if ( zone == "" || zone == undefined || zone == null )  {
        zone = "DX-M1";
    }

    if(destObj == null) {
        destObj = $("#select_ent2_tier");
        destObj.empty();
    }

    // 20230221 EPC 포탈 방화벽 정책 조회 기능 이상 개선
    if(main_tier_list && main_tier_list.length > 0) {
        os_tier_info = main_tier_list;

        for(var i = 0; i < main_tier_list.length ; i++) {
            if(main_tier_list[i].zoneid == zone) {
                if (main_tier_list[i].name == "external" || main_tier_list[i].name == "DMZ_Sub" || main_tier_list[i].name == "Private_Sub" || main_tier_list[i].maintieryn == "Y" || (main_tier_list[i].type == "CONNECTED_HUB" && (destObj && (destObj.attr("id") == "staticroute_tier" || destObj.attr("id") == "source_network_ent2" || destObj.attr("id") == "dest_network_ent2"))))    {
                    destObj.append("<option value="+ main_tier_list[i].id + " iptype=" + main_tier_list[i].type + " gateway=" + main_tier_list[i].gateway + ">" + main_tier_list[i].name +"</option>");
                }
            }
        }
        selectbox_design(destObj);
        return;
    }
    /*
        var params={
            command : "listNetworkPublic",
            zone_id : zone,
            account : $.cookie('account'),
            memSq : mem_sq,
            group_mem_sq : group_mem_sq,
            multi_stack_id : getStackId("zone", zone)
        };

        $.ajax({
            url: "/osSvcSvrPrc"
            , type : "POST"
            , data : params
            , async : false
            , dataType : "json"
            , success : function(json) {
                items = json.data.nc_listvpcsresponse.vpcs[0].networks;
                os_tier_info = items;

                if(items != null && items.length > 0) {
                    for(var i = 0; i < items.length ; i++) {
                        if (items[i].name == "external" || items[i].name == "DMZ_Sub" || items[i].name == "Private_Sub" || items[i].maintieryn == "Y" || (items[i].type == "CONNECTED_HUB" && (destObj && (destObj.attr("id") == "staticroute_tier" || destObj.attr("id") == "source_network_ent2" || destObj.attr("id") == "dest_network_ent2"))))    {
                            destObj.append("<option value="+ items[i].id + " iptype=" + items[i].type + " gateway=" + items[i].gateway + ">" + items[i].name +"</option>");
                        }
                    }
                }
                selectbox_design(destObj);
            }
        });
    */
}

function mouseEnter(obj) {
    if ($(".vm_searchArea").find("#sch_word").css('display') == "none") {
        $(".vm_searchArea").addClass("bc_mint");
        $(".vm_searchArea").find("#sch_word").css('display','');
    };
}
function mouseLeave(obj) {
    if ($(".vm_searchArea").find("#sch_word").css('display') == 'block') {
        var schWord = $(".vm_searchArea").find("#sch_word").val();
        if (schWord == undefined || schWord == "") {
            $(".vm_searchArea").removeClass("bc_mint");
            $(".vm_searchArea").find("#sch_word").css('display','none');
        }
    }
}

function getVPCUserInfo(){
    $.ajax({
        url: "/userinfo",
        type: "POST",
        data: "command=listDvpcCheck",
        async:false,
        dataType: "json",
        success: function(json) {
            d_vpc_info = json.listdvpccheckresponse;
        }
    });
}

function is_vpcd1_user() {
    if(d_vpc_info && d_vpc_info == "Y") {
        return true;
    } else {
        return false;
    }
}
function go_portal_satisfaction_evaluation(category, servicename){

    // IAM 사용자인 경우 문의하기 사용 못함 : 조성훈, 2020. 03. 20
    if($.cookie("iamid")) {
        return;
    }
    var url = 'https://dt.kt.co.kr/web/widget/sdeg.html?k=63dc6a33-665e-4346-b1a4-d26169c1dc5c&w=KT_CLOUD_CNSOL_SDEG&a={"rfrn1":"'+category+'","rfrn2":"'+servicename+'"}';

    window.open( url,'vivaldiSdegPop','width=460, height=700, toolbar=no, location=no, status=no, menubar=no');
}


function chkIpcMember(){
    $.ajax({
        url: "/userinfo",
        type: "POST",
        data: "command=checkIpcMember",
        dataType: "json",
        async: false,
        success: function(data) {
            ipcMemberInfo = data.data;

        }
    });
}

function ajaxSendError()    {
    hideLoadingBox();
    process_toast_popup("서버통신에러", "서버통신에 실패하였습니다. 다시 시도해 주시기 바랍니다.", false);
}

/* captainPark 2021.11.03
 * Tier 목록에서 Tier이름으로 Main Tier인지 Sub Tier인지 구분
 * E : Error 혹은 데이터없음, S : Sub Tier, M : Main Tier
 * */
function getTierType(tiernm, zone_id)    {
    var rVal="E";
    if ( main_tier_list == null || tiernm == null || tiernm == undefined || tiernm == "" )    {
        return rVal;
    }
    for(var x = 0; x < main_tier_list.length ; x++) {
        if ( ( main_tier_list[x].tiernm == tiernm || main_tier_list[x].tiernm == ( tiernm + "_Sub") ) && main_tier_list[x].zoneid == zone_id )    {
            if(main_tier_list[x].maintieryn == "N" ) {    // subtier
                rVal = "S";
            } else {
                rVal = "M";
            }
        }
    }
    return rVal;
}

function sanitizeXSS(val) {
    if(val == null){
        return val;
    }
    val = val.replace(/</g, "&lt;");  //replace < whose unicode is \u003c     
    val = val.replace(/>/g, "&gt;");  //replace > whose unicode is \u003e  
    return val;
}

function set_site_lang_cd_info(){
    $.ajax({
        url: "/ConsoleMain",
        type: "POST",
        data: "command=getSiteLangCd",
        dataType: "json",
        async: false,
        success: function(json) {
            let siteLangCdTemp = json.data;
            if(siteLangCdTemp != ""){
                site_lang_cd = json.data;
            }
        }
    });
}

function showInstancesdlgError_Msg(sTitle, sText1, sText2, closeFunc) {
  var strDlg = "";
  var dlgForm = $("#dialog_Instancesservice_Msg");
  
  dlgForm.dialog({ 
    close : function(event, ui) {
      if (typeof closeFunc == "function") {
        closeFunc();
      }
    }
  });
  
  dlgForm.dialog("open");
  
  dlgForm.find("#dlg_Instancesservice_Msg_title").html(sTitle);
  dlgForm.find("#dlg_Instancesservice_text1").html(sText1);
  dlgForm.find("#dlg_Instancesservice_text2").html(sText2);

  
  dlgForm.find("#btn_Instancesservice_Msg_top_close").unbind("click").bind("click", function(e) {
    e.preventDefault();
    dlgForm.dialog("close"); 
//    return false;
  });
      
  dlgForm.find("#btn_Instances_MsgOK").unbind("click").bind("click", function(e) {
    e.preventDefault();
    dlgForm.dialog("close"); 
//    return false;
  });
  
}


function setOsTier(zoneid) {
    var zone = zoneid;

    if(zone == "" || zone ==null) {
        zone = $.cookie("zonesq");
    } else {
        zone = zoneid;
    }

    if (group_zone_sq != ""){
        zone = group_zone_sq;
    }

    var mem_sq = $.cookie("memsq");

    if ( zone == "" || zone == undefined || zone == null )  {
        zone = "DX-M1";
    }

    var params={
        command : "listNetworkPublic",
        zone_id : zone,
        account : $.cookie('account'),
        memSq : mem_sq,
        group_mem_sq : group_mem_sq,
        multi_stack_id : getStackId("zone", zone)
    };

    $.ajax({
        url: "/osSvcSvrPrc"
        , type : "POST"
        , data : params
        , dataType : "json"
        , success : function(json) {
            if (json.data.nc_listvpcsresponse.hasOwnProperty("vpcs")) {
                items = json.data.nc_listvpcsresponse.vpcs[0].networks;
                main_tier_list = items;
            }
        }
    });
}
