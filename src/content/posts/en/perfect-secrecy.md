---
title: "Perfect Secrecy"
description: "When Ralph C. Merkle proposed Secure Communications Over Insecure Channel in 1978, we began to consider the existence of adversaries eavesdropping on our communication channels over the internet, and we started thinking about how to obscure our data"
pubDate: 2025-01-26
category: "cryptology"
tags: []
authors:
  - "hong-sheng-huang"
heroImage: "https://media.secologies.com/Symmetric-Key-Encryption.webp"
heroImageAlt: "Symmetric-Key-Encryption-Cover"
heroImageWidth: 1920
heroImageHeight: 1080
locale: en
draft: false
featured: false
---

When Ralph C. Merkle proposed "Secure Communications Over Insecure Channels" in 1978 ([https://dl.acm.org/doi/10.1145/359460.359473](https://dl.acm.org/doi/10.1145/359460.359473)), we began to consider the existence of adversaries eavesdropping on our communication channels over the internet, and we started thinking about how to obscure our data

## Scenario for Security

In a traditional communication channel, there are three main components: the sender, the receiver, and the adversary. The sender uses a shared key to encrypt the message \[latex\]m\[/latex\] and sends the ciphertext \[latex\]c\[/latex\] to the receiver through an insecure channel.

For simplicity, we are not considering the process of key negotiation; instead, we assume that the receiver already possesses the shared key and can decrypt the ciphertext \[latex\]c\[/latex\] to recover the original message \[latex\]m\[/latex\].

While the ciphertext \[latex\]c\[/latex\] is transmitted over the internet, an adversary \[latex\]A\[/latex\] exists who can eavesdrop on the channel, observe the ciphertext, and intercept a copy of it for their device.

## Intuition

A scheme \[latex\]\\Pi\[/latex\] achieves perfect secrecy if observing the ciphertext \[latex\]c\[/latex\] has no effect on \[latex\]A\[/latex\]'s knowledge of the message \[latex\]m\[/latex\] that was sent. This means that \[latex\]c\[/latex\] is useless for obtaining \[latex\]m\[/latex\] and reveals nothing about \[latex\]m\[/latex\]

## Definition

An encryption scheme \[latex\]\\Pi = (Gen, Enc, Dec)\[/latex\] with message space \[latex\]M\[/latex\] is perfectly secret if for every probability distribution over \[latex\]M\[/latex\], every message \[latex\]m \\in M\[/latex\] and every ciphertext \[latex\]c \\in C\[/latex\] for \[latex\]Pr\[C = c\] > 0\[/latex\]:

$$Pr\[M = m|C = c\] = Pr\[M = m\]$$

If the ciphertext \[latex\]c\[/latex\] is useful, it would hold that 

$$Pr\[M=m|C=c\]>Pr\[M=m\]$$

This is because an adversary could obtain some ciphertexts and is assumed to already know the distribution of the message space \[latex\]M\[/latex\], denoted as \[latex\]dist(M)\[/latex\].

The adversary then tries to guess a specific message \[latex\]m\[/latex\] from the message space \[latex\]M\[/latex\]. However, if having access to the ciphertext space \[latex\]C\[/latex\] provides no additional advantage for the adversary in guessing this specific message, then the distribution \[latex\]Pr\[M=m|C=c\]\[/latex\] would be equivalent to \[latex\]Pr\[M=m\]\[/latex\].

This implies that the message space \[latex\]M\[/latex\] and the ciphertext space \[latex\]C\[/latex\] are independent. This concept is known as Perfect Secrecy.
