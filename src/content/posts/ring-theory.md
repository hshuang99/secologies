---
title: "環論"
date: 2024-10-30
description: 一個環 (Ring) 必須是存在一組非空集合R，擁有兩組binary運算
hideTOC: false
targetKeyword: Ring
draft: false
tags: 
  - "環論"
lang: zh
---
## 定義

一個環 (Ring) 必須是存在一組非空集合$R$，擁有兩組binary運算

- $R \times R \rightarrow R, (a, b) \mapsto a+b$ (加法運算)以及
- $R \times R \rightarrow R, (a, b) \mapsto a \cdot b$ (乘法運算)

使得一些條件像是

(i) $(R, +)$屬於abelian $(a + b = b + a)$，存在0 = 0$_{R}$作為加法單位元素 $(0 + a = a + 0 = a)$.

(ii) $a \cdot (b \cdot c) = (a \cdot b) \cdot c$，乘法運算存在相依性

(iii) $a \cdot (b + c) = a \cdot b + a \cdot c, (a+b) \cdot c = a \cdot c + b \cdot c$，同時存在分配律

其中一個條件是我們稱$R$為$\color{red}{unital}$代表這個環擁有乘法單位元素 1 = 1$_{R} \in R$，意思即是1$\cdot a = a \cdot$1 $= a$

而如果R存在可交換性 (commutative) 的話則滿足$a \cdot b = b \cdot a, \>\> \forall a, b \in R$

## 範例

(0) 任何體 (field) 皆屬於環，同時也屬於$\mathbb{Z}$

(1) 當$R = \mathbb{Z}/n\mathbb{Z}$整數群消掉$n$倍的整數群時，加法運算當中$(a+n\mathbb{Z}) + (b + n\mathbb{Z}) := a+b + n\mathbb{Z}$，而同時在乘法中$(a+n\mathbb{Z}) \cdot (b + n\mathbb{Z}) := ab + n\mathbb{Z}.$

0$_{R} = n\mathbb{Z}, 1+{R} = 1 + n\mathbb{Z}$，所以我們可以稱$\mathbb{Z}/n$, $\mathbb{Z}$是一個 unital commutative ring.

(2)在多項式 (polynomial) 環裡我們設$R$為任意的環，$R[x_{1}, \cdots, x_{n}]=$在$R$之中多項式環存在$n$組變數，這組$R$的組成是${\sum_{i_{1},\cdots,i_{n} \geq 0}a_{i_{1}},\cdots, a_{i_{r}} \cdot x_{1}^{i_{1}}, \cdots, x_{n}^{i_{n}}, \>\>finite \>\> sum, \>\> a_{i_{1}}, \cdots a_{i_{r}} \in R}$

由$a_{i_{1}}$到$a_{i_{r}}$的係數與$x_{1}$到$x_{n}$的項次有限集合的組合

針對$I = (i_{1}, \cdots, i_{n}) \in \mathbb{Z}_{\geq 0}^{n}$，variable的$X$可以視為$X^{I} := x_{1}^{i_{1}} \cdots x_{n}^{i_{n}}$此存在單項式特性 (monomial)

$X^{I} \cdot X^{J} := X^{I+J}$就能夠表示$(x_{1}^{i_{1}} \cdots x_{n}^{i_{n}}) \cdots (x_{1}^{j_{1}} \cdots x_{n}^{j_{n}}) := x_{1}^{i_{1} + j_{1}} \cdots x_{n}^{i_{n} + j_{n}} \Rightarrow x_{i} \cdot x_{j} = x_{j} \cdot x_{i}.$

任何$f \in R[x_{1}, \cdots, c_{n}]$可以滿足於$ f = \sum_{I} a_{I} \cdot x^{I}, \>\> finite \>\> sum, \>\> a_{I} \in R $

$a_{I}$意思是$f$中第$I$個係數

$$(\sum_{I} a_{I} \cdot x^{I}) \cdot (\sum_{J}b_{J} \cdot x^{J}) := \sum_{I, J}a_{I} \cdot b_{J} \cdot x^{I+J}$$

這樣就可以讓$a_{I} \cdot b_{J}$在環上作乘法運算

$$(\sum_{I} a_{I} \cdot x^{I}) + (\sum_{J}b_{J} \cdot x^{J}) := \sum_{I}(a_{I} + b_{I}) \cdot x^{I} $$

而這項即是滿足$a_{I}+b_{I}$在環上的加法運算

- $R$存在可交換性 $\Longleftrightarrow R[x_{1}, \cdots x_{n}]$存在可交換性

- R屬於unital $\Longleftrightarrow R[x_{1},\cdots, x_{n}]$屬於unital

