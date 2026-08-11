---
title: "尤拉函數"
date: 2023-06-02
description: 最大公因數 gcd(a, b)，可以利用gcd判斷兩個整數是不是互質, gcd(a, b) = 1，若兩數互質代表兩數的最大公因數就是1
hideTOC: false
targetKeyword: Euler Totient Function
draft: false
tags: 
  - "尤拉函數"
  - "數論"
lang: zh
---
最大公因數: $gcd(a, b)$，可以利用gcd判斷兩個整數是不是互質: $ a \perp b: gcd(a, b) = 1$，若兩數互質代表兩數的最大公因數就是1。

一個合成數$n$可以拆成質數分解: $n = p_{1}^{e_{1}-1}p_{}2^{e_{2}-1}\cdots p_{k}^{e_{k}}$，每個$p$都只會出現一次。

有了前面幾種工具，就可以建構出尤拉函數:

$\varphi(n) = | {x | x \perp n, 1 \leq x \leq n-1 } | = p_{1}^{e_{1}-1}p_{}2^{e_{2}-1}\cdots p_{k}^{e_{k}-1}(p_{1}-1)(p_{2}-1) \cdots (p_{k}-1)$

尤拉函數能夠幫助我們快速找出在$n$之下所有與$n$互質的整數個數

