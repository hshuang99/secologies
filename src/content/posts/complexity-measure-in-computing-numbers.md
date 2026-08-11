---
title: "整數複雜度量測"
date: 2023-06-02
description: 我們在密碼理論(Theory of Cryptology)又或者計算理論(Theory of Computation)裡需要去測量輸入的整數複雜度，通常會用整數的長度(bits)當作標準
hideTOC: false
targetKeyword: 整數複雜度
draft: false
tags: 
  - "密碼理論"
  - "複雜度"
  - "計算理論"
  - "量測"
lang: zh
---
我們在密碼理論(Theory of Cryptology)又或者計算理論(Theory of Computation)裡需要去測量輸入的整數複雜度，通常會用整數的長度(bits)當作標準。

例如給一個整數$x$會使用兩種測量方法:

1. 數值value: $val(x)$或者簡化成$x$也行
2. 長度length(size): $len(x) = \lceil log_{2}(x)+1 \rceil = k$

數值就只是整數本身所以$val(x) = O(2^{len(x)})$，舉例來說：

$val(1000000) = 1000000$，而 $len(1000000) = 21 bits$

