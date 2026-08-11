---
title: "Palo Alto 防火牆指令介面顯示過往指令操作"
date: 2023-06-30
description: 有時候實體機器跟虛擬機的計算資源比較少，此時無法花太多運算能力給網頁介面時會變得怪怪的，而這時我們直接在指令介面操作會比較順暢，首先我們開啟防火牆的 shell
hideTOC: false
targetKeyword: Palo Alto 防火牆
draft: false
tags: 
  - "palo-alto"
  - "指令介面"
  - "過往指令"
  - "防火牆"
lang: zh
---
有時候實體機器跟虛擬機的計算資源比較少，此時無法花太多運算能力給網頁介面時會變得怪怪的，而這時我們直接在指令介面操作會比較順暢，首先我們開啟防火牆的 shell

```
admin@PA-VM(active)>
```

然後我們指令介面轉調成 output 模式

```
set cli config-output-format set
```

接著把 page function 的功能限制關閉，就可以直接把所以 command 顯示出來

```
set cli pager off
```

接著進入 configure 模式

```
admin@PA-VM(active)>configure
```

接著我們就可以把過去在 PA 防火牆輸入過的指令顯示出來

```
admin@PA-VM(active)>show
```

```
set deviceconfig system ssh profiles mgmt-profiles server-profiles MGMT-Server-Profile ciphers [ aes128-ctr aes192-ctr aes256-ctr aes128-gcm aes256-gcm ]
set deviceconfig system ssh profiles mgmt-profiles server-profiles MGMT-Server-Profile mac hmac-sha2-256
set deviceconfig system ssh profiles mgmt-profiles server-profiles MGMT-Server-Profile session-rekey interval 60
set deviceconfig system ssh profiles mgmt-profiles server-profiles MGMT-Server-Profile default-hostkey key-type ECDSA 521
set deviceconfig system ssh mgmt server-profile MGMT-Server-Profile
set deviceconfig system type static 
set deviceconfig system update-server updates.paloaltonetworks.com
set deviceconfig system update-schedule threats recurring weekly day-of-week wednesday
set deviceconfig system update-schedule threats recurring weekly at 01:02
set deviceconfig system update-schedule threats recurring weekly action download-only
set deviceconfig system timezone Asia/Taipei
set deviceconfig system service disable-telnet yes
set deviceconfig system service disable-http yes
set deviceconfig system service disable-snmp no
set deviceconfig system service disable-userid-syslog-listener-ssl no
set deviceconfig system service disable-userid-service no
set deviceconfig system service disable-userid-syslog-listener-udp no
set deviceconfig system hostname PA-VM169
set deviceconfig system ip-address 192.168.89.169
set deviceconfig system netmask 255.255.255.0
set deviceconfig system default-gateway 192.168.89.253
set deviceconfig system dns-setting servers primary 8.8.8.8
set deviceconfig system dns-setting servers secondary 192.168.88.151
set deviceconfig system locale zh_TW
set deviceconfig system geo-location
.....
```

確認完自己過去從網頁介面下過的指令後，一樣可以在 configure 模式下送出我們想操作的指令，下完之後在送出就行

```
admin@PA-VM(active)>commit
```

