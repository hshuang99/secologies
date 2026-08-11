---
title: "密碼系統 RSA 攻防"
date: "2023-06-03"
description: NIST美國國家標準與科技機構發起的Public Key公開金鑰加解密系統競賽，RSA (Rivest–Shamir–Adleman)加密演算法由三位密碼學家共同研究出來在1973年發表，最終獲選最早為公開金鑰系統標準之一，雖然後來英國Government Communications Headquarters(GCHQ)國家通訊總部說他們的英國密碼學家早在1970年就已經研究出Non-Secret Encryption這種非對稱式加解密系統，但不管怎麼說，RSA在當時算是非常突破性的成果
hideTOC: false
targetKeyword: RSA
draft: false
tags: 
  - "rsa"
  - "密碼系統"
  - "攻擊"
lang: zh
---
## 簡介

NIST美國國家標準與科技機構發起的Public Key公開金鑰加解密系統競賽，RSA (Rivest–Shamir–Adleman)加密演算法由三位密碼學家共同研究出來在1973年發表，最終獲選最早為公開金鑰系統標準之一，雖然後來英國Government Communications Headquarters(GCHQ)國家通訊總部說他們的英國密碼學家早在1970年就已經研究出Non-Secret Encryption這種非對稱式加解密系統，但不管怎麼說，RSA在當時算是非常突破性的成果。

## 金鑰產生 Key generation

首先選擇兩個隨機的大質數$p$和$q$，通常教科書或老師說要取大質數

> 那怎樣的質數才算大？

參考[[complexity-measure-in-computing-numbers|整數複雜度量測]]之後討論都使用多少bit長度為單位，以及$p$和$q$這兩個大質數的長度要很接近，用來計算$n$: $n = pq$ 並且 $\varphi(n) = (p-1)(q-1)$，如上所說挑選出來的是$len(p-1 \cdot q-1)$的長度。

$\varphi(n)$可以參考[[euler-totient-function|Euler's Totient Function尤拉函數]]，目的是為了找所有與$n$互質的數，$p$和$q$挑質數的原因在於在$p$之下，每一個數都會跟$p$互質，同樣的在$q$之下每一個數也都會跟$q$互質，這樣乘出來$n$群的範圍就會是最大的。

接著隨機挑選一個$e \in Z_{n}$並且$ e\perp\varphi(n)$，這個$e$之後就會用來當作公鑰，接著使用公鑰計算私鑰$d$:

$d = e^{-1} \>\> mod \>\> \varphi(n)$，$d$就是$e$的乘法反元素，如此一來，公鑰就是$pk = (e, n)$，而私鑰就是$sk = (d, n)$。

## 加密

選一個想要加密的明文Message $m \in Z_{n} $:

$ c = E(pk, m) = m^{e} \>\> mod \>\> n $: 加密時使用接收者的公鑰進行加密。

## 解密 Decryption

接收者收到傳輸者加密過後的密文 Ciphertext $c \in Z_{n} $:

$m = D(sk, c) = c^{d} \>\> mod \>\> n$: 解密時接者者使用只有自己知道的私鑰進行解密。

## 正確性 Correctness

私鑰是由公鑰所計算得來的$d = e^{-1} \>\> mod \>\> \varphi(n)$，可以調換成$ed = k\varphi(n)+1$，原因是使用費馬小定理Fermat's Little Theorem:

$a^{p-1} \equiv 1 \>\> (mod \>\> p)$，$a \in Z_{p}$為非零整數，$p$為質數。

以及中國餘式定理Chinese Remainder Theorem:

如果$x = a \>\> (mod\>\> p)$以及$x = a \>\>(mod\>\> q)$代表$x = a \>\>(mod\>\> pq)$，$pq$為互質的兩數。

所以需要證明的是$m = c^{d} \>\> (mod \>\> n) = (m^{e} \>\> mod \>\> n)^{d} \>\> mod \>\> n = m^{ed} \>\> mod \>\> n$

如前面中國餘式定理所述$m = c^{d} \>\>(mod\>\> n)$可以拆成$m = c^{d} \>\>(mod\>\> p)$以及$m = c^{d} \>\>(mod\>\> q)$使得$c^{d} = m^{ed} \>\>(mod \>\> p)$可以成立，再者$ed = 1 \>\>(mod \>\> \varphi(n))$使得$ed = 1 \>\>(mod \>\>(p-1)(q-1))$

可以將$ed = 1 \>\>(mod \>\>(p-1)(q-1))$在modular運算看成$ed = k(p-1)(q-1) + 1$，$k$必須大於0。

$m^{ed}\\ = m^{k(p-1)(q-1)+1} \>\>(mod\>\> p)\\ = m \cdot m^{k(p-1)(q-1)} \>\>(mod \>\>p)\\ = m \cdot (m^{(p-1)})^{k(q-1)} \>\>(mod\>\> p) \>\> \>\> (Fermat's\>\> Little \>\>Theorem)\\ = m \cdot (1)^{k(q-1)} \>\>(mod \>\>p)\\ = m \>\>(mod\>\> p) $

同理在$mod \>\> q$也可行:

$m^{ed}\\ = m^{k(p-1)(q-1)+1} \>\>(mod\>\> q)\\ = m \cdot m^{k(p-1)(q-1)} \>\>(mod \>\>q)\\ = m \cdot (m^{(q-1)})^{k(p-1)} \>\>(mod\>\> q) \>\> \>\> (Fermat's\>\> Little\>\> Theorem)\\ = m \cdot (1)^{k(p-1)} \>\>(mod \>\>p)\\ = m \>\>(mod\>\> q) $

得證$m^{ed} = m \>\>(mod \>\>p)$以及$m^{ed} = m \>\>(mod\>\> q)$所以$m^{ed} = m \>\>(mod \>\>n) = c'$

## RSA加密加速

非對稱式加密系統的安全性都倚靠數學難題，而計算這些金鑰大多使用軟體像是openssl等，當然也有像是特殊的加解密硬體機器可以使用，一台也不便宜，所以幾乎都是企業才會去採購，故網路上的伺服器幾乎都是使用軟體的方法在計算，但在網路上每秒有多少組金鑰對正在產生，而軟體的計算速度也不能太慢，故可以使用一些小方法來提昇效率。

像是使用特殊的$e$，通常會是$2^{x}+1$，再將$e$轉換成二進制，使用square-multiply algorithm來加快計算速度。

舉例3 = 11(b), 17 = 10001(b), 65537 = 10000000000000001(b)使用 [[square-multiply-algorithm|Square and Multiply 演算法]] 計算$c = m^{e} \>\> mod \>\> n$只需要少量的乘法就可以。

另外就是透過[[chinese-remainder-theorem-isomorphism|中國餘式定理與同構特性]]的特性計算$m = c^{d} \>\> mod \>\> n$:

首先設定$sk = (d_{1}, d_{2}, n, p, q)$其中$d_{1} = d \>\> mod \>\> p-1, d_{2} = d \>\> mod \>\> q-1$

接著預先計算$\overline{q} = q(q^{-1} \>\> mod \>\> p)\>\> mod\>\> n$以及$\overline{p} = p(p^{-1} \>\> mod \>\> q)\>\> mod \>\> n$

就可以計算$m_{1} = (c \>\> mod \>\> p)^{d_{1}}\>\> mod \>\> p \\ m_{2} = (c \>\> mod \>\> q)^{d_{2}} \>\> mod \>\> q \\ m = (m_{1}\overline{q} + m_{2} \overline{p}\>\>\>\>) \>\> mod \>\> n$

軟體的話可以利用平行運算分別計算$m_{1}$以及$m_{2}$

## RSA加密攻擊

### 弱參數攻擊 Weak Parameter Attack

是假設私鑰$d$挑選的值: $ d < n^{1/4}$以及$p-1, p+1, q-1, q+1$沒有挑選大質數以及$|p - q|$數值很小，$p$跟$q$很接近的話$(n = 2048\>\> bits \gets p = 1024 \>\> bits, q = 1024 \>\> bits)$代表${(p-q)^{2}}/{4}$也會很小，而${(p+q)^{2}}/{4}$會比 $n$ 再大一些，至少$n = {(p+q)^{2}}/{4} - {(p-q)^{2}}/{4}$，所以${p+q}/{2}$會比$ \lceil \sqrt{n} \rceil $大一些。

首先我們計算$z = \lceil \sqrt{n} \rceil $是$y = z + i, i \geq 0$取得這個$y$之後看$y^{2} - n$是不是一個平方數$x^{2}$，如果是的話$x$有可能會是$x = {p-q}/{2}$，如果$x$是一個平方數的話，可以看成是n分解成$(x-y)(x+y) = pq$

針對弱參數的對策就是$p$的bit數應該要比$q$在少一些，不能夠讓bit數太接近。

### 共同模數攻擊 Common Modulus Attack

假設一組$n = pq$用來產生兩對金鑰給兩個使用者:

$(pk_{1}, sk_{1}) = ((e_{1}, n), (d_{1}, n)) \\ (pk_{2},sk_{2}) = ((e_{2}, n), (d_{2}, n))$

可以使用其中一對的金鑰去搜尋另一對的金鑰，假設今天知道user1的金鑰要猜user2的私鑰:

$(pk_{1}, sk_{1}, pk_{2}) \to sk_{2}' = (d_{2}', n), d_{2}' = e_{2}^{-1} \>\> mod \>\> (e_{1}d_{1} -1)$，$e_{1}d_{1}-1$就是$k \cdot \varphi(n)$

以及假設一個$Message \>\>m$同時被這兩個使用者加密，竊聽者可以取得$c_{1} = m^{e_{1}} \>\> mod \>\> n$跟$c_{2} = m^{e_{2}} \>\> mod \>\> n$，可以計算$s, t$用來:

$c_{1}^{s}c_{2}^{t} \>\> mod \>\> n = m^{se_{1}+te_{2}} \>\> mod \>\> n = m$，當然先決條件是:

$se_{1}+te_{2} = 1$，並且$e_{1} \perp e_{2} $

針對共同模數攻擊的對策是盡量不要使用同一個$n$群產生太多把金鑰對，以及盡量不要加密同一個明文太多次。

### 低指數攻擊 Low Exponent Attack

在早期許多伺服器使用$e = 3$當作公開金鑰，但風險就是如果$m$只要被三個使用者用$e=3$來加密的話，竊聽者可以取得這些密文$c$:

$c_{1} = m^{3} \>\> mod \>\> n_{1} \\ c_{2} = m^{3} \>\> mod \>\> n_{2} \\ c_{3} = m^{3} \>\> mod \>\> n_{3}$

前面提到使用中國餘式定理CRT可以計算共同的數，$c = c_{1}c_{2}c_{3} \>\> mod \>\> n = m^{3} \>\> mod \>\> n_{1}n_{2}n_{3} = m^{3}$

而$m = c^{1/3} = (m^{3})^{1/3}$使用三次方根演算法就能快速解開取得$m$了，針對低指數攻個的對策就是$e$不要挑選太小

### 選定密文攻擊 Chosen Ciphertext Attack

這種攻擊方法需要倚靠Oracle讓攻擊者可以取得明文密文對，可以將oracle想成一張很大的表，系統提供一個Decryption Oracle $O_{e, n}$給這oracle一個使用者自己挑選的密文$c$，oracle會回傳一個$m = c^{d} \>\> mod \>\> n$，唯一的限制就是攻擊者不能要求解開真正想知道的明文密文對，攻擊者只能挑選想破解的密文之外的其他密文，擁有解密oracle後攻擊者要如何攻擊？

透過原本的$c$關聯性計算$c' = cr^{e} \>\> mod \>\> n$，$ r \in_{R} Z_{n}^{*}$

詢問oracle $O_{e, n}(c') \to m'$，這個$m' = m \cdot r $

最後計算$m'r^{-1} \>\> mod \>\> n = mrr^{-1} \>\> mod \>\> n = m$

透過mask掉原本的$c$得到$c'$拿去詢問oracle後再使用攻擊者自己挑選的$r$還原得到想要攻擊的$c$的$m$，而這種選定密文攻擊有兩種型態:

1. Non-adaptive chosen ciphertext attakc(CCA1): 攻擊者把想要詢問的密文一次挑選出來，只能針對oracle詢問一次$O_{e, n}(c_{i}), 1 \leq i \leq s$，無法依靠上一次詢問的結果來調整下一次詢問的選擇
2. Adaptive chosen ciphertext attack(CCA2): 攻擊者在多項式時間內可以一次一次的詢問oracle，不限詢問次數$O_{e, n}(c_{i}), 1 \leq i \leq s$，可以透過前一次的詢問來調整下一次的詢問選擇。

如此可見CCA2的安全性等級是最高的，所以看paper在證明密碼系統的安全性時雖然作者會寫有CCA的安全性，但需要讀者再去檢查一下oracle的等級，看是達到CCA1還是CCA2的安全性

針對RSA選定密文攻擊方法是採用$OAEP^{+}$使用random oracle model來抵抗CCA2的攻擊
