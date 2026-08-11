---
title: "Indicators of compromise (IoC)"
date: 2024-09-13
description: When collecting malicious APT (Advanced Persistent Threats) incidents, we need some relevant information. Through this information, we can identify specific characteristics or indicators
hideTOC: false
targetKeyword: Indocators of Compromise
draft: false
tags: 
  - "cyber-security-en"
  - "indicator-of-compromise"
translations: [indicators-of-compromise]
lang: en
---
When collecting malicious APT (Advanced Persistent Threats) incidents, we need some relevant information. Through this information, we can identify specific characteristics or indicators that may suggest a system or network has been compromised, including file characteristics, network characteristics, host characteristics, email characteristics, user behavior characteristics, log characteristics, and application characteristics, among others.

## File Characteristics

**File Hash Values**: In file characteristics, we can collect the hash values of malicious files, such as the characteristics of files after being hashed with MD5, SHA-1, SHA-256, etc.

**File Name**: We can collect and search for file names associated with known malicious files.

**File Path**: We can collect and search for file storage path names associated with known attacks or malicious activities.

## Network Characteristics

**IP Address**: We can extract known malicious IP addresses used by attackers.

**Domain Name**: We can extract malicious domain names associated with known attacks or malicious activities.

**URL**: We can collect specific URLs containing malicious content.

**Port**: We can gather specific network ports used in attacks.

## Host Characteristics

**Abnormal System Activity**: Abnormal system activities within the host can be identified, such as unusual processes, services, or login behaviors.

**Abnormal Login Patterns**: Irregular account login patterns or multiple failed login attempts are also important indicators within the host.

**Application Anomalies**: Suspicious behavior in specific applications, such as unusual file or folder read/write operations, can be highly suspicious.

**Known Vulnerabilities**: Suspicious activities executed in applications related to known vulnerabilities are also critical indicators.

**Malicious Application Behavior**: Known malicious actions performed by specific applications.

## E-Mail Characteristics

**Sender Address**: Compare the sender's address with known phishing or malicious emails as an indicator.

**Email Subject**: Specific email subjects containing malicious content or phishing scams, often used in social engineering, are highly suspicious when they inquire about topics familiar to the victim.

**Attachment Name**: Specific attachment names containing malware or malicious documents are a significant threat, especially in phishing emails.

## User Characteristics

**Login Patterns**: Abnormal user login behavior or atypical user activity, such as multiple login attempts or a user attempting privilege escalation after logging in, are highly suspicious indicators.

**Privilege Escalation**: Unusual requests for account privilege elevation.

**Unauthorized File Access**: Unauthorized access to system files or data, where the principle of least privilege should be enforced within internal systems.

## Log Characteristics

**System, Application, or Device Logs**: Logs that record events specific to an attack. Attackers typically try to avoid leaving traces, so they may attempt to delete log files from the period of the attack.

**Anomalous Events**: Log records of abnormal events or system behavior.

## Application Characteristics

**Known Vulnerabilities**: Applications associated with known vulnerabilities.

**Malicious Application Behavior**: Known malicious actions associated with specific applications.
