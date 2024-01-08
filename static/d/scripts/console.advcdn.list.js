document.onkeydown = function(){
  if(event.keyCode == 116){
    event.keyCode =505;
  }

  if(event.keyCode == 505){
    window.location.href="/console/d/osadvcdnlist";
    return false;
  }
};

var svcNm_chk = false;
var svcDm_chk = false;
var org_svcNm_chk = false; 
var ori_hostNm_chk = false;
var referer_chk = false;
var ip_chk = false;
var geo_chk = false;
var certnmCheckYN = false;
var cors_chk = false;
var caching_chk = false;
var modifyYn = false;   // 수정화면 여부

var firstlistcheck         = false;
var org_protocol         = null;
var status                = {
        READY        : "0111",    //준비중
        START        : "0300",    //시작
        STOP        : "0400",    //정지
        QUIT        : "0500"    //해지
};

var org_sel         = "";                //원본서버 타입(create)
var update_org_sel     = "";                //원본서버 타입(update)
var storageUrl        = "";
var orgUri            = "";                // Storage 원본 URL
var urlOkNm = "";
var purge_nm = "";

var zcopy3_prefix = "3copy - ";
var zcopy2_prefix = "2copy - ";

var objLang = null;
var sortting = false;

var http_port_chk = true;
var selectedRow = "";
var sort_items = [];
/****************************************************
 * ONEVIEW 처리 START - 최웅(2013.05.23)
 ****************************************************/
var oneview_id =  getQueryString("oneview_id");
var oneview = false;
if(oneview_id!=""){
    oneview = true;
}
/****************************************************
 * ONEVIEW 처리 END
 ****************************************************/
var group_mem_sq = "";
var group_mem_nm = "";
var group_mem_id = "";

var origin_path_seq = 0;

//2021.08.23 코드아이 관련 수정
var lastSelectedServerName = "";
var lastSelectedServerName_update = "";
var needSsSelect = false;

// cdn3.0 고도화
let country_list = [];

let add_origin_request_headers = {};
let add_client_response_headers = {};

let applyCertiData = null;









function selectBoxChang(){
    $("#org_select li span").each(function(i,e){
        if($(this).hasClass('on')){
            org_sel = $(this).attr('value');
        }
    });
    
    if("ss" == org_sel){
        $("#cdnCreateArea_ss_div").show();
        $("#cdnCreateArea_direct_div").hide();
        $("#cdnCreateArea_direct_div1").hide();
        $("#cdnCreateArea_direct_div2").hide();
        $("#cdnCreateArea_direct_div3").hide();
    }
    else{
        $("#cdnCreateArea_direct_div").show();
        $("#cdnCreateArea_direct_div1").show();
        $("#cdnCreateArea_direct_div2").show();
        $("#cdnCreateArea_direct_div3").show();
        $("#cdnCreateArea_ss_div").hide();
    }
}

function set_CdnEvent()
{
    svcNm_chk = false;
    svcDm_chk = false;
    $("#green_svn_nm").hide();
    $("#red_svn_nm").hide();
    //sort
    
    //이름
    $("#view_svr_name").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_name");
    });
    //유형
    $("#view_svr_type").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_type");
    });
    //상태
    $("#view_svr_state").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_state");
    });
    //서비스도메인
    $("#view_svr_domain").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_domain");
    });
    //생성일시
    $("#view_svr_dttm").unbind("click").bind("click" ,function(e) {
        e.preventDefault();
        evnet_sort("view_svr_dttm");
    });
    
    
    $("#http_select li span").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("#http_select li span").removeClass('on');
        $(this).addClass('on');
        if($("#http_select").find(".on").attr("value") == "https"){
            $("#http_port").val("443");
        }else{
            $("#http_port").val("80");
        }
    });
    
    $("#button_cdnDeploy").unbind("click").bind("click" , function(e) {
        svcNm_chk = false;
        svcDm_chk = false;
        e.preventDefault();
        event_cdnDeploy();
    });

    $("#button_cdnStart").unbind("click").bind("click" , function(e) {
        e.preventDefault();
        event_cdnStart(e);
        return false;
    }); 
    $("#button_cdnStop").unbind("click").bind("click" , function(e) {
        e.preventDefault();
        event_cdnStop(e);
        return false;
    }); 
    $("#button_cdnDelete").unbind("click").bind("click" , function(e) {
        e.preventDefault();
        event_cdnDelete(e);
        return false;
    });
    $("#button_cdnModify").unbind("click").bind("click" , function(e) {
        if($(this).hasClass("action_disabled2")){
            return false;
        }
        svcNm_chk = true;
        svcDm_chk = true;
        org_svcNm_chk = true;
        e.preventDefault();
        event_cdnModify();
    });
    $("#button_cdnDetail").unbind("click").bind("click" , button_cdnDetail_event);
    
    //step1_서비스유형 선택시
    $("#step1_svcType li span").unbind("click").bind("click", function(e) {
        e.preventDefault();
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("#step1_svcType li span").removeClass('on');
        $(this).addClass('on');
        
        var type = dlgForm.find("#step1_svcType").find(".on").attr("value");
        if(type == "0"){
            //다운로드
            dlgForm.find("#step1_sslType_2").show();
            dlgForm.find("span[name=query_para]").attr("disabled", false);
            dlgForm.find("span[name=query_para]").removeClass("disck");
            dlgForm.find("span[name=compression]").attr("disabled", false);
            dlgForm.find("span[name=compression]").removeClass("disck");
            dlgForm.find("span[name=referer_set]").attr("disabled", false);
            dlgForm.find("span[name=referer_set]").removeClass("disck");
            $(".step4_download_div").show(); //다운로드일때만 노출
            
        }else{
            //스트리밍
            dlgForm.find("#step1_sslType_2").hide();
            $("span[name=query_para]").removeClass('on');
            $("span[name=compression]").removeClass('on');
            dlgForm.find("span[name=query_para][data-value='INCLUDE_ALL_ALPHABETIZE_ORDER']").addClass('on');
            dlgForm.find("span[name=query_para]").attr("disabled", true);
            dlgForm.find("span[name=query_para]").addClass("disck");
            $("span[name=query_para]").removeClass('on');
            $("#query_para2").addClass('on');
            dlgForm.find("span[name=compression][data-value='false']").addClass('on');
            dlgForm.find("span[name=compression]").attr("disabled", true);
            $("span[name=compression]").removeClass('on');
            $("#compression2").addClass('on');
            dlgForm.find("span[name=compression]").addClass("disck");
            $(".step4_download_div").hide();
        }
    });
    
    //step1_서비스도메인 선택시
    $("#step1_domainType li span").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("#step1_domainType li span").removeClass('on');
        $(this).addClass('on');
        dlgForm.find("#step1_custom_domains").val("");
        var type = dlgForm.find("#step1_domainType").find(".on").attr("value");
        if(type == "0"){
            dlgForm.find("#step1_custom_domains").show();
            svcDm_chk = false;
            if(dlgForm.find("#step1_sslType").find(".on").attr("value") != "0"){
                dlgForm.find("#certificateArea").show();
            }
        }else{
            dlgForm.find("#step1_custom_domains").hide();
            svcDm_chk = true;
            dlgForm.find("#red_svn_dm").hide();
            dlgForm.find("#certificateArea").hide();
            dlgForm.find("#red_svn_ssl").hide();
            dlgForm.find("#txt_sel_certificate").val("");
        }
    });    

    //step1 HTTP/HTTPS 선택시
    $("#step1_sslType li span").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("#step1_sslType li span").removeClass('on');
        $(this).addClass('on');
        var type = dlgForm.find("#step1_sslType").find(".on").attr("value");
        if(type == "0"){
            dlgForm.find("#certificateArea").hide();
            dlgForm.find("#red_svn_ssl").hide();
            dlgForm.find("#txt_sel_certificate").val("");
        }else{
            if(dlgForm.find("#step1_domainType").find(".on").attr("value") == "0"){
                dlgForm.find("#certificateArea").show();
                dlgForm.find("#txt_sel_certificate").val(applyCertiData?.name);
            }else{
                dlgForm.find("#certificateArea").hide();
                dlgForm.find("#red_svn_ssl").hide();
                dlgForm.find("#txt_sel_certificate").val("");
            }
        }
    });    
    
    //기존 인증서 업로드 버튼 클릭
    $("#basecertificateUpload").unbind("click").bind("click" , function(e){
        e.preventDefault();
        certBaseFileSave();
    });
    
    //신규 인증서 업로트 버튼 클릭
    $("#certificateUpload").unbind("click").bind("click" , function(e){
        e.preventDefault();
        certnmCheckYN = false;
        $("#sslcertfileName").unbind("keydown").bind("keydown", checkSSLCertNm);
        function checkSSLCertNm(){
            $("#sslcertfileName").val($("#sslcertfileName").val().replace(/[^.\a-zA-Z0-9\_\-\*\/]/g,''));
            var rtn = "필수입니다.";
            if ($("#sslcertfileName").val() =="") {
                $("#ssl_name_red").show().css("display","");
                $("#ssl_name_red").text(rtn);
                $("#sslcertfileName").required = true;
                certnmCheckYN = false;
                return;
            }
            
            if($("#sslcertfileName").val().length > 20){
                rtn = "20자 이내로 입력해주세요.";
                $("#ssl_name_red").show().css("display","");
                $("#ssl_name_red").text(rtn);
                $("#sslcertfileName").required = true;
                certnmCheckYN = false;
                return;
            }
            
            var certnm = $("#sslcertfileName").val();
            
            var params = {
                    command : "certnmcheck",
                    certnm : certnm
                };
                $.ajax({
                    url: "/mpx",
                    type: "POST",
                    data: params,
                    dataType: "json",
                    success: function(json) {
                        if(json.data == "0"){
                            $("#ssl_name_red").hide();
                            $("#sslcertfileName").attr('required', false);
                            certnmCheckYN = true;
                            return;
                        }
                        else{
                            rtn = "중복된 이름입니다.";
                            $("#ssl_name_red").show().css("display","");
                            $("#ssl_name_red").text(rtn);
                            $("#sslcertfileName").required = true;
                            certnmCheckYN = false;
                            return;
                        }
                    },
                    error: function(XMLHttpResponse) {
                        rtn = "중복확인 실패.";
                        $("#ssl_name_red").show().css("display","");
                        $("#ssl_name_red").text(rtn);
                        $("#sslcertfileName").required = true;
                        certnmCheckYN = false;
                        return;
                    }
                });
        }
        $("#sslcertfileName").unbind("keyup").bind("keyup", keyupCertName);
        
        function keyupCertName(){
            $("#sslcertfileName").val($("#sslcertfileName").val().replace(/[^.\a-zA-Z0-9\_\-\*\/]/g,''));
            var rtn = "필수입니다.";
            if ($("#sslcertfileName").val() =="") {
                $("#ssl_name_red").show().css("display","");
                $("#ssl_name_red").text(rtn);
                $("#sslcertfileName").required = true;
                certnmCheckYN = false;
                return;
            }
            if($("#sslcertfileName").val().length > 20){
                rtn = "20자 이내로 입력해주세요.";
                $("#ssl_name_red").show().css("display","");
                $("#ssl_name_red").text(rtn);
                $("#sslcertfileName").required = true;
                certnmCheckYN = false;
                return;
            }
            
            var certnm = $("#sslcertfileName").val();
            
            var params = {
                    command : "certnmcheck",
                    certnm : certnm
                };
                $.ajax({
                    url: "/mpx",
                    type: "POST",
                    data: params,
                    dataType: "json",
                    success: function(json) {    
                        if(json.data == "0"){
                            $("#ssl_name_red").hide();
                            $("#sslcertfileName").required = false;
                            certnmCheckYN = true;
                            return;
                        }
                        else{
                            rtn = "중복된 이름입니다.";
                            $("#ssl_name_red").show().css("display","");
                            $("#ssl_name_red").text(rtn);
                            $("#sslcertfileName").required = true;
                            certnmCheckYN = false;
                            return;
                        }
                    },
                    error: function(XMLHttpResponse) {
                        rtn = "중복확인 실패.";
                        $("#ssl_name_red").show().css("display","");
                        $("#ssl_name_red").text(rtn);
                        $("#sslcertfileName").required = true;
                        certnmCheckYN = false;
                        return;
                    }
                });
        }
        
        certFileSave();
    });
    
    //step1 보안URL 사용시 SecretKey 자동생성
    $("span[name=token_access_controll]").unbind("click").bind("click", function(event) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("span[name=token_access_controll]").removeClass('on');
        $(this).addClass('on');

        if ($(this).attr('id') === "token_access_controll1") {
            var params = {command : "getSecretKey"};

            $.ajax({
                url : "/cdnSvc"
                , type : "POST"
                , data : params
                , dataType : "json"
                , async: false
                , success : function(data) {
                    var apicode = data.XmlRoot.info.code;
                    var apikey = data.XmlRoot.info.msg;

                    var regExp = /[\{\}\[\]\/?.,;:|\)*~!^\-+<>@\#$%&\\\=\(\'\"]/gi;

                    if(regExp.test(apikey)){
                        var temp = apikey.replace(regExp, "A");
                        apikey = temp;
                    }

                    if (apicode == '1') {
                        $("#secretKey_box").html(apikey + "<a href='#' onclick=copy_to_clipboard('"+apikey +"')> <img src='/images/coni/Table_Copy.svg' alt=''></a>");
                    } else {
                        showCommonLangErrorMsg("자동생성실패","secretKey 자동생성에 실패하였습니다.","");
                    }
                }
            });
        }
    });
    
    $("#step1_svcComment").keyup(function (e){
        var content = $(this).val();
        $(".currentvalue").html(content.length);

        if(content.length>2000){
            $(this).val(content.substring(0,2000));
            renname_dialog.find(".currentvalue").html(2000);
        }
    });
    
    //step2 원본 서버 위치 선택시
    $("#org_select li span").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("#org_select li span").removeClass('on');
        $(this).addClass('on');
        
        var type = dlgForm.find("#org_select").find(".on").attr("value");
        
        if(type == "ss"){
            //KT Cloud Storage 선택시
            org_svcNm_chk = true;
            http_port_chk = true;
            dlgForm.find("#cdnCreateArea_direct_div").hide();
            dlgForm.find("#cdnCreateArea_direct_div1").hide();
            dlgForm.find("#cdnCreateArea_direct_div2").hide();
            dlgForm.find("#cdnCreateArea_direct_div3").hide();
            dlgForm.find("#cdnCreateArea_ss_div").show();
        }else{
            //직접입력 선택시
            org_svcNm_chk = false;
            http_port_chk = true;

            if (!$("#http_select").find(".on").attr("value") == "https") {
                dlgForm.find("#http_port").val("80");
            }

            $("#http_port").attr("required", false);
            $("#http_red_text_area").hide();
            dlgForm.find("#red_org_svn_nm").hide();
            dlgForm.find("#http_red_text_area").hide();
            dlgForm.find("#http_green_text_area").hide();
            dlgForm.find("#cdnCreateArea_ss_div").hide();
            dlgForm.find("#cdnCreateArea_direct_div").show();
            dlgForm.find("#cdnCreateArea_direct_div1").show();
            dlgForm.find("#cdnCreateArea_direct_div2").show();
            dlgForm.find("#cdnCreateArea_direct_div3").show();
        }
    });    
    
    //step2 호스트 헤더의 전달 선택시
    $("#hostHd li span").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("#hostHd li span").removeClass('on');
        $(this).addClass('on');
//        dlgForm.find("#originHN").val("");
        var type =dlgForm.find("#hostHd").find(".on").attr("value");
        if(type == "REQUEST_HOST_HEADER"){
            dlgForm.find(".cdn_ori_host").hide();
            ori_hostNm_chk = true;
        }else{
            dlgForm.find(".cdn_ori_host").show();
            ori_hostNm_chk = false;
        }
    });
    
    // cors 설정 > step 4
    $("#corsSet li span").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("#corsSet li span").removeClass('on');
        $(this).addClass('on');
        var type =dlgForm.find("#corsSet").find(".on").attr("value");
        if(type == "CORS_NOT_ALLOW_ORIGIN"){
            cors_chk = false;
        }else{
            cors_chk = true;
        }
        
        
    });
    
    //step2 Modify Header
    $("span[name=step2_modify_header]").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("span[name=step2_modify_header]").removeClass('on');
        $(this).addClass('on');

        if ($(this).attr('id') === "step2_modify_header1") {
            $("#step2_modify_header_div").show();
        } else {
            $("#step2_modify_header_div").hide();
        }
    });

    $("#step2_modify_header_action").unbind("change").bind("change", function() {
		if($(this).val() === "DELETE") {
			$("#step2_modify_header_value").attr('disabled', true);
			
		}else {
			$("#step2_modify_header_value").attr('disabled', false);
		}
	});
    $("#step2_modify_header_add").unbind("click").bind("click", function() {
		let modify_header_action = $("#step2_modify_header_action").val();
		let modify_header_name = $("#step2_modify_header_name").val();
		let modify_header_value = modify_header_action === "DELETE" ? "" : $("#step2_modify_header_value").val();

        // modify header name, value 입력값 유효성 체크
        if (modify_header_action === "DELETE" && CheckModifyHeader(modify_header_name)) {
            $("#modify_header_text_area").show();
            $("#modify_header_red_text").text("입력값에 한글, 공백, ':', '|', '<', '>'는 포함될 수 없습니다.");
            return false;
        } else {
            if (CheckModifyHeader(modify_header_name) || CheckModifyHeader(modify_header_value)) {
                $("#modify_header_text_area").show();
                $("#modify_header_red_text").text("입력값에 한글, 공백, ':', '|', '<', '>'는 포함될 수 없습니다.");
                return false;
            }
        }
        $("#modify_header_text_area").hide();
		
		if(modify_header_name === ""){
			$("#step2_modify_header_name").attr("required", true);
			return false;
		}else {
			$("#step2_modify_header_name").attr("required", false);
		}
		
		if(modify_header_action !== "DELETE" && modify_header_value === ""){
			$("#step2_modify_header_value").attr("required", true);
			return false;
		}else {
			$("#step2_modify_header_value").attr("required", false);
		}
		
		add_origin_request_headers[modify_header_name] = modify_header_value;
		let base_modify_header = $("#base_modify_header").clone().show();
		let base_modify_header_step5 = $("#step5_modify_header_base").clone().attr('id', modify_header_name).show(); // 최종화면
		
		
		
		$("#step2_modify_header_name").val('');
		$("#step2_modify_header_value").val('');
		
		base_modify_header.find("#text_step2_modify_header_action").text(modify_header_action);
		base_modify_header.find("#text_step2_modify_header_name").text(modify_header_name);
		base_modify_header.find("#text_step2_modify_header_value").text(modify_header_value);
		
		base_modify_header_step5.find("#base_action").text(modify_header_action);
		base_modify_header_step5.find("#base_name").text(modify_header_name);
		base_modify_header_step5.find("#base_value").text(modify_header_value);
		
		base_modify_header.find(".tablessh").bind("click", function() {
			let text_header_name = $(this).parent().parent().find("#text_step2_modify_header_name").text();
			delete add_origin_request_headers[text_header_name];
			$(this).parent().parent().remove();
			$("#step5_modify_header_step2_div").find("#" + modify_header_name).remove();
		});
		$("#step5_modify_header_base").before(base_modify_header_step5);
		$("#base_modify_header").before(base_modify_header);
	});
    
    //step3 최대캐싱기간 변경
//    $("#positive_ttl li span").unbind("click").bind("click", function(e) {
//        var dlgForm = $("#cdnCreateArea");
//        dlgForm.find("#positive_ttl li span").removeClass('on');
//        $(this).addClass('on');
//    });
    
    //step3 query 파라미터 무시 변경
    $("span[name=query_para]").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        var type = dlgForm.find("#step1_svcType").find(".on").attr("value");
        if (type === "1") {
            return false;
        }

        if (modifyYn && $("#modify_step1_svcType").text() == "스트리밍") {
            return false;
        }

        dlgForm.find("span[name=query_para]").removeClass('on');
        $(this).addClass('on');
    });

    //step3 Last Mile 압축 변경
    $("span[name=compression]").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        var type = dlgForm.find("#step1_svcType").find(".on").attr("value");
        if (type === "1") {
            return false;
        }

        if (modifyYn && $("#modify_step1_svcType").text() == "스트리밍") {
            return false;
        }

        dlgForm.find("span[name=compression]").removeClass('on');
        $(this).addClass('on');
    });
    
    //step4 Refer기준ACL설정
    $("span[name=referer_set]").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("span[name=referer_set]").removeClass('on');
        $(this).addClass('on');
        
        var type = null;
        
        dlgForm.find("span[name=referer_set]").each(checkReferSet2);
    
        function checkReferSet2(){
            if($(this).hasClass('on')){
                type = $(this).attr('data-value');
            }
        }
        
        if(type == "0"){
            referer_chk = false;
            dlgForm.find("#referer_area").show();
            dlgForm.find("#allow_non_exist_referer").show();
            dlgForm.find("span[name=non_exist_referer_set]").removeClass('on');
            dlgForm.find("span[name=non_exist_referer_set][data-value='0']").addClass('on');
            dlgForm.find("#referers").val("");
        }else{
            referer_chk = true;
            dlgForm.find("#referer_area").hide();
            dlgForm.find("#allow_non_exist_referer").hide();
            dlgForm.find("#referers").val("");
        }
    });
    $("span[name=non_exist_referer_set]").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("span[name=non_exist_referer_set]").removeClass('on');
        $(this).addClass('on');
    });
    
    //step4 IP 기반 접근 제어
    $("span[name=ip_access_controll]").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("span[name=ip_access_controll]").removeClass('on');
        $(this).addClass('on');

        var val = this.dataset.value;
        if (val === "0") {
			$("#ip_access_controll_div").hide();
            ip_chk = true;
		} else if (val === "-1" || val === "2") {
            ip_chk = false;
            $("#ip_access_controll_div").show();
            $("#ip_access_controll0").addClass('on');
            $("#ip_access_controll3").addClass('on');
        } else {
            ip_chk = false;
            $("#ip_access_controll_div").show();
            $("#ip_access_controll0").addClass('on');
            $("#ip_access_controll2").addClass('on');
        }
    });
    
    //step4 GEO 기반 접근 제어
    $("span[name=geo_access_controll]").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("span[name=geo_access_controll]").removeClass('on');
        $(this).addClass('on');
        
        var val = this.dataset.value;
        if (val === "0") {
            geo_chk = false;
			$("#geo_access_controll_div").hide();
		} else if (val === "1") {
            geo_chk = true;
            $("#geo_access_controll_div").show();
            $("#geo_access_controll0").addClass('on');
        } else {
            geo_chk = true;
			$("#geo_access_controll_div").show();
            $("#geo_access_controll3").addClass('on');
            $("#geo_access_controll0").addClass('on');
		}
    });
    
    $("#country_list").bind("change", function() {
		let country_code = $(this).val();
		if(country_list.includes(country_code)) return false;
		
		country_list.push($(this).val());
		
		let code_base = $("#geo_country_code_base").clone().show();
		code_base.find("#country_code_text").text(country_code);
		
		code_base.find("img").bind("click", function(){
			let span_country_code = $(this).parent().parent().find("#country_code_text").text();
			let reomve_index = country_list.indexOf(country_list.find(item => item === span_country_code));
            country_list.splice(reomve_index, 1);
            
			$(this).parent().parent().remove();
		});
		$("#geo_country_code_div").append(code_base);
        $("#geo_access_text_area").show().css("display","none");
	});
	
    $("#step4_modify_header_action").unbind("change").bind("change", function() {
		if($(this).val() === "DELETE") {
			$("#step4_modify_header_value").attr('disabled', true);
			
		}else {
			$("#step4_modify_header_value").attr('disabled', false);
		}
	});
    
    
    //step4 Modify Header
    $("#step4_modify_header li span").unbind("click").bind("click", function(e) {
        var dlgForm = $("#cdnCreateArea");
        dlgForm.find("#step4_modify_header li span").removeClass('on');
        $(this).addClass('on');
        let type = dlgForm.find("#step4_modify_header").find(".on").attr("value");
        if(type == "0"){
			$("#step4_modify_header_div").hide();
        }else{
			$("#step4_modify_header_div").show();
        }
    });    
    
    $("#step4_modify_header_add").unbind("click").bind("click", function() {
		let modify_header_action = $("#step4_modify_header_action").val();
		let modify_header_name = $("#step4_modify_header_name").val();
		let modify_header_value = modify_header_action === "DELETE" ? "" : $("#step4_modify_header_value").val();

        // modify header name, value 입력값 유효성 체크
        if (modify_header_action === "DELETE" && CheckModifyHeader(modify_header_name)) {
            $("#modify_header_client_text_area").show();
            $("#modify_header_client_red_text").text("입력값에 한글, 공백, ':', '|', '<', '>'는 포함될 수 없습니다.");
            return false;
        } else {
            if (CheckModifyHeader(modify_header_name) || CheckModifyHeader(modify_header_value)) {
                $("#modify_header_client_text_area").show();
                $("#modify_header_client_red_text").text("입력값에 한글, 공백, ':', '|', '<', '>'는 포함될 수 없습니다.");
                return false;
            }
        }
        $("#modify_header_client_text_area").hide();

		if(modify_header_name === ""){
			$("#step4_modify_header_name").attr("required", true);
			return false;
		}else {
			$("#step4_modify_header_name").attr("required", false);
		}
		
		if(modify_header_action !== "DELETE" && modify_header_value === ""){
			$("#step4_modify_header_value").attr("required", true);
			return false;
		}else {
			$("#step4_modify_header_value").attr("required", false);
			
		}
		
		add_client_response_headers[modify_header_name] = modify_header_value;
		let base_modify_header = $("#step4_base_modify_header").clone().show();
		let base_modify_header_step5 = $("#step5_modify_header2_base").clone().attr('id', modify_header_name).show(); // 최종화면
		
		$("#step4_modify_header_name").val('');
		$("#step4_modify_header_value").val('');
		
		base_modify_header.find("#text_step4_modify_header_action").text(modify_header_action);
		base_modify_header.find("#text_step4_modify_header_name").text(modify_header_name);
		base_modify_header.find("#text_step4_modify_header_value").text(modify_header_value);
		
		base_modify_header_step5.find("#base_action").text(modify_header_action);
		base_modify_header_step5.find("#base_name").text(modify_header_name);
		base_modify_header_step5.find("#base_value").text(modify_header_value);
		
		base_modify_header.find(".tablessh").bind("click", function() {
			let text_header_name = $(this).parent().parent().find("#text_step4_modify_header_name").text();
			delete add_client_response_headers[text_header_name];
			$(this).parent().parent().remove();
			$("#step5_modify_header_step4_div").find("#" + modify_header_name).remove();
		});
		$("#step5_modify_header2_base").before(base_modify_header_step5);
		$("#step4_base_modify_header").before(base_modify_header);
	});
	/////////////////////////////////////
    $("#button_cdnPurge").unbind("click").bind("click" , function(e) {
        e.preventDefault();
        if($(this).hasClass("action_disabled2")){
            return false;
        }
        var svcType = $("#text_type").text();
        var dlgForm = $("#dialog_cdnPurge");
        commonDialogInit(dlgForm);
        dlgForm.dialog("open");
        var svc_name = $("#text_serviceName").text();
        var cdn_domain = $("#text_serviceDomains").text();
        var svc_id = selectedRow.data("id");

        dlgForm.find("#purge_svcName").text(svc_name);
        dlgForm.find("#purgePreCautions").removeClass("on");
        dlgForm.find("#purgePreCautionsArea").removeClass("on");
        $('option','#purge_domain').remove();
        dlgForm.find($("#purge_type li span")).each(purgeTypeClick);
        function purgeTypeClick(){
            if($(this).attr('value') == "0"){
                $(this).attr('class', 'imgbn');
            }else{
                $(this).attr('class', 'imgbn on');
            }
        }
        dlgForm.find("#purgeURLarea").show();
        dlgForm.find("#purge_file").val("");
        $('<option value="cdn_domain">'+cdn_domain+'</option>').appendTo('#purge_domain');
        selectbox_design($("#purge_domain"));
        dlgForm.find("#hardPurgeUse").prop("checked", false);
        
        // 팝업 주의사항 보기
        dlgForm.find("#purgePreCautions").unbind("click").bind("click" , precautionToggle);
            
    
        function precautionToggle(){
            dlgForm.find("#purgePreCautions").toggleClass("on");
            dlgForm.find("#purgePreCautionsArea").toggleClass("on");
        }
        
        dlgForm.find($("#purge_type li span")).unbind("click").bind("click", purgeTypeClick1);
    
        function purgeTypeClick1(){
            dlgForm.find("#purge_file").val("");
            $("#purge_type li span").each(purgeTypeClickSub);
            $(this).addClass('on');
            if($(this).attr('value') == "0"){
                dlgForm.find("#purgeURLarea").hide();
            }else{
                dlgForm.find("#purgeURLarea").show();
            }
        }
    
        function purgeTypeClickSub(){
            $(this).removeClass('on');
        }
         
        dlgForm.find("#btn_PurgeCancel_TOP").unbind("click").bind("click", cancelTopPurgePop);
        dlgForm.find("#btn_PurgeCancel").unbind("click").bind("click", cancelTopPurgePop);
    
        function cancelTopPurgePop(){
            dlgForm.dialog("close");
        }
        
        $("#purge_file").keyup(function (e){
            var content = $(this).val();

            if(content.length>5000){
                $(this).val(content.substring(0,5000));
                showCommonNoLangErrorMsg("", "최대 5000자 이내로 입력 가능합니다.");
                return;
            }
        });
        
        dlgForm.find("#btn_PurgeOk").unbind("click").bind("click", purgeOK); 
        function purgeOK(){
            var purgeurl = dlgForm.find("#purge_file").val();
            var purge_type =null;
            $("#purge_type li span").each(getPurgeType);
            function getPurgeType(){
                if($(this).hasClass('on')){
                    purge_type = $(this).attr('value');
                }
            }
            var hard_purge_yn = $("#hardPurgeUse").is(":checked");
            
            if(purge_type == "1"){
                //파일지정 선택
                if (purgeurl == "") {
                    showCommonNoLangErrorMsg("파일명 확인", "파일명을 입력해주세요.");
                    return;
                }

// * 입력 불가 삭제 - 2023 05 11 (이나리 대리 요청)               
//                if(purgeurl != ""){
//                    if(!CheckPurgeFile(purgeurl)){
//                        showCommonNoLangErrorMsg("파일명 확인", "'*'은 입력 불가합니다.");
//                        return;
//                    }
//                }
                purge_type = "no";
            }else{
                purge_type = "yes";
            }
            
            if(!hard_purge_yn){
                hard_purge_yn = "no";
            }else{
                hard_purge_yn = "yes";
            }
            
            var userurl = "";
            var purge_arr = purgeurl.split("\n");
            
            if(purge_arr.length > 30){
                showCommonNoLangErrorMsg("", "URL단위 Purge시, 한번에 최대 30개 파일입력 가능합니다.");
                return;
            }
            
            $("#purge_OkUrl").empty();
            $("#purge_FailUrl").empty();
            
            for (var p = 0; p < purge_arr.length; p++) {
                var temp_arr = purge_arr[p].split(".");

//----- Start 2011. 10. 18 commented by shcho
                 var temp = null;
                              
                if(temp_arr.length >= 2) {
                    temp = temp_arr[temp_arr.length-1].toLowerCase();
                }
                
//----- Start 2011. 10. 18 commented by shcho
                
                //스트리밍, 다운로드 모두 같은 url 전송
                userurl =userurl + purge_arr[p];
                
                if (purge_arr.length > p+1){
                    userurl = userurl +",";
                }
            }
            
            // purge API svc_type 필수값 추가
            urlOkNm = "";
            dlgForm.dialog("close");
            var success_msg = selectedRow.data("svc_name") + " purge 시작";
            add_noti_message("/console/d/osadvcdnlist", success_msg);
            process_toast_popup("CDN", success_msg, true);
            
            var params = {command : "purgeCdn2" , id : svc_id, hardPurge: hard_purge_yn, purgeAll : purge_type, filelist : userurl};
            $.ajax({
                url : "/cdnSvc"
                , type : "POST"
                , data : params
                , dataType : "json"
                , success : function(json) {

                    if(json.status == "29") { /* IAM 사용자 정책 처리 */
                        commonErrorMessage("29");
                        return;
                    }
                    
                    if(json.status == '00'){
                        success_msg = selectedRow.data("svc_name") + " purge 성공";
                        add_noti_message("/console/d/osadvcdnlist", success_msg);
                        process_toast_popup("CDN", success_msg, true);
                        call_vmList();
                    }else{
                        success_msg = selectedRow.data("svc_name") + " purge 실패";
                        add_noti_message("/console/d/osadvcdnlist", success_msg);
                        process_toast_popup("CDN", success_msg, false);
                    }
                }
                ,error: function(XMLHttpResponse) {
                    success_msg = selectedRow.data("svc_name") + " purge 실패";
                    add_noti_message("/console/d/osadvcdnlist", success_msg);
                    process_toast_popup("CDN", success_msg, false);
                }
            });    
        }
    });
    
    $("#base_vmList").unbind("click").bind("click" , event_cdnClick);

    
    $("#sch_word").keypress(function(event) {
        if(event.keyCode == keycode_Enter) {
            event_vmSearch(event);
        }
    });    
    
    $("#button_vmSearch").unbind("click").bind("click" , event_vmSearch);
    
    
    $("#ssServer").unbind("change").bind("change" , function(e) {
        
        if(!($(this).find('option:selected').text().match("(Encoder)")) && onlyChar2($(this).find('option:selected').text())){
            $(this).find('option').each(function(){
                if($(this).text()==lastSelectedServerName) {
                    $(this).attr('selected','selected');
                }
            });
            showCommonNoLangErrorMsg("파일박스 선택 안내", "한글명 파일박스는 원본 컨텐츠 서버로 선택 하실 수 없습니다.");
            return;
        }
        lastSelectedServerName = $(this).find('option:selected').text();
    });

    $("#selectZcopy").unbind("change").bind("change" , function(e) {
        ssGetToken();
        ssList();
    });
    
    $("#ssServerZone").unbind("change").bind("change" , function(e) {
        var selz = $("#ssServerZone").val();
        $("#selectZcopy").val(selz);
        $("#selectZcopy").change();
    });
    
    $("#searchBtn").unbind("click").bind("click" , event_vmSearch);
}

function button_cdnDetail_event(e){
    e.preventDefault();
    if($(this).hasClass("action_disabled2")){
        return false;
    }
    event_cdnDetail(e);
}

// function call_vmList(){
//     showLoadingBox();    // 로딩중 이미지
    
//     var params = {};
    
//     params.command = "listCdn2";
//     params.group_mem_sq = group_mem_sq;

//     $.ajax({
//         url : "/cdnSvc"
//         , type : "POST"
//         , data : params
//         , dataType : "json"
//         , complete : function () {
//             hideLoadingBox();    // 로딩중 이미지 닫기
//         }
//         , success : function(json) {
//             if (json.status == "00") {
//                 var items = json.data;
//                 sort_items = items;
//                 itemSort();
//             }else{
//                 if(json.status == "99"){
//                     showCommonNoLangErrorMsg("CDN서비스 조회","CDN서비스 조회중 에러가 발생하였습니다."+ "<br />" +"관리자에게 문의하세요");
//                 }
//             }
                
//         }
//     });
// }
function ssGetToken(){

    var params    = {
            command        :     "getToken",
                zcopy : $("#selectZcopy").val(),
                group_mem_sq : group_mem_sq
        };
    $.ajax({
        url : "/ssSvc"
        , type : "POST"
        , data : params
        , dataType : "json"
        , async: false
        , success : function(json) {    
            if (json.XmlRoot.info.code != "9090" && json.XmlRoot.info.code != "90000") {
                orgUri = json.XmlRoot.info.storageUrl;
                orgUri = orgUri.replace("https", "http");
            }
        }
    });
}

/************************************************************************************************
 *     서버명 sort 처리 START - 최웅 (2013.04.22)
 ************************************************************************************************/
// 테이블 sort 이벤트
function evnet_sort(sort_id){
    var sort_img = $("#"+sort_id).find(".sort_img");
    
    if(sort_img.css("display") == "none"){
        $(".sort_img").css("display", "none");
        sort_img.show().css('display', '');
        
        itemSort('asc', sort_id);
    } else {
        if(sort_img.attr("src").indexOf("Table_Sort_Down.svg")>-1){
            itemSort('desc', sort_id);
        }
        else{
            itemSort('asc', sort_id);
        }
    }
}

/************************************************************************************************
 *     서버명 sort 처리 END
 ************************************************************************************************/
function event_cdnModify() {    
    var dlgForm = $("#cdnCreateArea");
    
    event_cdnDeploy();
    
    dlgForm.find(".cdnTitle").text('서비스 변경');
    dlgForm.find(".decoText").text('서비스 변경');
    dlgForm.find("#createCDN2").attr("id", "modifyCdn2").attr("onclick", "createCDN2('2')");
    dlgForm.find("#createCDN2Text").text("변경하기");
    
    //수정_step1_set
    var svc_type = selectedRow.data("svc_type");
    var svc_name = selectedRow.data("svc_name");
    var domain_type = selectedRow.data("useusersvcdomain");
    var domain_name = "";
    var sercret_key = selectedRow.data("token");
    var protocol = selectedRow.data("serviceprotocol");
    dlgForm.find("#create_step1_svcType").hide();
    dlgForm.find("#modify_step1_svcType").show();
    dlgForm.find("#create_step1_svcName").hide();
    dlgForm.find("#modify_step1_svcName").show();
    dlgForm.find("#step1_domainType").children('li').find('.stat').removeClass('on');
    dlgForm.find("#step1_sslType").children('li').find('.stat').removeClass('on');
    dlgForm.find("#modify_step1_svcName").text(svc_name);
    
    if(svc_type == "download"){
        //다운로드
        dlgForm.find("#modify_step1_svcType").text("다운로드");
        dlgForm.find("#step1_sslType_2").show();
        dlgForm.find("#cdnCreateArea_cors_div").show();
        $(".step4_download_div").show();
    }else{
        //스트리밍
        dlgForm.find("#modify_step1_svcType").text("스트리밍");
        dlgForm.find("#step1_sslType_2").hide();
        dlgForm.find("#cdnCreateArea_cors_div").hide();
        $(".step4_download_div").hide();
    }
    if(domain_type == "yes"){
        //고객 도메인 사용
        dlgForm.find("#step1_domainType [value='0']").addClass("on");
        dlgForm.find("#step1_custom_domains").show();
        if(selectedRow.data("svc_domain").length > 1){
            for(var i = 0; i < selectedRow.data("svc_domain").length; i++){
                if(i > 0){
                    domain_name += ",";
                }

                domain_name += selectedRow.data("svc_domain")[i];
            }
            dlgForm.find("#step1_custom_domains").val(domain_name);
        }else{
            dlgForm.find("#step1_custom_domains").val(selectedRow.data("svc_domain")[0]);
        }
    }else{
        //KT Cloud 도메인 사용
        dlgForm.find("#step1_domainType [value='1']").addClass("on");
        dlgForm.find("#step1_custom_domains").hide();
    }
    if(protocol == "HTTP"){
        dlgForm.find("#step1_sslType [value='0']").addClass("on");
    }else if(protocol == "HTTPS"){
        dlgForm.find("#step1_sslType [value='1']").addClass("on");
    }else{
        dlgForm.find("#step1_sslType [value='2']").addClass("on");
    }
    
    // if(selectedRow.data("certificate_name")){
    if(applyCertiData != null){
        if(domain_type != "yes"){
            dlgForm.find("#red_svn_dm").hide();
            dlgForm.find("#certificateArea").hide();
            dlgForm.find("#red_svn_ssl").hide();
            dlgForm.find("#txt_sel_certificate").val("");
        }else{
            dlgForm.find("#certificateArea").show();
            // dlgForm.find("#txt_sel_certificate").val(selectedRow.data("certificate_name"));
            dlgForm.find("#txt_sel_certificate").val(applyCertiData?.name);
        }
    }
    
    if(sercret_key){
        dlgForm.find("#token_access_controll1").addClass("on");
        dlgForm.find("#token_access_controll0").removeClass("on");
        dlgForm.find("#secretKey_box").html(sercret_key + "<a href='#' onclick=copy_to_clipboard('"+ sercret_key +"')> <img src='/images/coni/Table_Copy.svg' alt=''></a>");
    }else{
        dlgForm.find("#token_access_controll1").removeClass("on");
        dlgForm.find("#token_access_controll0").addClass("on");
    }
    
    if(selectedRow.data("description")){
        var svc_cmt = selectedRow.data("description");
        dlgForm.find("#step1_svcComment").val(svc_cmt.replace("[KT Cloud]",""));
    }
    
    //수정_step2_set
    dlgForm.find("#org_select").children('li').find('.stat').removeClass('on');
    dlgForm.find("#hostHd").children('li').find('.stat').removeClass('on');
    $("span[name=step2_modify_header]").removeClass('on');
    
    var cdn_type = selectedRow.data("cdntype");
    var origins     = selectedRow.data("org_addr");
    var origin_hostname     = selectedRow.data("org_name");
    
    var origin_http = selectedRow.data("originprotocol");
    var origin_http2 = selectedRow.data("usesslupstream");

    if(cdn_type == "direct"){
        dlgForm.find("#org_select [value='direct']").addClass("on");
        dlgForm.find("#cdnCreateArea_ss_div").hide();
        dlgForm.find("#cdnCreateArea_direct_div").show();
        dlgForm.find("#cdnCreateArea_direct_div1").show();
        dlgForm.find("#cdnCreateArea_direct_div2").show();
        dlgForm.find("#cdnCreateArea_direct_div3").show();
        if(origin_hostname != ""){
            dlgForm.find("#hostHd [value='ORIGIN_HOSTNAME']").addClass("on");
            dlgForm.find(".cdn_ori_host").show();
        }
        
        //http port 수정 불러오기
        if(svc_type == "download")
        {
            if(origin_http2 == "no")
            {
                dlgForm.find("#http_select [value='https']").removeClass("on");
                dlgForm.find("#http_select [value='http']").addClass("on");
            }else{
                dlgForm.find("#http_select [value='http']").removeClass("on");
                dlgForm.find("#http_select [value='https']").addClass("on");
            }
        }else{
            if(origin_http == 0)
            {
                dlgForm.find("#http_select [value='https']").removeClass("on");
                dlgForm.find("#http_select [value='http']").addClass("on");
            }else{
                dlgForm.find("#http_select [value='http']").removeClass("on");
                dlgForm.find("#http_select [value='https']").addClass("on");
            }
        }
        
        var step1orgserverName = "";
        for(i=0; i<origins.length; i++){
            if(origin_hostname != ""){
                dlgForm.find("#originHN").val(origin_hostname);
                var orgName2 = origins[i];
                var orgName3 = orgName2.split(':');
                var orgName4 = "";
                
                if(orgName2.indexOf('/') != -1){
                    orgName4 = orgName3[1].split('/');
                    dlgForm.find("#http_port").val(orgName4[0]);

                    var path = "";
                    for (let i = 1; i < orgName4.length; i++) {
                        path += '/' + orgName4[i];
                    }
                    dlgForm.find("#originsPath").val(path);
                }else{
                    dlgForm.find("#http_port").val(orgName3[1]);
                }
                if(i == 0){
                    step1orgserverName = orgName3[0];
                }else{
                    step1orgserverName = step1orgserverName + "," + orgName3[0];
                }
            }else{
                dlgForm.find("#hostHd [value='REQUEST_HOST_HEADER']").addClass("on");
                var orgName5 = origins[i].split(':');
                var orgName6 = "";
                var orgName7 = "";
                if(origins[0].indexOf('/') != -1){
                    orgName7 = orgName5[1].split('/');
                    orgName6 = origins[0].split('/');
                    dlgForm.find("#http_port").val(orgName7[0]);

                    var path = "";
                    for (let i = 1; i < orgName6.length; i++) {
                        path += '/' + orgName6[i];
                    }
                    dlgForm.find("#originsPath").val(path);
                }else{
                    dlgForm.find("#http_port").val(orgName5[1]);
                }
                if(i == 0){
                    step1orgserverName = orgName5[0];
                }else{
                    step1orgserverName = step1orgserverName + "," + orgName5[0];
                }
            }
        }
        dlgForm.find("#step1_org_serverName").val(step1orgserverName);
    }else{
        dlgForm.find("#org_select [value='ss']").addClass("on");
        dlgForm.find("#cdnCreateArea_ss_div").show();
        dlgForm.find("#cdnCreateArea_direct_div").hide();
        dlgForm.find("#cdnCreateArea_direct_div1").hide();
        dlgForm.find("#cdnCreateArea_direct_div2").hide();
        dlgForm.find("#cdnCreateArea_direct_div3").hide();
        if(cdn_type == "storage"){
            $("#ssServerZone").val("3");
        }else{
            $("#ssServerZone").val("1");
        }
        needSsSelect = true;
        $("#ssServerZone").change();
    }
 
    if(selectedRow.data("addoriginrequestheaders")){
		let temp_add_origin_request_headers = {};
		if(selectedRow.data("addoriginrequestheaders")){
		selectedRow.data("addoriginrequestheaders").forEach((item) => {
			
			
			let base_modify_header = $("#base_modify_header").clone().show();
			let base_modify_header_step5 = $("#step5_modify_header_base").clone().attr('id', item.split(":")[0]).show(); // 최종화면
			let modify_header_action = "";
		
		
			$("#step2_modify_header_name").val('');
			$("#step2_modify_header_value").val('');
			
			if(item.split(":")[1] === ''){
				modify_header_action = 'DELETE';
			}else {
				modify_header_action = 'ADD/MODIFY';
			}
			base_modify_header.find("#text_step2_modify_header_action").text(modify_header_action);
			base_modify_header.find("#text_step2_modify_header_name").text(item.split(":")[0]);
			base_modify_header.find("#text_step2_modify_header_value").text(item.split(":")[1]);
			
			base_modify_header_step5.find("#base_action").text(modify_header_action);
			base_modify_header_step5.find("#base_name").text(item.split(":")[0]);
			base_modify_header_step5.find("#base_value").text(item.split(":")[1]);
			
			base_modify_header.find(".tablessh").bind("click", function() {
//				let text_header_name = $(this).parent().parent().find("#text_step2_modify_header_name").text();
				delete add_origin_request_headers[item.split(":")[0]];
				$(this).parent().parent().remove();
				$("#step5_modify_header_step2_div").find("#" + item.split(":")[0]).remove();
			});
			$("#step5_modify_header_base").before(base_modify_header_step5);
			$("#base_modify_header").before(base_modify_header);
			
			
			temp_add_origin_request_headers[item.split(":")[0]] = item.split(":")[1];
		});
		
		add_origin_request_headers = temp_add_origin_request_headers;
		}
		
		dlgForm.find("#step2_modify_header1").addClass("on");
		$("#step2_modify_header_div").show();
	}else {
		dlgForm.find("#step2_modify_header2").addClass("on");
		$("#step2_modify_header_div").hide();
		
	}
    
    //수정 _ step3_set
//    dlgForm.find("#positive_ttl").children('li').find('.stat').removeClass('on');
    $("span[name=query_para]").removeClass('on');
    $("span[name=compression]").removeClass('on');
    $("span[name=referer_set]").removeClass('on');
    
    dlgForm.find("#caching_option").children('li').find('.stat').removeClass('on');
    var positive_ttl = selectedRow.data("cachettl");
    var query_param_type = selectedRow.data("ignoreqeury");
    var mile_type = selectedRow.data("gzip");
    var refer_type = selectedRow.data("referers");
    
    let remove_origin_cache_control_headers = selectedRow.data("removeorigincachecontrolheader");

    if(['yes', 'true'].includes(remove_origin_cache_control_headers)){
		dlgForm.find("#caching_option [value='1']").addClass("on");
	}else {
		dlgForm.find("#caching_option [value='0']").addClass("on");
	}

    let negative_ttl = selectedRow.data("negativettl");
    var text_refer = ""
    if(selectedRow.data("referers").length > 0){
        referer_chk = true;
        for(i = 0; i < selectedRow.data("referers").length; i++){
            if(i === 0){
                text_refer += selectedRow.data("referers")[i];
            }else{
                text_refer += "\n" + selectedRow.data("referers")[i];
            }
        }
    }
    dlgForm.find("#positive_ttl").val(positive_ttl);
    selectbox_design($("#positive_ttl"));
//    if(positive_ttl == "3600"){
//        dlgForm.find("#positive_ttl [value='0']").addClass("on");
//    }else if(positive_ttl == "21600"){
//        dlgForm.find("#positive_ttl [value='1']").addClass("on");
//    }else if(positive_ttl == "43200"){
//        dlgForm.find("#positive_ttl [value='2']").addClass("on");
//    }else if(positive_ttl == "86400"){
//        dlgForm.find("#positive_ttl [value='3']").addClass("on");
//    }else if(positive_ttl == "604800"){
//        dlgForm.find("#positive_ttl [value='4']").addClass("on");
//    }else if(positive_ttl == "2592000"){
//        dlgForm.find("#positive_ttl [value='5']").addClass("on");
//    }
    
    $("#negative_ttl").val(negative_ttl);
    if(svc_type == "download"){
        dlgForm.find("span[name=query_para]").attr("disabled", false);
        dlgForm.find("span[name=query_para]").removeClass("disck");
        dlgForm.find("span[name=compression]").attr("disabled", false);
        dlgForm.find("span[name=compression]").removeClass("disck");
        dlgForm.find("span[name=referer_set]").attr("disabled", false);
        dlgForm.find("span[name=referer_set]").removeClass("disck");
        if(query_param_type == "no"){
            dlgForm.find("span[name=query_para][data-value='INCLUDE_ALL_ALPHABETIZE_ORDER']").addClass('on');
        }else{
            dlgForm.find("span[name=query_para][data-value='IGNORE_ALL']").addClass('on');
        }
        if(mile_type == "no"){
            dlgForm.find("span[name=compression][data-value='false']").addClass('on');
        }else{
            dlgForm.find("span[name=compression][data-value='true']").addClass('on');
        }
        if(refer_type[0].length > 0){
            dlgForm.find("span[name=referer_set][data-value='0']").addClass('on');
            dlgForm.find("#referer_area").show();
            dlgForm.find("#referers").val(text_refer);
            referer_chk = true;
            dlgForm.find("span[name=non_exist_referer_set]").removeClass('on');
            dlgForm.find("span[name=non_exist_referer_set][data-value='0']").addClass('on');
            dlgForm.find("#allow_non_exist_referer").show();
        }else{
            dlgForm.find("span[name=referer_set][data-value='1']").addClass('on');
            dlgForm.find("#referers").val("");
            dlgForm.find("#referer_area").hide();
            dlgForm.find("#allow_non_exist_referer").hide();
        }
    }else{
        $("span[name=query_para]").removeClass('on');
        $("span[name=compression]").removeClass('on');
        $("span[name=referer_set]").removeClass('on');
        dlgForm.find("span[name=query_para]").addClass("disck");
        dlgForm.find("span[name=query_para][data-value='IGNORE_ALL']").addClass('on');
        dlgForm.find("span[name=query_para]").attr("disabled", true);
        dlgForm.find("span[name=compression]").addClass("disck");
        dlgForm.find("span[name=compression][data-value='false']").addClass('on');
        dlgForm.find("span[name=compression]").attr("disabled", true);
        if(refer_type[0].length > 0){
            dlgForm.find("span[name=referer_set][data-value='0']").addClass('on');
            dlgForm.find("#referer_area").show();
            dlgForm.find("#referers").val(text_refer);
            dlgForm.find("span[name=non_exist_referer_set]").removeClass('on');
            dlgForm.find("span[name=non_exist_referer_set][data-value='0']").addClass('on');
            dlgForm.find("#allow_non_exist_referer").show();
        }else{
            dlgForm.find("span[name=referer_set][data-value='1']").addClass('on');
            dlgForm.find("#referers").val("");
            dlgForm.find("#referer_area").hide();
            dlgForm.find("#allow_non_exist_referer").hide();
        }
    }
    
    //수정 _ step4_set
    $("span[name=ip_access_controll]").removeClass('on');
    $("span[name=geo_access_controll]").removeClass('on');
    
    dlgForm.find("#allow_http_method").children('li').find('.stat').removeClass('on');
    dlgForm.find("#corsSet").children('li').find('.stat').removeClass('on');
    dlgForm.find("#step4_modify_header").children('li').find('.stat').removeClass('on');
    
    if(selectedRow.data("addclientresponseheaders")){
	    let temp_add_client_response_headers = {};
		selectedRow.data("addclientresponseheaders").forEach((item) => {
			
			
			
			let base_modify_header = $("#step4_base_modify_header").clone().show();
			let base_modify_header_step5 = $("#step5_modify_header2_base").clone().attr('id', item.split(":")[0]).show(); // 최종화면
			let modify_header_action = "";
			
			
			$("#step4_modify_header_name").val('');
			$("#step4_modify_header_value").val('');
			
			
			if(item.split(":")[1] === '') {
				modify_header_action = 'DELETE';
				
			}else {
				modify_header_action = 'ADD/MODIFY';
			}
			
			base_modify_header.find("#text_step4_modify_header_action").text(modify_header_action);
			base_modify_header.find("#text_step4_modify_header_name").text(item.split(":")[0]);
			base_modify_header.find("#text_step4_modify_header_value").text(item.split(":")[1]);
			
			base_modify_header_step5.find("#base_action").text(modify_header_action);
			base_modify_header_step5.find("#base_name").text(item.split(":")[0]);
			base_modify_header_step5.find("#base_value").text(item.split(":")[1]);
			
			base_modify_header.find(".tablessh").bind("click", function() {
	//			let text_header_name = $(this).parent().parent().find("#text_step4_modify_header_name").text();
				delete add_client_response_headers[item.split(":")[0]];
				$(this).parent().parent().remove();
				$("#step5_modify_header_step4_div").find("#" + item.split(":")[0]).remove();
			});
			$("#step5_modify_header2_base").before(base_modify_header_step5);
			$("#step4_base_modify_header").before(base_modify_header);
			
			
			temp_add_client_response_headers[item.split(":")[0]] = item.split(":")[1];
			
			
		});
		add_client_response_headers = temp_add_client_response_headers;
	}
	
	
    let allow_http_method = selectedRow.data("allowhttpmethod");
    let allow_country_list = selectedRow.data("allowcountrylist");
    let deny_country_list = selectedRow.data("denycountrylist");
    let allow_ip_list = selectedRow.data("allowiplist");
    let deny_ip_list = selectedRow.data("denyiplist");
    let cors_allow_origin = selectedRow.data("cors");
    
    
    if(allow_http_method.includes(item => item === "POST")){
		dlgForm.find("#allow_http_method [value='post']").addClass("on");
	}else {
		dlgForm.find("#allow_http_method [value='none_post']").addClass("on");
	}
    
    if(cors_allow_origin === "*"){
		dlgForm.find("#corsSet [value='CORS_ALLOW_ORIGIN']").addClass("on");
	}else {
		dlgForm.find("#corsSet [value='CORS_NOT_ALLOW_ORIGIN']").addClass("on");
	}
    
    if(Object.keys(add_origin_request_headers).length > 0){
		dlgForm.find("#step4_modify_header [value='1']").addClass("on");
		$("#step4_modify_header_div").show();
	}else {
		dlgForm.find("#step4_modify_header [value='0']").addClass("on");
		$("#step4_modify_header_div").hide();
	}

	let ip_list = allow_ip_list.length > 0 ? allow_ip_list : deny_ip_list;
	if (ip_list.length > 0) {
		let ip_list_text = "";
		ip_list.forEach((item, index) => {
			ip_list_text += item;
            if (index < ip_list.length -1) {
                ip_list_text += '\n';
            }
		});
		$("#ip_access_controll_text_area").val(ip_list_text);
		$("#ip_access_controll_div").show();
	} else {
		$("#ip_access_controll_div").hide();
	}
	
	if (allow_ip_list.length > 0) {
        $("#ip_access_controll0").addClass('on');
		$("#ip_access_controll2").addClass('on');
	} else if (deny_ip_list.length > 0) {
        $("#ip_access_controll0").addClass('on');
		$("#ip_access_controll3").addClass('on');
	} else {
		$("#ip_access_controll1").addClass('on');
	}
	
	
	country_list = allow_country_list.length > 0 ? allow_country_list :  deny_country_list;
	
	if(country_list.length > 0){
		country_list.forEach((item) => {
			$("#geo_access_controll_div").show();
			let code_base = $("#geo_country_code_base").clone().show();
			code_base.find("#country_code_text").text(item);
			
			code_base.find("img").bind("click", function(){
				let span_country_code = $(this).parent().parent().find("#country_code_text").text();
				let reomve_index = country_list.indexOf(country_list.find(item2 => item2 === span_country_code));
	            country_list.splice(reomve_index, 1);
	            
				$(this).parent().parent().remove();
			});
			$("#geo_country_code_div").append(code_base);
		});
		
	}else {
		$("#geo_access_controll_div").hide();
	}
	
	if(allow_country_list.length > 0){
		$("#geo_access_controll2").addClass('on');
	}else if(deny_country_list.length > 0) {
		$("#geo_access_controll3").addClass('on');
	}else {
		$("#geo_access_controll1").addClass('on');
	}
}


function event_cdnModify_ssSelect() {
    var SSList    = document.getElementById("ssServer");
    var a = $("#text_OrgSvrName").text();
    var b = a.split(' (');
    for(var i =0; i<SSList.length; i++)
    {
        if(trim(SSList.options[i].text) == b[0]){
            $("#update_ssServer option:eq('" + i + "')").attr("selected", "selected");
            lastSelectedServerName_update =         b[0];
            SSList.selectedIndex = i;
            break;
        }
            
    }
}

function event_callCdnModify(params) {
    
    $("#cdnModifyArea").hide()
    $("#cdnContentArea").show()
    $("#cdn_update_step2").dialog("close");
    
    showLoadingBox();    // 로딩중 이미지
    
    params.command = "update";
    params.group_mem_sq = group_mem_sq;
    
    $.ajax({
        url : "/cdnSvc"
        , type : "POST"
        , data : params
        , dataType : "json"
        , complete : function () {
            hideLoadingBox();    // 로딩중 이미지 닫기
        }
        , success : function(json) {
            if (json.XmlRoot.info.code == "1000") {
                var update_success = $("#cdn_update_success");
                update_success.dialog("open");
                
                update_success.find("#btnCdnUpdateSuccessClose").unbind("click").bind("click", function(e) {
                    update_success.dialog("close");
                });
                window.location.reload();
                return;
            }else if(json.XmlRoot.info.code == "5001"){
                showCommonNoLangErrorMsg("CDN서비스 정보 수정 실패","CDN서비스를 정보 수정중 에러가 발생하였습니다."+ "<br />" +json.XmlRoot.info.msg);
                return;                
            }
            else{
                showCommonNoLangErrorMsg("CDN서비스 정보 수정 실패","CDN서비스를 정보 수정중 에러가 발생하였습니다."+ "<br />" +json.XmlRoot.info.msg);
            }
                
        }
    });
}

function event_cdnDetail(e)
{
    e.preventDefault();
        commonDialogInit($("#dialog_CDN_Detail"));
        $("#dialog_CDN_Detail").dialog("open");
        $("#dialog_CDN_Detail").find("#button_CDN_Detail_TopClose").unbind("click").bind("click" , closeDetailPop);
        function closeDetailPop(){
            $("#dialog_CDN_Detail").dialog("close");
        }
}

function cdnCreateStep1(){
    for(var i=1;i<6;i++){
        $("#cdn_service_create_step"+i).hide();
    }
    $("#cdn_service_create_step1").show();
}

function cdnCreateStep2(){
    if(check_input_step1()){
        for(var i=1;i<6;i++){
            $("#cdn_service_create_step"+i).hide();
        }
        $("#cdn_service_create_step2").show();
    }
}

function cdnCreateStep3(){
    if(check_input_step2()){
        for(var i=1;i<6;i++){
            $("#cdn_service_create_step"+i).hide();
        }
        $("#cdn_service_create_step3").show();
    }
}

function cdnCreateStep4(){
	  if (check_input_step3()) {
          for(var i=1;i<6;i++){
            $("#cdn_service_create_step"+i).hide();
          }
      }

      // Referer 기반 접근제어 메시지 변경
      let str = null;
      if ($("#step1_svcType").find(".on").attr("value") === "1") { // 스트리밍 서비스 유형
          str = "지정된 도메인만 제공하도록 허용할 Referer를 추가합니다.\n(숫자,영문자,특수문자 '/', '-', '.'만 허용\n여러개 입력시 줄바꿈으로 구분하세요.)";
      } else { // 다운로드 서비스 유형
          str = "지정된 도메인만 제공하도록 허용할 Referer를 추가합니다.\n(숫자,영문자,특수문자 '/', '*', '-', '.'만 허용\n여러개 입력시 줄바꿈으로 구분하세요.)";
      }

      // 수정 시 method 설정(선택한 메소드로 표시)
      if (selectedRow !== '' && selectedRow.data("allowhttpmethod").length === 4) {
          $("#method_post").addClass('on');
          $("#method_none_post").removeClass('on');
      }

      // Referer 차단시 UI 설정
      if (selectedRow !== '' && selectedRow.data("noneexist_referer") === "no") {
          $("#non_exist_referer_off").addClass('on');
          $("#non_exist_referer_on").removeClass('on');
      }

      $("#referers").attr("placeholder", str);
      $("#cdn_service_create_step4").show();
      getCountryCode();
}

function cdnCreateStep5(){
    if(check_input_step4()){
        for(var i=1;i<6;i++){
            $("#cdn_service_create_step"+i).hide();
        }
        $("#cdn_service_create_step5").show();
    }
    
      
        
        var dlgForm = $("#cdn_service_create_step5");
        var http_chk ="";
        
        if($("#create_step1_svcName").attr('style')){
            if($("#create_step1_svcName").attr('style').indexOf('none') == -1){
                dlgForm.find("#step4_svcType").text($("#step1_svcType").find(".on").text());                
                dlgForm.find("#step4_svcName").text($("#step1_svcName").val());
            }else{
                dlgForm.find("#step4_svcType").text($("#modify_step1_svcType").text());                    
                dlgForm.find("#step4_svcName").text($("#modify_step1_svcName").text());        
            }
        }else{
            dlgForm.find("#step4_svcType").text($("#step1_svcType").find(".on").text());                
            dlgForm.find("#step4_svcName").text($("#step1_svcName").val());    
        }
        
        if($("#http_select").find(".on").attr("value") == "http"){
            http_chk = "(HTTP)";
        }else if($("#http_select").find(".on").attr("value") == "https"){
            http_chk = "(HTTPS)";
        }
        
        if($("#step1_domainType").find(".on").attr("value") == "0"){
            dlgForm.find("#step4_domainType").text("고객도메인("+$("#step1_custom_domains").val()+")");            
        }else{
            dlgForm.find("#step4_domainType").text("KT Cloud 도메인");
        }
        dlgForm.find("#step4_sslType").text($("#step1_sslType").find(".on").text());            
        if ($("#token_access_controll1").hasClass("on")) {
            dlgForm.find("#step4_secretKey").text("사용("+ trim($("#secretKey_box").text()) +")");
        }else{
            dlgForm.find("#step4_secretKey").text("사용 안 함");
        }
        if($("#org_select").find(".on").attr("value") == "direct"){
            dlgForm.find("#step4_org_select").hide();
            dlgForm.find("#step4_ssServer").hide();
            dlgForm.find("#step4_org_serverName").show();
            dlgForm.find("#step4_http_port").show();
            dlgForm.find("#step4_originsPath").show();
            dlgForm.find("#step4_hostHeader").show();
            dlgForm.find("#step4_org_serverName").text($("#step1_org_serverName").val());
            dlgForm.find("#step4_http_port").find(".b").text(http_chk + $("#http_port").val());
            if($("#originsPath").val() == ""){
                dlgForm.find("#step4_originsPath").hide();                
            }else{
				dlgForm.find("#step4_originsPath").show();
                dlgForm.find("#step4_originsPath").find(".b").text($("#originsPath").val());    
            }
            if($("#hostHd").find(".on").attr("value") == "REQUEST_HOST_HEADER"){
                dlgForm.find("#step4_hostHeader").find(".b").text("Incoming Host Header");
            }else{
//                dlgForm.find("#step4_hostHeader").text("Origin Hostname(" + $("#originHN").val() + ")");
                dlgForm.find("#step4_hostHeader").find(".b").text("Origin Hostname");
            }
        }else{
            dlgForm.find("#step4_org_select").show();
            dlgForm.find("#step4_ssServer").show();
            dlgForm.find("#step4_org_serverName").hide();
            dlgForm.find("#step4_http_port").hide();
            dlgForm.find("#step4_originsPath").hide();
            dlgForm.find("#step4_hostHeader").hide();
            dlgForm.find("#step4_ssServer").text("("+$("#ssServerZone option:selected").text()+") " + $("#ssServer option:selected").text());
        }
        
        if($("#step2_modify_header1").hasClass('on')){
	        dlgForm.find("#step5_modify_header_step2").text('사용');
	        $("#step5_modify_header_step2_div").show();
		}else {
	        dlgForm.find("#step5_modify_header_step2").text('사용 안 함');
	        $("#step5_modify_header_step2_div").hide();
			
		}
        
        
        if($("#caching_option").find(".on").attr("value") === '0'){
			$("#step5_caching_option").text("원본 서버의 Cache Control 헤더 우선");
		}else {
			$("#step5_caching_option").text("CDN 캐싱 설정 우선");
		}
		
        dlgForm.find("#step4_positive_ttl").text($("#positive_ttl").val());
        dlgForm.find("#step4_negative_ttl").text($("#negative_ttl").val());
        
        var query_para_val = null;
        $("span[name=query_para]").each(checkQueryPara2);
        function checkQueryPara2(){
            if($(this).hasClass('on')){
                query_para_val = $(this).attr('data-value');
            }
        }
        if(query_para_val == "IGNORE_ALL"){
            dlgForm.find("#step4_query_para").text("사용");
        }else{
            dlgForm.find("#step4_query_para").text("사용 안 함");            
        }
        
        var compression_val = null;
        $("span[name=compression]").each(checkcompression);
        function checkcompression(){
            if($(this).hasClass('on')){
                compression_val = $(this).attr('data-value');
            }
        }
        if(compression_val == "true"){
            dlgForm.find("#step4_compression").text("사용");
        }else{
            dlgForm.find("#step4_compression").text("사용 안 함");            
        }
        
        var referer_set_val = null;
        $("span[name=referer_set]").each(checkReferSet3);
        function checkReferSet3(){
            if($(this).hasClass('on')){
                referer_set_val = $(this).attr('data-value');
            }
        }
        
        var non_exist_refer_set_val = null;
        $("span[name=non_exist_referer_set]").each(checkNonExistReferSet);
        function checkNonExistReferSet(){
            if($(this).hasClass('on')){
                non_exist_refer_set_val = $(this).attr('data-value');
            }
        }
        
        if(referer_set_val == "0"){
            dlgForm.find("#step4_referer_set").text("사용");
            $("#step4_non_exist_referer_tr").show();
            $("#step4_referer_input").val($("#referers").val());
            if(non_exist_refer_set_val == "0"){
                dlgForm.find("#step4_non_exist_referer").text("허용");
            }else {
                dlgForm.find("#step4_non_exist_referer").text("차단");
            }

        }else{
            dlgForm.find("#step4_referer_set").text("사용 안 함");            
            $("#step4_non_exist_referer_tr").hide();
        }
//        $("#cdn_service_create_step4").show();
		
		
        var coreSet = $("#corsSet").find(".on").text();
        if (coreSet === '사용 안함') {
            $("#step4_cors").text('사용 안 함');
        } else {
            $("#step4_cors").text(coreSet);
        }
        
		if($("#allow_http_method").find(".on").attr("value") === "none_post"){
			$("#step5_allow_http_method").text("GET, HEAD, OPTIONS");
		}else {
			$("#step5_allow_http_method").text("GET, HEAD, OPTIONS, POST");
		}
		
		
		$("#step5_ip_access_controll_text").val($("#ip_access_controll_text_area").val());
		if($("#ip_access_controll1").hasClass('on')){
			$("#step5_ip_access_controll").text("사용 안 함");
			$("#step5_ip_access_controll_text").hide();
		}else if($("#ip_access_controll2").hasClass('on')) {
			$("#step5_ip_access_controll").text("허용");
			$("#step5_ip_access_controll_text").show();
		}else {
			$("#step5_ip_access_controll").text("차단");
			$("#step5_ip_access_controll_text").show();
		}
		
		$("#step5_geo_access_controll_text").val(country_list);
		if($("#geo_access_controll1").hasClass('on')){
			$("#step5_geo_access_controll").text("사용 안 함");
			$("#step5_geo_access_controll_text").hide();
		}else if($("#geo_access_controll2").hasClass('on')) {
			$("#step5_geo_access_controll").text("허용");
			$("#step5_geo_access_controll_text").show();
		}else {
			$("#step5_geo_access_controll").text("차단");
			$("#step5_geo_access_controll_text").show();
		}
		
		if($("#step4_modify_header").find(".on").attr("value") === '1'){
	        dlgForm.find("#step5_modify_header_step4").text('사용');
	        $("#step5_modify_header_step4_div").show();
		}else {
	        dlgForm.find("#step5_modify_header_step4").text('사용 안 함');
	        $("#step5_modify_header_step4_div").hide();
			
		}
        
        dlgForm.find("#step5_modify_header_step4").text('사용 안 함');
        dlgForm.find("#step4_cdnCerti").text($("#txt_sel_certificate").val());
		
    }

    

function check_input_step1(){
    var svcDomainType     = $("#step1_domainType").find(".on").attr("value");
    var svcSSLType      = $("#step1_sslType").find(".on").attr("value");
    var svcCerticicateNm = $("#txt_sel_certificate").val();
    
    if(!svcNm_chk){
        $("#red_svn_nm").show().css("display","");
        $("#step1_svcName").attr('required', true);
        $("#step1_svcName").focus();
        return false;
    }
    
    //고객도메인사용시 check
    if(svcDomainType == "0"){
        if(!svcDm_chk){
            $("#red_svn_dm").show().css("display","");
            $("#step1_custom_domains").attr('required', true);
            $("#step1_custom_domains").focus();
            return false;
        }
        
        //ssl Tpye 선택
        if(svcSSLType != "0"){
            if(!svcCerticicateNm.length > 0 ){
                $("#red_svn_ssl").show().css("display","");
                $("#txt_sel_certificate").attr('required', true);
                return false;
            }
        }
    }

    // 수정화면인지 여부 확인
    if ($("#modify_step1_svcType").is(":visible")) {
        modifyYn = true;
    }
    
    return true;
}

function check_input_step2(){
    var dlgForm = $("#cdnCreateArea");
    var SSList = $("#ssServer").val();
    var org_sel2    = $("#org_select").find(".on").attr("value");
    var hostHeaderVal = $("#hostHd").find(".on").attr("value");
    
    var checkOriginCnt = $("[id^=addOriginsArea_]").length;
    
    if (checkOriginCnt == 0) {
        //오리진설정이 1개인 경우
        if (org_sel2 == "ss") {
            //오리진위치 KT Cloud Storage 선택
            if (SSList.length == 0 || SSList == "목록 없음") {
                showCommonNoLangErrorMsg("입력값 에러", "파일박스를 선택해주세요.");
                return false;
            }
            dlgForm.find("#ssServerZone_last").text($("#ssServerZone option:selected").text());
            dlgForm.find("#ssServer_last").text($("#ssServerZone option:selected").text());

            // 오리진위치 직접입력의 input 값 초기화
            dlgForm.find("#originsPath").val("");
            dlgForm.find("#step1_org_serverName").val("");
            dlgForm.find("#http_port").val("");
            dlgForm.find("#originHN").val("");

            // Modify Header 체크
            if ($("#step2_modify_header1").hasClass('on') && $("#modify_header_insert tr").length <= 1) {
                $("#modify_header_text_area").show();
                $("#modify_header_red_text").text("필수입니다.");
                return false;
            } else {
                $("#modify_header_text_area").hide();
            }
        }else{
            if (CheckChar($("#step1_org_serverName").val()) && $("#step1_org_serverName").val() !== '') {org_svcNm_chk = true;}
            if(!org_svcNm_chk){
                $("#red_org_svn_nm").show().css("display","");
                $("#step1_org_serverName").attr('required', true);
                return false;
            }
            //Port check
            if(!http_port_chk){
                $("#http_red_text_area").show().css("display","");
                $("#http_port").attr('required', true);
                return false;
            }
            
            //호스트 헤더의 전달
            if(hostHeaderVal == "ORIGIN_HOSTNAME"){
                if(!ori_hostNm_chk){
//                    $("#orgHN_text_area").show().css("display","");
//                    $("#originHN").attr('required', true);
//                    return false;
                }
            }

            // Modify Header 체크
            if ($("#step2_modify_header1").hasClass('on') && $("#modify_header_insert tr").length <= 1) {
                $("#modify_header_text_area").show();
                $("#modify_header_red_text").text("필수입니다.");
                return false;
            } else {
                $("#modify_header_text_area").hide();
            }
        }
    }

		//오리진 경로
	let originsPath = $("#originsPath").val();
    let originsPath_length = originsPath.length;
    if (originsPath.substring(originsPath_length-1, originsPath_length) === "/") {
		$("#origin_path_text_area").show();
		$("#originsPath").attr('required', true);
		return false;
	}else {
		$("#origin_path_text_area").hide();
		$("#originsPath").attr('required', false);
	}

	
	
    return true;
}

function check_input_step3(){ // 캐싱설정 유휴성
    var dlgForm = $("#cdnCreateArea");
    var caching = $("#negative_ttl").val();
    var isNumber = /^[0-9]+$/.test(caching);

    if (isNumber && caching <= 86400) {
        caching_chk = true;
    } else {
        $("#cachingWarning").text("값을 확인해주세요")
        $("#cachingWarning").show();
    }

    if (!caching_chk) {
        return false;
    }

	if(!dlgForm.find("#negative_ttl").val()) {
		$("#negative_ttl").attr('required', true);
		return false;
	}else {
		$("#negative_ttl").attr('required', false);
	}
	
    return true;
}

function check_input_step4(){ //뷰어설정 유효성
    var dlgForm = $("#cdnCreateArea");
    var referCheckType = null;
    var ipCheckType = null;
    var geoCheckType = null;
    
    dlgForm.find("span[name=referer_set]").each(function(i,e){
        if($(this).hasClass('on')){
            referCheckType = $(this).attr('data-value');
        }
    });
    
    if(referCheckType === "0"){
        if(!referer_chk){
            $("#referer_text_area").show().css("display","");
            $("#referers").attr('required', true);

            if ($("#referers").val() ==="") {
                $("#referer_red_text").text("필수입니다.");
                return false;
            }
            return false;
        }
        $("#referer_text_area").show().css("display","none");
    }

    // IP 기반 접근제어 유효성 검사(input value 여부)
    dlgForm.find("span[name=ip_access_controll]").each(function(i,e){
        if ($("#ip_access_controll1").hasClass('on')) {
            ipCheckType = $("#ip_access_controll1").attr('data-value');
        } else if ($(this).hasClass('on')) {
            ipCheckType = $(this).attr('data-value');
        }
    });

    if(ipCheckType === "1" || ipCheckType === "2"){
        let cidrValue = $("#ip_access_controll_text_area").val();
        cidrCheck(cidrValue);

        if (!ip_chk) {
            $("#ip_access_text_area").show().css("display","");
            $("#ip_access_controll_text_area").attr('required', true);

            if (cidrValue === "") {
                $("#ip_access_red_text").text("필수입니다.");
                return false;
            } else {
                $("#ip_access_red_text").text("IP주소 또는 CIDR 형식만 가능합니다.");
                return false;
            }
        }
        $("#ip_access_text_area").show().css("display","none");
    }

    // GEO 기반 접근제어 유효성 검사(input value 여부)
    if (geo_chk && $("#geo_country_code_div").find("p").length <= 1) {
        $("#geo_access_text_area").show().css("display","");
        $("#geo_access_red_text").text("필수입니다.");
        return false;
    } else {
        $("#geo_access_text_area").show().css("display","none");
    }

    // Modify Header 체크
    if ($("#step4_modify_header_div").css("display") !== "none" && $("#modify_header_client_insert tr").length <= 1) {
        $("#modify_header_client_text_area").show();
        $("#modify_header_client_red_text").text("필수입니다.");
        return false;
    } else {
        $("#modify_header_client_text_area").hide();
    }

    return true;
}

// 숫자, 영문자, -, ., 엔터만 입력가능 - Referer 스트리밍
function CheckRefer(str) {
    var pattern = /^[0-9a-zA-Z-/.\n]+$/;
    return pattern.test(str);
}

// 숫자, 영문자, *, -, ., 엔터만 입력가능 (단 *는 문자 맨앞, 맨뒤, 엔터 앞, 엔터 뒤만가능) - Referer 다운로드
function CheckReferDownload(str) {
    var pattern = /^[0-9A-Za-z/*\-.(\r\n)]*$/;
    if (pattern.test(str)) {
        // * 위치 체크
        const indexes = [];
        let i = -1;
        while ((i = str.indexOf('*', i + 1)) !== -1) {
            indexes.push(i);
        }

        const isValid = indexes.every((index) => {
            return (
                index === 0 || index === str.length - 1 || str[index -1] === '\n' || str[index + 1] === '\n'
            );
        });

        return isValid;
    } else {
        return false;
    }
}

// 한글, 공백, :, | 입력불가 체크 (Modify Header Name, Value)
function CheckModifyHeader(str) {
    const pattern = /[\u3131-\uD79D\s:|<>]/g;
    return pattern.test(str);
}

// CIDR 정규식 체크
function CheckCIDR(str) {
    var cidrPattern = /^(?:\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;
    var ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;
    var split = str.split('\n');
    var check = true;

    for (let i = 0; i < split.length; i++) {
        if (!cidrPattern.test(split[i]) && !ipPattern.test(split[i])) {
            check = false;
        }
    }
    return check;
}

//숫자,소문자만 입력 가능
function CheckSvcNm(str) { 
    var strarr = new Array(str.length); 
    for (var i=0; i<str.length; i++) { 
        strarr[i] = str.charAt(i);
        if ( !( (strarr[i]>='A')&&(strarr[i]<='Z')|| (strarr[i]>='a')&&(strarr[i]<='z')|| (strarr[i]>='0')&&(strarr[i]<='9')) ) { 
            return false; 
        } 
    } 
    return true; 
}



//'*' 입력불가
function CheckPurgeFile(str) { 
    var strarr = new Array(str.length); 
    for (var i=0; i<str.length; i++) { 
        strarr[i] = str.charAt(i);
        if (strarr[i]=='*') { 
             return false; 
        } 
    } 
    
    return true; 
}

//포트 유효성 체크
function httpChk(Ev){
    var checkPattern = /[^0-9]/;
    if(Ev.value.match(checkPattern)) {
        Ev.value = Ev.value.replace(checkPattern,"");
    }
    $("#cdnCreateArea").find("#http_green_text_area").hide();
    $("#cdnCreateArea").find("#http_red_text_area").hide();
    var httpPort = parseInt(Ev.value, 10);
    if(httpPort == 72 || (httpPort >= 80 && httpPort <= 89) || httpPort == 443 || httpPort == 488 || httpPort == 591 || httpPort == 777 || httpPort == 1000 
        || httpPort == 1080 || httpPort == 1088 || httpPort == 1111 || httpPort == 1443 || httpPort == 2080 || httpPort == 7001 
        || httpPort == 7070 || httpPort == 7612 || httpPort == 7777 || (httpPort >= 8000 && httpPort <= 9001) || httpPort == 9090 
        || (httpPort >= 9901 && httpPort <= 9908) || (httpPort >= 11080 && httpPort <= 11110) 
        || (httpPort >= 12900 && httpPort <= 12949) || httpPort == 204110 || httpPort == 45002 || httpPort >= 65536){
        $("#cdnCreateArea").find("#http_green_text_area").show();
        $("#btn_usable_port").addClass("action_disabled");
        Ev.required = false;
        http_port_chk = true;
    } else {
        $("#cdnCreateArea").find("#http_red_text_area").show();
        $("#cdnCreateArea").find("#http_red_text").text("사용할 수 없는 HTTP Port 입니다.");
        $("#btn_usable_port").removeClass("action_disabled");
        Ev.required = true;
        http_port_chk = false;
    }
}

function certBaseFileSave(){
    var dlg = $("#popup_cdn2_sslcert_base");
    get_injeungsu();
    
    showCommonMsg(dlg,"loadblacner");
    
    var delCerId = null;
    
    dlg.find("#closeBtn_x").unbind("click").bind("click" , function(e){
        e.preventDefault();
        $("#txt_sel_certificate").val(applyCertiData?.name);
        dlg.dialog("close");
    });
    dlg.find("#closeBtn").unbind("click").bind("click" , function(e){
        e.preventDefault();
        $("#txt_sel_certificate").val(applyCertiData?.name);
        dlg.dialog("close");
    });
    dlg.find("input[name=contentsList]").unbind("click").bind("click"  ,function(e) {
        e.preventDefault();
        var selectedRow2 = $(e.target).parents('tr');
        dlg.find(".chkwrap").removeClass("on");
        selectedRow2.find(".chkwrap").addClass("on");
        delCerId = selectedRow2.attr("value");
        $("#txt_sel_certificate").val(selectedRow2.data("name"));
    });
    dlg.find("#certBaseFileupload").unbind("click").bind("click" , function(e){
        e.preventDefault();
        dlg.dialog("close");
    });
    
    //인증서 관리
    dlg.find("#certi_managed").unbind("click").bind("click", function(e) {
        e.preventDefault();
        
        var cdnCertmanagedForm = $("#popup_cdn_managed");
        
        showCommonMsg(cdnCertmanagedForm, "advcdnlist");
        
        cdnCertmanagedForm.find("#cdnCertCM").unbind("click").bind("click", function(e) {
            cdnCertmanagedForm.dialog("close");
            dlg.dialog("close");
            
            window.location.href = "/console/d/certificate-manager/management/";
        });
    });
    
}

function certFileSave(){
    var dlg = $("#popup_cdn2_sslcert");
    
    dlg.find("#mpxSslcertCautions").removeClass("on");
    dlg.find("#mpxSslcertCautionsArea").removeClass("on");
    
    showCommonMsg(dlg,"loadblacner");    //dialog

    //주의사항 보기
    dlg.find("#mpxSslcertCautions").unbind("click").bind("click" , function(e) {
        dlg.find("#mpxSslcertCautions").toggleClass("on");
        dlg.find("#mpxSslcertCautionsArea").toggleClass("on");
    });
    
    dlg.find("#mpxBtnPopupClose").unbind("click").bind("click" , function(e){
        e.preventDefault();
        dlg.dialog("close");
    });
    dlg.find("#closeBtn_x").unbind("click").bind("click" , function(e){
        e.preventDefault();
        dlg.dialog("close");
    });
    
    dlg.find("#certFileupload").unbind("click").bind("click" , function(e){
        e.preventDefault();
        var  privatekey =  $("#privatekey").val();
        var  sslcertfileName =  $("#sslcertfileName").val();
        var  publickey =  $("#publickey").val();
        var  joonggyekey =  $("#joonggyekey").val();
        
        if(!certnmCheckYN){
            $("#ssl_name_red").show().css("display","");
            $("#ssl_name_red").text("필수입니다.");
            $("#sslcertfileName").attr('required', true);
            return;
        }
        if (privatekey =="") {
            $("#allprivatekey_red").show().css("display","");
            return;
        }else{
            $("#allprivatekey_red").hide();
        }
        if (publickey =="") {
            $("#allpublickey_red").show().css("display","");
            return;
        }else{
            $("#allpublickey_red").hide();
        }
        sendCertinfoCreateapi(sslcertfileName, privatekey, publickey,joonggyekey);

    });

}

function sendCertinfoCreateapi(sslcertfileName, privatekey, publickey,joonggyekey){
        
        var params = {
            command : "createCertificate",
            sslcertfileName : sslcertfileName ,
            privatekey : privatekey ,
            publickey : publickey ,
            joonggyekey : joonggyekey
        };
        
        
        $.ajax({
            url: "/cdnSvc",
            type: "POST",
            data: params,
            dataType: "json",
            success: function(json) {
                var result = json.status;
                if(result == "00"){
                    $("#popup_cdn2_sslcert").dialog("close");
                    $("#txt_sel_certificate").val(sslcertfileName);
                }else{
                    showCommonNoLangErrorMsg("인증서 업로드 실패", json.data.msg, null);
                }
            },
            error: function(XMLHttpResponse) {
                showCommonNoLangErrorMsg("인증서 업로드 실패", "인증서 업로드에 실패하였습니다.</br>다시 시도해주시기 바랍니다.", null);
            }
        });
    
}

function get_injeungsu(){
    $("#popup_cdn2_sslcert_base").find("tr.sslList_tablerow").remove();

    let params = {
        command : "getCertificates"  
    };
    
    $.ajax({
        url: "/isSvcSvrPrc",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(json) {    
            var listresult = json.data;
            if(listresult != null && listresult.length > 0) {

                for(var i = 0; i < listresult.length ; i++) {
                    var inlist = $("#popup_cdn2_sslcert_base").find("#sslList").clone(true);
                    inlist.addClass("sslList_tablerow");
                    inlist.find("#inName").text(listresult[i].name);
                    inlist.data("name", listresult[i].name);
                    inlist.attr('value', listresult[i].id);    
                    inlist.attr('id', listresult[i].id);    
                    $("#popup_cdn2_sslcert_base").find("#sslList").before(inlist.show());
                }
            }    
        }
    });
}

function binding_Injeung(){
    var sel_certificate = $("#inName > option:selected").text();
    $("#txt_sel_certificate").val(sel_certificate);
}


function event_cdnDeploy() {
        var dlgForm = $("#cdnCreateArea");
        
        $("div[id^='cdn_service_create_']").hide();
        $("#cdn_service_create_step1").show().css('display', '');
        
        $("#cdnContentArea").hide();
        dlgForm.show();
        
        //step1 초기화
        dlgForm.find("#step1_org_serverName").val("");
        dlgForm.find("#step1_svcDomain").val("");
        dlgForm.find("#step1_svcComment").val("");
        dlgForm.find(".currentvalue").html(0);
        dlgForm.find("#step1_svcName").val("");
        dlgForm.find("#red_svn_nm").hide();
        dlgForm.find("#red_svn_dm").hide();
        dlgForm.find("#red_svn_ssl").hide();
        dlgForm.find("#token_access_controll1").removeClass("on");
        dlgForm.find("#token_access_controll0").addClass("on");
        dlgForm.find("#certificateArea").hide();
        dlgForm.find("#secretKey_box").val("");
        $("#ssServer option").eq(0).attr("selected","selected");
        lastSelectedServerName = $("#ssServer option").eq(0).text();
        dlgForm.find("#create_step1_svcType").show();
        dlgForm.find("#modify_step1_svcType").hide();
        dlgForm.find("#create_step1_svcName").show();
        dlgForm.find("#modify_step1_svcName").hide();
        
        dlgForm.find("#step1_sslType_2").show();
        dlgForm.find("span[name=query_para]").attr("disabled", false);
        dlgForm.find("span[name=compression]").attr("disabled", false);
        dlgForm.find("span[name=referer_set]").attr("disabled", false);
        
        //step2초기화
        dlgForm.find("#originsPath").val("");
        dlgForm.find(".cdn_ori_host").hide();
        dlgForm.find("#red_org_svn_nm").hide();
        dlgForm.find("#http_red_text_area").hide();
        dlgForm.find("#http_green_text_area").hide();
        dlgForm.find("#orgHN_text_area").hide();
        
        //step3초기화
        dlgForm.find("span[name=query_para][data-value='INCLUDE_ALL_ALPHABETIZE_ORDER']").addClass('on');
        dlgForm.find("span[name=compression][data-value='false']").addClass('on');
        dlgForm.find("span[name=referer_set][data-value='1']").addClass('on');
        dlgForm.find("#referer_area").hide();

        selectBoxChang();
        
}
//CDN 서비스명 validation
function svcNameChk(obj){
    var svcChkName = $("#step1_svcName").val();
    var rtn = "필수입니다.";
    if(svcChkName == ""){
        $("#red_svn_nm").show().css("display","");
        $("#red_svn_nm_txt").text(rtn);
        obj.required = true;
        svcNm_chk = false;
        return false;
    }
    if(svcChkName.length > 20){
        rtn = "잘못된 형식입니다.영문, 숫자만 입력 가능합니다. 첫문자는 반드시 영문으로 입력해야 합니다.(20byte)";
        $("#red_svn_nm").show().css("display","");
        $("#red_svn_nm_txt").text(rtn);
        obj.required = true;
        svcNm_chk = false;
        return false;
    }
    
    if( !CheckSvcNm(svcChkName) ){
        rtn = "잘못된 형식입니다.영문, 숫자만 입력 가능합니다. 첫문자는 반드시 영문으로 입력해야 합니다.(20byte)";
        $("#red_svn_nm").show().css("display","");
        $("#red_svn_nm_txt").text(rtn);
        obj.required = true;
        svcNm_chk = false;
        return false;
    }
    
    var params = {
            svcChkName : svcChkName
    };
    
    $.ajax({
        url: "/chkCdnNm",
        type: "GET",
        data: params,
        dataType: "json",
        success: function(data) {
            var ck = data.checkcdnnameresponse.user[0];
            rtn = "중복된 서비스명입니다.";
             if(ck != null && ck.count != "0"){
                $("#red_svn_nm").show().css("display","");
                $("#red_svn_nm_txt").text(rtn);
                obj.required = true;
                svcNm_chk = false;
             }else{
                $("#red_svn_nm").hide();
                obj.required = false;
                svcNm_chk = true;
             }
        },            
        error: function(XMLHttpResponse) {
            $("#red_svn_nm").show().css("display","");
            $("#red_svn_nm_txt").text(rtn);
            obj.required = true;
            svcNm_chk = false;
        }
    });
}

//서비스도메인_고객도메인 validation
function svcDNameChk(obj){
    var svcChkDName = trim($("#step1_custom_domains").val());
    var rtn = "필수입니다.";
    if(svcChkDName == ""){
        $("#red_svn_dm").show().css("display","");
        $("#red_svc_dm_txt").text(rtn);
        obj.required = true;
        svcDm_chk = false;
        return false;
    }else if( svcChkDName.length > 0 && !CheckSvcDM(svcChkDName) ){
        rtn = "잘못된 형식입니다.영문,숫자,점(.),콤마(,),하이픈(-)만 입력가능합니다.";
        $("#red_svn_dm").show().css("display","");
        $("#red_svc_dm_txt").text(rtn);
        obj.required = true;
        svcDm_chk = false;
        return false;
    }else{
        var arr_svcDM_checked = false;
        $("#table_vmList").find(".tr_vmlist").each(function(){
            if(svcChkDName == $(this).data("cdn_domain")){
                arr_svcDM_checked = true;
                rtn = "CDN도메인 입니다. KT Cloud 도메인을 선택해 주십시오.";
                return;
            }
            if(svcChkDName == $(this).data("svc_domain")){
                arr_svcDM_checked = true;
                rtn = "이미 등록하신 서비스 도메인 입니다.";
                return;
            }
        });
        if( arr_svcDM_checked){
            $("#red_svn_dm").show().css("display","");
            $("#red_svc_dm_txt").text(rtn);
            obj.required = true;
            svcDm_chk = false;
            return false;
        }else{
            $("#red_svn_dm").hide();
            obj.required = false;
            svcDm_chk = true;
        }
    }
}
function CheckSvcDM(str){
    var strarr = new Array(str.length); 
    var flag = true;
    for (var i=0; i<str.length; i++) { 
        strarr[i] = str.charAt(i);
        if ( !( (strarr[i]>='a')&&(strarr[i]<='z')
                ||(strarr[i]>='A')&&(strarr[i]<='Z')
                ||(strarr[i]>='0')&&(strarr[i]<='9')
            || (strarr[i] == '.') || (strarr[i] == '-') || (strarr[i] == ','))) {
            flag = false; 
        } 
    } 
    return flag;         
}

//오리진설정_직접입력시 step1_org_serverName validation
function svcOrgNameChk(obj){
    var svcChkOrgName = $("#step1_org_serverName").val();
    var rtn = "필수입니다.";
    if(svcChkOrgName == ""){
        $("#red_org_svn_nm").show().css("display","");
        $("#red_org_svn_nm_txt").text(rtn);
        obj.required = true;
        org_svcNm_chk = false;
        return false;
    }else if(!CheckChar(svcChkOrgName)){
        rtn = "잘못된 형식입니다. 영문, 숫자, 점(.), 콤마(,), 하이픈(-) 만 입력 가능합니다.";
        $("#red_org_svn_nm").show().css("display","");
        $("#red_org_svn_nm_txt").text(rtn);
        obj.required = true;
        org_svcNm_chk = false;
        return false;
    }else{
        $("#red_org_svn_nm").hide();
        obj.required = false;
        org_svcNm_chk = true;
    }
}

//오리진설정_직접입력시 step1_org_serverName validation
function svcOriHostChk(obj){
    var svcChkOriHostName = $("#originHN").val();
    var rtn = "필수입니다.";
    if(svcChkOriHostName == ""){
        $("#orgHN_text_area").show().css("display","");
        $("#orgHN_red_text").text(rtn);
        obj.required = true;
        ori_hostNm_chk = false;
        return false;
    }else if(!CheckChar(svcChkOriHostName)){
        rtn = "잘못된 형식입니다. 영문, 숫자, 점(.), 콤마(,), 하이픈(-) 만 입력 가능합니다.";
        $("#orgHN_text_area").show().css("display","");
        $("#orgHN_red_text").text(rtn);
        obj.required = true;
        org_svcNm_chk = false;
        return false;
    }else{
        $("#orgHN_text_area").hide();
        obj.required = false;
        ori_hostNm_chk = true;
    }
}

// 에러 응답 캐싱주기 validation check
function cachingCheck() {
    var isNumber = /^[0-9]+$/.test($("#negative_ttl").val());
    if ($("#negative_ttl").val() > 86400) {
        $("#cachingWarning").text("값을 확인해주세요(최대 86,400 까지만 허용 가능합니다.)")
        $("#cachingWarning").show();
        caching_chk = false;
    } else if (!isNumber){
        $("#cachingWarning").text("값을 확인해주세요(숫자만 입력 가능합니다.)")
        $("#cachingWarning").show();
        caching_chk = false;
    } else {
            $("#cachingWarning").hide();
        caching_chk = true;
    }
}

//refer 기준 ACL 설정 사용시 validation
function refererChk(obj){
    var chkReferName = $("#referers").val();
    var rtn = "필수입니다."
    var svcType = null;

    if (modifyYn) {
        if ($("#modify_step1_svcType").text() == '다운로드') {
            svcType = "download";
        } else {
            svcType = "streaming";
        }
    } else {
        if ($("#step1_svcType").find(".on").attr("value") == "0") {
            svcType = "download";
        } else {
            svcType = "streaming";
        }
    }

    if(chkReferName == ""){
        $("#referer_text_area").show().css("display","");
        $("#referer_red_text").text(rtn);
        obj.required = true;
        referer_chk = false;
        return false;
    } else {
        if (chkReferName[chkReferName.length -1] === '\n' || chkReferName[0] === '\n') {
            rtn = "공백(줄바꿈)으로 시작하거나 끝낼 수 없습니다.";
            $("#referer_text_area").show().css("display","");
            $("#referer_red_text").text(rtn);
            obj.required = true;
            referer_chk = false;
            return false;
        }
        if (svcType === "streaming" && !CheckRefer(chkReferName)) {
            rtn = "스트리밍 서비스 유형은 숫자,영문자,특수문자 '/', '-', '.' 만 입력 가능합니다.";
            $("#referer_text_area").show().css("display","");
            $("#referer_red_text").text(rtn);
            obj.required = true;
            referer_chk = false;
            return false;
        } else if (svcType === "download" && !CheckReferDownload(chkReferName)) {
            rtn = "다운로드 서비스 유형은 숫자,영문자,특수문자 '/', '*', '-', '.' 만 입력 가능하며 '*'는 맨 앞 또는 맨 뒤에서만 사용 가능합니다.";
            $("#referer_text_area").show().css("display","");
            $("#referer_red_text").text(rtn);
            obj.required = true;
            referer_chk = false;
            return false;
        } else {
            $("#referer_text_area").hide();
            obj.required = false;
            referer_chk = true;
        }
    }
}

// step4 IP 기반 접근제어 사용 시 validation
function cidrCheck(obj) {
    var cidr = $("#ip_access_controll_text_area").val();
    var rtn = "필수입니다.";

    if (cidr === "") {
        $("#ip_access_text_area").show().css("display","");
        $("#ip_access_red_text").text(rtn);
        obj.required = true;
        ip_chk = false;
        return false;
    } else {
        if (!CheckCIDR(cidr)) {
            rtn = "IP주소 또는 CIDR 형식만 가능합니다.";
            $("#ip_access_text_area").show().css("display","");
            $("#ip_access_red_text").text(rtn);
            obj.required = true;
            ip_chk = false;
            return false;
        } else {
            $("#ip_access_text_area").hide();
            obj.required = false;
            ip_chk = true;
        }
    }
}

function createCDN2(type){
    
    $("#cdnCreateArea").hide();
    $("#cdnContentArea").show();
    
    var dlgForm = $("#cdnCreateArea");
    var createtype = type;
    
    var command = "";
    
    if(createtype == "1"){
        command = "createCdn2";
    }else{
        command = "updateCdn2";
        var svcid = selectedRow.attr("id");
    }
    var name    = dlgForm.find("#step4_svcName").text();
    var svcType = "";
    var useSsl = "";
    var allowNonExistReferrers = "";
    var useRedirectHttps = "no";
    var certificateName ="";
    var description = dlgForm.find("#step1_svcComment").val();
    var cdnType = "";
    var srcDomain = "";
    var positiveTtl = "";
    var useIgnoreQuery = "yes";
    var useGzip = "no";
    
    var params = {
            command : command
            , name  : name
            , description : description
    }
    
    //서비스유형
    if(createtype == "1"){
        if($("#step1_svcType").find(".on").attr("value") == "0"){
            svcType = "download";
        }else{
            svcType = "streaming";
        }
    }else{
        params.id = svcid;
        if($("#modify_step1_svcType").text() == "다운로드"){
            svcType = "download";
        }else{
            svcType = "streaming";
        }
    }
    
    params.svcType = svcType
    //서비스도메인
    if($("#step1_domainType").find(".on").attr("value") == "0"){
        var useSpSvcDomains = "yes";
        var svcDomain = dlgForm.find("#step1_custom_domains").val();

        params.useSpSvcDomains = useSpSvcDomains;
        params.svcDomain = svcDomain;
        
        if($("#step1_sslType").find(".on").attr("value") == "0"){
            //HTTP
            useSsl = "no";
        }else if($("#step1_sslType").find(".on").attr("value") == "1"){
            //HTTPS
            useSsl = "yes";
            useRedirectHttps = "yes";
            certificateName = dlgForm.find("#txt_sel_certificate").val();
        }else{
            //HTTP/HTTPS
            useSsl = "yes";
            certificateName = dlgForm.find("#txt_sel_certificate").val();
        }
    }else{
        if($("#step1_sslType").find(".on").attr("value") == "0"){
            //HTTP
            useSsl = "no";
        }else if($("#step1_sslType").find(".on").attr("value") == "1"){
            //HTTPS
            useSsl = "yes";
            useRedirectHttps = "yes";
        }else{
            //HTTP/HTTPS
            useSsl = "yes";
        }
    }
    
    params.useSsl = useSsl;
    params.useRedirectHttps = useRedirectHttps;
    params.certificateName = certificateName;
    
    //보안URL사용여부(JWT)
    if ($("#token_access_controll1").hasClass("on")) {
        var useSecureToken = "yes";
        var secureTokenSecrets = trim($("#secretKey_box").text());
        
        params.useSecureToken = useSecureToken;
        params.secureTokenSecrets = secureTokenSecrets;
    }

    //오리진설정
    var originsCnt = $("#step1_org_serverName").val().split(",").length;
    var usesslupstream = "";
    var usetlssniupstream = "";
    var originProtocol;
    
    if (originsCnt == 1) {
        //오리진설정 1개일때
        if ($("#org_select").find(".on").attr("value") == "ss") {
            var selz = $("#ssServerZone").val();

            if (selz == "3") {
                cdnType = "storage";
            } else {
                cdnType = "storage2";
            }
            
            if(svcType == "streaming")
            {
                originProtocol = 1;
                params.originProtocol = originProtocol;
            }else{
                usesslupstream = "yes";
                usetlssniupstream = "yes";
                params.useSslUpstream = usesslupstream;
                params.useTlsSniUpstream = usetlssniupstream;
            }
            
            srcDomain = $("#ssServer option:selected").text();
            params.cdnType = cdnType;
            params.srcDomain = srcDomain;
        } else {
            cdnType = "direct";
            var orgName1 = trim($("#step1_org_serverName").val());
            var orgName2 = trim($("#originsPath").val());
            var orgName3 = $("#http_port").val();
            var orgName4 = "";
            
            if(svcType == "streaming")
            {
                if($("#http_select").find(".on").attr("value") == "http"){
                    originProtocol = 0;
                }else if($("#http_select").find(".on").attr("value") == "https"){
                    originProtocol = 1;
                }
                params.originProtocol = originProtocol;
            }else{
                if($("#http_select").find(".on").attr("value") == "http"){
                    usesslupstream = "no";
                    usetlssniupstream = "no";
                }else if($("#http_select").find(".on").attr("value") == "https"){
                    usesslupstream = "yes";
                    usetlssniupstream = "yes";
                }
                params.useSslUpstream = usesslupstream;
                params.useTlsSniUpstream = usetlssniupstream;
            }
            
            if ($("#hostHd").find(".on").attr("value") != "REQUEST_HOST_HEADER") {
                orgName4 = orgName1 + "@";
            }

            srcDomain = orgName4 + orgName1 + ":" + orgName3 + orgName2;
            
        
            params.cdnType = cdnType;
            params.srcDomain = srcDomain;
        }
    } else {
        //오리진설정이 여러개일 때
        cdnType = "direct";

        var orgName11 = "";
        var orgName22 = "";
        var orgName33 = "";
        var orgName44 = "";
        var origins = $("#step1_org_serverName").val().split(",");
        
        if(svcType == "streaming")
        {
            if($("#http_select").find(".on").attr("value") == "http"){
                originProtocol = 0;
            }else if($("#http_select").find(".on").attr("value") == "https"){
                originProtocol = 1;
            }
            params.originProtocol = originProtocol;
        }else{
            if($("#http_select").find(".on").attr("value") == "http"){
                usesslupstream = "no";
                usetlssniupstream = "no";
            }else if($("#http_select").find(".on").attr("value") == "https"){
                usesslupstream = "yes";
                usetlssniupstream = "yes";
            }
            params.useSslUpstream = usesslupstream;
            params.useTlsSniUpstream = usetlssniupstream;
        }
        
        for (var i = 0; i < originsCnt; i++) {
            orgName11 = origins[i];
            orgName22 = trim($("#originsPath").val());
            orgName33 = $("#http_port").val();

            if ($("#hostHd").find(".on").attr("value") == "REQUEST_HOST_HEADER") {
                orgName44 = "";
            } else {
                orgName44 = trim($("#originHN").val()) + "@";
            }

            if (i == 0) {
                srcDomain = orgName44 + orgName11 + ":" + orgName33 + orgName22;
            } else {
                srcDomain = srcDomain + ',' + orgName44 + orgName11 + ":" + orgName33 + orgName22;
            }
        }

        params.cdnType = cdnType;
        params.srcDomain = srcDomain;
    }
    

    //최대캐싱기간
    var ttlType = $("#positive_ttl").val();
    positiveTtl = ttlType;
//    if(ttlType == "0"){
//        positiveTtl = "3600";
//    }else if(ttlType == "1"){
//        positiveTtl = "21600";
//    }else if(ttlType == "2"){
//        positiveTtl = "43200";
//    }else if(ttlType == "3"){
//        positiveTtl = "86400";
//    }else if(ttlType == "4"){
//        positiveTtl = "604800";
//    }else{
//        positiveTtl = "2592000";
//    }
    
    params.positiveTtl = positiveTtl;
    
    if(svcType == "download"){
	    //Query 파라미터 무시
		var query_para_val = null;
	    $("span[name=query_para]").each(checkQueryPara);
	    function checkQueryPara(){
	        if($(this).hasClass('on')){
	            query_para_val = $(this).attr('data-value');
	        }
	    }
	    if(query_para_val == "INCLUDE_ALL_ALPHABETIZE_ORDER"){
	        useIgnoreQuery = "no";
	    }
	    
	    //Last Mile 압축 지원
	    var compression_val = null;
	    $("span[name=compression]").each(checkcompression2);
	    function checkcompression2(){
	        if($(this).hasClass('on')){
	            compression_val = $(this).attr('data-value');
	        }
	    }
	    if(compression_val == "true"){
	        useGzip = "yes";
	    }
	    
    	params.useGzip = useGzip;
	}
	params.useIgnoreQuery = useIgnoreQuery;
    
    
    //Refer 기준 ACL 설정
    var referer_set_val = null;
    $("span[name=referer_set]").each(checkReferset);
    function checkReferset(){
        if($(this).hasClass('on')){
            referer_set_val = $(this).attr('data-value');
        }
    }
    
    //Refer 없는 경우 사용 여부
    var non_exist_referer_set_val = null;
    $("span[name=non_exist_referer_set]").each(checkExistReferset);
    function checkExistReferset(){
        if($(this).hasClass('on')){
            non_exist_referer_set_val = $(this).attr('data-value');
        }
    }
    if(referer_set_val == "0"){
        var useReferers = "yes";
        var referers = dlgForm.find("#referers").val().split("\n").join(",");
        if(non_exist_referer_set_val == "0"){
            allowNonExistReferrers = "yes";
        }else {
            allowNonExistReferrers = "no";
        }
        
        params.useReferers = useReferers;
        params.referers = referers;
        params.allownoneexistreferer = allowNonExistReferrers;
    }
    
  
    
    // 추가 parameter
    //download type 시 CORS 설정
    var corsAllowOrigin = "";
    if($("#corsSet").find(".on").attr("value") == "CORS_ALLOW_ORIGIN"){
        corsAllowOrigin = "all";
    }else {
        corsAllowOrigin = "none";
    }
    
    
    //download일 시에만 입력되는 값 step4
    if(svcType == "download"){
        params.corsalloworigin = corsAllowOrigin;
        if($("#allow_http_method").find(".on").attr("value") === "none_post"){
		    params.allowHttpMethod = '["GET", "HEAD", "OPTIONS"]'; //step4 Allow HTTP Method
		}else {
		    params.allowHttpMethod = '["GET", "HEAD", "OPTIONS", "POST"]'; 
			
		}
	    
	    let ip_list_text = $("#ip_access_controll_text_area").val().split('\n').filter(item => item.trim() != '');
	    ip_list_text = JSON.stringify(ip_list_text);
	    if(!$("#ip_access_controll1").hasClass('on')){ //step4 IP 기반 접근제어
			if($("#ip_access_controll2").hasClass('on')){
				params.allowIpList = ip_list_text;
			}else if($("#ip_access_controll3").hasClass('on')){
				params.denyIpList = ip_list_text;
			}
		}
		let country_list_text = JSON.stringify(country_list);
	    if(!$("#geo_access_controll1").hasClass('on')){ //step4 GEO 기반 접근제어
			if($("#geo_access_controll2").hasClass('on')){
				params.allowCountryList = country_list_text;
			}else if($("#geo_access_controll3").hasClass('on')){
				params.denyCountryList = country_list_text;
			}
		}
    }

    if($("#step2_modify_header1").hasClass('on')){ //step2 Modify Header
	    params.addOriginRequestHeaders = JSON.stringify(add_origin_request_headers);
	}

    if ($("#caching_option").find(".on").attr("value") === "1") {
        params.removeOriginCacheControlHeader = 'yes'; // CDN 캐싱
    } else {
        params.removeOriginCacheControlHeader = 'no'; // 원본 서버
    }

    params.negativeTtl = $("#negative_ttl").val(); //step3 에러 응답 캐싱주기 설정

    if($("#step4_modify_header").find(".on").attr("value") === "1"){ //step4 Modify Header
	    params.addClientResponseHeaders = JSON.stringify(add_client_response_headers);
	}

    var success_msg = "";
    if(createtype == 1){
        showMsg("", "CDN서비스 생성요청이 완료되었습니다.<br />생성이 완료되려면 2~3분 정도 소요됩니다.", "" );
        success_msg = name + " 생성 시작";
        add_noti_message("/console/d/osadvcdnlist", success_msg);
        process_toast_popup("CDN", success_msg, true);
    }else{
        showMsg("", "CDN서비스 수정요청이 완료되었습니다.<br />수정이 완료되려면 2~3분 정도 소요됩니다.", "" );
        success_msg = name + " 수정 시작";
        add_noti_message("/console/d/osadvcdnlist", success_msg);
        process_toast_popup("CDN", success_msg, true);
    }
    
    $.ajax({
        url : "/cdnSvc",
        type : "POST",
        data : params,
        dataType : "json",
        complete : function(){
            hideLoadingBox();    // 로딩중 이미지 닫기
        },
        success : function(json){
            if(json.status == "29") { /* IAM 사용자 정책 처리 */
                commonErrorMessage("29");
                return;
            }
            
            if ( json.status == '00'){
                if(createtype == 1){
                    success_msg = name + " 생성 성공";
                    add_noti_message("/console/d/osadvcdnlist", success_msg);
                    process_toast_popup("CDN", success_msg, true);
                }else{
                    success_msg = name + " 수정 성공";
                    add_noti_message("/console/d/osadvcdnlist", success_msg);
                    process_toast_popup("CDN", success_msg, true);
                }
                window.location.reload();
            }else if(json.status == '405'){
                showCommonNoLangErrorMsg("CDN서비스 신청 실패", "이미 사용중인 서비스도메인입니다.<br/> 다른 서비스도메인으로 재시도해 주시기 바랍니다. ", "" );
            }else{
                if(createtype == 1){
                    success_msg = name + " 생성 실패";
                    add_noti_message("/console/d/advcdnlist", success_msg);
                    process_toast_popup("CDN", success_msg, false);
                }else{
                    success_msg = name + " 수정 실패";
                    add_noti_message("/console/d/osadvcdnlist", success_msg);
                    process_toast_popup("CDN", success_msg, false);
                }
            }
        },            
        error: function(XMLHttpResponse){
            if(createtype == 1){
                success_msg = name + " 생성 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }else{
                success_msg = name + " 수정 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
        }
    });
}

function event_callvmDeploy(params) {
    $("#cdnCreateArea").hide();
    $("#cdnContentArea").show();
    $("#cdn_create_step2").dialog("close");
    
    showLoadingBox();    // 로딩중 이미지
    
    params.command = "create";
    params.group_mem_sq = group_mem_sq;
    var noti_message    =  "";
    $.ajax({
        url : "/cdnSvc"
        , type : "POST"
        , data : params
        , dataType : "json"
        , complete : function () {
            hideLoadingBox();    // 로딩중 이미지 닫기
        }
        , success : function(json) {
            if (json.XmlRoot.info.code == "1000") {
                
                noti_message    =  "[CDN] " + params.names + " " + objLang.create_success;
                add_noti_message("/console/cdnlist", noti_message);
                
                commonDialogInit($("#cdn_success"));
                $("#cdn_success").dialog("open");
                    
                $("#btnCdnSuccessClose").unbind("click").bind("click" , function() {
                    $("#cdn_success").dialog("close");
                    
                });
                call_vmList();
                return;
            }else if(json.XmlRoot.info.code == "5001"){
                noti_message    =  "[CDN] " + params.names + " " + objLang.create_error;
                add_noti_message("/console/cdnlist", noti_message);
                
                showCommonNoLangErrorMsg("CDN서비스 신청 실패","CDN서비스를 신청중 에러가 발생하였습니다."+ "<br />" +json.XmlRoot.info.msg);
                return;                
            }
            else{
                noti_message    =  "[CDN] " + params.names + " " + objLang.create_error;
                add_noti_message("/console/cdnlist", noti_message);
                
                showCommonNoLangErrorMsg("CDN서비스 신청 실패","CDN서비스를 신청중 에러가 발생하였습니다."+ "<br />" +json.XmlRoot.info.msg);
            }
                
        }
    });
}


function event_vmSearch(e)
{
    e.preventDefault();
    showLoadingBox();    // 로딩중 이미지
    
    var sch_word = trim($("#sel_sch_word").val());
    sch_word = sch_word.toUpperCase();

    var params = {};

    params.command = "listCdn2";
    params.group_mem_sq = group_mem_sq;

    $.ajax({
        url : "/cdnSvc"
            , type : "POST"
            , data : params
            , dataType : "json"
            , complete : function () {
                hideLoadingBox();    // 로딩중 이미지 닫기
            }
            , success : function(json) {
                if (json.status == "00") {
                    var temp = json.data;
                    var items = [];
                    for(var i=0; i<temp.length; i++){
                        var tempName = temp[i].svcname;
                        tempName = tempName.toUpperCase();
                        if(tempName.indexOf(sch_word) > -1 ){
                            items.push(temp[i]);
                        }
                    }
                    sort_items = items;
                    itemSort();
                }else{
                    if(json.status == "99"){
                        showCommonNoLangErrorMsg("CDN서비스 조회","CDN서비스 조회중 에러가 발생하였습니다."+ "<br />" +"관리자에게 문의하세요");
                    }
                }
            }
    });    
}

function event_cdnStart(e)
{
    e.preventDefault();
    var selectedvm_id = selectedRow.data("id");

    commonDialogInit($("#dialog_CDN_Start"));
    $("#dialog_CDN_Start").dialog("open");
    $("#dialog_CDN_Start").find("#dialog_CDN_Start_text1").text($("#text_serviceName").text());
    $("#dialog_CDN_Start").find("#button_VM_Start_TopClose").unbind("click").bind("click" , cancelCdnStart);
    $("#dialog_CDN_Start").find("#button_VM_Start_Cancel").unbind("click").bind("click" , cancelCdnStart);
    function cancelCdnStart(){
        $("#dialog_CDN_Start").dialog("close");
    }
    $("#dialog_CDN_Start").find("#button_VM_Start_OK").unbind("click").bind("click" , vmStartOK);
    function vmStartOK(){
        var selectsvc_type = $("#text_svc_type").text();
        call_VM_Start(selectedvm_id, selectsvc_type);
        return false;
    }
}

function call_VM_Start(selectedvm_id, selectsvc_type){

    var success_msg = selectedRow.data("svc_name") + " 시작 시작";
    add_noti_message("/console/d/osadvcdnlist", success_msg);
    process_toast_popup("CDN", success_msg, true);

    $("#dialog_CDN_Start").dialog("close");

    var params    = {
            svc_id        : selectedvm_id
    };

    var name = selectedRow.data("svc_name");

    params.command = "startCdn2";

    $.ajax({
        url : "/cdnSvc"
            , type : "POST"
                , data : params
                , dataType : "json"
                    , success : function(json) {
                        if(json.status == "29") { /* IAM 사용자 정책 처리 */
                            commonErrorMessage("29");
                            return;
                        }

                        if (json.status == "00") {
                            success_msg = name + " 시작 성공";
                            add_noti_message("/console/d/osadvcdnlist", success_msg);
                            process_toast_popup("CDN", success_msg, true);
                            call_vmList();
                        }else{
                            success_msg = name + " 시작 실패";
                            add_noti_message("/console/d/osadvcdnlist", success_msg);
                            process_toast_popup("CDN", success_msg, false);
                        }
                    }
    });
}

function event_cdnStop(e){
    e.preventDefault();
    var svc_id = selectedRow.data("id");
    var svc_name = selectedRow.data("svc_name")
    var origin_id = selectedRow.data("origin_group")

    commonDialogInit($("#dialog_CDN_Stop"));
    $("#dialog_CDN_Stop").dialog("open");
    $("#dialog_CDN_Stop").find("#dialog_CDN_Stop_text1").text($("#text_serviceName").text());
    $("#dialog_CDN_Stop").find("#button_VM_Stop_TopClose").unbind("click").bind("click" , cancelStopPop);
    $("#dialog_CDN_Stop").find("#button_VM_Stop_Cancel").unbind("click").bind("click" , cancelStopPop);
    function cancelStopPop(){
        $("#dialog_CDN_Stop").dialog("close");
    }
    $("#dialog_CDN_Stop").find("#button_VM_Stop_OK").unbind("click").bind("click" , cdnStopClick);
    function cdnStopClick(){
        call_VM_Stop(svc_id, svc_name, origin_id);
        return false;
    }

}

function call_VM_Stop(svc_id, svc_name, origin_id){
    
    var success_msg = svc_name + " 정지 시작";
    add_noti_message("/console/d/osadvcdnlist", success_msg);
    process_toast_popup("CDN", success_msg, true);

    $("#"+svc_id).find("label").hide();
    $("#"+svc_id).find(".show_loading_img").show();
    
    var putURL ="/cdn/resources/" + svc_id;
    var el_target    = $("#"+ svc_id).find("#img_vmState");
    el_target.html('<img src="/images/coni/Circle_Gray.svg" alt="" class="mr5 vm" />정지중');
    $("#dialog_CDN_Stop").dialog("close");
    var params = {origin_id : origin_id};
    $.ajax({
        url : putURL
        , type : "PUT"
        , data : params
        , dataType : "json"
        , success : function(json) {
            if(json.status == "29") { /* IAM 사용자 정책 처리 */
                commonErrorMessage("29");
                return;
            }
            
            if (json.status == "00") {
                success_msg = svc_name + " 정지 성공";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, true);
                call_vmList();
            }else{
                success_msg = svc_name + " 정지 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
        }
    });
}



function event_cdnDelete(e)
{
    e.preventDefault();
        var selectedvm_id     = selectedRow.data("id");
        var el_dialog        = $("#dialog_CDN_Delete"); 
        commonDialogInit(el_dialog);
        el_dialog.dialog("open");
        $("#dialog_CDN_Delete").find("#dialog_CDN_Delete_text1").text($("#text_serviceName").text());
        $("#button_VM_Delete_TopClose", el_dialog).unbind("click").bind("click" , cancelDelPop);
        $("#button_VM_Delete_Cancel", el_dialog).unbind("click").bind("click" , cancelDelPop);
        function cancelDelPop(){
            el_dialog.dialog("close");
        }
        $("#button_VM_Delete_OK", el_dialog).unbind("click").bind("click" , vmDelOK);
        function vmDelOK(){
            el_dialog.dialog("close");
            call_VM_Delete(selectedvm_id);
            return false;
        }
}

// 서버 삭제
function call_VM_Delete (selectedvm_id) {
    
    var success_msg = selectedRow.data("svc_name") + " 삭제 시작";
    add_noti_message("/console/d/osadvcdnlist", success_msg);
    process_toast_popup("CDN", success_msg, true);
    
    var params    = {
            svc_id        : selectedvm_id
        };
    
    params.command = "deleteCdn2";

    var name = selectedRow.data("svc_name");
    
    $.ajax({
        url : "/cdnSvc"
        , type : "POST"
        , data : params
        , dataType : "json"
        , complete : function () {
            hideLoadingBox();    // 로딩중 이미지 닫기
        }
        , success : function(json) {
            if(json.status == "29") { /* IAM 사용자 정책 처리 */
                commonErrorMessage("29");
                return;
            }
            
            if (json.status == "00") {
                success_msg = name + " 삭제 성공";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, true);
                call_vmList();
            }else{
                success_msg = name + " 삭제 실패";
                add_noti_message("/console/d/osadvcdnlist", success_msg);
                process_toast_popup("CDN", success_msg, false);
            }
        }
    });

}


function event_cdnClick(e)
{
    e.preventDefault();
        selectedRow = $(e.target).parents("tr");
        var selectedvm_id = selectedRow.attr("id");
        if(selectedvm_id == null) {
            return false;
        }
        
        selectedRow.data("id", selectedvm_id);
        
        getApplyCertificates(selectedRow.data("id"));
        
        // 좌측 체크박스 이벤트. 단일선택만 가능.
        if(    selectedRow.find("input:checkbox[name=contentsList]").prop("checked"))
        {
            $("input:checkbox[name=contentsList]").prop("checked",false).change();
            selectedRow.removeClass('on');

            $("#button_cdnDetail").addClass('action_disabled2');
            $("#button_cdnModify").addClass('action_disabled2');
            $("#button_cdnPurge").addClass('action_disabled2');
            
        }else{
            $("input:checkbox[name=contentsList]").prop("checked",false).change();
            selectedRow.find("input:checkbox[name=contentsList]").prop("checked",true).change();
            
            $("#button_cdnDetail").removeClass('action_disabled2');
            $("#button_cdnModify").removeClass('action_disabled2');
            $("#button_cdnPurge").removeClass('action_disabled2');
        }
        
        $("#text_serviceName").text("");
        $("#text_serviceDomains").text("");
        $("#text_type").text("");
        $("#text_cdnDomain").text("");
        $("#text_protocol").text("");
        $("#text_secureYn").text("");
        $("#text_Comment").text("");
        $("#text_url_sample").text("");
        $("#text_orgin").text("");
        $("#text_host_header").text("");
        $("#text_max_caching").text("");
        $("#text_query").text("");
        $("#text_mile").text("");
        $("#text_refer").text("");
        $("#text_non_exist_refer").text("");
        
        $("#text_cors_title").text("");
        $("#text_cors").text("");
        
        $("#text_modify_header_request").text("");
        $("#text_caching_option").text("");
        $("#text_negative_ttl").text("");
        $("#text_allow_http_method").text("");
        $("#text_ip_access_controll").text("");
        $("#text_geo_access_controll").text("");
        $("#text_modify_header_response").text("");
        
        // 서비스명
        if(selectedRow.data("svc_name")){
            $("#text_serviceName").text(selectedRow.data("svc_name"));
            $("#text_selected_vmDisplayText").text(selectedRow.data("svc_name"));        
            $("#step1_svcName").text(selectedRow.data("svc_name"));        
        }
        
        $("#text_type").text(selectedRow.data("svc_type"));
        
        //download 타입일 경우 CORS 설정
        if(selectedRow.data("svc_type") == "download"){
			$(".text_download").show();
        }else{
			$(".text_download").hide();
		}
       $("#text_cors_title").text("CORS 설정");
         if(selectedRow.data("cors") == "*"){
             $("#text_cors").text("사용");
         }else {
             $("#text_cors").text("사용 안 함");
         }
        var cdnDomain = "";
        if (selectedRow.data("cdn_domain") !== undefined) {
            if (selectedRow.data("cdn_domain").length > 1) {
                for(var i = 0; i < selectedRow.data("cdn_domain").length; i++){
                    cdnDomain += selectedRow.data("cdn_domain")[i];

                    if(i > 0 && i < selectedRow.data("cdn_domain").length-1){
                        cdnDomain += ",";
                    }
                }
                $("#text_cdnDomain").html(cdnDomain + "<img onclick='copy_to_popup_clipboard(this);' class='vm ml5' src='/images/coni/Table_Copy.svg' alt='복사' />");
            } else {
                $("#text_cdnDomain").html(selectedRow.data("cdn_domain")[0] + "<img onclick='copy_to_popup_clipboard(this);' class='vm ml5' src='/images/coni/Table_Copy.svg' alt='복사' />");
            }
        }

        if(selectedRow.data("description")) {
            $("#text_Comment").text(selectedRow.data("description").replace("[KT Cloud]",""));
        }else {
            $("#text_Comment").text();
        }
        
        var domain = ""; 
        if(selectedRow.data("svc_domain").length > 1){
            for(i = 0; i < selectedRow.data("svc_domain").length; i++){
                if(i > 0){
                    domain += ",";
                }

                domain += selectedRow.data("svc_domain")[i];
            }
            $("#text_serviceDomains").html(domain + "<img onclick='copy_to_popup_clipboard(this);' class='vm ml5' src='/images/coni/Table_Copy.svg' alt='복사' />");
        }else{
            $("#text_serviceDomains").html(selectedRow.data("svc_domain")[0] + "<img onclick='copy_to_popup_clipboard(this);' class='vm ml5' src='/images/coni/Table_Copy.svg' alt='복사' />");
        }
        
        if(selectedRow.data("token")){
            $("#text_secureYn").html('사용 (Secret Key : ' + selectedRow.data("token") + ')' + "<img onclick=copy_to_token(this); class='vm ml5' src='/images/coni/Table_Copy.svg' alt='복사' />");
        }else{
            $("#text_secureYn").text('사용 안 함');
        }
        
        
        var origin = ""; 
        var textOriginHN = "";
        if(selectedRow.data("org_addr").length > 1){
            for(i = 0; i < selectedRow.data("org_addr").length; i++){
                if(i==0){
                    if(selectedRow.data("org_addr")[i].indexOf('@') != -1){
                        textOriginHN += selectedRow.data("org_addr")[i].split('@')[0]
                    }
                    origin += selectedRow.data("org_addr")[i];
                }else{
                    if(selectedRow.data("org_addr")[i].indexOf('@') != -1){
                        textOriginHN += ", " +selectedRow.data("org_addr")[i].split('@')[0]
                    }
                    origin += ", " +selectedRow.data("org_addr")[i];
                }
            }
            $("#text_orgin").text(origin);
        }else{
            if(selectedRow.data("org_addr")[0].indexOf('@') != -1){
                textOriginHN += selectedRow.data("org_addr")[0].split('@')[0]
            }
            $("#text_orgin").text(selectedRow.data("org_addr")[0]);
        }
        
        if($("#text_type").text() == "streaming"){
            $("#text_url_sample").append("http://"+$("#text_serviceDomains").text()+"/<font color='#1868c2'>{filename}</font>/playlist.m3u8");
        }
        
        var origin_http_d = selectedRow.data("originprotocol");
        var origin_http2_d = selectedRow.data("usesslupstream");
        
        if (selectedRow.data("svc_type") == "download") {
            if(origin_http2_d == "yes"){
                $("#protocol_orgin").text("https");
            }else{
                $("#protocol_orgin").text("http");
            }
        }else{
            if(origin_http_d == 1){
                $("#protocol_orgin").text("https");
            }else{
                $("#protocol_orgin").text("http");
            }
        }

        
        if(selectedRow.data("cdntype") != "direct"){
            $("#text_host_header").text("Incoming Host Header");
        }else{
            if(selectedRow.data("oheader")=="no"){
                $("#text_host_header").text("Incoming Host Header");
            }else{
                if(textOriginHN.length > 0 ){
                    $("#text_host_header").text("Origin Host Name (" + textOriginHN + ")");
                }else{
                    $("#text_host_header").text("Origin Host Name");
                }
            }
        }

        if(selectedRow.data("cachettl") == "3600"){
            $("#text_max_caching").text("1시간");
        }else if(selectedRow.data("cachettl") == "21600"){
            $("#text_max_caching").text("6시간");
        }else if(selectedRow.data("cachettl") == "43200"){
            $("#text_max_caching").text("12시간");
        }else if(selectedRow.data("cachettl") == "86400"){
            $("#text_max_caching").text("1일");
        }else if(selectedRow.data("cachettl") == "604800"){
            $("#text_max_caching").text("7일");
        }else if(selectedRow.data("cachettl") == "2592000"){
            $("#text_max_caching").text("30일");
        }
        if(selectedRow.data("gzip") == "no"){
            $("#text_mile").text("사용 안 함");
        }else{
            $("#text_mile").text("사용");
        }
        if(selectedRow.data("svc_type") === "download" && selectedRow.data("ignoreqeury") == "no"){
            $("#text_query").text("사용 안 함");
        }else{
            $("#text_query").text("사용");
        }
        if(selectedRow.data("referers") == ""){
            $("#text_refer").text("사용 안 함");
        }else{
            var referer_arr = [];
            for(i=0; i<selectedRow.data("referers").length; i++){
                referer_arr.push(selectedRow.data("referers")[i]);
            }
            $("#text_refer").text("사용 (" + referer_arr+")");
            if(selectedRow.data("noneexist_referer") == "yes"){
                $("#text_non_exist_refer").text("허용");
            }else {
                $("#text_non_exist_refer").text("차단");
            }
            
        }

        var protocol = selectedRow.data("serviceprotocol") == "HTTPS/HTTP" ? "HTTP/HTTPS" : selectedRow.data("serviceprotocol");
        $("#text_protocol").text(protocol);

        let addoriginrequestheaders = '';
        if(selectedRow.data("addoriginrequestheaders").length) {
            selectedRow.data("addoriginrequestheaders").forEach((item) => {
                if (item.charAt(item.length -1) === ":") {
                    addoriginrequestheaders += "[DELETE] " + item.slice(0, -1) + "<br>";
                } else {
                    addoriginrequestheaders += "[ADD/MODIFY] " + item + "<br>";
                }
            });
        }
        $("#text_modify_header_request").html(addoriginrequestheaders ? addoriginrequestheaders : "사용 안 함");

        $("#text_caching_option").text(['yes', 'true'].includes(selectedRow.data("removeorigincachecontrolheader")) ? "CDN 캐싱 설정 우선" : "원본 서버의 Cache Control 헤더 우선");
        $("#text_allow_http_method").text(selectedRow.data("allowhttpmethod"));
        $("#text_negative_ttl").text(selectedRow.data("negativettl") + "초");

        let iplist = selectedRow.data("denyiplist").length > 0 ? `차단(${selectedRow.data("denyiplist")})` 
        	: (selectedRow.data("allowiplist").length > 0 ? `허용(${selectedRow.data("allowiplist")})` : "사용 안 함");
        $("#text_ip_access_controll").text(iplist);
         let countrylist = selectedRow.data("denycountrylist").length > 0 ? `차단(${selectedRow.data("denycountrylist")})` 
        	: (selectedRow.data("allowcountrylist").length > 0 ? `허용(${selectedRow.data("allowcountrylist")})` : "사용 안 함");
        $("#text_geo_access_controll").text(countrylist);

        let addclientresponseheaders = '';
        if(selectedRow.data("addclientresponseheaders")){
            selectedRow.data("addclientresponseheaders").forEach((item) => {
                if (item.charAt(item.length -1) === ":") {
                    addclientresponseheaders += "[DELETE] " + item.slice(0, -1) + "<br>";
                } else {
                    addclientresponseheaders += "[ADD/MODIFY] " + item + "<br>";
                }
            });
        }

        $("#text_modify_header_response").html(addclientresponseheaders ? addclientresponseheaders : "사용 안 함");
        
        setControl_Panel(selectedRow.data("state"));
}

function copy_to_token(source,text) {
    var target = source.parentNode;
    var text_area = document.createElement("textarea");
    target.appendChild(text_area);
    
    if(text != null && text != ""){
        text_area.value = text;
    }else{
        text_area.value = trim(target.textContent);        
    }

    text_area.value = text_area.value.replace("사용 (Secret Key : ", "");
    text_area.value = text_area.value.replace(")", "");
    
    text_area.select();
    document.execCommand('copy');
    target.removeChild(text_area);

    process_toast_popup("복사 완료", "클립보드에 복사되었습니다.", true);
}



function setControl_Panel(state){
    //11/16 설명창에 나오는 상태 이미지처리
        $("#div_info").find("#img_vmState").html(function(index , oldhtml) {
            console.log("setControl_Panel")
            if(state == "status") {            //사용
                return '<img src="/images/c_common/ico_state_use.png" class="mr5 vm" />사용';
            }else if(state == "일지정지") {    //정지
                return '<img src="/images/c_common/ico_state_stop.png" class="mr5 vm" />정지';
            }else if(state == "processed") {        //준비중
                return '<img src="/images/c_common/ico_state_stop.png" class="mr5 vm" />' + objLang.in_preparation;
            }else {        //오류
                return '<img src="/images/c_common/ico_state_stop.png" class="mr5 vm" />오류';
            }
        });
        if(!selectedRow.find("input:checkbox[name=contentsList]").prop("checked")){
            $("#button_cdnStart").attr("class", "action action_disabled");
            $("#button_cdnStop").attr("class", "action action_disabled");
            $("#button_cdnDelete").attr("class", "action action_disabled");
            
        }else if(state == "서비스중"){ // 사용중 상태
            //각 액션 버튼 셋팅
            $("#button_cdnStart").attr("class", "action action_disabled");
            $("#button_cdnStop").attr("class", "action");
            $("#button_cdnDelete").attr("class", "action action_disabled");

            $("#button_cdnStart").unbind("click"); 
            $("#button_cdnStop").unbind("click").bind("click" , button_cdnStop_event); 
            $("#button_cdnDelete").unbind("click");
            show_tooltip("button_cdnDelete", "Y");
            
        }else if(state == "일시중지"){ // 정지상태
            //각 액션 버튼 셋팅        
            $("#button_cdnStop").attr("class", "action action_disabled");
            $("#button_cdnDelete").attr("class", "action");
            $("#button_cdnStart").attr("class", "action");

            $("#button_cdnStop").unbind("click"); 
            $("#button_cdnDelete").unbind("click").bind("click" , function(e) {
                e.preventDefault();
                event_cdnDelete(e);
                return false;
            });
            $("#button_cdnStart").unbind("click").bind("click" , function(e) {
                e.preventDefault();
                event_cdnStart(e);
                return false;
            }); 

        }else if(state == "오류"){ // 오류상태
            //각 액션 버튼 셋팅        
            $("#button_cdnStop").attr("class", "action action_disabled");
            $("#button_cdnDelete").attr("class", "action");
            $("#button_cdnStart").attr("class", "action action_disabled");
            
            // $("#button_cdnStop").unbind("click").bind("click" , function(e) {
            //     e.preventDefault();
            //     event_cdnStop(e);
            //     return false;
            // });

            $("#button_cdnStop").unbind("click");
            $("#button_cdnDelete").unbind("click").bind("click" , function(e) {
                e.preventDefault();
                event_cdnDelete(e);
                return false;
            });
            // $("#button_cdnDelete").unbind("click");
            show_tooltip("button_cdnDelete", "Y");
            $("#button_cdnStart").unbind("click"); 

        }else {
            //각 액션 버튼 셋팅
            $("#button_cdnStart").attr("class", "action action_disabled");
            $("#button_cdnStop").attr("class", "action action_disabled");
            $("#button_cdnDelete").attr("class", "action");
            
            $("#button_cdnStart").unbind("click"); 
            $("#button_cdnStop").unbind("click"); 
            $("#button_cdnDelete").unbind("click").bind("click" , function(e) {
                e.preventDefault();
                event_cdnDelete(e);
                return false;
            });
        }
    
}

function textAreaLengthCheck(val, maxLengthKByte) {
    var tempByteLength = 0, cutByteLength = 0;
    var maxLengthByte = maxLengthKByte * 1024 ;
    for(var i = 0; i < val.length; i++) {
        if(escape(val.charAt(i)).length > 4) {
            tempByteLength += 2;
        } else {
            tempByteLength++;
        }

        if(tempByteLength < maxLengthByte) {
            cutByteLength++;
        }
    }
    if(tempByteLength > maxLengthByte) {
        return false;
    }
    return true;
}

// 메세지박스 입력값 4개
function showCCdlgError1_Msg(sTitle, sText1, sText2, sText3) {
        var dlgForm = $("#dialog_Instancesservice1_Msg");
        
        dlgForm.dialog("open");
        
        dlgForm.find("#dlg_Instancesservice1_Msg_title").text(sTitle);
        dlgForm.find("#dlg_Instancesservice1_text1").text(sText1);
        dlgForm.find("#dlg_Instancesservice1_text2").text(sText2);
        dlgForm.find("#dlg_Instancesservice1_text3").text(sText3);

        
        dlgForm.find("#btn_Instancesservice1_Msg_top_close").unbind("click").bind("click", function(e) {
            e.preventDefault();
            dlgForm.dialog("close"); 
            return false;
        });
                
        dlgForm.find("#btn_Instances1_MsgOK").unbind("click").bind("click", function(e) {
            e.preventDefault();
            dlgForm.dialog("close"); 
            return false;
        });
}


function onlyChar2(pFileBoxName) {
    var ptn = /[^A-z|0-9\.\-\,]/g;
    return pFileBoxName.match(ptn);
}


var tr_temp=null;
function tr_onclick_main_cdn(obj){
    if(tr_temp!=null){
        $(tr_temp).removeClass('on');
        $(tr_temp).addClass('off');
    }
    tr_temp=obj;
    $(obj).removeClass('off');
    $(obj).removeClass('over');
    $(obj).addClass('on');
}


function tr_onmouseover_cdn(obj){
    if( !$(obj).hasClass('on') ) {
        $(obj).removeClass('off');
        $(obj).addClass('over');
    }
}

function tr_onmouseout_cdn(obj){
    if( !$(obj).hasClass('on') ) {
        $(obj).removeClass('over');
        $(obj).addClass('off');
    }
}


function check_encoder() {
    var encoder_req_flag    = $.cookie("encoder_req_yn");
    var strMvTarget            =  getQueryString("deploy");
    
    if(encoder_req_flag != null && encoder_req_flag == "Y") {
        event_cdnDeploy();
        $("#org_select").val("ss");
        selectBoxChang();
        
        var encoder_req_zone = $.cookie("encoder_zone");

        if(encoder_req_zone == "kor-central") {
            $("#ssServerZone").val("1");
            $("#ssServerZone").change();
        } else if(encoder_req_zone == "jpn") {
            $("#ssServerZone").val("2");
            $("#ssServerZone").change();
        }
        
        $.cookie('encoder_req_yn', null, {path : WebROOT});
        $.cookie('encoder_zone', null, {path : WebROOT});
    } else if(strMvTarget != null && strMvTarget.length > 0 ) {
        var encoder_zone     =  getQueryString("zonenm");
        var encoder_fbox     =  getQueryString("storagenm");
        
        if(strMvTarget == "mvt" && encoder_zone != "" && encoder_fbox != "") {
            $.cookie('encoder_req_yn',    'Y',            { expires: 0, path : WebROOT, secure : true });
            $.cookie('encoder_zone',    encoder_zone,    { expires: 0, path : WebROOT, secure : true });
            $.cookie('encoder_fbox',    encoder_fbox,    { expires: 0, path : WebROOT, secure : true });
        }
        
        window.location.href="/console/d/osadvcdnlist";
    }
}

function get_encoder_flag(dest_zcopy, dest_name) {
    var return_flag = "N";
    var params = {command:"get_encoder_flag", mem_sq:$.cookie("memsq"), zcopy:dest_zcopy, fboxname:dest_name, group_mem_sq : group_mem_sq};
        
    $.ajax({
        url : "/ssSvc",
        type : "POST",
        data : params,
        dataType : "json",
        async: false,
        success : function(json) {
            if(json.XmlRoot.info.code == "200") {
                if(json.XmlRoot.info.msg == "Y") {
                    return_flag = "Y";
                }
            }
        }
    });

    return return_flag;
}

function button_cdnStop_event(e) {
    e.preventDefault();
    if($(this).hasClass("action_disabled")){
        return false;
    }
    event_cdnStop(e);
}

function setEventCheckbox(){

    $("input:checkbox.chkbox").bind("change", function(){
        
        var chkbox = $(this);
        var label = chkbox.parent("label.m_chkwrap, label.chkwrap");
        
        if( chkbox.is(":checked") ){
            label.removeClass("on").addClass("on");
        }else{
            label.removeClass("on");
        }
        
    });
    
}


//검색 목록 START ==================================================================================================================
var fieldNames = [];
var setSearchNames = [];
function dataSetting(){
    var stateNames = [];
    var tempNames = [];
    fieldNames = [{name : objLang.status, className : "test2"}];
    
    // 종류 데이터 셋팅
    stateNames = [{name : objLang.all, value : "", className : "type"},
                  {name : objLang.use, value : "03", className : "type2"},  
                  {name : objLang.stop, value : "04", className : "type4"}];
    
     // 종류 데이터 셋팅
    for(var i=0; i<fieldNames.length; i++){
        if(i == 0){
            tempNames = stateNames;
        }
        setSearchNames.push({
            name : fieldNames[i].name,
            className : fieldNames[i].className,
            value : tempNames
            
        });
    }
}
function clickSearch(){
    $("#searchWord").find("span").remove();
    $("#sch_word").show();
    $("#searchDiv").addClass('box_bottom_line');
    $("#sch_word").val("");
    // 검색 초기값 셋팅
    dataSetting();
    searchBox(fieldNames);
}

function listSearch(data){
    var searchName = $(data).find('a').text();
    var fields = [];
    
    $("#searchDiv").find("dl").removeClass('dp_on');
    $("#searchDiv").find("dl").addClass('dp_off');
    $("#sch_word").val("");
    if($("#searchWord").find("#firstName").length > 0){
        $("#searchWord").append('<span onclick="depthAction()" id="secondName" class="'+$(data).find("a").attr("class")+'">'+searchName+'</span>');
        $("#sch_word").hide();
        $("#sch_word").removeAttr('onclick');
        $("#searchDiv").removeClass('box_bottom_line');
        var firstName = $("#firstName").text();
        // 선택한 Value 가져오기 START =======================
        for(var i=0; i<setSearchNames.length; i++){
            if(firstName == setSearchNames[i].name){
                var values = setSearchNames[i].value;
                for(var j=0; j<values.length; j++){
                    if(searchName == values[j].name){
                        $("#searchWord").data("value",values[j].value);
                        // 서버쪽만 해당함!!!!!!!!
                        if(firstName == "Zone"){
                            $("#select_zone").val(values[j].value);
                        }
                    }
                }
            }
        }
    } else {
        $("#searchWord").append('<span onclick="clickSearch()" id="firstName" class="'+$(data).find("a").attr("class")+'">'+searchName+'<img style="vertical-align: middle;" src="/images/c_common/pagination_next_01_sel.png"/></span>');
        $("#searchDiv").data("name", searchName);
    }
    
    if(searchName == '서비스명'){ // cdn에선 안씀
        $("#sch_word").removeAttr('onclick');
    } 
    for(i=0; i<setSearchNames.length; i++){
        if(setSearchNames[i].name == searchName){
            fields = setSearchNames[i].value;
        }
    }
    searchBox(fields);
}
function depthAction(){
    var searchName = $("#searchDiv").data("name")
    $("#sch_word").show();
    $("#searchDiv").addClass('box_bottom_line');
    $("#sch_word").val("");
    $("#searchWord").find("#secondName").remove();
    $("#searchDiv").find("dl").removeClass('dp_on');
    $("#searchDiv").find("dl").addClass('dp_off');
    var fields = [];
    for(var i=0; i<setSearchNames.length; i++){
        if(setSearchNames[i].name == searchName){
            fields = setSearchNames[i].value;
        }
    }
    searchBox(fields);
}

function searchBox(fields){
    $("#searchDiv").find(".dl_search").remove();
    $("#searchDiv").find("dd").removeClass();
    for(var i=0; i<fields.length; i++){
        var dlName = $("#searchName").clone(true).addClass("dl_search");
        dlName.find("a").text(fields[i].name);
        dlName.find("a").addClass(fields[i].className);
        $("#searchName").data("value", fields[i].value);
        dlName.find("a").attr("value", fields[i].value);
        dlName.show();
        
        $("#searchDl").append(dlName);
    }
    if($("#searchDiv").find("dl").attr("class") == "depth_scr dp_off"){
        $("#searchDiv").find("dl").removeClass('dp_off');
        $("#searchDiv").find("dl").addClass('dp_on');
    } else {
        $("#searchDiv").find("dl").removeClass('dp_on');
        $("#searchDiv").find("dl").addClass('dp_off');
        $("#sch_word").attr("onclick","clickSearch()");
    }
}

//검색 목록 END ==================================================================================================================


function refreshSearch(){
    clickSearch();
    $("#searchDiv").find("dl").removeClass('dp_on').addClass('dp_off');
    $("#button_vmSearch").click();
}

//오리진 경로 추가
function add_origin_path(){
    var td_base = $("#originsPathArea").find("#originsPath_span");
    var td_temp = td_base.clone(true).addClass("originsPath_" + origin_path_seq).addClass("check");
    
    td_temp.find("#addoriginspath").hide();
    td_temp.find("#deloriginspath").show();
    
    td_temp.find("#deloriginspath").attr("href","javascript:del_origin_path('"+origin_path_seq+"');");
    
    origin_path_seq++;
    
    $('.originsPath').val("");
    
    $("#originsPathArea").append(td_temp);
}

function addDivOrigins(){
    var checkdata3 = $(":input:radio[name=hostHd]:checked").val();
    var checkdata5 = null;

    checkdata5 = trim($("#step1_org_serverName").val());
    if(!checkdata5.length > 0){
        showCommonNoLangErrorMsg("입력값 에러 : 원본 컨텐츠 서버", "필수 입력값입니다. 입력하여 주십시오.");
        return false;
    }
    if( !CheckChar(checkdata5) ){
        showCommonNoLangErrorMsg("입력값 에러 : 원본 컨텐츠 서버", "영문, 숫자, 점(.), 콤마(,), 하이픈(-) 만 입력 가능합니다.");
        return false;
    }
    if(!http_port_chk){
        showCommonNoLangErrorMsg("입력값 에러","HTTP Port를 정확히 입력해 주십시오.");
        return false;
    }
    if(checkdata3 == "ORIGIN_HOSTNAME"){
        //200722_다중선택시 Incoming Host Header만 선택 가능하도록
        showCommonNoLangErrorMsg("안내","오리진 설정을 추가하실 경우, 호스트 헤더의 전달을 Incoming Host Header만 설정 가능합니다.");
        return false;
    }



    var td_base = $("#addOriginsArea");
    var td_temp = td_base.clone(true).attr("id", "addOriginsArea_" + origin_path_seq).css("border", "1px solid #e5e5e5");

    td_temp.find("input:radio[name=org_select]").attr("id", "org_select_"+ origin_path_seq).attr("name", "org_select_"+origin_path_seq).attr("disabled", true);
    td_temp.find("#step1_org_serverName").attr("id", "step1_org_serverName_"+ origin_path_seq).attr("readonly", true)
    td_temp.find("#http_port").attr("id", "http_port_"+ origin_path_seq).attr("readonly", true)
    td_temp.find("#originsPath").attr("id", "originsPath_"+ origin_path_seq).attr("readonly", true)
    td_temp.find("input:radio[name=hostHd]").attr("id", "hostHd_"+ origin_path_seq).attr("name", "hostHd_"+origin_path_seq).attr("disabled", true);
    td_temp.find("#originHN").attr("id", "originHN_"+ origin_path_seq).attr("readonly", true)
    td_temp.find("#delete_origins_area").show();
    td_temp.find("#delete_origins_area").attr("href","javascript:del_origin_area('"+origin_path_seq+"');");

    origin_path_seq++;

    $("#addOriginsCommon").last().after(td_temp);
    $("#addOriginsCommon").last().after('<br/>');

    $("#step1_org_serverName").val("");
    $("#originsPath").val("");
    $("#originHN").val("");
}

//오리진 경로 삭제
function del_origin_path(del_index){
    $(".originsPath_" + del_index).remove();
}

//오리진 추가 설정
function del_origin_area(del_index){
    $("#addOriginsArea_" + del_index).remove();
}

function set_group_select2(){
    var html_str = '';
    var group_user_change_select = $("#group_user_change_select");
    group_user_change_select.html(html_str);
    var params={
            command : "getGroupUserSelect",
            mem_sq : $.cookie("memsq")
    };
    
    $.ajax({
         url: "/ssvList"
        , type : "GET"
        , data : params
        , dataType : "json"
        , success : function(json) {
            console.log(json)
            // if(json.status == "0") {
            //     var items = json.data;
            //     if(items != null && items.length > 0){
            //         items.sort(custonSort);
            //         for(var i = 0; i < items.length ; i++){
            //             if ($.cookie("groupmemsq")== null || $.cookie("groupmemsq") == "") {
            //                 if(items[i].mem_sq==$.cookie("memsq")){
            //                     group_mem_sq = items[i].mem_sq;
            //                     group_mem_nm = items[i].mem_nm;
            //                     group_mem_id = items[i].mem_id;
            //                     set_group_select_one(items[i].mem_id, items[i].mem_nm);//2018_memid_세션처리_kjs_0723_그룹계정처리
            //                 }
            //             }
                        
            //             html_str += '<li><a href="javascript:event_group_user_change(\''+items[i].mem_sq+'\',\''+items[i].mem_nm+'\',\''+items[i].mem_id+'\');" ><span>'+items[i].mem_id + ':' + items[i].mem_nm+'</span></a></li>';
                        
            //         }
            //         group_user_change_select.html(html_str);
            //         $("#group_div").show().css('display', '');

            //     }
            // }
        }
        ,  error: function(XMLHttpResponse) {
            showCommonLangErrorMsg("txt_lang_error", "txt_lang_qna");
        }
    });
    
    
    if ($.cookie("groupmemsq")== null || $.cookie("groupmemsq") == "") {
        call_vmList();
        ssGetToken();
        ssList();
        
    }else{
        set_group_select_one($.cookie("groupmemid"), $.cookie("groupmemnm"));
        group_mem_sq = $.cookie("groupmemsq");
        group_mem_nm = $.cookie("groupmemnm");
        group_mem_id = $.cookie("groupmemid");
        set_group_member_info();
    }
}

function custonSort(a, b) {
    if(a.mem_id == b.mem_id){
        return 0;
    }
    return a.mem_id > b.mem_id ? 1 : -1;
}



//그룹유저 변경 이벤트
function event_group_user_change(temp_str0,temp_str1,temp_str2){
    group_mem_sq = temp_str0;
    group_mem_nm = temp_str1;
    group_mem_id = temp_str2;
    $.cookie('groupmemsq',    group_mem_sq,    { expires: 0, path : WebROOT, secure : true});
    $.cookie('groupmemnm',    group_mem_nm,    { expires: 0, path : WebROOT, secure : true});
    $.cookie('groupmemid',    group_mem_id,    { expires: 0, path : WebROOT, secure : true});
    

    set_group_select_one(group_mem_id, group_mem_nm);
    set_group_member_info();

    activate_cnb('cdn_new', 'cdn_list_new');
    activate_lnb('cdn_new');
    cnb_resource_count('cdn_new');

    location.replace("/console/d/osadvcdnlist");
}

function mouseEnter(obj) {
    if ($(".vm_searchArea").find("#sel_sch_word").css('display') == "none") {
        $(".vm_searchArea").addClass("bc_mint");
        $(".vm_searchArea").find("#sel_sch_word").css('display','');
    }
}
function mouseLeave(obj) {
    if ($(".vm_searchArea").find("#sel_sch_word").css('display') == 'block') {
        var schWord = $(".vm_searchArea").find("#sel_sch_word").val();
        if (schWord == undefined || schWord == "") {
            $(".vm_searchArea").removeClass("bc_mint");
            $(".vm_searchArea").find("#sel_sch_word").css('display','none');
        }
    }
}
function event_usable_port(data) {
    if($(data).hasClass("action_disabled")) {
        return;
    }
        commonDialogInit($("#popup_usable_port"));
        $("#popup_usable_port").dialog("open");
        $("#popup_usable_port").find("#btn_usable_port_close").unbind("click").bind("click" , closeDetailPop);
        function closeDetailPop(){
            $("#popup_usable_port").dialog("close");
        }
}

function getCountryCode(){
    showLoadingBox();    // 로딩중 이미지
    
    var params = {};
    
    params.command = "getCountryCode";

    $.ajax({
        url : "/cdnSvc"
        , type : "POST"
        , data : params
        , dataType : "json"
        , complete : function () {
            hideLoadingBox();    // 로딩중 이미지 닫기
        }
        , success : function(json) {
	
            let county_code = json.countrycode;
            for(var i = 0; i < county_code.length-1 ; i++) {
	            for(var j = i+1; j < county_code.length ; j++) {
	                if(county_code[i].ko_country > county_code[j].ko_country){
	                    var temp = county_code[i];
	                    county_code[i] = county_code[j];
	                    county_code[j] = temp;
	                }
	            }
            }
            $("#country_list").empty();
            county_code.forEach(item =>{
				let base_country_option = `<option value="${item.code}">${item.ko_country}(${item.en_country}, ${item.code})</option>`;
				$("#country_list").append(base_country_option);
			
			});
            selectbox_design($("#country_list"));
        }
    });
}

function showMsg(title_cls, msg_cls, close_function){

    $("#dialogCommonErrorMsg").remove();
    var el_dialog = $("#dialogCommonErrorMsg");
    if (el_dialog.html() == null) {
        var arrHtml        = [];
        arrHtml.push('    <div class="popUp" id="dialogCommonErrorMsg" style="width:500px;top:auto !important; display:none;"> ');
        arrHtml.push('    <div class="head htpop clfix">');
        arrHtml.push('    <h1> <span class="del" id="commonErrMsgCloseX"><a href="#"><img src="/images/coni/Cancel.svg" alt=""></a></span></h1> ');
        arrHtml.push('    </div> ');
        arrHtml.push('    <div class="body"> ');
        arrHtml.push('    <div class="con ac"> ');
        arrHtml.push('    <p class="box_txtl ac mt20" id="commonErrMsgDesc"></p> ');
        arrHtml.push('    <div class="btn_box mt40"> ');
        arrHtml.push('    <div> ');
        arrHtml.push('    <div id="commonErrMsgClose" class="pop_btn_right btnl_primary"><a id="commonErrChk" href="#">확인</a></div> ');
        arrHtml.push('    </div></div></div></div></div> ');

        $(arrHtml.join("")).appendTo("body");

        el_dialog = $("#dialogCommonErrorMsg");
    }

    var opt    = {};

    if (typeof close_function == "function") {
        opt.close_function    = close_function;
    }

    commonDialogInit(el_dialog, opt);

    //msg
    $("#commonErrMsgDesc").html(msg_cls);
    //확인버튼
    var returnVal = get_console_messages("txt_lang_confirm");
    $("#commonErrChk").html(returnVal);
    //다국어 적용 end

    el_dialog.dialog("open");
    add_active_popup(el_dialog.attr("id"));

    el_dialog.keydown(press_enter)
    function press_enter(key) {
        if (key.keyCode == 13){
            el_dialog.dialog("close");
        }
    }

    $("#commonErrMsgClose", el_dialog).unbind("click").bind("click", function(e) {    //닫기
        e.preventDefault();
        el_dialog.dialog("close");
        window.location.reload();
    });
}

//적용된 인증서 조회
function getApplyCertificates(serviceId){

    applyCertiData = null;
    
    let params = {
        command : "applyCertificates",
        service : "CDN",
        serviceId : serviceId
    };
    
    $.ajax({
        url: "/isSvcSvrPrc",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(json) {    
            applyCertiData = json?.data;
            
            $("#text_cdn_certi").text(applyCertiData?.name); //상세정보 SSL인증서
            $("#txt_sel_certificate").val(applyCertiData?.name); //프로토콜
            
        }
    });
}

// //message Box 보이기(로딩)
// function showLoadingBox( img_url ){
//     var loadingBox = jQuery("#dialog_loading_box");
//     //if( loadingBox.html() == null) {
//         makeLoadingBox();
//         loadingBox = jQuery("#dialog_loading_box");
//     //}
        
//     loadingBox.dialog({ 
//         width : 490,
//         height : 260,
//         autoOpen : false,
//         modal : true,
//         resizable : false,
//         draggable:false,
//         zIndex : 2000,
//         closeOnEscape: false,
//         dialogClass : "border_0",
//         close : function (event, ui) {
//             //close:
//         }
//     });
//     $("#dialog_loading_box").siblings().remove();
//     $("#dialog_loading_box").css("padding" , "0");
//     $("#dialog_loading_box").parent().css("padding" , "0");

//     if( img_url != undefined && img_url != "" ) {
//         jQuery(".ok_pbox01 > img", loadingBox).attr("src", img_url);
//     }
    
//     jQuery(".ui-dialog-titlebar", loadingBox.parent()).hide();
//     loadingBox.removeClass('ui-dialog-content');
//     loadingBox.removeClass('ui-widget-content').parent().removeClass('ui-widget-content');
//     loadingBox.css('width','100vw').css('height','100vh');
//     var div_width = loadingBox.width()/2-50;
//     var div_height = loadingBox.height()/2-50;
//     //alert(div_width+", "+div_height);
//     //loadingBox.css("padding-left",div_width).css("padding-top",div_height);
//     loadingBox.dialog("open");
    
//     $(".ui-widget-overlay").css("background", "#fff").css("opacity", ".9").css("filter", "Alpha(Opacity=90)");
    
// }

function makeLoadingBoxProgress()
{
    var arrHtml = [];
    $("#dialog_loading_box_progress").remove();
    var wait = "현재 진행 상태";
    var waitTitle = "요청하신 작업을 진행 중입니다.";
    
    if(get_lang_cookie() == "en") {
        wait = "Current status of progress";
        waitTitle = "요청하신 작업을 진행 중입니다.";
    }
    
    arrHtml.push("    <div id=\"dialog_loading_box_progress\" class=\"popup popLoading ok_pbox01\" style=\"display:none; background: black;" +
                                    "background:url('../../images/common/progress_back.png') no-repeat left top;\" >");
    arrHtml.push("        <div id=\"dialog_\" class=\"popup popLoading ok_pbox01 ac\" style=\"padding-top: 30px; margin:0 auto; width:229px;\" >");
    arrHtml.push("            <span class=\"\" style=\"font-size:14px; color:white;\">" + waitTitle + "</span>");
    arrHtml.push("        </div>");
    arrHtml.push("        <div id=\"dialog_loading\" class=\"popup popLoading ok_pbox01 mt10\" style=\"\">");
    arrHtml.push("            <div id=\"dialog_progress_bar_def\" class=\"popup popLoading ok_pbox01\" style=\"height:8px; width:100%;\">");
    arrHtml.push("                <div class=\"ac\" style=\"position: relative; border:1px solid #cfafaf; margin: 0 auto; width:229px; height:8px;\">");
    arrHtml.push("                    <div id=\"dialog_progress_bar_succ\" class=\"popup popLoading ok_pbox01\" style=\"position: absolute; height:8px; " +
                                                "width:100%; right:0px;    background:url('../../images/common/progress_bg.gif') no-repeat left top;\">");
    arrHtml.push("                    </div>");
    arrHtml.push("                    <img class='loading' src=\"../../images/common/progress_bar.gif\" alt=\"로딩 이미지\" />");
    arrHtml.push("                </div>");
    arrHtml.push("            </div>");
    arrHtml.push("        </div>");
    arrHtml.push("        <div id=\"dialog_loading_box_img\" class=\"popup popLoading ok_pbox01 ac mt10\" style=\"margin:0 auto; width:229px;\">");
    arrHtml.push("            <span class=\"\" style=\"font-size:13px; color:white;\">" + wait + "</span>");
    arrHtml.push("            <span class=\"ml5\" style=\"font-size:13px; color:white;\">:</span>");
    arrHtml.push("            <span id=\"dialog_percent\"class=\"ml5\" style=\"font-size:13px; color:white;\">0 %</span>");
    arrHtml.push("        </div>");
    arrHtml.push("    </div>");
    
    jQuery(arrHtml.join("\n")).appendTo(jQuery("body"));
}
