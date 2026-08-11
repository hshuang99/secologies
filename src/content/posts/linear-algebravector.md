---
title: "線性向量"
date: 2024-02-01
description: 在整個線性代數中，最基本的單位就是一個向量，假設一個擁有兩個值的向量像是
hideTOC: false
targetKeyword: 線性向量
draft: false
tags: 
  - "乘法計算"
  - "加法計算"
  - "向量"
  - "矩陣"
  - "線性代數"
lang: zh
---

在整個線性代數中，最基本的單位就是一個向量，假設一個擁有兩個值的向量像是

$$V = \begin{bmatrix}v_{1} \\ v_{2} \end{bmatrix}$$

## 向量加法

假設另一組向量$w$一樣包含於兩個值$w = \begin{bmatrix} w_{1} \\ w_{2} \end{bmatrix}$

可以進行向量的加法像是

$$v + w = \begin{bmatrix} v_{1} \\ v_{2} \end{bmatrix} + \begin{bmatrix} w_{1} \\ w_{2} \end{bmatrix} = \begin{bmatrix} v_{1} + w_{1} \\ v_{2} + w_{2} \end{bmatrix}$$

## 向量乘法

同樣的可以將向量乘上一組實數

$$\text{2} v = \text{2} \begin{bmatrix} v_{1} \\ v_{2} \end{bmatrix} = \begin{bmatrix} \text{2}v_{1} \\ 2v_{2} \end{bmatrix}$$

$$c\begin{bmatrix}v_{1} \\ v_{2}\end{bmatrix} = \begin{bmatrix} cv_{1} \\ cv_{2} \end{bmatrix}, where \> c \> \in \mathbb{Z}$$

在實數的運算下加法跟乘法一樣可以同時計算

$$cv + dw = \begin{bmatrix} cv_{1}+dw_{1} \\ cv_{2}+dw_{2}\end{bmatrix}$$

這被稱作$v$跟$w$的線性組合，其中$c$跟$d$是實數，而不斷擴充下去可以到$n$個維度的線性組合

## 線性方程式

傳統上可以看到聯立方程式如下

$$\begin{cases} x-2y = 1 \\ 3x+2y = 11\end{cases}$$

可以使用矩陣的形式來表示一組聯立方程式像是

$$\begin{bmatrix}1 & -2 \\ 3 & 2 \end{bmatrix}\begin{bmatrix}x \\ y\end{bmatrix} = \begin{bmatrix}1 \\ 11\end{bmatrix}$$

可以將其視為一組2 $\times$ 2的矩陣，另外通常會表示成

$$Ax = b$$

$A$是一組矩陣，目前是用row的角度在觀察這一組線性方程式，如果換成column的角度觀察的話可以表示成：

$$x \begin{bmatrix}1 \\ 3 \end{bmatrix} + y\begin{bmatrix} -2 \\ 2\end{bmatrix} = \begin{bmatrix}1 \\ 11 \end{bmatrix}$$

我們的目標就是找出左邊矩陣可能的線性組合來滿足右邊的矩陣，

$$\text{3} \begin{bmatrix} 1 \\ 3 \end{bmatrix} + \text{1}\begin{bmatrix} -2 \\ 2\end{bmatrix} = \begin{bmatrix} 1 \\ 11 \end{bmatrix}$$

同樣的可以將這樣的表示法擴展到 $n$ 個維度上

