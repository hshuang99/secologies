---
title: "中國餘式定理與同構特性"
date: 2023-06-03
description: 中國餘式定理Chinese Remainder Theorem(CRT)在密碼理論當中屬於重要的概念，尤其在RSA密碼系統裡也扮演重要的角色，而符合CRT的聯立方程式具有同構的特性
hideTOC: false
targetKeyword: 中國餘式定理
draft: false
tags: 
  - "中國餘式定理"
  - "同構"
  - "數論"
lang: zh
---
## 簡介

中國餘式定理Chinese Remainder Theorem(CRT)在密碼理論當中屬於重要的概念，尤其在RSA密碼系統裡也扮演重要的角色

## 中國餘式定理

CRT主要想解決的問題是找到共同的數針對不同的模運算式，這種在像是RSA密碼系統計算合成數$n$取決於$p$及$q$兩個質數很有幫助

對於 $n_{1}, n_{2}, \cdots, n_{m}$ 以及 $r_{1}, r_{2},\cdots, r_{m}$，$n_{i} \perp n_{j}, i \neq j$，能夠組成各自的聯立方程式:

$x \equiv r_{k} \>\> (mod , n_{k}), 1 \leq k \leq m$

透過上述的每一個聯立方程式可以找出$x$:

$x = r_{1}N_{1}(N_{1}^{-1} \>\> mod \>\> n_{1}) + \cdots + r_{m}N_{m}(N_{m}^{-1} \>\> mod \>\> n_{m}) \>\> mod \>\> N$

其中$N = n_{1}n_{2} \cdots n_{m}$以及$N_{i} = N/n_{i}$

舉例:

$n_{1} = 3, n_{2} = 4, n_{3} = 7, r_{1} = 1, r_{2} = 3, r_{3} = 1$可以組成下列的聯立方程式:

$\begin{cases}  
x \equiv 1 \>\> (mod \>\> 3)\\  
x \equiv 4 \>\> (mod \>\> 4)\\  
x \equiv 1 \>\> (mod \>\> 7)  
\end{cases}$

並且$N = n_{1}n_{2}n_{3} = 3*4*7 = 84, N_{1} = N/n_{1} = 84/3 = 28, N_{2} = N/n_{2} = 84/4 = 21, N_{3} = N/n_{3} = 84/7 = 12$

接著找各個$N_{i}$的反元素，

$N_{1}^{-1} = 28^{-1} \>\> mod \>\> 3 \equiv 1 \>\> mod \>\> 3\\ N_{2}^{-1} = 21^{-1} \>\> mod \>\> 4 \equiv 1 \>\> mod \>\> 4\\N_{3}^{-1} = 12^{-1} \>\> mod \>\> 7 \equiv 3 \>\> mod \>\> 7 $

這樣就能可以找到$x$:

$x = (1 \times 28 \times 1 + 3 \times 21 \times 1 + 1 \times 12 \times 3) \>\> mod \>\> 84 \equiv 43 \>\> (mod \>\> 84)$

## 同構 Isomorphism

符合CRT的聯立方程式具有同構的特性，假設 $Z_{n} = \{0, 1, 2,\cdots, n-1\}$ 以及 $n_{1},n_{2},\cdots, n_{m}$，$n_{i} \perp n_{j}, i \neq j$

$Isomorphism: Z_{n} \to Z_{n_{1}} \times Z_{n_{2}} \times \cdots \times Z_{n_{m}}: \\ \psi(x) \to (x \>\> mod \>\> n_{1}, x \>\> mod \>\> n_{2}, \cdots, x \>\> mod \>\> n_{m}) $

使用CRT找到 $x$ 透過 $\psi^{-1}(x_{1},x_{2},\cdots, x_{m})$

舉例：

$n = pq = 3 \times 5 = 15$，可以看成$Z_{15} = Z_{3} \times Z_{5}$

可以看成$\begin{aligned}\text{0} \to (0, 0)\\ \text{2} \to (2, 2) \\ \text{7} \to (1 ,2)\\ \text{10} \to (1, 0)\end{aligned}$等等

$(7 + 10) \>\> mod \>\> 15 = 2$ 可以看成 $(1, 2) + (1, 0) = (2, 2) \to 2$

或者$(7 \times 10) \>\> mod \>\> 15 = 10$可以看成$(1, 2) \times (1, 0) = (1, 0) \to 10$

前面提到主要對RSA有用就是因為有同構的特性:

計算$x = a^{b} \>\> mod \>\> pq$，$pq$可以想成$n$，代表$n$的群來自$Z_{n} \to Z_{p} \times Z_{q}$，以及$k = len(pq)$的長度

$a^{b} \>\> mod \>\> n \\ \to (a^{b} \>\> mod \>\> n \>\> mod \>\> p, a^{b} \>\> mod \>\> n \>\> mod , q)\\ = (a^{b} \>\> mod \>\> p, a^{b} \>\> mod \>\> q) \\ = ((a \>\> mod \>\> p)^{b \>\> mod \>\> p-1} \>\> mod \>\> p, (a \>\> mod \>\> q)^{b \>\> mod \>\> q-1} \>\> mod \>\> q)\\ = (x_{1}, x_{2})$

所以$a^{b} \>\> mod \>\> n = \psi^{-1} (x_{1}, x_{2})$，計算 $a^{b} \>\> mod \>\> n$ 需要 $O(k^{3})$ 的時間
