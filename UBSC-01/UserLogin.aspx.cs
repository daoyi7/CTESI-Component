using System;
using System.Collections.Generic;
using System.Web;
using System.Web.UI;
using System.Web.UI.WebControls;
using UCML.SkinFrame;
using UCMLCommon;
using System.Data;

namespace UCML.UBSC
{
    public partial class UserLogin : UCMLCommon.UserLoginPage
    {

        public override void InitControls()
        {
            base.InitControls();

            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                language.Visible = true;

                
                /*
                HttpCookie Language = Response.Cookies.Get("ucml_Language");
                if (Language != null && Language.Value != null && Language.Value != "")
                {
                    hidfLanguage.Value = Language.Value;
                }
                else
                {
                    hidfLanguage.Value = "1";
                }*/

            }
			//if (UCMLCommon.UCMLInitEnv.fSelectUserPost == true)
            //{
			//    ddlPost.Visible = false;
			//}
        }

        protected override void OnInit(EventArgs e)
        {


            ScreenName = "UBSC_Frame";

            base.OnInit(e);
            InitControls();
            
        }

        protected void Page_Load(object sender, EventArgs e)
        {
            if (!IsPostBack)
            {
                string logout = this.Request.QueryString["logout"];
                if (logout == "true")
                {
                    UserLoginService busiObj = new UserLoginService();
                    busiObj.Logout();
                    busiObj.ClearCacheUser();
                }

                DBLayer.PasswordSafe pwdSafeObj = new DBLayer.PasswordSafe();
                //安全策略配置数据表
                DBLayer.PasswordSafeInfo[] pwdArr;
                pwdArr = pwdSafeObj.FindPwdSafe();
                ViewState["PasswordSafe"] = pwdArr;
                //安全策略表中配置是否显示验证码
                if (pwdArr.Length > 0) {
                    if (pwdArr[0].fVerificationCode == true) {
                        spanValidateCode.Visible = true;
                    }
                }
            }
        }

        protected void btnLogin_Click(object sender, EventArgs e)
        {
            UCMLCommon.UserLoginService uls = new UCMLCommon.UserLoginService();

            if (UCMLCommon.UCMLInitEnv.fMutiLangugeSupport == true)
            {
                uls.langugeKind = hidfLanguage.Value;
                HttpCookie Language = Response.Cookies.Get("ucml_Language");
                if (Language != null)
                {

                    Language = new HttpCookie("ucml_Language");
                    Language.Expires = DateTime.Now.AddYears(10);
                    Language.Value = hidfLanguage.Value;
                    //    Response.Cookies.Set(Language);
                    Response.Cookies.Remove("ucml_Language");
                    Response.Cookies.Add(Language);
                }
                else
                {
                    Language = new HttpCookie("ucml_Language");
                    Language.Value = hidfLanguage.Value;
                    Language.Expires = DateTime.Now.AddYears(10);
                    Response.Cookies.Add(Language);
                }
            }

            if (string.IsNullOrEmpty(txtUserName.Text.Trim()))
            {
                this.Page.ClientScript.RegisterStartupScript(this.Page.GetType(), "password", "<script type=\"text/javascript\">alert('用户名不能为空，请输入用户名');</script>");
                return;
            }
            //安全策略配置数据表
            DBLayer.PasswordSafeInfo[] pwdArr;
            pwdArr = (DBLayer.PasswordSafeInfo[])ViewState["PasswordSafe"];
            string vCode = string.Empty;
            //安全策略表中配置是否显示验证码
            if (pwdArr.Length > 0) {
                if (pwdArr[0].fVerificationCode == true) {
                    vCode = Session["CheckCode"].ToString();
                    if (txtValidateCode.Text.Trim().ToUpper() != vCode.ToUpper()) {
                        this.Page.ClientScript.RegisterStartupScript(this.Page.GetType(),"password","<script type=\"text/javascript\">alert('验证码错误!');</script>");
                        return;
                    }
                }
            }
            #region 安全策略验证
            int inputTimes = 0;
            //如果启动安全策略则进行业务逻辑判断
            if (pwdArr.Length > 0 && pwdArr[0].fSecurityPolicy == true) {
                if (pwdArr[0].InputPwdTimes != null)
                    inputTimes = Convert.ToInt32(pwdArr[0].InputPwdTimes);

                if (inputTimes > 0 && inputTimes <= Convert.ToInt32(Session[txtUserName.Text.Trim() + "ClickTimes"])) {
                    this.Page.ClientScript.RegisterStartupScript(this.Page.GetType(),"password","<script type=\"text/javascript\">alert('密码输入次数已超过上限!');</script>");
                    return;
                }

                //保存点击登录次数，成功登录清零，否则加1
                if (Convert.ToInt32(Session[txtUserName.Text.Trim() + "ClickTimes"]) > 0)
                    Session[txtUserName.Text.Trim() + "ClickTimes"] = Convert.ToInt32(Session[txtUserName.Text.Trim() + "ClickTimes"]) + 1;
                else
                    Session[txtUserName.Text.Trim() + "ClickTimes"] = 1;
            }

            #endregion
            if (ddlPost.Visible == true) {
                if (txtUserName.Text.Trim() != "ADMIN") {
                    if (hidPost.Value == "-1") {
                        this.Page.ClientScript.RegisterStartupScript(this.Page.GetType(),"userpost","<script type=\"text/javascript\">alert('请选择用户岗位.');</script>");
                        return;
                    }
                    string UCMLPostOID = hidPost.Value;
                    //设置主岗位
                    SetMasterPost(UCMLPostOID,txtUserName.Text.Trim());
                }
            }
            try {
                ////验证用户是否登录
                if (uls.userLogin(txtUserName.Text.Trim(),txtPassword.Text.Trim()).Split(',')[0] == "1") {
                    Session[txtUserName.Text.Trim() + "ClickTimes"] = 0;
                    /*
                    //登录用户对象
                    UCML.SSO.IUser user = new UCML.SSO.User();
                    //登录用户名
                    user.UserId = txtUserName.Text.Trim();
                    //登录密码
                    user.Pwd = txtPassword.Text.Trim();

                    //在单点系统中保存用户登录票据
                    server.SaveToken(user);
                    //跳转到登录的站点系统主页
                    server.Reply(user.UserId, defaultJumpUrl);
                    */
                    //在单点系统中保存用户登录票据
                        Response.Redirect("Home.aspx");
                }
                else {
                    string msg = "用户名不存在或密码错误,请重新登录！";
                    if (inputTimes > 0) {
                        msg += string.Format("共有{0}次机会.",inputTimes);
                    }
                    this.Page.ClientScript.RegisterStartupScript(this.Page.GetType(),"password",
                        string.Format("<script type=\"text/javascript\">alert('{0}');</script>",msg));
                }
            }
            catch (Exception ex)
            {
                Response.Write("<script type=\"text/javascript\">alert('登录失败:" + ex.Message + "');</script>");
            }
        }
        public void SetMasterPost(string UCMLPostOID, string USR_LOGIN)
        {
            string UCMLContactOID = string.Empty;
            SysDBModel.UCML_User objUser = new SysDBModel.UCML_User();
            SysDBModel.UCML_UserInfo[] objInfoUser = objUser.FindUser(USR_LOGIN);
            if (objInfoUser.Length > 0)
            {
                UCMLContactOID = objInfoUser[0].UCML_CONTACTOID.ToString();
            }
            else { return; }

            SysDBModel.UCML_POSTN_PER_MAP obj = new SysDBModel.UCML_POSTN_PER_MAP();
            SysDBModel.UCML_POSTN_PER_MAPInfo[] objInfos = obj.getUserAllPostn(UCMLContactOID);
            for (int i = 0; i < objInfos.Length; i++)
            {
                if (objInfos[i].UCML_PostOID.ToString() == UCMLPostOID)
                {
                    obj.SetFieldValue("fIsMasterPost", objInfos[i].UCML_POSTN_PER_MAPOID.ToString(), true);
                }
                else
                {
                    if (objInfos[i].fIsMasterPost == true)
                    {
                        obj.SetFieldValue("fIsMasterPost", objInfos[i].UCML_POSTN_PER_MAPOID.ToString(), false);
                    }
                }
            }
        }

    }
}
