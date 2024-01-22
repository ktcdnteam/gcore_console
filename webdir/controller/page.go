package controller

import "github.com/labstack/echo/v4"

// 1-1 Resource 목록
func CDNResourceListCTRL(c echo.Context) error {
	context := make(map[string]interface{})
	context["URL"] = "CDN_LIST"
	return c.Render(200, "osadvcdnlist.html", context)
}

// 1-2 Resource 상세/수정
func CDNResourceDetailCTRL(c echo.Context) error {
	context := make(map[string]interface{})
	context["URL"] = "CDN_DETAIL"
	context["ID"] = c.Param("id")

	return c.Render(200, "osadvcdnlist.html", context)
}

// 1-3 Purge
func CDNPurgeCTRL(c echo.Context) error {
	context := make(map[string]interface{})
	context["URL"] = "PURGE"
	return c.Render(200, "osadvcdnlist.html", context)
}

// 1-4 Statistics
func CDNStatisticsCTRL(c echo.Context) error {
	context := make(map[string]interface{})
	context["URL"] = "STATISTICS"
	return c.Render(200, "osadvcdnlist.html", context)
}

// (현재 사용X) OriginGroup
func CDNOriginGroupCTRL(c echo.Context) error {
	context := make(map[string]interface{})
	context["URL"] = "ORIGIN_GROUP"
	return c.Render(200, "osadvcdnlist.html", context)
}
