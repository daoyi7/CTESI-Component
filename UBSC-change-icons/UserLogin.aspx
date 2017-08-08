<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="UserLogin.aspx.cs" Inherits="UCML.UBSC.UserLogin" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <title>登录-雅口航运枢纽工程项目管理系统</title>
    <link href="resource/css/login.css" rel="stylesheet" type="text/css" />
    <link rel="stylesheet" type="text/css" href="bim/css/login.css" />
    <meta http-equiv="X-UA-Compatible" content="IE=EmulateIE7" />
    <meta http-equiv="X-UA-Compatible" content="IE=7" />
		<link rel="shortcut icon" type="image/x-icon" href="bim/images/favicon.ico" media="screen">
    <script type="text/javascript" src="resource/js/png.js"></script>
    <script type="text/javascript" src="resource/js/jquery-1.4.2.min.js"></script>
    <script src="resource/js/AC_RunActiveContent.js" type="text/javascript"></script>
    <script src="resource/js/swfobject.js" type="text/javascript"></script>
    <script type="text/javascript">
        var flashvars = {};
        flashvars.settingsXML = "resource/settings.xml";
        var params = {};
        params.scale = "noscale";
        params.salign = "tl";
        params.wmode = "transparent";
        var attributes = {};
        swfobject.embedSWF("resource/flash/carousel.swf", "home", "1000", "600", "9.0.0", false, flashvars, params, attributes);
    </script>
</head>
<body class="login_body">
    <form id="form1" runat="server">
      <div class="logo"><img src="bim/images/logo.png" style="width:450px;margin-top:4px;" /></div>
        <div class="login_bg">
        <div class="login_bg_img">
            <img src="bim/images/bg-image.jpg" alt="">
        </div>
            <div class="login_box">
                <div class="login_tit">雅口航运枢纽工程项目管理系统</div>
                <div class="username">
                    <asp:textbox id="txtUserName" class="login_text" runat="server" text=""></asp:textbox>
                    <i class="input-username"></i>
                </div>
                <div class="password">
                    <asp:textbox id="txtPassword" class="login_text" runat="server" textmode="Password" text=""></asp:textbox>
                    <i class="input-password"></i>
                </div>
					 <select id="ddlPost" runat="server" Visible="false">
                        <option value="-1">请选择</option>
                    </select>
                    <div class="submit">
                        <asp:button id="btnLogin" runat="server" text="登录" class="login_button" onclick="btnLogin_Click" />
                    </div>
                <span id="spanValidateCode" style="margin-top: 6px;" runat="server" visible="false">
                    <div style="margin-top: 6px;">
                        验证码：<asp:textbox id="txtValidateCode" class="login_text" runat="server" text="" width="60px"></asp:textbox>
                        <asp:image id="vcImg" style="vertical-align: bottom; margin-left: -5px; border: 1px"
                            src="ValidateCode.aspx" runat="server" height="23px" alt="看不清？点击更换" title="看不清？点击更换"
                            onclick="this.src=this.src+'?'" />&nbsp;
                    </div>
                </span>


                <span id="language" class="language" runat="server" visible="false"><a href="#">
                    简体</a>
                    <ul class="language_ul">
                        <li><a href="#" value="1">简体</a></li>
                        <li><a href="#" value="2">繁体</a></li>
                        <li><a href="#" value="3">English</a></li>
                    </ul>
                </span>
                <asp:HiddenField ID="hidfLanguage" runat="server" Value="1" />
<asp:HiddenField ID="hidPost" runat="server" Value="-1" />
            </div>
            </div>


      <div id="footer">
        <div class="footbox">技术支持：中交第二航务工程勘察设计院有限公司</div>
      </div>
    </form>
    <script type="text/javascript">
        pngHandler.init();

        $("#language > a").click(function () {
            $("#language ul").show();
        });

        $("#language > ul > li > a").click(function () {
            var el = $(this);
            setLanguage(el.html(), el.attr("value"));
            $("#language ul").hide();
        });

        function setLanguage(title, value) {
            $("#hidfLanguage").val(value);
            $("#language > a").html(title);
        }


        /* 获得上次选择的语言
        var ucml_Language = $("#hidfLanguage").val();

        alert($("#hidfLanguage").val());

        var languageEL = $("#language > ul > li > a[value='" + ucml_Language + "']");

        if (languageEL.length > 0) {
            setLanguage(languageEL.html(), languageEL.attr("value"));
            $("#language ul").hide();
        }
        */

        function getCookie(name) {
            var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
            if (arr != null) return unescape(arr[2]); return null;
        }


		 //选择主岗位
        $(document).ready(function () {
            var userName = "";
            var postData = null;
            $("#txtUserName").blur(function () {
				if($("#ddlPost").length==0) return;
				$("#ddlPost").empty();//清空下拉框
                $("<option value='-1'>请选择</option>").appendTo("#ddlPost");
                $.ajax({
                    url: "../../GetUserPostList.ashx?user_login=" + $("#txtUserName").val(),
                    dataType: "json",
                    success: function (data) {
                        if (data.status == 0) {
                            postData = data.data;
                            bindDllPost();
                        }
                    }
                });
            })

            function bindDllPost(orgOID) {
                $("#ddlPost").empty(); //清空下拉框
                for (var i = 0; i < postData.length; i++) {
                        var isMPost = postData[i].fIsMasterPost;
                        if (isMPost == "true" || isMPost == "1" || isMPost == "True") {
                            $("<option value='" + postData[i].oid + "' selected>" + postData[i].name + "</option>").appendTo("#ddlPost");
                            $("#hidPost").val(postData[i].oid);
                        }
                        else {
                            $("<option value='" + postData[i].oid + "'>" + postData[i].name + "</option>").appendTo("#ddlPost");
                        }
                }
            }
            $("#ddlPost").change(function () {
                var v = $("#ddlPost").val();
                $("#hidPost").val(v);
            });
        });
    </script>

    <script>
        $(".login_bg").css("height",($(window).height()-158))
    </script>
</body>
</html>
