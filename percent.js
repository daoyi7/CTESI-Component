var BusinessObject = new UCML.BusinessUnit();
BusinessObject.BPOName = "BPO_DashboardList";
BusinessObject.fitWindow =true;
var ShortCutKeyList = [];
var VC_Echarts;
var VC_EchartsColumns;
var VC_WBSGridTree;
var VC_WBSGridTreeColumns;
var BC_WBSGridBase;
var BC_WBSGridColumns;
function onInit()
{
    BC_WBSGridBase = new UCML.BusinessComponent();
    BC_WBSGridBase.BusinessObject = BusinessObject;
    BC_WBSGridBase.TableName = "WBS";
    BC_WBSGridBase.BCName = "BC_WBSGrid";
    BC_WBSGridBase.fIDENTITYKey = false;
    BC_WBSGridBase.AllowModifyJION = false;
    BC_WBSGridBase.fHaveUCMLKey = true;
    BC_WBSGridBase.PrimaryKey = "WBSOID";
    BC_WBSGridBase.loaded = false;
    BC_WBSGridBase.columns = BC_WBSGridColumns;
    BC_WBSGridBase.BPOName = "BPO_DashboardList";
    BC_WBSGridBase.ChangeOnlyOwnerBy = false;
    BC_WBSGridBase.EnabledEdit=false;
    BC_WBSGridBase.EnabledAppend=false;
    BC_WBSGridBase.EnabledDelete=false;
    BC_WBSGridBase.RecordOwnerType=0;
    BC_WBSGridBase.open();

    VC_Echarts = new UCML.BPOLink("VC_Echarts");
    VC_Echarts.UserDefineHTML = true;
    VC_Echarts.BusinessObject = BusinessObject;
    VC_Echarts.HiddenID="";
    VC_Echarts.fHidden="false";
    VC_Echarts.alignHeight=true;
    VC_Echarts.alignWidth=false;
    VC_Echarts.IsJQMPage=false;
    VC_Echarts.JQMPageTheme="";


    VC_Echarts.open();
    VC_WBSGridTree = new UCML.TreeGrid("VC_WBSGridTree");
    VC_WBSGridTree.BusinessObject = BusinessObject;
    VC_WBSGridTree.dataTable = BC_WBSGridBase;
    VC_WBSGridTree.columns = VC_WBSGridTreeColumns;
    VC_WBSGridTree.enabledEdit=true;
    VC_WBSGridTree.haveMenu=true;
    VC_WBSGridTree.parentNodeID="";
    VC_WBSGridTree.fTreeGrid="true";
    VC_WBSGridTree.ifDynamicCreateTree="false";
    VC_WBSGridTree.HiddenID="";
    VC_WBSGridTree.fHidden="false";
    VC_WBSGridTree.alignHeight="true";
    VC_WBSGridTree.alignWidth="false";
    VC_WBSGridTree.ParentFieldName="WBS_FK";
    VC_WBSGridTree.haveMenu=false;
    VC_WBSGridTree.getColumn("StartUpStatus").beforeCellrender=function () {
        var StartUpStatus =  VC_WBSGridTree.dataTable.getFieldValue("StartUpStatus");
        if(StartUpStatus == "已开工"){
            return {style:"background:#30b572;color:#fff;"};
        }
        if(StartUpStatus == "未开工"){
            return {style:"background:#ff4c2d;color:#fff;"};
        }
    };

    VC_WBSGridTree.getColumn("QualityStatus").beforeCellrender=function () {
        var QualityStatus =  VC_WBSGridTree.dataTable.getFieldValue("QualityStatus");
        if(QualityStatus == "有"){
            return {style:"background:#27b6ef;color:#fff;"};
        }
        if(QualityStatus == "无"){
            return {style:"background:#e46090;color:#fff;"};
        }
    };

    VC_WBSGridTree.getColumn("SecurityInformation").beforeCellrender=function () {
        var SecurityInformation =  VC_WBSGridTree.dataTable.getFieldValue("SecurityInformation");
        if(SecurityInformation == "有"){
            return {style:"background:#00BCD4;color:#fff;"};
        }
        if(SecurityInformation == "无"){
            return {style:"background:rgba(245, 5, 3, 0.68);color:#fff;"};
        }
    };

    VC_WBSGridTree.getColumn("AcceptancePhase").beforeCellrender=function () {
        var AcceptancePhase =  VC_WBSGridTree.dataTable.getFieldValue("AcceptancePhase");
        if(AcceptancePhase == "已验收"){
            return {style:"background:#42da8e;color:#fff;"};
        }
        if(AcceptancePhase == "未验收"){
            return {style:"background:#ef4a4a;color:#fff;"};
        }
        if(AcceptancePhase == "验收中"){
            return {style:"background:#ffaa0e;color:#fff;"};
        }
    };

    VC_WBSGridTree.getColumn("PaymentStatus").beforeCellrender=function () {
        var PaymentStatus =  VC_WBSGridTree.dataTable.getFieldValue("PaymentStatus");
        if(PaymentStatus == "已支付"){
            return {style:"background:#50d8c0;color:#fff;"};
        }
        if(PaymentStatus == "未支付"){
            return {style:"background:#ff732d;color:#fff;"};
        }
        if(PaymentStatus == "支付中"){
            return {style:"background:#45a0f1;color:#fff;"};
        }
    };

    VC_WBSGridTree.getColumn("QualityStatus").beforeCellrender=function () {
        var QualityStatus =  VC_WBSGridTree.dataTable.getFieldValue("QualityStatus");
        if(QualityStatus == "未申请"){
            return {style:"background:#f99969;color:#fff;"};
        }
        if(QualityStatus == "已通过"){
            return {style:"background:#45a0f1;color:#fff;"};
        }
        if(QualityStatus == "未审核"){
            return {style:"background:#d46154;color:#fff;"};
        }
        if(QualityStatus == "审核中"){
            return {style:"background:#47f1a3;color:#fff;"};
        }
        if(QualityStatus == "未通过"){
            return {style:"background:#47f1a3;color:#fff;"};
        }
    };
    VC_WBSGridTree.getColumn("EngineeringCost").beforeCellrender=function () {
        var EngineeringCost =  VC_WBSGridTree.dataTable.getFieldValue("EngineeringCost");
        if(EngineeringCost > 0){
            return {style:"background:#50d8f0;color:#fff;"};
        }

    };
    VC_WBSGridTree.getColumn("ChargesPaid").beforeCellrender=function () {
        var ChargesPaid =  VC_WBSGridTree.dataTable.getFieldValue("ChargesPaid");
        if(ChargesPaid > 0){


            return {style:"background:#50f8f0;color:#fff;"};

        }

    };

    VC_WBSGridTree.haveScroll = true;
    VC_WBSGridTree.expandDepth = -1;

    VC_WBSGridTree.open();
}
function VC_WBSGridTreeExtMenuClick(cmd)
{
}

function VC_WBSGridTreemenuready()
{
}
function InitCustomInput()
{
}
function onRender()
{
    window.TabStrip_Level_1 = new UCML.TabPanel({el:$("#TabStrip_Level_1"), alignWidth: false, alignHeight: true });
    window.ToolBarVC_WBSGridTree = new UCML.ToolBar("VC_WBSGridTreeToolBar_Module");
    ToolBarVC_WBSGridTree.addButton({id : "Btn_23377",
        text : "提交",
        tooltip : "",
        iconPos : "left",
        isMobile : false,
        onClick : function(el,e){
            BusinessSubmit();

        }
    });
    ToolBarVC_WBSGridTree.addSeparator({id : "Btn_23378"});

}
function onBeforeOpen()
{


}
function BusinessInit()
{
//UCML说明,类型:VC,对象ID:19025,方法类型:事件,方法名:OnJsInit,对象名称:VC_Echarts
    VC_Echarts.setBusinessObjectURL("KPI/kpi.html") ;

//UCML说明结束
//UCML说明,类型:VC,对象ID:13914,方法类型:事件,方法名:OnJsInit,对象名称:VC_WBSGridTree
    var ctesiTr = VC_WBSGridTree.el.find(".datagrid-body").eq(1).children().children().children(),
        trLen = ctesiTr.length;

    for (var i = 1; i < trLen; i++) {
        var ctesiTd = ctesiTr.eq(i).children(),
            tdLen = ctesiTd.length;

        var OB = ctesiTd.eq(tdLen - 1).find(".datagrid-cell.datagrid-cell-nowrap");

        var percent = OB.text();

        var tdHTML = '<div class="td-num">'+percent+'</div><div class="td-item"></div>'

        // OB.empty();
        OB.append(tdHTML)

        var itemWidth = OB.width()*(percent/100)

        OB.find(".td-item").css("width",itemWidth+"px")
        if((percent/100)>0.5) {
            OB.find(".td-num").css("color","#fff")
        }
    }

//UCML说明结束
//UCML说明,类型:BPO,对象ID:16400,方法类型:事件,方法名:OnJsInit,对象名称:BPO_DashboardList

//UCML说明结束
//UCML说明,类型:BC,对象ID:15181,方法类型:事件,方法名:OnJsInit,对象名称:BC_WBSGrid

//UCML说明结束
}

function BeforeSubmit()
{




    return true
}


function AfterSubmit()
{



    VC_WBSGridTree.on('cellcontextmenu',function () {
        console.log(111)
    })

}

function CanSubmit()
{
    var result=true
    for ( var i=0;i<this.UseTableList.length;i++)
    {
        result = this.UseTableList[i].Valiate();
        if (result==false) break;
    }


    return result;
}

function BC_WBSGridOnFieldChange(e)
{
}


function PrepareColumn()
{
    BC_WBSGridColumns = new Array();
    objColumn = new Object();
    objColumn.fieldName = "WBSOID";
    objColumn.caption = "主键 ";
    objColumn.length = 0;
    objColumn.decLength = 0;
    objColumn.fieldType = "UCMLKey";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = false;
    objColumn.defaultValue = "";
    objColumn.allowModify = false;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "Name";
    objColumn.caption = "任务名称 ";
    objColumn.length = 200;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "Start";
    objColumn.caption = "开始日期 ";
    objColumn.length = 0;
    objColumn.decLength = 0;
    objColumn.fieldType = "Date";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "Finish";
    objColumn.caption = "完成日期 ";
    objColumn.length = 0;
    objColumn.decLength = 0;
    objColumn.fieldType = "Date";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "ContractAmount";
    objColumn.caption = "合同额 ";
    objColumn.length = 0;
    objColumn.decLength = 0;
    objColumn.fieldType = "Long";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "ContractInformation";
    objColumn.caption = "合同信息 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "BudgetInformation";
    objColumn.caption = "预算信息 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "StartUpStatus";
    objColumn.caption = "开工状态 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "QualityStatus";
    objColumn.caption = "质量状态 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "SecurityInformation";
    objColumn.caption = "安全信息 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "AcceptancePhase";
    objColumn.caption = "验收状态 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "PaymentStatus";
    objColumn.caption = "支付状态 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "EngineeringCost";
    objColumn.caption = "工程费用 ";
    objColumn.length = 0;
    objColumn.decLength = 0;
    objColumn.fieldType = "Long";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "ChargesPaid";
    objColumn.caption = "已付费用 ";
    objColumn.length = 0;
    objColumn.decLength = 0;
    objColumn.fieldType = "Long";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "Percentage";
    objColumn.caption = "完成百分比 ";
    objColumn.length = 0;
    objColumn.decLength = 0;
    objColumn.fieldType = "Int";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "ContractQuantity";
    objColumn.caption = "合同工程量 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "ChangeQuantity";
    objColumn.caption = "变更工程量 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "TotalQuantity";
    objColumn.caption = "总工程量 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "MeasuredQuantities";
    objColumn.caption = "已计量工程量 ";
    objColumn.length = 50;
    objColumn.decLength = 0;
    objColumn.fieldType = "VarChar";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "";
    objColumn.lookupDataSet = "";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = false;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "WBS_FK";
    objColumn.caption = "WBS信息表外键 ";
    objColumn.length = 0;
    objColumn.decLength = 0;
    objColumn.fieldType = "UCMLKey";
    objColumn.codeTable = "";
    objColumn.isCodeTable = false;
    objColumn.allowNull = true;
    objColumn.defaultValue = "";
    objColumn.allowModify = true;
    objColumn.foreignKeyField = "";
    objColumn.lookupKeyField = "WBSOID";
    objColumn.lookupDataSet = "WBS";
    objColumn.lookupResultField = "";
    objColumn.isForeignKey = true;
    objColumn.fieldKind = 0;
    objColumn.isMultiValueField = false;
    objColumn.multiValueTable = "";
    objColumn.isFunctionInitValue = false;
    objColumn.initValueFunc = "";
    objColumn.excelColNo = 0;
    objColumn.IsImageBase64Data = false;
    objColumn.QueryRefColumn = "";
    objColumn.dateTimeFormat = "";
    BC_WBSGridColumns[BC_WBSGridColumns.length] = objColumn;

    VC_EchartsColumns = new Array();
    ResetColumns(VC_EchartsColumns, "VC_Echarts");
    VC_WBSGridTreeColumns = new Array();
    objColumn = new Object();
    objColumn.fieldName = "Name";
    objColumn.caption = "任务名称 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 280;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.fixedColumn  = true;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "Start";
    objColumn.caption = "开始日期 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 140;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.DateBox";
    objColumn.mutiValueCol = false;
    objColumn.fixedColumn  = true;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "Finish";
    objColumn.caption = "完成日期 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 140;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.DateBox";
    objColumn.mutiValueCol = false;
    objColumn.fixedColumn  = true;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "ContractAmount";
    objColumn.caption = "合同额 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "right";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.fixedColumn  = true;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "ContractInformation";
    objColumn.caption = "合同信息 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "BudgetInformation";
    objColumn.caption = "预算信息 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "StartUpStatus";
    objColumn.caption = "开工状态 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "QualityStatus";
    objColumn.caption = "质量状态 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "SecurityInformation";
    objColumn.caption = "安全信息 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "AcceptancePhase";
    objColumn.caption = "验收状态 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "ContractQuantity";
    objColumn.caption = "合同工程量 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "ChangeQuantity";
    objColumn.caption = "变更工程量 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "TotalQuantity";
    objColumn.caption = "总工程量 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "MeasuredQuantities";
    objColumn.caption = "已计量工程量 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "PaymentStatus";
    objColumn.caption = "支付状态 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "EngineeringCost";
    objColumn.caption = "工程费用 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "ChargesPaid";
    objColumn.caption = "已付费用 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    objColumn = new Object();
    objColumn.fieldName = "Percentage";
    objColumn.caption = "完成百分比 ";
    objColumn.display = true;
    objColumn.allowModify = true;
    objColumn.width = 105;
    objColumn.isFixColumnValue = false;
    objColumn.fixColumnValue = "";
    objColumn.isCustomerControl = false;
    objColumn.align = "left";
    objColumn.customerControl = "";
    objColumn.controlID = "";
    objColumn.editContrl = "";
    objColumn.PromptText = "";
    objColumn.EditType = "UCML.TextBox";
    objColumn.mutiValueCol = false;
    objColumn.inputTip = "";
    VC_WBSGridTreeColumns[VC_WBSGridTreeColumns.length] = objColumn;

    ResetColumns(VC_WBSGridTreeColumns, "VC_WBSGridTree");
    PrepareExColumn();
}
