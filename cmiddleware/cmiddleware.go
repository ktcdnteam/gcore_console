package cmiddleware

import (
	"fmt"
	"net/http"
	"strings"

	"github.com/labstack/echo/v4"
)

// CustomContext :
type CustomContext struct {
	echo.Context
	CType     *string // content-type
	AdminInfo AdminInfoBlock
}

// GcoreConsoleAuth : Custom middleware for auth
func GcoreConsoleAuth(next echo.HandlerFunc) echo.HandlerFunc {
	return func(c echo.Context) error {
		cc := &CustomContext{Context: c}
		contentType := c.Request().Header.Get("Content-Type")
		cc.CType = &contentType
		cc.Response().Header().Add("Cache-Control", "no-cache, no-store, must-revalidate")

		ok := cc.CheckSessionID()
		adminInfo := cc.CheckAdminSession()
		if !ok {
			if c.Request().Method == "GET" {
				if c.Request().RequestURI == "/login" || strings.Contains(c.Request().RequestURI, "/static/") {
					return next(c)
				}
			} else if c.Request().Method == "POST" && c.Request().RequestURI == "/login" {
				return next(cc)
			}
			return c.HTML(http.StatusOK, LocationHref("Your session has expired. Please login again..",
				fmt.Sprintf("http://%s%s", c.Request().Host, "/login")))
		} else {
			cc.AdminInfo = adminInfo
			if c.Request().RequestURI != "/logout" && !strings.Contains(c.Request().RequestURI, "/static/") {
				return next(cc)
			}
		}
		return next(cc)
	}
}

// LocationHref : location.href script 코드 전송
func LocationHref(data string, page string) string {
	return fmt.Sprintf(`
		<body style="background: #fff">
        <script>
        alert("%s");
        window.location.href='%s';
        </script>
        </body>
	`, data, page)
}

// // MainRedirect :
// func MainRedirect(next echo.HandlerFunc) echo.HandlerFunc {
// 	return func(c echo.Context) error {
// 		if c.Request().RequestURI == "" || c.Request().RequestURI == "/" {
// 			cc := &CustomContext{Context: c}
// 			ok := cc.CheckSessionID()
// 			if ok {
// 				return c.Redirect(http.StatusMovedPermanently, fmt.Sprintf("https://%s/adminpage/memberlist", c.Request().Host))
// 			}
// 			return c.Redirect(http.StatusMovedPermanently, fmt.Sprintf("https://%s/adminpage/login", c.Request().Host))
// 		}
// 		return next(c)
// 	}
// }
