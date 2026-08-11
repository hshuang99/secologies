---
title: "主動式資料搜集之DNS枚舉與Port掃描"
date: 2025-09-13
description: "不同於被動式，在主動式資料搜集時我們將直接與目標服務進行互動，目標的機器上肯定有著無數的服務可以接觸"
tags: 
  - "dns"
  - "dns枚舉"
  - "lolbas"
  - "lolbins"
  - "nmap"
  - "tcp-udp"
  - "主動式資料搜集"
  - "端口掃描"
targetKeyword: 主動式資料蒐集
lang: zh
---

## 前言

不同於被動式，在主動式資料搜集時我們將直接與目標服務進行互動，目標的機器上肯定有著無數的服務可以接觸，例如Active Directory(AD)就屬於很多人在搜集的服務，要找到目標服務，我們就必須使用許多常見的技巧來探索，例如機器port掃描、DNS、SMB、SMTP以及SNMP等服務的枚舉

這類的工具在Kali Linux上皆已安裝完成，但有時候在進行滲透測試時我們沒辦法使用熟悉的工具，有時候在Windows工作站裡只能夠用Windows系統上能執行的工具，當我們必須自給自足(Living Off the Land)時得利用Windows上預設安裝好的編譯檔(Binaries)來組合我們的分析工具，這些編譯檔簡稱LOLBins(Living Off the Land Binary files)，或者近期比較常稱作編譯檔、腳本(Scripts)或函式庫(Libraries)

通常為了組合出分析工具或攻擊劇本(Living Off the Land Binaries and Scripts, LOLBAS)，我們不只需要編譯檔，也同時需要一些腳本與函式庫的幫忙，尤其腳本跟函式庫都會是Windows原生安裝時就預設好的，例如whoami.exe、ping.exe以及netstat.exe等原生工具，都可以為LOLBAS出一份力，畢竟這些預設的元件在使用時都不會觸發Windows Defender

儘管LOLBAS一般是利用系統上的工具來做非預期或漏洞利用後觀測的腳本，但我們也會嘗試利用這些原生的編譯檔枚舉目標機器，像是nslookup或net等工具的協助，之前提到每一階段都需要搜集現況來做決策，所以我們偶爾也必須用合法的手段來搜集相關資訊

## DNS枚舉

網域名稱系統(Domain Name System, DNS)是一組分散式的資料庫，用來轉譯IP位址成讀者方便閱讀的網域名稱，是網際網路上最重要的其中一種系統，資料庫裡的結構分成數種分層式的區域(zone)，從最上層的root區域開始向下，每個網域可以使用數種不同型態的DNS紀錄，一些常見的DNS紀錄像是：

- NS：NameServer，該紀錄包含管理該網域紀錄的伺服器名稱
- A：或者稱作主機紀錄，用來記錄主機的IPv4位址
- AAAA：用來記錄主機的IPv6位址
- MX：Mail Exchange紀錄，用來記錄網域處理信件服務的伺服器名稱，一個網域可以擁有多組MX紀錄
- PTR：指標紀錄(Pointer Records)，用來反向查詢區域內紀錄的IP位址
- CNAME：標準名稱紀錄(Canonical Name Records），紀錄主機紀錄的其他種別稱
- TXT：文字紀錄(Text records)可以插入任何資料或用作其他用途，例如申請Google GA4就可以放進去網域擁有驗證的一串ID進TXT紀錄裡

基於DNS裡會包含許多種資訊，在針對目標進行主動式資料搜集時絕對不會放過，我們可以用"host"這個指令先找出網域的IP

```
host secologies.com
```

```
secologies.com has address 104.21.43.254
secologies.com has address 172.67.192.71
secologies.com has IPv6 address 2606:4700:3031::ac43:c047
secologies.com has IPv6 address 2606:4700:3030::6815:2bfe
secologies.com mail is handled by 10 mx1.privateemail.com.
secologies.com mail is handled by 10 mx2.privateemail.com.
```

預設來看host這個指令會查找A record，但如果想要知道其他種資訊，例如MX或TXT的紀錄也可以在指令裡指定某種紀錄型態，例如"-t"

```
host -t mx secologies.com
```

```
secologies.com mail is handled by 10 mx1.privateemail.com.
secologies.com mail is handled by 10 mx2.privateemail.com.
```

我們指定目標是MX record回傳給5組不同的信箱伺服器紀錄，每一台都有不同的優先度(10, 10, 10, 20, 15)，數字最小的代表優先順序最高，就可以用來處理信件的回應或接收，接著如果我們指定"TXT"試試看呢？

```
host -t txt secologies.com
```

```
secologies.com descriptive text "v=spf1 include:spf.privateemail.com a mx include:_spf.mlsend.com ~all"
```

我們就可以針對secologies.com這個網域得到一些初始資料，接著利用其他種DNS搜尋來發現更多種在相同網域下的主機或IP位址，舉例來說，我們已經知道secologies.com這個底下有一台網頁伺服器，我們再次針對這個主機名稱

```
host www.secologies.com
```

```
www.secologies.com is an alias for secologies.com.
secologies.com has address 104.21.43.254
secologies.com has address 172.67.192.71
```

接著我們針對secologies.com的主機名稱做一些臆測，來觀察不同的搜尋結果，例如嘗試主機名稱有"idontexist"

```
host idontexist.secologies.com
```

```
Host idontexist.secologies.com not found: 3(NXDOMAIN)
```

雖說回傳NXDOMAIN not found表示"idontexist"這個主機名稱不存在，但secologies.com這台卻是存在的，所以就可以根據基底網域來暴力破解式的組合各式各樣覺得有可能的主機名稱，開發腳本來加快我們搜尋的速度

暴力破解法是一種反覆嘗試與修正的方法，用來尋找有用的資訊像是網頁伺服器的目錄、使用者名稱或密碼組合等等，或者目前是要搜尋有用的DNS紀錄，可以使用一種叫做字詞表(wordlist)的清單，裡面會包含一些常見的主機名稱，用來測試目標主機底下所有DNS紀錄的回應

目前我們測試了逆向搜尋，根據主機名稱的IP位址來搜尋其他有效的主機名稱，如果"host"解析出了對應的主機名稱跟IP位址，就可以猜測是某個功能伺服器，首先來建立一個DNS搜尋清單，裡面存一些常見的主機名稱：

```
hshuang@Hong-Sheng-MacBook-Pro Penetration % cat list.txt
www
ftp
mail
owa
proxy
router
```

接著我們就可以用command line的方法解析並測試每一組可能的主機名稱

```
hshuang@Hong-Sheng-MacBook-Pro Penetration % for ip in $(cat list.txt); do host $ip.secologies.com; done
mail.secologies.com has address 172.67.192.71
mail.secologies.com has address 104.21.43.254
mail.secologies.com has IPv6 address 2606:4700:3031::ac43:c047
mail.secologies.com has IPv6 address 2606:4700:3030::6815:2bfe
```

利用這個簡單的字詞表我們可以看到"www"有回應，"ftp"、"mail"、"owa"、"proxy"、"router"倒是沒有回應，讀者可以建立自己更龐大的字詞表，或者利用SecLists專案內的字詞表，Linux環境的讀者可以安裝該表

```
sudo apt install seclists
```

安裝好該表會出現在"/usr/share/seclists"內可以呼叫，如果其他種的主機名稱組合有回應，就可以根據該回應進一步的掃描那個IP位址的網段來逆向找出更多台有關聯的機器

例如根據我目前的主機IP 162.0.212.3位址掃到162.0.212.254，然後把無效的結果過濾掉，只顯示出那些真正有回應的機器

```
hshuang@Hong-Sheng-MacBook-Pro Penetration % for ip in $(seq 3 254); do host 162.0.212.$ip; done | grep -v "not found"
3.212.0.162.in-addr.arpa domain name pointer beta.supersonic.ai.
4.212.0.162.in-addr.arpa domain name pointer blastocele-squalodon.initrdns.web-hosting.com.
5.212.0.162.in-addr.arpa domain name pointer creping-nonnaturals.initrdns.web-hosting.com.
6.212.0.162.in-addr.arpa domain name pointer milkwoods-schlock.initrdns.web-hosting.com.
7.212.0.162.in-addr.arpa domain name pointer shout-nbp.initrdns.web-hosting.com.
8.212.0.162.in-addr.arpa domain name pointer lambency-facinorous.initrdns.web-hosting.com.
9.212.0.162.in-addr.arpa domain name pointer pretranslate-scirrhosis.initrdns.web-hosting.com.
10.212.0.162.in-addr.arpa domain name pointer apneumatic-unpacifistic.initrdns.web-hosting.com.
11.212.0.162.in-addr.arpa domain name pointer cook-bicol.initrdns.web-hosting.com.
12.212.0.162.in-addr.arpa domain name pointer cunina-landholding.initrdns.web-hosting.com.
....
```

我們用逆向lookup DNS找出了同網段IP位址內有效的主機，如果團隊經過評估覺得同網段內有什麼主機是可以利用的，就進一步推斷這些結果可以再用"mail2"、"router"等等挖掘更深入，通常這樣的掃描方法需要經過好幾輪的紀錄，基於收到何種資訊來決定後續要做出哪種改變

除了這些基本款挖掘DNS的方法之外，也有其他種自動化工具在Kali Linux內可以用來做DNS枚舉，其中兩款就是"DNSRecon"以及"DNSenum"

### DNSRecon

DNSRecon是用python寫成的進階版DNS枚舉腳本，我們針對secologies.com來執行看看，使用"-d"選項指定網域名稱，並且用"-t"來指定枚舉的形式，目前我們用一般版形式即可

```
hshuang@Hong-Sheng-MacBook-Pro Penetration % dnsrecon -d secologies.com -t std
2026-01-13T21:56:31.650320-0500 INFO Starting enumeration for domain: secologies.com
2026-01-13T21:56:31.650504-0500 INFO std: Performing General Enumeration against: secologies.com...
2026-01-13T21:56:31.879305-0500 INFO DNSSEC is configured for secologies.com
```

該工具成功掃描目標的DNS枚舉資訊，前面提到字詞表其實也可以拿來利用，如果我們想要測試暴力破解法，我們除了用"-d"指定目標網域名稱之外，還需要用"-D"來指定檔案名稱內取得潛在的子網域字串，同樣用"-t"指定執行形式，不過這次我們必須選擇"brt" (brute-force)來執行

```
hshuang@Hong-Sheng-MacBook-Pro Penetration % dnsrecon -d secologies.com -D ./list.txt -t brt
2026-01-13T21:57:57.866761-0500 INFO Using the dictionary file: ./list.txt (provided by user)
2026-01-13T21:57:57.866882-0500 INFO Starting enumeration for domain: secologies.com
2026-01-13T21:57:57.867003-0500 INFO brt: Performing host and subdomain brute force against secologies.com...
2026-01-13T21:57:58.286886-0500 INFO     A mail.secologies.com 172.67.192.71
2026-01-13T21:57:58.353642-0500 INFO 1 Records Found
2026-01-13T21:57:58.354098-0500 INFO Completed enumeration for domain: secologies.com
```

同樣根據字詞本裡的可能性找出了一些結果

### DNSEnum

DNSEnum則是另一個有名的DNS枚舉工具，同樣可以指定幾項參數，但通常只需要選擇目標網域名稱即可

```
(kali@kali)-[~]$ dnsenum secologies.com
dnsenum VERSION:1.3.1

----- secologies.com   ----- 
                                                                             
                                                                             
Host's addresses:                                                            
__________________                                                           
                                                                             
secologies.com.                          5        IN    A        172.67.192.71

                                                                             
Name Servers:                                                                
______________                                                               
                                                                             
evangeline.ns.cloudflare.com.            5        IN    A        172.64.34.6 
ernest.ns.cloudflare.com.                5        IN    A        108.162.193.164

                                                                             
Mail (MX) Servers:                                                           
___________________                                                          
                                                                             
mx2.privateemail.com.                    5        IN    A        162.255.118.8
mx1.privateemail.com.                    5        IN    A        162.255.118.7

                                                                             
Trying Zone Transfers and getting Bind Versions:                             
_________________________________________________                            
                                                                             
                                                                             
Trying Zone Transfer for secologies.com on evangeline.ns.cloudflare.com ...                                                                                 
AXFR record query failed: Connection timed out                                                                                                              
                                                                                                                                                            
Trying Zone Transfer for secologies.com on ernest.ns.cloudflare.com ...                                                                                     
AXFR record query failed: Connection timed out                                                                                                              
                                                                                                                                                            
                                                                                                                                                            
Brute forcing with /usr/share/dnsenum/dns.txt:                                                                                                              
_______________________________________________                    
...
```

利用這個工具我們還查到之前沒看到的其他紀錄跟對應的IP等資訊，這些新得到的主機名稱與IP可以進一步做服務的枚舉或port掃描，如同上面提到資料搜集是需要經過好幾輪的步驟，我們得用這些新資訊額外做被動式或主動式的方法來找出其他潛在的資料

枚舉的工具除了實務上的操作還有想法上的指引，所以我們必須非常熟悉相關的工具，而從Windows上其實也有一些工具可以使用，在LOLBAS之外，"nslookup"在Windows上是其中一種非常棒的原生DNS枚舉工具，通常在自給自足的環境中很常用到，通常要是LOLBAS的工具是必須能夠用來執行非預期的code

切換到Windows 11的環境中，我們打開命令提示視窗查詢secologies.com主機的A紀錄，用"nslookup"來嘗試解析相關的資訊

```
C:\Users\hshuang> nslookup secologies.com
Server:		8.8.8.8
Address:	8.8.8.8#53

Non-authoritative answer:
Name:	secologies.com
Address: 172.67.192.71
Name:	secologies.com
Address: 104.21.43.254
```

nslookup成功解析出來網域名稱以及IP，跟Linux上的工具類似，在Windows用nslookup一樣可以指定特定的機器與IP，還有指定需要何種紀錄，如果我們嘗試指定TXT的話可以使用

```
C:\Users\hshuang> nslookup -type=TXT info.secologies.com 172.67.192.71
....
```

如果目標的機器上有相關的紀錄就會成功回應，尤其nslookup還可以用Powershell或Batch的方式寫成更近一步的分析套件，如果在Windows上只有這個工具可用也非常足夠了

## TCP/UDP Port掃描理論

Port掃描針對目標主機的服務進行TCP/UDP port查詢，尤其我們可以制定一些預期內的服務進行搜尋，並且看相關的版本來查找是否有存在的漏洞可以增加攻擊層面，不過要注意的是在某些法案中，port掃描的操作並非一般使用者的行為所以算非法的，所以只有在目標對方有意願時才可以進行掃描，例如紅隊演練簽約或者查找漏洞時公司制定的範圍內才可以進行掃描

了解port掃描帶來的後果是很重要的，尤其是掃描哪些特定的port會帶來何種影響，因為掃描時目標的網路設備會錄下相關的流量，如果目標不知道流量是哪來的，就會認為是入侵的行為，因為處理port掃描也需要耗費server的計算，若掃描讓server負擔過大也許會觸發IDS/IPS裝置，錯誤的掃描選擇甚至會讓目標機器卡住，這肯定會打草驚蛇

選擇恰當的port進行掃描方法可以有效的提升我們在滲透測試時的效率，同時也可以提升被發現的風險，選定一個範圍做掃描而不要直接打全部的port，最建議的是先從80跟443的網頁服務進行掃描就好了，找出所有的網頁伺服器之後，再針對這些主機進行全port的掃描或其他的枚舉也不遲

當我們把所有目標主機裡的所有port掃完一次後，就可以漸漸的縮小範圍，對於每一個子目標在挖掘更多的資訊，讀者可以將Port掃描視為動態調整的方法，取得的每一份資料後都需要調整下一階段的範圍，針對TCP/UDP簡單的掃描我們可以用Netcat(😼)，其實Netcat並非正統的port掃描工具，但可以當作比較組讓我們了解正統的掃描器真正強在哪

Netcat在許多系統裡都可以支援，我們可以用它的基本功能來模擬掃描的動作，這樣我們有時候就不需要跑那種生完整報告的掃描器，如果需求上時間較少就可以考慮，首先我們先了解TCP掃描的技巧，最簡易的TCP port掃描通稱為CONNECT掃描，仰賴於三向TCP交握機制

三向交握機制設計上就是兩台host(機器、系統、使用者, etc.)在傳輸任何資料之前，雙方先進行溝通TCP socket通道需要的參數，首先其中一方發送TCP的"SYN"封包給目標的port(角色是傳送者)，如果另一方該port是開著的就可以接收該封包(角色為接收者)，並且回傳"SYN-ACK"封包回發送方，最後傳送者在發出去一個"ACK"封包完成整個交握流程，如果交握可以完成就代表port是開著的

利用Netcat就可以掃描TCP port 3388-3390，另外用"-w"選項可以指定連線過期時間，"-z"則可以指定零I/O模式不傳送只掃描而不傳送任何資料

```
kali@kali:~$ nc -nvv -w 1 -z 192.168.50.152 3388-3390
(UNKNOWN) [192.168.50.152] 3390 (?) : Connection refused
(UNKNOWN) [192.168.50.152] 3389 (ms-wbt-server) open
(UNKNOWN) [192.168.50.152] 3388 (?) : Connection refused
 sent 0, rcvd 0
```

我們針對內網的機器做掃描看到3389這個port開著，而3388跟3390皆是關著，我們可以更近一步的用Wireshark查看封包內容

![Wireshark-capture-of-the-Netcat-port-scan](https://media.secologies.com/Wireshark-capture-of-the-Netcat-port-scan.webp)
*[^1]*

上圖顯示我們的Netcat送出了數個TCP SYN封包給3390、3389跟3388 ports，由於NTP時間上的影響以及網路設計，封包的順序並非照順序的，而是看誰先到就先處理誰，另外可以觀察到接收端從port 3389回傳了一組TCP的SYN-ACK封包，代表3389 port是有開著的

其他的port就沒有開啟了，也主動的拒絕了相關的請求，這點在3390跟3388的RST ACK封包可以觀察到，而最終完成三向交握回傳了一組FIN ACK封包結束本次協商，在瞭解了TCP的狀況後，我們可以來看看UDP掃描時的情況，不同於TCP，UDP屬於無狀態的協定，不做任何三向交握的工作

我們也可以用Netcat來執行UDP的掃描，我們嘗試針對120-123 port，在"nc"裡指定UDP要加上"-u"的選項

```
kali@kali:~$ nc -nv -u -z -w 1 192.168.50.149 120-123
(UNKNOWN) [192.168.50.149] 123 (ntp) open
```

一樣用Wireshark來檢查該封包

![Wireshark-capture-of-a-UDP-Netcat-port-scan](https://media.secologies.com/Wireshark-capture-of-a-UDP-Netcat-port-scan.webp)
*[^1]*

上圖觀察到傳送了空的UDP封包給指定的port上，如果port是開著的就會把封包打進應用層(這邊是ICMP協定接收)，至於要不要回應則要看應用層的協定如何設計接收空封包的情形，以ICMP的協定來看它設計成不回應，但如果該port是關著的話UDP/IP傳輸層就會回應ICMP port無法抵達(unreachable)

大部分的UDP掃描器都用"ICMP port unreachable"來確認目標的port是否活著，但其實這方法不太可信，因為有時候目標機器前面是一台防火牆，而目標組織可以設計一些政策來回應給掃描器，甚至設計ICMP不回應的策略來混肴掃描器，不管是TCP或者UDP都會有些陷阱需要注意的

不過TCP/UDP掃描有些問題存在無法忽略：

- UDP掃描不太可信，會被目標的防火牆或路由器丟掉ICMP封包而不回應，導致偵查階段會存在誤解
- 許多掃描器並不會掃描全部有效的port，就算選擇Full版本也只會掃預設常見的port，代表不會注意到一些UDP port但其實是有打開的，換成協定指定的UDP掃描器也許才有些幫助，得到更精確的結果
- 熟練的滲透測試員有時會忘記掃公開的UDP port，因為可能只知道某些漏洞，所以只掃描那些相關的服務，手上只有錘子，看什麼都像釘子，儘管UDP掃描有時不可信，但如果發現了新的UDP port就代表攻擊層面可以增強
- TCP掃描由於需要三向交握，所以會對目標跟自己產生許多流量出來，可能會對目標機器造成算力的下降，而對我們來說過多的封包進行分析可能相對複雜

## Nmap Port掃描器

Nmap就是其中一款知名的掃描器，擁有各式各樣以及穩定的功能，開發出來超過20年的port掃描產品，現在也還在持續維護中，有時候啟動Nmap時需要用sudo來執行，因為要存取底層socket的功能就需要用到root的權限，底層socket就可以對TCP跟UDP封包進行變更，如果不能存取底層socket的話，Nmap就會退化成只能用標準Berkeley socket API來操作而已

預設的Nmap會針對目標機器掃描1000個最知名的port，我們可以利用iptables來觀察一下這個預設操作內的流量，加上一些選項"-I"來指定進來(INPUT)或出去(OUTPUT)的流量，"-s"可以指定來源IP，而"-d"來選目標IP，加上"-j"只挑ACCEPT的流量，最後用"-Z"選擇傳輸空封包

另外"-Pn"選項可以指定Nmap關掉主機探索(不去用ping掃描)，以及把所有目標都視為在線的，對於那些前面設置防火牆擋ICMP請求的機器辨認非常有幫助

```
kali@kali:~$ nmap 192.168.50.149
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-09 05:12 EST
Nmap scan report for 192.168.50.149
Host is up (0.10s latency).
Not shown: 989 closed tcp ports (conn-refused)
PORT     STATE SERVICE
53/tcp   open  domain
88/tcp   open  kerberos-sec
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
389/tcp  open  ldap
445/tcp  open  microsoft-ds
464/tcp  open  kpasswd5
593/tcp  open  http-rpc-epmap
636/tcp  open  ldapssl
3268/tcp open  globalcatLDAP
3269/tcp open  globalcatLDAPssl

Nmap done: 1 IP address (1 host up) scanned in 10.95 seconds
```

接著我們可以用iptables來分析每一個流量，用"-v"選項可以替輸出增添一些資訊幫助我們判斷，"-n"啟動數值化的顯示，以及"-L"把所有內腳外腳都指示出來

```
kali@kali:~$ sudo iptables -vn -L
Chain INPUT (policy ACCEPT 1270 packets, 115K bytes)
 pkts bytes target     prot opt in     out     source               destination
 1196 47972 ACCEPT     all  -- *      *       192.168.50.149      0.0.0.0/0

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain OUTPUT (policy ACCEPT 1264 packets, 143K bytes)
 pkts bytes target     prot opt in     out     source               destination
 1218 72640 ACCEPT     all  -- *      *       0.0.0.0/0            192.168.50.149
```

我們測試1000個port會產生72KB的流量，而另外測試"-Z"來看看傳輸零封包，以及用"-p"來指定所有TCP ports

```
kali@kali:~$ sudo iptables -Z

kali@kali:~$ nmap -p 1-65535 192.168.50.149
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-09 05:23 EST
Nmap scan report for 192.168.50.149
Host is up (0.11s latency).
Not shown: 65510 closed tcp ports (conn-refused)
PORT      STATE SERVICE
53/tcp    open  domain
88/tcp    open  kerberos-sec
135/tcp   open  msrpc
139/tcp   open  netbios-ssn
389/tcp   open  ldap
445/tcp   open  microsoft-ds
464/tcp   open  kpasswd5
593/tcp   open  http-rpc-epmap
636/tcp   open  ldapssl
3268/tcp  open  globalcatLDAP
3269/tcp  open  globalcatLDAPssl
5985/tcp  open  wsman
9389/tcp  open  adws
47001/tcp open  winrm
49664/tcp open  unknown
...

Nmap done: 1 IP address (1 host up) scanned in 2141.22 seconds

kali@kali:~$ sudo iptables -vn -L
Chain INPUT (policy ACCEPT 67996 packets, 6253K bytes)
 pkts bytes target     prot opt in     out     source               destination
68724 2749K ACCEPT     all  -- *      *       192.168.50.149      0.0.0.0/0

Chain FORWARD (policy ACCEPT 0 packets, 0 bytes)
 pkts bytes target     prot opt in     out     source               destination

Chain OUTPUT (policy ACCEPT 67923 packets, 7606K bytes)
 pkts bytes target     prot opt in     out     source               destination
68807 4127K ACCEPT     all  -- *      *       0.0.0.0/0            192.168.50.149
```

類似的local掃描全部65535組ports會至少產生4MB的流量是非常大的數字，不過完整性的掃描可以找出更多的TCP port，如果是掃描整個class C網段內的機器(254 hosts)至少會超過1000MB的流量出現

最理想是每一台機器上所有TCP跟UDP port都會被揭露出來，但這點需要根據滲透測試的目的需求來決定，每一層級找到更多的機器是否需要繼續探索是每一輪的偵察時需要考量的平衡，在class A跟class B的網段中也必須考慮

主動式資料搜集的隱密層級會根據偵察的範圍及目的來決定，滲透測試是為了找出錯誤設定或系統裡的安全性漏洞，但較少提及如何躲避被偵測，跟紅隊演練相比，紅隊更加注重評估SOC(Security Operations Center)模擬現實攻擊者的攻擊層面策略，代表紅隊演練時必須完全的隱密行動，這便是滲透測試與紅隊演練之間最大的差異

不同的方法是為了不同的目的而進行客製化，不管是測試系統的安全性或者評估偵測覆蓋率，甚至是回應的處理，如此看來，我們接著可以談到Nmap的Stealth/SYN掃描

Nmap最知名的其中一個能力就是傳送SYN，或者稱作隱密型(Stealth)掃描，使用隱密掃描的好處多多，必須使用sudo的root權限，因為需要使用到底層的socket權限，隱密掃描傳輸SYN封包到目標的TCP port上，但不完成三向交握，如果port是開著的就會回傳SYN-ACK，而我們就會知道該port是有啟動的，而最終我們不需要回傳FIN ACK來完成本次的協商

```
kali@kali:~$ sudo nmap -sS 192.168.50.149
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-09 06:31 EST
Nmap scan report for 192.168.50.149
Host is up (0.11s latency).
Not shown: 989 closed tcp ports (reset)
PORT     STATE SERVICE
53/tcp   open  domain
88/tcp   open  kerberos-sec
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
389/tcp  open  ldap
445/tcp  open  microsoft-ds
464/tcp  open  kpasswd5
593/tcp  open  http-rpc-epmap
636/tcp  open  ldapssl
3268/tcp open  globalcatLDAP
3269/tcp open  globalcatLDAPssl
...
```

由於三向交握從不完成所以封包資訊不會傳到目標應用層，就不會有任何應用層的log，同時SYN掃描比起傳統的來看還更快且有效率，因為只需要傳輸少量的封包來傳送與接收，不過要記得的是這個隱密行為在過去的防火牆不會紀錄未完成的TCP三向交握，但在現代的次世代防火牆開發商覺得這也是一條風險，所以在次世代防火牆上這其實失效了，即便如此還是能用來誤導管理人員

再來探討TCP CONNECT掃描方法來執行完整版的TCP連線，如果讀者直接使用Nmap工具並非執行底層socket權限，預設是直接用TCP Connect掃描方法，直接呼叫Berkeley socket API執行三向交握不需要root權限，不過由於需要完成三向交握跟等API溝通，耗費的時間跟SYN掃描相比來得長

有時候如果流量要經過某些型態的proxy我們就必須選擇connect型態掃描，利用"-sT"來指定connect掃描

```
kali@kali:~$ nmap -sT 192.168.50.149
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-09 06:44 EST
Nmap scan report for 192.168.50.149
Host is up (0.11s latency).
Not shown: 989 closed tcp ports (conn-refused)
PORT     STATE SERVICE
53/tcp   open  domain
88/tcp   open  kerberos-sec
135/tcp  open  msrpc
139/tcp  open  netbios-ssn
389/tcp  open  ldap
445/tcp  open  microsoft-ds
464/tcp  open  kpasswd5
593/tcp  open  http-rpc-epmap
636/tcp  open  ldapssl
3268/tcp open  globalcatLDAP
3269/tcp open  globalcatLDAPssl
...
```

可以看到有些結果是Windows系統上才能執行的服務，尤其是Domain Controller，根據簡易的掃描觀察到一些服務，我們就能夠初步推測目標機器的作業系統以及在組織內的角色為何，另外我們看看UDP掃描

Nmap執行UDP掃描時會組合兩種不同型態的方法來看port是開啟的還是關閉的，對於大部分的port，Nmap寄送空封包給目標port，只要收到標準的"ICMP port unreachable"就判斷該port沒開，而其他通用型的port例如SNMP的161 port，就寄送協定指定的SNMP封包，接收應用層回傳的回應來判斷該port是否有開啟

要執行UDP掃描的話我們指定"-sU"選項並且用sudo模式下存取底層socket

```
kali@kali:~$ sudo nmap -sU 192.168.50.149
Starting Nmap 7.70 ( https://nmap.org ) at 2019-03-04 11:46 EST
Nmap scan report for 192.168.131.149
Host is up (0.11s latency).
Not shown: 977 closed udp ports (port-unreach)
PORT      STATE         SERVICE
123/udp   open          ntp
389/udp   open          ldap
...
Nmap done: 1 IP address (1 host up) scanned in 22.49 seconds
```

同時UDP掃描(-sU)可以搭配著TCP SYN掃描(-sS)一起對目標建構更完善的檢查

```
kali@kali:~$ sudo nmap -sU -sS 192.168.50.149
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-09 08:16 EST
Nmap scan report for 192.168.50.149
Host is up (0.10s latency).
Not shown: 989 closed tcp ports (reset), 977 closed udp ports (port-unreach)
PORT      STATE         SERVICE
53/tcp    open          domain
88/tcp    open          kerberos-sec
135/tcp   open          msrpc
139/tcp   open          netbios-ssn
389/tcp   open          ldap
445/tcp   open          microsoft-ds
464/tcp   open          kpasswd5
593/tcp   open          http-rpc-epmap
636/tcp   open          ldapssl
3268/tcp  open          globalcatLDAP
3269/tcp  open          globalcatLDAPssl
53/udp    open          domain
123/udp   open          ntp
389/udp   open          ldap
...
```

在TCP跟UDP的結合下有時可以揭露出額外的公開UDP port，進而找到執行服務的目標主機，以上都是針對單台的情況，那如果網段中有多台機器呢？

為了處理大量的主機，或者為了節省網路流量，我們可以利用Network Sweeping技術來嘗試檢測目標網段內的廣泛掃描，以及用更客製化的方法針對不同的主機找出相對應的關聯，當我們想要用Nmap執行sweep時添加"-sn"的選項，就能夠探索到比ICMP請求還更多的回應

sweep時會同時送TCP SYN封包給443 port、TCP ACK封包給80 port以及ICMP時戳請求來驗證機器是否存在

```
kali@kali:~$ nmap -sn 192.168.50.1-253
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-10 03:19 EST
Nmap scan report for 192.168.50.6
Host is up (0.12s latency).
Nmap scan report for 192.168.50.8
Host is up (0.12s latency).
...
Nmap done: 254 IP addresses (13 hosts up) scanned in 3.74 seconds
```

另外我們可以組合其他種bash-line指令，比較笨的方法是結合"grep"來分類出存在的機器，不如直接將資料打包起來，透過選擇"-oG"的參數來儲存輸出的資料格式

```
kali@kali:~$ nmap -v -sn 192.168.50.1-253 -oG ping-sweep.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-10 03:21 EST
Initiating Ping Scan at 03:21
...
Read data files from: /usr/bin/../share/nmap
Nmap done: 254 IP addresses (13 hosts up) scanned in 3.74 seconds
...

kali@kali:~$ grep Up ping-sweep.txt | cut -d " " -f 2
192.168.50.6
192.168.50.8
192.168.50.9
...
```

我們也可以指定TCP或UDP port來探索一些常見的服務或port是否有沒有在目標機器裡，以利我們之後找相關的漏洞，這樣會比直接用ping的還來的精確

```
kali@kali:~$ nmap -p 80 192.168.50.1-253 -oG web-sweep.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-10 03:50 EST
Nmap scan report for 192.168.50.6
Host is up (0.11s latency).

PORT   STATE SERVICE
80/tcp open  http

Nmap scan report for 192.168.50.8
Host is up (0.11s latency).

PORT   STATE  SERVICE
80/tcp closed http
...

kali@kali:~$ grep open web-sweep.txt | cut -d" " -f2
192.168.50.6
192.168.50.20
192.168.50.21
```

為了節省時間跟網路資源，我們也可以直接針對多組IP進行掃描，並且把重點放在常見的port上不需要全部port都掃描，例如利用"--top-ports"建構TCP connect掃描前20組TCP port，同時偵測OS版本以及腳本的掃描，用"-A"來追蹤相關的資訊

```
kali@kali:~$ nmap -sT -A --top-ports=20 192.168.50.1-253 -oG top-port-sweep.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-10 04:04 EST
Nmap scan report for 192.168.50.6
Host is up (0.12s latency).

PORT     STATE  SERVICE       VERSION
21/tcp   closed ftp
22/tcp   open   ssh           OpenSSH 8.2p1 Ubuntu 4ubuntu0.3 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   3072 56:57:11:b5:dc:f1:13:d3:50:88:b8:ab:a9:83:e2:29 (RSA)
|   256 4f:1d:f2:55:cb:40:e0:76:b4:36:90:19:a2:ba:f0:44 (ECDSA)
|_  256 67:46:b3:97:26:a9:e3:a8:4d:eb:20:b3:9b:8d:7a:32 (ED25519)
23/tcp   closed telnet
25/tcp   closed smtp
53/tcp   closed domain
80/tcp   open   http          Apache httpd 2.4.41 ((Ubuntu))
|_http-server-header: Apache/2.4.41 (Ubuntu)
|_http-title: Under Construction
110/tcp  closed pop3
111/tcp  closed rpcbind
...
```

在Nmap裡前20的port由"/usr/share/nmap/nmap-services"的設定檔來決定，簡單用三個欄位來表達，第一個是服務的名稱，第二個是port與協定，而第三個則是port的頻率，其他欄位就只是註解相關的，port的頻率是指說該port過去有多常被發現，就代表有多少機器有使用該服務

```
kali@kali:~$ cat /usr/share/nmap/nmap-services 
...
finger    79/udp    0.000956
http    80/sctp    0.000000    # www-http | www | World Wide Web HTTP
http    80/tcp    0.484143    # World Wide Web HTTP
http    80/udp    0.035767    # World Wide Web HTTP
hosts2-ns    81/tcp    0.012056    # HOSTS2 Name Server
hosts2-ns    81/udp    0.001005    # HOSTS2 Name Server
...
```

至目前為止我們已經可以建構許多強大的掃描讓目標機器的豐富服務資訊呈現在我們面前，同時也有不同的方法可以讓我們的行為不耗費太多計算資源或者降低足跡，host探索技術是值得深入研究的一塊領域，能夠了解目標機器有哪些服務之外，能夠知道目標的作業系統也是一項指標，Nmap就有支援找出目標的OS指紋選項

OS指紋(Fingerprinting)可以用"-O"選項新增，該功能會根據回傳的封包解出目標的作業系統，由於OS經常使用稍微不同的TCP/IP stack，從TTL(Time To Live)的數值或者TCP window的大小就能夠區別，而就是這些微小的差異展露了指紋讓Nmap可以辨識，這會影響DNS改變的速度，對攻擊者或系統管理員來說至關重要

Nmap會調查接收到的流量來看目標主機的指紋最符合哪種已知的特徵，通常只有在非常確定的時候才會公開目標的OS資訊，不過我們也可以讓Nmap進行猜測的動作，只要加上"--osscan-guess"這個參數來強制輸出不確定的OS版本

```
kali@kali:~$ sudo nmap -O 192.168.50.14 --osscan-guess
...
Running (JUST GUESSING): Microsoft Windows 2008|2012|2016|7|Vista (88%)
OS CPE: cpe:/o:microsoft:windows_server_2008::sp1 cpe:/o:microsoft:windows_server_2008:r2 cpe:/o:microsoft:windows_server_2012:r2 cpe:/o:microsoft:windows_server_2016 cpe:/o:microsoft:windows_7 cpe:/o:microsoft:windows_vista::sp1:home_premium
Aggressive OS guesses: Microsoft Windows Server 2008 SP1 or Windows Server 2008 R2 (88%), Microsoft Windows Server 2012 or Windows Server 2012 R2 (88%), Microsoft Windows Server 2012 R2 (88%), Microsoft Windows Server 2012 (87%), Microsoft Windows Server 2016 (87%), Microsoft Windows 7 (86%), Microsoft Windows Vista Home Premium SP1 (85%), Microsoft Windows 7 Professional (85%)
No exact OS matches for host (If you know what OS is running on it, see https://nmap.org/submit/ ).
...
```

強制輸出的結果就會根據判斷的機率來顯示，不過要記住在掃描時沒有任何OS指紋總是100%精確的，有時候防火牆或Proxy會改寫風包標頭檔來混淆傳出去的流量，這點就只能靠讀者自行判斷了

當我們識別到潛在目標的作業系統資訊，我們就能夠進一步針對特定的服務port來進行檢查，利用"-A"參數可以對比多組OS指紋以及服務的枚舉腳本

```
kali@kali:~$ nmap -sT -A 192.168.50.14
Nmap scan report for 192.168.50.14
Host is up (0.12s latency).
Not shown: 996 closed tcp ports (conn-refused)
PORT    STATE SERVICE       VERSION
21/tcp  open  ftp?
| fingerprint-strings:
|   DNSStatusRequestTCP, DNSVersionBindReqTCP, GenericLines, NULL, RPCCheck, SSLSessionReq, TLSSessionReq, TerminalServerCookie:
|     220-FileZilla Server 1.2.0
|     Please visit https://filezilla-project.org/
|   GetRequest:
|     220-FileZilla Server 1.2.0
|     Please visit https://filezilla-project.org/
|     What are you trying to do? Go away.
|   HTTPOptions, RTSPRequest:
|     220-FileZilla Server 1.2.0
|     Please visit https://filezilla-project.org/
|     Wrong command.
|   Help:
|     220-FileZilla Server 1.2.0
|     Please visit https://filezilla-project.org/
|     214-The following commands are recognized.
|     USER TYPE SYST SIZE RNTO RNFR RMD REST QUIT
|     HELP XMKD MLST MKD EPSV XCWD NOOP AUTH OPTS DELE
|     CDUP APPE STOR ALLO RETR PWD FEAT CLNT MFMT
|     MODE XRMD PROT ADAT ABOR XPWD MDTM LIST MLSD PBSZ
|     NLST EPRT PASS STRU PASV STAT PORT
|_    Help ok.
| ftp-syst:
|_  SYST: UNIX emulated by FileZilla.
| ssl-cert: Subject: commonName=filezilla-server self signed certificate
| Not valid before: 2022-01-06T15:37:24
|_Not valid after:  2023-01-07T15:42:24
|_ssl-date: TLS randomness does not represent time
135/tcp open  msrpc         Microsoft Windows RPC
139/tcp open  netbios-ssn   Microsoft Windows netbios-ssn
445/tcp open  microsoft-ds?
Nmap done: 1 IP address (1 host up) scanned in 55.67 seconds
```

"-A"參數可以找出額外的服務，但如果只是想掃描出單純的服務，可以只用"-sV"這個參數，畢竟如果用"-A"找出許多詳細的服務資訊也會拖累我們的掃描速度，我們必須銘記在心何時使用nmap的參數以及會帶來何種影響，另外就是要注意系統管理員可以變更服務的資訊內容來混淆潛在的攻擊者

以上是Nmap的主要參數功能，接著我們專注於Nmap另一項強大的功能，寫腳本來客製化掃描的行為，這在官方稱作Nmap腳本引擎(Nmap Scripting Engine, NSE)，我們可以利用NSE自製數種腳本組合成自動化的掃描任務，像是拼湊DNS枚舉、暴力破解攻擊以及甚至漏洞辨認，NSE腳本儲存在"/usr/share/nmap/scripts/"這個目錄底下

例如針對http標頭檔的腳本嘗試連接目標機器上的HTTP服務，並且找出有支援的標頭檔

```
kali@kali:~$ nmap --script http-headers 192.168.50.6
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-10 13:53 EST
Nmap scan report for 192.168.50.6
Host is up (0.14s latency).
Not shown: 998 closed tcp ports (conn-refused)
PORT   STATE SERVICE
22/tcp open  ssh
80/tcp open  http
| http-headers:
|   Date: Thu, 10 Mar 2022 18:53:29 GMT
|   Server: Apache/2.4.41 (Ubuntu)
|   Last-Modified: Thu, 10 Mar 2022 18:51:54 GMT
|   ETag: "d1-5d9e1b5371420"
|   Accept-Ranges: bytes
|   Content-Length: 209
|   Vary: Accept-Encoding
|   Connection: close
|   Content-Type: text/html
|
|_  (Request type: HEAD)

Nmap done: 1 IP address (1 host up) scanned in 5.11 seconds
```

如果要看腳本更多的說明，跟其他bash-line指令一樣可以使用"--script-help"呼叫help，會說明目前在目錄底下預設的那些腳本行為，也可以透過相關連結看官方文件，像是腳本的參數與使用情境等等

```
kali@kali:~$ nmap --script-help http-headers
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-10 13:54 EST

http-headers
Categories: discovery safe
https://nmap.org/nsedoc/scripts/http-headers.html
  Performs a HEAD request for the root folder ("/") of a web server and displays the HTTP headers returned.
...
```

如果在離線的情況下做偵察，也可以直接在NSE腳本裡查看詳細行為，值得我們花些時間探索一下不同的NSE腳本內容，以利未來組織自己的腳本內容，或者在入侵階段就可以直接執行省下許多時間，除了Linux之外，Windows中也有一些掃描工具可以使用

如果讀者在Windows中已經做了初步的網路枚舉操作，但在機器裡沒有任何網路時，我們就無法安裝Windows版的Nmap工具，這時我們該怎麼辦？

幸運的是，官方還有內建一些PowerShell的功能給我們使用，Test-NetConnection功能就能夠用來做ICMP ping來確認目標機器是否有開啟相關的port，或者TCP port也可以進行確認，舉例來說，在Windows 11環境中我們驗證同網段的某台機器是否有開啟SMB的445 port網域控管服務

```
PS C:\Users\hshuang> Test-NetConnection -Port 445 192.168.50.151

ComputerName     : 192.168.50.151
RemoteAddress    : 192.168.50.151
RemotePort       : 445
InterfaceAlias   : Ethernet0
SourceAddress    : 192.168.50.152
TcpTestSucceeded : True
```

回傳一組TcpTestSucceeded通知我們445 port有開啟，更甚者，我們可以用PowerShell寫一段腳本來掃描前1024組port的服務有沒有開啟，其中得利用TcpClient Socket物件來傳送額外的流量

```
PS C:\Users\hshuang> 1..1024 | % {echo ((New-Object Net.Sockets.TcpClient).Connect("192.168.50.151", $_)) "TCP port $_ is open"} 2>$null
TCP port 88 is open
...
```

我們一開始用迴圈組合前1024組整數漸增上去塞進"$_"這個variable裡，接著我們用Net.Sockets.TcpClient物件搭配TCP連接目標IP的指定port，如果連接是成功的話，就回傳log告訴我們有哪些TCP port存在，這只是PowerShell冰山一角的能力，如果能在連網的環境下搭配Nmap可以變成大殺器

[^1]: OffSec, “Information Gathering: TCP/UDP Port Scanning Theory,” The Penetration Testing with Kali Linux (PEN-200).
