---
title: "硬體木馬簡介"
date: 2025-08-30
description: 何謂木馬硬體？基本上就是在現有電路元件上加入惡意的元件或變更舊有的功能，實現在原本的電路中製造木馬或者後門給攻擊者，硬體木馬可以改變原有的功能行為
hideTOC: false
targetKeyword: 硬體木馬
draft: false
tags: 
  - "ic晶片"
  - "ip設計"
  - "side-channel攻擊"
  - "密碼模組"
  - "硬體木馬"
lang: zh
---
## 何謂硬體木馬？

基本上就是在現有電路元件上加入惡意的元件或變更舊有的功能，實現在原本的電路中製造木馬或者後門給攻擊者，硬體木馬可以改變原有的功能行為，例如把原本要偵錯的code其0變1，1變0讓輸出全都亂掉，而只要失誤率大到不能忽略，甚至會降低晶片的可信任度，從而打擊 IC 或 IP 公司的商譽，更甚至有些目標是洩漏重要的資訊，例如針對加密元件變更洩漏出私鑰

第一篇專門研究如何防範硬體木馬由Agrawal et. al.[^1]等人在2007年提出，這篇使用noise模型建構一系列的fingerprints給同一組IC的系列型號，利用Side-Channel資訊像是電壓、溫度以及電磁資訊等等，其結論為利用數位信號技術可以檢測出比主電路還小3~4個維度的硬體木馬出來

## 結構

基礎的硬體木馬由兩種元件組成

- Trigger：監控原生電路中數個信號線或者連續型的事件信號，此種根據原先IC/IP設計來決定，端看攻擊者選擇
- Payload：在原生沒有木馬的硬體中監聽trigger的信號來決定輸出的結果

![Minimalist-Hardware-Trojan-Horse-example](https://media.secologies.com/Minimalist-Hardware-Trojan-Horse-example.webp)
*Minimalist Hardware Trojan Horse example[^2]*

基於這兩個元件，還得遵守一些原則，首先 Payload 必須由較少使用到的電路節點條件來觸發，這是為了保證使用者不會發現暗藏的電路行為，尤其在IP設計合成電路如果檢測過程中看到異常的輸出會起疑所以才需要，所以要監控到重要的電路節點，但測試時要躲避檢測覆蓋率，為的是一般電路行為不能抓到我們任何一組Trigger或Payload

![Hardware-Trojans-type](https://media.secologies.com/Hardware-Trojans-type.webp)

而在國外一些軍方會將硬體木馬當成自家武器系統的緊急斷電開關或者用來植入對手的武器系統作為後門，因為這種木馬有幾點好處

- 硬體木馬使用到的電路面積非常小
- 與主電路相比硬體木馬幾乎是奈米程度的大小，這代表IC/IP公司用物理手段或者破壞性逆向工程都看不出來電路圖有問題
- 硬體木馬只會在非常非常特殊的條件下觸發，幾乎可以看成是隨機出現的，或者某些功能組合起來才觸發一次
- 即使委外第三方檢測公司如果團隊拿一般測試功能的腳本其覆蓋率無法保證一定能找到硬體木馬
- 木馬的條件可以根據電路裡的元件做變化，可以躲避固定參數化信號的簡易分析

## 範例

我們介紹其中一種最基本但也最經典的木馬硬體型態，如前所述木馬硬體除了篡改輸出結果導致晶片失效之外，側錄隱私資訊也是其中很重要的目標之一，所以有些木馬是針對硬體安全模組晶片內的密碼元件，為的是之後再進行Side-Channel攻擊錄電壓時接收到密碼模組是否洩漏任何secret key的資訊

![MOLES](https://media.secologies.com/MOLES.webp)
*Malicious Off-chip Leakage Enabled by Side-channels (MOLES)[^3]*

上圖將木馬硬體置放在密碼生成模組之前，當電容 $C$ 從充電狀態 0 $\rightarrow$ 1 或放電狀態 1 $\rightarrow$ 0 時 $P$ 就是驅動電容元件時的微量電壓耗能，而攻擊者側錄的就是 $P$ 這塊

而下圖則是MOLES裡的PRNG與 $P$ 作動採用的LFSR電路，透過主動延遲取得各個功耗的頻率，找出何時會進行充放電動作逆向回去計算時間，最終推敲出演算法頻率

![MOLES-diagram](https://media.secologies.com/MOLES-diagram.webp)
*Diagram of an experimental MOLES[^3]*

## 結論

除了上述根據線路還有元件最基本款的木馬硬體之外，從古至今已經有許多種分類如下圖

![HT-Taxonomy](https://media.secologies.com/HT-Taxonomy.webp)

有著如此多的分類是因為隨著晶片技術越來越發達，也代表有越來越多問題要處理：

- 攻擊者在不同的IC設計階段時有哪些攻擊手法？
- 攻擊者在不同抽象層時有什麼能力可以觸發攻擊？
- 隨著硬體木馬檢測技術的持續發展，有哪些挑戰或問題是攻擊者想要攻克的？
- 攻擊者會如何破解最新的硬體木馬檢測技術？我們需要發展何種新檢測技術？

隨著現今IC晶片越來越重要，越來越多惡意組織發現這些公司會讓他們盆滿鉢滿所以花更多心力在攻擊半導體公司，檢測硬體木馬的技術必須要有更多人投入，但國內也有像[陳君朋教授](https://cybersec.ithome.com.tw/2024/speaker-page/553)跟中研院[楊柏因特聘研究員](https://homepage.iis.sinica.edu.tw/pages/byyang/contact_zh.html)的團隊正在努力當中，所以各位可以花些心力往這塊研究發展

[^1]: Dakshi Agrawal, Selcuk Baktir, Deniz Karakoyunlu, Pankaj Rohatgi, and Berk Sunar. 2007. Trojan Detection using IC Fingerprinting. In Proceedings of the 2007 IEEE Symposium on Security and Privacy (SP '07). IEEE Computer Society, USA, 296–310. https://doi.org/10.1109/SP.2007.36, [https://dl.acm.org/doi/10.1109/SP.2007.36](https://dl.acm.org/doi/10.1109/SP.2007.36)

[^2]: Shivam Bhasin, Jean-Luc Danger, Sylvain Guilley, Xuan Thuy Ngo, and Laurent Sauvage. 2013. Hardware Trojan Horses in Cryptographic IP Cores. In Proceedings of the 2013 Workshop on Fault Diagnosis and Tolerance in Cryptography (FDTC '13). IEEE Computer Society, USA, 15–29. https://doi.org/10.1109/FDTC.2013.15, [https://eprint.iacr.org/2014/750](https://eprint.iacr.org/2014/750)

[^3]: Lang Lin, Wayne Burleson, and Christof Paar. 2009. MOLES: malicious off-chip leakage enabled by side-channels. In Proceedings of the 2009 International Conference on Computer-Aided Design (ICCAD '09). Association for Computing Machinery, New York, NY, USA, 117–122. https://doi.org/10.1145/1687399.1687425, [https://dl.acm.org/doi/10.1145/1687399.1687425](https://dl.acm.org/doi/10.1145/1687399.1687425)

