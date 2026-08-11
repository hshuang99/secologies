---
title: "MITRE ATT&CK 框架"
date: 2025-12-25
description: "MITRE 於 2013 年啟動 ATT&CK 架構，旨在建立全球可結構化查詢的網路攻擊戰術和技術知識庫，反應出駭客發起攻擊生命週期的各個階段以及已知的目標平台，該架構重點關注外部惡意者如何入侵與操作電腦資訊，其知識庫被用作民營部門、政府部門、企業和個人開發特定威脅模型和方法的基礎"
hideTOC: false
targetKeyword: MITRE ATT&CK
draft: false
tags: 
  - "mitre-attck"
  - "stix格式"
  - "戰術"
  - "技術"
  - "程序"
lang: zh
---
## 前言

MITRE 屬於美國非營利組織，其管理著由聯邦政府資助的研究和開發中心 (Federally Funded Research and Development Center, FFRDC)，主要支援美國政府在航空、國防、醫療保健、國土安全和網路安全等領域的各個機構

於 2013 年啟動 ATT&CK 架構，旨在建立全球可結構化查詢的網路攻擊戰術和技術知識庫，反應出駭客發起攻擊生命週期的各個階段以及已知的目標平台，該架構重點關注外部惡意者如何入侵與操作電腦資訊，其知識庫被用作民營部門、政府部門、企業和個人開發特定威脅模型和方法的基礎

起源於記錄和分類 Microsoft Windows 系統的戰術 (Tactics)、技術 (Techniques)與程序 (Procedures)，我們時常簡稱為 TTPs，以改進對惡意行為的檢測，而它已發展到 Linux 和  macOS 上的行為都有收錄

大方向來看該架構主要還是針對企業系統、行動設備系統以及工業控制系統為目標，並擴展到涵蓋導致環境受到損害的行為、移動設備，可以將 ATT&CK 看成一個行為模型，研究駭客如何與系統互動，以及他們的意圖和行為

## ATT&CK 痛苦金字塔

![Pyramid-of-Pain-v2](https://media.secologies.com/Pyramid-of-Pain-v2.webp)
*[^1]*

由於要建構出惡意攻擊者的所有手段，我們必須參考許多[[indicators-of-compromise|威脅情報指標]]才有辦法組合出原貌，此階段 David J. Bianco[^1] 提出了痛苦金字塔這一概念，透過分析下列：

1. 雜湊值：SHA1、MD5 或 SHA-256，對應於特定的可疑或惡意檔案
2. IP 地址：攻擊來源的 IP 地址，或者是網路區段
3. 域名：由 C&C 伺服器或惡意網站使用的域名
4. 網路/主機工具：網路痕跡，攻擊者在網路或主機上的活動所造成的可觀察現象
5. 工具：攻擊者用來完成任務所使用的軟體
6. 戰術、技術和程序：攻擊者如何完成任務，從偵察到資料外洩，以及介於兩者之間的每一步驟

來拼湊出關於攻擊者的所有線索

## ATT&CK 開發流程

而該框架如果需要精確識別出惡意組織的行為模式，勢必就需要三個面向來探索，這三個面向分別為：紅隊、藍隊跟紫隊

紅隊：在網路攻防戰中扮演攻擊者；負責模擬攻擊，目的是試圖攻破、入侵或以其他方式破壞被攻擊方的系統，以找出該系統的漏洞和弱點

藍隊：充當網路防禦者；利用分析技術偵測紅隊的活動。負責防禦系統、網路和保護資產，主要目標是防止、偵測和回應各種安全威脅

紫隊：為測試防禦系統制定威脅情境；與紅隊和藍隊合作，解決網路攻防中出現的問題，確保紅隊和藍隊之間的有效溝通和協作，並整合紅隊的發現和藍隊的反饋，以形成全面的安全策略

在這三方的合作之下，ATT&CK 可以根據七個步驟來鎖定攻擊者的路徑：

1. 識別行為
2. 獲取資料
3. 開發分析
4. 攻擊者模擬
5. 威脅模擬
6. 調查攻擊
7. 評估性能

如此能夠應用於下列的情境中

- 惡意攻擊者模擬
- 紅隊演練
- 行為分析開發
- 防禦差距評估
- SOC 成熟性評估
- 豐富網路威脅情資

### Security Operation Center (SOC)

我們稍微解釋一下上一節的 SOC，請讀者不要跟系統單晶片的 System on a Chip(SoC) 搞混了，我們在資安裡談 SOC 通常是指由安全專業人員組成的團隊，負責 24 小時 / 7 天監控組織的整個基礎設施，以即時檢測網絡安全事件並儘快有效地解決這些問題

維持 SOC 的條件包括：

- 準備：資產盤點
- 計畫：事件響應計畫
- 預防：日常維護與定期測試
- 監控：日誌管理
- 偵測：威脅檢測
- 響應：事件響應
- 恢復：回復與補救
- 完善：事後剖析與細化
- 合規：符合法規管理

過去單靠人力要維持 SOC 這一塊真的很辛苦，晚上時間美國發布的漏洞資訊後，如果產品或服務裡有中標的，睡覺睡到一半都會被主管 on call 挖起來，幸好這時代可以靠 ML/DL/RL 來設計機器可以判斷跟預測的模型，雖說最新的手法還是得依賴人為判斷，但至少模型減輕了我們一些負擔

## ATT&CK 模型

![MITRE-ATTCK-Matrix](https://media.secologies.com/MITRE-ATTCK-Matrix-scaled.webp)
*[^2]*

接下來進入正題，讓我們來介紹MITRE ATT&CK這個模型的內容吧，以上圖在官方截取為例，紅框圈起來為戰術 Tactics，代表攻擊者預期達成的目標總共 14 個，籃框圈起來的為 Tactics 可達到該目標的技術 Techniques

最後黃色格子代表發現相同的 Techniques 也會對應多個 Tactics，取決於該做法 Procedures 是為了達成什麼目的

### 戰術 Tactics

使用者可以根據目標惡意攻擊者的行為判定目前是在哪一個戰術分類底下

| Reconnaissance（偵察） | Credential Access（憑證訪問） |
| --- | --- |
| Resource Development（資源開發） | Discovery（發現） |
| Initial Access（初始訪問） | Lateral Movement（橫向移動） |
| Execution（執行） | Collection（收集） |
| Persistance（持久化） | Command and Control（C2, C&C, 指揮和控制） |
| Privilege Escalation（權限升級） | Exfiltration（滲透） |
| Defense Evastion（防禦規避） | Impact（影響） |

### 技術 Techniques

而技術則代表攻擊者如何通過執行行動來實現戰術目標、通過執行某項行動獲得了什麼，而子技術則是將技術如何使用行為來實現目標有更具體的描述

以下圖為例，T1548是Abuse Elevation Control Mechanism的技術，而.001、.002等等則是子技術的編號

![Technique-and-sub-technique](https://media.secologies.com/Technique-and-sub-technique.webp)
*[^2]*

### 程序 Procedures

最後程序是表示攻擊者用於技術或子技術的具體實現，其有兩個重要方面：

- 如何使用技術和子技術

- 可跨越多種技術和子技術

### 惡意組織

指已知、有組織的攻擊者群體，可能是犯罪集團、駭客組織、國家支持的駭客或其他實體，通常會進行針對性的攻擊活動，並可能使用一系列 TTPs 來達成其目的

### STIX 格式

在描述 TTPs 時，我們為了利於交換抽象化網路威脅情資 (Cyber Threat Intelligence, CTI) 的語言和序列化格式，描述攻防中防禦方感興趣的物件及之間可維持的連結，這通常由 Organization Advancement Structured Information Standards (OASIS) 協會的工作小組發布和維護

意思是我們可以將威脅情資轉換為入侵威脅指標，再透過STIX Visualizer關聯圖形化來檢視，協助分析人員更容易理解和解釋威脅情報，看起來就會像下圖的樣子，我們以 Domain-Fronting-With-TOR 關係圖作為示範

![Domain-Fronting-With-TOR-relationship](https://media.secologies.com/Domain-Fronting-With-TOR-relationship.webp)

有興趣的讀者可以在[https://oasis-open.github.io/cti-stix-visualization/](https://oasis-open.github.io/cti-stix-visualization/)製作

### 惡意軟體分類

攻擊者在入侵過程中通常會使用不同類型的軟體。這些軟體可代表一種技術或子技術的實例化，因此在 ATT&CK 中對其進行分類：

- 工具：商用、開源、內建或公開可用的軟體，可被任何人員使用。通常在企業系統中找不到的軟體，以及通常作為環境中已存在作業系統一部分的軟體，例如：Metasploit、Mimikatz；netstat、tasklist
- 惡意軟體：商業、未公開或開源軟體，供攻擊者用於惡意目的，例如：PlugX、CHOPSTICK、WannaCry

### Campaigns

一系列由特定威脅行為者或威脅群體進行有組織的、針對特定目標的攻擊活動。這些活動通常包含一連串的惡意行為，旨在達到攻擊者的特定目的，如：竊取敏感資料、破壞系統、或者長期滲透目標網路

### 資料來源

可以用來觀察、收集和分析攻擊行為的訊息來源，可由感測器/記錄收集的各種主題，提供了檢測、調查和響應惡意活動所需的原始資訊

### 資產

工業控制系統 (ICS) 環境中常見裝置和系統，資產物件包含技術關係的對應，代表可能針對裝置的攻擊者動作，取決於其能力和功能，裝置在不同產業中會有不同名稱或特定術語，為更準確追蹤上述差異，使用「相關資產」欄位

### 修補措施

發展 ATT&CK 最終的目標是可以減輕或預防攻擊技術影響的策略、措施與技術，旨在降低特定攻擊技術成功的機率，或限制攻擊者利用已知漏洞或弱點的能力，緩解措施與供應商產品無關，僅描述技術類別或類別，通常不描述具體解決方案

## MITRE ATT&CK 效用

最後讓我們做個總結，為什麼我們需要 MITRE ATT&CK 這個框架？

- 彙整威脅情資：網路威脅情資的核心是瞭解對手的所作所為，並利用這些資訊改進決策
- 檢測與分析：收集有關系統上發生事情的所有日誌和事件資料，並利用這些資料來識別 ATT&CK 中描述的可疑行為
- 評估與工程：可以瞭解當前的覆蓋範圍，並可利用威脅情報對缺口進行優先排序，然後通過撰寫分析報告來調整現有的防禦措施

[^1]: David J. Bianco, "The Pyramid of Pain," 2014-Jan-17, [https://detect-respond.blogspot.com/2013/03/the-pyramid-of-pain.html#:~:text=The%20Pyramid%20of%20Pain](https://detect-respond.blogspot.com/2013/03/the-pyramid-of-pain.html#:~:text=The%20Pyramid%20of%20Pain)

[^2]: The MITRE Corporation, "ATT&CK Matrix for Enterprise," MITRE ATT&CK, [https://attack.mitre.org/](https://attack.mitre.org/)

