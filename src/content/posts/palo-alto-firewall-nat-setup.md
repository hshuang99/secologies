---
title: "Palo Alto 防火牆網路位址轉譯(NAT)設定"
date: 2023-06-27
description: 在網路上我們不可能直接將內網的服務IP揭露出去，而防火牆就會提供網路位址轉譯成能夠對外的IP，一來是內網服務IP數量有限所以需要轉譯出去，二來是不想讓攻擊者知道內網服務的IP位址，故需要透過Network Address Translation(NAT)來轉址
hideTOC: false
targetKeyword: Palo Alto 防火牆 NAT
draft: false
tags: 
  - "nat"
  - "palo-alto"
  - "網路位址轉譯"
  - "防火牆"
lang: zh
---
## 架設環境

先確認你的PC跟你要做NAT的VM有相同網卡可以通。

## 架構

![NAT_Architecture](https://media.secologies.com/NAT_Architecture.webp)

## NAT Zone 設定

到Network→Zones，先把整個NAT過程需要的zones新增起來。

![PANATZone](https://media.secologies.com/PANATZone-1024x817.webp)

我採用的架構就只需要內外腳的trust、untrust這兩個zone。

![PANATZoneSetting](https://media.secologies.com/PANATZoneSetting-1024x186.webp)

trust是跟內部溝通的內腳，untrust是需要連到外網的外腳。

## NAT Interface Inner & Outer

到Network→Interfaces設定NAT的內腳與外腳，下面有Add選項

![PANATInterface](https://media.secologies.com/PANATInterface-1024x229.webp)

## Virtual Routers Setup

到Network→Virtual Routers新增一個新的Router

![VirtualRoute](https://media.secologies.com/VirtualRoute-1024x287.webp)

在Router Settings選擇內外腳的Interface

![PANATRouterInterface](https://media.secologies.com/PANATRouterInterface-1024x643.webp)

到Static Routes新增下一跳，Add一個新的路徑

![PANATVirtualRoute](https://media.secologies.com/PANATVirtualRoute-1024x657.webp)

default使用0.0.0.0/0代表轉any，然後下一跳轉default-gateway

![PAStaticRoutes](https://media.secologies.com/PAStaticRoutes.webp)

![PANATNextHop](https://media.secologies.com/PANATNextHop.webp)

## NAT Policy

接著到Policy選NAT

![PANATPolicy](https://media.secologies.com/PANATPolicy-1024x830.webp)

Add新增新的NAT Policy，General輸入名稱，Source是目前內腳，連我的trust到外部的untrust

![PANATPolicySetting](https://media.secologies.com/PANATPolicySetting-1024x491.webp)

Translate Packet連我外腳，使用Dynamic IP and Port轉出去

![PANATPolicyDynamic](https://media.secologies.com/PANATPolicyDynamic-1024x341.webp)

## 測試結果

若要測試是否有轉譯成功，可以嘗試連接網頁，先把Policy的Any打開，讓http/https通過，接著網卡那邊也要設定DNS Server的位置，不然找不到網頁位置，連接網頁過防火牆，可以在Log裡面看到有Source IP以及NAT Dest IP，就代表轉譯成功

![PANATLogs](https://media.secologies.com/PANATLogs-1024x422.webp)

