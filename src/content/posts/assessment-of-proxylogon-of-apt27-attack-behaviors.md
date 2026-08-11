---
title: "APT27 ProxyLogon 攻擊行為對安全的影響評估與防禦對策"
date: 2025-10-12
description: "本文想要讓讀者了解的是以下三點，首先是希望能讓大家認識APT27這個惡意組織以及這個組織常用的攻擊手法為何，其次就是針對前述提到的攻擊方法將會帶給讀者一些防禦的策略，最後就是想讓各位認識的是APT27這個組織對於企業或產業會產生什麼影響"
hideTOC: false
targetKeyword: APT27 ProxyLogon
draft: false
tags: 
  - "apt27"
  - "cyber-kill-chain"
  - "exchange"
  - "proxylogon"
  - "stix"
  - "ttps"
  - "zero-day"
lang: zh
---

## 前言

本文想要讓讀者了解的是以下三點，首先是希望能讓大家認識APT27這個惡意組織以及這個組織常用的攻擊手法為何，其次就是針對前述提到的攻擊方法將會帶給讀者一些防禦的策略，最後就是想讓各位認識的是APT27這個組織對於企業或產業會產生什麼影響

## 外部情資來源

在開始進入外部情資介紹之前，先聲明一下本文的資料來源針對APT27這個組織我們分析多個知名的廠商報告，主要來源是從Mandiant情資平台提供詳細的APT攻擊報告和分析內容，另外一個是FireEye的來源為我們點出威脅情報和事件響應的機制，提供最新的APT活動和攻擊趨勢

而Mandiant原本也是FireEye旗下的平台，之後由Google收購，以及我們還有參考一些公開的情資平台例如virustotal, malpedia等等來確保資料的全面性以及準確性

## APT27

那就讓我們開始跟各位讀者介紹APT27這個惡意組織，其實不同的廠商在分析報告中針對這個組織有不同的名稱，像是Emissary Panda，UNC2639, UNC2640, LuckyMouse等等，但作為最多廠商稱呼的APT27這個名稱，所以後續我們都會使用APT27來稱呼

這個組織在多份報告當中顯示應該是跟中國政府有掛勾，其主要特點可以分成以下四點

- APT27組織影響的範圍分布全球
- 針對全球各國的IT環境，專門挑高價值產業進行多方面的攻擊
- 另外他們知名的其中一個原因是會自製許多強大的工具
- 最後是APT27攻擊過臺灣

所以我們認為這個APT組織跟我們的關聯性很高，也是我們會挑選的這個主題想跟讀者介紹的其中一個原因，在網路戰的時代作為中國政府扶持下進行網路間諜活動更是我們該注意的目標之一

這個與中國政府有關聯的惡意組織其主要目的在於竊取已開發國家中較為先進的產業從中偷取他們的技術使得讓中國內的相同企業能夠提升技術能力，並且攻擊境外先進產業，包括北美、南美、歐洲跟中東都出現過他們的跡象

從商業服務、高科技、政府、能源、航空航太、運輸到旅遊業有利可圖的皆是攻擊的目標，而如此多標的總不可能只靠一組人馬就搜刮完，所以在MADIANT的Publicly Available Malware Usage by FIN and APT Groups Report報告中顯示出有與其他APT組織合作的跡象

![APT27-Malware-Association-with-other-APT-Group](https://media.secologies.com/APT27-Malware-Association-with-other-APT-Group.webp)
*其他APT組織使用APT27自製的惡意軟體，來源自MADIANT ADVANTAGE Publicly Available Malware Usage by FIN and APT Groups Report – May 2018*


| 惡意組織(下)/惡意工具(右) | BEACON | GHOST RAT | TUNNA | METERPRETE | NANO | CORE | ASPXSPY | ALPHASHELL | DARKCOMET |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| APT17(Tailgater) |  |  |  |  |  |  | O |  |  |
| APT18(Wekby) |  | O |  |  |  |  |  |  |  |
| APT19(Codoso) | O |  |  | O |  |  |  |  |  |
| APT20(Twivy) |  |  |  |  |  |  | O |  |  |
| APT24 |  | O |  |  |  |  |  |  |  |
| APT27 |  |  |  |  |  |  | O |  |  |
| APT28(Tsar) |  |  |  | O |  |  |  |  |  |
| APT32(OceanLotus) | O |  |  |  |  |  |  |  |  |

另外從APT27 Detection Tool Released by Iran CERT的分析報告中出現分析APT27跟APT34組織之間的關聯性，由Raha Security找到的線索來看在伊朗某些的網路間諜行動，他們透過自家的RahaSec檢測工具看起來兩個國家利益有衝突，所以這兩個組織應該是互為競爭對手

### 戰略型情資

著眼於長期的安全威脅趨勢和模式我們要想辦法來協助高層的管理人員制定整體的安全策略，APT27主要針對航空與國防、政府機構、交通運輸以及能源產業進行攻擊，出現在台灣、美國、法國、德國、加拿大、以色列、土耳其以及阿根廷各個國家

![GEOGRAPHIES-AND-INDUSTRIES-AFFECTED](https://media.secologies.com/GEOGRAPHIES-AND-INDUSTRIES-AFFECTED.webp)
*APT27影響範圍地區及產業，來源自FireEYE OBSERVED CHINESE ESPIONAGE ACTIVITY報告*

而該組織自製的惡意軟體家族就包括了GH0ST、PANDORA、SOGU以及ASPXSPY等等，其受影響產業的STIX圖我們可以製作成

![INDUSTRIES-AFFECTED-STIX](https://media.secologies.com/INDUSTRIES-AFFECTED-STIX.webp)
*產業影響STIX圖，來源自GOOGLE MADIANT DATABASE*

### 實戰型情資

而我們在實戰型情資中需要專注於即時的威脅和攻擊活動，以提供具體的威脅情報來快速地應對事件，APT27很擅長攻擊基礎設施，利用那些被劫持的伺服器，部署自家的C2 Server上去，其範圍含括了全球各地包括美國、台灣、韓國等等

初始化採用魚叉式網路釣魚、水坑攻擊以及利用上傳惡意文件等方法入侵進這些Server當中，而取得存取控制的管理員權限後，採用ZXSHELL這套遠端存取工具(RAT)來進行控制，而用SOGU惡意軟體持續的做滲透測試，最終將資料竊取出來

我們從報告中找出APT27使用到的惡意軟體數量，並繪製成STIX圖表，讀者可以觀察到使用的數量真的挺驚人的

![APT27-Malware-STIX](https://media.secologies.com/APT27-Malware-STIX.webp)
*APT27惡意軟體STIX圖，來源自GOOGLE MADIANT DATABASE*

並且我們從報告中看到了一些威脅情報指標(IoC)資訊

![APT27-IoCs-STIX](https://media.secologies.com/APT27-IoCs-STIX.webp)
*APT27威脅情報指標STIX圖，來源自GOOGLE MADIANT DATABASE*

光是他們使用的工具如此多，加上還可以販售給其他APT惡意組織的話，就能夠造出許多CVE出來

![APT27-CVEs-STIX](https://media.secologies.com/APT27-CVEs-STIX.webp)
*APT27 CVE STIX圖，源自GOOGLE MADIANT DATABASE*

代表該組織的惡意軟體家族開發了非常多出來，在MADIANT ADVANTAGE中我們找到了一系列的工具

![APT27-Associations](https://media.secologies.com/APT27-Associations.webp)
*APT27關聯家族，源自GOOGLE MADIANT DATABASE*

### 戰術型情資

在瞭解了APT27組織所使用到的所有線索之後，我們就得針對具體的技術細節，提出方法來協助資安專業人員鑑別和防禦這特定類型的攻擊，從TTPs的角度來看APT27所採用的有漏洞利用、魚叉式網路釣魚以及持久性維持

從ESET 2021年的報告[^1]中我們看到關鍵活動有包括針對為修補漏洞的利用策略、自製工具的部署以及設計規避的技巧，以及利用水坑攻擊搭配三叉戟(Trident)模型進行組合

所以在這個階段我們將要套用到Kill Chain模型當中來模組化APT27，包括精準偵察與武器化的準備，設計部署與漏洞利用的隱蔽性以及C2通道的靈活操作等等都可以在這個模型當中清楚顯示給資安人員

### ESET THREAT REPORT

而在ESET另一篇分析報告中我們看到某些其他的線索，例如以中東地區為目標的話經常是針對政府部門進行攻擊，其緣由可能是地緣政治的干涉，而到了中亞地區，又換成針對私人企業(諸如像電信企業、媒體公司跟銀行等等)，為了探查這些國家的經濟情勢

針對這些地帶，APT27主要換成經常使用SysUpdate工具包，並利用Microsoft Exchange的zero-day漏洞來入侵郵件伺服器，其中這些工具如SysUpdate或HyperBro都是為了利用DLL搜尋順序劫持來躲避安全性檢測

其中值得關注的是SysUpdate工具包搭配著三叉戟(Trident)模型，針對容易被DLL劫持的內建應用軟體，重新製作一份新的DLL裡面放惡意的payload，這些payload是用Shikata Ga Nai的編碼方式做成原始的二進制格式放進去，不易被偵測到

接著我們來更進一步的說明APT27使用到的這些方法利用到哪些TTPs

### Tactics、Techniques、Procedures

首先我們看戰術(Tactics)的部分，惡意組織在攻擊時為了達到特定的目標所採用的策略包含

- 入侵初期(Initial Access)：APT27利用魚叉式網路釣魚攻擊以及戰略網站入侵(SWC)
- 漏洞利用(Exploitation)：使用已知的漏洞，如CVE-2021-26855與CVE-2021-27065
- 指揮與控制(C2)：經常變更C2肉雞的IP並針對53、80、443等常用port連線以規避防毒軟體或網路存取設備的發現
- 橫向移動(Lateral Movement)：使用DLL側載技術、Web Shell來橫向移動，尋找其他內部系統

再來看技術(Techniques)的部分，將惡意組織在不同階段所使用的具體方法表現出來

- 網路釣魚與漏洞利用：通過魚叉式網路釣魚發送惡意鏈接或文件來攻擊受害目標
- DLL側載(DLL Side-loading)：使用內建的合法應用軟體執行惡意的DLL文件，以繞過安全檢測系統
- Web Shell部署：通過Web Shell(例如OwaAuth)來維持對受感染服務器的持續掌控

最後一階段步驟(Procedures)觀察每次的攻擊中如何使用這些技術的具體細節

- 基礎設施管理：經常讓C2肉雞更換域名和IP位址，以避免被任何工具或檢測公司追蹤
- 持續入侵：即使存取權限被清除，APT27常能利用修改工具或新的入口再次入侵系統
- 後門設置與持久性維持：使用HttpBrowser和PlugX這些遠端存取工具來維持長期連線

## Cyber Kill Chain

![Cyber-Kill-Chain](https://media.secologies.com/Cyber-Kill-Chain-1024x502.webp)

我們將ESET 2021年關於APT27的報告內容套用到Kill Chain模型，可以更有系統地理解APT27的攻擊策略與技術，其中Kill Chain模型分為七個階段，每個階段描述了一次網絡攻擊的關鍵步驟，以下是如何將APT27的活動與Kill Chain模型對應的詳細介紹：

1. 偵察 (Reconnaissance)：APT27（LuckyMouse）通常針對政府部門和私人企業（電信、媒體、銀行）進行偵察，以確定未修補的漏洞或軟體弱點，特別是在中東和中亞地區的高價值目標。偵察階段可能包括：
    - 檢測未修補的Microsoft Exchange伺服器漏洞
    - 確定目標使用的系統和軟體（如電信和銀行業的IT基礎設施）
2. 武器化 (Weaponization)：APT27通常使用已知漏洞來準備攻擊，並結合其開發的惡意工具包，如SysUpdate（Soldier）和HyperBro。在武器化階段，攻擊者將：
    - 利用已知漏洞（例如Microsoft Exchange Zero-Day漏洞）
    - 將DLL劫持技術和自定義惡意程式(如Shikata Ga Nai編碼的payload)整合進攻擊工具包，為後續的攻擊做準備
3. 交付 (Delivery)：APT27使用「水坑攻擊」(watering hole)或戰略性網站入侵攻擊將惡意軟體傳送給目標，交付階段的典型方式包括：
    - 利用受感染的網站將惡意軟體傳遞給目標  
    - 透過水坑攻擊使目標無意中連線到已受感染的網站，觸發惡意payload
4. 漏洞利用 (Exploitation)：一旦APT27的惡意工具包成功部署進目標系統，他們會利用已知的漏洞來入侵未修補的伺服器。在這一階段：
    - Microsoft Exchange漏洞被APT27利用來攻擊郵件伺服器，當時這些漏洞仍是Zero-Day漏洞   
    - 這一步驟使APT27能夠在目標系統上獲取初步立足點
5. 安裝 (Installation)：在成功利用漏洞後，APT27會安裝其惡意植入工具來進一步控制目標系統。APT27的惡意工具安裝過程包括：
    - 使用其「三叉戟模型」，將一個合法應用軟體(容易被DLL劫持)、自定義DLL（加載有效payload）和Shikata Ga Nai編碼的二進制有效payload安裝在受感染的系統中   
    - 這些組件隨後會隨機放置在系統的任意路徑中，增加持久性並降低被檢測的風險
6. 命令與控制 (Command and Control, C2)：一旦APT27的惡意工具被安裝，他們會建立與目標系統的持續通信通道，以遠程控制受感染的設備。在這一階段：
     - APT27利用常見port(如53、80、443)進行C2通訊，這些port通常不會被懷疑    
     - 通過經常更換C2肉雞的IP位置來逃避檢測，使得網絡防禦措施難以有效阻止其活動
7. 目標行動 (Actions on Objectives)：最後，APT27完成其目標，包括資料竊取、情報搜集或破壞活動。其主要目標行動包括：
     - 部署SysUpdate或HyperBro植入工具進行持續控制和資料竊取   
     - 通過惡意payload如DLL劫持，來避開系統防禦並達成長期的滲透目的

讓我們為Kill Chain 模型做個總結，APT27的活動與Kill Chain模型緊密對應，其典型的攻擊流程從偵察到最終的資料竊取或破壞行為都具有高度系統化和隱蔽性，他們使用Zero-Day漏洞、已知漏洞與自定義惡意工具包來入侵目標系統

並通過劫持常見的系統process（如DLL搜索順序）來逃避檢測，這一系列行動展示了APT27在網絡間諜活動中的高水平技術和操作能力，這也是為何2021年的Zero-Days爆發數量劇增的原因之一

## 疫情期間漏洞趨勢

![ZERO-DAYS-EXPLOITED](https://media.secologies.com/ZERO-DAYS-EXPLOITED-scaled.webp)
*2012年一月至2021年七月Zero-Days數量，來源自MANDIANT*

另外我們在整理資料時看到APT27(1-25) Vulnerability Exploitation Trends, January 2020 – June分析報告裡，顯示2020年和2021年Zero-Days漏洞利用顯著增加，Mandiant記錄到近年「Zero-Days漏洞利用」出現顯著增長

原因出在COVID-19疫情帶來遠距工作的流行，疫情迫使許多企業轉向遠距工作，導致對VPN技術的依賴空前增加，這使VPN成為攻擊者的主要目標，因為一旦攻破VPN，就能入侵內部網路

另外Microsoft產品在企業和個人中的廣泛使用也是要素之一，由於企業和個人在工作和生活中廣泛使用Windows和Office等軟體，任何漏洞的出現都可能帶來大規模的攻擊機會，因為這些產品經常成為攻擊的初始入侵口

透過上述幾點，帶出我們在本文想要探討的主題「ProxyLogon (Microsoft Exchange Server)」意味著企業應加強對Microsoft生態系統的漏洞管理，快速部署修補和安全更新，減少風險暴露面

## 內部情資

Proxylogon漏洞首要先反查IP或利用SSL資訊取得域名，再利用DNS Lookup工具找出大量的IP位址，透過這些IP在進一步的用動態資料搜集找出所有可能存在的網域名稱及伺服器，篩選出可能是Exchange伺服器的機器

利用Nmap以及Metasploit針對這些機器檢測是否存在CVE-2021-26855漏洞線索，如果有的話代表該Exchange還未修復該漏洞，利用這項漏洞入侵伺服器內取得權限，植入惡意軟體部署Web Sell，最終實現遠端命令執行的操作，更加詳細的步驟可以參考下圖

![ProxyLogon](https://media.secologies.com/ProxyLogon.webp)
*ProxyLogon漏洞攻擊手法[^2]*

另外我們也在一些分析報告中找到ProxyLogon漏洞的SITX情資，可以供讀者參考

```
<stixCommon:Exploit_Target xsi:type="et:ExploitTargetType" id="example:et-37a165f6-a7d6-bba1-2464-e7a52fcd377" timestamp="2021-03-02T09:00:00.000000Z">
    <et:Title>Microsoft Exchange vulnerability</et:Title>
    <et:Vulnerability>
        <et:CVE_ID>CVE-2021-26855</et:CVE_ID>
        <et:References>            
<stixCommon:Reference>https://msrc.microsoft.com/update-guide/vulnerability/CVE-2021-268555</stixCommon:Reference>
 </et:References>
</et:Vulnerability>
</stixCommon:Exploit_Target>
```

以及ProxyLogon在MITRE ATT&CK上的矩陣圖表

![ProxyLogon-MITRE-ATTCK-Matrix](https://media.secologies.com/ProxyLogon-MITRE-ATTCK-Matrix.webp)
*ProxyLogon MITRE ATT&CK Matrix[^3]*

## 緩解策略

在這些分析報告中除了提出觀察到的跡象，當然也提供了應對和減輕安全威脅的方法，包括技術上的措施、規則上的制定以及應急預定方案等等

| 緊急 | 次緊急 | 重要但不緊急 |
| --- | --- | --- |
| 漏洞修補管理 | 防禦針對性攻擊 | 網路監控與入侵檢測 |
| 1. 即時訂定系統的漏洞修補策略   2. 確保修復關鍵性的漏洞(CVE-2021-26855)   3. 即時的修復系統已減少惡意組織利用的機會 | 1. 加強網路釣魚的防護措施   2. 短期內每週定時舉行員工資安培訓   3. 設定多因子身份驗證(MFA) | 1. C2流量的分析，設定適當的監控規則來檢測公司內是否由無異常流量   2. 行為分析，網管或資安人員應定期搜集最新的威脅情報，運用行為分析技術來檢測內部網路是否有APT27的攻擊行為存在 |

另外我們針對ProxyLogon也提出一些緩解政策，像是：

1. 更新Exchange伺服器：只要有最新版的修復檔案釋出就立刻將所有的Exchange進行更新，以避免漏洞的威脅
2. WAF(Web Application Firewall)以及IPS(Intrusion Prevention System)：定期地將WAF或IPS軟硬體設備更新至最新的特徵碼來檢測異常行為
3. 停用部分Exchange功能：停用整合通訊服務(Unified Messaging)以及離線通訊錄(OAB)的虛擬目錄，依過往的經驗來看，通常這兩個元件會讓Exchange伺服器被拿來利用
4. Microsoft Exchange On-Premises Mitigation Tools：如果真的一定要採用完整版的Exchange伺服器，建議把自動更改URL Rewrite的設定權限做好限制，定期執行Microsoft Safety Scanner來緩解核心漏洞的威脅

## 總結

作為公司內的藍隊人員應該總得時時刻刻的關注最新的資安新聞以及弱點修補消息，透過RSS接收像是The Hacker News、Akamai Security Intelligence、Unit42等大型知名資安公司的最新文章

雖然本文談ProxyLogon有些稍嫌過時，但當時算是很危險的情況，而本文所觀察以及採取的策略有些至今日還是很實用，不管怎麼說，我們總得在第一時間點就立刻制定出修補計劃來回應相關的事件，有可以參考的方向來立刻動作，到時才不會讓自己被公司上層人員靠北

但如果整個事件還處在Zero-Days的狀態之下，也沒有任何修補程式可以進行安裝，這段空窗期我們能做的也只有一直檢視組織內部自身的資安防護政策了，平時就必須確保自家的資安防護策略需不需要提高門檻，但也要注意會不會影響到開發部門的方便性

但如果讀者觀察到內部網路的異常行為流量，就應該立即報告或是親自檢查該行為是不是公司人員造成的，畢竟請你來就是為了降低組織因爲漏洞攻擊造成的危害風險，共勉之

[^1]: ESET, “ESET INDUSTRY REPORT ON GOVERNMENT: Targeted but not alone, ” 2021, https://web-assets.esetstatic.com/wls/2021/04/ESET_Industry_Report_Government.pdf
[^2]: 1chig0, “Exchange “ProxyLogon”系列漏洞分析,” 2021, https://hackmd.io/@1chig0/rkzZhA5Hd 
[^3]: Dr. Suleyman Ozarslan, “Tactics, Techniques, and Procedures (TTPs) Used by HAFNIUM to Target Microsoft Exchange Servers,” 2023, https://www.picussecurity.com/resource/blog/ttps-hafnium-microsoft-exchange-servers

