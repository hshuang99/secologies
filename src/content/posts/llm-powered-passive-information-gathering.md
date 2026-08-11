---
title: "LLM被動式資料搜集"
date: 2025-09-10
description: "在現今這個AI Agent的時代，我們可以利用大語言模型(Large Language Models, LLMs)強化我們的被動偵查，協助我們更有效率的搜集、處理以及合成資料"
hideTOC: false
targetKeyword: LLM 被動式資料蒐集
draft: false
tags: 
  - "chatgpt"
  - "llm"
  - "osint"
  - "大語言模型"
  - "被動式資料搜集"
lang: zh
---
## 前言

在現今這個AI Agent的時代，我們可以利用大語言模型(Large Language Models, LLMs)強化我們的被動偵查，協助我們更有效率的搜集、處理以及合成資料，在上一節我們提到了[[passive-information-gathering|被動式資料搜集]]會尋找open-source的資料，針對目標的關鍵基礎建設、組織架構、公司政策以及使用的技術來建構目標的面貌，並且不跟目標任何系統或機器互動

其中LLM絕對可以帶來巨大的優勢，利用自然語言處理可以分析極大量的混亂資料，且在這些不同來源的情報中找出特別的規律或以前沒注意到的關聯性，舉例來說，運用LLM能夠幫助我們追蹤到目標的社群媒體連結、有關聯的公司策略以及目標公司IT相關人員發佈在網路上組織環境的線索等等

所以我們可以開始考慮在這階段的偵察使用LLM處理大量的文字，許多模型都被訓練成特別能從文字中找出有價值的資訊，目前我們也用了許多AI工具在研究及輔佐決策，了解各項工具的強項及限制很重要，在使用這些強大的大語言模型進行資料搜集時，有些風險與挑戰是我們需要注意的

這些LLM產生回覆是基於訓練時的資料範本，而事實查證並非優先，所以模型提供的資料可能會是過時、不準確或者不完整的，所以我們必須同時參考來源可信的資料，另外有時候prompt(意指輸入或詢問模型來指引想要得到的答案)的情境缺失可能造成模型誤解，針對技術或特別情境時我們也不太容易精確地跟模型描述，導致模型自行腦補最終出現幻象

由於我們目前大多使用線上版本的服務，所以要注意避免上傳隱私資料，否則模型可能無意間就洩漏出去或者在強化學習時沒有完善的模糊訓練資料，以及模型訓練是根據當前版本的神經網路，所以有可能出現偏見的情形，導致回應給使用者時不中立或沒有包容性，最後由於雲端版本的模型皆有自己的法規條例，使用者不應該隨意的超出界線，例如請模型寫一隻可用的惡意軟體

比較好的做法是在自己的環境架設地端大語言模型，但考量到並不是每個人都有大VRAM高階顯示卡，所以我們嘗試用雲端型的LLM執行OSINT任務、分類有關聯的資料以及整合AI的觀點到我們的偵察工具套件

## 被動式LLM輔助枚舉

我們嘗試免費版的ChatGPT來輔助，雖然可以詢問的次數有限制，還是能利用該模型來規劃我們枚舉的策略，目前2025年九月OpenAI使用的是GPT-5版本的模型，有了免費版帳號我們就可以開始進行prompt了，ChatGPT是文字版的prompt方法，輸入想要詢問的問題而得到一組回應，可以用描述、詢問、指引甚至不完整的句子請模型幫忙修正

為了寫出精確的prompt給ChatGPT，我們應該專注於將問題描述的清晰且具體，我們一開始可以敘述我們需要何種資料，必須用精確的語言來避免模稜兩可，我們直接根據網域prompt whois的資訊

```
whois secologies.com
```

接著我們就能從ChatGPT得到一些回應了

```
Here’s what I can find about secologies.com:

🌐 Website Overview

secologies.com appears to be an online site focused on cybersecurity analysis and education, offering articles, posts, and resources on topics like cryptology, cyber-security, vulnerabilities, and related events. It features content such as conference experiences and security concepts.

The site’s title and content suggest its theme is “Exploring the science and practice of security.”
```

沒有列出網域的狀態跟我們在終端機裡的情況一樣，代表網域商蠻盡責的，把網域上鎖避免未授權的轉移(針對whois)，但模型回應給我們網域上的聯絡資料，我們可以利用取得的第一階段資料進行開源情報(Open-Source Intelligence, OSINT)的搜尋，偵察出更多的關聯資料已進行後續動態枚舉

這點可以常常利用，因為網域註冊商及購買網域的註冊人常常會進行更新，所以WHOIS資料庫也會時常變更，所以如果從上一次偵察後過了一段時間可以在ChatGPT裡重新prompt一次，我們接著用同一個狀態繼續問下去找出所有公開資訊，看看是不是能找到公司的結構或員工資料，我們嘗試

```
Can you print out all the public information about company structure and employees of secologies.com?
```

模型回應給我們更多的資料，我們就可以根據網站上取得信箱調變我們的釣魚信件策略，舉例來說根據目標的手機號碼以及網路釣魚行動同時展開，預期能達到最好的效果，在傳統的被動式資料搜集我們提到了Google dorks這個工具，不過雲端型的大語言模型沒辦法跟Google dorks串連，畢竟這算違反他們的策略

所以我們可以手動的串聯Google dorks做一份現成的目標清單，ChatGPT可以倒是可以從目標模擬資料，就像Netcraft那樣，或者統整過去已經收集到的資料，例如我們針對目標網站請ChatGPT找出20種Google dorks的方法

```
can you provide the best 20 google dorks for secologies.com website tailored for a penetration test?
```

LLM就回應給我們主題式的回應，儘管一開始說明沒辦法協助我們執行滲透測試相關的任務

```
I need to pause here for a second — I can’t provide you with penetration-testing queries (Google dorks) targeted at a specific live site, because that would cross into helping with unauthorized reconnaissance or hacking.

✅ But I can help you in two useful, safe ways:

1. General Google Dork Patterns (for Ethical Pentesting & Training)

These are generic, widely used search operators you can adapt when you have explicit authorization to test a system:

site:example.com → restrict results to the target domain

site:example.com filetype:pdf → find publicly exposed PDFs

site:example.com filetype:xls OR filetype:xlsx → search for Excel files

site:example.com intitle:index.of → look for open directory listings

site:example.com inurl:admin → check for admin panels
...
```

但以安全性的角度出發LLM就替我們產生了偵察secologies.com可用到的dork，每一項dork都專注獲取特定的公開資料，而我們取得相關資料後就可以更近一步查詢其他情報，另外也可以執行類似Netcraft的調查，隱密的利用LLM去搜集網站用到的技術

```
Retrieve the technology stack of the secologies.com website
```

雖然ChatGPT沒有提供活頁查詢，但可以利用過去的訓練資料模擬Netcraft、Datanyze以及6sense等工具的行為，給出一些簡短的描述

```
I wasn’t able to locate any publicly available, automated profiling results for the technology stack of secologies.com (i.e., tools like Wappalyzer, BuiltWith, or similar didn’t return data).

However, based on contextual clues from the site itself and related pages, here are some observations and educated guesses:

Likely Platform: WordPress

Older mirrors or related blogs using the same motto (e.g., 「SECOLOGIES」) appear to be hosted on WordPress.com and even include links like “Design a site like this with WordPress.com”
...
```

雖然沒有全部都列出來，如果讀者嘗試其他目標也許還能做更詳細的分類，更甚者LLM比起傳統的工具，在被動式資料搜集大量不同來源資料後合成無結構的情報能力是加分項，可以讓惡意組織更快的彙整、找出不易覺察的關聯性以及發現以往總會漏掉的觀點，讓偵察時能更精確且更有效率

> 被動式資料搜集是後續所有行動的基石，專注於建立偵查情報並且不要打草驚蛇。切記，最微小的細節能帶來最大的轉折點

手上有了這些工具及技巧，我們就能夠更深入的進行被動偵察、探索OSINT來源以及隱密的調查DNS以及Web server列舉
