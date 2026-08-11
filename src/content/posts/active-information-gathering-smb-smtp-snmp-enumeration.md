---
title: "主動式資料搜集之SMB、SMTP、SNMP枚舉"
date: 2025-09-18
description: 在主動式資料搜集之DNS枚舉與Port掃描一章我們提及針對目標機器的DNS與Port掃描來建立攻擊劇本(LOLBAS)，而現代設備中不只有這兩種方法，我們將於本章說明其他可以搜集的資訊，包括SMB、SMTP以及SNMP的枚舉，找出更多資訊能讓我們縮小下一次的範圍
tags: 
  - "netcat"
  - "nmap"
  - "smb"
  - "snmp"
  - "主動式資料搜集"
targetKeyword: SMB 枚舉, SMTP 枚舉, SNMP 枚舉
lang: zh
---
## 前言

在[[active-information-gathering-dns-enumeration-and-port-scanning|主動式資料搜集之DNS枚舉與Port掃描]]一章我們提及針對目標機器的DNS與Port掃描來建立攻擊劇本(LOLBAS)，而現代設備中不只有這兩種方法，我們將於本章說明其他可以搜集的資訊

## SMB枚舉

Server資訊區塊(Server Message Block, SMB)從過去多年的經驗來看擁有許多慘烈的教訓，因為SMB本身的設計瓶頸以及實作複雜度導致安全性極低，最早Windows 2000跟XP作業系統上可以造出不需認證的SMB空session拿來利用，到許多SMB多年維護出現的許多bug以及漏洞，SMB從出現就一直遭遇到許多問題

但隨著到目前Windows的版本越來越高，SMB協定也同樣一直在嘗試更新與提升，雖然舊版SMB協定裡有一組合作的NetBIOS服務，這個服務監聽TCP port 139以及數個UDP port，雖然SMB(走TCP port 445)跟NetBIOS是兩個不同的協定，NetBIOS是獨立於session層的協定，主要允許內網裡的系統與機器可以互相溝通

新版的實作讓SMB不需要NetBIOS也可以運作，但如果內網裡有老舊的系統就還是需要支援，所以額外擴充出來NetBIOS over TCP(NBT)核心給SMB，所以我們針對目標時需要同時掃這兩個服務，nmap就可以支援該功能

```
kali@kali:~$ nmap -v -p 139,445 -oG smb.txt 192.168.50.1-254

kali@kali:~$ cat smb.txt
# Nmap 7.92 scan initiated Thu Mar 17 06:03:12 2022 as: nmap -v -p 139,445 -oG smb.txt 192.168.50.1-254
# Ports scanned: TCP(2;139,445) UDP(0;) SCTP(0;) PROTOCOLS(0;)
Host: 192.168.50.1 ()	Status: Down
...
Host: 192.168.50.21 ()	Status: Up
Host: 192.168.50.21 ()	Ports: 139/closed/tcp//netbios-ssn///, 445/closed/tcp//microsoft-ds///
...
Host: 192.168.50.217 ()	Status: Up
Host: 192.168.50.217 ()	Ports: 139/closed/tcp//netbios-ssn///, 445/closed/tcp//microsoft-ds///
# Nmap done at Thu Mar 17 06:03:18 2022 -- 254 IP addresses (15 hosts up) scanned in 6.17 seconds
```

用"-oG"我們可以儲存掃描的結果，紀錄找到的139與445 por結果，以及在Kali Linux內也有更特化型針對NetBIOS資訊的掃描工具"nbtscan"，我們可以利用這個工具找有效的NetBIOS服務名稱，除了TCP port還可以用"-r"參數額外找出UDP port

```
kali@kali:~$ sudo nbtscan -r 192.168.50.0/24
Doing NBT name scan for addresses from 192.168.50.0/24

IP address       NetBIOS Name     Server    User             MAC address
------------------------------------------------------------------------------
192.168.50.124   SAMBA            <server>  SAMBA            00:00:00:00:00:00
192.168.50.134   SAMBAWEB         <server>  SAMBAWEB         00:00:00:00:00:00
...
```

利用nbtscan找出兩個NetBIOS的名稱以及host資訊，這類資訊就可以讓我們更進一步的提升搜尋的範圍，尤其NetBIOS的名稱通常都會設定成非常常見的功能名稱與角色名稱，就能增加我們的攻擊層面讓後續的階段能更精確

Nmap同樣有提供有效的NSE腳本讓我們枚舉SMB服務，一樣存放在"/usr/share/nmap/scripts/"目錄底下

```
kali@kali:~$ ls -1 /usr/share/nmap/scripts/smb*
/usr/share/nmap/scripts/smb2-capabilities.nse
/usr/share/nmap/scripts/smb2-security-mode.nse
/usr/share/nmap/scripts/smb2-time.nse
/usr/share/nmap/scripts/smb2-vuln-uptime.nse
/usr/share/nmap/scripts/smb-brute.nse
/usr/share/nmap/scripts/smb-double-pulsar-backdoor.nse
/usr/share/nmap/scripts/smb-enum-domains.nse
/usr/share/nmap/scripts/smb-enum-groups.nse
/usr/share/nmap/scripts/smb-enum-processes.nse
/usr/share/nmap/scripts/smb-enum-sessions.nse
/usr/share/nmap/scripts/smb-enum-shares.nse
/usr/share/nmap/scripts/smb-enum-users.nse
/usr/share/nmap/scripts/smb-os-discovery.nse
...
```

有興趣的讀者可以看一下這些NSE有什麼功能，像是透過SMB探索OS版本資訊以及枚舉host資訊都有在裡面，要注意的是SMB探索腳本只有在SMBv1版本的機器上才有作用，而近代Windows系統預設都不是v1版本了，然而目前許多製造業或工廠裡的系統都還在運作SMBv1服務，而我們要使用這類工具就必須針對有開SMBv1服務的機器

例如像是smb-os-discovery模組針對Windows 11

```
kali@kali:~$ nmap -v -p 139,445 --script smb-os-discovery 192.168.50.152
...
PORT    STATE SERVICE      REASON
139/tcp open  netbios-ssn  syn-ack
445/tcp open  microsoft-ds syn-ack

Host script results:
| smb-os-discovery:
|   OS: Windows 10 Pro 22000 (Windows 10 Pro 6.3)
|   OS CPE: cpe:/o:microsoft:windows_10::-
|   Computer name: client01
|   NetBIOS computer name: CLIENT01\x00
|   Domain name: megacorptwo.com
|   Forest name: megacorptwo.com
|   FQDN: client01.megacorptwo.com
|_  System time: 2022-03-17T11:54:20-07:00
...
```

這個腳本識別出潛在的機器OS系統資訊，然而這其實不太精確，目標其實真正是運作Windows 11的系統，如同我們在Port掃描裡提到Nmap的輸出結果其實是機率性的，沒有任何演算法可以精確找出正確的版本，而跟OS指紋資訊不同，透過NSE腳本枚舉出來的資訊會參雜額外的內容

例如網域或其他跟Active Directory服務相關的資訊也會混在裡面，因為這類資訊通常不容易注意到，並且少量的流量會跑進組織內的網路行為中隱藏其中，除了從Kali Linux內使用工具進行SMB枚舉之外，在Windows裡也有可以用的工具

其中一種就是"net view"這個工具，進入到內網後針對從一層的其他機器進行枚舉，可以顯示網域、資源以及機器所屬的host，例如我們可以連進client01這台VM，列出dc01這台機器的共享資料

```
C:\Users\hshuang>net view \\dc01 /all
Shared resources at \\dc01

Share name  Type  Used as  Comment

-------------------------------------------------------------------------------
ADMIN$      Disk           Remote Admin
C$          Disk           Default share
IPC$        IPC            Remote IPC
NETLOGON    Disk           Logon server share
SYSVOL      Disk           Logon server share
The command completed successfully.
```

利用"/all"這個關鍵字我們還可以把較高權限的資源也找出來，通常要管理員權限的資源結尾是$

## SMTP枚舉

除了直接的與目標機器進行溝通獲取資料，我們也可以從外部其他服務來嘗試，例如有問題的電子郵件伺服器，**簡易信件傳送協定**(Simple Mail Transport Protocol, SMTP)就支援幾個有趣的指令，像是VRFY以及EXPN，VRFY可以送出驗證電子郵件位址的請求給伺服器，而EXPN則可以針對郵件清單裡的使用者進行詢問

搭配這兩個指令有時可以濫用驗證電子郵件伺服器內的角色，對於滲透測試時查找資訊非常有用，例如可以用Netcat嘗試

```
kali@kali:~$ nc -nv 192.168.50.8 25
(UNKNOWN) [192.168.50.8] 25 (smtp) open
220 mail ESMTP Postfix (Ubuntu)
VRFY root
252 2.0.0 root
VRFY idontexist
550 5.1.1 <idontexist>: Recipient address rejected: User unknown in local recipient table
^C
```

可以看到回傳的資訊之間的差異，252 SMTP回應碼雖然不會驗證root角色是否存在，但會接受任何傳輸過去的資訊，如果回傳的是500則代表該電子郵件信箱不存在，透過自動化腳本查找一系列想知道的角色，就可以猜出有效的使用者名稱，所以我們可以用python製成腳本，利用TCP socket連接SMTP伺服器，針對一連串的使用者名稱傳送VRFY指令

```
!/usr/bin/python

import socket
import sys

if len(sys.argv) != 3:
        print("目標: vrfy.py <username> <target_ip>")
        sys.exit(0)

# 建立Socket
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

# 連接Server
ip = sys.argv[2]
connect = s.connect((ip,25))

# 接收回應
banner = s.recv(1024)

print(banner)

# VRFY一組使用者名稱
user = (sys.argv[1]).encode()
s.send(b'VRFY ' + user + b'\r\n')
result = s.recv(1024)

print(result)

# 關閉Socket
s.close()
```

利用這個python腳本，我們可以輸入想知道的使用者名稱跟對應的IP位址來做查詢

```
kali@kali:~/Desktop$ python3 smtp.py root 192.168.50.8
b'220 mail ESMTP Postfix (Ubuntu)\r\n'
b'252 2.0.0 root\r\n'

kali@kali:~/Desktop$ python3 smtp.py johndoe 192.168.50.8
b'220 mail ESMTP Postfix (Ubuntu)\r\n'
b'550 5.1.1 <johndoe>: Recipient address rejected: User unknown in local recipient table\r\n'
```

同樣的我們也可以從Windows上取得SMTP資訊

```
PS C:\Users\hshuang> Test-NetConnection -Port 25 192.168.50.8

ComputerName     : 192.168.50.8
RemoteAddress    : 192.168.50.8
RemotePort       : 25
InterfaceAlias   : Ethernet0
SourceAddress    : 192.168.50.152
TcpTestSucceeded : True
```

不幸的是，Test-NetConnection沒辦法完全跟SMTP服務進行溝通，不過我們還可以用Telnet更進一步的溝通

```
PS C:\Windows\system32> dism /online /Enable-Feature /FeatureName:TelnetClient  
...
```

不過要注意安裝Telnet必須要有管理員權限，如果我們入侵時只有低權限的帳號就很難完成，但另一條思路就是到其他台機器裡共享Telnet binary "C:\\windows\\system32\\telnet.exe"利用該機器底下的權限啟動，一旦開啟的Telnet服務後，便可以連接目標機器來做枚舉

```
C:\Windows\system32>telnet 192.168.50.8 25
220 mail ESMTP Postfix (Ubuntu)
VRFY goofy
550 5.1.1 <goofy>: Recipient address rejected: User unknown in local recipient table
VRFY root
252 2.0.0 root
```

如此就可以在Kali Linux無法運作時利用肉雞Windows環境進行目標機器的枚舉動作

## SNMP枚舉

好多年來有許多的新進網管都沒有清楚的了解**_簡易網路管理協定_**(Simple Network Management Protocol, SNMP)這項服務，導致許多的SNMP服務都有錯誤設定的結果，造成嚴重的資訊洩漏，SNMP值基於UDP上，屬於一個簡易、無狀態的協定，且相當容易的受到IP誘騙(spoofing)以及重送攻擊(Replay Attacks)所影響

另外SNMP協定v1、v2及v2c版並不支援流量加密，代表在內網中很容易撈到SNMP資訊以及credential，舊版的SNMP協定只有很弱的驗證機制，甚至經常保留預設的公共設定，以及一些私人社群的字串設定，即便是SNMPv3版也只有提供DES-56的驗證及加密方法

這比DES-128還弱，DES-192bits都說不上安全了，56bit攻擊者靠暴力破解就可以解密回來了，在更新一點的版本終於支援了AES-256來加密了，由於SNMP是管理網路的協定，所以也是枚舉協定的好目標，在基本理解SNMP的用途後，我們可以來看其中一個最重要的功能“SNMP MIB樹"

SNMP資訊管理庫(SNMP Management Information Base, MIB)將所以網路管理相關的資訊儲存至資料庫中，該資料庫是樹的結構，代表會用許多節點表示各個不同的組織以及網路的功能，樹葉存放的是特定的變數值，這些樹葉可以讓外部使用者來進行存取

![MIB-Tree](https://media.secologies.com/MIB-Tree.webp)
*MIB樹[^1]*

舉例來說，MIB值所對應到特定的微軟Windows SNMP參數，比基本網路資訊包含更多的內容

| 1.3.6.1.2.1.25.1.6.0 | System Processes |
| --- | --- |
| 1.3.6.1.2.1.25.4.2.1.2 | Running Programs |
| 1.3.6.1.2.1.25.4.2.1.4 | Processes Path |
| 1.3.6.1.2.1.25.2.3.1.4 | Storage Units |
| 1.3.6.1.2.1.25.6.3.1.2 | Software Name |
| 1.3.6.1.4.1.77.1.2.25 | User Accounts |
| 1.3.6.1.2.1.6.13.1.3 | TCP Local Ports |

: Windows SNMP MIB值

我們用Nmap來掃描SNMP port，利用"-sU"參數選擇UDP掃描，以及"--open"參數把只有打開的port顯示出來

```
kali@kali:~$ sudo nmap -sU --open -p 161 192.168.50.1-254 -oG open-snmp.txt
Starting Nmap 7.92 ( https://nmap.org ) at 2022-03-14 06:02 EDT
Nmap scan report for 192.168.50.151
Host is up (0.10s latency).

PORT    STATE SERVICE
161/udp open  snmp

Nmap done: 1 IP address (1 host up) scanned in 0.49 seconds
...
```

另外我們可以用一個叫做"onesixtyone"的工具針對一連串的IP位址進行暴力破解攻擊，首先我們得先建一個文字檔，裡面要存放社群字串以及我們想要搜尋的IP目標

```
kali@kali:~$ echo public > community
kali@kali:~$ echo private >> community
kali@kali:~$ echo manager >> community

kali@kali:~$ for ip in $(seq 1 254); do echo 192.168.50.$ip; done > ips

kali@kali:~$ onesixtyone -c community -i ips
Scanning 254 hosts, 3 communities
192.168.50.151 [public] Hardware: Intel64 Family 6 Model 79 Stepping 1 AT/AT COMPATIBLE - Software: Windows Version 6.3 (Build 17763 Multiprocessor Free)
...
```

一旦我們發現了SNMP服務，我們就可以針對特定的MIB資料進行搜尋，探索SNMP值可以使用一個叫做"snmpwalk"的工具，找出SNMP中唯獨的社群字串，通常是公開的屬性資料，我們可以用上表裡的MIB值進行相對應的枚舉，如果有一台Windows執行SNMP服務，那我們可以針對該目標的公開社群字串進行查詢

利用snmpwalk可以搜索整個MIB樹，而用"-c"的參數可以選擇指哪個社群字串，"-v"則是指定SNMP的版本號，再加上"-t 10"讓10秒作為timeout的上限

```
kali@kali:~$ snmpwalk -c public -v1 -t 10 192.168.50.151
iso.3.6.1.2.1.1.1.0 = STRING: "Hardware: Intel64 Family 6 Model 79 Stepping 1 AT/AT COMPATIBLE - Software: Windows Version 6.3 (Build 17763 Multiprocessor Free)"
iso.3.6.1.2.1.1.2.0 = OID: iso.3.6.1.4.1.311.1.1.3.1.3
iso.3.6.1.2.1.1.3.0 = Timeticks: (78235) 0:13:02.35
iso.3.6.1.2.1.1.4.0 = STRING: "admin@megacorptwo.com"
iso.3.6.1.2.1.1.5.0 = STRING: "dc01.megacorptwo.com"
iso.3.6.1.2.1.1.6.0 = ""
iso.3.6.1.2.1.1.7.0 = INTEGER: 79
iso.3.6.1.2.1.2.1.0 = INTEGER: 24
...
```

根據得到的資訊我們可以獲得目標的電子郵件位址，後續就能夠拿來用在社交工程攻擊上，我們另外針對Windows目標也來嘗試SNMP枚舉，利用snmpwalk指令可以指定某個MIB樹的分支，或通常我們簡稱"OID"，針對"dc01"的機器嘗試枚舉的話

```
kali@kali:~$ snmpwalk -c public -v1 192.168.50.151 1.3.6.1.4.1.77.1.2.25
iso.3.6.1.4.1.77.1.2.25.1.1.5.71.117.101.115.116 = STRING: "Guest"
iso.3.6.1.4.1.77.1.2.25.1.1.6.107.114.98.116.103.116 = STRING: "krbtgt"
iso.3.6.1.4.1.77.1.2.25.1.1.7.115.116.117.100.101.110.116 = STRING: "student"
iso.3.6.1.4.1.77.1.2.25.1.1.13.65.100.109.105.110.105.115.116.114.97.116.111.114 = STRING: "Administrator"
```

針對特定的MIB子樹進行枚舉可以找到所有相對應的使用者帳號名稱，甚至我們可以找出現在正在執行的服務

```
kali@kali:~$ snmpwalk -c public -v1 192.168.50.151 1.3.6.1.2.1.25.4.2.1.2
iso.3.6.1.2.1.25.4.2.1.2.1 = STRING: "System Idle Process"
iso.3.6.1.2.1.25.4.2.1.2.4 = STRING: "System"
iso.3.6.1.2.1.25.4.2.1.2.88 = STRING: "Registry"
iso.3.6.1.2.1.25.4.2.1.2.260 = STRING: "smss.exe"
iso.3.6.1.2.1.25.4.2.1.2.316 = STRING: "svchost.exe"
iso.3.6.1.2.1.25.4.2.1.2.372 = STRING: "csrss.exe"
iso.3.6.1.2.1.25.4.2.1.2.472 = STRING: "svchost.exe"
iso.3.6.1.2.1.25.4.2.1.2.476 = STRING: "wininit.exe"
iso.3.6.1.2.1.25.4.2.1.2.484 = STRING: "csrss.exe"
iso.3.6.1.2.1.25.4.2.1.2.540 = STRING: "winlogon.exe"
iso.3.6.1.2.1.25.4.2.1.2.616 = STRING: "services.exe"
iso.3.6.1.2.1.25.4.2.1.2.632 = STRING: "lsass.exe"
iso.3.6.1.2.1.25.4.2.1.2.680 = STRING: "svchost.exe"
...
```

這項指令回傳了一連串的資訊，每一個都是目前正在執行的服務或process，這些資訊非常有價值，可以顯示目標機器上是否存在有漏洞的服務，或者甚至指出目標正在啟用的是哪一款防毒軟體，不過既然process都可以顯示了，自然也有辦法把目標機器上的已安裝軟體也揭露出來

```
kali@kali:~$ snmpwalk -c public -v1 192.168.50.151 1.3.6.1.2.1.25.6.3.1.2
iso.3.6.1.2.1.25.6.3.1.2.1 = STRING: "Microsoft Visual C++ 2019 X64 Minimum Runtime - 14.27.29016"
iso.3.6.1.2.1.25.6.3.1.2.2 = STRING: "VMware Tools"
iso.3.6.1.2.1.25.6.3.1.2.3 = STRING: "Microsoft Visual C++ 2019 X64 Additional Runtime - 14.27.29016"
iso.3.6.1.2.1.25.6.3.1.2.4 = STRING: "Microsoft Visual C++ 2015-2019 Redistributable (x86) - 14.27.290"
iso.3.6.1.2.1.25.6.3.1.2.5 = STRING: "Microsoft Visual C++ 2015-2019 Redistributable (x64) - 14.27.290"
iso.3.6.1.2.1.25.6.3.1.2.6 = STRING: "Microsoft Visual C++ 2019 X86 Additional Runtime - 14.27.29016"
iso.3.6.1.2.1.25.6.3.1.2.7 = STRING: "Microsoft Visual C++ 2019 X86 Minimum Runtime - 14.27.29016"
...
```

只要跟先前取得正在執行的process資訊做結合，就可以變身成為超級有價值的雙向確認清單，能讓攻擊者完全的了解目標機器上安裝的軟體是不是執行中的版本

另外SNMP枚舉也可以列出目前所使用的TCP port

```
kali@kali:~$ snmpwalk -c public -v1 192.168.50.151 1.3.6.1.2.1.6.13.1.3
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.88.0.0.0.0.0 = INTEGER: 88
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.135.0.0.0.0.0 = INTEGER: 135
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.389.0.0.0.0.0 = INTEGER: 389
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.445.0.0.0.0.0 = INTEGER: 445
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.464.0.0.0.0.0 = INTEGER: 464
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.593.0.0.0.0.0 = INTEGER: 593
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.636.0.0.0.0.0 = INTEGER: 636
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.3268.0.0.0.0.0 = INTEGER: 3268
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.3269.0.0.0.0.0 = INTEGER: 3269
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.5357.0.0.0.0.0 = INTEGER: 5357
iso.3.6.1.2.1.6.13.1.3.0.0.0.0.5985.0.0.0.0.0 = INTEGER: 5985
...
```

回傳的整數值都是目標機器上目前使用的的TCP port，這個資訊也超級有用，點出了目前有用到的port，並且也揭露出之前工具沒找到的port

以上就是主動式資料搜集的其他種工具方法，包括SMB、SMTP以及SNMP協定進行枚舉探索，找出更多的資訊讓攻擊者再下一輪的偵查中能縮小更多範圍

[^1]: IBM, "Management Information Base", [https://www.ibm.com/docs/en/aix/7.1.0?topic=management-information-base](https://www.ibm.com/docs/en/aix/7.1.0?topic=management-information-base)
