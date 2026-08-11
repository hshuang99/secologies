---
title: "群之可解性"
date: 2024-09-15
description: 首先讓我們定義 G 為一個群，我們說 G 是 solvable/soluble (可解)的話代表存在 filtration
hideTOC: false
targetKeyword: Solvable Groups
draft: false
tags: 
  - "可解"
  - "群理論"
lang: zh
---
## Definition 2.7

首先讓我們定義$G$為一個群，我們說$G$是solvable/soluble(可解)的話代表存在filtration $G = G_{0} \rhd G_{1} \rhd \cdots \rhd G_{n} = \{e\}$使得說$G_{i}/G_{i+1}$是abelian的

> 照這個定義來看如果是要解多項式$f \in Q[x]$的話就需要滿足求根式解

## Proposition 2.8

如果$G$是 solvable 的話，則$G$的subgroups以及商數皆為solvable

### 證明

讓$G = G_{0} \rhd G_{1} \rhd \cdots \rhd G_{n} = \{e\}$使得$G_{i}/G_{i+1}$屬於abelian

讓$H < G$屬於subgroup

$$\Rightarrow H = H \cap G_{0} \rhd H \cap G_{1} \rhd \cdots H \cap G_{n} = {e}$$

$$(H \cap G_{i})/(H \cap G_{i+1}) \hookrightarrow G_{i}/G_{i+1} \Rightarrow (H \cap G_{i})/(H \cap G_{i+1}) \>\> is \>\> abelian.$$

$$\Rightarrow H \>\> is \>\> solvable$$

假設$H \lhd G$，則$G_{i}H < G$以及$G_{i+1}H \lhd G_{i}H.$

$$G_{i}/G_{i+1} \twoheadrightarrow (G_{i}H)/(G_{i+1}H)$$

$$\Rightarrow (G_{i}H)/(G_{i+1}H) \cong (G_{i}H/H)/(G_{i+1}H/H) \>\> is \>\> abelian.$$

$$\Rightarrow G/H \>\> is \>\> solvable.$$

### 範例

(1) $D_{n} = <x, y| x^{n} = y^{2} = e, yxy^{-1} = x^{-1}>$屬於solvable.

證明：$D_{n} \rhd <x> \rhd \{e\}, D_{n}/<x> \cong \mathbb{Z}/2\mathbb{Z}, <x> \cong \mathbb{Z}/n\mathbb{Z}$

(2) $S_{3} \cong D_{3}$屬於solvable

(3) $S_{4}$屬於solvable

(4) 如果$n \geq 5$則$S_{n}$不屬於solvable，($\xrightarrow[\text{Galois}]{\Longrightarrow} f \in Q[x], deg(f) \geq 5$,一般來說無法在求根式解解出)

證明：假設我們有一個filtration $S_{n} = G_{0} \rhd G_{1} \rhd \cdots \rhd G_{n} = {e}$使得$G_{i}/G_{i+1}$是abelian的，$G_{i}$本身應該會包含在$S_{n}$上所有$i$的所有3-cycles組合，但在$n \geq 5$的時候會矛盾

(5) $B_{n}(F) \subset GL_{n}(F)$，意指 Borel subgroup 是 solvable 的，$B_{n}(F)$ 例如像是
$$
\begin{pmatrix}
* & \cdots & * \\
0 & * & * \\
0 & 0 & *
\end{pmatrix} \in GL_{n}(F)
$$
：一組upper triangular matrices

證明：$n = 3: B_{3} \supset U_{3} \supset \mathcal{Z}(U_{3}) = \{\begin{pmatrix}1 & 0 & x\\ & 1 & 0 \\ & & 1\end{pmatrix} | x \in F\} \supset \{1\}$，其中$U_{3} := \{\begin{pmatrix}1 & x & y\\ & 1 & z \\ & & 1\end{pmatrix}|x, y, z \in F\}$，而$\{\begin{pmatrix}1 & 0 & x\\ & 1 & 0 \\ & & 1\end{pmatrix} | x \in F\} \supset \{1\} \cong F$

$U_{3} \rightarrow F \times F, \begin{pmatrix}1 & x & y\\ & 1 & z \\ & & 1\end{pmatrix} \mapsto (x, z)$ with kernel $\mathcal{Z}(U_{3})$

$B_{3} \rightarrow \{\begin{pmatrix}a_{1} & & \\ & a_{2} & \\ & & a_{3}\end{pmatrix}|a_{1}, a_{2}, a_{3} \in F^{x}\}, \begin{pmatrix}a_{1} & * & * \\ 0 & a_{2} & * \\ 0 & 0 & a_{3}\end{pmatrix} \mapsto \begin{pmatrix}a_{1} & & \\ & a_{2} & \\ & & a_{3}\end{pmatrix}$，其中$a_{1}, a_{2}, a_{3} \cong F^{x} \times F^{x} \times F^{x}$與kernel

$$U_{3} \Rightarrow B_{3}/U_{3} \cong F^{x} \times F^{x} \times F^{x}$$

$$\Rightarrow B_{3} \>\> is \>\> solvable.$$

