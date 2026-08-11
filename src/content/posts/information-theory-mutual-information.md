---
title: "消息理論之相互消息"
date: 2023-08-01
description: Mutual Information 用來測量兩個random variables之間的關係，主要是有多少資訊量被傳輸過去。其中一個random variable會告訴我有多少資訊量從另一個random variable傳過來
hideTOC: false
targetKeyword: Mutal Information
draft: false
tags: 
  - "消息理論"
  - "相互消息"
lang: zh
---
mutual information用來測量兩個random variables之間的關係，主要是有多少資訊量被傳輸過去。

其中一個random variable會告訴我有多少資訊量從另一個random variable傳過來。

舉例來說，假設$X$表示6面公平的骰子骰出來的結果，而$Y$表示骰出來的是不是偶數(0表示偶數，1表示奇數)

很明顯$Y$告訴我們$X$值的一些資訊，就可以稱作這些variables在分享mutual information

另一方面來講，如果$X$骰了一次，而$Z$骰了另一顆的骰子一次，$X$跟$Z$之間是沒有共享mutual information的，因為$X$跟$Z$都是獨立骰一次，$Z$骰子結果並未包含$X$骰子的任何資訊。

在information theory裡面提到如果兩個variables之間的mutual information是0的話代表這兩個variables是統計上的獨立。

一般表示兩個random variables之間的mutual information都是用joint distribution來定義$P(X, Y)$如下:

$$ I(X;Y)=\sum_{x\in X}\sum_{y\in Y}P(x, y)log({P(x, y)}/{P(x)P(y)}) $$

上述定義中$P(X)$與$P(Y)$透過邊際化取得分別屬於$X$與$Y$的邊際分佈，找出$X$與$Y$的邊際再從中取得交際的部分就可以拿到$X$與$Y$之間的mutual information。

