---
title: "PUF 晶片上的物理不可複製功能"
date: 2025-01-01
description: 物理不可複製功能(Physical Unclonable Function, PUF)屬於一種裝置讓晶片可以繼承從製造出來後產生的隨機性質，每一顆封裝過後的晶片所呈現的物理性質都是特定的，我們可以將其視為這是屬於那顆晶片的指紋(fingerprint)或者安全錨(trust anchor)，於本文章中跟各位介紹主流的兩種Strong PUF以及Weak PUF，而這個領域持續還有新興的方法正在被設計當中，在未來隨著資料的安全隱私性越來越重要，針對嵌入式裝置內的晶片資料流提出更優秀的安全演算法必定是需要的
hideTOC: false
targetKeyword: PUF
draft: false
tags: 
  - "black-box-challenge-response"
  - "challenge-response-pairs"
  - "puf"
  - "root-of-trust"
  - "旁道攻擊"
  - "物理不可複製功能"
lang: zh
---
## 前言

隨著半導體的價值越來越高，連同傳輸在晶片上的bit stream資料越來越需要隱藏的手段，畢竟早在2007年就有相關的研究在討論如何分析單晶片上的資料流以及逆向回明文資料，Stefan Mangard, Elisabeth Oswald, Thomas Popp等人著作的《Power Analysis Attacks》：Revealing the Secrets of Smart Cards[^1]如圖一有著非常詳細的描述關於透過類比儀器讀晶片耗費電流來分析目前晶片正在做何種運算，適合對於想要了解硬體安全設計的DD、DV或者IP team的工程師花點時間閱讀一下

![61qDPkdV7tL](https://media.secologies.com/61qDPkdV7tL-665x1024.webp)
*《Power Analysis Attacks》[^1]*

而漸漸地開始在學術界也有看到一些關於如何保護晶片資料不被竊取的研究，最直觀的想法應該就是直接透過加密模組把輸入跟輸出的資料都進行加密，概念如下圖

![chip-encrypt.drawio](https://media.secologies.com/chip-encrypt.drawio.webp)
*硬體加密 - Ensuring Security of Application & Service with Chip Fingerprint[^2]*

使得硬體本身能夠抵抗非侵入性的攻擊手法，在VLSI/CAD 2022[^2]年研討會上提到了"Trust Anchor"或者是"Root-of-Trust"的概念概念如下圖，一些研究員想著在硬體上有沒有能夠仰賴的特性

![RootOfTrust.drawio](https://media.secologies.com/RootOfTrust.drawio.webp)
*Root of Trust - Ensuring Security of Application & Service with Chip Fingerprint[^2]*

畢竟針對硬體的各種安全威脅及攻擊嘗試已經出現至少30多年了，而在這些年來看最成功的莫屬於提出了物理不可複製功能(Physical Unclonable Functions)或通常簡稱PUF這項特性

## 物理不可複製功能 PUF

那PUF究竟是有什麼樣的魔力能夠讓我們採信這個特性不會被攻擊者拿走我們晶片裡的資料呢？

- 用來取代secret key
    - 在上述圖二有提到產出的key也必須被保護起來，而在硬體上我們只能將secret key存在某個記憶體當中，畢竟要時常加密的話就得一直把key拿出來，這樣的話通常會放在非揮發性的Nonvolatile electrically erasable programmable read-only memory (EEPROM)
    - 或者放在目前大多數架構仰賴的Battery-backed static random-access memory (SRAM)上，而在這個研究領域當中其實蠻多的學者提出攻擊這些記憶體空間的方法
- 可以直接利用硬體搭配使用密碼元件像是數位簽章或加密系統
- 能夠利用剩餘的面積把模組放進去且不佔太多空間，另額外產出的電量消耗在一些研究當中提到可以混淆晶片計算時的電流

所以PUF用在晶片模組上用來驗證使用者或者儲存secret key的效果其實可讓人期待，不需要額外嵌入安全的EEPROMs或其他昂貴的IP上來保護我們的資料，而PUF最主要利用的就是矽的**生物辨識**(biometric)性質，原因是半導體工廠在製造晶圓時每一片基於分子結構或排列順序造出**製造變異性**，而切割下來後封裝就會讓每一顆IC的gate delay時間不同了幾毫秒，在specification上會註明多少的threashold對於效能不會有影響，而DD跟DV也會去測試自家模組的時序讓影響降到最低，不過就是因為這微乎其微的delay造就了我們能夠用來做出PUF

核心想法就是要設計Black-box challenge-response系統，要讓挑戰(challenge) $c$透過一組function $f(\cdot)$來造出回應(response) $r$使得$r = f(c)$會成為一對挑戰回應對(Challenge-response pairs, CRPs)，其中function的計算就會受到PUF的delay影響而改變了$r$的結果概念如下圖，只要拼湊夠多的CRPs就能夠來拿當作跟bit stream做加密的secret

![CRPs](https://media.secologies.com/CRPs.webp)
*Challenge-Response Pairs (CRPs)*

會決定做CRPs當然是有著一些優勢的

- 只需使用簡單的數位電路，畢竟在設計function $f(\cdot)$時還是需要仰賴MPU幫忙計算，然而同時應該還有其他元件也需要計算，所以只能設計一些constant time、最多polynomial time可以算完的公式來構造成數位電路
- 能夠防範侵入性的攻擊手法，因為侵入性的方法會破壞wire或元件，這樣CPRs的function就不會正常的運作
- 而CPRs只要計算完成後除非pool內不夠用否則不用再進行任何計算，這不像是secret key那樣還要有保護key的機制，所以省下了持續防止攥寫機制的電力消耗

### PUF種類

#### Low-Cost PUFs

經典代表是Strong PUFs，擁有數量極大的CRPs，雖然需要耗費更多的儲存空間，但就不需要透過其他密碼硬體元件光靠CRPs的數量就能夠直接進行驗證，就像是one-time pad那樣儲存空間換安全性，常見於Optical PUF以及arbiter PUF

#### Secure Key Generation

而這種方法也可以稱作Weak PUFs，不同於Strong PUFs，只造出較少的CRPs，但是要用這些CRPs建構出物理混淆金鑰(Physically obfuscated keys)，所以要向PRNG那樣將CRPs當作seed，在透過gate delay的效應造出不同的key出來使用，常見於Ring-Oscillator PUF以及SRAM PUF

#### Error Correction

在上述兩種不管是strong或是weak的PUFs都是仰賴於類比物理特性，比較像是fabrication階段產生的前處理，那有沒有辦法讓封裝完成後的IC在產出更多的randomness出來？

Error correction想要利用noise或是變異性例如溫度、供電電壓以及其他環境參數來當作能混淆的工具，而這基於矽的特性上再疊加這些noise能夠提升可靠性，然而多了這些資訊其實也提高了洩漏secret key的風險，因為拿到noise之後還必須計算成secret可以用的型態，以及這樣就要額外提供儲存空間如前提到SRAM等來存這些syndrome bits，是否需要利用到這種方法就得斟酌應用情境了

## PUF設計

### Strong PUF設計

如上一節提到主要是Optical PUF以及Arbiter PUF比較常見

#### Optical PUF

照名稱來看其實就是透過光學特性來製作PUF，又可稱作物理單向功能(Physical one-way function)，把雷射打進電磁場內在模擬信號轉換成bit-string如下圖

![OpticalPUF](https://media.secologies.com/OpticalPUF-1024x299.webp)
*Optical PUF[^3]*

透過沿著雷射路徑的固定散射直接把雷射從Z軸在XY軸平面上移動來改變偏振，記錄從散射介質輸出的雷射光“斑點”圖案成像出來就是我們可以拿來利用的資訊

然而在實務上受到宏觀光學的特性能拿來利用的數量很少，更甚用來驗證optical PUF也不太被信任，畢竟這是把光學設備先造好的資訊再拿進PUF內，但通常PUF不會與驗證的模組分離，不過因為在學術上蠻常被拿來當作範例介紹，所以在此篇文章還是提及

#### Arbiter PUF

仰賴**互補式金屬氧化物半導體**(Complementary metal–oxide–semiconductor, CMOS)，畢竟元件內就有CMOS可以使用，而IC通常也不會與PUF分開，繼承了製造時所產生的變異性，其中製造方法就會影響最終獨立的gate delay，然而通常單一的gate delay沒辦法直接測量，必須透過結合多個獨立的gate delay以及一系列的測試才能近似估測

透過組合多個多工器，每一組多工器的電壓切換時間不同，但最終要把結果輸出給latch，而這稱作arbiter，其中每一組多工器拿到clock以及計算時就會被gate delay影響，同時要構成對稱式電路，意思是不能包含任何secret資訊在其中，概念如下圖

![ArbiterPUF](https://media.secologies.com/ArbiterPUF.webp)
*Arbiter PUF[^4]*

然而如果只是單純的對稱式電路結構，其實攻擊者可以利用非侵入式的方法錄下電流進行線性分析找出gate delay的特性，像是錄clk校準、溫度、供電電壓、老化程度以及隨機noise，另外要注意的是每一組延遲時間會不會太接近，如果太接近的話Latch設置這麼多的多工器根本沒什麼效用，所以通常還需要再加入一些error-correcting的功能進去

### Strong PUF low-cost authentication設計

前面提到strong PUF透過大量的CRPs取代嵌入式裝置內安全記憶體以及密碼硬體元件的需求，其實也間接的降低了面積的需求、供電的需求以及堆積的層數，而少了安全性機制就需要額外的驗證協定來驗證使用者以及CRPs的資訊正確性，通常這個協定對於所有參與者是一個黑盒子，PUF提供secret給client(或EDA工具)以及server，讓client跟server進行challenge-and-response協議如下圖，首要原則是polynomial數量的CRPs不能夠被任何一端預測出任何一組針對新的challenge所對應的response

![AuthProtocol](https://media.secologies.com/AuthProtocol.webp)
*Low-Cost Authentication Protocol*

另外就是方才提到Arbiter PUF在對稱式電路上會被線性分析手法逆向回去，原因在於delays也都是線性的就可以利用"Modeling attacks"來分析，所以在近代的密碼系統中就考量非線性是首要遵守的，在硬體上也可以實現在最後latch加上XOR gate做成XOR arbiter PUFs，只需要非常簡單的XOR元件就能打亂原先的結構，並且讓輸出的0跟1呈uniformly，但這需要數個arbiter PUF輸出串接成一組單一的response，所以需要更多的的arbiter PUF數量如下圖

![Two-independent-linear-arbiter-PUFs-are-XOR-mixed-in-order-to-implement-an-arbiter-PUF_W640](https://media.secologies.com/Two-independent-linear-arbiter-PUFs-are-XOR-mixed-in-order-to-implement-an-arbiter-PUF_W640.webp)
*XOR混合兩個獨立的arbiter PUF - Slender PUF Protocol: A Lightweight, Robust, and Secure Authentication by Substring Matching[^5]*

不過好處也可想而知，能夠預防攻擊者利用訓練機器學習這類找特徵以及Side-Channel攻擊這類找頻率的方法，付出了更多的效率換取安全性，畢竟安全這個特性本來就是在便利效率跟安全之間做取捨

通常造出的這組response至少要$k$-bits，但因為晶片會一直產生新的bit stream出來所以response的產生速度也得跟上，而其中線性回饋位移暫存器(Linear Feedback Shift Register, LFSR)就是最常見的元件了，能夠透過輸入的challenge產出大量的pseudorandom序列，LFSR其實在硬體的實作上已經算是非常成熟，有許多優秀的研究都提出了很棒的架構，這使得放在晶片上不需要耗費太多面積，同時也提供了一些額外的電壓消耗產生出動態電壓能夠用來混淆讓Side-Channel攻擊分析更難

![LFSR](https://media.secologies.com/LFSR.webp)
*Linear Feedback Shift Register[^6]*

要產生動態電壓其實可以透過兩種方法

#### Intra-PUF變化

一些研究上可以看到同一顆晶片裡實作了好幾個相同功能的PUF在裡面，針對不同的bit stream使用不同來源PUF的secret也是可行的，而這種內部存在多種PUF會在不斷變化的環境下重複進行計算，在統計分佈上最理想不同PUF來源製造出來的secret應該要接近0%讓攻擊者讀不出差異

#### Inter-PUF變化

另一種就是在晶片上實作好幾種不同功能的PUF組成secret來源，而我們希望不同的獨立PUF在計算中會有不同的變化，每一組來源應該要是unique的，使其在統計上最理想是這些獨立PUF造出來的secret最多50%讓攻擊者無法區分讀出來的secret來源到底是哪一顆PUF產出的

![Code-distance-distribution-for-256-bit-PUF-responses_W640](https://media.secologies.com/Code-distance-distribution-for-256-bit-PUF-responses_W640.webp)
*Code distance distribution for 256-bit PUF responses[^4]*

我們一直提到要混淆bit stream以防被攻擊者找出頻率所以建立了一些結構，但究竟Arbiter PUF會如何被攻擊呢？

也許在那之前要先點出一些關鍵的安全因素

- 攻擊者要很困難的去測量出PUF內internal參數(基本上只能允許CRPs被觀測到，其他的資訊應該除了沒意義不然就得是無法辨識的)
- 攻擊者沒辦法將製造出來的元件重新複製出一模一樣的gate delay
- 攻擊者沒辦法透過過去搜集的CRPs或者輸入資訊來預測出PUF的行為

攻擊者搜集到的所有資訊關於CRPs數量多寡會跟進行模型學習的複雜度成正相關，但要讓secret模糊到攻擊者訓練演算法會有一定的失敗機率出現，意思是讓模型準確度跟訓練集(CRPs數量)成反比，訓練的資料可能是timing或者side-channel分析搜集到的電壓，這樣理想的情況演算法失敗就得重新訓練調整參數耗費攻擊者更多的時間，有些研究提到要提升這樣的穩定性，如我們方才提到的intra-PUF變化特性，也許可以設定一些固定的PUF error讓攻擊者蒐錄到，從而造就資料下毒的效果

然後再搭配error correction讓自己的功能可以正常運作，這需要特別設計bit stream要符合某些code的特性，例如2-D Hamming code的Bose-Chaudhury-Hochquenghen (BCH) codes就也許能夠用來設計這種情境，下圖顯示利用BCH至少可以造192 syndrome bits來混淆後再進行偵錯

![False-positives-and-negatives-for-strong-PUF-operation-with-a_W640](https://media.secologies.com/False-positives-and-negatives-for-strong-PUF-operation-with-a_W640.webp)
*圖十一False positives and negatives for strong PUF operation[^4]*

### Weak PUF設計

最常見的有Ring-Oscillator PUF以及SRAM PUF

#### 環狀振盪器 PUF

這是由多組振盪器組成，並且在把N組獨立設計的環狀振盪器拿來做成PUF，通常會在FPGA或者ASIC上合成，只需要一定數量的challenge就能產出不同的response，主要變化是在環狀振盪器內透過反向器的延遲讓每一個獨立的輸出透過多工器目前的clk來輸出，每一組雖然可以拿到一樣的clk，但由於反向器的時間抵達不同就造成些微的差異如下圖

![Ring-Oscillator-PUF](https://media.secologies.com/Ring-Oscillator-PUF-1024x576.webp)
*Ring Oscillator PUF design[^7]*

核心運作的就是這些反向器，也是其中的環境變化及noise來源，會受到元件的溫度、電壓、老化程度影響到傳輸的情況，所以error correction的功能也可以一起搭配使用，但要防範的是頻率是否太過接近，如果輸出沒有uniformly也許可以把輸出bit翻轉一下，而把頻率的距離設計到能夠拿來當成輸出才行

#### SRAM PUF

又稱作正向反饋迴路功能，在SRAM元件裡有兩個穩定的狀態，通常是1跟0，而正向回饋功能就會強制把元件設定成其中一個狀態，一旦進入了某一個狀態裡便不會輕易的轉換成另一個狀態了，最終狀態會根據兩個回饋迴路的差異來決定，而這迴路當中就是不斷地執行寫入的操作，一直強制把SRAM元件轉換成其中一種狀態，而當晶片在運作中且沒有任何SRAM寫入的操作要施行的話，SRAM會變成亞穩態(metastable)狀態，但在運作的過程中元件會不斷地切換成1或0的狀態

而就是這轉換的過程當中極板threshold mismatches的差異產出的隨機值就能夠拿來當成secret，如果兩組SRAM的回饋回路足夠接近的話，就能夠導致輸出bit翻轉了

![SRAM-cell](https://media.secologies.com/SRAM-cell.webp)
*SRAM cell[^4]*

### Weak PUF 密碼金鑰產生設計

在前面提到Weak PUF會去產生secret key，一旦取得後就儲存在安全揮發性的記憶體當中，因為這把key的安全性只限於產出後那一段時間內的操作中，所以放在會揮發的記憶體中沒問題，那最重要的肯定就是這把key產出的protocol需要保證其安全性，不過演算法的複雜度只限於硬體設備能夠實現的，雖然只能挑選bit-security較低的密碼系統但weak PUF還是能夠穩定產出unique bits組成的集合，而這些bits就能夠拿來當作驗證使用例如硬體額外實作HMAC/AES的方法

而產出的key其實也可以搭配前面Strong PUF的challenge-response驗證系統當成challenge，只需要額外搭配一些error correcting就可以輸出能用的response bits，這種系統被稱作"型態匹配"(Pattern Matching)，但也有另一種研究是容錯型電路(Error-tolerant comparsion circuit)

#### SRAM PUF

例如像是SRAM有些研究在threashold電壓不匹配時就進行error correction，當SRAM通電但沒有任何寫入的操作時，重複的傾向於亞穩態0或1的狀態，另外類比layout時會建構對稱或共同中心的拉線，就能夠造出1跟0相同的狀態數量

但要注意的是溫度或其他電壓雜訊會影響到晶片老化從而導致不穩定的bits產出，在一些研究中也有發現現成的SRAM元件因為老化的關係產出了大量的"1"狀態，這點其實被視為是輸出的bias[^8]，其現象稱作負偏溫度不穩定性(Negative bias temperature instability, NBTI)，這個問題在金屬氧化物半導體場效電晶體(metal–oxide–  
semiconductor field-effect transistor, MOSFET)上其實也有，在多次的燒入之後元件老化的問題對於這些電晶體的影響很大，而這些問題其實就得靠error correction的方法來校正了，畢竟要拿去給密碼模組操作的任何一組bit都不能出錯

而這些密碼模組其實也都是植基在傳統的安全primitives上來保護key能夠安全地在晶片上運作，而攻擊者如果熟悉晶片的specification，應該也會看到crypto core裡面實作了何種機制，從而利用一些像是輸入"寫入"的操作看會不會報錯、改變晶片的溫度看運算有無影響、把電壓時序打進去的時間變快看演算法有沒有什麼錯誤，以及查找有沒有什麼明文的資料殘留在記憶體或者wire上等等

#### 環狀振盪器PUF

而在環狀振盪器當中使用的是soft-decision error-correction decoder，搭配原有的架構組合出複雜且重新結合過的結構，利用多的code來影響到最後XORs或者振幅調變的輸出response

![A-k-sum-ring-oscillator-PUF-Ring-oscillators-that-are-closer-in-frequency-do-not-affect_W640](https://media.secologies.com/A-k-sum-ring-oscillator-PUF-Ring-oscillators-that-are-closer-in-frequency-do-not-affect_W640.webp)
*A k-sum ring-oscillator PUF[^4]*

但新增了error correction的方法進去一樣要注意輸出頻率不應該太接近，觀測0跟1的隱私關聯性應該要非常的低，至少小於$\epsilon$，有些研究提到可以使用Index-based coding (IBS)的code，這種方法會從不同的bit string去識別每一個bit的相關性，而計算完後找出關聯性小於某種threashold的才挑選出來當成PUF輸出的部分bits，在獨立且相同分布 $(i.i.d.)$ 的 PUF中，將PUF計算出的bits做偏差統計與syndrome leakage安全性消除其關聯性，這是同樣跟BCH code一起使用的方法來達到50%的穩定安全邊界

需要仰賴這樣的編碼方法是因為通常造出key之後是依靠下層的密碼硬體或軟體來保護這把key，有一定的機會攻擊者可以拿到key，或者攻擊者已經知道電路的架構，破壞了晶片內的TRNG產生器，在強一些的話攻擊者甚至可以調整頻率來讓PUF生出想要的輸出值，當攻擊者拿到key之後跟不斷嘗試指定的輸出做測試，直到找到破解並且能夠自行生成一把key時，crypto core以及整顆晶片的安全性會整個失效

另外一些研究提到透過組合多組振盪器產生電磁輻射影響結果來進行破解

## 其他PUF種類

### Model-based PUF

利用"Secure bootstrapping"的機制，當一組CRP被使用之後便直接捨棄掉，但這需要先搜集大量的CRPs並且也需要大量的空間來儲存這些CRPs，同時也會進行模擬PUF的challenge-response行為，例如模擬Arbiter PUF每一顆獨立多工器的延遲時間，同樣儲存到空間當中，在某些情況下使用者可以同意重現過往的參數資訊，這點有助於驗證的稱作"Secret Model"，這種方法類似於Strong PUF跟Weak PUF的混合種

### Timed Authentication and Public Models

這種PUF同樣也需要secure bootstrapping以及安全的儲存空間

#### Public Model PUFs(PPUFs)

其中PPUF裡public model會模擬challenge-response的行為，PPUF硬體計算response的時間比PPUF model和PPUF硬體之間的時間快得多，$T < T_{0}$

![PublicModel](https://media.secologies.com/PublicModel-1024x151.webp)
*Public Model*

其中儲存空間必須能夠抵抗竄改以及重新複寫的攻擊，同時要實現特定的PPUF model與特定 PPUF 硬體擁有者有著相關聯才能夠讓人信任，例如使用傳統的公開金鑰基礎建設(PKI)或其他root of trust的方法提供給使用者，其中$T_{0}$表示計算時有足夠長的時間以便 PPUF 硬體計算以及足夠長的時間讓 PPUF 硬體計算response，並預留線路回應的延遲時間，但同時還必須滿足時間短到沒有model可以模擬出PPUF硬體，並在時間內正確產生response

所以要提供的Root of Trust如果secret bits存放在secure NVM裡還會被偷，或者PUF modeling可以被攻擊者模擬到近似值那代表這個安全性質非常薄弱，而PPUF必須保證在計算跟傳輸的過程當中沒有bit會被偷出去，這點就取決於攻擊者能不能精確的複製出PPUF硬體的困難程度了

## 其他PUF架構

其他新一點的研究提到漸進式加速運算方法，以及如果MPU運算能力夠強，指令集也支援算得很快的平行化指令，也有團隊研究能不能改良pipeline也來實作CRPs，甚至於說要輸出的secret bits可以在constant time內算出來，而CMOS計算速度跟最便宜的特性也漸漸受到重視

## Conclusion

物理不可複製功能(Physical Unclonable Function, PUF)屬於一種裝置讓晶片可以繼承從製造出來後產生的隨機性質，每一顆封裝過後的晶片所呈現的物理性質都是特定的，我們可以將其視為這是屬於那顆晶片的**指紋(fingerprint)**或者**安全錨(trust anchor)**，於本文章中跟各位介紹主流的兩種Strong PUF以及Weak PUF，而這個領域持續還有新興的方法正在被設計當中，在未來隨著資料的安全隱私性越來越重要，針對嵌入式裝置內的晶片資料流提出更優秀的安全演算法必定是需要的

[^1]: Stefan Mangard, Elisabeth Oswald, Thomas Popp, "Power Analysis Attacks: Revealing the Secrets of Smart Cards," Springer New York, NY, [https://doi.org/10.1007/978-0-387-38162-6](https://doi.org/10.1007/978-0-387-38162-6)

[^2]: Evans Yang, Invited Talk, "Ensuring Security of Application & Service with Chip Fingerprint," VLSI Design/CAD Symposium 2022.

[^3]: Rührmair, Ulrich. “Optical PUFs Reloaded.” (2013). [https://www.semanticscholar.org/paper/Optical-PUFs-Reloaded-R%C3%BChrmair/09265c340c8eb21f9dc5e87204476afabba0b3ad?utm\_source=direct\_link](https://www.semanticscholar.org/paper/Optical-PUFs-Reloaded-R%C3%BChrmair/09265c340c8eb21f9dc5e87204476afabba0b3ad?utm_source=direct_link)

[^4]: Herder, Charles & Yu, Meng-Day (Mandel) & Koushanfar, Farinaz & Devadas, Srinivas. (2014). Physical Unclonable Functions and Applications: A Tutorial. Proceedings of the IEEE. 102. 1126-1141. 10.1109/JPROC.2014.2320516. [https://www.researchgate.net/publication/264124584\_Physical\_Unclonable\_Functions\_and\_Applications\_A\_Tutorial](https://www.researchgate.net/publication/264124584_Physical_Unclonable_Functions_and_Applications_A_Tutorial)

[^5]: Majzoobi, Mehrdad & Rostami, Masoud & Koushanfar, Farinaz & Wallach, Dan & Devadas, Srinivas. (2012). Slender PUF Protocol: A Lightweight, Robust, and Secure Authentication by Substring Matching. Proceedings - IEEE CS Security and Privacy Workshops, SPW 2012. 10.1109/SPW.2012.30. [https://www.researchgate.net/publication/254043041\_Slender\_PUF\_Protocol\_A\_Lightweight\_Robust\_and\_Secure\_Authentication\_by\_Substring\_Matching](https://www.researchgate.net/publication/254043041_Slender_PUF_Protocol_A_Lightweight_Robust_and_Secure_Authentication_by_Substring_Matching)

[^6]: COS 126 Computer Science An Interdisciplinary Approach, Princeton University, "Linear-Feedback Shift Register," 2017. [https://www.cs.princeton.edu/courses/archive/spr17/cos126/assignments/lfsr.html](https://www.cs.princeton.edu/courses/archive/spr17/cos126/assignments/lfsr.html)

[^7]: Kodýtek, Filip and Róbert Lórencz. “A Design of Ring Oscillator Based PUF on FPGA.” 2015 IEEE 18th International Symposium on Design and Diagnostics of Electronic Circuits & Systems (2015): 37-42. [https://www.semanticscholar.org/paper/A-Design-of-Ring-Oscillator-Based-PUF-on-FPGA-Kod%C3%BDtek-L%C3%B3rencz/1c5681d1524d5b160c6b92143e5e5dee663ec75b](https://www.semanticscholar.org/paper/A-Design-of-Ring-Oscillator-Based-PUF-on-FPGA-Kod%C3%BDtek-L%C3%B3rencz/1c5681d1524d5b160c6b92143e5e5dee663ec75b)

[^8]: Z. -W. Lai and K. -J. Lee, "Using Unstable SRAM Bits for Physical Unclonable Function Applications on Off-The-Shelf SRAM," 2019 IEEE Asia Pacific Conference on Circuits and Systems (APCCAS), Bangkok, Thailand, 2019, pp. 41-44, doi: 10.1109/APCCAS47518.2019.8953143.

