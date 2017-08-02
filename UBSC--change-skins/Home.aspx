<%@ Page Language="C#" AutoEventWireup="true" CodeBehind="Home.aspx.cs" Inherits="UCML.UBSC.Home"
    EnableViewState="false" %>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head runat="server">
    <meta http-equiv="Content-Type" content="text/html;   charset=gb2312">
    <!--添加样式和页面图标-->
    <title>首页-汉江雅口航运枢纽工程</title>
    <link rel="shortcut icon" type="image/x-icon" href="bim/images/favicon.ico" media="screen">
    <link type="text/css" rel="stylesheet" href="resource/css/WebIM.css" />
    <link type="text/css" rel="stylesheet" href="bim/css/home.css" />
    <script src="resource/js/png.js"></script>
    <script src="resource/js/SpryMenuBar.js" type="text/javascript"></script>
    <script type="text/javascript" src="../../UCML_JS/jquery-1.8.3.min.js"></script>
    <script type="text/javascript" src="../../UCML_JS/UCML_JS_All.js"></script>
    <link rel="stylesheet" type="text/css" href="../../UCML_JS/App_Themes/Default/UCML_JS_Style.css" />
    <script type="text/javascript" src="../../UCML_JS/UCML.WebIM.js"></script>
    <script type="text/javascript" language="javascript">
        function close_left() {
            document.getElementById("default_left").style.display = 'none';
            document.getElementById("hide_left").style.display = 'none';
            document.getElementById("show_left").style.display = 'block';
            setSize();
        }
        function show_left() {
            document.getElementById("default_left").style.display = 'block';
            document.getElementById("hide_left").style.display = 'block';
            document.getElementById("show_left").style.display = 'none';
            setSize();
        }
  
    </script>
    <script type="text/javascript">
        var localResourcePath = "../../";
        var SkinPath = "Skin/ucmlstd/"; //此代码为了兼容老版本
    </script>
    <script language="javascript" type="text/javascript">

        function start_loading() {
            var targelem = document.getElementById("loader_container");
            var el = $(targelem);
            var content = $("#content");
            el.css("top", (content.height() - el.height()) / 2);
            el.css("left", (content.width() - el.width()) / 2);
            el.show();
        }


        function remove_loading() {
            var targelem = document.getElementById("loader_container");
            var el = $(targelem);
            el.hide();
        }

        function stateChangeIE(_frame) {
            start_loading();
            //加载完成
            if (_frame.readyState == "complete") {
                remove_loading();
                _frame.style.visibility = "visible";
            }

            $(_frame).bind("load", function () {
                remove_loading();
            });
        }
    </script>
    <!--WebIM Javascript操作函数 Date:2013/05/28-->
    <script type="text/javascript">
        var UBSCIM = null;
        function initWebIM(state) {
            if (UBSCIM) return;
            if (!state) state = 0;
            UBSCIM = new WebIM("../../MessageProcess.ashx");
            UBSCIM.chatFormUrl = "../../BPO_OAWebChat.aspx";
            initUserList(state);
            UBSCIM.on("freshUser", onFreshUser);
            UBSCIM.on("freshMessage", onFreshMessage);
            UBSCIM.on("update", onUpdate);


            //获取刷取消息的频率
            var NMRT = parseInt($("[id$=NMRT]").val());
            //获取刷取在线人员列表的频率
            var SOURT = parseInt($("[id$=SOURT]").val());

            UBSCIM.init();
            //clearMsgInterval();  
        };

        //初始化WebIM
        function initUserList(tabIndex) {
            $("#onlineListHead>div").click(function () {
                if (!$(this).hasClass("focused-tab")) {
                    $("#onlineListHead>div").each(function () {
                        if ($(this).hasClass("focused-tab")) {
                            $(this).removeClass("focused-tab").addClass("unfocused-tab");
                            return;
                        }
                    });
                    $(this).removeClass("unfocused-tab").addClass("focused-tab");
                    if ($(this).attr("id") == "onlineUserTab") {
                        $("#unreadMsgContent").hide();
                        $("#onlineUserContent").show();
                    }
                    else {
                        $("#onlineUserContent").hide();
                        $("#unreadMsgContent").show();
                    }
                }
            });

            if (!tabIndex) $("#onlineUserTab").trigger("click");
            else $("#unreadMsgTab").trigger("click");

            $("#footBarFlex").mouseover(function () { hoverFlex(0); }).mouseout(function () { hoverFlex(1); });
        }

        //点击在线人员响应
        function onClickUser() {
            $user = $(this).find("span");
            var user = UBSCIM.users.find($user.attr("oid"));
            //已经打开对该人员的窗口
            if (UBSCIM.forms.has(user.oid.toUpperCase())) {
                return;
            }
            var users = new HashTable();
            users.add(user.oid, user);

            var w = UBSCIM.showChatForm(user.name, 338, 388, users, null, 0);
            w.onBeforeClose = beforeCloseForm;
        }

        //点击未读消息响应
        function onClickMessage() {
            var $msg = $(this).find("span");
            var sender = new WebIM.User($msg.attr("senderOID"), $msg.text());
            var message = UBSCIM.messages.find(sender.oid);
            if (!message) {
                $(this).remove();
                return;
            }

            //已经打开对该人员的窗口
            if (UBSCIM.forms.has(sender.oid.toUpperCase())) {
                return;
            }
            var users = new HashTable();
            users.add(sender.oid, sender);
            var msgs = new HashTable();
            msgs.add(sender.oid, message);

            var w = UBSCIM.showChatForm(sender.name, 338, 388, users, msgs, 0);
            w.onBeforeClose = beforeCloseForm;
            UBSCIM.setMessageRead(message);

            $(this).remove();
        }

        //刷新在线人员响应函数
        function onFreshUser() {
            $("#onlineUserContent>ul>li").remove();
            UBSCIM.users.each(function (index) {
                var $item = $(String.format('<li class="item"><i class="user-icon"></i><span class="user-name" oid="{0}" title="{1}">{1}</span></li>', this.oid, this.name)).click(onClickUser);
                $("#onlineUserContent>ul").append($item);
            });
        }

        //刷新未读消息响应函数
        function onFreshMessage() {
            $("#unreadMsgContent>ul>li").remove();

            UBSCIM.messages.each(function (index) {
                var $item = $(String.format('<li class="item"><i class="message-icon"></i><span class="message-title" senderOID="{0}" title="{1}">{1}</span></li>', this.senderOID, this.senderName)).click(onClickMessage);
                $("#unreadMsgContent>ul").append($item);
            });
        }

        //刷新在线时间响应
        function onUpdate() {

        }

        //选人页面回调函数
        function selectUserCallBack(selectedOID, selectedName) {
            var oidArray = selectedOID.split(",");
            var nameArray = selectedName.split(",");
            var oids = $.map(oidArray, function (el) {
                return el.substr(1, el.length - 2);
            });

            var users = new HashTable();
            for (var i = 0; i < oids.length; i++) {
                var user = new WebIM.User(oids[i], nameArray[i]);
                users.add(user.oid, user);
            }
            //判断是单个聊天还是群组聊天
            if (users.count == 1 && users.first.oid.charAt(0) == 'U') {
                var w = UBSCIM.showChatForm(users.first.name, 338, 388, users, null, 0);
                w.onBeforeClose = beforeCloseForm;
            }
            else {
                var val = document.getElementById("hiddenGroup").value;
                var w = UBSCIM.showChatForm(val, 507, 388, users, null, 1);
                w.onBeforeClose = beforeCloseForm;
            }
        }

        //打开选人页面
        function selectUser() {
            var val = document.getElementById("hiddenSelectUser").value;
            var url = "../../BPO_Select_User_Organize_MainJS.aspx?type=3&callbackFn=selectUserCallBack";
            var w = new UCML.OpenShowWindow({
                frameMode: "self",
                maximizable: false,
                collapsible: true,
                URL: url,
                scroll: "no",
                draggable: true,
                resizable: false,
                width: 750,
                height: 520,
                title: val,
                showShadow: true,
                modal: true
            });
            w.open();
        }

        function showOnlineUser() {
            var state = parseInt($("#UcmlMessageImg").attr("state"));
            if (state == 1) {
                initWebIM(1);
                setIMState(0);
                $("#onlineList").show();
                $("#onlineListHead").show();
                $("#onlineListBody").show();
                $("#onlineListFoot").show();
                $("#footBarSelect").show();
            }
            else {
                initWebIM(0);
                $("#onlineList").show();
                $("#onlineListHead").show();
                $("#onlineListBody").show();
                $("#onlineListFoot").show();
                $("#footBarSelect").show();
            }
        }

        //设置WebIM状态图标
        function setIMState(state) {
            if (state == 0) {
                $("#UcmlMessageImg").attr("state", 0);
                $("#UcmlMessageImg").attr("src", "resource/images/WebIM/im.gif");
            }
            else {
                $("#UcmlMessageImg").attr("state", 1);
                $("#UcmlMessageImg").attr("src", "resource/images/WebIM/new_msg_icon.gif");
            }
        }

        function beforeCloseForm() {
            if (this.oid) {
                UBSCIM.forms.find(this.oid.toUpperCase()).clear();
                UBSCIM.forms.remove(this.oid.toUpperCase());
            }
        }

        function toggleIM() {
            $flex = $("#footBarFlex");
            if ($flex.hasClass("unflexed")) {
                //  $flex.removeClass("unflexed").addClass("flexed");
                $("#onlineList").width(180).hide();
                //$("#footBarFlex").attr("title", "点击展开");
            }
            else {
                $flex.removeClass("flexed").addClass("unflexed");
                $("#onlineList").width(180).show();
                //$("#footBarFlex").attr("title", "点击收缩");
            }
            $("#onlineListHead").toggle();
            $("#onlineListBody").toggle();
            $("#footBarSelect").toggle();
        }
        function hoverFlex(state) {
            var $flex = $("#footBarFlex");
            if ($flex.hasClass("flexed")) {
                if (state == 0) {
                    $flex.fadeTo(200, 1);
                }
                else {
                    $flex.fadeTo(200, 0.4);
                }
            }
        }
    </script>
</head>
<body>
    <form id="form1" runat="server">
    <asp:HiddenField ID="NMRT" runat="server" Value="" />
    <asp:HiddenField ID="SOURT" runat="server" Value="" />
    <div id="default_top">
        <div style="padding-left: 17px;">
            <div class="system_logo">
            </div>
        </div>
        <!--页面头部改动-->
        <div class="top_right">
            <span class="welcom"><asp:Literal ID="ltUserLoginInfoLab" runat="server"></asp:Literal></span>
            <asp:Literal ID="ltSystemButton" runat="server"></asp:Literal>
        </div>
        <div style="clear: both;">
        </div>
        <div id="menu" style="position: relative;">
            <div id="menu3" style="position: relative; height: 30px; overflow: hidden">
                <div id="menu2">
                    <ul id="MenuBar1" class="MenuBarHorizontal">
                        <asp:Literal ID="ltTopMenuBar" runat="server"></asp:Literal>
                    </ul>
                </div>
            </div>
            <a href="javascript:fn_PrevButton()" class="scroll_left" style="display: none"></a>
            <a href="javascript:fn_NextButton()" class="scroll_right" style="display: none">
            </a>
        </div>
    </div>
    <div class="cleargreen" onclick="hidenTop(this)" title="<%=ClickToHideTop() %>">
    </div>
    <!--顶部结束-->
    <!--正文部分开始-->
    <div id="default_main" class="default_main">
        <!--左侧菜单-->
        <div id="default_left" class="default_left">
            <div id="leftMenu" class="left_menu">
                <div onclick="checkMenu(1)" class="left_menu_div">
                    <div id="leftMenuTitle1" class="left_menu_title">
                    </div>
                </div>
                <div id="leftMenu1" class="menu_content" style="overflow: auto; display: block">
                </div>
            </div>
        </div>
        <script type="text/javascript">
            var doc = window.document;

            var mindex = 1;

            var mtID = null;
            function checkMenu(index) {
                mindex = index;
                for (var i = 0; i < 1; i++) {
                    var m = doc.getElementById('leftMenu' + (i + 1));
                    if (index != i + 1) {
                        m.style.display = "none";
                        m.style.height = 0 + "px";
                    }
                    else {
                        m.style.display = "block";

                        var h = m.parentNode.parentNode.offsetHeight;
                        //       m.style.height = h > 82 ? (h - 82) : 0 + "px";
                        //       m.style.height = h > 28 ? (h - 28) : 0 + "px";
                    }
                }
            }

            function forTopMenu(lis, ct, level) {

                for (var i = 0; i < lis.length; i++) {
                    if (lis[i].tagName && lis[i].tagName.toLowerCase() == "li") {
                        var menuli = doc.createElement('li');

                        var cul = lis[i].getElementsByTagName('ul')[0];

                        var a = doc.createElement('a');
                        var img2 = doc.createElement('img');
                        img2.style.width = "9px";
                        img2.style.height = "9px";
                        img2.style.marginTop = "8px";
                        if (cul && cul.childNodes.length > 0) {
                            menuli.expandImg = img2;
                            img2.src = 'resource/images/ftv2pnode.gif';
                            img2.className = "taskbar_tag_img expandImg";
                            a.appendChild(img2);
                        }
                        var img = doc.createElement('img');
                        img.style.width = "17px";
                        img.style.height = "14px";
                        img.src = lis[i].attributes["mimages"].value || 'resource/images/renwu_ico.jpg';
                        img.className = "taskbar_tag_img";
                        a.appendChild(img);
                        a.href = "#";
                        a.id = "medog";
                        a.name = "medog";

                        var ca = lis[i].getElementsByTagName('a')[0];
                        a.innerHTML = a.innerHTML + ca.innerHTML;

                        $(a).css("paddingLeft", 15 * level);

                        menuli.oli = lis[i];
                        menuli.onclick = function () {
                            //汤龙斌 修改空连接弹出问题

                            if (this.oli.attributes["mcon"].value != "") {
                                bottomBar.addItem(this.oli.id, this.oli.attributes["mtiltle"].value, this.oli.attributes["mimages"].value, this.oli.attributes["mtype"].value, this.oli.attributes["mcon"].value, true, true, this.oli.attributes["mmap"].value, this.oli.attributes["menuLi"].value, true);
                            }
                        }

                        $(menuli).toggle(function () {

                            $(this).children("ul").slideDown("slow");
                            if (this.expandImg) {
                                $($(this).find("img.expandImg")[0]).attr("src", 'resource/images/ftv2mlastnode.gif');
                            }
                        }, function () {
                            if (this.expandImg) {
                                $($(this).find("img.expandImg")[0]).attr("src", 'resource/images/ftv2pnode.gif');
                            }
                            $(this).children("ul").slideUp("slow");
                        });
                        menuli.appendChild(a);

                        ct.appendChild(menuli);
                        if (cul) {
                            var ul = doc.createElement('ul');
                            ul.id = "mepig";
                            ul.name = "mepig";
                            ul.style.display = "none";
                            menuli.appendChild(ul);
                            forTopMenu(cul.childNodes, ul, level + 1);
                        }
                    }
                }
            }

            function loadLeftMenu(li) {

                var cul = null;
                var dli = null;
                var ca = null;

                if (!li) {
                    //  dli = doc.getElementById('MenuBar1').childNodes[0];
                    dli = $("#MenuBar1").children("li")[0];
                }
                else {
                    dli = li;
                }
                if (mtID == dli.id) {
                    return;
                }
                else {
                    mtID = dli.id;
                }
                if (!dli) {
                    return;
                }
                else {
                    var dul = dli.getElementsByTagName('ul');
                    if (dul.length == 0) {
                        return;
                    }
                    ca = dli.getElementsByTagName('a')[0];
                    doc.getElementById('leftMenuTitle1').innerHTML = ca.innerHTML;
                    cul = dul[0];
                }


                if (cul) {
                    var leftMenu1 = doc.getElementById("leftMenu1");
                    leftMenu1.innerHTML = "";
                    var ul = doc.createElement('ul');
                    forTopMenu(cul.childNodes, ul, 0);
                    leftMenu1.appendChild(ul);
                }
            }

        
        </script>
        <!--左侧菜单结束-->
        <!--隐藏左侧菜单的按钮-->
        <div id="hide_left" style="display: block;">
            <table border="0" cellspacing="0" cellpadding="0" width="5" height="100%">
                <tr valign="middle">
                    <td style="height: auto" valign="middle">
                        <img src="resource/images/normal.jpg" alt="<%=ClickToHideLeft() %>" onclick="close_left();"
                            style="cursor: pointer;">
                    </td>
                </tr>
            </table>
        </div>
        <div id="show_left" style="display: none;">
            <table border="0" cellspacing="0" cellpadding="0" width="5" height="100%">
                <tr>
                    <td style="height: auto">
                        <img src="resource/images/clicked.jpg" alt="<%=ClickToShowLeft() %>" onclick="show_left();"
                            style="cursor: pointer;">
                    </td>
                </tr>
            </table>
        </div>
        <!--隐藏左侧菜单的按钮结束-->
        <div class="default_main_right">
            <input type="hidden" id="hiddenSelectUser" value="<%= SelectUser() %>">
            <input type="hidden" id="hiddenGroup" value="<%= Group() %>">
            <input type="hidden" id="hiddenTaskbar" value="<%= Taskbar() %>">
            <%--<div id="map" class="map" ondblclick="maxWindow()">--%>
                <%--<span class="map_icon"></span>&nbsp;<strong><%=GetMyLocation()%></strong><span id="divMap">--%>
                <%--</span>--%>
            <div id="bar" class="taskbar" style="height: 26px">
                <div id="taskbar_tag_box" class="taskbar_tag_box">
                    <div id="barTag" class="taskbar_tag">
                        <ul id="barTagUI">
                        </ul>
                    </div>
                </div>
                <div id="taskbar_quick" class="taskbar_quick">
                    <a href="#" id="showQuick" title="<%=ShowAll()%>" onclick="bottomBar.addQuickMenu()"
                       onmouseover="return false;">
                        <img src="resource/images/usbc_tasktop.gif" border="0" style="margin-top: 7px;">
                    </a><a href="#" title="<%=IM() %>" onclick="showOnlineUser()">
                    <img state="0" src="resource/images/WebIM/im.gif" id="UcmlMessageImg" style="margin-top: 4px;
                                            border: 0; width: 16px; height: 16px;"/>
                </a><a href="#" title="<%=SelectPortal() %>" onclick="openPortal()">
                    <img src="resource/images/usbc_taskdesktop.gif" border="0" style="margin-top: 4px;"/>
                </a><a href="#" title="<%=SkinSwitching() %>" onclick="bottomBar.addQuickSkin()">
                    <img src="resource/images/change_Skin_color_icon.gif" border="0" style="margin-top: 4px;"/>
                </a>
                    <!--即时通讯在线人员列表-->
                    <div id="onlineList">
                        <iframe frameborder='0' style='-moz-opacity: 0; -webkit-opacity: 0; opacity: 0; position: absolute;
                                            visibility: inherit; top: 0px; right: 0px; height: 100%; width: 180px; z-index: -1;
                                            background: none'></iframe>
                        <div id="onlineListHead">
                            <div id="unreadMsgTab" class="unfocusedTab">
                                <span class="span-icon"/>
                                <%=UnreadMessages() %></span>
                            </div>
                            <div id="onlineUserTab" class="focusedTab">
                                <span class="span-icon"/>
                                <%=OnlineChat()%></span>
                            </div>
                        </div>
                        <div id="onlineListBody">
                            <div id="unreadMsgContent">
                                <ul>
                                </ul>
                            </div>
                            <div id="onlineUserContent">
                                <ul>
                                </ul>
                            </div>
                        </div>
                        <div id="onlineListFoot">
                            <div id="footBarSelect" class="foot-item">
                                                <span id="selectUser" class="span-icon" onclick="selectUser();">
                                                    <%=SelectUser()%></span>
                            </div>
                            <div id="footBarFlex" class="foot-item unflexed" onclick="toggleIM();" title="<%=ClickToHide() %>">
                            </div>
                        </div>
                    </div>
                    <!--END 即时通讯-->
                </div>
                <div id="quickBox" class="taskbox" onmouseover="return false;">
                    <!--  <iframe style="position: absolute; width: 100%; height: 100%; filter: alpha(opacity=0);
                        -moz-opacity: 0"></iframe> -->
                    <iframe frameborder='0' style='-moz-opacity: 0; -webkit-opacity: 0; opacity: 0; position: absolute;
                                        visibility: inherit; top: 0px; left: -15px; height: 100%; width: 150px; z-index: -1;
                                        background: none'></iframe>
                    <ul id="quickBoxul">
                    </ul>
                </div>
                <div class="taskbox" id="skin_change_box" onmouseover="return false;">
                    <!--  <iframe style="position: absolute; width: 100%; height: 100%; filter: alpha(opacity=0);
                        -moz-opacity: 0"></iframe>
                -->
                    <asp:Literal ID="skinBubbleCenter" runat="server"></asp:Literal>
                </div>
                <div class="taskbox" id="portal_box" onmouseover="return false;">
                    <!--  <iframe style="position: absolute; width: 100%; height: 100%; filter: alpha(opacity=0);
                        -moz-opacity: 0"></iframe>
                -->
                    <asp:Literal ID="portalList" runat="server"></asp:Literal>
                </div>
            </div>
            <div id="bottomBar" class="bottomBar">
                <div id="content" class="content" style="position: relative">
                    <div id="loader_container" class="loading" style="display: none">
                        <img src="resource/images/loading.gif" />
                    </div>
                </div>
                <%--<div id="bar" class="taskbar" style="height: 26px">--%>
                    <%--<div id="taskbar_tag_box" class="taskbar_tag_box">--%>
                        <%--<div id="barTag" class="taskbar_tag">--%>
                            <%--<ul id="barTagUI">--%>
                            <%--</ul>--%>
                        <%--</div>--%>
                    <%--</div>--%>
                    <%--<div id="taskbar_quick" class="taskbar_quick">--%>
                        <%--<a href="#" id="showQuick" title="<%=ShowAll()%>" onclick="bottomBar.addQuickMenu()"--%>
                            <%--onmouseover="return false;">--%>
                            <%--<img src="resource/images/usbc_tasktop.gif" border="0" style="margin-top: 7px;">--%>
                        <%--</a><a href="#" title="<%=IM() %>" onclick="showOnlineUser()">--%>
                            <%--<img state="0" src="resource/images/WebIM/im.gif" id="UcmlMessageImg" style="margin-top: 4px;--%>
                                <%--border: 0; width: 16px; height: 16px;" />--%>
                        <%--</a><a href="#" title="<%=SelectPortal() %>" onclick="openPortal()">--%>
                            <%--<img src="resource/images/usbc_taskdesktop.gif" border="0" style="margin-top: 4px;" />--%>
                        <%--</a><a href="#" title="<%=SkinSwitching() %>" onclick="bottomBar.addQuickSkin()">--%>
                            <%--<img src="resource/images/change_Skin_color_icon.gif" border="0" style="margin-top: 4px;" />--%>
                        <%--</a>--%>
                        <%--<!--即时通讯在线人员列表-->--%>
                        <%--<div id="onlineList">--%>
                            <%--<iframe frameborder='0' style='-moz-opacity: 0; -webkit-opacity: 0; opacity: 0; position: absolute;--%>
                                <%--visibility: inherit; top: 0px; right: 0px; height: 100%; width: 180px; z-index: -1;--%>
                                <%--background: none'></iframe>--%>
                            <%--<div id="onlineListHead">--%>
                                <%--<div id="unreadMsgTab" class="unfocusedTab">--%>
                                    <%--<span class="span-icon" />--%>
                                    <%--<%=UnreadMessages() %></span>--%>
                                <%--</div>--%>
                                <%--<div id="onlineUserTab" class="focusedTab">--%>
                                    <%--<span class="span-icon" />--%>
                                    <%--<%=OnlineChat()%></span>--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <%--<div id="onlineListBody">--%>
                                <%--<div id="unreadMsgContent">--%>
                                    <%--<ul>--%>
                                    <%--</ul>--%>
                                <%--</div>--%>
                                <%--<div id="onlineUserContent">--%>
                                    <%--<ul>--%>
                                    <%--</ul>--%>
                                <%--</div>--%>
                            <%--</div>--%>
                            <%--<div id="onlineListFoot">--%>
                                <%--<div id="footBarSelect" class="foot-item">--%>
                                    <%--<span id="selectUser" class="span-icon" onclick="selectUser();">--%>
                                        <%--<%=SelectUser()%></span>--%>
                                <%--</div>--%>
                                <%--<div id="footBarFlex" class="foot-item unflexed" onclick="toggleIM();" title="<%=ClickToHide() %>">--%>
                                <%--</div>--%>
                            <%--</div>--%>
                        <%--</div>--%>
                        <%--<!--END 即时通讯-->--%>
                    <%--</div>--%>
                    <%--<div id="quickBox" class="taskbox" onmouseover="return false;">--%>
                        <%--<!--  <iframe style="position: absolute; width: 100%; height: 100%; filter: alpha(opacity=0);--%>
                            <%---moz-opacity: 0"></iframe> -->--%>
                        <%--<iframe frameborder='0' style='-moz-opacity: 0; -webkit-opacity: 0; opacity: 0; position: absolute;--%>
                            <%--visibility: inherit; top: 0px; left: -15px; height: 100%; width: 150px; z-index: -1;--%>
                            <%--background: none'></iframe>--%>
                        <%--<ul id="quickBoxul">--%>
                        <%--</ul>--%>
                    <%--</div>--%>
                    <%--<div class="taskbox" id="skin_change_box" onmouseover="return false;">--%>
                        <%--<!--  <iframe style="position: absolute; width: 100%; height: 100%; filter: alpha(opacity=0);--%>
                            <%---moz-opacity: 0"></iframe>--%>
                    <%---->--%>
                        <%--<asp:Literal ID="skinBubbleCenter" runat="server"></asp:Literal>--%>
                    <%--</div>--%>
                    <%--<div class="taskbox" id="portal_box" onmouseover="return false;">--%>
                        <%--<!--  <iframe style="position: absolute; width: 100%; height: 100%; filter: alpha(opacity=0);--%>
                            <%---moz-opacity: 0"></iframe>--%>
                    <%---->--%>
                        <%--<asp:Literal ID="portalList" runat="server"></asp:Literal>--%>
                    <%--</div>--%>
                <%--</div>--%>
            </div>
        </div>
    </div>
    <script type="text/javascript">
        function updatePwd(type) 
        {
            var BusinessObject = new UCML.BusinessUnit();
            BusinessObject.OpenWindow("../../UCMLCommon/SYS/BPO_UserModifyPwd.aspx?type="+type, "修改密码", 1, { ratioWidth: 80, ratioHeight: 60, draggable: false, resizable: false, closable: true, collapsible: false, maximizable: false });
        }
    </script>
    <asp:Literal runat="server" ID="updatePwdMsg"></asp:Literal>
    <!--正文部结束-->
    </form>
    <script type="text/javascript">

        UCML = UCML || {};
        window.undefined = window.undefined;

        Ext = {
            version: '3.0'
        };
        Ext.apply = function (o, c, defaults) {
            if (defaults) {
                Ext.apply(o, defaults);
            }
            if (o && c && typeof c == 'object') {
                for (var p in c) {
                    o[p] = c[p];
                }
            }
            return o;
        };

        (function () {
            var idSeed = 0,
        toString = Object.prototype.toString,
        isIterable = function (v) {
            if (Ext.isArray(v) || v.callee) {
                return true;
            }
            if (/NodeList|HTMLCollection/.test(toString.call(v))) {
                return true;
            }
            return ((v.nextNode || v.item) && Ext.isNumber(v.length));
        },
        ua = navigator.userAgent.toLowerCase(),
        check = function (r) {
            return r.test(ua);
        },
        DOC = document,
        isStrict = DOC.compatMode == "CSS1Compat",
        isOpera = check(/opera/),
        isChrome = check(/chrome/),
        isWebKit = check(/webkit/),
        isSafari = !isChrome && check(/safari/),
        isSafari2 = isSafari && check(/applewebkit\/4/), // unique to Safari 2
        isSafari3 = isSafari && check(/version\/3/),
        isSafari4 = isSafari && check(/version\/4/),
        isIE = !isOpera && check(/msie/),
        isIE7 = isIE && check(/msie 7/),
        isIE8 = isIE && check(/msie 8/),
        isIE6 = isIE && !isIE7 && !isIE8,
        isGecko = !isWebKit && check(/gecko/),
        isGecko2 = isGecko && check(/rv:1\.8/),
        isGecko3 = isGecko && check(/rv:1\.9/),
        isBorderBox = isIE && !isStrict,
        isWindows = check(/windows|win32/),
        isMac = check(/macintosh|mac os x/),
        isAir = check(/adobeair/),
        isLinux = check(/linux/),
        isSecure = /^https/i.test(window.location.protocol);

            // remove css image flicker
            if (isIE6) {
                try {
                    DOC.execCommand("BackgroundImageCache", false, true);
                } catch (e) { }
            }

            Ext.apply(Ext, {
                SSL_SECURE_URL: 'javascript:false',
                isStrict: isStrict,
                isSecure: isSecure,
                isReady: false,
                enableGarbageCollector: true,
                enableListenerCollection: false,
                USE_NATIVE_JSON: false,
                applyIf: function (o, c) {
                    if (o) {
                        for (var p in c) {
                            if (Ext.isEmpty(o[p])) {
                                o[p] = c[p];
                            }
                        }
                    }
                    return o;
                },

                id: function (el, prefix) {
                    return (el = Ext.getDom(el) || {}).id = el.id || (prefix || "ext-gen") + (++idSeed);
                },
                extend: function () {
                    // inline overrides
                    var io = function (o) {
                        for (var m in o) {
                            this[m] = o[m];
                        }
                    };
                    var oc = Object.prototype.constructor;

                    return function (sb, sp, overrides) {
                        if (Ext.isObject(sp)) {
                            overrides = sp;
                            sp = sb;
                            sb = overrides.constructor != oc ? overrides.constructor : function () { sp.apply(this, arguments); };
                        }
                        var F = function () { },
                    sbp,
                    spp = sp.prototype;

                        F.prototype = spp;
                        sbp = sb.prototype = new F();
                        sbp.constructor = sb;
                        sb.superclass = spp;
                        if (spp.constructor == oc) {
                            spp.constructor = sp;
                        }
                        sb.override = function (o) {
                            Ext.override(sb, o);
                        };
                        sbp.superclass = sbp.supr = (function () {
                            return spp;
                        });
                        sbp.override = io;
                        Ext.override(sb, overrides);
                        sb.extend = function (o) { Ext.extend(sb, o); };
                        return sb;
                    };
                } (),


                override: function (origclass, overrides) {
                    if (overrides) {
                        var p = origclass.prototype;
                        Ext.apply(p, overrides);
                        if (Ext.isIE && overrides.toString != origclass.toString) {
                            p.toString = overrides.toString;
                        }
                    }
                },


                namespace: function () {
                    var o, d;
                    Ext.each(arguments, function (v) {
                        d = v.split(".");
                        o = window[d[0]] = window[d[0]] || {};
                        Ext.each(d.slice(1), function (v2) {
                            o = o[v2] = o[v2] || {};
                        });
                    });
                    return o;
                },


                urlEncode: function (o, pre) {
                    var undef, buf = [], key, e = encodeURIComponent;

                    for (key in o) {
                        undef = !Ext.isDefined(o[key]);
                        Ext.each(undef ? key : o[key], function (val, i) {
                            buf.push("&", e(key), "=", (val != key || !undef) ? e(val) : "");
                        });
                    }
                    if (!pre) {
                        buf.shift();
                        pre = "";
                    }
                    return pre + buf.join('');
                },

                urlDecode: function (string, overwrite) {
                    var obj = {},
                pairs = string.split('&'),
                d = decodeURIComponent,
                name,
                value;
                    Ext.each(pairs, function (pair) {
                        pair = pair.split('=');
                        name = d(pair[0]);
                        value = d(pair[1]);
                        obj[name] = overwrite || !obj[name] ? value :
                            [].concat(obj[name]).concat(value);
                    });
                    return obj;
                },


                urlAppend: function (url, s) {
                    if (!Ext.isEmpty(s)) {
                        return url + (url.indexOf('?') === -1 ? '?' : '&') + s;
                    }
                    return url;
                },


                toArray: function () {
                    return isIE ?
                function (a, i, j, res) {
                    res = [];
                    Ext.each(a, function (v) {
                        res.push(v);
                    });
                    return res.slice(i || 0, j || res.length);
                } :
                function (a, i, j) {
                    return Array.prototype.slice.call(a, i || 0, j || a.length);
                }
                } (),

                each: function (array, fn, scope) {
                    if (Ext.isEmpty(array, true)) {
                        return;
                    }
                    if (!isIterable(array) || Ext.isPrimitive(array)) {
                        array = [array];
                    }
                    for (var i = 0, len = array.length; i < len; i++) {
                        if (fn.call(scope || array[i], array[i], i, array) === false) {
                            return i;
                        };
                    }
                },


                iterate: function (obj, fn, scope) {
                    if (isIterable(obj)) {
                        Ext.each(obj, fn, scope);
                        return;
                    } else if (Ext.isObject(obj)) {
                        for (var prop in obj) {
                            if (obj.hasOwnProperty(prop)) {
                                if (fn.call(scope || obj, prop, obj[prop]) === false) {
                                    return;
                                };
                            }
                        }
                    }
                },


                getDom: function (el) {
                    if (!el || !DOC) {
                        return null;
                    }
                    return el.dom ? el.dom : (Ext.isString(el) ? DOC.getElementById(el) : el);
                },


                getBody: function () {
                    return Ext.get(DOC.body || DOC.documentElement);
                },

                removeNode: isIE ? function () {
                    var d;
                    return function (n) {
                        if (n && n.tagName != 'BODY') {
                            d = d || DOC.createElement('div');
                            d.appendChild(n);
                            d.innerHTML = '';
                        }
                    }
                } () : function (n) {
                    if (n && n.parentNode && n.tagName != 'BODY') {
                        n.parentNode.removeChild(n);
                    }
                },

                isEmpty: function (v, allowBlank) {
                    return v === null || v === undefined || ((Ext.isArray(v) && !v.length)) || (!allowBlank ? v === '' : false);
                },


                isArray: function (v) {
                    return toString.apply(v) === '[object Array]';
                },

                isObject: function (v) {
                    return v && typeof v == "object";
                },


                isPrimitive: function (v) {
                    return Ext.isString(v) || Ext.isNumber(v) || Ext.isBoolean(v);
                },


                isFunction: function (v) {
                    return toString.apply(v) === '[object Function]';
                },


                isNumber: function (v) {
                    return typeof v === 'number' && isFinite(v);
                },


                isString: function (v) {
                    return typeof v === 'string';
                },


                isBoolean: function (v) {
                    return typeof v === 'boolean';
                },

                isDefined: function (v) {
                    return typeof v !== 'undefined';
                },


                isOpera: isOpera,

                isWebKit: isWebKit,

                isChrome: isChrome,

                isSafari: isSafari,

                isSafari3: isSafari3,

                isSafari4: isSafari4,

                isSafari2: isSafari2,

                isIE: isIE,

                isIE6: isIE6,

                isIE7: isIE7,

                isIE8: isIE8,

                isGecko: isGecko,

                isGecko2: isGecko2,

                isGecko3: isGecko3,

                isBorderBox: isBorderBox,

                isLinux: isLinux,

                isWindows: isWindows,

                isMac: isMac,

                isAir: isAir
            });


            Ext.ns = Ext.namespace;
        })();

        Ext.apply(Function.prototype, {

            createInterceptor: function (fcn, scope) {
                var method = this;
                return !Ext.isFunction(fcn) ?
                this :
                function () {
                    var me = this,
                        args = arguments;
                    fcn.target = me;
                    fcn.method = method;
                    return (fcn.apply(scope || me || window, args) !== false) ?
                            method.apply(me || window, args) :
                            null;
                };
            },

            createCallback: function (/*args...*/) {
                // make args available, in function below
                var args = arguments,
            method = this;
                return function () {
                    return method.apply(window, args);
                };
            },


            createDelegate: function (obj, args, appendArgs) {
                var method = this;
                return function () {
                    var callArgs = args || arguments;
                    if (appendArgs === true) {
                        callArgs = Array.prototype.slice.call(arguments, 0);
                        callArgs = callArgs.concat(args);
                    } else if (Ext.isNumber(appendArgs)) {
                        callArgs = Array.prototype.slice.call(arguments, 0); // copy arguments first
                        var applyArgs = [appendArgs, 0].concat(args); // create method call params
                        Array.prototype.splice.apply(callArgs, applyArgs); // splice them in
                    }
                    return method.apply(obj || window, callArgs);
                };
            },

            defer: function (millis, obj, args, appendArgs) {
                var fn = this.createDelegate(obj, args, appendArgs);
                if (millis > 0) {
                    return setTimeout(fn, millis);
                }
                fn();
                return 0;
            }
        });


        Ext.applyIf(String, {

            format: function (format) {
                var args = Ext.toArray(arguments, 1);
                return format.replace(/\{(\d+)\}/g, function (m, i) {
                    return args[i];
                });
            }
        });


        Ext.applyIf(Array.prototype, {

            indexOf: function (o) {
                for (var i = 0, len = this.length; i < len; i++) {
                    if (this[i] == o) {
                        return i;
                    }
                }
                return -1;
            },


            remove: function (o) {
                var index = this.indexOf(o);
                if (index != -1) {
                    this.splice(index, 1);
                }
                return this;
            }
        });



        UCML.JSON = new (function () {
            var useHasOwn = !!{}.hasOwnProperty,
        isNative = function () {
            var useNative = null;

            return function () {
                if (useNative === null) {
                    useNative = Ext.USE_NATIVE_JSON && window.JSON && JSON.toString() == '[object JSON]';
                }

                return useNative;
            };
        } (),
        pad = function (n) {
            return n < 10 ? "0" + n : n;
        },
        doDecode = function (json) {
            return eval("(" + json + ')');
        },
        doEncode = function (o) {
            if (typeof o == "undefined" || o === null) {
                return "null";
            } else if (Ext.isArray(o)) {
                return encodeArray(o);
            } else if (Object.prototype.toString.apply(o) === '[object Date]') {
                return UCML.JSON.encodeDate(o);
            } else if (typeof o == "string") {
                return encodeString(o);
            } else if (typeof o == "number") {
                return isFinite(o) ? String(o) : "null";
            } else if (typeof o == "boolean") {
                return String(o);
            } else {
                var a = ["{"], b, i, v;
                for (i in o) {
                    if (!useHasOwn || o.hasOwnProperty(i)) {
                        v = o[i];
                        switch (typeof v) {
                            case "undefined":
                            case "function":
                            case "unknown":
                                break;
                            default:
                                if (b) {
                                    a.push(',');
                                }
                                a.push(doEncode(i), ":",
                                    v === null ? "null" : doEncode(v));
                                b = true;
                        }
                    }
                }
                a.push("}");
                return a.join("");
            }
        },
        m = {
            "\b": '\\b',
            "\t": '\\t',
            "\n": '\\n',
            "\f": '\\f',
            "\r": '\\r',
            '"': '\\"',
            "\\": '\\\\'
        },
        encodeString = function (s) {
            if (/["\\\x00-\x1f]/.test(s)) {
                return '"' + s.replace(/([\x00-\x1f\\"])/g, function (a, b) {
                    var c = m[b];
                    if (c) {
                        return c;
                    }
                    c = b.charCodeAt();
                    return "\\u00" +
                        Math.floor(c / 16).toString(16) +
                        (c % 16).toString(16);
                }) + '"';
            }
            return '"' + s + '"';
        },
        encodeArray = function (o) {
            var a = ["["], b, i, l = o.length, v;
            for (i = 0; i < l; i += 1) {
                v = o[i];
                switch (typeof v) {
                    case "undefined":
                    case "function":
                    case "unknown":
                        break;
                    default:
                        if (b) {
                            a.push(',');
                        }
                        a.push(v === null ? "null" : UCML.JSON.encode(v));
                        b = true;
                }
            }
            a.push("]");
            return a.join("");
        };

            this.encodeDate = function (o) {
                return '"' + o.getFullYear() + "-" +
                pad(o.getMonth() + 1) + "-" +
                pad(o.getDate()) + "T" +
                pad(o.getHours()) + ":" +
                pad(o.getMinutes()) + ":" +
                pad(o.getSeconds()) + '"';
            };

            this.encode = function () {
                var ec;
                return function (o) {
                    if (!ec) {
                        ec = isNative() ? JSON.stringify : doEncode;
                    }
                    return ec(o);
                };
            } ();

            this.decode = function () {
                var dc;
                return function (json) {
                    if (!dc) {
                        dc = isNative() ? JSON.parse : doDecode;
                    }
                    return dc(json);
                };
            } ();

        })();


        UCML.encode = UCML.JSON.encode;

        UCML.decode = UCML.JSON.decode;




        UCML.Cookie = {};
        UCML.Cookie.add = function (name, value, expireHours) {
            var expires = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * 7)); //7 days
            var cookieString = name + "=" + escape(value);
            //判断是否设置过期时间
            if (expireHours > 0) {
                expires = new Date();
                expires.setTime(date.getTime + expireHours * 3600 * 1000);
            }
            cookieString = cookieString + "; expire=" + expires.toGMTString();
            document.cookie = cookieString;
        }

        //读取cookie
        UCML.Cookie.get = function (name) {
            var strcookie = document.cookie;
            var arrcookie = strcookie.split("; ");
            for (var i = 0; i < arrcookie.length; i++) {
                var arr = arrcookie[i].split("=");
                if (arr[0] == name) {
                    //解码并返回
                    return unescape(arr[1]);
                }
            }
            return "";
        }

        //删除cookie
        UCML.Cookie.clear = function (name) {
            var exp = new Date();
            exp.setTime(exp.getTime() - 1);
            var cval = UCML.Cookie.get(name);
            if (cval != null) document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
        }

        var doc = window.document;



        function setSize() {
            var body = $(window.document.body);
            var default_top = $("#default_top");
            var default_main = $("#default_main");
            var content = $("#content");
            var map = $("#map");
            var bar = $("#bar");
            var default_main_right = $(".default_main_right");
            var default_left = $("#default_left");
            var bottomBar = $("#bottomBar");
            var show_left = $("#show_left");
            var hide_left = $("#hide_left");
            var taskbar_tag_box = $("#taskbar_tag_box");
            var taskbar_quick = $("#taskbar_quick");

            var bdh = body.height();

            var btb_c = 0;
            var dm_c = 0;
            var dmr_c = 0;

            if ($.browser.msie) {

                btb_c = (bottomBar.outerHeight(true) - bottomBar.height());
                dm_c = (default_main.outerHeight(true) - default_main.height());
                dmr_c = (default_main_right.outerHeight(true) - default_main_right.height());
            }
            var dmh = bdh - (default_top.is(':visible') ? default_top.outerHeight(true) : 0) - dm_c - $(".cleargreen").outerHeight(true);

            default_main.height(dmh);

            var dmrh = dmh - dmr_c;
            var maph = map.outerHeight(true);

            default_main_right.height(dmrh);
            //default_main_right.width(default_main.width() - (default_left.is(':visible') ? default_left.outerWidth() : 0) - show_left.outerWidth() - (default_main_right.outerHeight(true) - default_main_right.height()));
            var w = default_main.width() - (default_left.is(':visible') ? default_left.outerWidth() : 0) - show_left.outerWidth() - (default_main_right.outerHeight(true) - default_main_right.height());
            //解决浏览器放大缩小时某些比例下不显示问题
            default_main_right.width(w - 1);

            var btbh = dmrh - maph - btb_c;
            bottomBar.height(btbh);


            content.height(btbh - 26);

            taskbar_tag_box.width(bar.width() - taskbar_quick.outerWidth(true) - (bar.outerWidth(true) - bar.width()));



            $(".menu_content").height(default_left.height() - $(".left_menu_div").outerHeight());


            var taskbar_tag_boxWidth = doc.getElementById('bar').offsetWidth - doc.getElementById('taskbar_quick').offsetWidth - 5;


            checkMenu(mindex);
            var $menu2 = $("#menu2");
            var len = $menu2.find("#MenuBar1 > li.MenuBarItemIE").length;

            if (getMenuAllWidth() > body.width()) {
                $("#menu3").css("margin-left", "20px").css("margin-right", "20px");
                $(".scroll_left").show();
                $(".scroll_right").show();
            }
            else {
                $("#menu3").css("margin-left", "0px").css("margin-right", "0px");
                $(".scroll_left").hide();
                $(".scroll_right").hide();
            }
            page = 1;
            fn_PrevButton();
        }

        function hidenTop(o) {
            var default_top = doc.getElementById('default_top');
            if (default_top.style != null && default_top.style.display != null && default_top.style.display == "none") {
                default_top.style.display = "block";
                o.title = "点击收缩顶部信息";
            }
            else {
                default_top.style.display = "none";
                o.title = "点击展开顶部信息";

            }
            setSize();
        }

        function maxWindow() {
            var default_top = doc.getElementById('default_top');
            if (default_top.style != null && default_top.style.display != null && default_top.style.display == "none") {
                default_top.style.display = "block";
                show_left();
            }
            else {
                default_top.style.display = "none";
                close_left();
            }

        }

        setSize();

        window.onresize = setSize;

        var ToolBar = function (id) {
            this.list = new Array();
            this.cookieList = new Array();
            this.select = null;
            this.Container = null;
            if (typeof (id) == "string") {
                this.Container = doc.getElementById(id) || doc.body;
            }
            else {
                this.Container = id;
            }
            this.id = this.Container.id;

            this.content = doc.getElementById('content');

            this.bar = doc.getElementById('bar');

            this.barTag = doc.getElementById('barTag');

            this.ul = doc.getElementById('barTagUI');
        }



        ToolBar.prototype.clearClass = function () {
            for (var i = 0; i < this.ul.childNodes.length; i++) {
                if (this.ul.childNodes[i].tagName && this.ul.childNodes[i].tagName.toLowerCase() == "li") {
                    this.ul.childNodes[i].className = "";
                    this.ul.childNodes[i].content.style.display = "none";
                }
            }
        }

        ToolBar.prototype.setSelect = function (li) {
            if (li == null) {
                return;
            }
            var indexc = this.list.indexOf(li.object);
            if (indexc == -1) {
                return;
            }
            this.select = li;
            li.ul.clearClass();
            li.content.style.display = "block";
            li.className = "current";
//            doc.getElementById('divMap').innerHTML = li.object.map || li.object.title;
            var taskbar_tag_boxc = doc.getElementById('taskbar_tag_box');

            if (!li.isLoad) {
                li.isLoad = true;
                if (li.otype == 1) {
                    li.content.innerHTML = li.con || "";
                }
                else {
                    li.content.innerHTML = "<iframe id='" + li.id + "iframe' onreadystatechange=\"stateChangeIE(this)\" src=" + li.con + " scrolling=\"auto\" frameborder=\"0\" height=\"100%\" width=\"100%\" ></iframe>"
                }
            }
            else {
                // this.Refresh();
            }


            var iWidth = (taskbar_tag_boxc.scrollWidth - taskbar_tag_boxc.offsetWidth) / (this.ul.childNodes.length - 1);


            if (this.list.length - 1 == indexc) {
                taskbar_tag_boxc.scrollLeft = taskbar_tag_boxc.scrollWidth - taskbar_tag_boxc.offsetWidth;
            }
            else {
                taskbar_tag_boxc.scrollLeft = iWidth * (indexc > 1 ? indexc + 1 : indexc);
            }

            loadLeftMenu(doc.getElementById(li.object.menuLi));

        }

        ToolBar.prototype.delItem = function (li) {
            var indexc = this.list.indexOf(li.object);
            if (indexc == this.list.length - 1) {
                indexc = indexc - 1;
            }
            this.list.remove(li.object);
            this.cookieList.remove(li.object.OID);
            li.content.parentNode.removeChild(li.content);
            li.parentNode.removeChild(li);
            if (indexc >= 0) {
                this.setSelect(doc.getElementById(this.list[indexc].id));
            }
            UCML.Cookie.add('bottomBar', UCML.encode(this.cookieList));
            setSize();
            doc.getElementById('barTag').style.width = (116 * this.list.length) + "px";
        }

        ToolBar.prototype.delAll = function () {
            UCML.Cookie.clear('bottomBar');
        }

        window.document.body.onmouseover = function () {
            bottomBar.hideQuick();
        }

        ToolBar.prototype.hideQuick = function () {
            $("div.taskbox").hide();
        }

        ToolBar.prototype.Refresh = function () {
            if (this.select != null && this.select.otype != 1) {
                window.document.getElementById(this.select.id + 'iframe').contentWindow.location.reload();
            }
        }

        ToolBar.prototype.addQuickSkin = function () {
            this.hideQuick();
            doc.getElementById('skin_change_box').style.display = "block";
        }

        ToolBar.prototype.addQuickMenu = function (id) {

            this.hideQuick();

            doc.getElementById('quickBox').style.display = "block";

            quickList = doc.getElementById("quickBoxul");

            quickList.innerHTML = "";
            quickList.ul = this;


            for (var i = 0; i < this.list.length; i++) {

                var li = doc.createElement('li');
                li.ul = this;
                li.PID = this.list[i].id;

                li.id = id + "_li" + UCML.id();

                li.onclick = function () {
                    this.ul.setSelect(doc.getElementById(this.PID));
                }
                var a = doc.createElement('a');
                li.title = this.list[i].title || "";
                var img = doc.createElement('img');
                img.style.width = "17px";
                img.style.height = "14px";
                img.src = this.list[i].imgsrc || 'resource/images/renwu_ico.jpg';
                img.className = "taskbar_tag_img";
                a.appendChild(img);
                var titleConten = doc.createElement('span');
                titleConten.innerHTML = this.list[i].title || "";
                a.appendChild(titleConten);
                li.appendChild(a);


                if (this.list[i].isCookie) {
                    var closeimg = doc.createElement('img');
                    closeimg.style.width = "12px";
                    closeimg.style.height = "12px";
                    closeimg.src = 'resource/images/close_taskbar.gif';
                    closeimg.className = "taskbar_closetag";
                    closeimg.alt = "点击关闭";
                    closeimg.ul = this;
                    closeimg.li = li;
                    closeimg.onclick = function () {
                        quickList.removeChild(this.li);
                        this.ul.delItem(doc.getElementById(this.li.PID));
                        setSize();
                    }
                    li.appendChild(closeimg);
                }
                quickList.appendChild(li);
            }

            // 添加关闭所有选项
            if (this.list.length > 0) {
                var o_li = doc.createElement("li");
                o_li.ul = this;
                o_li.id = "closeOthers";
                o_li.title = "<%= CloseAll() %>";

                var a = doc.createElement('a');
                a.onclick = function () {
                    $("#quickBoxul li").each(function () {
                        var li = this;
                        if (li.childNodes.length > 1) {
                            quickList.removeChild(li);
                            li.ul.delItem(doc.getElementById(li.PID));
                            setSize();
                        }
                    });
                }

                var img = doc.createElement('img');
                img.style.width = "17px";
                img.style.height = "14px";
                img.src = 'resource/images/renwu_ico.jpg';
                img.className = "taskbar_tag_img";
                a.appendChild(img);

                var titleConten = doc.createElement('span');
                titleConten.innerHTML = o_li.title;
                a.appendChild(titleConten);
                o_li.appendChild(a);

                quickList.appendChild(o_li);
            }

            setSize();
        }

        ToolBar.prototype.addItem = function (oid, title, imgsrc, type, con, isLoad, isCookie, map, menuLi, refresh) {
            if (!con) {
                return;
            }

            //      for (li in this.list) {
            //          if (li.con == con) {
            var indexLi = window.document.getElementById(this.id + "_li" + oid);
            if (indexLi != null) {
                this.setSelect(indexLi);
                //if (refresh) {
                  //  this.Refresh();
                //}
                return;
            }
            //         }
            //     }

            if (isLoad == undefined || isLoad == null || isLoad == true) {
                isLoad = true;
            }
            else {
                isLoad = false;
            }

            if (isCookie == undefined || isCookie == null || isCookie == true) {
                isCookie = true;
            }
            else {
                isCookie = false;
            }

            if (this.ul.childNodes.length > 30) {
                var val = document.getElementById("hiddenTaskbar").value;
                alert(val);
                return;
            }

            //      this.clearClass();
            var li = doc.createElement('li');
            li.ul = this;
            li.id = this.id + "_li" + oid;
            li.onclick = function () {
                this.ul.setSelect(this);
            }
            //         li.className = "current";
            var a = doc.createElement('a');
            li.title = title || "";
            var img = doc.createElement('img');
            img.style.width = "17px";
            img.style.height = "14px";
            img.src = imgsrc || 'resource/images/renwu_ico.jpg';
            img.className = "taskbar_tag_img";
            a.appendChild(img);
            var titleConten = doc.createElement('div');
            titleConten.innerHTML = title || "";
            a.appendChild(titleConten);
            li.appendChild(a);

            if (isCookie) {
                var closeimg = doc.createElement('img');
                closeimg.style.width = "12px";
                closeimg.style.height = "12px";
                closeimg.src = 'resource/images/close_taskbar.gif';
                closeimg.className = "taskbar_closetag";
                closeimg.alt = "点击关闭";
                closeimg.ul = this;
                closeimg.li = li;
                closeimg.onclick = function () {

                    this.ul.delItem(li);
                }
                li.appendChild(closeimg);
            }

            this.ul.appendChild(li);
            var contentPage = doc.createElement('div');
            contentPage.className = "contentPage";
            li.content = contentPage;
            //    contentPage.style.wdith =  "1103px";
            contentPage.TagLi = true;
            contentPage.style.display = "none";

            li.con = con;
            li.otype = type;
            li.isLoad = isLoad;


            this.content.appendChild(contentPage);

            var oli = new Object();
            oli.id = li.id;
            oli.title = title;
            oli.imgsrc = imgsrc;
            oli.type = type;
            oli.con = con;
            oli.isCookie = isCookie;
            oli.OID = oid;
            oli.map = map || title;
            oli.menuLi = menuLi;
            li.object = oli;

            this.list[this.list.length] = oli;
            if (isCookie) {
                this.cookieList[this.cookieList.length] = oid;
            }

            UCML.Cookie.add('bottomBar', UCML.encode(this.cookieList));


            doc.getElementById('barTag').style.width = (116 * this.list.length) + "px";
            setSize();
            if (isLoad) {
                if (type == 1) {
                    contentPage.innerHTML = con || "";
                }
                else {
                    contentPage.innerHTML = "<iframe id='" + li.id + "iframe'   onreadystatechange=\" stateChangeIE(this)\" src=" + con + " scrolling=\"auto\" frameborder=\"0\" height=\"100%\" width=\"100%\" ></iframe>"
                }
                this.setSelect(li, isLoad);
            }
        }

        var bottomBarData = UCML.Cookie.get('bottomBar');
        var bottomBar = new ToolBar('bottomBar');

    </script>
    <script type="text/javascript">
        pngHandler.init();
        var MenuBar1 = new Spry.Widget.MenuBar("MenuBar1", { imgDown: "resource/css/SpryAssets/SpryMenuBarDownHover.gif", imgRight: "resource/css/SpryAssets/SpryMenuBarRightHover.gif" });
        loadLeftMenu();

        function openPortal() {
            bottomBar.hideQuick();
            doc.getElementById('portal_box').style.display = "block";

        }
       

    </script>
    <asp:Literal runat="server" ID="Literalportal"></asp:Literal>
    <script type="text/javascript">
        function changeporta(id, fistName, fistURL) {
            bottomBar.addItem(id, fistName, '', 0, fistURL, true, true);
        }
        if (bottomBarData != "") {
            bottomBarData = UCML.decode(bottomBarData);

            if (bottomBarData && bottomBarData.length > 0) {
                //    if (window.confirm("上次已经有" + bottomBarData.length + "个未关闭的页面，是否全部打开")) {
                for (var i = 0; i < bottomBarData.length; i++) {
                    var oli = doc.getElementById(bottomBarData[i]);
                    if (oli) {

                        var tabSelect = false;
                        if (!bottomBar.select) {
                            tabSelect = true
                        }
                        bottomBar.addItem(oli.id, oli.attributes["mtiltle"].value, oli.attributes["mimages"].value, oli.attributes["mtype"].value, oli.attributes["mcon"].value, tabSelect, true, oli.attributes["mmap"].value, oli.attributes["menuLi"].value);
                    }

                }
                //    }
                //    else {
                //        UCML.Cookie.clear('bottomBar');
                //    }
            }
        }

        $("div.taskbox").mouseover(function (e) {
            e.stopPropagation();
        });

        $("div.taskbar").mouseover(function (e) {
            e.stopPropagation();
        });

        //换肤
        $("#skin_change > li").click(function () {

            setFrameSkin($(this).attr("name"));
        });


        function setFrameSkin(skinName) {
            loadSkin(skinName, "UBSC_Frame", function (skin) {
                if (skin) {
                    var frame = skin.frame;
                    if (frame.styles) {
                        $.each(frame.styles, function (index, item) {
                            $("link#" + item.id).attr("href", localResourcePath + item.src);
                        });
                    }
                    if (frame.scripts) {
                        $.each(frame.scripts, function (index, item) {
                        });
                    }
                    onSetSkin(skinName, skin.page);
                }
            });
        }

        function onSetSkin(skinName, pageSkin) {
            $("#content > div.contentPage > iframe").each(
            function () {
                var page = this.contentWindow;
                if (page && page.setPageSkin) {
                    page.setPageSkin(pageSkin);
                }
                if (page && page.setTemplateSkin) {
                    page.setTemplateSkin(skinName);
                }
            });
        }
    </script>
    <script type="text/javascript">
        function login() {
            $.ajax({
                url: "../../MessageProcess.ashx?Action=Login",
                dataType: "json"
            });
        }

        function getMessageCount() {
            $.ajax({
                url: "../../MessageProcess.ashx?Action=GetMessageCount",
                dataType: "json",
                success: function (data) {
                    if (data.status == 0) {
                        if (data.messageCount != 0) setIMState(1);
                        else setIMState(0);
                    }
                }
            });
        }

        function clearMsgInterval() {
            clearInterval(msgRtInterval);
        }

        login();
        getMessageCount();

        //新消息检索时间
        var NMRT = $("[id$=NMRT]").val();
        //msgRtInterval = setInterval(getMessageCount, 60000 * NMRT);
        //与RecvMsg同步，时间默认为30秒  注释掉clearMsgInterval()了
        msgRtInterval = setInterval(getMessageCount, 30000);

    </script>
    <script type="text/javascript">

        var navigatorcode = navigator.appCodeName;
        var navigatorname = navigator.appName;
        var navigatorver = navigator.appVersion;

        if (navigator.userAgent.indexOf('Firefox') >= 0) {

            document.onkeydown = function (e) {
                var thekey = e.which;
                if (thekey == 9) {
                    e.which = 0;
                    e.preventDefault();
                }
            }
        }


        $("#menu")[0].onkeydown = function (e) {

            var key = e.keyCode;

            if (key == 9) {
                //tab
                if (navigatorname == "Microsoft Internet Explorer") {
                    $("#default_left")[0].parentElement.focus();
                }
                else if (navigatorname == "Netscape") {
                    e.keyCode = 0;
                    e.returnValue = false;
                }
                else {
                    $("#default_left")[0].parentElement.focus();
                    //ev.which=0; 
                    //ev.preventDefault(); 
                }
            }
        }
    </script>
</body>
</html>
