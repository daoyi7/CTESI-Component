/**
 * Created by kawhi on 2017/7/15.
 */
procedure GenLeftTopBottom4DBIM;
var
    InnerList,PropertyList : TStringList;
ParentWnd:string;
comp:PComponentNode;
N,flag:Integer;
PaneName,rcPath:string;
begin
InitProperty;
PropertyList := TStringList.Create;
InnerList := TStringList.Create;
ParentWnd := 'MainPanel';
rcPath:=getLocalPath;

HTMLHeadSourceText.Add('<link rel="stylesheet" type="text/css" path="template/layout" name="ucml-layout.css" class="templateSkinCss" />');
HTMLHeadSourceText.Add('<link rel="stylesheet" type="text/css" path="template/layout" name="BIM.css" class="templateSkinCss" />');
HTMLHeadSourceText.Add('<link rel="stylesheet" type="text/css" href="'+rcPath+'template/layout/jquery-ui.css" />');
HTMLHeadSourceText.Add('<script type="text/javascript" src="'+rcPath+'template/template.js"></script>');
HTMLHeadSourceText.Add('<script type="text/javascript" src="'+rcPath+'template/layout/jquery.ui-1.9.2.min.js"></script>');
HTMLHeadSourceText.Add('<script type="text/javascript" src="'+rcPath+'template/layout/jquery.layout-1.3.0.min.js"></script>');
HTMLHeadSourceText.Add('<script type="text/javascript" >');
HTMLHeadSourceText.Add('    function setTemplate()');
HTMLHeadSourceText.Add('    {');
HTMLHeadSourceText.Add('        $("#VC_Panel_1_Wrapper").');
HTMLHeadSourceText.Add('        prepend("<div class=''ucml-layout-pane-title''><div  id=''WestPinBtn'' class=''button-pin''></div><div class=''clear''></div></div>");');
HTMLHeadSourceText.Add('        var wLayout=$("#LayoutContainer").layout({');
HTMLHeadSourceText.Add('           paneClass:"ucml-layout-pane",');
HTMLHeadSourceText.Add('           resizerClass:"ucml-layout-resizer",');
HTMLHeadSourceText.Add('           togglerClass:"ucml-layout-toggler",');
HTMLHeadSourceText.Add('           buttonClass:"ucml-layout-button",');
HTMLHeadSourceText.Add('           togglerLength_open:43,');
HTMLHeadSourceText.Add('           togglerLength_closed:43,');
HTMLHeadSourceText.Add('           resizerTip:"调整大小",');
HTMLHeadSourceText.Add('           togglerTip_open:"关闭",');
HTMLHeadSourceText.Add('           togglerTip_closed:"打开",');
HTMLHeadSourceText.Add('           sliderTip:"滑开",');
HTMLHeadSourceText.Add('           fxName:"slide",');
HTMLHeadSourceText.Add('           fxSpeed_open:350,');
HTMLHeadSourceText.Add('           fxSpeed_close:350,');
HTMLHeadSourceText.Add('           fxSettings_open:{ easing: "linear" },');
HTMLHeadSourceText.Add('           fxSettings_close:{ easing: "linear" },');
HTMLHeadSourceText.Add('           hideTogglerOnSlide:true,');
HTMLHeadSourceText.Add('           slideTrigger_open:"click",');
HTMLHeadSourceText.Add('           spacing_open:8,');
HTMLHeadSourceText.Add('           spacing_closed:8,');
HTMLHeadSourceText.Add('           west__paneSelector:"#VC_Panel_1_Wrapper",');
HTMLHeadSourceText.Add('           west__spacing_closed:20,');
HTMLHeadSourceText.Add('           west__fxSettings_open:{ easing: "linear" },');
HTMLHeadSourceText.Add('           west__togglerAlign_closed:"top",');
HTMLHeadSourceText.Add('           center__paneSelector:"#vPane_Center",');
HTMLHeadSourceText.Add('           west__size:"'+leftSize+'",');
HTMLHeadSourceText.Add('           onresize:function(pane){');
HTMLHeadSourceText.Add('               if(pane=="west"){');
HTMLHeadSourceText.Add('                   $("#VC_Panel_1").triggerHandler("_resize");');
HTMLHeadSourceText.Add('               }');
HTMLHeadSourceText.Add('               else if(pane=="center"){');
HTMLHeadSourceText.Add('                   $("#vPanel_Center").triggerHandler("_resize");');
HTMLHeadSourceText.Add('               }');
HTMLHeadSourceText.Add('         }');
HTMLHeadSourceText.Add('        }).addPinBtn("#WestPinBtn","west");');
if initLeftClosed=true  then
HTMLHeadSourceText.Add('        wLayout.close("west");');

HTMLHeadSourceText.Add('        $("#vPane_Center").layout({');
HTMLHeadSourceText.Add('           paneClass:"ucml-layout-pane",');
HTMLHeadSourceText.Add('           resizerClass:"ucml-layout-resizer",');
HTMLHeadSourceText.Add('           togglerClass:"ucml-layout-toggler",');
HTMLHeadSourceText.Add('           buttonClass:"ucml-layout-button",');
HTMLHeadSourceText.Add('           togglerLength_open:43,');
HTMLHeadSourceText.Add('           togglerLength_closed:43,');
HTMLHeadSourceText.Add('           resizerTip:"调整大小",');
HTMLHeadSourceText.Add('           togglerTip_open:"关闭",');
HTMLHeadSourceText.Add('           togglerTip_closed:"打开",');
HTMLHeadSourceText.Add('           sliderTip:"滑开",');
HTMLHeadSourceText.Add('           fxName:"drop",');
HTMLHeadSourceText.Add('           fxSpeed_open:350,');
HTMLHeadSourceText.Add('           fxSpeed_close:350,');
HTMLHeadSourceText.Add('           fxSettings_open:{ easing: "linear" },');
HTMLHeadSourceText.Add('           fxSettings_close:{ easing: "linear" },');
HTMLHeadSourceText.Add('           hideTogglerOnSlide:true,');
HTMLHeadSourceText.Add('           slideTrigger_open:"click",');
HTMLHeadSourceText.Add('           spacing_open:8,');
HTMLHeadSourceText.Add('           spacing_closed:8,');
HTMLHeadSourceText.Add('           south__paneSelector:"#VC_Panel_3",');
HTMLHeadSourceText.Add('           center__paneSelector:"#VC_Panel_2",');
HTMLHeadSourceText.Add('           south__size:"'+100%-topSize+'",');
HTMLHeadSourceText.Add('           onresize:function(pane){');
HTMLHeadSourceText.Add('               if(pane=="south"){');
HTMLHeadSourceText.Add('                   $("#VC_Panel_2").triggerHandler("_resize");');
HTMLHeadSourceText.Add('               }');
HTMLHeadSourceText.Add('               else if(pane=="center"){');
HTMLHeadSourceText.Add('                   $("#VC_Panel_3").triggerHandler("_resize");');
HTMLHeadSourceText.Add('               }');
HTMLHeadSourceText.Add('         }');
HTMLHeadSourceText.Add('        });');
HTMLHeadSourceText.Add('        $("#VC_Panel_1").bind("_resize",function(){');
HTMLHeadSourceText.Add('           var pHeight=$(this).parent().height();');
HTMLHeadSourceText.Add('           var tHeight=$(this).parent().find(".ucml-layout-pane-title").outerHeight(true);');
HTMLHeadSourceText.Add('           $(this).height(pHeight-tHeight);');
HTMLHeadSourceText.Add('        });');
HTMLHeadSourceText.Add('        $("div[id^=''TabStrip_Level_'']").css("margin-bottom","0px");');
HTMLHeadSourceText.Add('    ');
HTMLHeadSourceText.Add('    ');
HTMLHeadSourceText.Add('    }');
HTMLHeadSourceText.Add('    function beforeRender()');
HTMLHeadSourceText.Add('    {');
HTMLHeadSourceText.Add('        BusinessObject.fitWindow =true;  ');
HTMLHeadSourceText.Add('    }');
HTMLHeadSourceText.Add('</script>');

PropertyList.Clear;
PropertyList.Add('style="width:100%;height:100%;"');
GenerateHtmlForm.InsertCompEx('LayoutContainer','div',ParentWnd,PropertyList,false,false,false,false);

PropertyList.Clear;
PropertyList.Add('style="width:100%;height:100%"');
GenerateHtmlForm.InsertCompEx('VC_Panel_1_Wrapper','div','LayoutContainer',PropertyList,false,false,false,false);

PropertyList.Clear;
PropertyList.Add('style="position: relative;" layout="UCML.Layout"');
GenerateHtmlForm.InsertCompEx('VC_Panel_1','div','VC_Panel_1_Wrapper',PropertyList,false,false,false,false);

PropertyList.Clear;
PropertyList.Add('style="position: relative;"');
GenerateHtmlForm.InsertCompEx('vPane_Center','div','LayoutContainer',PropertyList,false,false,false,false);

PropertyList.Clear;
PropertyList.Add('style="position: relative;" layout="UCML.Layout"');
GenerateHtmlForm.InsertCompEx('VC_Panel_2','div','vPane_Center',PropertyList,false,false,false,false);

PropertyList.Clear;
PropertyList.Add('style="position: relative;" layout="UCML.Layout"');
GenerateHtmlForm.InsertCompEx('VC_Panel_3','div','vPane_Center',PropertyList,false,false,false,false);


flag:=0;
for N:=0 to AllAppletList.Count-1 do
    begin
    PaneName:=GetAppletPane(N);
if PaneName='VC_Panel_1' then
begin
if flag=1 then fUseTabPageGroup:=false;
GenApplet(N,'',false);
flag:=1;
end;
end;

fUseTabPageGroup:=false;
flag:=0;
for N:=0 to AllAppletList.Count-1 do
    begin
    PaneName:=GetAppletPane(N);
if PaneName='VC_Panel_2' then
begin
if flag=1 then fUseTabPageGroup:=true;
GenApplet(N,'',true);
flag:=1;
end;
end;

fUseTabPageGroup:=false;
flag:=0;
for N:=0 to AllAppletList.Count-1 do
    begin
    PaneName:=GetAppletPane(N);
if PaneName='VC_Panel_3' then
begin
if flag=1 then fUseTabPageGroup:=true;
GenApplet(N,'',true);
flag:=1;
end;
end;
end;