---
title: "網頁應用服務安全性評估"
date: 2025-10-01
description: "網頁，一個你我每天都會使用到的應用服務或程式，可以說是每天醒來後第一個接觸的系統了，現代許多框架或主機服務都可以部署成網頁應用服務了，但在網路安全的世界中，方便即是安全的反面"
hideTOC: false
targetKeyword: 網頁應用服務安全
draft: false
tags: 
  - "burp-suite"
  - "gobuster"
  - "nmap"
  - "wappalyzer"
  - "灰箱測試"
  - "白箱測試"
  - "網頁安全"
  - "黑箱測試"
lang: zh
---

## 前言

網頁，一個你我每天都會使用到的應用服務或程式，可以說是每天醒來後第一個接觸的系統了，現代許多框架或主機服務都可以部署成網頁應用服務了，但在網路安全的世界中，方便即是安全的反面，隨著使用越來越多的相依性套件、不安全的設定配置、不成熟的程式架構以及商業模型上特定的缺陷等因素，造成服務上架後多出許多的攻擊方面

尤其網頁應用服務的架構繁雜，需要使用多種程式語言以及框架構成，每新增一個技術進來就增加了更多漏洞的可能性，不過常見的漏洞概念上都差不多一樣，且框架用的技術堆疊起來也不影響這些漏洞的表現，所以我們在探討這些網頁安全時都不會差太多

## 評估方法

在我們討論枚舉跟漏洞利用之前，我們先說明一下網頁應用服務滲透測試方法的差異性，站在滲透測試員的角度來看我們會有三個方法來對網頁服務進行測試(一般前後端開發人員認知中應該只有兩種方法)，由委託方提供的資訊種類、測試範圍以及委託規則來決定

1. 白箱測試(White-box)：指測試員可以自由的存取服務的原始碼、架構以及設計文件等詳細資訊，由於這種類型的測試可以拿到所有資料，通常要具備對軟體工程很資深的了解，直接對原始碼跟應用服務做code review找出有可能出現漏洞的邏輯區塊，但因為需要看整個架構，所以通常要花上大量的時間
2. 黑箱測試(Black-box)：又稱零知識測試，委託方不給測試員任何一丁點的資訊，所以必須要由測試員自行搜集到所有想知道的資料，這種行為也常常是賞金獵人(Bug Bounty)在做的事情
3. 灰箱測試(Grey-box)：介於白箱測試與黑箱測試之間，委託方會給一咪咪的目標範圍資訊，可能是驗證的方法、憑證的線索或者一些架構上的資訊，但不給全貌，測試員還是得自己枚舉資訊來湊齊整個路徑

既然要談安全性評估，就從最難的做起，我們從黑箱測試出發，透過枚舉跟漏洞利用來檢測網頁應用服務的漏洞，儘管這些漏洞與攻擊方法成千上萬，不代表我們沒有一張地圖可以參考，在網頁安全中最常見的漏洞皆是參考[OWASP Top 10](https://owasp.org/www-project-top-ten/)清單

這份清單由OWASP基金會維護，宗旨是提升軟體安全性，為了達到這點目的，他們每一、兩年就會重新審視一下目前網頁應用服務上前十大危險的漏洞，標示各項風險以及提供修補策略，把OWASP Top 10當作我們的地圖，就能夠在測試環境中知道自己身在何處，同時知道哪面是最脆弱的牆

## 評估工具

在詳細枚舉網頁應用服務之前，我們先熟悉一下有哪些工具可以使用，例如之前常用的Nmap就可以針對網頁服務進行探索，搭配Wappalyzer網頁套件，我相信大部分人應該都有裝，這是一款可以將目標應用服務背後使用的框架給分析出來的線上服務套件，以及Gobuster一樣用來執行目錄或者檔案的搜尋

最後我們會介紹一下網頁安全最常使用到的神器，Burp Suite Proxy，如果讀者熟悉了這款工具，絕對會愛上它，甚至之後做網頁測試都離不開它

### Nmap探索網頁伺服器足跡

如之前的[[active-information-gathering-dns-enumeration-and-port-scanning|主動式資料搜集之DNS枚舉與Port掃描]]所提，Nmap是為了初期主動式資料搜集而生的枚舉工具，自然也可以套用在網頁應用服務上頭，不如說Nmap就是為了網頁安全而生，只要目標機器上80或443的port是開著的，我們有什麼理由不更進一步的探索裡面的服務呢？讀者應該都還記得怎麼施展這招式的，"-sV"參數指定目標IP以及針對網頁服務80 port施行"-p80"

```
kali@kali:~$ sudo nmap -p80  -sV 192.168.50.20
Starting Nmap 7.92 ( https://nmap.org ) at 2025-09-29 05:13 EDT
Nmap scan report for 192.168.50.20
Host is up (0.11s latency).

PORT   STATE SERVICE VERSION
80/tcp open  http    Apache httpd 2.4.41 ((Ubuntu))
```

輕而易舉的就可以得知目標機器是Ubuntu系統且架設了2.4.41版本的Apache伺服器，想要獲得更多資訊的話，還記得我們在[[vulnerability-scanning-with-nmap|Nmap 弱點掃描]]一文中提到的超強天賦嗎？搭配NSE腳本就可以針對特定的服務進行偵察，例如http-enum可以執行初期的網頁伺服器足跡探索

```
kali@kali:~$ sudo nmap -p80 --script=http-enum 192.168.50.20
Starting Nmap 7.92 ( https://nmap.org ) at 2025-09-29 06:30 EDT
Nmap scan report for 192.168.50.20
Host is up (0.10s latency).

PORT   STATE SERVICE
80/tcp open  http
| http-enum:
|   /login.php: Possible admin folder
|   /db/: BlogWorx Database
|   /css/: Potentially interesting directory w/ listing on 'apache/2.4.41 (ubuntu)'
|   /db/: Potentially interesting directory w/ listing on 'apache/2.4.41 (ubuntu)'
|   /images/: Potentially interesting directory w/ listing on 'apache/2.4.41 (ubuntu)'
|   /js/: Potentially interesting directory w/ listing on 'apache/2.4.41 (ubuntu)'
|_  /uploads/: Potentially interesting directory w/ listing on 'apache/2.4.41 (ubuntu)'

Nmap done: 1 IP address (1 host up) scanned in 16.82 seconds
```

透過這個腳本我們發現了幾個有趣的資料夾，後續的測試環節就可以針對這些目錄進行更進一步的調查，利用NSE得知了更多的應用服務資訊，我們就能夠在其他工具中做二次驗證

### Wappalyzer

除了利用Nmap做主動式的資料搜集之外，我們還可以同時被動式的用[wappalyzer](https://www.wappalyzer.com/)來搜集網頁應用服務背後的架構資訊，註冊免費版的帳號之後就可以拿來看secologies.com網域

![Wappalyzer-result](https://media.secologies.com/Wappalyzer-result.webp)

這個線上服務能夠快速的分析出背後的OS資訊、UI使用的框架以及網頁伺服器等等，同時也會揭露使用到哪些JavaScript函式庫，如果函式庫版本是存在漏洞的話這些資料將會非常有用，同時他們也有開發瀏覽器的插件版本，可以直接安裝在讀者的介面上，雖然資訊較少但偶爾挺方便的

### Gobuster暴力搜尋目錄

一旦我們發現到目標網頁伺服器上有服務正在運作，下一步不用想，直接把所有可以公開存取的目錄跟檔案給搜尋出來，所以我們需要一款可以平行化針對所有路徑(包括隱藏但可以透過指令找到的)進行探索的工具，這個哪裡買得到呢？

Gobuster，您的好夥伴，由Go語言寫成幫助我們進行大量的枚舉工具，使用字詞表暴力破解式的探索所有目錄及檔案，不過再次聲明，由於threads開越多，越會造成目標機器的負擔，且會顯示出我們的行蹤，所以得適時的考量使用時機

另外Gobuster支援多種枚舉模式，包括模糊測試以及DNS模式，但目前我們先考慮"dir"模式就好了，只要搜尋檔案及路徑，"-u"參數指定目標IP，而字詞表選擇記得加上"-w"參數，預設會開10條threads，如果想要更隱密的執行，我們可以用"-t"參數把threads數量調低

```
kali@kali:~$ gobuster dir -u 192.168.50.20 -w /usr/share/wordlists/dirb/common.txt -t 5
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.50.20
[+] Method:                  GET
[+] Threads:                 5
[+] Wordlist:                /usr/share/wordlists/dirb/common.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2022/03/30 05:16:21 Starting gobuster in directory enumeration mode
===============================================================
/.hta                 (Status: 403) [Size: 278]
/.htaccess            (Status: 403) [Size: 278]
/.htpasswd            (Status: 403) [Size: 278]
/css                  (Status: 301) [Size: 312] [--> http://192.168.50.20/css/]
/db                   (Status: 301) [Size: 311] [--> http://192.168.50.20/db/]
/images               (Status: 301) [Size: 315] [--> http://192.168.50.20/images/]
/index.php            (Status: 302) [Size: 0] [--> ./login.php]
/js                   (Status: 301) [Size: 311] [--> http://192.168.50.20/js/]
/server-status        (Status: 403) [Size: 278]
/uploads              (Status: 301) [Size: 316] [--> http://192.168.50.20/uploads/]

===============================================================
2025/09/30 05:18:08 Finished
===============================================================
```

我們實驗用"/usr/share/wordlist/dirb/"底下的"common.txt"當作字詞表找到了十個結果，其中有四個因為權限不足而無法存取，但另外六個是可以公開存取的，算是大豐收

## Burp Suite網頁安全測試

[Burp Suite](https://portswigger.net/burp)是一款圖形界面的網頁應用服務安全測試整合平台，意指該工具將數個不同的子工具包裝再一起，我們使用的是免費的社群版，裡面的功能都必須手動設定與操作，如果讀者熟悉了免費版想要商業版的話，商業版包含超強大的漏洞掃描器，但免費版的功能就足夠多了，且一個都很值得花時間了解

其中一個很重要的功能就是攔截HTTPS流量，但這需要Burp憑證才能使用，有興趣的讀者可以看相關方案，在Kali Linux 2025.03 Arm64版本中，Burp Suite在Apps的01 Reconnaissance目錄底下

![BurpSuite](https://media.secologies.com/BurpSuite.webp)
*[^2]*

如果讀者的Kali沒有的話，也可用"burpsuite"來安裝以及啟動

```
┌──(kali㉿kali)-[~/Downloads]
└─$ burpsuite    
Command 'burpsuite' not found, but can be installed with:
sudo apt install burpsuite
Do you want to install it? (N/y)y
sudo apt install burpsuite
[sudo] password for kali: 
Installing:                     
  burpsuite

Installing dependencies:
  java-wrappers

Summary:
  Upgrading: 0, Installing: 2, Removing: 0, Not Upgrading: 1338
  Download size: 272 MB
  Space needed: 286 MB / 22.9 GB available

Continue? [Y/n] Y
Get:1 http://mirror.twds.com.tw/kali kali-rolling/main arm64 java-wrappers all 0.5 [8,848 B]
Get:2 http://free.nchc.org.tw/kali kali-rolling/main arm64 burpsuite arm64 2025.7.4-0kali1 [272 MB]
Fetched 272 MB in 5s (49.7 MB/s)    
Selecting previously unselected package java-wrappers.
(Reading database ... 443620 files and directories currently installed.)
Preparing to unpack .../java-wrappers_0.5_all.deb ...
Unpacking java-wrappers (0.5) ...
Selecting previously unselected package burpsuite.
Preparing to unpack .../burpsuite_2025.7.4-0kali1_arm64.deb ...
Unpacking burpsuite (2025.7.4-0kali1) ...
Setting up java-wrappers (0.5) ...
Setting up burpsuite (2025.7.4-0kali1) ...
Processing triggers for kali-menu (2025.2.7) ...
Processing triggers for man-db (2.13.1-1) ...

kali@kali:~$ burpsuite
```

讀者第一次啟動BurpSuite的話會跳出一個視窗說Java Runtime Environment(JRE)在該環境還沒測試完全的warning，這是因為Kali Linux一直在自己kernel上內建的JRE版本測試Burp Suite，所以我們可以按下OK直接忽略這個告示

![BurpSuite-JRE-warning](https://media.secologies.com/BurpSuite-JRE-warning.webp)

之後就可以正常啟動，首次我們選擇暫存的專案直接下一步

![BurpSuiteTemporaryProject](https://media.secologies.com/BurpSuiteTemporaryProject.webp)

並且直接採用Burp Suite預設的選項就可以了，直接啟動

![Burp-configuration](https://media.secologies.com/Burp-configuration.webp)

過段時間UI就會載入進來

![BurpSuite-user-interface](https://media.secologies.com/BurpSuite-user-interface.webp)

### Web Proxy

除了統整型的儀表板，讀者可以注意到上方的每個子頁面，每個都是不同的網頁工具，我們從Proxy工具開始，Web Proxy是指那些在網頁使用者跟網頁伺服器通道之間，利用硬體或軟體攔截請求或送出回應的代理器，意思是系統管理員或者滲透測試員可以手動或自動變更截取到的請求

有些web proxy甚至能夠攔截商業等級的TLS加密流量，通常是一台TLS攔截硬體設備，它可以解密跟重新加密流量，讓所有進來或出去的HTTPS流量都檢查過沒有奇怪的資訊在裡面才放行

而我們現在想看的Burp Proxy工具則可以攔截任何從網頁端發出的請求，檢查裡面的標頭檔以及資訊，再送去網頁伺服器那端，所以有辦法變更請求的參數名稱或者填入的單位等等，甚至可以新增我們想要的標頭檔，這可以用來測試網頁伺服器如何回應我們加料過的輸入請求

舉例來說，前端頁面限制輸入欄位最多只能20個字元，但我們用Burp Suite變更請求送出成30個字元，我們來實驗看看，先打開BurpSuite上方Proxy子頁面，在Intercept預設進去攔截工具的狀態是還未開啟的，當Intercept是打開的話，我們必須手動設定把轉寄的流量送到某個終點

同樣的，我們也可以選擇丟掉該請求，Burp Suite做這個開關功能是因為我們有時的確要攔截流量變更內容看網頁伺服器的回應，但如果我們不需要回應的話，單純瀏覽網頁時每次還得開開關關的實在會很煩

![turning-off-intercept](https://media.secologies.com/turning-off-intercept.webp)

接著我們來看監聽的選項，在Proxy settings子頁面底下，這邊可以設定proxy請求時想要監聽哪個網路介面跟port

![proxy-listeners](https://media.secologies.com/proxy-listeners.webp)

預設上Burp Suite的監聽是設定localhost:8080，這個host跟port是我們在local測試時一定會經過Burp Suite的流量，雖然目前BurpSuite已經有內建的Chromium原生瀏覽器介面了，但我們在Kali中還是一樣用火狐瀏覽器來操作吧，畢竟瀏覽器的操作比較多元跟彈性

所以我們嘗試在kali上操作Firefox瀏覽器，而Burp Suite則作為Proxy，我們的環境則指定loopback的IP 127.0.0.1跟8080 port，目前我們只攔截內部服務流量，但如果讀者想要截取多組機器的流量，就必須設定一組獨立的IP，那組獨立外部IP要能夠聯網存取，讓內部網路作為Proxy

而我們希望Proxy攔截越多越好，所以把所有協定的選項都打開，讓目標所有的請求流量都能夠擋下來，在火狐裡面點選右上角進到設定頁面，在General頁面下拉到最後看到網路設定，點開設定就可以設置連線配置了

![firefox-setting](https://media.secologies.com/firefox-setting.webp)

![firefox-network-setting](https://media.secologies.com/firefox-network-setting.webp)

![firefix-connect-setting](https://media.secologies.com/firefix-connect-setting.webp)

這樣就可以把所有流量送到Burp Suite裡了，請記得將瀏覽器內其他的頁面都關掉，之後把Burp Suite的監聽打開，這裡嘗試瀏覽OffSec的網站，我們可以在歷史紀錄中發現一些代理器攔截到的流量

![Burp-Suite-HTTP-history-2](https://media.secologies.com/Burp-Suite-HTTP-history-2.webp)

同時我們也可以看到針對網站我們送出的請求內容，如果讀者在某些網頁中一直是載入的情況下，可能是因為Proxy攔截造成的，此時只要Forward我們操作的請求，應該就可以正常讀取網頁了，且流量應該也都有正確在歷史紀錄裡出現，點擊其中一個請求，我們能夠從下面的Burp U中看到使用者請求以及伺服器回應的完整內容

![inspecting-HTTP-request-2](https://media.secologies.com/inspecting-HTTP-request-2.webp)

通常左半部會出現使用者送出的請求內容，而伺服器回應則會出現在右半部，這正是Burp其中一個強大的功能，能夠詳細的檢視每一個請求執行狀況以及收到的回應

### Repeater

除了Proxy的功能之外，Repeater是另一項Burp Suite很重要的功能，Repeater可以讓我們建造一份新的請求，或者修改原先就有的一條請求，並且重新寄送該份請求來獲得不一樣的回應，我們可以從歷史紀錄中挑選一條請求右鍵選擇寄送給Repeater

![sending-request-to-repeater](https://media.secologies.com/sending-request-to-repeater.webp)

如果我們點選到Repeater頁面的話，就可以在左側看到剛才我們新增進去的該請求，事實上我們可以新增多條請求進Repeater裡，並且用多個子視窗顯示，我們點下Send來寄送請求，Burp Suite就會顯示伺服器的回應在右側，裡面包含回應的標頭檔以及沒有渲染過的內容

![repeater-request-and-response](https://media.secologies.com/repeater-request-and-response.webp)

### Intruder

下一個重要的基本功能則是Intruder，但測試之前我們先建立實驗環境，在我們的Kali Linux底下"/etc/hosts"檔案要設置靜態IP給我們實驗的offsecwp測試網站，讀者要注意的是某些應用程式是吃hostname來跳轉的

所以如果我們不更新"/etc/hosts"檔案的話有可能會match不到，就有可能讓我們的瀏覽器跟其他工具無法互動

```
┌──(kali㉿kali)-[~]
└─$ cat /etc/hosts
127.0.0.1	localhost
127.0.1.1	kali
192.168.50.16	offsecwp

# The following lines are desirable for IPv6 capable hosts
::1     localhost ip6-localhost ip6-loopback
ff02::1 ip6-allnodes
ff02::2 ip6-allrouters
```

Intruder功能就如其名，是設計來自動入侵的模擬攻擊工具，從最簡易到最困難的網頁應用服務攻擊手法都可以組成，我們來實驗看看密碼的暴力破解攻擊，因為我們實驗的目標是新的，所以也可以重開一個新的Burp Suite程式，重新配置我們之前的做法，接著我們開啟 http://offsecwp/wp-login.php 網頁

我們要測試的目標是wordpress動態網站架設，我們猜測wordpress的帳號預設都是admin，但密碼不知道，所以我們要進行暴力破解

![Simulating-a-failed-WordPress-login](https://media.secologies.com/Simulating-a-failed-WordPress-login.webp)
*[^2]*

回到Burp Suite我們查看HTTP歷史紀錄，針對一條POST請求至/wp-login.php的項目右鍵選擇寄送給Intruder

![Sending-the-POST-request-to-Intruder](https://media.secologies.com/Sending-the-POST-request-to-Intruder-.webp)
*[^2]*

我們到Intruder頁面底下，選擇那條我們想要修改的POST請求，並且點選到Position子頁面，我們知道user的帳號是admin，所以只要針對密碼欄位進行暴力破解即可，首先我們透過右邊的Clear先把所有欄位都清空，然後選到pwd的欄位地方按下Add的功能

![Assigning-the-password-value-to-the-Intruder-payload-generator](https://media.secologies.com/Assigning-the-password-value-to-the-Intruder-payload-generator.webp)
*[^2]*

這樣我們就告知了Intruder只有密碼欄位的值根據不同的請求就做一次修改，但在我們進行猜測前，要先準備好字詞表給它，我們從"/usr/share/wordlists/rockyou.txt"這個rockyou的字詞表內取出前十個值

```
kali@kali:~$ cat /usr/share/wordlists/rockyou.txt | head
123456
12345
123456789
password
iloveyou
princess
1234567
rockyou
12345678
abc123
```

接著我們到Payloads子頁面底下，把上述的值放進Payload當中，而形式就選simple即可

![Pasting-the-first-10-rockyou-entries](https://media.secologies.com/Pasting-the-first-10-rockyou-entries-.webp)
*[^2]*

如果一切都準備好了，我們就可以按下右上角的開始攻擊選項，過程中會跳出一些功能受限的告示，我們可以直接忽略，畢竟這不影響本次實驗，一旦測試完成後，我們可以直接比較這十項結果跟最一開始的請求有何不同

![Inspecting-Intruders-attack-results](https://media.secologies.com/Inspecting-Intruders-attack-results-.webp)
*[^2]*

我們可以發現Wordpress回應給我們的請求有不同於4開頭的狀態碼，代表有可能就是正確的密碼，而我們最一開始的假設是如果發現了正確的密碼的話就可以登入進去Wordpress的管理員帳號了

![Logging-to-the-WP-admin-console](https://media.secologies.com/Logging-to-the-WP-admin-console-.webp)
*[^2]*

> 有一點要請讀者特別注意的是，如果先前瀏覽器將Burp Suite視為Proxy之後，麻煩每次測試完關掉Burp Suite時記得把瀏覽器的網路設定調回預設的系統Proxy，否則一段時間回來結果發生網頁一直載入卡住問題而您又毫無頭緒時會花很多時間排錯(血淚談😭)

以上就是一些網頁應用服務安全性評估方法及工具的介紹，感謝你的閱讀

[^1]: OffSec, "Introduction to Web Application Attacks: Web Application Assessment Methodology," The Penetration Testing with Kali Linux (PEN-200).

[^2]: OffSec, "Introduction to Web Application Attacks: Web Application Assessment Tools," The Penetration Testing with Kali Linux (PEN-200).

