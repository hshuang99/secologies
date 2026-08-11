---
title: "Perfect Secrecy"
date: 2025-01-26
description: When Ralph C. Merkle proposed "Secure Communications Over Insecure Channels" in 1978 (https://dl.acm.org/doi/10.1145/359460.359473), we began to consider the existence of adversaries eavesdropping on our communication channels over the internet, and we started thinking about how to obscure our data
hideTOC: false
targetKeyword: Perfect Secrecy
draft: false
tags: 
  - "ciphertext-space"
  - "message-space"
  - "perfect-secrecy-en"
  - "probability-distribution"
translations: [perfect-secrecy]
lang: en
---
When Ralph C. Merkle proposed "Secure Communications Over Insecure Channels" in 1978 ([https://dl.acm.org/doi/10.1145/359460.359473](https://dl.acm.org/doi/10.1145/359460.359473)), we began to consider the existence of adversaries eavesdropping on our communication channels over the internet, and we started thinking about how to obscure our data

## Scenario for Security

In a traditional communication channel, there are three main components: the sender, the receiver, and the adversary. The sender uses a shared key to encrypt the message $m$ and sends the ciphertext $c$ to the receiver through an insecure channel.

For simplicity, we are not considering the process of key negotiation; instead, we assume that the receiver already possesses the shared key and can decrypt the ciphertext $c$ to recover the original message $m$.

While the ciphertext $c$ is transmitted over the internet, an adversary $A$ exists who can eavesdrop on the channel, observe the ciphertext, and intercept a copy of it for their device.

![Communication.drawio](https://media.secologies.com/Communication.drawio.webp)

## Intuition

A scheme $\Pi$ achieves perfect secrecy if observing the ciphertext $c$ has no effect on $A$'s knowledge of the message $m$ that was sent. This means that $c$ is useless for obtaining $m$ and reveals nothing about $m$

## Definition

An encryption scheme $\Pi = (Gen, Enc, Dec)$ with message space $M$ is perfectly secret if for every probability distribution over $M$, every message $m \in M$ and every ciphertext $c \in C$ for $Pr[C = c] > 0$:

$$Pr[M = m|C = c] = Pr[M = m]$$

If the ciphertext $c$ is useful, it would hold that 

$$Pr[M=m|C=c]>Pr[M=m]$$

This is because an adversary could obtain some ciphertexts and is assumed to already know the distribution of the message space $M$, denoted as $dist(M)$.

The adversary then tries to guess a specific message $m$ from the message space $M$. However, if having access to the ciphertext space $C$ provides no additional advantage for the adversary in guessing this specific message, then the distribution $Pr[M=m|C=c]$ would be equivalent to $Pr[M=m]$.

This implies that the message space $M$ and the ciphertext space $C$ are independent. This concept is known as Perfect Secrecy.

