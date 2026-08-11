---
title: "資安標準與框架簡介"
date: 2025-09-04
description: "遵照已經審查過的標準與框架可以加快我們在組織內施行相關安全政策的速度，尤其PCI DSS、CIS Top 18、NIST網路安全框架、MITRE ATT&CK跟D3FEND、ISA/IEC 62443、Cyber Kill Chain、FedRAMP等經過審查的標準與框架更是值得參考"
hideTOC: false
targetKeyword: 資安標準與框架
draft: false
tags: 
  - "cis-top-18"
  - "cyber-kill-chain"
  - "fedramp"
  - "isa-iec-62443"
  - "mitre"
  - "mitre-attck"
  - "mitre-d3fend"
  - "nist網路安全框架"
  - "pci-dss"
  - "框架"
  - "標準"
lang: zh
---
## PCI DSS

付款卡工業資料安全標準(Payment Card Industry Data Security Standard, PCI DSS)於2004年推出，由主要幾家金融卡公司統一標準讓企業可以處理消費者的付款資訊，並且由付款卡工業協定協會管理這項標準，其目的是確保付款資訊被適當且安全的處理以降低金融卡詐騙事件發生

PCI DSS由數項條件組成，而參與的公司必須每年檢查是否合規，大部分的條件與其他產業規範的很類似，不外乎是網路跟系統的安全性、存取控管機制、漏洞管理以及監控策略等等，例如某項要求就是禁止使用廠商提供的預設系統密碼跟其他預設的參數，其他條件還有要求針對金融卡有特定的格式，例如有項條件說明可儲存的金融卡資料類型要長怎樣，並且如何保護該資料等等

## CIS Top 18

網際網路安全性中心基準(Center for Internet Security (CIS) Critical Security Controls, CIS Controls)是為了提升企業安全性而推薦18項安全性控管的標準，此基準雖然並非法規，但涉及到法規關注的領域，包括保護資料、存取控制管理、持續性漏洞管理、惡意軟體偵測等等

這些控管被區分成三類可實作的防護機制群組(Implementation Gropus, IG1, IG2, IG3)以確保防護的優先順序，IG1的控管組成由針對常見的攻擊手法實作出最小標準來讓每間組織都可以適用，通常能夠讓小型企業內有限的IT人員負荷，針對低隱私性資料來管理

IG2由額外的防護機制組成以用來處理更為複雜的組織，一般來說有數個部門及員工共同管理IT基礎建設，針對稍微需要隱私的消費者或專利資料，而IG3則使用到所有的防護機制，交由聘請的資安專家管理所有隱密性資料，補足其他IT部門可能疏忽的缺口

## NIST網路安全框架

美國國家標準與技術局(National Institute for Standards and Technology)所制定的網路安全框架，其收錄眾多標準與實作守則供企業參考以降低網路安全風險，原先是為了幫忙保護關鍵基礎建設而設計的，接著稍微修改就讓許多組織可以使用該標準

NIST的框架包含三個元件：

- 核心
- 實作階層
- 輪廓

### 核心

該框架的核心屬於網路安全行動及結果的集合，可以分成六個抽象功能

1. 管理 (Govern)
2. 識別 (Identify, ID)
3. 保護 (Protect, PR)
4. 偵測 (Detect, DE)
5. 回應 (Respond, RS)
6. 復原 (Recover, RC)

![NIST-Cybersecurity-Framework](https://media.secologies.com/NIST-Cybersecurity-Framework.webp)
*NIST網路安全框架[^1]*

每個功能都包含數個分類，舉例來說識別功能由資產管理(Asset Management, ID.AM)、風險評估(Risk Assessment, ID.RA)以及優化(Improvement, ID.IM)三個分類組成，在這三個分類之下又包含其他子分類描述安全性優化會得到的結果，以及相關的參考資料

例如風險評估ID.RA由10個子分類組成，從ID.RA.1：已識別出資產內的漏洞、有效性驗證及紀錄，最終到ID.RA.10：關鍵供應商在採購前均須接受評估，如此一來這些子類別就是更加深入的探討技術上的實作可行性

### 實作階層

該框架的實作階層明確衡量組織的網路安全實作，檢查有多少程度是符合核心子類別所採用的結果，總共有四種層級

- 部分(Partial)：屬於最小的層級
- 理解風險(Risk-Informed)
- 可重複(Repeatable)
- 可適應性(Adaptive)

### 輪廓

框架的輪廓參考目前組織內的網路安全措施實作(目前的輪廓)與該組織的理想結果(目標的輪廓)中間的差異，由公司的商業目標、需求、控管機制以及理想結果來決定之間的差距有多少，從而讓組織進行比較輪廓分析之間的差距，並且理解目前優先順序該怎麼做

## MITRE ATT&CK、D3FEND

由MITRE組織[^2]所制定與收集的網路安全框架，針對惡意組織的攻擊者如何利用一連串的手法滲透系統與達成他們的目標做分類，這個框架被稱作MITRE ATT&CK框架[^3]，由於全球的惡意組織只會不斷地更新，所以這個框架其實也一直頻繁的收錄最新的[[table-top-tactics|檯面策略]]

同樣的有矛就該有盾，所以MITRE也從防禦視角釋出了鏡像版的框架，如果說ATT&CK是分類現實中威脅角色的多種入侵手法，那麼D3FEND[^4]就是讓防禦人員能夠採取最好的措施、行為與方法來避免、偵測、修補以及回應所有現實中攻擊的框架

## ISA/IEC 62443

此標準ISA/IEC 62443對於組織內的工業自動化系統是很重要的基準，此標準定義工業自動化控制系統(Industrial Automation and Control Systems, IACS)的安全條件，另外這個標準也與工業OT(Operational Technology)息息相關

從半導體廠商或國家級關鍵基礎建設(例如核電廠、關鍵電網等等)被攻擊後，這些協定提供安全控管措施給工控系統，以及評量組織內的工控安全成熟度就顯得非常重要了

## 網路狙殺鏈 Cyber Kill Chain

網路狙殺鏈這套方法由洛克希德·馬丁(Lockheed Martin)這家美國國防公司開發出來幫助防禦人員識別與抵抗網路攻擊，主要分成七個攻擊循環的階段：

1. 偵查 (Reconnaissance)
2. 武器化 (Weaponization)
3. 投送 (Delivery)
4. 漏洞利用 (Exploitation)
5. 安裝 (Installation
6. 指揮與控制 (Command and Control)
7. 行動目標 (Actions on Objectives)

在**(1)偵查階段**攻擊者會找出目標以及模擬潛在的漏洞進行演練，**(2)武器化**將目標的弱點轉變成實質的漏洞利用工具，之後將工具**(3)投送**進去目標設備裡(網路傳送或花錢請該公司職員把工具送進去，更老套的方法是把工具裝進隨身碟裡扔在公司外面，看會不會有員工帶進去插進電腦裡🤣)，成功傳進去後透過**(4)漏洞利用**將惡意payload在目標系統裡執行

執行完惡意payload後**_(5)安裝_**惡意軟體進該系統內，這個惡意軟體是為了後續接收攻擊者的**(6)指揮與控制**指令存在的，最終攻擊者發出指令**(7)行動目標**來達成他們的目的，可能是要竊取資料、變更設備資訊或者破壞系統等等，此外這個鏈雖然有順序，但只要其中一個環節被防禦人員破解，那麼攻擊者就會回到那個階段進行修補從頭來過，所以不要認為攻擊只會出現一次

![Cyber-Kill-Chain](https://media.secologies.com/Cyber-Kill-Chain.webp)

## FedRAMP

聯邦風險與授權管理程式(Federal Risk and Authorization Management Program, FedRAMP)是美國聯邦政府開發出來的一套標準程式，該程式提供標準化的雲端服務安全框架給聯邦政府內部機構使用

在此框架出現之前，不同的聯邦機構要使用雲端服務時必須獲得多重的授權，然而遵守FedRAMP的框架下允許所有政府機構只需要取得單一授權即可，其目的是為加速政府機構採用雲端服務的簽呈同時也確保服務的安全性，其中控管機制是植基在NIST SP 800-53第4版的標準下，其中特別加強雲端計算相關的控管技術

[^1]: The NIST Cybersecurity Framework (CSF) 2.0：[https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf](https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf)
[^2]: MITRE Corporation：[https://www.mitre.org/](https://www.mitre.org/)
[^3]: MITRE ATT&CK：[https://attack.mitre.org/](https://attack.mitre.org/)
[^4]: MITRE D3FEND：[https://d3fend.mitre.org/](https://d3fend.mitre.org/)
