---
# Post Settings
title: "Portable Python for In-Memory Execution & Modern Evasion"
date: "2022-12-22"

tags: ["python", "evasion"]
categories: ["video"]
draft: false
toc: false

# Override default meta tags
noindex: false
author: false
description: ""
---

Forget compiling payloads and operating on disk — this post demonstrates the use of Python’s portable interpreter for in-memory malware deployment, even when the language isn't installed on the host.


## Why Python?
Python is a well known language with an infinite number of legitimate uses inside an organization. Through the use of Python’s portable, or [embedded package](https://www.python.org/downloads/windows/) we can download a single `.zip` file and gain access to the python.exe interpreter without any installation required by the user.

Additionally, `python.exe` is a signed binary with a high reputation score, making it unlikely to be blocked. This provides a perfect vehicle for execution of a C2 beacon, or other payload, while on offensive security engagements.

![](/images/posts/portable-python/pm3_1.png)

## Proof of Concept
The following video demonstrates PowerShell being used to download and extract a portable Python interpreter. Once on disk, a download cradle is used to retrieve the payload and execute a meterpreter shell in memory — bypassing the latest version of Windows Defender and other endpoint security solutions:

{{< youtube id="nejLL6txgMk" >}}
*Payload source, PowerShell commands, and Python download cradle are available at [github.com/m8sec/OffsecDev](https://github.com/m8sec/OffsecDev)*

## Additional Resources
For more information on this technique, and potential areas of detection, checkout Diago Capriotti’s [Pyramid](https://github.com/naksyn/Pyramid) project or his DefCon Adversary Village talk: [Python vs Modern Defenses](https://github.com/naksyn/talks/blob/main/DEFCON30/Diego%20Capriotti%20-%20DEFCON30%20Adversary%20Village%20-%20%20Python%20vs%20Modern%20Defenses.pdf)!

