package controller

import (
	"gcore_console/cmiddleware"

	"github.com/labstack/echo/v4"
)

// var fileName = "jobs.csv"

// // HandleFunc function
// func HandleFunc(c echo.Context) error {
// 	query := strings.ToLower(model.CleanString(c.FormValue("query")))
// 	fmt.Println(query)
// 	model.Scrapper(query)

//		return c.Attachment(fileName, query+".csv")
//	}
func Error401Index(c echo.Context) error {
	return c.File("static/templates/401.html")
}

func Error404Index(c echo.Context) error {
	return c.File("static/templates/404.html")
}
func Error500Index(c echo.Context) error {
	return c.File("static/templates/500.html")
}
func ChartsIndex(c echo.Context) error {
	return c.File("static/templates/charts.html")
}

func LightIndex(c echo.Context) error {
	return c.File("static/templates/layout-sidenav-light.html")
}
func StaticIndex(c echo.Context) error {
	return c.File("static/templates/layout-static.html")
}
func LoginIndex(c echo.Context) error {
	return c.File("static/templates/login.html")
}
func PasswordIndex(c echo.Context) error {
	return c.File("static/templates/password.html")
}
func RegisterIndex(c echo.Context) error {
	return c.File("static/templates/register.html")
}

// BillingCTRL :
func BillingCTRL(c echo.Context) error {
	cc := c.(*cmiddleware.CustomContext)
	context := make(map[string]interface{})
	context["EMAIL"] = cc.AdminInfo.Email
	context["PARTNER"] = cc.AdminInfo.Partner
	context["URL"] = "billing"

	return c.Render(200, "tables.html", context)
}

// // BillingPROC
// func BillingPROC(c echo.Context) error {
// 	cc := c.(*cmiddleware.CustomContext)

// 	productList, err := model.GetProductList(cc.AdminInfo.Key)
// 	if err != nil {
// 		log.Println(err)
// 		return err
// 	}

// 	return c.JSON(200, productList)
// }

// IndexCTRL
func IndexCTRL(c echo.Context) error {
	context := make(map[string]interface{})
	context["URL"] = "billing"

	return c.Render(200, "index.html", context)
}

// // GetServiceUsesPROC :
// func GetAllPricingCTRL(c echo.Context) error {
// 	cc := c.(*cmiddleware.CustomContext)
// 	respBody, err := akamaiapi.Request(nil, "/pricing/all", cc.AdminInfo.Token, "GET", cc.AdminInfo.SessionFile)
// 	if err != nil {
// 		log.Println(err)
// 		return cc.RespStatus(200, "fail", err)
// 	}
// 	var userInfoArray []*model.UsersPriceBlock
// 	err = json.Unmarshal(respBody, &userInfoArray)
// 	if err != nil {
// 		log.Println(err)
// 		return cc.RespStatus(200, "fail", err)
// 	}

// 	return c.JSON(200, userInfoArray)
// }
