﻿/*
 Copyright (c) 2003-2015, CKSource - Frederico Knabben. All rights reserved.
 For licensing, see LICENSE.md or http://ce1.com/license
*/
ce1.dialog.add("about",function(a){var a=a.lang.about,b=ce1.getUrl(ce1.plugins.get("about").path+"dialogs/"+(ce1.env.hidpi?"hidpi/":"")+"logo_ce1.png");return{title:ce1.env.ie?a.dlgTitle:a.title,minWidth:390,minHeight:230,contents:[{id:"tab1",label:"",title:"",expand:!0,padding:0,elements:[{type:"html",html:'<style type="text/css">.cke_about_container{color:#000 !important;padding:10px 10px 0;margin-top:5px}.cke_about_container p{margin: 0 0 10px;}.cke_about_container .cke_about_logo{height:81px;background-color:#fff;background-image:url('+
b+");"+(ce1.env.hidpi?"background-size:163px 58px;":"")+'background-position:center; background-repeat:no-repeat;margin-bottom:10px;}.cke_about_container a{cursor:pointer !important;color:#00B2CE !important;text-decoration:underline !important;}</style><div class="cke_about_container"><div class="cke_about_logo"></div><p>CKEditor '+ce1.version+" (revision "+ce1.revision+')<br><a target="_blank" href="http://ce1.com/">http://ce1.com</a></p><p>'+a.help.replace("$1",'<a target="_blank" href="http://docs.ce1.com/user">'+
a.userGuide+"</a>")+"</p><p>"+a.moreInfo+'<br><a target="_blank" href="http://ce1.com/about/license">http://ce1.com/about/license</a></p><p>'+a.copy.replace("$1",'<a target="_blank" href="http://cksource.com/">CKSource</a> - Frederico Knabben')+"</p></div>"}]}],buttons:[ce1.dialog.cancelButton]}});