---
title: "Palo Alto 防火牆清除使用者快取"
date: 2023-06-29
description: 因為我們在進行測試能不能抓取 LDAP Server 的同時測試不需要指定 DNS 也可以指向內部的 Active Directory 主機，所以我們嘗試把 Palo Alto VM 內的所有 user 只要有快取的都先清除掉
hideTOC: false
targetKeyword: Palo Alto 防火牆
draft: false
tags: 
  - "cache"
  - "palo-alto"
  - "快取"
  - "清除"
  - "防火牆"
lang: zh
---
因為我們在進行測試能不能抓取 LDAP Server 的同時測試不需要指定 DNS 也可以指向內部的 Active Directory 主機，所以我們嘗試把 Palo Alto VM 內的所有 user 只要有快取的都先清除掉

```
clear user-cache all
```

```
clear uid-cache all
```

```
delete user-group-cache
```

所以我們在 LDAP Server Profile 就能夠準確抓到內部系統裡所有使用者資訊
