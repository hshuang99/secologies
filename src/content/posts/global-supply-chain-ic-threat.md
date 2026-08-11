---
title: "全球供應鏈IC之設計威脅"
date: 2025-03-30
description: 硬體的安全問題其實主要來自於兩個方面 1. 不同設計層級舊有的問題被整合時所繼承 2.目前電子廠商沒有考慮設計robust的硬體元件來支援軟體或系統安全 上述兩點其實也點出了硬體的信任問題其實就出在IC製造過程中可能引入了不可信任的元件
hideTOC: false
targetKeyword: 全球供應鏈 IC 威脅
draft: false
tags: 
  - "ic設計"
  - "ip設計"
  - "全球供應鏈"
  - "威脅模型"
  - "硬體威脅"
lang: zh
---
## VLSI設計威脅

硬體的安全問題其實主要來自於兩個方面

- 不同設計層級舊有的問題被整合時所繼承

- 目前電子廠商沒有考慮設計robust的硬體元件來支援軟體或系統安全

上述兩點其實也點出了硬體的信任問題其實就出在IC製造過程中可能引入了不可信任的元件，其中包含使用不可信任的IP(Intellectual Property)或CAD(Computer-Aided Design)工具廠商背景有些模糊，這樣後續還會出現是否可信任的設計、Fab(fabrication)方法、測試設計以及分包下去的工廠是不是屬於Gold等級種種都在這個Life Cycle當中息息相關，每一個環節都有可能違反信任原則讓硬體可靠度下降

而無法信任的元件會引起一些資安的疑慮，像是感覺有問題的IP可能包含一些惡意實作功能，造成某些bitstream過度的輸出或要求MPU不斷地幫忙計算某個公式導致類似DoS(Denial of Service)的攻擊，或在元件執行期間不斷地洩漏資訊，這類問題可能變成DD(Digital Designer)/AD(Analog Designer)已經將電路設計做到最佳化，但硬體效率還是很差或功耗一直降不下去，從而讓DV(Design Verifier)評估該設計可信度降低

會有這樣的情形發生就起始於VLSI繁雜的設計流程，IC最基本組成有三大要素

1. 設計(Degisn)
2. 製造(Fabrication)
3. 測試與封裝(Testing and Packaging)

但其實在各個層面還有許多廠商或公司參與完成一顆晶片

![VLSI-1](https://media.secologies.com/VLSI-1-870x1024.webp)

![VLSI-2](https://media.secologies.com/VLSI-2-1024x797.webp)

對於製造過程中經手了多家公司就代表每一階段都存在潛在風險

![VLSI-Flow](https://media.secologies.com/VLSI-Flow-1024x624.webp)

畢竟現代資通訊設備要求的硬體規格越來越好，CPU/MPU得開始做些邊緣運算、甚至小型的AI計算，為了儲存越來越大的計算結果或暫存資料使得必須要放入更多的memory空間，而計算跟儲存之間速度也要求越來越快，現代人無法再去適應我們以前資通訊設備開機讀檔要花個10、20秒的情形，Bus的優化設計也要求越來越高，甚至得在記憶體當中就先運算好一些結果在傳給MPU，更不用說要支援不同的通訊協定得遵照對方的規格

![SoB2SoC](https://media.secologies.com/SoB2SoC-1024x534.webp)

## Intellectual Property (IP)

一組預先制定好的特定功能，且已經設計完成並驗證過可用來重複利用放進SoC設計當中輔助區塊就稱作IP，在市面上有高通、瑞昱、聯詠科技、聯發科技等等都有專門的工程師在設計IP，主要有做成軟體IP以及硬體IP(也可稱作Silicon IP)，而IP就可以想成是IC設計公司的專利，他們把一些目前資通訊產品所必須要的功能做到最佳化表現後再包成一個區塊賣給其他製造商，像是可以設計一些

- Foundation IP，像是cell library跟gate array
- Standard IP，支援MPEG2/4, JEPG, USB, IEEE 1394, PCI,....等基本協定
- Star IP，像是ARM、MIPS、Rambus,....這類建構成架構或平台讓工程師在上面開發，底層優化已經被IP公司完成，DD/AD可能就專心在上面實現新功能

而設計公司的存在還能夠讓客戶點客製化的菜單，像是想要在不同層級之間傳輸資料的IP、軟硬體的介面支援、不同階層的模組化等等讓工程師可以去選配要何種設置或參數讓自己的IC設計更有彈性

![IP](https://media.secologies.com/IP-1024x649.webp)

但也正因為IP設計不需要工廠所以讓全球都有機會找到工程師來設計IP，在各地公司驗證方法不同的情況下也許某些廠商注重的是bus的傳輸效率，有些注重MPU計算效能，但可以說每家標準不同導致了後續SoC設計雖然透過全球供應鏈可以找到更多的IP，但也增加了更多層面的信任或完整性問題威脅

![IP-Vendors](https://media.secologies.com/IP-Vendors-1024x475.webp)

![Global-supply-chain](https://media.secologies.com/Global-supply-chain-1024x451.webp)
*全球價值鏈狀況[^1]*

## IC供應鏈之下的硬體威脅

在全球供應鏈的情況下剽竊、使用過量、逆向工程以及惡意功能攥改等威脅發生在離開產地後對於不同國家智慧財產權的IP掌握其實就管不太到

![IC-supply](https://media.secologies.com/IC-supply-1024x295.webp)

細部分下去許多層面用到的方法可能還存在更多的威脅，像是IP製造商可能會被潛伏在公司內的間諜插入硬體木馬讓該公司爆出相關威脅讓商譽降低，或者在豬屎屋可能有不肖業者不斷地去觀察IP的情況嘗試逆向工程回去複製該功能，往後可能他們就不需要再買更多授權，而到了工廠要製造時也許存在有心人士生產同一型號的晶片比當初公司下定的還多，然後把多的收起來自己拿去實驗逆向工程裡面的功能，以此要脅該公司，而最後封裝時旁道攻擊就是常見的一種手法，敵對公司待在封裝工廠裡透過CAD工具額外加進去一些會讓資訊洩漏的電路而後讓讀取bitstream或電流更加順利反向解回原始資訊，這就等同於開了後門給某間特定公司可以搜集對手的資料等等

![Attack-Vectors](https://media.secologies.com/Attack-Vectors-1024x680.webp)

## IC供應鏈的威脅模型

既然每一層級都有可能存在潛在風險，那麼就得先假定出攻擊者的樣貌

- 我們需要先知道在整個設計過程中最有可能出現的攻擊會是哪種
- 再來該攻擊是否容易實現，或者需要內神通外鬼嗎
- 嘗試進行一些預先假設的情境
    - 我們需要假設攻擊者的能力以及他們會使用哪種漏洞
    - 以及我們假設出來的情境是否可實現或其他層面有機會嗎

- 而在IC製造的Life Cycle中每一階段都要去想像是否有可能發生
    - 是否會造成任何損害(經濟損失或者商譽損害)

![IC-Threat-Model](https://media.secologies.com/IC-Threat-Model.webp)

一些比較常見的情境假設我們一樣從CIA的角度來看會有像是IC仿冒、資料外洩、蓄意破壞或者更改等等方法

![IC-Threat-Model-Attack](https://media.secologies.com/IC-Threat-Model-Attack-1024x566.webp)

而一些研究提到這類的攻擊情況也許就可以制定出驗證function方法，在硬體上formal verification其實已經行之有年了，畢竟DV每天都要驗證大量的IP功能，查看輸入輸出結果跟bitstream在時序下是否都正常，而在硬體安全的研究上就拿來驗證受到如上面所提到插入木馬硬體或惡意破壞干擾後是否有讓每一時序下的bitstream受到影響來判斷，不過formal verification其實也一樣沒有統一的標準，每家廠商都有自己的驗證方法，所以最終報告會顯示的通常是電路執行覆蓋率

![IC-Threat-Model-Verification](https://media.secologies.com/IC-Threat-Model-Verification.webp)

[^1]: Boston Consulting Group, "Strengthening the Global Semiconductor Supply Chain in an Uncertain Era", Semiconductor Industry Association, https://www.semiconductors.org/strengthening-the-global-semiconductor-supply-chain-in-an-uncertain-era/

