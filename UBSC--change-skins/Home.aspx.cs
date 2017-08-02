using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Text;
using System.Xml;
using System.IO;
using System.Web.UI.WebControls;
using System.Web.UI.HtmlControls;
using System.Data;
using UCMLCommon;
using UCML.SkinFrame;

namespace UCML.UBSC
{
    public partial class Home : UCML.Page.HomePage
    {
        protected StringBuilder HTMLText = new StringBuilder();
        public UCMLCommon.ClientUserInfo loginuser;
        public bool ifPortal = true;

        string rootPath = string.Empty;

        protected override void OnInit(EventArgs e)
        {
            LocalResourcePath = "../../";
            ScreenName = "UBSC_Frame";
            base.OnInit(e);
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            HttpBrowserCapabilities bc = Request.Browser;

            if (bc.Browser == "IE" && (bc.MajorVersion == 8 || bc.MajorVersion == 9))
            {
          //      Literal mete = new Literal();
         //       mete.Text = "<meta http-equiv=\"X-UA-Compatible\" content=\"IE=7\" />";
         //       Page.Header.Controls.AddAt(0, mete);
            }
            rootPath = Request.ApplicationPath == "/" ? string.Empty : Request.ApplicationPath;
            if (!IsPostBack)
            {
                Session["SkinName"] = null;
                string UserName = (string)UCMLCommon.Session.Get("UserName");
                ScreenInfo = (UCMLCommon.UCMLScreenInfo)UCMLCommon.CachedClient.Get(UserName + "ScreenInfo");
                loginuser = (UCMLCommon.ClientUserInfo)UCMLCommon.Session.Get(PurviewSystemName + UserName);

                if (this.loginuser == null)
                {
                    Response.Write("<script type=\"text/javascript\">alert('未登录或登录失败,请重新登录'); window.location = 'Userlogin.aspx?logout=true';</script>");
                    return;
                }
                if (this.loginuser.PurviewArray == null || this.loginuser.PurviewArray.Length == 0)
                {
                    Response.Write("<script type=\"text/javascript\">alert('没有任何可操作权限');window.location = 'Userlogin.aspx?logout=true';</script>");
                    return;
                }

                if (ScreenInfo == null || ScreenInfo.BusiPortalInfo == null || ScreenInfo.BusiPortalInfo.Length == 0)
                {
                    Response.Write("<script type=\"text/javascript\">alert('没有任何菜单权限');window.location = 'Userlogin.aspx?logout=true';</script>");
                    return;
                }
                ltUserLoginInfoLab.Text = GetUserLoginInfoLab();//登录人员信息
                BindMenu();
                BindSystemButton();
                //加载HOME页皮肤
                LoadFrameSkin();
                LoadSkinMenu();
                PrepareMenu(loginuser);

                GetSysRetrievalTime();//获取系统检索时间

                //获取安全策略配置信息进行配置
                DBLayer.PasswordSafe pwdSafeObj = new DBLayer.PasswordSafe();
                DBLayer.PasswordSafeInfo[] pwdSafeArr = pwdSafeObj.FindPwdSafe();
                if (pwdSafeArr.Length > 0 && pwdSafeArr[0].fSecurityPolicy == true) {
                    LoadModifyPwdPage(pwdSafeArr);//加载修改密码页面
                }
            }
        }

        public void LoadModifyPwdPage(DBLayer.PasswordSafeInfo[] pwdSafeArr)
        {
            SysDBModel.UCML_User userObj = new SysDBModel.UCML_User();
            SysDBModel.UCML_UserInfo[] userInfoArr = userObj.FindUser((string)UCMLCommon.Session.Get("UserName"));

            if (pwdSafeArr.Length > 0 && ((string)UCMLCommon.Session.Get("UserName") != "ADMIN") && !Convert.ToBoolean(pwdSafeArr[0].fRefuseUserModifyPwd))
            {
                //假如不是admin而且该用户登录密码等于设置的初始密码，则进行强制修改密码
                if (Convert.ToBoolean(pwdSafeArr[0].fModifyPwdInitPwd) && (pwdSafeArr[0].InitPwd.ToString().Equals(userInfoArr[0].PassWord.ToString())))
                {
                    updatePwdMsg.Text = "<script type=\"text/javascript\">updatePwd(0);</script>";
                    return;
                }
                else
                {
                    //判断最长使用天数
                    DateTime now = DateTime.Now;
                    DateTime lastupdate = Convert.ToDateTime(userInfoArr[0].USR_PW_LAST_UPD);
                    TimeSpan ts = now - lastupdate;
                    int d = ts.Days;
                    if ((Convert.ToInt32(pwdSafeArr[0].MaxiDays) > 0) && (d > Convert.ToInt32(pwdSafeArr[0].MaxiDays)))
                    {
                        updatePwdMsg.Text = "<script type=\"text/javascript\">updatePwd(1);</script>";
                        return;
                    }
                }
            }
        }

        public void LoadSkinMenu()
        {
            SkinConfigMonitor watcher = (SkinConfigMonitor)Application["SkinWatcher"];
            Skin[] skins = watcher.CurrentScreen.Skins;

            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            sb.Append("<iframe  frameBorder='0' style='-moz-opacity:0; -webkit-opacity:0; opacity:0;  position:absolute; visibility:inherit; top:0px; left:-15px;  height:100%;width:150px; z-index:-1;background:none' ></iframe>");
            sb.Append("<ul ID='skin_change'>");
            foreach (Skin s in skins)
            {
                sb.AppendFormat("<LI  title='{0}' name='{2}' ><A href='#'><IMG  class=taskbar_tag_img src='{1}' width=17 height=14><SPAN>{0}</SPAN></A></LI>", s.Title, s.Icon, s.Name);
            }
            sb.Append("</ul>");
            skinBubbleCenter.Text = sb.ToString();
        }




        public void PrepareMenu(UCMLCommon.ClientUserInfo loginuser)
        {

            string portalURL = string.Empty;
            System.Text.StringBuilder sb = new System.Text.StringBuilder();
            SysDBModel.UCML_WebPage objt = new SysDBModel.UCML_WebPage();

            System.Text.StringBuilder portalListStr = new System.Text.StringBuilder();

            DataTable entChildMenu = UCMLCommon.UCMLUtilityFunc.GetPersonAllPortal();
            portalListStr.Append("<iframe  frameBorder='0' style='-moz-opacity:0; -webkit-opacity:0; opacity:0;  position:absolute; visibility:inherit; top:0px; left:-15px;  height:100%;width:150px; z-index:-1;background:none' ></iframe>");
            portalListStr.Append("<ul ID='portalList'>");
            string defPageOID = new BPO_DefaultWebPageListService().DefaultWebPageOID;
            for (int i = 0; i < entChildMenu.Rows.Count; i++)
            {
                portalURL = LocalResourcePath + "BPO_AppletContainer.aspx?pageID=" + entChildMenu.Rows[i]["ID"].ToString();

                if (!string.IsNullOrWhiteSpace(defPageOID)) {
                    if (defPageOID == entChildMenu.Rows[i]["UCML_WebPageOID"].ToString())
                    {
                        sb.Append("\t bottomBar.addItem('home', '" + entChildMenu.Rows[i]["Name"].ToString() + "', '', 0, '" + portalURL + "', true, false);\n");
                    }
                }
                else if(i == 0)
                {
                    sb.Append("\t bottomBar.addItem('home', '" + entChildMenu.Rows[i]["Name"].ToString() + "', '', 0, '" + portalURL + "', true, false);\n");
                }
                portalListStr.AppendFormat("<LI  title='{0}'  ><A href=\"javascript:{1}\">{0}</SPAN></A></LI>", entChildMenu.Rows[i]["Name"].ToString(), "bottomBar.addItem('portal_" + entChildMenu.Rows[i]["ID"].ToString() + "', '" + entChildMenu.Rows[i]["Name"].ToString() + "', '', 0, '" + portalURL + "',true ,true)");

            }
            portalListStr.Append("</ul>");

            this.Literalportal.Text = "<script  type=\"text/javascript\">" + sb.ToString() + " </script> ";

            this.portalList.Text = portalListStr.ToString();
        }

        public void getMapStr(XmlNode xe, StringBuilder sb)
        {
            if (xe.ParentNode != null && xe.ParentNode.Attributes != null && xe.ParentNode.Attributes["text"] != null)
            {
                getMapStr(xe.ParentNode, sb);
                sb.Append(xe.ParentNode.Attributes["text"].Value + " >> ");
            }
        }

        public string BindMapStr(XmlNode xe, string busiName)
        {
            StringBuilder sb = new StringBuilder();
            sb.Append(busiName + " >> ");
            getMapStr(xe, sb);
            sb.Append(xe.Attributes["text"].Value);
            return sb.ToString();
        }

        public void BindSystemButton()
        {
            StringBuilder sysBtn = new StringBuilder();
            for (int i = 0; i < ScreenInfo.SystemButton.Length; i++)
            {
                sysBtn.Append("<a onclick=\"" + ScreenInfo.SystemButton[i].OnClickSourceCode + "\" style=\"cursor:hand;\" title=" + ScreenInfo.SystemButton[i].Caption + "><img  border=\"0\"  src=\"" + ScreenInfo.SystemButton[i].ImageLink + "\" width=\"21\" height=\"22\" border=\"0\"  alt=\"" + ScreenInfo.SystemButton[i].Caption + "\"></a>");

            }
            ltSystemButton.Text = sysBtn.ToString();
        }

        public void BindMenu()
        {
            XmlDocument doc = new XmlDocument();
            for (int i = 0; i < ScreenInfo.BusiPortalInfo.Length; i++)
            {
                doc = BuildRightTree(i);
                if (doc == null)
                {
                    continue;
                }
                if (!ScreenInfo.BusiPortalInfo[i].IsUseMobile && !ScreenInfo.BusiPortalInfo[i].IsUseWeiXin)
                {
                    if (doc.ChildNodes.Count > 1 && doc.ChildNodes[1].ChildNodes.Count > 0)
                    {
                        HTMLText.AppendFormat(" <li id='MenuLi{1}' onclick='loadLeftMenu(this)' ><a href=\"#\">{0}</a>", ScreenInfo.BusiPortalInfo[i].BusiName, ScreenInfo.BusiPortalInfo[i].MenuItemOID);
                        setNodeMenu(doc.ChildNodes[1], ScreenInfo.BusiPortalInfo[i].BusiName, "MenuLi" + ScreenInfo.BusiPortalInfo[i].MenuItemOID);
                        HTMLText.Append("</li>");
                    }
                }
            }

            ltTopMenuBar.Text = HTMLText.ToString();
        }

        public void setNodeMenu(XmlNode xe, string busiName, string menuLi)
        {
            if (xe.ChildNodes.Count > 0)
            {
                HTMLText.Append("<ul>");
                for (int i = 0; i < xe.ChildNodes.Count; i++)
                {
                    if ((xe.ChildNodes[i].Attributes["IsUseMobile"] == null || xe.ChildNodes[i].Attributes["IsUseMobile"].Value != "True") && (xe.ChildNodes[i].Attributes["IsUseWeiXin"] == null || xe.ChildNodes[i].Attributes["IsUseWeiXin"].Value != "True"))
                    {
                        //HTMLText.AppendFormat(" <li id='MenuLi{3}' mtiltle='{0}' mtype='0' mimages='{2}' mcon='{1}' mmap='{4}' menuLi='{5}'><a href='#'  onclick=\" bottomBar.addItem('MenuLi{3}','{0}', '{2}', 0, '{1}',true,true,'{4}','{5}');\" >{0}</a>", xe.ChildNodes[i].Attributes["text"].Value, xe.ChildNodes[i].Attributes["url"].Value == "" ? "" : LocalResourcePath + xe.ChildNodes[i].Attributes["url"].Value, xe.ChildNodes[i].Attributes["im0"].Value.Length == 0 ? "" : xe.ChildNodes[i].Attributes["im0"].Value, xe.ChildNodes[i].Attributes["OID"].Value, BindMapStr(xe.ChildNodes[i], busiName), menuLi);
                        HTMLText.AppendFormat(" <li id='MenuLi{3}' mtiltle='{0}' mtype='0' mimages='{2}' mcon='{1}' mmap='{4}' menuLi='{5}'><a href='#'  onclick=\" bottomBar.addItem('MenuLi{3}','{0}', '{2}', 0, '{1}',true,true,'{4}','{5}');\" >{0}</a>", xe.ChildNodes[i].Attributes["text"].Value, (xe.ChildNodes[i].Attributes["url"].Value.IndexOf("www") != -1 || xe.ChildNodes[i].Attributes["url"].Value.IndexOf(@"http://") != -1) ? xe.ChildNodes[i].Attributes["url"].Value : (xe.ChildNodes[i].Attributes["url"].Value == "" ? "" : LocalResourcePath + xe.ChildNodes[i].Attributes["url"].Value), xe.ChildNodes[i].Attributes["im0"].Value.Length == 0 ? "" : xe.ChildNodes[i].Attributes["im0"].Value, xe.ChildNodes[i].Attributes["OID"].Value, BindMapStr(xe.ChildNodes[i], busiName), menuLi);
                        setNodeMenu(xe.ChildNodes[i], busiName, menuLi);
                    }
                }
                HTMLText.Append("</ul>");
            }
        }

        /// <summary>
        /// 登录人员信息
        /// </summary>
        /// <param name="LoginUser"></param>
        public string GetUserLoginInfoLab()
        {
            string labStr = string.Empty;
            if (this.loginuser == null)
            {
                return labStr;
            }
            if (loginuser.PersonName == "")
            {
                if (loginuser.PostnName == null)
                {
                    loginuser.PostnName = "";
                }
                if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
                {
                    labStr = loginuser.PostnName + " " + loginuser.UserID + LoadResString("SCR_TODAY") + DateTime.Now.Year + LoadResString("SCR_YEAR") + DateTime.Now.Month + LoadResString("SCR_MONTH") + DateTime.Now.Day + LoadResString("SCR_DAY");
                }
                else
                {
                    labStr = loginuser.PostnName + " " + loginuser.UserID + " 您好 今天" + DateTime.Now.Year + "年" + DateTime.Now.Month + "月" + DateTime.Now.Day + "日";
                }
            }
            else
            {
                if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
                {
                    labStr = loginuser.PostnName + " " + loginuser.PersonName + LoadResString("SCR_TODAY") + DateTime.Now.Year + LoadResString("SCR_YEAR") + DateTime.Now.Month + LoadResString("SCR_MONTH") + DateTime.Now.Day + LoadResString("SCR_DAY");
                }
                else
                {
                    labStr = loginuser.PostnName + " " + loginuser.PersonName + " 您好 今天" + DateTime.Now.Year + "年" + DateTime.Now.Month + "月" + DateTime.Now.Day + "日";
                }
            }
            return labStr;
        }


        /// <summary>
        /// 构建业务入口的菜单程序,要结合权限系统
        /// </summary>
        public XmlDocument BuildRightTree(int Index)
        {
            XmlDocument XmlDoc = new XmlDocument();
            XmlDeclaration XmlDeclar;
            XmlElement XmlRoot;
            XmlAttribute XmlAttrib;

            XmlDeclar = XmlDoc.CreateXmlDeclaration("1.0", "UTF-8", "");
            XmlDoc.AppendChild(XmlDeclar);

            XmlRoot = XmlDoc.CreateElement("tree");
            XmlAttrib = XmlDoc.CreateAttribute("id");
            XmlAttrib.Value = "0";

            XmlRoot.Attributes.Append(XmlAttrib);

            int[] Titles = new int[256];
            //     int j = 0;

            /*if (Index == 0)
            {
                for (int i = 0; i < ScreenInfo.BusiPortalInfo.Length; i++)
                {
                    if (CanAccessMenu(ScreenInfo.BusiPortalInfo[i].MenuItemOID))
                    {
                        break;
                    }
                    Index++;
                }
            }*/
            if (Index >= ScreenInfo.BusiPortalInfo.Length)
            { return null; }

            UCMLMenuItem[] items = (UCMLMenuItem[])ScreenInfo.BusiPortalInfo[Index].MenuItem.ToArray(typeof(UCMLMenuItem));

            BuildRightChildTree(items, "00000000-0000-0000-0000-000000000000", XmlRoot, XmlDoc);
            XmlDoc.AppendChild(XmlRoot);
            return XmlDoc;
        }


        public void BuildRightChildTree(UCMLMenuItem[] items, string ParentOID, XmlNode ParentNode, XmlDocument XmlDoc)
        {
            XmlAttribute ItemText, ItemID, ItemImage, ItemHotImage, ItemSelectImage, ItemURL, ItemIsUseMobile;
            XmlNode ChildNode;
            string nodeMenuStr = string.Empty;
            for (int n = 0; n < items.Length; n++)
            {
                string s1;

                s1 = items[n].ParentOID.ToString();

                //此处固定的两级
                if (s1 == ParentOID)
                {
                    ChildNode = XmlDoc.CreateNode(XmlNodeType.Element, "item", "");
                    ItemText = XmlDoc.CreateAttribute("text");   //节点显示
                    ItemID = XmlDoc.CreateAttribute("OID");     //节点ID号
                    ItemImage = XmlDoc.CreateAttribute("im0");    //节点显示图像
                    ItemHotImage = XmlDoc.CreateAttribute("im1");    //节点选择图像
                    ItemSelectImage = XmlDoc.CreateAttribute("im2");    //节点展开图像
                    ItemURL = XmlDoc.CreateAttribute("url");    //节点调用页面URL
                    ItemIsUseMobile = XmlDoc.CreateAttribute("IsUseMobile");    //是否手机版
                    string url = "";
                    switch (items[n].LinkBusiType)
                    {
                        case 0:
                            if (items[n].BPOID != String.Empty)
                            {
                                url = items[n].LocalPath != String.Empty ? items[n].LocalPath + "/" + items[n].BPOID : items[n].BPOID;
                                url = items[n].Param == null || items[n].Param == "" ? url + ".aspx" : url + ".aspx?" + items[n].Param;
                            }
                            break;
                        default:

                            if (items[n].PageLinkUrl.IndexOf("www") != -1 || items[n].PageLinkUrl.IndexOf(@"http://") != -1)
                            {
                                url = items[n].Param == null || items[n].Param == "" ? items[n].PageLinkUrl : items[n].PageLinkUrl + "?" + items[n].Param;
                            }
                            else
                            {
                                url = items[n].Param == null || items[n].Param == "" ? items[n].PageLinkUrl : items[n].PageLinkUrl + "?" + items[n].Param;

                            }
                            break;
                    }

                    ItemText.Value = items[n].BPOName;
                    ItemID.Value = items[n].OID.ToString();
                    ItemImage.Value = items[n].ImageLink;
                    ItemHotImage.Value = items[n].ImageLink;
                    ItemSelectImage.Value = items[n].ImageLink;
                    ItemURL.Value = url;
                    bool IsUseMobile = items[n].IsUseMobile;
                    ItemIsUseMobile.Value = IsUseMobile.ToString();

                    ChildNode.Attributes.Append(ItemText);
                    ChildNode.Attributes.Append(ItemID);
                    ChildNode.Attributes.Append(ItemImage);
                    ChildNode.Attributes.Append(ItemHotImage);
                    ChildNode.Attributes.Append(ItemSelectImage);
                    ChildNode.Attributes.Append(ItemURL);
                    ChildNode.Attributes.Append(ItemIsUseMobile);

                    ParentNode.AppendChild(ChildNode);
                    BuildRightChildTree(items, items[n].OID.ToString(), ChildNode, XmlDoc);
                }
            }


        }

        /// <summary>
        /// 判断当前用户是否有访问菜单
        /// </summary>
        /// <param name="BPOID"></param>
        /// <returns></returns>
        public bool CanAccessMenu(Object MenuItemOID)
        {
            if (loginuser == null) return false;
            if (loginuser.UserOID.ToString() == "00000000-0000-0000-0000-000000000001" ||
                loginuser.MasterPostOID.ToString() == "00000000-0000-0000-0000-000000000001")
            {
                return true;
            }
            for (int m = 0; m < loginuser.PurviewArray.Length; m++)
            {
                //权限支持
                if (loginuser.PurviewArray[m] != null && loginuser.PurviewArray[m].MenuItemOID.ToString() == MenuItemOID.ToString())
                {
                    return true;
                }
            }
            return false;
        }

        public virtual void GetSysRetrievalTime()
        {
            DataTable dt = null;
            string sql = "select NewMessageRetrievalTime,SysOnlineUserRetrievalTime from CMS_MessageSetTime ";
            SysDBModel.CMS_MessageSetTime cmstobj = new SysDBModel.CMS_MessageSetTime();//获取系统检索时间
            dt = cmstobj.ExecuteQuery(sql);
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                this.NMRT.Value = dt.Rows[i]["NewMessageRetrievalTime"].ToString();
                this.SOURT.Value = dt.Rows[i]["SysOnlineUserRetrievalTime"].ToString();
            }
            if (this.NMRT.Value == "") this.NMRT.Value = "5";
            if (this.SOURT.Value == "") this.SOURT.Value = "5";
        }

        public string GetMyLocation()
        {
            string myLocation = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                myLocation = LoadResString("MyLocation");
            }
            else
            {
                myLocation = "我的位置：";
            }
            return myLocation;
        }

        public string ClickToHideTop()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("ClickToHideTop");
            }
            else
            {
                result = "点击收缩顶部信息";
            }
            return result;
        }

        public string ClickToHideLeft()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("ClickToHideLeft");
            }
            else
            {
                result = "单击隐藏左侧菜单栏";
            }
            return result;
        }

        public string ClickToShowLeft()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("ClickToShowLeft");
            }
            else
            {
                result = "单击显示左侧菜单栏";
            }
            return result;
        }

        public string ShowAll()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("ShowAll");
            }
            else
            {
                result = "全部显示";
            }
            return result;
        }

        public string IM()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("IM");
            }
            else
            {
                result = "即时通讯工具";
            }
            return result;
        }

        public string SelectPortal()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("SelectPortal");
            }
            else
            {
                result = "弹出门户选择";
            }
            return result;
        }

        public string SkinSwitching()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("SkinSwitching");
            }
            else
            {
                result = "皮肤切换";
            }
            return result;
        }

        public string UnreadMessages()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("UnreadMessages");
            }
            else
            {
                result = "未读消息";
            }
            return result;
        }

        public string OnlineChat()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("OnlineChat");
            }
            else
            {
                result = "在线聊天";
            }
            return result;
        }

        public string SelectUser()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("SelectUser");
            }
            else
            {
                result = "选人";
            }
            return result;
        }

        public string ClickToHide()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("ClickToHide");
            }
            else
            {
                result = "点击收缩";
            }
            return result;
        }

        public string Group()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("Group");
            }
            else
            {
                result = "群组";
            }
            return result;
        }

        public string CloseAll()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("CloseAll");
            }
            else
            {
                result = "关闭所有";
            }
            return result;
        }

        public string Taskbar()
        {
            string result = "";
            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                result = LoadResString("Taskbar");
            }
            else
            {
                result = "系统任务栏已经超过30个不能再继续添加,可以关闭其他任务栏窗口";
            }
            return result;
        }

    }
}
