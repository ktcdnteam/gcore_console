package route

import (
	"fmt"
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
	// mainRouter := e.Group("/", cmiddleware.AdminConsoleAuth)
	//Middleware
	e.GET("ping", func(c echo.Context) error {
		log.Println("pong")
		return c.String(http.StatusOK, "pong")
	})

	// 하위 메뉴(resource, originGroup, purge)
	e.GET("/cdn/list", func(c echo.Context) error {
		context := make(map[string]interface{})
		context["URL"] = "CDN_LIST"
		return c.Render(200, "osadvcdnlist.html", context)
	})
	e.GET("/cdn/origin_group", func(c echo.Context) error {
		context := make(map[string]interface{})
		context["URL"] = "ORIGIN_GROUP"
		return c.Render(200, "osadvcdnlist.html", context)
	})
	e.GET("/cdn/purge", func(c echo.Context) error {
		context := make(map[string]interface{})
		context["URL"] = "PURGE"
		return c.Render(200, "osadvcdnlist.html", context)
	})
	// e.GET("/cdn/origin", func(c echo.Context) error {
	// 	context := make(map[string]interface{})
	// 	context["URL"] = "ORIGIN_GROUP"
	// 	return c.Render(200, "osadvcdnlist.html", context)
	// })
	e.GET("/cdn/list/all", func(c echo.Context) error {
		cdnList, err := model.GetResourceList()
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}
		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: cdnList})
	})

	e.GET("/cdn/origin_groups/:view", func(c echo.Context) error {
		originList, err := model.GetOriginGroupList(c.Param("view"))
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}
		return c.JSON(200, originList)
	})
	e.DELETE("/cdn/origin_groups/:id", func(c echo.Context) error {
		err := model.DeleteOriginGroup(c.Param("id"))
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}
		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: "success"})
	})
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

	//Purge 실행할 때, urls 혹은 paths 필드 하나만 넣어야됨.
	//{"urls":["/images"],"id":"361345"}
	//{"urls":["/images"],"id":"361345"}
	//"urls":["/images"],"paths":null,"id":"361345"} >> [ERROR : 400] {"errors":{"paths":["This field may not be null."]}}
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

		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: "success"})
	})
	e.DELETE("/cdn/resources/:id", func(c echo.Context) error {
		err := model.DeleteCDN(c.Param("id"))
		if err != nil {
			log.Println(err)
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}

		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: "success"})
	})
	e.PUT("/cdn/:action/:id", func(c echo.Context) error {
		var action bool
		if c.Param("action") == "start" {
			action = true
		} else if c.Param("action") != "stop" {
			msg := fmt.Sprintf("Parameter error : /cdn/%s", c.Param("action"))
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: msg})
		}
		err := model.ActiveCDN(c.Param("id"), action)
		if err != nil {
			return c.JSON(200, &ResponseMsgBlock{Status: "10", Data: err.Error()})
		}

		return c.JSON(200, &ResponseMsgBlock{Status: "00", Data: "success"})
	})

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
