---
title: "Square and Multiply 演算法"
date: 2023-06-03
description: 此演算法主要是針對 $a^{b} \>\> mod \>\> n$ 在b很大而計算機通常算不太出來的時候使用的方法
hideTOC: false
targetKeyword: Square and Multiply Algorithm
draft: false
tags: 
  - "平方乘"
  - "數論"
  - "模運算"
  - "演算法"
lang: zh
---

此演算法主要是針對$a^{b} \>\> mod \>\> n$在$b$很大而計算機通常算不太出來的時候使用的方法，一開始$z$設為1，並且把指數部分拆成二進位，從左至右運算，遇到$b=1$時計算$z$的平方乘上底數再$mod \>\> n$，而$b=0$時計算$z$的平方再$mod \>\> n$即可。

舉例：$a^{b} \>\> mod\>\> n = (325)^{20} \>\> mod \>\> 963 = (325)^{10100_{b}} \>\> mod \>\> 963$

| b's bits | operation | z |
| --- | --- | --- |
|   |   | 1 |
| 1 | $z^{2} \cdot a \>\> mod \>\> n$ | 325 |
| 0 | $z^{2} \>\> mod \>\> n$ | 658 |
| 1 | $z^{2} \cdot a \>\> mod \>\> n$ | 703 |
| 0 | $z^{2} \>\> mod \>\> n$ | 190 |
| 0 | $z^{2} \>\> mod \>\> n$ | 469 |

$n = (325)^{20} \>\> mod \>\> 963 = 469 \>\> (mod \>\> 963$

執行時間大概是 1.5$\cdot len(b)$模運算

