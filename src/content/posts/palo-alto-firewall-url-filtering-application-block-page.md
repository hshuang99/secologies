---
title: "Palo Alto 防火牆URL過濾與應用服務頁面封鎖功能"
date: 2024-04-25
description: 在Palo Alto防火牆要兩項功能一個是Application Block Page另外一個是URL Filtering and Category Match Block Page到Device→Response Pages找到Application Block Page可以使用
hideTOC: false
targetKeyword: Palo Alto 防火牆
draft: false
tags: 
  - "palo-alto"
  - "url過濾"
  - "應用程式封鎖"
  - "防火牆"
lang: zh
---
本篇文章將介紹Palo Alto防火牆針對封鎖URL以及第七層應用程式的限制功能，以下是主要的兩種功能：

1. Application Block Page
2. URL Filtering and Category Match Block Page

到Device→Response Pages找到Application Block Page，要確保是啟用的狀態

![URLFEnable](https://media.secologies.com/URLFEnable.webp)

點選Application Block Page匯出預設的block頁面程式

![URLFPredefined](https://media.secologies.com/URLFPredefined.webp)

匯出之後是一個txt的html檔案，可以編輯這個Block Page的html

```
<!DOCTYPE html>

<html lang="en">
<head>
    <base href="/login/">
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=.85">
    <meta http-equiv="pragma" content="no-cache">
    <title>Application Blocked</title>
    <link rel="stylesheet" href="css/latofonts.css">
    <style>
        body {
            background-color: #e8ebeb;
            font-family: Lato, 'Helvetica Neue', Helvetica, Arial, sans-serif;
            font-size: 16px;
            margin: 0;
            color: #070808;
        }

        a:link {
            color: #0993d1;
        }

        b,
        strong {
            font-weight: 500;
        }

        p {
            line-height: 1.2em;
        }

        button {
            overflow: visible;
        }

        button, input, optgroup, select, textarea {
            color: inherit;
            font: inherit;
            margin: 0;
        }

        .center {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
        }

        #dError,
        .msg {
            color: #d94949;
            margin: 20px 0;
        }

        fieldset .msg {
            margin: 0;
        }

        #content {
            padding-top: 100px;
        }

        #content img {
            display: block;
            margin: auto;
        }

        #content h1 {
            font-style: normal;
            font-weight: normal;
            font-size: 36px;
            line-height: 43px;
            text-align: center;
            letter-spacing: 0.1px;
            color: #070808;
            margin: 10px auto 8px;
        }

        #content > p {
            text-align: center;
            margin-left: auto;
            margin-right: auto;
            width: 640px;
            font-size: 14px;
            line-height: 20px;
        }

        .response {
            background-color: #fff;
            color: #5a636b;
            margin: 24px auto 0;
            padding: 20px;
            font-size: 16px;
            width: 800px;
            border: 1px solid #c8cbce;
            box-sizing: border-box;
            border-radius: 8px;
        }

        .response p {
            margin: 0 0 1em;
        }

        .response p:last-child {
            margin: 0;
        }

        .response b {
            color: #070808;
        }

        .response .msg b {
            color: #d94949;
        }

        .response form td,
        .response form input {
            font-size: 1.1em;
            font-weight: bold;
        }

        .loading {
            margin: 2em auto 1em;
        }
    </style>
</head>

<body>
<div id="content" class="container">
    <img src="data:image/png;base64,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" alt="Error">
    <h1>Against Acceptable Use Policy</h1>
    <div class="response">
        <p>The application you are trying to use has been blocked in accordance with company policy. Please contact your system administrator if you believe this is an error.</p>
	<img src="https://i.kym-cdn.com/entries/icons/original/000/002/144/You_Shall_Not_Pass!_0-1_screenshot.jpg" alt="blockImage" style="width:700px;height:600px;">
        <p><b>User:</b> <user/></p>
        <p><b>Application:</b> <appname/></p>
    </div>
</div>
</body>
</html>
```

最後我改成這樣

![URLFPreview](https://media.secologies.com/URLFPreview.webp)

然後再放回PA的Block Page，點選Application Block Page→Import

![URLFImport](https://media.secologies.com/URLFImport.webp)

之後這條就可以選擇你放進去的Block Page

![URLFImportFinish](https://media.secologies.com/URLFImportFinish.webp)

然後URL Filtering and Category Match Block Page也做一樣的事情

![WebPageBlock](https://media.secologies.com/WebPageBlock.webp)

## Application Block Policy

到Policy→Security的頁面新增Block Policy，可以指定特定的，我是用any source到any destination，這邊我是用block application，針對facebook的所有功能

![PolicyApplication](https://media.secologies.com/PolicyApplication-1024x380.webp)

URL category就application-default就行

![URLFCategory](https://media.secologies.com/URLFCategory-1024x378.webp)

最後把facebook-base application給Deny掉

![PolicyDeny](https://media.secologies.com/PolicyDeny-1024x340.webp)

設定好之後就OK

## URL Filtering Block Profile

到Objects→Security Profiles→URL Filtering，會有一個default的但不能編輯，所以我們clone default的那組，將其Export出來

![BlockPolicy](https://media.secologies.com/BlockPolicy-1024x368.webp)

然後我們編輯clone出來的profile，我們先把全部的category block掉，按Site Access→Set All Actions→block，就可以全部block掉

![CategoryBlock](https://media.secologies.com/CategoryBlock-1024x488.webp)

好了之後按下OK，之後再回到Policy新增一條針對URL Block的Policy：Policy→Security→Add

![URLFPolicy](https://media.secologies.com/URLFPolicy-1024x154.webp)

Source跟Destination我都先給any，Application除了block的之外都要給他通過

![BlockURLApplication](https://media.secologies.com/BlockURLApplication-1024x389.webp)

URL Category就用application-default的

![URLFCategory](https://media.secologies.com/URLFCategory-1024x378.webp)

而Action的部分除了URL Filtering要block的之外都允許通過，而Profile把URL Filtering的Block Policy放進來

![URLFAction](https://media.secologies.com/URLFAction-1024x438.webp)

好了之後按OK，把Policy的順序調一下，先把Block URL往前調，先block掉url，再block掉特定的application

![URLFPolicy](https://media.secologies.com/URLFPolicy-1024x154.webp)

## Interface management

Network→Interfaces Mgmt

![URLFMGMT](https://media.secologies.com/URLFMGMT-1024x650.webp)

要確定Interface有開Response Pages才能顯示Block Page

![URLFMGMTProfile](https://media.secologies.com/URLFMGMTProfile.webp)

並且確認出去的網卡是該Interface Management的

![URLFInterface](https://media.secologies.com/URLFInterface.webp)

都確認完之後就可以測試

## Policy Test

需要License才能測到Log，Application License過期不能Block，URL Filtering License過期不能Block

![URLLicense](https://media.secologies.com/URLLicense-1024x150.webp)
