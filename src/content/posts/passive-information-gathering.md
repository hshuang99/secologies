---
title: "被動式資料搜集"
date: 2025-09-07
description: "被動式的收集資料有時候稱為開源情報(Open-Source Intelligence, OSINT)，是針對目標機器搜集一套對外開放服務的資訊，通常不需要跟目標機器用command互動，這也是讓我們的行為不會被目標機器錄下來，在開始介紹工具前，我們對於被動式搜集的情境先介紹一下兩種不同解釋"
hideTOC: false
targetKeyword: 被動式資料蒐集
draft: false
tags: 
  - "google-hacking"
  - "netcraft"
  - "open-source-code"
  - "osint"
  - "security-headers"
  - "shodan"
  - "ssl-tls"
  - "whois"
  - "被動式資料搜集"
lang: zh
---
## 前言

被動式的收集資料有時候稱為開源情報(Open-Source Intelligence, OSINT)，是針對目標機器搜集一套對外開放服務的資訊，通常不需要跟目標機器用command互動，這也是讓我們的行為不會被目標機器錄下來，在開始介紹工具前，我們對於被動式搜集的情境先介紹一下兩種不同解釋

1. 在嚴謹的定義下，攻擊者不可以直接跟目標機器進行直接的接觸，舉例來說，我們可以依賴第三方取得資訊，但我們不能跟目標的系統或伺服器進行存取，使用這種方法對於攻擊者的行為與意圖可以高度的隱藏起來，但也是瓶頸，我們無法取得太多資料
2. 較寬鬆的情況下，攻擊者也許可以跟目標系統或服務進行互動，但只能做一般正常的網路使用者會做的事情，舉例來說目標架設網頁服務提供註冊使用者服務的話攻擊者可以嘗試註冊看看，先檢查該網頁服務有提供哪些功能或API，但在這階段不能做任何漏洞利用的行為

這兩項情境都是可能發生的，根據滲透測試的目標而定，也基於這點，我們決定要搜集的資料必須先界定出收集範圍跟制約才能實施滲透測試，目前網路上有數種資源及工具可以用來搜集資訊，且這些資源跟工具可以週期性的執行，在滲透測試當中，我們所謂的下一階段必須根據現階段搜集到的資訊來做決定，所以整套滲透測試流程最關鍵的便是**_循環_**的流程了

由於每種工具或資源可以產生可以產生無限種各式各樣的結果，我們很難去定義出標準化的流程，被動式資料搜集最重要的任務就是獲得更多資料用以釐清或補充攻擊者的手法層面，幫助攻擊者成功建構網路釣魚(Phishing)活動或者協助其他滲透測試階段，例如搜集相關資訊幫助密碼猜測來破解有效的帳號

## Whois枚舉

1970年ARPANET的伊莉莎白·費勒創立第一個whois目錄，今日的whois便衍伸而來，whois是一種跟公開資料庫做溝通的協定，它使用TCP的43 port來進行溝通，主要搜尋資料庫裡已註冊的網域紀錄，通常WHOIS紀錄裡包含的資訊有：

- 名稱伺服器(Name Server)：這些server其實是網域名稱系統(Domain Name System, DNS)的一部份，專門做IP位址與網域名稱轉址，將流量導流至正確的網頁伺服器
- 註冊人(Registrar)：顯示網域名稱是由哪間公司註冊的，例如網域名稱公司GoDaddy、Namecheap和Gandi
- 註冊人聯絡資料(Registrant Contact)：顯示註冊網域的合法個人戶或公司擁有者，其中包括名稱、組織、信箱及電話號碼
- 負責人聯絡資料(Administrative Contact)：顯示管理網域名稱的主要負責人，經常是要變更網域的主要聯絡中心
- 技術聯絡資料(Technical Contact)：顯示個人或團隊管理網域的技術建制，例如變更DNS紀錄或伺服器整合
- 創立及過期日期(Creation and Expiration Dates)：顯示網域名稱何時註冊以及何時過期，可以用來評估該網域被使用多久了，藉此辨別是否可能是註冊來漏洞利用的，例如WannaCry就是透過註冊的方法解決的
- 網域狀態(Domain Status)：用Flag紀錄網域目前是上鎖的、運作中還是被轉移

通常這些資訊都是公開的，只有某些網域商可以選擇付費不公開這些資訊，所以通常我們說往前搜尋有時就是指利用WHOIS協定搜尋誰擁有該網域，當我們只知道某個IP位址時想要知道更多資訊，就可以選擇使用WHOIS協定進行搜尋

我們來測試看看內部WHOIS工具，加上"-h"這個標籤指定哪台機器執行WHOIS服務，讓我們針對本站secologies.com

```
hshuang@Hong-Sheng-MacBook-Pro ~ % whois secologies.com -h 192.168.50.6
% IANA WHOIS server
% for more information on IANA, visit http://www.iana.org
% This query returned 1 object

refer:        whois.verisign-grs.com

domain:       COM

organisation: VeriSign Global Registry Services
address:      12061 Bluemont Way
address:      Reston VA 20190
address:      United States of America (the)

contact:      administrative
name:         Registry Customer Service
organisation: VeriSign Global Registry Services
address:      12061 Bluemont Way
address:      Reston VA 20190
address:      United States of America (the)
phone:        +1 703 925-6999
fax-no:       +1 703 948 3978
e-mail:       info@verisign-grs.com

contact:      technical
name:         Registry Customer Service
organisation: VeriSign Global Registry Services
address:      12061 Bluemont Way
address:      Reston VA 20190
address:      United States of America (the)
phone:        +1 703 925-6999
fax-no:       +1 703 948 3978
e-mail:       info@verisign-grs.com

nserver:      A.GTLD-SERVERS.NET 192.5.6.30 2001:503:a83e:0:0:0:2:30
nserver:      B.GTLD-SERVERS.NET 192.33.14.30 2001:503:231d:0:0:0:2:30
nserver:      C.GTLD-SERVERS.NET 192.26.92.30 2001:503:83eb:0:0:0:0:30
nserver:      D.GTLD-SERVERS.NET 192.31.80.30 2001:500:856e:0:0:0:0:30
nserver:      E.GTLD-SERVERS.NET 192.12.94.30 2001:502:1ca1:0:0:0:0:30
nserver:      F.GTLD-SERVERS.NET 192.35.51.30 2001:503:d414:0:0:0:0:30
nserver:      G.GTLD-SERVERS.NET 192.42.93.30 2001:503:eea3:0:0:0:0:30
nserver:      H.GTLD-SERVERS.NET 192.54.112.30 2001:502:8cc:0:0:0:0:30
nserver:      I.GTLD-SERVERS.NET 192.43.172.30 2001:503:39c1:0:0:0:0:30
nserver:      J.GTLD-SERVERS.NET 192.48.79.30 2001:502:7094:0:0:0:0:30
nserver:      K.GTLD-SERVERS.NET 192.52.178.30 2001:503:d2d:0:0:0:0:30
nserver:      L.GTLD-SERVERS.NET 192.41.162.30 2001:500:d937:0:0:0:0:30
nserver:      M.GTLD-SERVERS.NET 192.55.83.30 2001:501:b1f9:0:0:0:0:30
ds-rdata:     19718 13 2 8acbb0cd28f41250a80a491389424d341522d946b0da0c0291f2d3d771d7805a

whois:        whois.verisign-grs.com

status:       ACTIVE
remarks:      Registration information: http://www.verisigninc.com

created:      1985-01-01
changed:      2023-12-07
source:       IANA

# whois.verisign-grs.com

   Domain Name: SECOLOGIES.COM
   Registry Domain ID: 3049072034_DOMAIN_COM-VRSN
   Registrar WHOIS Server: whois.cloudflare.com
   Registrar URL: http://www.cloudflare.com
   Updated Date: 2025-12-24T07:58:14Z
   Creation Date: 2025-12-18T14:37:00Z
   Registry Expiry Date: 2026-12-18T14:37:00Z
   Registrar: Cloudflare, Inc.
   Registrar IANA ID: 1910
   Registrar Abuse Contact Email: registrar-abuse@cloudflare.com
   Registrar Abuse Contact Phone: +1.6503198930
   Domain Status: clientTransferProhibited https://icann.org/epp#clientTransferProhibited
   Name Server: ERNEST.NS.CLOUDFLARE.COM
   Name Server: EVANGELINE.NS.CLOUDFLARE.COM
   DNSSEC: signedDelegation
   DNSSEC DS Data: 2371 13 2 0310E27BDC7CD39A811A40F400E0DDBE66ABDB9637A629AC434A4921EC00DDFF
   URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/
>>> Last update of whois database: 2026-01-13T11:18:55Z <<<

# whois.cloudflare.com

Domain Name: SECOLOGIES.COM
Registry Domain ID: 3049072034_DOMAIN_COM-VRSN
Registrar WHOIS Server: whois.cloudflare.com
Registrar URL: https://www.cloudflare.com
Updated Date: 2025-12-24T07:47:19Z
Creation Date: 2025-12-18T14:37:00Z
Registrar Registration Expiration Date: 2026-12-18T14:37:00Z
Registrar: Cloudflare, Inc.
Registrar IANA ID: 1910
Domain Status: clienttransferprohibited https://icann.org/epp#clienttransferprohibited
Registry Registrant ID:
Registrant Name: DATA REDACTED
Registrant Organization:
Registrant Street: DATA REDACTED
Registrant City: DATA REDACTED
Registrant State/Province: Taiwan
Registrant Postal Code: DATA REDACTED
Registrant Country: TW
Registrant Phone: +1.4153197517
Registrant Phone Ext:
Registrant Fax:
Registrant Fax Ext:
Registrant Email:
Name Server: ernest.ns.cloudflare.com
Name Server: evangeline.ns.cloudflare.com
DNSSEC: signedDelegation
Registrar Abuse Contact Email: registrar-abuse@cloudflare.com
Registrar Abuse Contact Phone: +1.4153197517
URL of the ICANN WHOIS Data Problem Reporting System: http://wdprs.internic.net/
>>> Last update of WHOIS database: 2026-01-13T11:19:04Z <<<

% For query help and examples please see
% http://www.iana.org/whois_for_dummies
%

% IANA WHOIS server
% for more information on IANA, visit http://www.iana.org
% This query returned 1 object

inetnum:      192.168.0.0 - 192.168.255.255
organisation: IANA
status:       assigned

remarks:      http://www.iana.org/go/rfc1918

changed:      1994-03
source:       IANA
```

要注意的是並非所有資料都有用，不過我們可以找出那些有用的資訊，例如

- 註冊人(Registrant)：誰合法的擁有這個網域(但抱歉Namecheap會隱藏起來)
- 管理員聯絡資料(Admin Contact)：誰擁有管理員權限存取(但Namecheap也很盡責的隱藏起來了)
- 技術聯絡資訊(Technical Contact)：誰管理DNS以及基礎建設等資訊
- 名稱伺服器(Name Server)：利用網路流量查看網域名稱轉址到哪一組IP位址(Namecheap也把這些隱藏起來了)

我們將這些資訊紀錄起來以便未來測試時使用，那假如我們只知道IP位址呢？我們一樣可以使用whois工具逆向查看背後有哪些機器並將資料搜集起來，只要把剛才網域名稱換成IP位址即可

```
hshuang@Hong-Sheng-MacBook-Pro ~ % whois 38.100.193.70 -h 192.168.50.6
% IANA WHOIS server
% for more information on IANA, visit http://www.iana.org
% This query returned 1 object

refer:        whois.arin.net

inetnum:      38.0.0.0 - 38.255.255.255
organisation: PSINet, Inc.
status:       LEGACY

whois:        whois.arin.net

changed:      1994-09
source:       IANA

# whois.arin.net

NetRange:       38.0.0.0 - 38.255.255.255
CIDR:           38.0.0.0/8
NetName:        COGENT-A
NetHandle:      NET-38-0-0-0-1
Parent:          ()
NetType:        Direct Allocation
OriginAS:
Organization:   PSINet, Inc. (PSI)
RegDate:        1991-04-16
Updated:        2023-10-11
Comment:        IP allocations within 38.0.0.0/8 are used for Cogent customer static IP assignments.
Comment:
Comment:        Reassignment information for this block can be found at rwhois.cogentco.com 4321
Comment:
Comment:        Geofeed https://geofeed.cogentco.com/geofeed.csv
Ref:            https://rdap.arin.net/registry/ip/38.0.0.0

OrgName:        PSINet, Inc.
OrgId:          PSI
Address:        2450 N Street NW
City:           Washington
StateProv:      DC
PostalCode:     20037
Country:        US
RegDate:
Updated:        2023-10-11
Comment:        Geofeed https://geofeed.cogentco.com/geofeed.csv
Ref:            https://rdap.arin.net/registry/entity/PSI

ReferralServer:  rwhois://rwhois.cogentco.com:4321

OrgNOCHandle: ZC108-ARIN
OrgNOCName:   Cogent Communications
OrgNOCPhone:  +1-877-875-4311
OrgNOCEmail:  noc@cogentco.com
OrgNOCRef:    https://rdap.arin.net/registry/entity/ZC108-ARIN

OrgTechHandle: IPALL-ARIN
OrgTechName:   IP Allocation
OrgTechPhone:  +1-877-875-4311
OrgTechEmail:  ipalloc@cogentco.com
OrgTechRef:    https://rdap.arin.net/registry/entity/IPALL-ARIN

OrgAbuseHandle: COGEN-ARIN
OrgAbuseName:   Cogent Abuse
OrgAbusePhone:  +1-877-875-4311
OrgAbuseEmail:  abuse@cogentco.com
OrgAbuseRef:    https://rdap.arin.net/registry/entity/COGEN-ARIN

RTechHandle: PSI-NISC-ARIN
RTechName:   IP Allocation
RTechPhone:  +1-877-875-4311
RTechEmail:  ipalloc@cogentco.com
RTechRef:    https://rdap.arin.net/registry/entity/PSI-NISC-ARIN

# rwhois.cogentco.com

%rwhois V-1.5:0010b0:00 rwhois.cogentco.com (CGNT rwhoisd 1.2.1)
network:ID:NET4-2664C10018
network:Network-Name:NET4-2664C10018
network:IP-Network:38.100.193.0/24
network:Org-Name:Biznesshosting, Inc.
network:Street-Address:500 GREEN ROAD
network:City:POMPANO BEACH
network:State:FL
network:Country:US
network:Postal-Code:33064
network:Tech-Contact:ZC108-ARIN
network:Updated:2024-05-13 18:48:33
%ok
% For query help and examples please see
% http://www.iana.org/whois_for_dummies
%

% IANA WHOIS server
% for more information on IANA, visit http://www.iana.org
% This query returned 1 object

inetnum:      192.168.0.0 - 192.168.255.255
organisation: IANA
status:       assigned

remarks:      http://www.iana.org/go/rfc1918

changed:      1994-03
source:       IANA
```

可以看到上述的資料顯示伺服器落在38.0.0.0/8的無類別域間路由(Classless Inter-Domain Routing, CIDR)區段裡，屬於一種非常大的子網域區間，由PSINet這家公司註冊的，這些結果讓我們知道誰註冊了這個IP位址，這些資訊再之後的階段都會用到，目前我們就是把所有資訊都記錄下來到筆記裡即可

## Google Hacking

"Google Hacking"這詞被Jonny Long在2001年發揚光大，在他的數場演講及書本(Google Hacking for Penetration Testers)提及如何利用搜尋引擎例如Google找出重要的資訊、漏洞以及一些錯誤設定的網站，核心就在於裡用一些機靈的字串或運算子組合創造出更完善的搜尋請求，這些搜尋請求可以用在各種搜尋引擎裡

整趟流程必須不斷地迭代，一開始搜尋的較廣泛的關鍵字，之後使用運算子漸漸的將不相關或者沒什麼價值的搜尋結果移除，首先是**site**這個運算子可以限制只搜尋單一網域，能夠得到組織底下的頁面作為一些入侵想法

![secologies](https://media.secologies.com/Screenshot-2026-01-13-at-7.20.35-PM.webp)

上圖顯示使用site這個運算子限制只搜尋secologies.com這個網域，接著我們可以再進一步限制我們的結果，例如使用**filetype**(或是**ext**)運算子限制搜尋出來的只能是特定的檔案，讓我們試著結合txt檔案(filetype:txt)跟www.megacorpone.com這個網域

![Google-Hacking-filetype-operator](https://media.secologies.com/Google-Hacking-filetype-operator.webp)

回傳給我們的結果是一組robots.txt的檔案，這個檔案裡面包含的是

```
User-agent: *
Allow: /
Allow: /nanites.php
```

robots.txt這個檔案用來指引網頁爬蟲像是Google的搜尋引擎爬蟲允許或禁止爬取哪些資源，上述的語法中特別指定nanites這個php檔案，而其他的檔案或目錄則在一般搜尋下隱藏起來，除非之後又加進去policy中

另外**ext**運算子則是可以幫助搜尋網站中使用到的特定程式語言，例如ext:php、ext:xml或者ext:py就會特定搜尋php寫成的網頁、XML檔案以及python頁面

我們還可以同時使用 - (減號)從搜尋中來排除特定的結果來縮小範圍，舉例來說我們只對HTML頁面之外的結果有興趣，就可以用site:hshuang.blog及底下的子頁面，用"-filetype:html"來排除HTML檔案

![social-blog-filetype](https://media.secologies.com/social-blog-filetype.webp)

透過這個例子我們發現該網域底下的一些頁面，另外我們可以利用**intitle:"index of" "parent directory"**搜尋標題包含"index of"以及頁面內含有"parent directory"的網頁

![Google-Hacking-Index-of-parent-directory](https://media.secologies.com/Google-Hacking-Index-of-parent-directory-scaled.webp)

搜尋結果顯示跟目錄有關的頁面，透過找到這些index of清單有可能在裡面找到錯誤設定的檔案或隱私資訊，以上這些只是簡易的搜尋層面，Google Hacking資料庫(Google Hacking Database, GHDB)透過更多種運算子的結合顯示包含更多層面的搜尋方法[https://www.exploit-db.com/google-hacking-database](https://www.exploit-db.com/google-hacking-database)

![GHDB](https://media.secologies.com/GHDB-scaled.webp)

另一種方法是透過[DorkSearch](https://dorksearch.com/)工具組合Google Hacking的運算子，透過事先建立好的子集合組合出想要搜尋的條件，精通這些運算子並且適當的減少邏輯是利用搜尋引擎搜集資料的關鍵

## Netcraft

Netcraft是一家提供免費網頁服務的公司，主要這個網頁功可以執行多種資訊的搜集功能，例如探索給定的網站使用何種技術以及同網段中是否存在其他機器或服務，照我們之前的定義來看倚賴Netcraft這種第三方也算得上一種被動式搜集技術，畢竟我們沒有直接跟目標機器互動

讓我們測試一下Netcraft的能力，我們利用Netcraft的DNS搜尋頁面來獲得跟本站有關的資訊試試：[https://searchdns.netcraft.com/](https://searchdns.netcraft.com/)

![Netcraft-1](https://media.secologies.com/Netcraft-1-scaled.webp)

由於本站只有單一伺服器，所以直接搜尋到的就是網站報告，如果同網域下還有其他台伺服器則會一併顯示出來，報告中提供額外的資訊，包括註冊資訊，如果再往下拉的話可以看到網站技術的細節

![Netcraft-2](https://media.secologies.com/Netcraft-2-scaled.webp)

報告中子網域及網站使用到的技術對於未來進行主動式資料搜集跟漏洞利用時會幫上忙，而現在我們只要紀錄進筆記即可

## 開源Code

而這一章節我們探索更多網路工具及資源用來被動資料搜集，其中資源就包含開源(open-source)的專案以及線上程式儲存例如：

- GitHub
- GitHub Gist
- GitLab
- SourceForge

這類版控的線上程式儲存服務可以讓我們一瞥組織內使用的程式語言及框架，在某些很罕見的情形下，開發者可能會補小心的把敏感資料或驗證身份資訊上傳到公開的儲存庫裡，不過我想這也是人之常情，畢竟我們在開發某個系統或工具時總會繼承某個複雜的架構

而下一個接手維護的工程師也沒辦法100%馬上熟悉這麼大的程式庫，所以發生設置錯誤後識別到可能的漏洞應該是要先想辦法解決，並且優化之後的流程，而不是先開除維護的工程師或者譴責抓到漏洞的滲透測試員

而這類的版控服務平台用上面談到的Google搜尋運算子也有辦法找到想要知道的資訊，例如GitHub就很彈性，我們可以在GitHub裡搜尋某人或某個組織的程式庫，不過要搜尋到所有公開程式庫必須先註冊GitHub帳號，幸好註冊是免費的，而且用校園帳號可以升級方案

登入GitHub帳號後，我們可以在右上方的欄位執行多種關鍵字搜尋

![GitHub-Search-1](https://media.secologies.com/GitHub-Search-1.webp)
*[^1]*

接著我們在open-quantum-safe的程式庫底下搜尋有興趣的資料，利用"**path:users**"來搜尋任何檔案內是否包含"users"這個字，按下Enter

![File-Operator-in-GitHub-Search](https://media.secologies.com/File-Operator-in-GitHub-Search.webp)
*[^1]*

我們只搜尋到xampp.users這個檔案裡有包含，但這挺有趣的，因為XAMPP是一組網頁應用服務開發環境的套件，我們近一步確認這個檔案裡

![xampp.users-File-Content](https://media.secologies.com/xampp.users-File-Content.webp)
*[^1]*

這個檔案裡儲存的是username跟password的hash值，對於之後主動式攻擊階段會非常有幫助，就可以先加進我們的筆記裡，這種手動的方法比較適合小型的程式庫，如果是大型的話，我們可以利用數種工具來自動化搜尋，例如[Gitrob](https://github.com/michenriksen/gitrob)以及[Gitleaks](https://github.com/gitleaks/gitleaks)這類工具需要源碼供應商有提供API來進行存取，例如下圖就是用Gitleaks在程式庫裡找AWS存取key ID

![Example-Gitleaks-Output](https://media.secologies.com/Example-Gitleaks-Output.webp)
*[^1]*

找到這些身份驗證資訊後我們可以無限制的存取同一組AWS帳號以及攻擊該組帳號控管的雲端服務，這類從源碼裡找隱私資訊的工具，不管是Gitrob或Gitleaks都仰賴於正則表達式(Regular Expressions)或者熵值檢測(entropy-based detections)來辨識出潛在有價值的資料

熵值(Entropy-based)工具的目標是掃描找出相對亂度夠高的數值，例如金鑰、密碼或token的符號，而熵值檢測就是嘗試找出隨意產生出來的字串，這種想法源自於長字串的亂數字元與數字組成很高機率是密碼，不過無論用多少工具進行搜尋，任何工具都並非完美，總是有可能漏掉某些資訊，而那些資訊只能用人工找出來

## Shodan

對於資訊搜集的階段傳統的網站也是很重要的一環，Shodan也是一種搜尋引擎，不過專門爬取哪些連網的設備，包括執行網站的伺服器或者一些路由器跟IoT設備，如果說Google是用來搜尋網頁伺服器的內容，那我們可以說Shodan是搜尋聯網設備的引擎，同樣也可以跟這些設備互動以及顯示一些相關資訊

Shodan一樣要先註冊免費版帳號，免費版有存取上的限制但也足夠用了，我們嘗試搜尋megacorpone.com

![Searching-MegaCorp-Ones-domain-with-Shodan](https://media.secologies.com/Searching-MegaCorp-Ones-domain-with-Shodan.webp)
*[^2]*

這個搜尋結果告訴我們相關的IP、服務以及一些面板資訊，這些也同樣是被動搜集而不需要與目標網站進行互動，這些資訊給了我們一些目標聯網足跡的快照資訊，例如有4個伺服器開著SSH的協定，我們可以點選22 port的結果更近一步的進行搜索SSH服務消息

![MegaCorp-One-servers-running-SSH](https://media.secologies.com/MegaCorp-One-servers-running-SSH-.webp)
*[^2]*

基於Shodan的搜尋結果，我們可以確切知道每一種server運行的OpenSSH協定版本，如果點選IP位址的話可以看到統整過的機器資訊

![Shodan-Host-Summary](https://media.secologies.com/Shodan-Host-Summary.webp)
*[^2]*

我們可以查看server裡所有用到的port、服務以及用到的技術，Shodan也會根據已發布的漏洞進行該機器的服務或技術進行比對，這類的資訊當我們進行主動測試時會是無價的資料，絕對會幫忙省下許多力氣

## 安全標頭檔與SSL/TLS

我們另外談一些特別的網站可以用來獲取目標網站或網域安全性的資訊，有些網站定位其實介於被動式與主動式資料搜集，但我們的關鍵理念是初始化掃描或確認時依賴第三方而並非留下我們的足跡

其中一種就是安全標頭檔確認，主要分析HTTP標頭檔回應並且彙整基本分析目標的網站安全性，我們可以用這種網站獲得目標程式框架以及安全性實作的架構，我們嘗試[https://securityheaders.com/](https://securityheaders.com/)掃描secologies.com確認看看

![tech-site-headers-check](https://media.secologies.com/tech-site-headers-check.webp)

掃描結果可以看到本站少了一些防禦性的標頭檔，例如Content-Security-Policy以及Permissions-Policy，這些缺失的標頭檔有時並非需要注意的，不過也確實的點出了網站開發員以及伺服器管理員並不熟悉伺服器強化(Server hardening)

伺服器強化(Server hardening)是指一系列的伺服器安全設定流程，包括關閉不需要的服務、移除沒用到的服務或使用者、變更預設密碼、設定適當的伺服器標頭檔等等，我們並不需要了解所有server設定的效果，但了解概念以及要搜尋哪個方面的資料能夠幫助我們快速的找出潛在目標進入點

另一種掃描工具就是使用[Qualys SSL Labs](https://www.ssllabs.com/ssltest/)測試網站的SSL憑證，該工具可以分析伺服器的SSL/TLS設定跟目前最佳的狀態作比較，同時會附上SSL/TLS相關的漏洞，例如Poodle或者Heartbleed等重大的漏洞，我們嘗試掃描secologies.com看看結果

![tech-Qualys-result](https://media.secologies.com/tech-Qualys-result.webp)

這類的結果其實比安全性標頭檔還來的可信，不過時至今日如果伺服器如果還是支援TLS 1.0或TLS 1.1的話就需要擔心一下了，畢竟TLS 1.0跟1.1的版本都還是舊版的實作不安全的加密模組，用此種工具查看伺服器支援的版本來建議系統管理人員升級SSL/TLS協定的版本，關閉TLS_DHE_RSA_WITH_AES_256_CBC_SHA模組已經是好幾年前就建議做的事情了

舉例來說，雖來密碼模組把加密、HASH跟block cipher mode組合起來，但如果數種漏洞可以針對AES的模組以及SHA1 Hash演算法就顯得整個密碼模組非常不安全，我們可以根據這些檢測出來的結果了解目標機器的安全實作以及可能的破口

[^1]: OffSec, “Information Gathering: Open-Source Code,” The Penetration Testing with Kali Linux (PEN-200).

[^2]: OffSec, “Information Gathering: Shodan,” The Penetration Testing with Kali Linux (PEN-200).

