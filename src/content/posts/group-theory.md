---
title: "群論"
date: 2024-04-24
description: 在數論當中群(Group)是其中一種重要的概念，代數最基本由三種結構組成：群 Group, 環 Ring, 體 Field，而群作為最基本的代數結構，也是我們在密碼系統中常常使用的，故需要先了解群的定義對於後續密碼系統分析會比較方便
hideTOC: false
targetKeyword: Group Theory
draft: false
tags: 
  - "乘法群"
  - "加法群"
  - "數論"
  - "群"
lang: zh
---
在數論當中群(Group)是其中一種重要的概念，代數最基本由三種結構組成：群 Group, 環 Ring, 體 Field，而群作為最基本的代數結構，也是我們在密碼系統中常常使用的，故需要先了解群的定義對於後續密碼系統分析會比較方便

## 定義

一個群由一個集合和運算元組成$G = (S, \odot)$，集合S以及運算元$\odot$(這個意思表示任何運算元皆可，而我們在密碼系統內最常表達的是加法+與乘法*)，而一個群需要滿足下列四個條件：

- (封閉性 Closure)：$For\>\> every\>\> x, y \in S, x \odot y \in S$ ，對於任何元素$x$和$y$屬於$S$這個集合裡面，做任何的運算後該元素也應該要屬於這個集合內。
- (關聯性 Associativity)：$For\>\> every\>\> x,y,z \in S,(x \odot y) \odot z = x \odot (y \odot z)$，對於任何元素$x$, $y$, $z$屬於這個集合$S$內，先運算$x$與$y$最後再與$z$運算，跟$y$與$z$做運算最後再跟$x$做運算的結果是一樣的
- (單位元素 Identity)：$Exist\>\> e \in S\ such\ that\ for\ every\ x \in S, x \odot e = e \odot x = x$，在集合$S$內存在一個單位元素$e$能夠讓集合內任何一個元素$x$與這個$e$做運算會得到$x$本身
- (反元素 Inverse)：$For\>\> every\>\> x \in S, exist\ y \in S, x \odot y = e$，對這個集合$S$的$x$元素存在一個$y$元素，而$x$元素與$y$元素進行運算能夠得到單位元素$e$

滿足以上四點的話該集合S就能構成一個群，而在多一項條件的話可以變成阿貝爾群(Abelian)：

- (交換性 Commutative)：$For\>\> every\>\> x, y \in S, x \odot y = y \odot x$，對於任意$x$, $y$元素在$S$集合內，$x$對$y$進行運算跟$y$跟$x$進行運算結果都一樣

## Additive Groups 加法群

滿足群的條件，如果整個群裡面運算元使用加法，代表這是一個加法群，其定義如下：

- 運算元 $\odot \to +$
- 單位元素 Identity：0
- 反元素 inverse: $\exists -x$ 對於$x \in S$
- multiple：$kx = x + x +….+ x$

### 範例

$(Z, +)$：Z是整數集合${-\infty…-2,-1,0,1,2,…,\infty}$，而$+$則代表在這個整數群內通通使用加法運算

$(Z_n, +)$：$Z_n={0,1,…,n-1}$，$Z_n$是0到n-1的整數群並且使用加法運算在$(mod\ n)$的條件之下，$(mod\ n)$才能把條件限制在$n-1$之下

- $\lVert Z_n \rVert = n$，$Z_n$這個整數群內的元素個數總共有$n$個，從 0 到 $n-1$
- $-x \to n-x$：$x - x = 0\ (mod\ n) \to -x = n - x$

$(Z_p[x],+)$：集合由多項式組成而係數在$Z_p$集合內

## Multiplicative Groups 乘法群

滿足群的條件，如果整個群裡面運算元使用乘法，代表這是一個乘法群，其定義如下：

- 運算元 $\odot \to *$
- 單位元素 Identity：1
- 反元素 Inverse：$x^{-1}$
- multiple：$x^{k} = x * x * ... * x$

### 範例

$(Q\backslash{0}, *)$：$Q$是有理數集合排除掉0，並且這個群使用乘法運算元

$(Z_n^{*}, *)：Z_n^{*}={x | x \in Z_n, x\perp n}$，$Z_n^{*}$代表這個整數群在$(mod \> n)$之下，並且整個群都是使用乘法運算元

- $\lVert Z_n^{*} \rVert = \varphi(n)$
- $x^{-1}$指的是$x^{-1} (mod\> n)$在$x \in Z_{n}^*$的條件下
