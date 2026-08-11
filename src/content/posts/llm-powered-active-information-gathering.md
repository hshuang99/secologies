---
title: "LLM主動式資料搜集"
date: 2025-09-20
description: "在LLM被動式資料搜集一章我們提到現今的LLM可以如何的幫助我們，同樣的角度我們也可以來看LLM如何在主動式枚舉上幫助我們發現目標機器裡沒注意到的線索，例如DNS枚舉找出DNS server裡子網域、信件server以及name server等資訊，配上LLM，我們可以讓這項功能更強大"
hideTOC: false
targetKeyword: LLM 主動式資料蒐集
draft: false
tags: 
  - "chatgpt"
  - "dns枚舉"
  - "gobuster"
  - "主動式資料搜集"
  - "大語言模型"
lang: zh
---
## 前言

在[[llm-powered-passive-information-gathering|LLM被動式資料搜集]]一章我們提到現今的LLM可以如何的幫助我們，同樣的角度我們也可以來看LLM如何在主動式枚舉上幫助我們發現目標機器裡沒注意到的線索，例如DNS枚舉找出DNS server裡子網域、信件server以及name server等資訊，配上LLM，我們可以讓這項功能更強大

LLM可以分析結果、識別名稱的模式以及將數個資料作相依性的連結，就能夠找出錯誤設定或隱藏資產的足跡，舉例來說，精簡的分析出DNS zone轉移區塊(Zone Transfer，該區塊複製server之間的DNS資料，但如果錯誤設置的話有可能會把內部資料洩漏出去)、逆向查詢以及WHOIS資料，比起手動方法還能更快的合成出可用的情報

在LLM靜態時我們提到這種方法有強項也有限制，雖然可以把複雜的資訊整合起來以及點出可能漏掉的資訊，但也要小心驗證所有得到的資訊，在使用AI進行偵查行為時要銘記在心

## 主動式LLM枚舉

在[[active-information-gathering-dns-enumeration-and-port-scanning|主動式資料搜集之DNS枚舉與Port掃描]]我們講述了DNS枚舉建立穩定的字詞表來進行搜索，在LLM裡也可以建立一組字詞表來協助偵查，一個夠強的(涵蓋範圍廣泛)的字詞表可以找出潛在的子網域、服務以及目標網域底下的目錄，傳統上我們需要手動自己一個一個新增，但靠LLM可以精簡這個步驟，幫助我們提升輸出結果

我們一樣用本站secologies.com做示範，請求ChatGPT搜集網站所有的公開資料，並且過濾輸出間製成一個內含可能是子網域的字詞表

```
Using public data from secologies.com website and any information that can be inferred about its organizational structure, products, or services, generate a comprehensive list of potential subdomain names.
	•	Incorporate common patterns used for subdomains, such as:
	•	Infrastructure-related terms (e.g., "api", "dev", "test", "staging").
	•	Service-specific terms (e.g., "mail", "auth", "cdn", "status").
	•	Departmental or functional terms (e.g., "hr", "sales", "support").
	•	Regional or country-specific terms (e.g., "us", "eu", "asia").
	•	Factor in industry norms and frequently used terms relevant to MegacorpOne's sector.

Finally, compile the generated terms into a structured wordlist of 1000  words, optimized for subdomain brute-forcing against megacorpone.com

Ensure the output is in a clean, lowercase format with no duplicates, no bulletpoints and ready to be copied and pasted.
Make sure the list contains 1000 unique entries.
```

我們請ChatGPT幫我們生一組有結構性格式的資料，雖然會說一些冗長的話，但重點是整理出來的字詞表

```
I have generated a structured 1000-word subdomain wordlist optimized for brute-forcing against megacorpone.com. You can download the file for use directly:

Download Subdomain Wordlist
```

在這情境下LLM生出來的字詞表就可以下載，儲存成wordlist.txt檔案供後續偵察時使用，同樣要注意的是由於是LLM幫我們找來的資料，如果資料不足的情況下，有可能會自己模仿舊有的資料並且造出不存在的新資料出來，所以要時刻注意產出來的東西是不是我們需要的

為了加快DNS枚舉速度，我們可以安裝一個叫做"gobuster"的工具，這個開源指令工具用來有效率的吃不同來源的資料進行暴力破解跟枚舉操作，要安裝的話用apt套件就有了

```
sudo apt update
sudo apt install gobuster
```

用gobuster的參數"-d"指定目標的dns進行枚舉，而"-w"指定字詞表來執行DNS暴力破解操作來針對目標機器，dns選項則是使用Gobuster的DNS模組，在用"-w"則可以選擇字詞表，"-t"則可以指定一個參數決定要一次跑幾個threads，我們測試用10條threads讓整個枚舉更有效率

```
kali@kali:~$ gobuster dns -d secologies.com -w wordlist.txt -t 10
===============================================================
Gobuster v3.6
by OJ Reeves (@TheColonial) & Christian Mehlmauer (@firefart)
===============================================================
[+] Domain:     secologies.com
[+] Threads:    10
[+] Timeout:    1s
[+] Wordlist:   wordlist
===============================================================
Starting gobuster in DNS enumeration mode
===============================================================
[INFO] [-] Unable to validate base domain: secologies.com (lookup secologies.com on 8.8.8.8:53: no such host)
...
```

如果枚舉是成功的話，Gobuster就會發現所有我們從LLM生出來的有效子網域，隨著AI技術越來越強，我們也見識到LLM是如何改變了這個世界，而在滲透測試的領域中，LLM也對於主動式以及被動式資料搜集有了貢獻，只要更精熟相關的操作就能提升我們在偵察時的效率，甚至找出傳統工具可能遺漏掉的線索

在主動式枚舉中例如DNS暴力破解方法中LLM可以客製字詞表，根據目標組織的架構能夠特別製作同樣結構或命名模板的內容，如此能夠提升找到潛在子網域的可能性，相比傳統方法我們必須花上大量的時間來進行整理，LLM的強項就是把資料整理的有模有樣，未來的偵察型態也許可以都嘗試配合LLM

但要注意的是沒有"最好"的工具可以適用於所有情況，Kali Linux裡存在如此多的工具就是這種情形，我們永遠只能根據當下的狀況選出最有可能找出線索的工具，所以了解各項工具的各項差異，何時有用並且使用過後的結果是非常重要的，能找出"最佳"的工具只有在滲透測試時了解所有情境下做出判斷
