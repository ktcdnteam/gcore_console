package model

import (
	"encoding/json"
	"errors"
	"fmt"
	"gcore_console/loadconf"
	"gcore_console/shared/gcoreapi"
	"log"
	"strings"

	"time"
)

// {"id":379118,"options":{"custom_server_name":null,"slice":null,"gzipOn":null,"brotli_compression":null,"ignoreQueryString":null,"hostHeader":{"enabled":true,"value":"210.104.79.216:80"},"staticHeaders":null,"static_response_headers":null,"staticRequestHeaders":null,"allowedHttpMethods":null,"stale":{"enabled":true,"value":["error","updating"]},"cors":null,"proxy_cache_methods_set":null,"rewrite":null,"force_return":null,"secure_key":null,"cache_expire":null,"disable_cache":null,"ignore_cookie":null,"cache_http_headers":null,"response_headers_hiding_policy":null,"override_browser_ttl":null,"fetch_compressed":null,"disable_proxy_force_ranges":null,"redirect_http_to_https":null,"redirect_https_to_http":null,"sni":{"enabled":true,"sni_type":"dynamic","custom_hostname":""},"limit_bandwidth":null,"request_limiter":null,"bot_protection":null,"waf":null,"country_acl":null,"referrer_acl":null,"user_agent_acl":null,"ip_address_acl":null,"query_params_blacklist":null,"query_params_whitelist":null,"browser_cache_settings":null,"edge_cache_settings":{"enabled":true,"default":"0s"},"forward_host_header":null,"websockets":null,"use_default_le_chain":null,"use_rsa_le_cert":null,"use_dns01_le_challenge":null,"tls_versions":{"enabled":false,"value":["TLSv1.3","TLSv1.1","TLSv1.2","TLSv1","SSLv3"]},"follow_origin_redirect":null,"http3_enabled":null,"image_stack":null},"deleted":false,"secondaryHostnames":[],"rules":[],"client":250053,"status":"active","active":true,"enabled":true,"preset_applied":false,"vp_enabled":false,"originGroup_name":"Origins for server02.ktcdnteam.link","shielded":false,"shield_dc":null,"shield_enabled":false,"full_custom_enabled":false,"can_purge_by_urls":false,"name":null,"created":"2024-01-02T01:26:14.609699Z","updated":"2024-01-10T02:32:18.306957Z","originProtocol":"HTTP","cname":"cloud11.kt.com","sslEnabled":false,"ssl_automated":false,"proxy_ssl_enabled":false,"suspend_date":null,"suspended":false,"is_primary":null,"description":"server01","originGroup":467686,"sslData":null,"proxy_ssl_ca":null,"proxy_ssl_data":null,"shield_routing_map":null,"primary_resource":null}
type CDNBlock struct {
	ID      int `json:"id"`
	Options struct {
		CustomServerName  any `json:"custom_server_name"`
		Slice             any `json:"slice"`
		GzipOn            any `json:"gzipOn"`
		BrotliCompression any `json:"brotli_compression"`
		IgnoreQueryString any `json:"ignoreQueryString"`
		HostHeader        struct {
			Enabled bool   `json:"enabled"`
			Value   string `json:"value"`
		} `json:"hostHeader"`
		// StaticHeaders         any `json:"staticHeaders"`
		// StaticResponseHeaders any `json:"static_response_headers"`
		// StaticRequestHeaders  any `json:"staticRequestHeaders"`
		// AllowedHTTPMethods    any `json:"allowedHttpMethods"`
		Stale struct {
			Enabled bool     `json:"enabled"`
			Value   []string `json:"value"`
		} `json:"stale"`
		// Cors                        any `json:"cors"`
		// ProxyCacheMethodsSet        any `json:"proxy_cache_methods_set"`
		// Rewrite                     any `json:"rewrite"`
		// ForceReturn                 any `json:"force_return"`
		// SecureKey                   any `json:"secure_key"`
		// CacheExpire                 any `json:"cache_expire"`
		// DisableCache                any `json:"disable_cache"`
		// IgnoreCookie                any `json:"ignore_cookie"`
		// CacheHTTPHeaders            any `json:"cache_http_headers"`
		// ResponseHeadersHidingPolicy any `json:"response_headers_hiding_policy"`
		// OverrideBrowserTTL          any `json:"override_browser_ttl"`
		// FetchCompressed             any `json:"fetch_compressed"`
		// DisableProxyForceRanges     any `json:"disable_proxy_force_ranges"`
		// RedirectHTTPToHTTPS         any `json:"redirect_http_to_https"`
		// RedirectHTTPSToHTTP         any `json:"redirect_https_to_http"`
		Sni struct {
			Enabled        bool   `json:"enabled"`
			SniType        string `json:"sni_type"`
			CustomHostname string `json:"custom_hostname"`
		} `json:"sni"`
		// LimitBandwidth       any `json:"limit_bandwidth"`
		// RequestLimiter       any `json:"request_limiter"`
		// BotProtection        any `json:"bot_protection"`
		// Waf                  any `json:"waf"`
		CountryACL struct {
			Enabled        bool     `json:"enabled"`
			PolicyType     string   `json:"policy_type"`
			ExceptedValues []string `json:"excepted_values"`
		} `json:"country_acl"`
		// ReferrerACL          any `json:"referrer_acl"`
		// UserAgentACL         any `json:"user_agent_acl"`
		// IPAddressACL         any `json:"ip_address_acl"`
		// QueryParamsBlacklist any `json:"query_params_blacklist"`
		// QueryParamsWhitelist any `json:"query_params_whitelist"`
		BrowserCacheSettings struct {
			Enabled bool   `json:"enabled"`
			Value   string `json:"value"`
		} `json:"browser_cache_settings,omitempty"`
		EdgeCacheSettings struct {
			Enabled      bool   `json:"enabled"`
			Value        string `json:"value"`
			Default      string `json:"default"`
			CustomValues any    `json:"custom_values,omitempty"`
		} `json:"edge_cache_settings,omitempty"`
		// ForwardHostHeader   any `json:"forward_host_header"`
		// Websockets          any `json:"websockets"`
		// UseDefaultLeChain   any `json:"use_default_le_chain"`
		// UseRsaLeCert        any `json:"use_rsa_le_cert"`
		// UseDNS01LeChallenge any `json:"use_dns01_le_challenge"`
		TLSVersions struct {
			Enabled bool     `json:"enabled"`
			Value   []string `json:"value"`
		} `json:"tls_versions"`
		FollowOriginRedirect struct {
			Enabled bool  `json:"enabled,omitempty"`
			Codes   []int `json:"codes,omitempty"`
		} `json:"follow_origin_redirect,omitempty"`
		// HTTP3Enabled         any `json:"http3_enabled"`
		// ImageStack           any `json:"image_stack"`
	} `json:"options"`
	Deleted            bool     `json:"deleted"`
	SecondaryHostnames []string `json:"secondaryHostnames"`
	// Rules              []any     `json:"rules"`
	Client            int    `json:"client"`
	Status            string `json:"status"`
	Active            bool   `json:"active"`
	Enabled           bool   `json:"enabled"`
	PresetApplied     bool   `json:"preset_applied"`
	VpEnabled         bool   `json:"vp_enabled"`
	OriginGroupName   string `json:"originGroup_name"`
	Shielded          bool   `json:"shielded"`
	ShieldDc          any    `json:"shield_dc"`
	ShieldEnabled     bool   `json:"shield_enabled"`
	FullCustomEnabled bool   `json:"full_custom_enabled"`
	CanPurgeByUrls    bool   `json:"can_purge_by_urls"`
	// Name              any       `json:"name"`
	CreatedStr      string    `json:"created_str"`
	Created         time.Time `json:"created"`
	Updated         time.Time `json:"updated"`
	OriginProtocol  string    `json:"originProtocol"`
	Cname           string    `json:"cname"`
	SslEnabled      bool      `json:"sslEnabled"`
	SslAutomated    bool      `json:"ssl_automated"`
	ProxySslEnabled bool      `json:"proxy_ssl_enabled"`
	// SuspendDate       any       `json:"suspend_date"`
	Suspended bool `json:"suspended"`
	// IsPrimary         any       `json:"is_primary"`
	Description string `json:"description"`
	OriginGroup int    `json:"originGroup"`
	// SslData          any    `json:"sslData"`
	// ProxySslCa       any    `json:"proxy_ssl_ca"`
	// ProxySslData     any    `json:"proxy_ssl_data"`
	// ShieldRoutingMap any    `json:"shield_routing_map"`
	// PrimaryResource  any    `json:"primary_resource"`
}

type UpdateResourceBlock struct {
	ID      int `json:"id"`
	Options struct {
		CustomServerName  any `json:"custom_server_name"`
		Slice             any `json:"slice"`
		GzipOn            any `json:"gzipOn"`
		BrotliCompression any `json:"brotli_compression"`
		IgnoreQueryString any `json:"ignoreQueryString"`
		HostHeader        struct {
			Enabled bool   `json:"enabled"`
			Value   string `json:"value"`
		} `json:"hostHeader"`
		// StaticHeaders         any `json:"staticHeaders"`
		// StaticResponseHeaders any `json:"static_response_headers"`
		// StaticRequestHeaders  any `json:"staticRequestHeaders"`
		// AllowedHTTPMethods    any `json:"allowedHttpMethods"`
		Stale struct {
			Enabled bool     `json:"enabled"`
			Value   []string `json:"value"`
		} `json:"stale"`
		// Cors                        any `json:"cors"`
		// ProxyCacheMethodsSet        any `json:"proxy_cache_methods_set"`
		// Rewrite                     any `json:"rewrite"`
		// ForceReturn                 any `json:"force_return"`
		// SecureKey                   any `json:"secure_key"`
		// CacheExpire                 any `json:"cache_expire"`
		// DisableCache                any `json:"disable_cache"`
		// IgnoreCookie                any `json:"ignore_cookie"`
		// CacheHTTPHeaders            any `json:"cache_http_headers"`
		// ResponseHeadersHidingPolicy any `json:"response_headers_hiding_policy"`
		// OverrideBrowserTTL          any `json:"override_browser_ttl"`
		// FetchCompressed             any `json:"fetch_compressed"`
		// DisableProxyForceRanges     any `json:"disable_proxy_force_ranges"`
		// RedirectHTTPToHTTPS         any `json:"redirect_http_to_https"`
		// RedirectHTTPSToHTTP         any `json:"redirect_https_to_http"`
		Sni struct {
			Enabled        bool   `json:"enabled"`
			SniType        string `json:"sni_type"`
			CustomHostname string `json:"custom_hostname"`
		} `json:"sni"`
		// LimitBandwidth       any `json:"limit_bandwidth"`
		// RequestLimiter       any `json:"request_limiter"`
		// BotProtection        any `json:"bot_protection"`
		// Waf                  any `json:"waf"`
		CountryACL struct {
			Enabled        bool     `json:"enabled"`
			PolicyType     string   `json:"policy_type"`
			ExceptedValues []string `json:"excepted_values"`
		} `json:"country_acl"`
		// ReferrerACL          any `json:"referrer_acl"`
		// UserAgentACL         any `json:"user_agent_acl"`
		// IPAddressACL         any `json:"ip_address_acl"`
		// QueryParamsBlacklist any `json:"query_params_blacklist"`
		// QueryParamsWhitelist any `json:"query_params_whitelist"`
		BrowserCacheSettings any `json:"browser_cache_settings,omitempty"`
		EdgeCacheSettings    any `json:"edge_cache_settings,omitempty"`
		// ForwardHostHeader   any `json:"forward_host_header"`
		// Websockets          any `json:"websockets"`
		// UseDefaultLeChain   any `json:"use_default_le_chain"`
		// UseRsaLeCert        any `json:"use_rsa_le_cert"`
		// UseDNS01LeChallenge any `json:"use_dns01_le_challenge"`
		TLSVersions struct {
			Enabled bool     `json:"enabled"`
			Value   []string `json:"value"`
		} `json:"tls_versions"`
		FollowOriginRedirect any `json:"follow_origin_redirect,omitempty"`
		// HTTP3Enabled         any `json:"http3_enabled"`
		// ImageStack           any `json:"image_stack"`
	} `json:"options"`
	Deleted            bool     `json:"deleted"`
	SecondaryHostnames []string `json:"secondaryHostnames"`
	// Rules              []any     `json:"rules"`
	Client            int    `json:"client"`
	Status            string `json:"status"`
	Active            bool   `json:"active"`
	Enabled           bool   `json:"enabled"`
	PresetApplied     bool   `json:"preset_applied"`
	VpEnabled         bool   `json:"vp_enabled"`
	OriginGroupName   string `json:"originGroup_name"`
	Shielded          bool   `json:"shielded"`
	ShieldDc          any    `json:"shield_dc"`
	ShieldEnabled     bool   `json:"shield_enabled"`
	FullCustomEnabled bool   `json:"full_custom_enabled"`
	CanPurgeByUrls    bool   `json:"can_purge_by_urls"`
	// Name              any       `json:"name"`
	Created         time.Time `json:"created"`
	CreatedStr      string    `json:"created_str"`
	Updated         time.Time `json:"updated"`
	OriginProtocol  string    `json:"originProtocol"`
	Cname           string    `json:"cname"`
	SslEnabled      bool      `json:"sslEnabled"`
	SslAutomated    bool      `json:"ssl_automated"`
	ProxySslEnabled bool      `json:"proxy_ssl_enabled"`
	// SuspendDate       any       `json:"suspend_date"`
	Suspended bool `json:"suspended"`
	// IsPrimary         any       `json:"is_primary"`
	Description string `json:"description"`
	OriginGroup int    `json:"originGroup"`
	// SslData          any    `json:"sslData"`
	// ProxySslCa       any    `json:"proxy_ssl_ca"`
	// ProxySslData     any    `json:"proxy_ssl_data"`
	// ShieldRoutingMap any    `json:"shield_routing_map"`
	// PrimaryResource  any    `json:"primary_resource"`
}
type PostResourceBlock struct {
	SslEnabled         bool          `json:"sslEnabled"`
	SslData            any           `json:"sslData"`
	Active             bool          `json:"active"`
	OriginGroup        int           `json:"originGroup"`
	OriginProtocol     string        `json:"originProtocol"`
	Cname              string        `json:"cname"`
	Description        string        `json:"description"`
	Origin             string        `json:"origin"`
	SecondaryHostnames []string      `json:"secondaryHostnames"`
	Options            *OptionsBlock `json:"options"`
}

type OptionsBlock struct {
	EdgeCacheSettings  *EdgeCacheSettingsBlock `json:"edge_cache_types"`
	CacheExpire        any                     `json:"cache_expire"`
	Stale              *StaleBlock             `json:"stale"`
	AllowedHTTPMethods any                     `json:"allowedHttpMethods"`
	CacheHTTPHeaders   any                     `json:"cache_http_headers"`
	HostHeader         *HostHeaderBlock        `json:"hostHeader"`
	ForwardHostHeader  any                     `json:"forward_host_header"`
	LimitBandwidth     any                     `json:"limit_bandwidth"`
	BotProtection      any                     `json:"bot_protection"`
}

type EdgeCacheSettingsBlock struct {
	Enabled bool `json:"enabled"`
	// Default string `json:"default"`
	Default string `json:"default"`
}

type PostOriginGroupBlock struct {
	ID       int            `json:"id"`
	AuthType string         `json:"auth_type"`
	UseNext  bool           `json:"use_next"`
	Sources  []*SourceBlock `json:"sources"`
	Name     string         `json:"name"`
}

type HostHeaderBlock struct {
	Enabled bool   `json:"enabled"`
	Value   string `json:"value"`
}

type SourceBlock struct {
	Source  string `json:"source"`
	Backup  bool   `json:"backup"`
	Enabled bool   `json:"enabled"`
}

type OriginGroupInfoBlock struct {
	ID      int    `json:"id"`
	Name    string `json:"name"`
	Sources []struct {
		Source  string `json:"source"`
		Backup  bool   `json:"backup"`
		Enabled bool   `json:"enabled"`
		Tag     string `json:"tag"`
	} `json:"sources"`
	HasRelatedResources bool                 `json:"has_related_resources"`
	UseNext             bool                 `json:"use_next"`
	AuthType            string               `json:"auth_type"`
	Path                string               `json:"path"`
	ResourceInfo        []*ResourceInfoBlock `json:"resource_info"`
}

type StaleBlock struct {
	Enabled bool     `json:"enabled"`
	Value   []string `json:"value"`
}
type ResourceInfoBlock struct {
	Status      string `json:"status"`
	Description string `json:"description"`
}

func GetResourceList(url string) ([]*CDNBlock, error) {
	url = strings.TrimLeft(url, "/")
	respBody, err := gcoreapi.Request(nil, url, "GET", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	var cdnList []*CDNBlock
	err = json.Unmarshal(respBody, &cdnList)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	for _, v := range cdnList {
		// v.CreatedStr = UTCChangeKR()
		log.Printf("%d. %s %s %s \n", v.ID, v.Cname, v.Created, v.Status)
	}

	return cdnList, nil
}

// GetOriginGroupList
func GetOriginGroupList(urlpath string) ([]*OriginGroupInfoBlock, error) {
	respBody, err := gcoreapi.Request(nil, "cdn/origin_groups", "GET", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	var originList []*OriginGroupInfoBlock
	err = json.Unmarshal(respBody, &originList)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	// all 일 경우, originGroup 매핑되어있는 cdn resource 목록까지 가져옴
	if urlpath == "all" {
		for _, v := range originList {
			log.Println(v)
			if v.HasRelatedResources {
				url := fmt.Sprintf("cdn/resources?fields=status,description&originGroup=%d", v.ID)
				respBody, err := gcoreapi.Request(nil, url, "GET", loadconf.TOTKENINFO.Access)
				if err != nil {
					log.Println(err)
					return nil, err
				}
				err = json.Unmarshal(respBody, &v.ResourceInfo)
				if err != nil {
					log.Println(err)
					return nil, err
				}

			}
		}
	}
	return originList, nil
}

// UTC : 한국 시간대로 변환
// func UTCChangeKR(t time.Time) string {
// 	loc, err := time.LoadLocation("Asia/Seoul")
// 	if err != nil {
// 		log.Println("Error loading location:", err)
// 		return t.Format("2006-01-02 15:04:05")
// 	}
// 	str := t.In(loc).Format("2006-01-02 15:04:05")

// 	return str
// }

type OriginResource struct {
	Origins []string `json:"origins"`
	Name    string   `json:"name"`
}

func PostOriginGroupList(u *OriginResource) (*PostOriginGroupBlock, error) {
	var sources []*SourceBlock
	for _, origin_string := range u.Origins {
		sources = append(sources, &SourceBlock{
			Source:  origin_string,
			Backup:  false,
			Enabled: true,
		})
	}
	var name string
	if u.Name != "" {
		name = u.Name
	} else {
		name = u.Origins[0]
	}
	originGroupInfo := &PostOriginGroupBlock{
		Name:     name, //필수
		Sources:  sources,
		AuthType: "none", //
		UseNext:  false,
	}
	reqJSON, err := json.Marshal(*originGroupInfo)
	if err != nil {
		log.Println(err)
		return nil, err
	}

	respBody, err := gcoreapi.Request(reqJSON, "cdn/origin_groups", "POST", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	// log.Println(string(respBody))
	var originList *OriginGroupInfoBlock
	err = json.Unmarshal(respBody, &originList)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	originGroupInfo.ID = originList.ID

	return originGroupInfo, nil
}

/*
gcore cdn resource 는 이름 생성X (Cname 식별키)
*/
type ResourceBlock struct {
	ServiceName    string `json:"service_name"`
	ServiceDomain  string `json:"service_domain"`
	OriginID       int    `json:"origin_id"`
	OriginURL      string `json:"origin_url"`
	OriginProtocol string `json:"originProtocol"`
}

func DeleteOriginGroup(id string) error {
	url := fmt.Sprintf("cdn/origin_groups/%s", id)
	_, err := gcoreapi.Request(nil, url, "DELETE", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return err
	}
	return nil
}
func Csdf() error {
	respBody, err := gcoreapi.Request(nil, "cdn/clients/me", "GET", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return err
	}
	log.Println(string(respBody))
	return nil
}

func CreateCDN(u *ResourceBlock) error {
	host := &HostHeaderBlock{
		Enabled: true,
		Value:   u.OriginURL,
	}
	resourceInfo := &PostResourceBlock{
		SslEnabled: false, // SSL 사용 여부
		// SslData:            null,           // SSL 관련 데이터, 필요한 경우 설정
		Active:             true,             // 활성화 상태
		OriginGroup:        u.OriginID,       // 오리진 그룹 ID
		OriginProtocol:     u.OriginProtocol, // 오리진 프로토콜, "HTTPS", "MATCH"
		Cname:              u.ServiceDomain,  // CNAME
		Description:        u.ServiceName,    // 설명
		SecondaryHostnames: []string{},       // 보조 호스트네임, 필요한 경우 추가
		Options: &OptionsBlock{
			Stale:             &StaleBlock{Enabled: true, Value: []string{"error", "updating"}},
			EdgeCacheSettings: &EdgeCacheSettingsBlock{Enabled: true, Default: "4d"},
			HostHeader:        host,
		},
	}

	reqJSON2, err := json.Marshal(*resourceInfo)
	if err != nil {
		log.Println(err)
		return err
	}
	respBody2, err := gcoreapi.Request(reqJSON2, "cdn/resources", "POST", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return err
	}
	log.Println(string(respBody2))

	return nil
}
func GetResource(id string) (*CDNBlock, error) {
	respBody, err := gcoreapi.Request(nil, fmt.Sprintf("cdn/resources/%s", id), "GET", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	var cdnInfo *CDNBlock
	err = json.Unmarshal(respBody, &cdnInfo)
	if err != nil {
		log.Println(err)
		return nil, err
	}
	log.Println("###")
	log.Println(string(respBody))
	log.Println("###")
	return cdnInfo, nil
}
func DeleteResource(id string) error {

	_, err := gcoreapi.Request(nil, fmt.Sprintf("cdn/resources/%s", id), "DELETE", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}

type PurgeBlock struct {
	Urls  []string `json:"urls,omitempty"`  // omitempty 옵션 추가
	Paths []string `json:"paths,omitempty"` // omitempty 옵션 추가
	ID    string   `json:"id"`
}

func PurgeCDN(purgeList *PurgeBlock) error {
	reqJSON, err := json.Marshal(purgeList)
	if err != nil {
		log.Println(err)
		return err
	}
	log.Println(purgeList)
	_, err = gcoreapi.Request(reqJSON, fmt.Sprintf("cdn/resources/%s/purge", purgeList.ID), "POST", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}

func ActiveCDN(id string, active bool) error {
	respBody, err := gcoreapi.Request(nil, fmt.Sprintf("cdn/resources/%s", id), "GET", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return err
	}

	var cdnInfo *UpdateResourceBlock
	err = json.Unmarshal(respBody, &cdnInfo)
	if err != nil {
		log.Println(err)
		return err
	}

	if cdnInfo.Active == active {
		msg := fmt.Sprintf("already active is %t", active)
		return errors.New(msg)
	} else {
		cdnInfo.Active = active
	}

	reqJSON, err := json.Marshal(cdnInfo)
	if err != nil {
		log.Println(err)
		return err
	}
	_, err = gcoreapi.Request(reqJSON, fmt.Sprintf("cdn/resources/%s", id), "PUT", loadconf.TOTKENINFO.Access)
	if err != nil {
		log.Println(err)
		return err
	}

	return nil
}
