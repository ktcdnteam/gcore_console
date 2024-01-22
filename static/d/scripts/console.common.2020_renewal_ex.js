var s3 = "";
var ss = "";
// var backup_menu_show="N";
var active_member_service_list =[];
var WebROOT    = "/";

// var backup_service_list = [
//     {servicename:"backup",         mainservice:"Y",    servicecode:"S1851",    serviceurl:"/console/d/osbackuplist",        displayname:"Server Backup",     imageclass:"m22", activeYN:"N"},
//     {servicename:"pcbackup",    mainservice:"Y",    servicecode:"S3659",    serviceurl:"/console/d/ospcbackuplist",    displayname:"PC Backup",        imageclass:"m22", activeYN:"N"}
// ];

var service_basic_data =
    [
        {servicename:"server",             mainservice:"Y",    servicecode:"S4723",    serviceurl:"/console/d/osserver",                displayname:"Server",             imageclass:"m1"},
        {servicename:"watch",             mainservice:"N",    servicecode:"S4723",    serviceurl:"/console/d/oswatch",                    displayname:"Watch",             imageclass:"m2"},
        {servicename:"apikey",             mainservice:"N",    servicecode:"S4723",    serviceurl:"/console/d/ostoken",            displayname:"Token",     imageclass:"m4"},
        {servicename:"autoscaling",     mainservice:"N",    servicecode:"S4723",    serviceurl:"/console/d/osautoscalinggrouplist",    displayname:"Auto Scaling",     imageclass:"m6"},
        {servicename:"messaging",         mainservice:"N",    servicecode:"S4723",    serviceurl:"/console/d/osmessaging",                displayname:"Messaging",         imageclass:"m8"},
        {servicename:"hybridcloud",     mainservice:"N",    servicecode:"S4723",    serviceurl:"/console/d/osconnecthub",            displayname:"Network",             imageclass:"m33"},
        // 20231117 CM 추가
        {servicename:"certificatemanager",     mainservice:"N",    servicecode:"S4723",    serviceurl:"/console/d/osconnecthub",            displayname:"Certificate Manager",             imageclass:"m33"},


        {servicename:"loadbalancer",     mainservice:"Y",    servicecode:"S1879",    serviceurl:"/console/d/osmpxlist",        displayname:"Load Balancer",     imageclass:"m3"},
        // {servicename:"backup",             mainservice:"Y",    servicecode:"S1851",    serviceurl:"/console/d/osbackuplist",                displayname:"Backup",             imageclass:"m22"},
        {servicename:"storage",         mainservice:"Y",    servicecode:"S1853",    serviceurl:"/console/d/osstoragelist",            displayname:"Storage",             imageclass:"m12"},
        {servicename:"storage2",         mainservice:"N",    servicecode:"S1853",    serviceurl:"/console/d/osstoragelistEC",            displayname:"Storage 2.0",         imageclass:"m13"},
        {servicename:"storage3",         mainservice:"Y",    servicecode:"S1853",    serviceurl:"/console/d/osstoragelist3",            displayname:"Storage 3.0",         imageclass:"m13"},
        {servicename:"disitalworks",     mainservice:"Y",    servicecode:"S4747",    serviceurl:"/console/d/osdisitalworkslist",            displayname:"KT Digital Works",         imageclass:"m26"},
        {servicename:"cdn_new",         mainservice:"Y",    servicecode:"S4599",    serviceurl:"/console/d/osadvcdnlist",            displayname:"CDN Edge",             imageclass:"m14"},
        {servicename:"datalake",         mainservice:"Y",    servicecode:"S4729",    serviceurl:"/console/d/osdatalakendc",            displayname:"Data Lake",             imageclass:"m14"},
        {servicename:"iotmakers",         mainservice:"Y",    servicecode:"S4731",        serviceurl:"/console/d/osiotmakerslist",            displayname:"IoTMakers",         imageclass:"m38"},
        {servicename:"waf",             mainservice:"Y",    servicecode:"S1963",    serviceurl:"/console/d/oswaflist",                displayname:"WAF",                 imageclass:"m23"},
        {servicename:"wafpro",             mainservice:"Y",    servicecode:"S4304",    serviceurl:"/console/d/oswafprolist",            displayname:"WAF Pro",             imageclass:"m23"},

        // {servicename:"devops",             mainservice:"Y",    servicecode:"S4723",    serviceurl:"/console/d/osdevopssuitelist",            displayname:"DevOps Suite",     imageclass:"m29"},
        {servicename:"k2p",         mainservice:"Y",    servicecode:"S5246",    serviceurl:"/console/d/oscontainerentlist",        displayname:"K2P",     imageclass:"m25"},
        {servicename:"flyingcube",         mainservice:"Y",    servicecode:"S4994",    serviceurl:"/console/d/osflyingcube",        displayname:"KCI",     imageclass:"m46"},
        {servicename:"nas",             mainservice:"Y",    servicecode:"S2248",    serviceurl:"/console/d/osnaslist",                displayname:"NAS",                 imageclass:"m11"},
        {servicename:"aistudio",        mainservice:"Y",    servicecode:"S4795",    serviceurl:"/console/d/osaisconsulting",                displayname:"AI Studio",                 imageclass:"m41"},

        {servicename:"gslb",             mainservice:"Y",    servicecode:"S2237",    serviceurl:"/console/d/osgslblist",                displayname:"GSLB",             imageclass:"m19"},

        {servicename:"aiapi",             mainservice:"Y",    servicecode:"S4226",    serviceurl:"/console/d/osaiapp",                displayname:"AI API",             imageclass:"m41"},

        {servicename:"linkhybridcloud", mainservice:"Y",    servicecode:"S4600",    serviceurl:"/console/g/hybridcloud",        displayname:"Hybrid Cloud Mgmt. Platform",     imageclass:"m43"},

        {servicename:"connecthub",         mainservice:"Y",    servicecode:"S4330",    serviceurl:"/console/d/osconnecthub",                displayname:"Connect Hub",         imageclass:"m21"},

        {servicename:"gotalkto",     mainservice:"Y",    servicecode:"S4601",    serviceurl:"/console/d/osgotalkto",        displayname:"Gotalk.to",     imageclass:"m2"},
        {servicename:"videohelpme", mainservice:"Y",    servicecode:"S4603",    serviceurl:"/console/d/osvideohelpme",    displayname:"Videohelp.me", imageclass:"m2"},
        {servicename:"dns",         mainservice:"Y",    servicecode:"S4846",    serviceurl:"/console/d/osdns",         displayname:"Private DNS",      imageclass:"m48"},

        {servicename:"mysql8", mainservice:"Y",    servicecode:"S5244",    serviceurl:"/console/d/osmysql-dbinstance",    displayname:"DBaaS for MySQL 8", imageclass:"m15"},
        {servicename:"redis", mainservice:"Y",    servicecode:"S4843",    serviceurl:"/console/d/osredis",    displayname:"DBaaS for Redis", imageclass:"m15"},
        {servicename:"jeus",       mainservice:"Y",    servicecode:"S4553",    serviceurl:"/console/d/osserver",       displayname:"JEUS",    imageclass:"m1"},
        {servicename:"webtob",     mainservice:"Y",    servicecode:"S4552",    serviceurl:"/console/d/osserver",       displayname:"WebtoB",    imageclass:"m1"},
        {servicename:"tiberodb",     mainservice:"Y",    servicecode:"S4549",    serviceurl:"/console/d/osserver",       displayname:"Tibero Standard",    imageclass:"m1"},
        //20230906 코드재정의
        //{servicename:"tiberoce",     mainservice:"Y",    servicecode:"S5172",    serviceurl:"/console/d/osserver",       displayname:"Tibero Cloud",    imageclass:"m1"},
        //{servicename:"tiberotac",     mainservice:"Y",    servicecode:"S5173",    serviceurl:"/console/d/osserver",       displayname:"Tibero TAC",    imageclass:"m1"},

        {servicename:"ezml",     mainservice:"Y",    servicecode:"S5177",    serviceurl:"/console/d/osezml",       displayname:"EZML",    imageclass:"m41"},

        {servicename:"apigw",     mainservice:"Y",    servicecode:"S5242",    serviceurl:"/console/d/osapigw-list",       displayname:"API Gateway",    imageclass:"m41"},
        {servicename:"serverless",      mainservice:"Y",    servicecode:"S5148",    serviceurl:"/console/d/osserverless",            displayname:"Serverless",    imageclass:"m1"},
        {servicename:"education",      mainservice:"Y",    servicecode:"S4723",    serviceurl:"/console/d/oscontainerlab",            displayname:"Education",    imageclass:"m25"},
        {servicename:"mariadb",     mainservice:"Y",    servicecode:"S5507",    serviceurl:"/console/d/osmaria-dbinstance",    displayname:"DBaaS for MariaDB", imageclass:"m15"},
        {servicename:"postgresql",  mainservice:"Y",    servicecode:"S5505",    serviceurl:"/console/d/ospostgresql-dbinstance",    displayname:"DBaaS for PostgreSQL", imageclass:"m15"},
        {servicename:"cleanzone",  mainservice:"Y",    servicecode:"S5479",    serviceurl:"/console/d/clean-zone/management",            displayname:"클린존",    imageclass:"m25"},
        // 20230627 One Backup 추가
        {servicename:"onebackup",     mainservice:"Y",    servicecode:"S5015",    serviceurl:"/console/d/osonebackup",        displayname:"One Backup",     imageclass:"m20"},
        // 20230912 AI SERV 추가
        {servicename:"aiserv",     mainservice:"Y",    servicecode:"S5577",    serviceurl:"/console/d/osaiserv",        displayname:"AI SERV",     imageclass:"m20"},
        // 20231018 Private CA 추가
        {servicename:"privateca",     mainservice:"Y",    servicecode:"S-PCA",    serviceurl:"/console/d/private-ca/management",        displayname:"Private CA",     imageclass:"m20"}

    ];

var sub_service_data = [
    {mainservice:"server",             subservice:"server_list",                serviceurl:"/console/d/osserver",            displayname:"Server"},
    {mainservice:"server",             subservice:"server_network",            serviceurl:"/console/d/osnetwork",        displayname:"Networking"},
    {mainservice:"server",             subservice:"tier",            serviceurl:"/console/d/ostier",        displayname:"Tier"},
    {mainservice:"server",             subservice:"server_template",            serviceurl:"/console/d/ostemplate",            displayname:"Server Image"},
    {mainservice:"server",             subservice:"server_disk",                serviceurl:"/console/d/osvolume",            displayname:"Volume"},
    {mainservice:"server",             subservice:"server_snapshot",            serviceurl:"/console/d/ossnapshot",        displayname:"Volume Snapshot"},
    {mainservice:"server",             subservice:"server_network_traffic",    serviceurl:"/console/d/osnetworktraffic",        displayname:"Traffic"},
    {mainservice:"server",             subservice:"server_sshkey",                serviceurl:"/console/d/ossshkey",                displayname:"SSH Key Pair"},
    {mainservice:"server",             subservice:"serverlog_history",            serviceurl:"/console/d/osserverloghistory",    displayname:"Log History"},
    {mainservice:"server",          subservice:"server_virtualip",                  serviceurl:"/console/d/osvirtualip",                      displayname:"Virtual IP"},

    //{mainservice:"watch",             subservice:"monitoring_watch",            serviceurl:"/console/d/oswatch",                displayname:"Watch"},
    {mainservice:"watch",             subservice:"monitoring_alarm",            serviceurl:"/console/d/osalarm",                displayname:"Alarm"},


    {mainservice:"apikey",             subservice:"server_apikey",                serviceurl:"/console/d/ostoken",        displayname:"Token"},
    {mainservice:"autoscaling",     subservice:"autoscaling_launchconfig",    serviceurl:"/console/d/oslaunchconfigurationlist",    displayname:"Launch Configuration"},
    {mainservice:"autoscaling",     subservice:"autoscaling_group",            serviceurl:"/console/d/osautoscalinggrouplist",        displayname:"Auto Scaling Group"},
    {mainservice:"autoscaling",     subservice:"autoscaling_schedule",        serviceurl:"/console/d/osschedulelist",                displayname:"Schedule"},
    {mainservice:"loadbalancer",     subservice:"loadbalancer",                serviceurl:"/console/d/osmpxlist",            displayname:"Load Balancer"},
    {mainservice:"loadbalancer",     subservice:"mpx_network_traffic",        serviceurl:"/console/d/osmpxtraffic",        displayname:"Traffic"},
    {mainservice:"loadbalancer",     subservice:"mpx_log_history",            serviceurl:"/console/d/osmpxloghistory",    displayname:"Log History"},

    {mainservice:"storage",         subservice:"storage_list",            serviceurl:"/console/d/osstoragelist",            displayname:"Storage"},
    {mainservice:"storage",         subservice:"storage_stat_list",        serviceurl:"/console/d/osstoragestatistics",    displayname:"Statistics"},
    {mainservice:"storage",         subservice:"storage_resel_list",    serviceurl:"/console/d/osreseller",                displayname:"Reseller Account"},
    {mainservice:"storage",         subservice:"storage_apkey_list",    serviceurl:"/console/d/osstorageapikey",        displayname:"API Key"},

    {mainservice:"storage2",         subservice:"storage_list_ec",        serviceurl:"/console/d/osstoragelistEC",        displayname:"Storage 2.0"},
    {mainservice:"storage3",         subservice:"storage_list3",        serviceurl:"/console/d/osstoragelist3",        displayname:"Storage 3.0"},
    {mainservice:"storage3",         subservice:"storage_apkey_list_3",    serviceurl:"/console/d/oss3apikey",        displayname:"API Key"},
    {mainservice:"storage3",         subservice:"storage_stat_list_3",    serviceurl:"/console/d/osstoragestatistics3",        displayname:"Statistics"},
    {mainservice:"storage2",         subservice:"storage_stat_list_ec",    serviceurl:"/console/d/osstoragestatisticsEC",    displayname:"Statistics"},
    {mainservice:"storage2",         subservice:"storage_apkey_list_ec",    serviceurl:"/console/d/osstorageapikeyEC",        displayname:"API Key"},

    {mainservice:"disitalworks",     subservice:"works_list",            serviceurl:"/console/d/osdisitalworkslist",        displayname:"KT Works"},

    {mainservice:"cdn_new",         subservice:"cdn_list_new",            serviceurl:"/console/d/osadvcdnlist",    displayname:"CDN Edge"},
    {mainservice:"cdn_new",         subservice:"cdn_statistics_new",    serviceurl:"/console/d/osadvcdnstatistics",        displayname:"Statistics"},

    // 20230823 Data Lake 상품 일부 메뉴 삭제 및 이름 변경 적용
    {mainservice:"datalake",         subservice:"datalake_ndc",        serviceurl:"/console/d/osdatalakendc",        displayname:"Data Lake Instance"},
    //{mainservice:"datalake",         subservice:"datalake_ndap",        serviceurl:"/console/d/osdatalakendap",        displayname:"NDAP 단독형"},
    //{mainservice:"datalake",         subservice:"datalake_ne",        serviceurl:"/console/d/osdatalakene",        displayname:"NE 구독형"},
    //{mainservice:"datalake",         subservice:"datalake_list",        serviceurl:"/console/d/osdatalakelist",        displayname:"NE 단독형"},
    //{mainservice:"datalake",         subservice:"datalake_consulting",        serviceurl:"/console/d/osdatalakeconsulting",        displayname:"NE 맞춤형"},
    {mainservice:"iotmakers",         subservice:"iotmakers_list",    serviceurl:"/console/d/osiotmakerslist",    displayname:"IoTMakers"},
    {mainservice:"waf",             subservice:"waf_list",            serviceurl:"/console/d/oswaflist",                    displayname:"WAF"},
    {mainservice:"wafpro",             subservice:"wafpro_list",        serviceurl:"/console/d/oswafprolist",                displayname:"WAF Pro"},

    //{mainservice:"devops",         		subservice:"container_list",    serviceurl:"/console/d/oscontainerlist",            displayname:"DevOps Suite(K2P) Cluster"},
    //{mainservice:"devops",             subservice:"devops_list",    serviceurl:"/console/d/osdevopssuitelist",            displayname:"DevOps Suite(K2P)"},
    //{mainservice:"devops",             subservice:"kci_devops_list",    serviceurl:"/console/d/oskcidevopssuitelist",            displayname:"DevOps Suite(KCI)"},

    {mainservice:"k2p",         subservice:"container_ent_list",    serviceurl:"/console/d/oscontainerentlist",            displayname:"Enterprise (OKD)"},
    {mainservice:"k2p",         subservice:"container_stand_list",    serviceurl:"/console/d/oscontainerstandlist",            displayname:"Standard (K8S)"},
    {mainservice:"k2p",         subservice:"container_list",    serviceurl:"/console/d/oscontainerlist",            displayname:"OKD 3.11 Cluster"},
    {mainservice:"flyingcube",         subservice:"namespace_list",    serviceurl:"/console/d/osflyingcube",            displayname:"NameSpace"},

    {mainservice:"messaging",         subservice:"messaging_dashboard",    serviceurl:"/console/d/osmessaging",                displayname:"Dashboard"},
    {mainservice:"messaging",         subservice:"messaging_subscribe",    serviceurl:"/console/d/ossubscribe",                displayname:"Subscribe"},
    {mainservice:"messaging",         subservice:"messaging_topic",        serviceurl:"/console/d/ostopic",                    displayname:"Topic"},
    {mainservice:"messaging",         subservice:"messaging_loghistory",    serviceurl:"/console/d/osmessagingloghistory",    displayname:"Log History"},

    // {mainservice:"backup",             subservice:"backup_list",        serviceurl:"/console/d/osbackuplist",        displayname:"Server Backup",    activeYN:"N"},
    // {mainservice:"backup",             subservice:"pcbakcup_list",        serviceurl:"/console/d/ospcbackuplist",    displayname:"PC Backup",        activeYN:"N"},

    {mainservice:"nas",             subservice:"nas_volume_list",    serviceurl:"/console/d/osnaslist",            displayname:"NAS Volume"},
    {mainservice:"nas",             subservice:"nas_snapshot",        serviceurl:"/console/d/osnassnapshot",        displayname:"Snapshot"},
    {mainservice:"nas",             subservice:"nas_certify",        serviceurl:"/console/d/osnascertify",            displayname:"CIFS Authentication"},
    {mainservice:"nas",             subservice:"nas_iqn",        serviceurl:"/console/d/osnasiqn",            displayname:"IQN"},
    {mainservice:"nas",             subservice:"nas_log_history",    serviceurl:"/console/d/osnasloghistory",        displayname:"Log History"},

    {mainservice:"gslb",             subservice:"gslb_list",    serviceurl:"/console/d/osgslblist",                    displayname:"GSLB"},
    {mainservice:"gslb",             subservice:"gslb_log_history",    serviceurl:"/console/d/osgslbloghistory",    displayname:"Log History"},

    {mainservice:"aistudio",         subservice:"aistudio_consulting",        serviceurl:"/console/d/osaisconsulting",        displayname:"AI Studio 맞춤형"},
    {mainservice:"aistudio",         subservice:"aistudio_subscript",        serviceurl:"/console/d/osaistudiolist",        displayname:"AI Studio 구독형"},

    {mainservice:"hybridcloud",     subservice:"network_connecthub",        serviceurl:"/console/d/osconnecthub",            displayname:"Connect Hub"},
    {mainservice:"hybridcloud",     subservice:"network_privatevpn",        serviceurl:"/console/d/osprivatevpnlist",          displayname:"전용 VPN"},

    {mainservice:"aiapi",     subservice:"aiapi_app",            serviceurl:"/console/d/osaiapp",            displayname:"App"},
    {mainservice:"aiapi",     subservice:"aiapi_statistics",    serviceurl:"/console/d/osaistatistics",        displayname:"Statistics"},
    {mainservice:"aiapi",     subservice:"dictation_freetrial",     serviceurl:"/console/d/osdictationfree",      displayname:"지니 Dictation Free Trial"},
    {mainservice:"aiapi",     subservice:"geniememo_freetrial",     serviceurl:"/console/d/oscmfree",             displayname:"지니 Memo Free Trial"},
    {mainservice:"aiapi",     subservice:"voijce_freetrial",         serviceurl:"/console/d/osvoicefree",          displayname:"지니 Voice Free Trial"},
    {mainservice:"aiapi",     subservice:"voice_studio_freetrial",  serviceurl:"/console/d/osvoicestudiofree",    displayname:"Voice Studio Free Trial"},

    {mainservice:"linkhybridcloud",     subservice:"linkhybridcloud",        serviceurl:"/console/d/oshybridcloud",        displayname:"Hybrid Cloud Mgmt. Platform"},

    {mainservice:"gotalkto",     subservice:"linkgotalkto",        serviceurl:"/console/d/osgotalkto",        displayname:"Gotalk.to"},
    {mainservice:"videohelpme", subservice:"linkvideohelpme",    serviceurl:"/console/d/osvideohelpme",    displayname:"Videohelp.me"},
    {mainservice:"dns", subservice:"dns_list",    serviceurl:"/console/d/osdns",    displayname:"Name Server"},
    {mainservice:"dns", subservice:"dns_host",    serviceurl:"/console/d/osdnshost",    displayname:"Hosted Zone"},
    {mainservice:"dns", subservice:"dns_record",    serviceurl:"/console/d/osdnsrecord",    displayname:"Record"},
    //{mainservice:"dns", subservice:"dns_statis",    serviceurl:"/console/d/osdnsstatis",    displayname:"Statistics"},

    {mainservice:"mysql8", subservice:"osmysql_dbinstance",      serviceurl:"/console/d/osmysql-dbinstance",      displayname:"DB Instance"},
    {mainservice:"mysql8", subservice:"osmysql_backup",          serviceurl:"/console/d/osmysql-backup",          displayname:"Backup"},
    {mainservice:"mysql8", subservice:"osmysql_parameter_group", serviceurl:"/console/d/osmysql-parameter-group", displayname:"Parameter Group"},
    {mainservice:"mysql8", subservice:"osmysql_scheduling",      serviceurl:"/console/d/osmysql-scheduling",      displayname:"Scheduling"},
    {mainservice:"mysql8", subservice:"osmysql_event",           serviceurl:"/console/d/osmysql-event",           displayname:"Event"},
    {mainservice:"mysql8", subservice:"osmysql_monitoring",      serviceurl:"/console/d/osmysql-monitoring",      displayname:"Monitoring"},
    {mainservice:"mysql8", subservice:"osmysql_alarm",           serviceurl:"/console/d/osmysql-alarm",           displayname:"Alarm"},


    {mainservice:"redis", subservice:"redis_list",    serviceurl:"/console/d/osredis",    displayname:"Redis"},
    {mainservice:"redis", subservice:"redis_log_history",    serviceurl:"/console/d/osredishistory",    displayname:"Log History"},
    {mainservice:"redis", subservice:"redis_alarm",    serviceurl:"/console/d/osredisalarm",    displayname:"Alarm"},
    {mainservice:"redis", subservice:"redis_monitoring",    serviceurl:"/console/d/osredismonitor",    displayname:"Monitoring"},

    {mainservice:"ezml", subservice:"ezml_list",    serviceurl:"/console/d/osezml",    displayname:"EZML 구독형"},

    {mainservice:"apigw", subservice:"apigw_list",    serviceurl:"/console/d/osapigw-list",    displayname:"APIs"},
    {mainservice:"apigw", subservice:"apigw_usageplans",    serviceurl:"/console/d/osapigw-usageplans",    displayname:"Statistics Plans"},
    {mainservice:"apigw", subservice:"apigw_apikeys",    serviceurl:"/console/d/osapigw-apikeys",    displayname:"API Keys"},
    {mainservice:"apigw", subservice:"apigw_dashboard",    serviceurl:"/console/d/osapigw-dashboard",    displayname:"Dashboard"},

    {mainservice:"serverless", subservice:"osserverless_codeapprun",   serviceurl:"/console/d/osserverless-codeapprun", displayname:"CodeRun / AppRun"},
    {mainservice:"serverless", subservice:"osserverless_scheduler",   serviceurl:"/console/d/osserverless-scheduler", displayname:"Scheduler"},
    {mainservice:"serverless", subservice:"osserverless_imageupdater",   serviceurl:"/console/d/osserverless-imageupdater", displayname:"Image Updater"},
    {mainservice:"education", subservice:"containerlab",    serviceurl:"/console/d/oscontainerlab",    displayname:"Container LAB(Free)"},

    {mainservice:"mariadb", subservice:"osmaria_dbinstance",      serviceurl:"/console/d/osmaria-dbinstance",      displayname:"DB Instance"},
    {mainservice:"mariadb", subservice:"osmaria_backup",          serviceurl:"/console/d/osmaria-backup",          displayname:"Backup"},
    {mainservice:"mariadb", subservice:"osmaria_parameter_group", serviceurl:"/console/d/osmaria-parameter-group", displayname:"Parameter Group"},
    {mainservice:"mariadb", subservice:"osmaria_scheduling",      serviceurl:"/console/d/osmaria-scheduling",      displayname:"Scheduling"},
    {mainservice:"mariadb", subservice:"osmaria_event",           serviceurl:"/console/d/osmaria-event",           displayname:"Event"},
    {mainservice:"mariadb", subservice:"osmaria_monitoring",      serviceurl:"/console/d/osmaria-monitoring",      displayname:"Monitoring"},
    {mainservice:"mariadb", subservice:"osmaria_alarm",           serviceurl:"/console/d/osmaria-alarm",           displayname:"Alarm"},

    {mainservice:"postgresql", subservice:"ospostgresql_dbinstance",      serviceurl:"/console/d/ospostgresql-dbinstance",      displayname:"DB Instance"},
    {mainservice:"postgresql", subservice:"ospostgresql_backup",          serviceurl:"/console/d/ospostgresql-backup",          displayname:"Backup"},
    {mainservice:"postgresql", subservice:"ospostgresql_parameter_group", serviceurl:"/console/d/ospostgresql-parameter-group", displayname:"Parameter Group"},
    {mainservice:"postgresql", subservice:"ospostgresql_scheduling",      serviceurl:"/console/d/ospostgresql-scheduling",      displayname:"Scheduling"},
    {mainservice:"postgresql", subservice:"ospostgresql_event",           serviceurl:"/console/d/ospostgresql-event",           displayname:"Event"},
    {mainservice:"postgresql", subservice:"ospostgresql_monitoring",      serviceurl:"/console/d/ospostgresql-monitoring",      displayname:"Monitoring"},
    {mainservice:"postgresql", subservice:"ospostgresql_alarm",           serviceurl:"/console/d/ospostgresql-alarm",           displayname:"Alarm"},
    // 20230627 One Backup 추가
    {mainservice:"onebackup", subservice:"onebackup_host",    serviceurl:"/console/d/osonebackupHost",    displayname:"Host 현황"},
    {mainservice:"onebackup", subservice:"onebackup_backup",    serviceurl:"/console/d/osonebackup",    displayname:"백업 현황"},

    // 20231117 CM 추가
    {mainservice:"certificatemanager", subservice:"certificatemanager_manage",    serviceurl:"/console/g/certificate-manager/management",    displayname:"인증서 관리"},
    {mainservice:"certificatemanager", subservice:"certificatemanager_noti",    serviceurl:"/console/d/certificate-manager/notification",    displayname:"Notification 관리"}
    // 20230912 AI SERV 추가
    //{mainservice:"aiserv", subservice:"onebackup_backup",    serviceurl:"/console/d/osonebackup",    displayname:"백업 현황"}
];

// 20230509 VPN청약 추가
var service_basic_ex_data =
[
    {servicename:"privatevpn", main:"Y", servicecode:"S5502", serviceurl:"/console/d/osprivatevpnlist", imageclass:"m33", mainservice:"hybridcloud", activeYN:"N", displayname:"전용 VPN"}
]

var member_menu_list = [];

function getNumberOnly(org_val) {
    var val = org_val;
    var regex = /[^0-9]/g;
    val = val.replace(regex, '');

    return val;
}

/* slim scroll을 생성, slimscrollcls 클래스가 있어야 함.
 * destObjID : slim scroll을 생성하기 위한 ID
 */
function set_slim_scroll(destObjID) {
    if(destObjID) {
        $(function(){
            var obj = $("#" + destObjID);
            var width = obj.width();
            var height = obj.height();

            obj.slimScroll({
                height: height,
                color: '#898989',
                width: width,
                size: '1px',
                wheelStep:20
            });
        });
    } else {
        var dest_elements = document.getElementsByClassName('slimscrollcls');

        for (var i = 0; i < dest_elements.length; i++) {
            var dest_obj = $("#" + dest_elements[i].id);

            dest_obj.slimScroll({
                height: '100%',
                color: '#898989',
                width: '100%',
                size: '1px'
            });
        }

        $('#inner_lnb_div').slimScroll({
            height: '100%',
            color: '#898989',
            width: '100%',
            size: '10px'
        });

        $('#inner_lnb_div_vml').slimScroll({
            height: '115px',
            color: '#c6c6c4',
            width:'200px'
        });

        $('#inner_lnb_div_groupl').slimScroll({
            height: '270px',
            color: '#c6c6c4',
            width:'200px',
            wheelStep : 10,
            touchScrollStep : 50
        });

        $('#inner_lnb_div_noticel').slimScroll({
            height: '270px',
            color: '#c6c6c4',
            width:'200px'
        });


    }
}

/* slim scroll을 생성,
 * hoverObjID : slim scroll을 생성하기 위한 ID
 */
function set_hover_slim_scroll(hoverObjID) {
    $("#" + hoverObjID).hover(function(){
        set_slim_scroll(hoverObjID + "_scrollCls");
    });
}

// /* 툴팁
//  * objID : 툴팁을 띄울 ID, action_disabled 이나 action_disabled2 클래스가 있어야 하고 tooltip_text가 있어야 함
//  */
// function disableNshow_tooltip(objID) {
//     var destObj = null;
//     var parentObj = null;

//     destObj = $("#" + objID);
//     parentObj = destObj.parent();

//     destObj.addClass("action_disabled");

//     parentObj.mouseover(function(){
//         $(this).find(".depth_2").show();
//     });

//     parentObj.mouseleave(function(){
//         $(this).find(".depth_2").hide();
//     });
// }

// /* 툴팁 기능 : 툴팁 기능을 적용하기 위해서는 tooltip_text가 해당 objec에 포함되어 있어야 함.
//  * objID : 툴팁을 띄울 ID,
//  * actionYN : 'Y'이면 action 버튼에 적용되는 툴팁으로 action 클래스는 기본으로 포함되며
//  *            버튼의 경우 action_disabled, action 메뉴의 경우 action_disabled2 클래스가 있어야 함.
//  *            'N'이면 일반 툴팁으로 tooltip_obj 클래스가 있어야 함.
//  */

// function set_all_tooltip() {
//     var destElements = document.getElementsByClassName("tooltip_obj");

//     for(var i=0; i<destElements.length; i++) {
//         show_tooltip(destElements[i].id, "N");
//     }
// }

/* 리스트내 체크 박스를 숨기고 로딩 박스중 보임
 * obj : 리스트
 */
function show_check_loading(obj) {
    $(".show_loading_img", obj).show();
    $("#list_check", obj).hide();
}

/* 리스트내 체크 박스를 보이고 로딩 박스중 숨김
 * obj : 리스트
 */
function hide_check_loading(obj) {
    $(".show_loading_img", obj).hide();
    $("#list_check", obj).show();
}

/* 토스트 팝업 처리
 * toast_title : 토스트 팝업 타이틀
 * toast_contents : 토스트 팝업 내용
 */
function process_toast_popup(toast_title, toast_contents, success_yn) {
    toastr.options = {
        closeButton: true,
        progressBar: true,
        showMethod: 'slideDown',
        timeOut: 4000
    };

    toast_title = sanitizeXSS(toast_title);
    toast_contents = sanitizeXSS(toast_contents);
    if(success_yn) {
        toastr.success("", toast_title + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + toast_contents);
    } else {
        toastr.error("", toast_title + "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" + toast_contents);
    }
}

/* 버튼 비활성화 및 기능 비활성화
 * objID : 버튼 ID
 * type : 버튼 1, 액션 2
 */
function set_disableNcontrol(objID, type) {
    var destObj = $("#" + objID);

    if(type == 1) {
        destObj.addClass("action_disabled");
    } else {
        destObj.addClass("action_disabled2");
    }

    destObj.unbind("click");
}

/* 텍스트 클립 보드 복사
 * destValue : 복사할 내용
 */
function copy_to_clipboard(destValue) {
    var text_area = document.createElement("textarea");

    if(destValue == "" || destValue == null){
        document.body.appendChild(text_area);
        text_area.value = "";
        text_area.select();
        document.execCommand('copy');
        document.body.removeChild(text_area);

        process_toast_popup("복사 실패", "클립보드에 복사실패 되었습니다.", false);
    }else{
        document.body.appendChild(text_area);
        text_area.value = destValue;
        text_area.select();
        document.execCommand('copy');
        document.body.removeChild(text_area);

        process_toast_popup("복사 완료", "클립보드에 복사되었습니다.", true);
    }
}

//팝업창에서 클립보드 복사
function copy_to_popup_clipboard(source,text) {

    var target = source.parentNode;
    var text_area = document.createElement("textarea");
    target.appendChild(text_area);

    if(text != null && text != ""){
        text_area.value = text;
    }else{
        text_area.value = trim(target.textContent);
    }

    text_area.select();
    document.execCommand('copy');
    target.removeChild(text_area);

    process_toast_popup("복사 완료", "클립보드에 복사되었습니다.", true);
}

/* 팝업 밖의 영역 클릭시 자동 닫힘, 다중 팝업인 경우 최초 팝업만 가능함.
 * obID : 팝업 창 ID
 */
function set_popup_out_close(objID) {
    $(document).mouseup(function (e) {
        var container = $("#" + objID);

        if($('.ui-dialog-content:visible').length == 1 && container.has(e.target).length == 0){
            container.dialog("close");
        }
    });
}

function set_popup_auto_close() {
    $(document).mouseup(function (e) {
        delete_invalid_popup();

        var popup_length = active_popup_list.length;
        var currentPopup = null;
        var previousPopup = null;

        if(popup_length > 0) {
            currentPopup = $("#" + active_popup_list[popup_length-1]);

            if(currentPopup.parent().has(e.target).length == 0){
                currentPopup.dialog("close");

                if(popup_length > 1) {
                    previousPopup = $("#" + active_popup_list[popup_length-2]);
                    previousPopup.focus();
                }

                active_popup_list.splice(popup_length-1, 1);
            }
        }
    });
}

function add_active_popup(objID) {
    active_popup_list.push(objID);
}

function delete_invalid_popup() {
    var popup_data_length = active_popup_list.length;
    var active_popups = $('.ui-dialog-content:visible');
    var active_popups_length = active_popups.length;
    var popup_removed = false;

    if(popup_data_length < 1) {
        return;
    }

    if(active_popups_length < 1) {
        active_popup_list.splice(0, popup_data_length);
        return;
    }

    for(var i=popup_data_length-1; i>=0; i--) {
        var activeYN = false;

        for(var j=0; j<active_popups_length; j++) {
            if(active_popup_list[i] == active_popups[j].id) {
                activeYN = true;
                break;
            }
        }

        if(!activeYN) {
            active_popup_list.splice(i, 1);
            popup_removed =  true;
        }
    }

    popup_data_length = active_popup_list.length;

    if(popup_removed && popup_data_length > 0) {
        $("#" + active_popup_list[popup_data_length-1]).focus();
    }
}

function set_disable_action(obj, actionClass) {
    if(!obj.hasClass(actionClass)) {
        obj.addClass(actionClass);
    }

    obj.unbind("click").bind("click");
}

function set_enable_action(obj, actionClass, callFunction) {
    obj.removeClass(actionClass);
    obj.unbind("click").bind("click", callFunction);
}

//OS가 Linux계열인지 체크..(단 fedora 제외)
function chkLinuxExFedora(osType){
    if(!osType) {
        return false;
    }

    var bool = false;
    osType = osType.toUpperCase();
    if(osType.indexOf("CENTOS") > -1 || osType.indexOf("UBUNTU") >-1 || osType.indexOf("DEBIAN") >-1 || osType.indexOf("SUSE") >-1 || osType.indexOf("REDHAT") >-1 || osType.indexOf("RED HAT") >-1 ){
        bool = true;
    }

    return bool;
}

function sort_array_item(item_list, sort_id, sort_by, service_name) {
    for(var i = 0; i < item_list.length-1 ; i++) {
        for(var j = i+1; j < item_list.length ; j++) {
            if(sort_by == "asc") {
                if(get_sort_value(item_list[i], sort_id, service_name) > get_sort_value(item_list[j], sort_id, service_name)){
                    var temp = item_list[i];
                    item_list[i] = item_list[j];
                    item_list[j] = temp;
                }
            } else {
                if(get_sort_value(item_list[i], sort_id, service_name) < get_sort_value(item_list[j], sort_id, service_name)){
                    var temp1 = item_list[i];
                    item_list[i] = item_list[j];
                    item_list[j] = temp1;
                }
            }
        }
    }

    if(service_name == "server") {
        set_vm_menu("default", "N");
    } else if(service_name == "network") {
        set_network_action_menu("default", "");
    } else if(service_name == "disk") {
        set_disk_action_menu("default", null);
    } else if(service_name == "snapshot") {
        set_snapshot_action_menu("default");
    }
}


//2022-01-24 방화벽 sort
function sort_array_item2(firewall_list, sort_id, sort_by, service_name) {
    for(var i = 0; i < firewall_list.length-1 ; i++) {
        for(var j = i+1; j < firewall_list.length ; j++) {
            if(sort_by == "asc") {
                if(get_sort_value(firewall_list[i], sort_id, service_name) > get_sort_value(firewall_list[j], sort_id, service_name)){
                    var temp = firewall_list[i];
                    firewall_list[i] = firewall_list[j];
                    firewall_list[j] = temp;
                }
            } else {
                if(get_sort_value(firewall_list[i], sort_id, service_name) < get_sort_value(firewall_list[j], sort_id, service_name)){
                    var temp1 = firewall_list[i];
                    firewall_list[i] = firewall_list[j];
                    firewall_list[j] = temp1;
                }
            }
        }
    }
}


function get_sort_value(src_data, sort_id, service_name) {
    if(service_name == "server") {
        if(sort_id == "view_svr_name") {
            return src_data.name.toUpperCase();
        } else if(sort_id == "view_svr_state") {
            return src_data.status.toUpperCase();
        } else if(sort_id == "view_svr_locate") {
            return getZoneName(src_data.zoneid, src_data.zonename);
        } else if(sort_id == "view_svr_os") {
            return src_data.templatedisplaytext.toUpperCase();
        } else if(sort_id == "view_svr_spec") {
            return (src_data.cpunumber + "" + src_data.memory).toUpperCase();
        } else if(sort_id == "view_svr_prvip") {
            return src_data.uiprivateip;
        } else if(sort_id == "view_svr_addedprvip") {
            return src_data.uiaddedprivateip;
        } else if(sort_id == "view_svr_regdttm") {
            return src_data.created;
        } else if(sort_id == "view_svr_group") {
            return src_data.groupnm.toUpperCase();
        } else if(sort_id == "view_svr_type") {
            return src_data.viewsvrtype.toUpperCase();        //return src_data.svrtyppe.toUpperCase();
        } else if(sort_id == "view_svr_host") {
            return src_data.name;
        } else if(sort_id == "view_svr_id") {
            return src_data.id;
        } else if(sort_id == "view_svr_cpu") {
            return src_data.cpunumber;
        } else if(sort_id == "view_svr_memory") {
            return src_data.memory;
        } else if(sort_id == "view_svr_ha") {
            return src_data.ha1;
        } else if(sort_id == "view_svc_ha") {
            return src_data.ha2;
        } else if(sort_id == "view_svr_cluster") {
            return src_data.dhlocation;
        } else if(sort_id == "view_volume_type") {
            return (src_data.ssdyn=="Y"?"SSD":"HDD");
        } else{
            return "";
        }
    } else if(service_name == "disk") {
        if(sort_id == "view_strg_name") {
            return src_data.name.toUpperCase();
        } else if(sort_id == "view_zone") {
            return getZoneName(src_data.zoneid, src_data.zonename);
        } else if(sort_id == "view_app_svr" ) {
            return src_data.vmdispnm;
        } else if(sort_id == "view_strg_state") {
            return src_data.stat;
        } else if(sort_id == "view_strg_type") {
            return (src_data.bootable=="false"?"추가":"기본");
        } else if(sort_id == "view_strg_type2") {
            return ( ( src_data.ssdyn=="Y" || src_data.volume_type.startsWith("SSD") ) ?"SSD":"HDD");
        } else if(sort_id == "view_strg_size") {
            return src_data.size;
        } else if(sort_id == "view_strg_iops") {
            return src_data.iops;
        } else if(sort_id == "view_strg_regdttm") {
            return src_data.created_at;
        }
    } else if(service_name == "network") {
        if(sort_id == "col_ip") {
            return src_data.ip;
        } else if(sort_id == "view_net_locate") {
            return getZoneName(src_data.zoneid, src_data.zonename);
        } else if(sort_id == "view_base_ip") {
            return src_data.baseip;
        } else if(sort_id == "view_net_statc") {
            return src_data.statc.toUpperCase();
        } else if(sort_id == "view_net_desc") {
            return src_data.ipdesc.toUpperCase();
        } else if(sort_id == "view_net_type") {
            return src_data.type;
            //2022-01-24 방화벽 sort 처리
        } else if(sort_id == "F_action") {
            return src_data.action;
        } else if(sort_id == "F_source_network") {
            return src_data.srcintfs[0].networkname;
        } else if(sort_id == "F_source_cidr") {
            return src_data.srcaddrs[0].ip;
        } else if(sort_id == "F_protocol") {
            return src_data.services[0].protocol;
        } else if(sort_id == "F_destination_network") {
            return src_data.dstintfs[0].networkname;
        } else if(sort_id == "F_destination_cidr") {
            return src_data.dstaddrs[0].ip;
        } else if(sort_id == "F_destination_port") {
            return src_data.services[0].startport;
        } else if(sort_id == "F_risk") {
            return src_data.risk;
        } else if(sort_id == "F_similar") {
            return src_data.comments;
        }else {
            return "";
        }
    } else if(service_name == "serverimage") {
        if(sort_id == "view_tmpt_name") {
            return src_data.name;
        }  else if(sort_id == "view_tmpt_os") {
            return src_data.os_type;
        } else if(sort_id == "view_tmpt_locate") {
            return src_data.zone_id;
        } else if(sort_id == "view_tmpt_state") {
            return src_data.status;
        } else if(sort_id == "view_tmpt_share") {
            return src_data.share;
        } else if(sort_id == "view_tmpt_vol_size") {
            return src_data.min_disk;
        } else if(sort_id == "view_tmpt_regdttm") {
            return src_data.created_at;
        } else {
            return "";
        }
    }else if(service_name == "snapshot") {
        if(sort_id == "view_snap_name") {
            return src_data.name.toUpperCase();
        }  else if(sort_id == "view_snap_locate") {
            return src_data.zone_id;
        } else if(sort_id == "view_snap_state") {
            return src_data.status;
        } else if(sort_id == "view_snap_type") {
            return src_data.type2.toUpperCase();
        } else if(sort_id == "view_snap_new") {
            return src_data.created_at;
        } else if(sort_id == "view_vol_name") {
            return src_data.volume_nm.toUpperCase();
        } else if(sort_id == "view_vol_size") {
            return src_data.size;
        } else if(sort_id == "view_snap_reg") {
            return src_data.created_at;
        } else {
            return "";
        }
    } else if(service_name == "privatesubnet") {
        if(sort_id == "view_cip_name") {
            return src_data.displaytext;
        }  else if(sort_id == "view_cip_locate") {
            return src_data.zone_nm.toUpperCase();
        } else if(sort_id == "view_share_group") {
            return src_data.acltype;
        } else if(sort_id == "view_cip_vlan") {
            return src_data.vlan;
        } else if(sort_id == "view_cip_cidr") {
            return src_data.cidr;
        } else if(sort_id == "view_cip_regdttm") {
            return src_data.network_dt;
        } else {
            return "";
        }
    } else if(service_name == "virtualip") {
        if(sort_id == "view_vip_name") {
            return src_data.vip_nm;
        }  else if(sort_id == "view_vip_locate") {
            return src_data.zone_id;
        } else if(sort_id == "view_vip_ip") {
            return src_data.vip_addr;
        } else if(sort_id == "view_vip_network") {
            return src_data.network_nm;
        } else if(sort_id == "view_vip_networkid") {
            return src_data.network_id;
        } else if(sort_id == "view_vip_regdttm") {
            return src_data.reg_dttm;
        } else {
            return "";
        }
    } else if(service_name == "history") {
        if(sort_id == "view_resc_type") {
            if(src_data.point){
                return src_data.point;
            }
            return src_data.type;
        }  else if(sort_id == "view_resc_name") {
            return src_data.name;
        } else if(sort_id == "view_event") {
            return src_data.event;
        } else if(sort_id == "view_event_dttm") {
            return src_data.eventdttm.split(".")[0];
        } else if(sort_id == "view_remark") {
            return src_data.desc;
        } else {
            return "";
        }
    } else if(service_name == "watchdashboard") {
        if(sort_id == "view_dashboard_name") {
            return src_data.name;
        } else if(sort_id == "view_dashboard_regdttm") {
            return src_data.reg_dttm;
        } else {
            return "";
        }
    }  else if(service_name == "watchalarm") {
        if(sort_id == "table_name") {
            return src_data.alarmName;
        } else if(sort_id == "table_zone") {
            return src_data.zoneId;
        } else if(sort_id == "table_state") {
            return src_data.stateValue;
        } else if(sort_id == "table_condition") {
            return src_data.metricName;
        } else if(sort_id == "table_action") {
            if(src_data.actionsEnabled){
                return "네";
            }else{
                return "아니오";
            }
        } else if(sort_id == "table_namespace") {
            return "서버:개별서버메트릭";
        } else {
            return "";
        }
    } else if(service_name == "alarm_history") {
        if(sort_id == "history_type") {
            return src_data.alarmType;
        } else if(sort_id == "history_Detail") {
            return src_data.history;
        } else if(sort_id == "history_date") {
            return src_data.regDttm;
        } else {
            return "";
        }
    } else if(service_name == "lb") {
        if(sort_id == "view_lb_name") {
            return src_data.name.toUpperCase();
        } else if(sort_id == "view_lb_locate") {
            return src_data.zonename.toUpperCase();
        } else if(sort_id == "view_lb_option") {
            return src_data.loadbalanceroption;
        } else if(sort_id == "view_lb_type") {
            return src_data.servicetype.toUpperCase();
        } else if(sort_id == "view_lb_ip") {
            return src_data.serviceip;
        } else if(sort_id == "view_lb_port") {
            return src_data.serviceport;
        } else if(sort_id == "view_lb_state") {
            return src_data.state;
        } else if(sort_id == "view_cert_nm") {
            return src_data.certname;
        } else {
            return "";
        }
    } else if(service_name == "lbhistroy") {
        if(sort_id == "view_req_point") {
            return src_data.point.toUpperCase();
        } else if(sort_id == "view_req_id") {
            return src_data.memid;
        } else if(sort_id == "view_resc_name") {
            return src_data.name;
        } else if(sort_id == "view_event") {
            return src_data.event;
        } else if(sort_id == "view_event_dttm") {
            return src_data.eventdttm;
        } else if(sort_id == "view_remark") {
            return src_data.desc;
        } else {
            return "";
        }
    } else if(service_name == "sshkey") {
        if(sort_id == "view_ssh_name") {
            return src_data.keypair.name.toUpperCase();
        } else if(sort_id == "view_ssh_state") {
            return src_data.zone_id;
        } else if(sort_id == "view_ssh_fingerprint") {
            return src_data.keypair.fingerprint;
        } else {
            return "";
        }
    } else if(service_name == "storage") {
        if(sort_id == "view_storage_name") {
            return src_data.name.toUpperCase();
        } else if(sort_id == "view_storage_filecnt") {
            return parseInt(src_data.count_real);
        } else if(sort_id == "view_storage_netuse") {
            return src_data.bytes_real;
        } else if(sort_id == "view_storage_acc") {
            return (src_data.X_Container_Read==".r:*"?"공개":"비공개");
        } else if(sort_id == "gubun") {
            return src_data.date;
        } else if(sort_id == "ss_usage_Standard") {
            return src_data.bytes_used;
        } else if(sort_id == "ss_usage_basic") {
            return src_data.bytes_used_ec;
        } else if(sort_id == "ss_usage_band_in") {
            return src_data.public_bw_in;
        } else if(sort_id == "ss_usage_band_out") {
            return src_data.public_bw_out;
        } else {
            return "";
        }
    } else if(service_name == "storage_file") {
        if(sort_id == "file_storage_name") {
            return src_data.name.toUpperCase();
        } else if(sort_id == "file_storage_Volume") {
            return src_data.bytes;
        } else if(sort_id == "file_storage_date") {
            return src_data.last_modified;
        } else if(sort_id == "file_storage_type") {
            return src_data.content_type;
        } else if(sort_id == "file_storage_tag") {
            return src_data.X_Object_Meta_Key;
        } else {
            return "";
        }
    } else if(service_name == "advcdnlist") {
        if(sort_id == "view_svr_name") {
            return src_data.svcname;
        }  else if(sort_id == "view_svr_type") {
            return src_data.svctype;
        }  else if(sort_id == "view_svr_state") {
            return src_data.svcstatus;
        }  else if(sort_id == "view_svr_domain") {
            return src_data.svcdomain;
        }  else if(sort_id == "view_svr_dttm") {
            return src_data.created;
        } else {
            return "";
        }
    }else if(service_name == "advcdnstatistics") {
        if(sort_id == "cdn_date") {
            return src_data.datetime;
        }  else if(sort_id == "cdn_traffic") {
            return src_data.traffic;
        }  else if(sort_id == "cdn_bytes") {
            return src_data.bytes;
        }  else {
            return "";
        }
    } else if(service_name == "cdn") {
        if(sort_id == "view_svr_name") {
            return src_data.svc_name;
        }  else if(sort_id == "view_svr_type") {
            return src_data.svc_type;
        }  else if(sort_id == "view_svr_state") {
            return src_data.svc_status;
        }  else if(sort_id == "view_svr_domain") {
            return src_data.svc_domain;
        }  else if(sort_id == "view_svr_content") {
            return src_data.reg_dttm;
        }    else if(sort_id == "gubun") {
            return src_data.datetime;
        }  else if(sort_id == "cdn_usage_basic") {
            return src_data.traffic_out;
        }  else if(sort_id == "cdn_usage_band_in") {
            return src_data.hit;
        } else {
            return "";
        }
    } else if(service_name == "datalakelist") {
        if(sort_id == "view_node_name") {
            return src_data.name;
        }  else if(sort_id == "view_service_type") {
            return src_data.clusterNm;
        }  else if(sort_id == "view_node_type") {
            return src_data.type;
        }  else if(sort_id == "view_cluster_state") {
            return src_data.clusterStatus;
        }  else if(sort_id == "view_state") {
            return src_data.status;
        }  else if(sort_id == "view_location") {
            return src_data.availablezone;
        }  else if(sort_id == "view_analysis_type") {
            return src_data.clusterStatus;
        }  else if(sort_id == "view_create_date") {
            return src_data.created;
        } else {
            return "";
        }
    } else if(service_name == "waf") {
        if(sort_id == "table_waf") {
            return src_data.wafName.toUpperCase();
        } else if(sort_id == "table_state") {
            return src_data.wafVmState;
        } else if(sort_id == "table_zone") {
            return src_data.zoneNm;
        } else if(sort_id == "table_composition") {
            return src_data.wafType;
        } else if(sort_id == "table_spec") {
            return src_data.wafSpec;
        } else if(sort_id == "table_load") {
            return src_data.wafLbNm;
        } else if(sort_id == "table_ip") {
            return src_data.wafSvcIp;
        } else if(sort_id == "table_port") {
            return src_data.wafSvcPort;
        } else {
            return "";
        }
    } else if(service_name == "wafpro") {
        if(sort_id == "table_waf") {
            return src_data.name.toUpperCase();
        } else if(sort_id == "table_state") {
            return src_data.wafVmState;
        } else if(sort_id == "table_zone") {
            return src_data.zonename;
        } else if(sort_id == "table_tier") {
            return src_data.tier.toUpperCase();
        } else if(sort_id == "table_cluster") {
            return src_data.clustername.toUpperCase();
        } else if(sort_id == "table_spec") {
            return src_data.spec;
        } else if(sort_id == "table_ip") {
            return src_data.wafSvcIp;
        } else if(sort_id == "table_console_port") {
            return src_data.wafSvcPort;
        } else if(sort_id == "table_ssh_port") {
            return src_data.wafSvcPort;
        } else {
            return "";
        }
    } else if(service_name == "devops") {
        if(sort_id == "view_svr_clname") {
            if(src_data.clusterName == null){
                return src_data.namespace.toUpperCase();
            }else{
                return src_data.clusterName.toUpperCase();
            }
        } else if(sort_id == "view_svr_state") {
            return src_data.clusterStatus;
        } else if(sort_id == "view_svr_locate") {
            return src_data.availabilityZone;
        } else if(sort_id == "view_svr_orchusage") {
            return src_data.orchestrateVersion;
        } else if(sort_id == "view_svr_workernode") {
            return src_data.workerNode;
        } else if(sort_id == "view_svr_devops") {
            return src_data.usePlatform;
        }
    }  else if(service_name == "autoscalinglc") {
        if(sort_id == "view_lc_name") {
            return src_data.launchconfigurationname;
        }  else if(sort_id == "view_lc_locate") {
            return src_data.availabilityzones.availabilityzone;
        }  else if(sort_id == "view_lc_os") {
            return src_data.productcode;
        }  else if(sort_id == "view_lc_regdttm") {
            return src_data.createdtime;
        } else {
            return "";
        }
    } else if(service_name == "schedule") {
        if(sort_id == "view_name") {
            return src_data.scheduledactionname.toUpperCase();
        } else if(sort_id == "view_as_group") {
            return src_data.autoscalinggroupname.toUpperCase();
        } else if(sort_id == "view_action") {
            return src_data.autoscalingtype;
        } else if(sort_id == "view_vm_cnt") {
            return parseInt(src_data.desiredcapacity);
        } else if(sort_id == "view_stime") {
            return src_data.starttime;
        } else if(sort_id == "view_etime") {
            return src_data.endtime;
        } else if(sort_id == "view_repeat") {
            return src_data.recurrence;
        } else {
            return "";
        }
    } else if(service_name == "tier") {
        if(sort_id == "view_cip_name") {
            return src_data.name.toUpperCase();
        } else if(sort_id == "view_cip_locate") {
            return src_data.zonename;
        } else if(sort_id == "view_cip_vlan") {
            return src_data.vlan;
        } else if(sort_id == "view_cip_cidr") {
            return src_data.cidr;
        } else if(sort_id == "view_cip_type") {
            return src_data.datalakeyn;
        } else {
            return "";
        }
    }else if(service_name == "naslist") {
        if(sort_id == "table_name") {
            if (src_data.name == null || src_data.name == ""){
                return "";
            }else{
                return src_data.name.toUpperCase();
            }
        } else if(sort_id == "table_network") {
            return src_data.network_name;
        } else if(sort_id == "table_request") {
            return src_data.size;
        } else if(sort_id == "table_current") {
            return src_data.used;
        } else if(sort_id == "table_type") {
            return src_data.volume_type;
        } else if(sort_id == "table_protocol") {
            return src_data.share_proto;
        } else if(sort_id = "table_zone") {
            return src_data.availability_zone;
        } else {
            return "";
        }
    }else if(service_name == "nassnapshot") {
        if(sort_id == "table_snapshot") {
            if (src_data.name == null || src_data.name == ""){
                return "";
            }else{
                return src_data.name.toUpperCase();
            }
        } else if(sort_id == "table_volume") {
            return src_data.share_id;
        } else if(sort_id == "table_dttm") {
            return src_data.created_at;
        } else {
            return "";
        }
    }else if(service_name == "nastierlist") {
        if(sort_id == "tier_name") {
            return src_data.name.toUpperCase();
        } else if(sort_id == "tier_state") {
            return src_data.sharenetworkyn;
        } else if(sort_id == "tier_zone") {
            return src_data.zoneid;
        } else if(sort_id == "tier_cidr") {
            return src_data.cidr;
        } else if(sort_id == "tier_vlan") {
            return src_data.vlan;
        } else {
            return "";
        }
    }else if(service_name == "aiapi"){
        if(sort_id == "view_app_name"){
            return src_data.name.toUpperCase();
        } else if(sort_id=="view_app_status"){
            return src_data.status;
        }else if(sort_id=="view_app_type"){
            return src_data.type;
        }else if(sort_id=="view_app_service"){
            return src_data.service;
        }else if(sort_id=="view_app_day"){
            return src_data.amount.day_request_amount;
        }else if(sort_id=="view_app_mon"){
            return src_data.amount.month_request_amount;
        }else if(sort_id=="view_app_date"){
            return src_data.created;
        }
    }else if(service_name == "subscribe"){
        if(sort_id == "table_subscribe"){
            return src_data.subscriptionurn;
        } else if(sort_id == "table_pro"){
            return src_data.protocol;
        } else if(sort_id == "table_recipient"){
            return src_data.endpoint;
        } else if(sort_id == "table_topic"){
            //토픽명만 따로 분류후 정렬
            var topic_name;
            var topic_name_arr = src_data.topicurn.split(":");
            topic_name = topic_name_arr[topic_name_arr.length-1];
            return topic_name;
        } else if(sort_id == "table_urn") {
            return src_data.topicurn;
        } else {
            return "";
        }
    }else if(service_name == "subTier_network") {
        if(sort_id == "subtier_view_cip_name") {
            return src_data.name.toUpperCase();
        } else if(sort_id == "subtier_view_cip_cidr") {
            return src_data.cidr;
        } else if(sort_id == "subtier_view_cip_vlan") {
            return src_data.vlan;
        } else if(sort_id == "subtier_view_cip_regdttm") {
            return src_data.name.toUpperCase();
        } else if(sort_id == "subtier_view_cip_locate") {
            return src_data.name.toUpperCase();
        } else {
            return "";
        }
    }else if(service_name == "messaging_service"){
        if(sort_id == "table_topic_urn"){
            return src_data.topicurn;
        } else if(sort_id == "topic_explanation"){
            if(src_data.displayname==null){
                return src_data.displayname="-";
            }else{
                return src_data.displayname;
            }
        }  else {
            return "";
        }
    }else if(service_name == "topic"){
        if(sort_id == "table_name"){
            var topic_name;
            var topic_name_arr = src_data.topicurn.split(":");
            topic_name = topic_name_arr[topic_name_arr.length-1];
            return topic_name;
        } else if(sort_id == "table_urn"){
            return src_data.topicurn;
        } else if(sort_id == "table_detail"){
            if(src_data.displayname==null){
                return src_data.displayname="-";
            }else{
                return src_data.displayname;
            }
        } else {
            return "";
        }
    }else if(service_name == "autoscalinggroup"){
        if(sort_id == "view_name"){
            return src_data.autoscalinggroupname;
        } else if(sort_id=="view_group_size"){
            return src_data.maxsize;
        }else if(sort_id=="view_now_cnt"){
            return 0;
        }else if(sort_id=="view_desired_cnt"){
            return src_data.desiredcapacity;
        }else if(sort_id=="view_state"){
            return src_data.status;;
        }else if(sort_id=="view_locate"){
            return src_data.availabilityzone;
        }else if(sort_id=="view_lc"){
            return src_data.launchconfigurationname;
        }
    }else if(service_name == "payment"){
        if(sort_id == "view_svr_mdnm"){
            return src_data.mdcode_nm;
        }else if(sort_id == "view_svr_pay"){
            return parseInt(src_data.pay_amt);
        } else {
            return "";
        }
    }else if(service_name == "nascifs"){
        if(sort_id == "table_cifs"){
            return src_data;
        }
    }else if(service_name == "redis"){
        if(sort_id == "view_svr_name"){
            return src_data.displayName;
        }else if(sort_id == "view_svr_state"){
            return src_data.state;
        }else if(sort_id == "view_svr_sort"){
            return src_data.productInfo.redisType;
        }else if(sort_id == "view_svr_tier"){
            return src_data.productInfo.redisFlavor;
        }else if(sort_id == "view_svr_zone"){
            return src_data.zondId;
        }else if(sort_id == "view_svr_date"){
            return src_data.deployCompletedTime;
        }else{
            return "";
        }
    }else if(service_name == "messaginghistory") {
        if(sort_id == "topic_log_urn") {
            return src_data.subscriptionurn;
        } else if(sort_id == "topic_log_protocol") {
            return src_data.protocol;
        } else if(sort_id == "topic_log_call") {
            return src_data.endpoint;
        } else if(sort_id == "topic_log_name") {
            return src_data.subject;
        } else if(sort_id == "topic_log_contents") {
            return src_data.message;
        } else if(sort_id == "topic_log_date") {
            return src_data.date;
        } else if(sort_id == "topic_log_result") {
            return src_data.confirm;
        } else {
            return "";
        }
    }else if(service_name == "flyingcube") {
        if(sort_id == "view_svr_clname") {
            return src_data.namespace;
        } else if(sort_id == "view_svr_state") {
            return "";
        } else if(sort_id == "view_svr_orchusage") {
            return "";
        } else {
            return "";
        }
    }else if(service_name == "kci_nas") {
        if(sort_id == "tr_nas_name") {
            return src_data.name;
        } else if(sort_id == "tr_nas_zone") {
            return "";
        } else if(sort_id == "tr_nas_network") {
            return "";
        } else if(sort_id == "tr_nas_size") {
            return src_data.size;
        } else if(sort_id == "tr_nas_protocol") {
            return "";
        } else {
            return "";
        }
    }else if(service_name == "redislog"){
        if(sort_id == "view_log_name"){
            return src_data.displayName;
        }else if(sort_id == "view_log_log"){
            return src_data.log1;
        }else if(sort_id == "view_log_date"){
            return src_data.createdAt;
        }else{
            return "";
        }
    }else if(service_name == "redislogById"){
        if(sort_id == "view_log_name"){
            return src_data.displayName;
        }else if(sort_id == "view_log_state"){
            return src_data.log1;
        }else if(sort_id == "view_log_locate"){
            return src_data.createdAt;
        }else{
            return "";
        }
    }else if(service_name == "osdns"){
        if(sort_id == "view_svr_name"){
            return src_data.service_name;
        }else if(sort_id == "view_svr_status"){
            return src_data.service_status;
        }else if(sort_id == "view_svr_zone"){
            return src_data.zone_id;
        }else if(sort_id == "view_svr_count"){
            return src_data.number_of_vms;
        }else if(sort_id == "view_svr_memory"){
            return src_data.service_offering_id;
        }else if(sort_id == "view_svr_recursion"){
            return src_data.enable_recursion;
        }else if(sort_id == "view_svr_date"){
            return src_data.createdAt;
        }else{
            return "";
        }
    }else if(service_name =="osdnshost"){
        if(sort_id == "view_svr_domain"){
            return src_data.domain;
        }else if(sort_id =="view_svr_name"){
            return src_data.service_name;
        }else if(sort_id =="view_svr_status"){
            return src_data.service_status;
        }else if(sort_id =="view_svr_zone"){
            return src_data.zone_name;
        }else if(sort_id =="view_svr_date"){
            return src_data.created_at;
        }else{
            return "";
        }
    }else if(service_name =="osdnsrecord"){
        if(sort_id == "view_svr_name"){
            return src_data.name;
        }else if(sort_id =="view_svr_type"){
            return src_data.type;
        }else if(sort_id =="view_svr_ttl"){
            return src_data.ttl;
        }else if(sort_id =="view_svr_value"){
            return src_data.value;
        }else if(sort_id =="view_svr_date"){
            return src_data.created_at;
        }else{
            return "";
        }
    }else if(service_name == "gslb") {
        if(sort_id == "view_gslb_name") { //GSLB명
            return src_data.svr_nm.toUpperCase();
        } else if(sort_id == "view_gslb_domain") { //도메인명
            return src_data.domain_nm.toUpperCase();
        } else if(sort_id == "view_gslb_ttl") { //TTL
            return parseInt(src_data.ttl);
        } else if(sort_id == "view_gslb_persist") { //Persistence - 기존 presis에서 고침
            return change_persistence(src_data.persistence_type);
        } else if(sort_id == "view_gslb_hitTotal") { //누적
            return parseInt(src_data.tothits);
        } else if(sort_id == "view_gslb_hitRate") { //초당
            return parseInt(src_data.hitsrate);
        } else {
            return "";
        }
    }else if(service_name == "gslbhistory") {
        if(sort_id == "view_req_point") {
            return src_data.point.toUpperCase();
        } else if(sort_id == "view_req_id") {
            return src_data.memid;
        } else if(sort_id == "view_resc_name") {
            return src_data.name;
        } else if(sort_id == "view_event") {
            return src_data.event;
        } else if(sort_id == "view_event_dttm") {
            return src_data.eventdttm;
        } else if(sort_id == "view_remark") {
            return src_data.desc;
        } else {
            return "";
        }
    } else if(service_name == "connectHub"){
        if(sort_id == "connecthub_svr_group"){
            return src_data.groupId;
        }else if(sort_id == "connecthub_svr_sla"){
            return src_data.sla;
        }else if(sort_id == "connecthub_svr_qos"){
            return parseInt(src_data.qos);
        }else if(sort_id == "connecthub_svr_networks"){
            return src_data.networks[0].network;
        }else if(sort_id == "connecthub_svr_zone"){
            return src_data.type;
        }else if(sort_id == "connecthub_svr_subZone"){
            return src_data.subType;
        }else if(sort_id == "connecthub_svr_user"){
            return src_data.account;
        }else if(sort_id == "connecthub_svr_status"){
            return src_data.status;
        }else{
            return "";
        }
    }
}

function get_active_member_service_lists(srcpage, service, sub_menu) {
    var params        = { command : "svcList" , isLnb : "Y"};
    active_member_service_list.splice(0);

    // set_backup_state("S1851", "N");
    // set_backup_state("S3659", "N");

    $.ajax({
        url: WebROOT + "contractServlet",
        type: "POST",
        data: params,
        dataType: "json",
        success: function(data) {
            if (data.response.result == "0") {
                var list    = data.response.data;
                s3 = data.response.s3_show;
                ss = data.response.ss_show;
                active_member_service_list = new Array();

                if(list == null){
                    list = [];
                }

                for (var i = 0; i < list.length; i++) {
                    if (list[i].ordSvcStCd != "10") {
                        continue;
                    } else {
                        var service_nm = "";

                        if(list[i].serviceCD == "S4723") {
                            service_nm = "server";
                        } else if(list[i].serviceCD == "S1879") {
                            service_nm = "loadbalancer";
                        } else if(list[i].serviceCD == "S1853") {
                            service_nm = "storage";
                        } else if(list[i].serviceCD == "S4747") {
                            service_nm = "disitalworks";
                        } else if(list[i].serviceCD == "S4599") {
                            service_nm = "cdn_new";
                        } else if(list[i].serviceCD == "S4729") {
                            service_nm = "datalake";
                        } else if(list[i].serviceCD == "S1963") {
                            service_nm = "waf";
                        } else if(list[i].serviceCD == "S4304") {
                            service_nm = "wafpro";
                        } else if(list[i].serviceCD == "S2248") {
                            service_nm = "nas";
                        } else if(list[i].serviceCD == "S4731") {
                            service_nm = "iotmakers";
                        } else if(list[i].serviceCD == "S4552") {
                            service_nm = "webtob";
                        } else if(list[i].serviceCD == "S4553") {
                            service_nm = "jeus";
                        } else if(list[i].serviceCD == "S4549") {
                            service_nm = "tiberodb";
                        }
                        //20230906 코드재정의
                        //else if(list[i].serviceCD == "S5172") {
                        //    service_nm = "tiberoce";
                        //} else if(list[i].serviceCD == "S5173") {
                        //    service_nm = "tiberotac";
                        /*} else if(list[i].serviceCD == "S1851" || list[i].serviceCD == "S3659") {
                            set_backup_state(list[i].serviceCD, "Y");

                            if(backup_menu_show == "N"){
                                service_nm = "backup";
                                if(list[i].serviceCD == "S1851"){
                                    sub_service_data_chage("backup_list");
                                } else{
                                    sub_service_data_chage("pcbakcup_list");
                                }
                            }else{
                                if(list[i].serviceCD == "S1851"){
                                    sub_service_data_chage("backup_list");
                                } else{
                                    sub_service_data_chage("pcbakcup_list");
                                }
                            }
                            backup_menu_show = "Y";*/
                        //}
                        else if(list[i].serviceCD == "S4795") {
                            service_nm = "aistudio";
                        } else if(list[i].serviceCD == "S4226") {
                            service_nm = "aiapi";
                        } else if(list[i].serviceCD == "S4600") {
                            service_nm = "linkhybridcloud";
                        } else if(list[i].serviceCD == "S4601") {
                            service_nm = "gotalkto";
                        } else if(list[i].serviceCD == "S4846"){
                            service_nm = "dns";
                        } else if(list[i].serviceCD == "S4603") {
                            service_nm = "videohelpme";
                        } else if(list[i].serviceCD == "S4843") {
                            service_nm = "redis";
                        } else if (list[i].serviceCD == "S4330"){
                            service_nm = "connecthub";
                        } else if(list[i].serviceCD == "S2237") {
                            service_nm = "gslb";
                        } else if(list[i].serviceCD == "S4994") {
                            service_nm = "flyingcube";
                        } else if(list[i].serviceCD == "S5177") {
                            service_nm = "ezml";
                        } else if(list[i].serviceCD == "S5244") {
                            service_nm = "mysql8";
                        } else if(list[i].serviceCD == "S5242") {
                            service_nm = "apigw";
                        } else if(list[i].serviceCD == "S5148") {
                            service_nm = "serverless";
                        } else if(list[i].serviceCD == "S5246") {
                            service_nm = "k2p";
                        } else if(list[i].serviceCD == "S5502") {
                            service_nm = "privatevpn";
                            service_basic_ex_data.filter( f => f.servicename == service_nm).map( m=> m.activeYN="Y");
                        } else if(list[i].serviceCD == "S5479"){
                            service_nm = "cleanzone";
                        } else if(list[i].serviceCD == "S5504"){
                            service_nm = "fsdc";
                        } else if(list[i].serviceCD == 'S5507'){
                            service_nm = "mariadb";
                        }
                        // 20230627 One Backup 추가
                        else if(list[i].serviceCD == "S5015") {
                            service_nm = "onebackup";
                        } else if(list[i].serviceCD == 'S5577'){
                            service_nm = "aiserv";
                        } else if(list[i].serviceCD == 'S5505'){
                            service_nm = "postgresql";
                        } else if(list[i].serviceCD == 'S-PCA'){
                            service_nm = "privateca";
                        } else {
                            continue;
                        }
                        if(service_nm != "") {
                            var sub_service_list = get_sub_services(service_nm, list[i].serviceCD);
                            if (service_nm == "storage") {
                                if (ss == "Y") {
                                    active_member_service_list.push({servicename:service_nm, servicecode:list[i].serviceCD});
                                }
                            } else {
                                active_member_service_list.push({servicename:service_nm, servicecode:list[i].serviceCD});
                            }

                            for(var j = 0; j < sub_service_list.length; j++) {
                                active_member_service_list.push(sub_service_list[j]);
                            }
                        }
                    }
                }

                get_member_menu_lists(srcpage, service, sub_menu);
            }
        }
    });
}

function get_member_menu_lists(srcpage, service, sub_menu) {
    member_menu_list.splice(0);

    $.ajax({
        url: "/userinfo",
        type:"POST",
        data:"command=getMemMenuLists&menmberPlatform=D",
        dataType:"json",
        complete: getMemMenuLists.bind(this, srcpage, service, sub_menu, "complete"),
        success:getMemMenuLists.bind(this, null, null, null, "success")
    });
}

function getMemMenuLists(srcpage, service, sub_menu, prc_state, json_obj) {
    if(prc_state == "complete") {
        if(typeof(set_default_page) == "function") {
            set_default_page();
        } else {
            set_lnb_menu_all(srcpage, service, sub_menu);
        }
    } else {
        if(json_obj.status == "00") {
            //member_menu_list = json_obj.data;
            member_menu_list = [];
        }
    }
}

function get_sercice_cd(prod_nm) {
    for(var i = 0; i < service_basic_data.length; i++) {
        if(service_basic_data[i].servicename == prod_nm) {
            return service_basic_data[i].servicecode;
        }
    }

    return "";
}

function get_img_class(prod_nm) {
    for(var i = 0; i < service_basic_data.length; i++) {
        if(service_basic_data[i].servicename == prod_nm) {
            return service_basic_data[i].imageclass;
        }
    }

    return "";
}

function get_service_dispnm(prod_nm) {
    for(var i = 0; i < service_basic_data.length; i++) {
        if(service_basic_data[i].servicename == prod_nm) {
            return service_basic_data[i].displayname;
        }
    }

    return "";
}

function get_service_mdcode(prod_nm) {
    // if(is_backup_service(prod_nm)) {
    //     for(var i = 0; i < backup_service_list.length; i++) {
    //         if(backup_service_list[i].servicename == prod_nm) {
    //             return backup_service_list[i].servicecode;
    //         }
    //     }
    // }

    for(var i1 = 0; i1 < service_basic_data.length; i1++) {
        if(service_basic_data[i1].servicename == prod_nm) {
            return service_basic_data[i1].servicecode;
        }
    }

    return "";
}

function get_console_url(prod_nm) {
    // if(is_backup_service(prod_nm)) {
    //     return get_backup_url(prod_nm);
    // }

    let result = "";
    for(var i = 0; i < service_basic_data.length; i++) {
        if(service_basic_data[i].servicename == prod_nm) {
            result = service_basic_data[i].serviceurl;
            return service_basic_data[i].serviceurl;
        }
    }

    if(result == ""){
        result = service_basic_ex_data.filter( f => f.servicename == prod_nm).map( m=> m.serviceurl)[0];
    }

    return result;
}

function is_main_service(prod_nm) {
    for(var i = 0; i < service_basic_data.length; i++) {
        if(service_basic_data[i].servicename == prod_nm) {
            return service_basic_data[i].mainservice;
        }
    }

    return "";
}

function get_sub_services(service_nm, service_cd) {
    var sub_service_lists = [];

    if(is_main_service(service_nm) == "Y") {
        for(var j = 0; j < service_basic_data.length; j++) {
            if($.cookie("iamid") && service_basic_data[j].servicename == "apikey") {
                continue;
            }
            if(service_cd == service_basic_data[j].servicecode) {
                if(service_nm != service_basic_data[j].servicename) {
                    if(service_basic_data[j].servicename == "storage3"){
                        if(s3 == "Y"){
                            sub_service_lists.push({servicename:service_basic_data[j].servicename, servicecode:service_cd});
                        }
                    } else if (service_basic_data[j].servicename == "storage" || service_basic_data[j].servicename == "storage2") {
                        if(ss == "Y"){
                            sub_service_lists.push({servicename:service_basic_data[j].servicename, servicecode:service_cd});
                        }
                    } else{
                        sub_service_lists.push({servicename:service_basic_data[j].servicename, servicecode:service_cd});
                    }
                }
            }
        }
    }

    return sub_service_lists;
}

function set_lnb_menu_all(srcpage, service, sub_menu) {
    var serviceNmArr = [ "jeus", "webtob", "tiberodb","tiberoce","tiberotac", "connecthub", "devops","fsdc","cleanzone","privatevpn"];

    $("#menu_wrap").empty();
    $("#depth1_menu_ul").empty();

    if(service == "platform") {
        $("#platform_activate").addClass("on");
    }

    if(service == "main") {
        $("#depth1_menu_ul").append('<li class="vdepth1 mdash"><a href="/console/d/osmain" class="on"><span">Dashboard</span></a></li>');
    } else {
        $("#depth1_menu_ul").append('<li class="vdepth1 mdash"><a href="/console/d/osmain"><span">Dashboard</span></a></li>');
    }

    if(service == "allservice") {
        $("#allservice_activate").addClass("on");
    }

    //if(!$.cookie("iamid")) {
    if(!$.cookie("iamYN")) {
        $("#depth1_menu_ul").append(get_user_menu());
        set_iam_menu();
    }else{
        $("#depth1_menu_ul").append(get_iam_user_menu());
    }

    $("#depth1_menu_ul").show();

    var enterprise_flag = entUserChk();

    if(srcpage == "default") {    // 서비스 lnb

        if(member_menu_list.length < 1) {
            for(var i = 0; i < active_member_service_list.length; i++) {
                //2023-03-09 Zone 하나만 가입한 사용자에 대해 청약 및 LNB Hide (DX-M1 제외)
                if(onlyCentralUserYn() != "" && NoneCentralMenu(active_member_service_list[i].servicename)){
                    continue;
                }
                
                //지정된 메뉴는 보이지 않게 하기
                if(serviceNmArr.indexOf(active_member_service_list[i].servicename) > -1){
                    continue;
                }
                
                //2023-04-06 Ent.Security 및 금융 클라우드(Finance) 가입한 사용자 일부 서비스 청약 및 LNB Hide
                if(is_ent_user() && NoneEntUserMenu(active_member_service_list[i].servicename)){
                    continue;
                }

                var menu_html = '';
                if(active_member_service_list[i].servicename == "storage3"){
                    if(s3 == "N" || s3 == "") {
                        continue;
                    }
                }
                if(active_member_service_list[i].servicename == "storage" || active_member_service_list[i].servicename == "storage2"){
                    //if(ss == "N" || ss == "") {
                    continue;
                    //}
                }
                if($("#depth1_menu_ul > .vdepth1").hasClass(active_member_service_list[i].servicename)) {
                    continue;
                }

                if(service && service == active_member_service_list[i].servicename) {
                    if(service == "linkhybridcloud") {
                        menu_html = '<li class="novdepth2 m43 linkhybridcloud" onclick="javascript:set_hcmp_url();">\n';
                        menu_html += '<a class="on" href="#">\n';
                        menu_html += '<span>Hybrid Cloud Mgmt. Platform</span>\n';
                        menu_html += '</a>\n';
                        menu_html += '<ul' + ' style="display:none;">\n';
                        menu_html += '</ul>\n';
                        menu_html += '</li>';

                        $("#depth1_menu_ul").append(menu_html);
                        continue;
                    } else {
                        menu_html += '<li class="vdepth1 on ' + get_img_class(active_member_service_list[i].servicename) + ' ' + active_member_service_list[i].servicename + '">\n';
                    }
                } else {
                    if( active_member_service_list[i].servicename == "linkhybridcloud") {
                        menu_html = '<li class="novdepth2 m43 linkhybridcloud" onclick="javascript:set_hcmp_url();">\n';
                        menu_html += '<a href="#">\n';
                        menu_html += '<span>Hybrid Cloud Mgmt. Platform</span>\n';
                        menu_html += '</a>\n';
                        menu_html += '<ul' + ' style="display:none;">\n';
                        menu_html += '</ul>\n';
                        menu_html += '</li>';

                        $("#depth1_menu_ul").append(menu_html);
                        continue;
                    } else {
                        menu_html += '<li class="vdepth1 ' + get_img_class(active_member_service_list[i].servicename) + ' ' + active_member_service_list[i].servicename + '">\n';
                    }
                }

                menu_html += '<a href="#">\n';
                menu_html += '<span>' + get_service_dispnm(active_member_service_list[i].servicename) + '</span>\n';
                menu_html += '<span class="i"></span>\n';
                menu_html += '</a>\n';

                if(service && service == active_member_service_list[i].servicename) {
                    menu_html += '<ul>\n';
                } else {
                    menu_html += '<ul' + ' style="display:none;">\n';
                }

                for(var j = 0; j < sub_service_data.length; j++) {
                    if(active_member_service_list[i].servicename == sub_service_data[j].mainservice) {
                        if(service_basic_ex_data.filter( f => f.displayname == sub_service_data[j].displayname).map( m=> m.activeYN)[0] == "N"){
                            continue;
                        }

                        if(sub_menu && sub_menu == sub_service_data[j].subservice) {
                            menu_html += '<li class="vdepth2 on ' + sub_service_data[j].subservice + '">\n';
                        } else {
                            menu_html += '<li class="vdepth2 ' + sub_service_data[j].subservice + '">\n';
                        }

                        if(sub_service_data[j].activeYN && sub_service_data[j].activeYN=="N"){
                            menu_html += '<a class="preparing">\n';
                        } else if(sub_service_data[j].subservice ==  "N") { // 미오픈 서비스
                            menu_html += '<a class="preparing" href="' + sub_service_data[j].serviceurl + '">\n';
                        } else {
                            menu_html += '<a href="' + sub_service_data[j].serviceurl + '">\n';
                        }

                        if(sub_service_data[j].activeYN && sub_service_data[j].activeYN=="N"){
                            menu_html += '<span class="f_gray tooltip_obj" id="abcdefg123' + j + '" tooltip_text="상품 신청이 필요합니다.">' + sub_service_data[j].displayname + '</span>\n';
                        }else{
                            menu_html += '<span>' + sub_service_data[j].displayname + '</span>\n';
                        }
                        menu_html += '</a>\n';
                        menu_html += '</li>\n';
                    }
                }

                menu_html += '</ul>\n';
                menu_html += '</li>';

                $("#depth1_menu_ul").append(menu_html);
            }
        } else { // all 서비스
            let prodList = new Array();
            let menuCnt = Number(member_menu_list[member_menu_list.length - 1].menuorder);

            for(let a0 = 0; a0 < active_member_service_list.length; a0++) {
                let isActive = false;
                for(var a1 = 0; a1 < member_menu_list.length; a1++) {
                    if (active_member_service_list[a0].servicename == member_menu_list[a1].servicename) {
                        isActive = true;
                        break;
                    }
                }
                //지정된 메뉴는 보이지 않게 하기
                if(serviceNmArr.indexOf(active_member_service_list[a0].servicename) > -1){
                    isActive = true;
                }
                if(!isActive) {
                    menuCnt++;
                    member_menu_list.push({servicename:active_member_service_list[a0].servicename, menuorder:menuCnt});
                }
            }

            for(var i1 = 0; i1 < member_menu_list.length; i1++) {

                //지정된 메뉴는 보이지 않게 하기
                if(serviceNmArr.indexOf(member_menu_list[i1].servicename) > -1){
                    continue;
                }

                //20230711 IAM LNB 개선
                let isExActive = false;
                let isEx = false;
                for(let v=0; v<active_member_service_list.length; v++) {
                    if (active_member_service_list[v].servicename == member_menu_list[i1].servicename) {
                        isEx = true;
                        let isExPord = false;
                        //member_menu_list에 중복service 방지
                        if(prodList.length > 0) {
                            for(let v1=0; v1<prodList.length; v1++) {
                                if (prodList[v1] == member_menu_list[i1].servicename) {
                                    isExPord = true;
                                    break;
                                }
                            }
                        }
                        if(!isExPord) {
                            prodList.push(member_menu_list[i1].servicename);
                            isExActive = true;
                            break;
                        }
                    }
                }
                if(!isExActive || !isEx){
                    continue;
                }

                //2023-03-09 Zone 하나만 가입한 사용자에 대해 청약 및 LNB Hide (DX-M1 제외)
                if(onlyCentralUserYn() != "" && NoneCentralMenu(member_menu_list[i1].servicename)){
                    continue;
                }
                
                //2023-04-06 Ent.Security 및 금융 클라우드(Finance) 가입한 사용자 일부 서비스 청약 및 LNB Hide
                if(is_ent_user() && NoneEntUserMenu(member_menu_list[i1].servicename)){
                    continue;
                }

                var menu_html1 = '';
                if(member_menu_list[i1].servicename == "storage3"){
                    if(s3 == "N" || s3 == "") {
                        continue;
                    }
                }
                if(member_menu_list[i1].servicename == "storage" || member_menu_list[i1].servicename == "storage2"){
                    //if(ss == "N" || ss == "") {
                    continue;
                    //}
                }
                if($("#depth1_menu_ul > .vdepth1").hasClass(member_menu_list[i1].servicename)) {
                    continue;
                }

                if(service && service == member_menu_list[i1].servicename) {
                    if(service == "linkhybridcloud") {
                        menu_html1 = '<li class="novdepth2 m43 linkhybridcloud" onclick="javascript:set_hcmp_url();">\n';
                        menu_html1 += '<a class="on" href="#">\n';
                        menu_html1 += '<span>Hybrid Cloud Mgmt. Platform</span>\n';
                        menu_html1 += '</a>\n';
                        menu_html1 += '<ul' + ' style="display:none;">\n';
                        menu_html1 += '</ul>\n';
                        menu_html1 += '</li>';

                        $("#depth1_menu_ul").append(menu_html1);
                        continue;
                    } else {
                        menu_html1 += '<li class="vdepth1 on ' + get_img_class(member_menu_list[i1].servicename) + ' ' + member_menu_list[i1].servicename + '">\n';
                    }
                } else {
                    if(member_menu_list[i1].servicename == "linkhybridcloud") {
                        menu_html1 = '<li class="novdepth2 m43 linkhybridcloud" onclick="javascript:set_hcmp_url();">\n';
                        menu_html1 += '<a href="#">\n';
                        menu_html1 += '<span>Hybrid Cloud Mgmt. Platform</span>\n';
                        menu_html1 += '</a>\n';
                        menu_html1 += '<ul' + ' style="display:none;">\n';
                        menu_html1 += '</ul>\n';
                        menu_html1 += '</li>';

                        $("#depth1_menu_ul").append(menu_html1);
                        continue;
                    } else {
                        menu_html1 += '<li class="vdepth1 ' + get_img_class(member_menu_list[i1].servicename) + ' ' + member_menu_list[i1].servicename + '">\n';
                    }
                }

                menu_html1 += '<a href="#">\n';
                menu_html1 += '<span>' + get_service_dispnm(member_menu_list[i1].servicename) + '</span>\n';
                menu_html1 += '<span class="i"></span>\n';
                menu_html1 += '</a>\n';

                if(service && service == member_menu_list[i1].servicename) {
                    menu_html1 += '<ul>\n';
                } else {
                    menu_html1 += '<ul' + ' style="display:none;">\n';
                }

                for(var j1 = 0; j1 < sub_service_data.length; j1++) {
                    if(member_menu_list[i1].servicename == sub_service_data[j1].mainservice) {
                        if(service_basic_ex_data.filter( f => f.displayname == sub_service_data[j1].displayname).map( m=> m.activeYN)[0] == "N"){
                            continue;
                        }

                        if(sub_menu && sub_menu == sub_service_data[j1].subservice) {
                            menu_html1 += '<li class="vdepth2 on ' + sub_service_data[j1].subservice + '">\n';
                        } else {
                            menu_html1 += '<li class="vdepth2 ' + sub_service_data[j1].subservice + '">\n';
                        }

                        if(sub_service_data[j1].activeYN && sub_service_data[j1].activeYN=="N"){
                            menu_html1 += '<a class="preparing">\n';
                        } else if(sub_service_data[j1].subservice ==  "N") { // 미오픈 서비스
                            menu_html1 += '<a class="preparing" href="' + sub_service_data[j1].serviceurl + '">\n';
                        } else {
                            menu_html1 += '<a href="' + sub_service_data[j1].serviceurl + '">\n';
                        }

                        if(sub_service_data[j1].activeYN && sub_service_data[j1].activeYN=="N"){
                            menu_html1 += '<span class="f_gray tooltip_obj" id="abcdefg123' + j1 + '" tooltip_text="상품 신청이 필요합니다.">' + sub_service_data[j1].displayname + '</span>\n';
                        }else{
                            menu_html1 += '<span>' + sub_service_data[j1].displayname + '</span>\n';
                        }
                        menu_html1 += '</a>\n';
                        menu_html1 += '</li>\n';
                    }
                }

                menu_html1 += '</ul>\n';
                menu_html1 += '</li>';

                $("#depth1_menu_ul").append(menu_html1);
            }
        }
    } else {    // menu 관리 lnb
        $("#menu_wrap").show();

        if(member_menu_list.length < 1) {
            for(var i2 = 0; i2 < active_member_service_list.length; i2++) {
                //2023-03-09 Zone 하나만 가입한 사용자에 대해 청약 및 LNB Hide (DX-M1 제외)
                if(onlyCentralUserYn() != "" && NoneCentralMenu(active_member_service_list[i2].servicename)){
                    continue;
                }
                //2023-04-06 Ent.Security 및 금융 클라우드(Finance) 가입한 사용자 일부 서비스 청약 및 LNB Hide
                if(is_ent_user() && NoneEntUserMenu(active_member_service_list[i2].servicename)){
                    continue;
                }
                //지정된 메뉴는 보이지 않게 하기
                if(serviceNmArr.indexOf(active_member_service_list[i2].servicename) > -1){
                    continue;
                }

                var menu_html2 = '<li class="vdepth1 ' + get_img_class(active_member_service_list[i2].servicename) + ' ' + active_member_service_list[i2].servicename + '"><a href="#"><span>' + get_service_dispnm(active_member_service_list[i2].servicename) + '</span><span class="i2"></span></a></li>';
                //$("#menu_wrap").append(menu_html2);
            }
        } else {
            let prodList = new Array();
            let menuCnt = Number(member_menu_list[member_menu_list.length - 1].menuorder);
            for(let a0 = 0; a0 < active_member_service_list.length; a0++) {
                let isActive = false;
                for(var a1 = 0; a1 < member_menu_list.length; a1++) {
                    if (active_member_service_list[a0].servicename == member_menu_list[a1].servicename) {
                        isActive = true;
                        break;
                    }
                }
                //지정된 메뉴는 보이지 않게 하기
                if(serviceNmArr.indexOf(active_member_service_list[a0].servicename) > -1){
                    isActive = true;
                }
                if(!isActive) {
                    menuCnt++;
                    member_menu_list.push({servicename:active_member_service_list[a0].servicename, menuorder:menuCnt});
                }
            }
            for(var i3 = 0; i3 < member_menu_list.length; i3++) {

                //지정된 메뉴는 보이지 않게 하기
                if(serviceNmArr.indexOf(member_menu_list[i3].servicename) > -1){
                    continue;
                }
                //20230711 IAM LNB 개선
                let isExActive = false;
                let isEx = false;
                for(let v=0; v<active_member_service_list.length; v++) {
                    if(active_member_service_list[v].servicename == member_menu_list[i3].servicename) {
                        isEx = true;
                        let isExPord = false;
                        //member_menu_list에 중복service 방지
                        if(prodList.length > 0) {
                            for(let v1=0; v1<prodList.length; v1++) {
                                if (prodList[v1] == member_menu_list[i3].servicename) {
                                    isExPord = true;
                                    break;
                                }
                            }
                        }
                        if(!isExPord) {
                            prodList.push(member_menu_list[i3].servicename);
                            isExActive = true;
                            break;
                        }
                    }
                }
                if(!isExActive || !isEx){
                    continue;
                }

                //2023-03-09 Zone 하나만 가입한 사용자에 대해 청약 및 LNB Hide (DX-M1 제외)
                if(onlyCentralUserYn() != "" && NoneCentralMenu(member_menu_list[i3].servicename)){
                    continue;
                }
                
                //2023-04-06 Ent.Security 및 금융 클라우드(Finance) 가입한 사용자 일부 서비스 청약 및 LNB Hide
                if(is_ent_user() && NoneEntUserMenu(member_menu_list[i3].servicename)){
                    continue;
                }

                var menu_html3 = '<li class="vdepth1 ' + get_img_class(member_menu_list[i3].servicename) + ' ' + member_menu_list[i3].servicename + '"><a href="#"><span>' + get_service_dispnm(member_menu_list[i3].servicename) + '</span><span class="i2"></span></a></li>';
                //$("#menu_wrap").append(menu_html3);
            }
        }
    }

    $("#depth1_menu_ul").empty();
    $.ajax({
        type:"GET",
        url: "/leftmenu/ajax/init.do?platform=d",
        async : false,
        success: function(res){
            $.each(JSON.parse(res), function(key, value){

                let menu_html_1 = '';
                let menu_name = value.menu;

                switch(menu_name) {
                    case "allservice" :
                        return true;
                    case "dashboard" :
                        //$("#depth1_menu_ul").append('<li class="vdepth1 mdash"><a href="/console/d/osmain" class="on"><span">Dashboard</span></a></li>');
                        $("#depth1_menu_ul").append('<li class="vdepth1 ' + menu_name + '"><a href="/console/d/dashboard"><img src="/images/menu/leftmenu/' + menu_name + '.svg"></img><span>Dashboard</span></a></li>');
                        return true;
                    /*case "user" :
                         $("#depth1_menu_ul").append(get_user_menu());
                         return true;
                    case "iam" :
                        set_iam_menu();
                        return true;*/
                }

                menu_html_1 += '<li class="vdepth1 '+ menu_name +'">\n';
                menu_html_1 += '<a href="#" >\n';
                menu_html_1 += '<img src="/images/menu/leftmenu/'+ value.menu + '.svg">';
                menu_html_1 += '</img>\n';
                menu_html_1 += '<span>' + value.displayName + '</span>\n';

                if($.trim(value.children)) {

                    menu_html_1 += '<span class="i"></span>\n';
                    menu_html_1 += '</a>\n';
                    menu_html_1 += '<ul' + ' style="display:none;">\n';

                    $.each(value.children, function(key, value){
                        let url = value.url;

                        menu_html_1 += '<li class="vdepth2 '+value.menu +'">\n';
                        menu_html_1 += '<a href="' + url + '">\n';
                        menu_html_1 += '<span>' + value.displayName + '</span>\n';
                        menu_html_1 += '</a>\n';
                        menu_html_1 += '</li>\n';
                    });
                    menu_html_1 += '</ul>\n';
                }
                menu_html_1 += '</li>';

                $("#depth1_menu_ul").append(menu_html_1);
            });
        },
    });

    set_lnb_click();

    if(service != "main" && service != "platform" && service != "allservice" && service != "noservice") {
        if(service && sub_menu) {
            var main_lnb = $("#depth1_menu_ul").find('.vdepth1');
            var dest_lnb = null;

            main_lnb.each(function() {
                if($(this).hasClass(service)) {
                    $(this).trigger("click");

                    dest_lnb = $(this);
                }
            });

            if(dest_lnb) {
                var sub_lnb = dest_lnb.find('ul > li');

                sub_lnb.each(function() {
                    if($(this).hasClass(sub_menu)) {
                        $(this).find('a').addClass("on");
                    }
                });
            } else {
                window.location.href = "/console/d/osmain";
            }
        }
    }

    set_all_tooltip();

    hideMenuLoadingBox();
}

function set_lnb_click(event) {

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

    function vNavToggle(toggle_event){
        toggle_event.preventDefault();
        var t = $(this);

        vNav_i.removeClass('active');

        if (t.find('ul').first().is(':hidden')) {            //닫혀있는상태
            vNav_i.find('ul').slideUp(200);            //다른 모든 UL 닫기(1depth)
            t.find('ul').first().slideDown(200);    //현재 클릭한 UL 열기(1depth)
            t.addClass('active');

            var prev_position = t.offset().top;

            setTimeout(function(){
                set_re_position(t, prev_position);
            }, 100);
        } else if (t.find('ul').first().is(':visible')){    //열려있는 상태
            t.find('ul').slideUp(200);                //현재 클릭한 UL 닫기(1depth)
            t.removeClass('active');
        } else if (!t.next('ul').langth) {            //ul이 없는 경우
            vNav_i.find('ul').slideUp(200);
            t.removeClass('active');

            if(t.hasClass("dashboard")) {
                window.location.href = t.find("a").attr("href");
            }
        }

        return false;
    }

    function url(url_event){
        url_event.preventDefault();
        var t = $(this);

        if(t.find("a").hasClass("preparing")) {
            var service_nm = trim(t.text());
            var service_url = t.find("a").attr("href").replace("/g","");

            sessionStorage.setItem("noservice_nm", service_nm);
            sessionStorage.setItem("noservice_url", service_url);

            window.location.href = "/console/g/preparing";
        } else {
            window.location.href = t.find("a").attr("href");
        }

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
    }

    $('.vdepth4').click(url);
    $('.vdepth1').click(vNavToggle);
    $('.vdepth2').click(url);


    vNav.find('>ul>li>ul').prev('a').append('<span class="i"></span>');
    vNav.find('>ul>li>ul>li>ul').prev('a').append('<span class="i"></span>');
}

/*
function set_platform() {
    var dest_platform = "D";    // default는 D

    if($("#platform_g_table").css("display") != "none") {    // G를 선택한 경우
        dest_platform = "G";
    }


    if(dest_platform == "D") {
        window.location.href = "/console/d/osmain";
    }else{
        var params        = { command : "updateMemPlatform" };
        params.menmberPlatform = dest_platform;

        $.ajax({
            url: "/userinfo",
            type:"POST",
            data:params,
            dataType:"json",
            success:updateMemPlatform.bind(this, dest_platform)
        });
    }
}

function updateMemPlatform(dest_platform, json_obj) {
    $.cookie('memplatform',    dest_platform,    { expires: 0, path : WebROOT, secure : true});

    if(json_obj.status == "success") {
        if(dest_platform == "G") {
            window.location.href = "/console/g/main";
        } else {
            window.location.href = "/console/d/osmain";
        }
    }
}
*/

function get_platform() {
    $.ajax({
        url: "/userinfo",
        type:"POST",
        data:"command=getMemPlatform",
        dataType:"json",
        success:getMemPlatform
    });
}

function getMemPlatform(json_obj) {
    var member_platform = json_obj.data;
    $.cookie('memplatform',    member_platform,    { expires: 0, path : WebROOT, secure : true});
}

function get_url_service_name(svc_url) {
    var temp_url = svc_url.split("/");

    var dest_url = temp_url[temp_url.length - 1];

    for(var i = 0; i < sub_service_data.length; i++) {
        var cmp_url = sub_service_data[i].serviceurl.split("/");

        if(dest_url == cmp_url[cmp_url.length - 1]) {
            return sub_service_data[i].displayname;
        }
    }

    return "";
}

var sessaliveFn_rtrn = "";

function sessalive(loginyn) {
    $.ajax({
        url:"/bizMecaInfo",
        type: "POST",
        dataType: "json",
        data : {command:"sessalive"},
        async:false,
        success: sessaliveFn.bind(this, loginyn)
    });

    return sessaliveFn_rtrn;
}

function sessaliveFn(loginyn, json_obj) {
    sessaliveFn_rtrn = json_obj.result;

    if(sessaliveFn_rtrn == "0" && loginyn==true) {
        window.location.href="/console/landing";
    }
}

function sub_service_data_chage(submenu) {
    for(var i=0; i < sub_service_data.length; i++) {
        if(sub_service_data[i].subservice !="N" && submenu == sub_service_data[i].subservice) {
            sub_service_data[i].activeYN="Y";
        }
    }
}

// function get_backup_url(service_name) {
//     for(var i=0; i < backup_service_list.length; i++) {
//         if(backup_service_list[i].servicename == service_name) {
//             return backup_service_list[i].serviceurl;
//         }
//     }
// }

// function set_backup_state(service_code, state) {
//     for(var i=0; i < backup_service_list.length; i++) {
//         if(backup_service_list[i].servicecode == service_code) {
//             backup_service_list[i].activeYN = state;
//         }
//     }
// }

// function is_backup_service(service_name) {
//     return (service_name == "backup" || service_name == "pcbackup") ? true : false;
// }

function get_user_menu() {
    var return_menu = '<li class="vdepth1 muser user">';

    return_menu += '\n <a href="#">';
    return_menu += '\n <span>User</span>';
    return_menu += '\n <span class="i"></span>';
    return_menu += '\n </a>';

    return_menu += '\n <ul>';
    return_menu += '\n <li class="vdepth2 myaccount"><a href="/console/d/osmyaccount"><span>내 계정</span></a></li>';
    return_menu += '\n <li class="vdepth2 mypayment"><a href="/console/d/osmypayment"><span>이용 금액</span></a></li>';
    return_menu += '\n <li class="vdepth2 myapplyservice"><a href="/console/d/osmyapplyservice"><span>결제 정보</span></a></li>';
    return_menu += '\n <li class="vdepth2 coupon"><a href="/console/d/oscoupon"><span>할인</span></a></li>';
    return_menu += '\n <li class="vdepth2 myqna"><a href="/console/d/osmyqna"><span>내 문의</span></a></li>';
    return_menu += '\n <li class="vdepth2 myloginhistory"><a href="/console/d/osmyloginhistory"><span>내 접속 이력</span></a></li>';
    return_menu += '\n <li class="vdepth2 mygroupaccount"><a href="/console/d/osgroupaccount"><span>그룹 계정</span></a></li>';


    return_menu += '\n </ul>';
    return_menu += '\n </li>';

    return return_menu;
}

function get_reseller_menu() {
    var return_menu = '<li class="vdepth1 m39 reseller">';

    return_menu += '\n<a href="#">';
    return_menu += '\n<span>Reseller</span>';
    return_menu += '\n<span class="i"></span>';
    return_menu += '\n</a>';

    return_menu += '\n <ul>';

    return_menu += '\n <li class="vdepth2 resellernotice"><a href="/console/d/osresellerNotice"><span>리셀러 공지</span></a></li>';
    return_menu += '\n <li class="vdepth2 resellerresellingstatus"><a href="/console/d/osresellerResellingStatus"><span>리셀링 현황</span></a></li>';
    return_menu += '\n <li class="vdepth2 reselleraccountstatus"><a href="/console/d/osresellerAccountStatus"><span>계정별 현황</span></a></li>';
    return_menu += '\n <li class="vdepth2 resellermngsvcstatus"><a href="/console/d/osresellerMngServiceStatus"><span>매니지드 서비스 현황</span></a></li>';
    return_menu += '\n <li class="vdepth2 resellermngaccstatus"><a href="/console/d/osresellerMngAccountStatus"><span>매니지드 계정 현황</span></a></li>';
    return_menu += '\n <li class="vdepth2 reselleragencyaccstatus"><a href="/console/d/osresellerAgencyAccountStatus"><span>대리점 계정 현황</span></a></li>';
    return_menu += '\n <li class="vdepth2 resellerconsulting"><a href="/console/d/osresellerConsultingMgmt"><span>컨설팅 관리</span></a></li>';
    return_menu += '\n <li class="vdepth2 resellerpipeline"><a href="/console/d/osresellerPipeline"><span>파이프라인 관리</span></a></li>';
    return_menu += '\n </ul>';
    return_menu += '\n </li>';

    return return_menu;
}

//2022-07-11 iam 사용자도 내 문의 제공
function get_iam_user_menu() {
    var return_menu = '<li class="vdepth1 muser user">';

    return_menu += '\n <a href="#">';
    return_menu += '\n <span>User</span>';
    return_menu += '\n <span class="i"></span>';
    return_menu += '\n </a>';
    return_menu += '\n <ul>';
    return_menu += '\n <li class="vdepth2 myqna"><a href="/console/d/osmyqna"><span>내 문의</span></a></li>';
    return_menu += '\n </ul>';
    return_menu += '\n </li>';

    return return_menu;
}

function get_iam_menu() {
    var return_menu = '<li class="vdepth1 m39 iam">';

    return_menu += '\n<a href="#">';
    return_menu += '\n<span>IAM</span>';
    return_menu += '\n<span class="i"></span>';
    return_menu += '\n</a>';

    return_menu += '\n <ul>';
    return_menu += '\n <li class="vdepth2 iamuser"><a href="/console/d/osiamuser"><span>User</span></a></li>';
    return_menu += '\n <li class="vdepth2 iampolicy"><a href="/console/d/osiampolicy"><span>Policy</span></a></li>';
    return_menu += '\n <li class="vdepth2 iampolicygroup"><a href="/console/d/osiampolicygroup"><span>Policy Group</span></a></li>';
    return_menu += '\n <li class="vdepth2 iamaudituser"><a href="/console/d/osiamaudituser"><span>Audit(user)</span></a></li>';
    return_menu += '\n <li class="vdepth2 iamauditaction"><a href="/console/d/osiamauditaction"><span>Audit(action)</span></a></li>';
    return_menu += '\n </ul>';

    return_menu += '\n </li>';

    return return_menu;
}

function set_iam_menu() {
    if($.cookie("iamid")){
        return;
    }
    var params =     {
        command : "servicelist"
    };
    $.ajax({
        url : "/iam",
        type : "POST",
        data : params,
        async : false,
        dataType : "json",
        success : set_iam_menu_fn.bind(this)
    });
}

function set_iam_menu_fn(json) {
    var list = json.data;
    if(list.length > 0){
        $("#depth1_menu_ul").append(get_iam_menu());
    }
}

//2023-03-09 Zone 하나만 가입한 사용자에 대해 청약 및 LNB Hide (DX-M1 제외)
function NoneCentralMenu(serviceNm){
    var serviceArr = [];

    if ( osStackList == undefined || osStackList == null || osStackList.length == 0 ) {
        return false;
    } else {
        if(osStackList.length == 1) {
            if (osStackList[0].stack_id == "12") {
                serviceArr.push("autoscaling","messaging","devops","flyingcube");
            } else if (osStackList[0].stack_id == "13") {
                // LNB central service
                serviceArr.push("autoscaling","messaging","devops","flyingcube","wafpro");
            }
        }
    }

    if(serviceArr.length > 0){
        if(serviceArr.indexOf(serviceNm) > -1){
            return true;
        }else{
            return false;
        }
    }
    
    return false;

}

function set_hcmp_url() {
    var param={
        command : 'hybridcloudSsoInternal'
    }

    $.ajax({
        url        : "/hybridcloud",
        type    : "POST",
        data    : param,
        dataType:"json",
        async    : false,
        complete : hideLoadingBox,
        success    : hybridcloudOpen_Fn.bind(this),
        error: hybridcloudOpen_error_Fn.bind(this)
    });
}

function hybridcloudOpen_Fn(json){
    if ( json.status == '00'){
        var data = json.data;
        window.open("http://hcmp.cloud.kt.com/web/ktsso?authkey=" + data.hybridcloudssointernalresponse.result.authKey);
    } else{
        showCommonMsg($("#dialog_link_error"),"hybridcloud");
        $("#btn_link_qna").click(link_qna_Fn);
    }
}

function hybridcloudOpen_error_Fn(json){
    showCommonMsg($("#dialog_link_error"),"hybridcloud");
    $("#btn_link_qna").click(link_qna_Fn);
}

function link_qna_Fn(){
    $("#dialog_link_error").dialog("close");
    go_portal_inquiry('137','Hybrid Cloud');
}

function sanitizeXSS(val) {
    if(val == null)
        return val;
    val = val.replace(/</g, "&lt;");  //replace < whose unicode is \u003c     
    val = val.replace(/>/g, "&gt;");  //replace > whose unicode is \u003e  
    return val;
}

//2023-04-06 Ent.Security 및 금융 클라우드(Finance) 가입한 사용자 일부 서비스 청약 및 LNB Hide
function NoneEntUserMenu(serviceNm){
    let serviceArr = ["dns"];

    if (is_ent_user()) {
        if(serviceArr.length > 0){
            if(serviceArr.indexOf(serviceNm) > -1){
                return true;
            }else{
                return false;
            }
        }
    }
    return false;
}

