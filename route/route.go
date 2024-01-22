package route

import (
	"fmt"
	"gcore_console/webdir/controller"
	"gcore_console/webdir/model"
	"html/template"
	"io"
	"log"
	"net/http"

	"github.com/labstack/echo/v4"
)

type ResponseMsgBlock struct {
	Status string      `json:"status"`
	Data   interface{} `json:"data"`
}

// Route : 웹 서버 경로 설정
func Route() *echo.Echo {
	e := echo.New()

	// Set templates
	e.Renderer = SetTemplates()
	e.Static("/", "static")

	// Middleware
	// mainRouter := e.Group("/", cmiddleware.GcoreConsoleAuth)

	// HealthCheck
	e.GET("ping", func(c echo.Context) error {
		log.Println("pong")
		return c.String(http.StatusOK, "pong")
	})

	/* 1. 페이지 */
	// 1-1 Resource 목록
	e.GET("/cdn/list", controller.CDNResourceListCTRL)
	// 1-2 Resource 상세/수정
	e.GET("/cdn/detail/:id", controller.CDNResourceDetailCTRL)
	// 1-3 Purge
	e.GET("/cdn/purge", controller.CDNPurgeCTRL)
	// 1-4 Statistics
	e.GET("/cdn/usage", controller.CDNStatisticsCTRL)
	// (현재 사용X) OriginGroup
	e.GET("/cdn/origin_group", controller.CDNOriginGroupCTRL)

	/* 2. 데이터 호출 */
	// CDN Resource 전체 리스트

	e.GET("/cdn/resources", func(c echo.Context) error {
		// ordering := c.QueryParam("ordering")

		// deleted := c.QueryParam("deleted")
		if c.QueryParam("fields") == "id,cname,status" {
			cdnList, err := model.GetResourceList(c.Request().RequestURI)
			if err != nil {
				log.Println(err)
				return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
			}
			return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: cdnList})
		} else {
			cdnList, err := model.GetResourceList(c.Request().RequestURI)
			if err != nil {
				log.Println(err)
				return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
			}
			return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: cdnList})
		}

	})
	// CDN Resource 상세보기
	e.GET("/cdn/resources/:id", func(c echo.Context) error {
		data, err := model.GetResource(c.Param("id"))
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}
		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: data})
	})
	// CDN Resources 생성
	e.POST("/cdn/resources", func(c echo.Context) error {
		u := new(model.ResourceBlock)
		if err := c.Bind(u); err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}

		err := model.CreateCDN(u)
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}

		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: u})
	})
	// CDN Resource 삭제
	e.DELETE("/cdn/resources/:id", func(c echo.Context) error {
		err := model.DeleteResource(c.Param("id"))
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}

		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: "success"})
	})
	// CDN Resource 시작/정지
	e.PUT("/cdn/:action/:id", func(c echo.Context) error {
		// start, stop 파라미터에 따라 시작/정지
		var action bool
		if c.Param("action") == "stop" {
			action = false
		} else if c.Param("action") == "start" {
			action = true
		} else {
			// start, stop 파라미터가 아닐 때
			msg := fmt.Sprintf("Parameter error : /cdn/%s", c.Param("action"))
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: msg})
		}
		err := model.ActiveCDN(c.Param("id"), action)
		if err != nil {
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}

		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: "success"})
	})

	// Origin Group List
	e.GET("/cdn/origin_groups/:view", func(c echo.Context) error {
		// all, name 파라미터가 아닐 때
		if c.Param("view") != "all" && c.Param("view") != "name" {
			msg := fmt.Sprintf("Parameter error : /cdn/origin_groups/%s", c.Param("view"))
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: msg})
		}
		originList, err := model.GetOriginGroupList(c.Param("view"))
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}
		return c.JSON(200, originList)
	})

	// Origin Group 삭제
	e.DELETE("/cdn/origin_groups/:id", func(c echo.Context) error {
		err := model.DeleteOriginGroup(c.Param("id"))
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}
		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: "success"})
	})

	// Origin Group 생성
	e.POST("/cdn/origin_group", func(c echo.Context) error {
		u := new(model.OriginResource)
		if err := c.Bind(u); err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}
		originGroup, err := model.PostOriginGroupList(u)
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}
		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: originGroup})
	})

	// Purge 실행
	e.POST("cdn/resources/purge", func(c echo.Context) error {
		u := new(model.PurgeBlock)
		if err := c.Bind(u); err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}
		err := model.PurgeCDN(u)
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}

		//Purge 실행할 때, urls 혹은 paths 필드 하나만 넣어야됨.
		//{"urls":["/images"],"id":"361345"}
		//"urls":["/images"],"paths":null,"id":"361345"} >> [ERROR : 400] {"errors":{"paths":["This field may not be null."]}}
		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: "success"})
	})

	return e
}

// TemplateRenderer is a custom html/template renderer for Echo framework
type TemplateRenderer struct {
	templates *template.Template
}

// Render renders a template document
func (t *TemplateRenderer) Render(w io.Writer, name string, data interface{}, c echo.Context) error {
	return t.templates.ExecuteTemplate(w, name, data)
}

// SetTemplates set templates
func SetTemplates() *TemplateRenderer {
	templates := []string{
		"static/templates/401.html",
		"static/templates/404.html",
		"static/templates/500.html",
		"static/templates/cdnlist.html",
		"static/templates/cdndetail.html",
		"static/templates/usage.html",
		"static/templates/country.html",
		"static/templates/purge.html",
		"static/templates/origingroup.html",
		"static/templates/osadvcdnlist.html",
	}

	t, _ := template.New("").ParseFiles(templates...)
	renderer := &TemplateRenderer{
		templates: t,
	}
	return renderer
}

// func ParameterURL(params []string) string {
// 	str := ""
// 	for i, p := range params {
// 		if p != "" {
// 			if str == ""{
// 				str += "?"
// 			}else{

// 			}
// 		}
// 	}
// 	deleted := c.QueryParam("deleted")
// 	fields := c.QueryParam("fields")
// }
