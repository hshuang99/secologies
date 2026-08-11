---
title: "完美保密性"
date: 2025-01-26
description: 在1978年Ralph C. Merkle提出了一篇"Secure communications over insecure channels"想法之後，人們開始意識到在網路上傳輸資料時其實存在著攻擊者(adversary)在監聽我們的溝通，從而開始發展要混淆傳輸的資料使得在不安全的環境中也可以安心傳輸
hideTOC: false
targetKeyword: Perfect Secrecy
draft: false
tags: 
  - "perfect-secrecy"
  - "完美隱密"
  - "密文空間"
  - "明文空間"
  - "機率分布"
translations: [perfect-secrecy-en]
lang: zh
---
在1978年Ralph C. Merkle提出了一篇"[Secure communications over insecure channels](https://dl.acm.org/doi/10.1145/359460.359473)"想法之後，人們開始意識到在網路上傳輸資料時其實存在著攻擊者(adversary)在監聽我們的溝通，從而開始發展要混淆傳輸的資料使得在不安全的環境中也可以安心傳輸

## 傳輸情境

所以在傳統的傳輸通道上會存在至少三個角色在裡面，一個是想要傳輸資料的傳輸者(sender)，想要把資料傳給接收者(receiver)，而傳輸者會使用跟接收者共同協商出來的一把共享金鑰(shared key)來進行加解密，這邊先不管他們要如何協商這把金鑰，但他們會協商好共同使用哪把金鑰以及搭配的加解密演算法

傳輸者把想要傳的資料明文message $m$運算成密文ciphertext $c$，透過一條通道傳輸給接收者，這條通道預設是不安全的，旁邊會存在一個adversary監聽著通道，攻擊者可以攔截密文並且複製一份到自己的設備上，但因為沒有金鑰所以只能擁有密文，而接收者因為擁有共享金鑰所以可以把密文解回成明文

![Communication.drawio](https://media.secologies.com/Communication.drawio.webp)

## 直覺想法

而Merkle博士其實提供了一些直覺上的想法給我們，如果可以設計一組機制$\Pi$來讓密文達到完美保密(Perfect Secrecy)的話，不管攻擊者有多少計算資源，觀察到密文$c$之後對於之前接收到的明文資訊沒有任何效果，意思是取得密文$c$對於解開特定的明文$m$毫無幫助，密文$c$不會洩漏任何關於明文$m$的消息

## 定義

一組加密機制$\Pi = (Gen, Enc, Dec)$使用了完美保密的明文空間$M$，代表明文空間$M$的機率分布、任何明文選字明文空間的分佈$m \in M$、任何密文選自密文空間$c \in C$存在分佈$Pr[C = c] > 0$會使得

$$ Pr[M = m | C = c] = Pr[M = m] $$

意思是明文空間以及密文空間兩者獨立，皆不會洩漏各自的消息，所以反過來想如果$Pr[M = m | C = c] > Pr[M = m]$的話代表搜集密文空間裡的分佈對於猜測明文空間裡的選擇有幫助，因為在研究上我們假設攻擊者可以先行取得明文空間的分佈機率，如果取得密文空間的分佈沒辦法提升猜中的機率，就代表攻擊者取得密文空間沒有得到任何優勢

$$ Pr[M = m | C = c] \equiv Pr[M = m] $$

所以如果攻擊者取得了許多密文但機率還是等價於只擁有明文空間分佈機率的話代表兩者空間獨立，我們稱這叫做完美保密(Perfect Secrecy)

