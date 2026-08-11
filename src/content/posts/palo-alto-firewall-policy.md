---
title: "Palo Alto 防火牆政策設定"
date: 2023-07-01
description: 對於防火牆很重要的功能之一就是透過policy去控管使用者或外部存取者的連線控制，若使用者有不當的連線行為，也能夠透過防火牆的log查看到紀錄，而存取控管限制使用者不能夠連線哪種類型的網站，或者封鎖特定服務都可以透過policy來做控制
hideTOC: false
targetKeyword: Palo Alto 防火牆
draft: false
tags: 
  - "palo-alto"
  - "封鎖"
  - "政策"
  - "防火牆"
lang: zh
---
## Any Policy

點選到POLICES的頁面

![PolicyPage](https://media.secologies.com/PolicyPage-1024x512.webp)

下方有一個Add的選項可以新增Policy，General是這條Policy的描述

![NewPolicy](https://media.secologies.com/NewPolicy-1024x358.webp)

Source可以直接選擇哪一個Zone當作來源，群組位置可以是單一組IP，也可以是一個Group，Group內也能夠限制是哪些user。

![NewPolicySource](https://media.secologies.com/NewPolicySource-1024x401.webp)

Destination也跟source差不多，選擇source的zone要到哪一組destination的zone。

![NewPolicyDestination](https://media.secologies.com/NewPolicyDestination-1024x394.webp)

而action就可以限制在這些zone裏面哪種類型的http, DNS請求是可以通過的，又或者可以設定哪種類型的請求要拒絕。

![NewPolicyAction](https://media.secologies.com/NewPolicyAction-1024x336.webp)

![CheckYoutube](https://media.secologies.com/CheckYoutube-1024x715.webp)

## 封鎖URL類型

### DNS Policy

在封鎖之前要先出得去DNS找IP然後才block，新增一條可以出去的policy，因為我block的都是web的功能，所以命中要封鎖的網站類別後，其他網站還是得透過DNS去找網站出去。

![DNSPolicy](https://media.secologies.com/DNSPolicy-1024x53.webp)

![PolicyRuleApplication](https://media.secologies.com/PolicyRuleApplication-1024x372.webp)

### 封鎖URL Category Policy

若要封鎖URL Category就點到Service/URL Category頁面，測試封鎖遊戲類跟新聞類的網頁。

![PolicyService](https://media.secologies.com/PolicyService-1024x377.webp)

因為是要封鎖，所以Actions的部分是選擇Drop或者Deny。

![BlockActions](https://media.secologies.com/BlockActions-1024x340.webp)

測試的話我嘗試連線BBC News以及巴哈姆特

![BlockNews](https://media.secologies.com/BlockNews-1024x769.webp)

![BlockGames](https://media.secologies.com/BlockGames-1024x776.webp)

action裡面也有設定要記錄log，所以到log看應該也要有命中這條policy，新聞類跟遊戲類的請求都drop掉，就代表有成功。

![BlockLogs](https://media.secologies.com/BlockLogs-1024x422.webp)

### 封鎖應用服務

單純封鎖第七層的服務，就直接在application裡面設定

![BlockApplicationLayer](https://media.secologies.com/BlockApplicationLayer-1024x375.webp)

封鎖掉網頁服務需要的是ssl, telnet, web-browsing等，將這些服務設定drop。

> 通常Application跟URL Category會分開設定，是為了更精確的封鎖服務或網站

![BlockWeb](https://media.secologies.com/BlockWeb.webp)

並且可以到log裡面查看有沒有命中

![BlockHit](https://media.secologies.com/BlockHit-1024x81.webp)

也可以看到SSL也被drop掉

![SSLDrop](https://media.secologies.com/SSLDrop-1024x95.webp)

就代表有封鎖成功

