---
title: "Palo Alto 防火牆高可用性 High Availability 設定"
date: 2023-06-28
description: 本次實驗中我們準備兩台 Palo Alto 虛擬機，為了完成防火牆高可用性 High Availability (HA) 的設定，必須讓這兩台機器都在同一個網段，高可用性作為現代次世代防火牆應對流量越發增益的 DDoS 攻擊是必不可少的功能，故本篇文章想跟讀者介紹 PA HA 設定
hideTOC: false
targetKeyword: Palo Alto 防火牆
draft: false
tags: 
  - "ha"
  - "high-availability"
  - "palo-alto"
  - "防火牆"
  - "高可用性"
lang: zh
---
## 前言

本次實驗中我們準備兩台 Palo Alto 虛擬機，為了完成防火牆高可用性 High Availability (HA) 的設定，必須讓這兩台機器都在同一個網段，而我分別設定

1. 192.168.84.15
2. 192.168.84.16

架構圖如下：

![PAHAArchitecture](https://media.secologies.com/PAHAArchitecture.webp)

接著我們就可以開始設定了

## 高可用性設定

首先進到 Interface 設定，我們需要先指定哪兩隻腳做 HA 的操作，這裡我選擇 eth6 跟 eth7 做連接

![PAHAInterface](https://media.secologies.com/PAHAInterface-1024x57.webp)

各自點進去不同的腳設定 type 成 HA

![PAInterfaceEnableHA1](https://media.secologies.com/PAInterfaceEnableHA1.webp)

![PAInterfaceEnableHA2](https://media.secologies.com/PAInterfaceEnableHA2.webp)

### General Setup

然後在主設定把兩個串接，先到Device→High Availability→General→Setup

![HAActiveGeneral](https://media.secologies.com/HAActiveGeneral-1024x462.webp)

點選 Setup 右側的齒輪，將 HA 模式勾選啟動，Group ID 我們實驗時是先隨便給一個數字，但要確保兩台 Palo Alto 防火牆的 Group ID 必須是一樣的

另外 Peer HA1 IP Address 要設定成另一台 PA 的 HA1 IP

![HAActiveSetup](https://media.secologies.com/HAActiveSetup.webp)

### Control Link(HA1) Setup

同時要記得設定自己的 HA1 IP，到 Device→High Availability→Control Link

![HAActiveControlLink](https://media.secologies.com/HAActiveControlLink-1024x258.webp)

一樣按下右側的齒輪可以進行設定

![HAActiveControlLinkSetup](https://media.secologies.com/HAActiveControlLinkSetup.webp)

### Data Link (HA2) Setup

我們選擇的第二隻腳 eth7 也做一樣的事情

![HAPassiv](https://media.secologies.com/HAPassiv.webp)

![HAPassiveSetup](https://media.secologies.com/HAPassiveSetup.webp)

## Election Settings Setup

![ElectionSetting](https://media.secologies.com/ElectionSetting-1024x315.webp)

觸發條件我們設定一個優先級，如果企業越看重 HA 的功能，可以把級數再往上調

![ElectionSettingDetail](https://media.secologies.com/ElectionSettingDetail.webp)

通常設定到這裡後我們就可以按下 commit 了

## 備援的另一方

另一台也做一樣的設定，記得 IP 不要搞錯即可

## 檢查 HA 是否設定成功

那我們如何確認 HA 的狀態有正確打開了呢？我們到Dashboard→Widgets→System→High Availability 檢查

![DashboardEnableHA](https://media.secologies.com/DashboardEnableHA.webp)

前面 commit 完後先稍等一下等兩台互相溝通，等到除了 Peer 之外都是綠燈的話就代表我們成功設定好了，而 Local 則代表目前主防火牆機器是 Active 還是 Passive 的狀態

![HAActive](https://media.secologies.com/HAActive.webp)

![HAPassive](https://media.secologies.com/HAPassive.webp)

## HA Passive 切換模式

為了讓兩台機器之間可以自動切換，我們找到 Device→High Availability→General→Active/Passive Settings

![SwitchEnable](https://media.secologies.com/SwitchEnable-1024x264.webp)

預設應該會是打開 auto 的，也可以透過右側的齒輪進行調整，這代表如果主防火牆掛掉後就會自動切換到備援的防火牆上

![SwitchEnableDetail](https://media.secologies.com/SwitchEnableDetail.webp)

## Link and Path 監控

該監控是為了設定切換時的條件，以及切換哪些東西到備援防火牆上，到Device→High Availability→Link and Path Monitoring→Link Monitoring，把 Enabled 打開，此時可以看到底下有兩個選項

![LinkMonitor](https://media.secologies.com/LinkMonitor-1024x325.webp)

按下右邊的齒輪可以進一步設定，可以看到有 any 跟 all 這兩個選項，這些選項針對 Link Group 做套用，any 代表 Link Group 其中一隻腳斷線後就會進行切換，而 all 則是全部腳斷線後才會切換

![LinkMonitorDetail](https://media.secologies.com/LinkMonitorDetail.webp)

## 驗證

而我們進行測試時是嘗試把其中一台 VM 的網卡拔掉

![ESXiInterface](https://media.secologies.com/ESXiInterface.webp)

將該台 VM 弄好 NAT 後嘗試 ping 出去

![PingResult](https://media.secologies.com/PingResult-1024x794.webp)

拔掉網卡後接著看 HA Active 那台的 Log 是否停住

![PAPingLog2](https://media.secologies.com/PAPingLog2-1024x505.webp)

以及檢查接下來的 ping 動作有沒有切換成另一台 VM 的腳繼續動作

![PAPingLog](https://media.secologies.com/PAPingLog-1024x580.webp)
