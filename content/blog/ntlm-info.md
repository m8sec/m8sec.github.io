---
# Post Settings
title: "Information Disclosure in NTLM Authentication"
date: "2020-03-05"

tags: ["ntlm", "recon"]
categories: ["blog"]
draft: false
toc: false

# Override default meta tags
noindex: false
author: false
description: ""
---

This post introduces the concept of information disclosure through NTLM authentication and demonstrates methods for invoking an NTLM challenge response over HTTP(S) - even when no login page is present.

## Overview
NTLM authenticates users via a challenge/response sequence in which the user’s actual password is never sent over the wire. Instead, the requesting client receives a challenge from the server and must perform a calculation that proves their identity.

I am far over simplifying this process, but the diagram below is a good example of how this authentication scheme works in a Windows AD environment.
![](/images/posts/ntlm-info/ntlm_diagram.gif)

*Now, how does this help in recovering sensitive internal information?*

Once a target is identified as using NTLM authentication, we can initiate a connection and send anonymous (null) credentials, which will prompt the server to respond with an NTLM Type 2 challenge response.

This response message can be decoded to reveal information about the server, such as: **NetBIOS**, **DNS**, and **OS build** version information:
```text
Target_Name: DEMO
NetBIOS_Domain_Name: DEMO
NetBIOS_Computer_Name: SRV01
DNS_Domain_Name: demo.local
DNS_Computer_Name: srv01.demo.local
DNS_Tree_Name: demo.local
Product_Version: 6.3.9600
```


## Impact
During a penetration test this can be used to identify internal naming conventions, determine end-of-life operating systems, and discover internal DNS names. 

To describe one potential use-case for this data, the domain suffix, found in the decoded response, can aid in password spraying attacks against an organization’s Outlook Web Application (OWA). Targeting OWA is a common technique used by hackers to identify valid domain credentials and could lead to further attacks.
![](/images/posts/ntlm-info/owa_login.png)

Although not the most prestigious vulnerability, if found against a bug bounty target, you may be able to leverage this internal disclosure for a few quick points:
![](/images/posts/ntlm-info/ntlm_bounty.png)


## Exploitation in HTTP(S)
Typically, when visiting a website or directory requiring privileged access, the server will initiate a login prompt. This allows the client to send blank username/password values to check for NTLM authentication and receive the encoded response.

However, if the target is configured to allow Windows authentication, it may be possible to invoke this response without a login prompt. This can be done by adding the following line to the HTTP request headers:
```text
Authorization: NTLM TlRMTVNTUAABAAAAB4IIAAAAAAAAAAAAAAAAAAAAAAA=
```

![](/images/posts/ntlm-info/http_req.png)

Once an NTLM challenge is returned through the `WWW-Authenticate` response header, it can be decoded to capture internal information. I personally use Burp’s NTLM Challenge Decoder, but multiple other scripts have been written that can perform these actions.
![](/images/posts/ntlm-info/ntlmssp_decode.png)


## Alternate Protocols
Few may know the trick of adding the `Authorization` header to prompt a response from the server over HTTP(S), but this exposure can be found in alternate protocols as well.

Using Telnet we can interact with other services, outside the browser, to force an NTLM challenge response and achieve this same information exposure.

### SMTP
```bash
root@kali: telnet example.com 587
220 example.com SMTP Server Banner

>> HELO
250 example.com Hello [x.x.x.x]

>> AUTH NTLM
334 NTLM supported

>> TlRMTVNTUAABAAAAB4IIAAAAAAAAAAAAAAAAAAAAAAA=
334 TlRMTVNTUAACAAAACgAKADgAAAAFgooCBqqVKFrKPCMAAAAAAAAAAEgASABCAAAABgOAJQAAAA9JAEkAUwAwADEAAgAKAEkASQBTADAAMQABAAoASQBJAFMAMAAxAAQACgBJAEkAUwAwADEAAwAKAEkASQBTADAAMQAHAAgAHwMI0VPy1QEAAAAA
```


### IMAP
```bash
root@kali: telnet example.com 143
* OK The Microsoft Exchange IMAP4 service is ready.

>> a1 AUTHENTICATE NTLM
+

>> TlRMTVNTUAABAAAAB4IIAAAAAAAAAAAAAAAAAAAAAAA=
+ TlRMTVNTUAACAAAACgAKADgAAAAFgooCBqqVKFrKPCMAAAAAAAAAAEgASABCAAAABgOAJQAAAA9JAEkAUwAwADEAAgAKAEkASQBTADAAMQABAAoASQBJAFMAMAAxAAQACgBJAEkAUwAwADEAAwAKAEkASQBTADAAMQAHAAgAHwMI0VPy1QEAAAAA
```


## Nmap Scripting
NTLM authentication can be found embedded in alternate application protocols such as: `HTTP`, `SMTP`, `IMAP`, `POP3`, `RDP`, `MS-SQL`, `NNTP`, and `TELNET`. As such, they may also be susceptible to this type of disclosure on offensive security engagements.

To help automate the search, NMAP has several built-in NSE scripts to easily find this vulnerability:
```text
http-ntlm-info.nse
imap-ntlm-info.nse
ms-sql-ntlm-info.nse
nntp-ntlm-info.nse
pop3-ntlm-info.nse
rdp-ntlm-info.nse
smtp-ntlm-info.nse
telnet-ntlm-info.nse
```

Through the `--script=*-ntlm-info` argument we can apply all checks against a given host, which will prioritize execution based on open ports identified:
```bash
root@kali: nmap -sS -v --script=*-ntlm-info --script-timeout=60s example.com

Nmap scan report for x.x.x.x
Host is up (0.0063s latency).
Not shown: 998 filtered ports
PORT     STATE SERVICE
80/tcp   open  http
| http-ntlm-info:
|   Target_Name: IIS01
|   NetBIOS_Domain_Name: IIS01
|   NetBIOS_Computer_Name: IIS01
|   DNS_Domain_Name: IIS01
|   DNS_Computer_Name: IIS01
|_  Product_Version: 6.3.9600
```


## Defensive Measures
The recommended remediation for this vulnerability is to disable NTLM authentication over HTTP in the IIS Manager. Restricting public access to the ports utilizing Windows authentication is another approach to containing the exposure and will help to prevent brute-force attacks against the service.

### References and Additional Resources:
* [http://davenport.sourceforge.net/ntlm.html](http://davenport.sourceforge.net/ntlm.html)
* [https://docs.microsoft.com/en-us/windows/win32/secauthn/microsoft-ntlm](https://docs.microsoft.com/en-us/windows/win32/secauthn/microsoft-ntlm)
* [https://github.com/AonCyberLabs/Nmap-Scripts/tree/master/NTLM-Info-Disclosure](https://github.com/AonCyberLabs/Nmap-Scripts/tree/master/NTLM-Info-Disclosure)
* [https://blog.gdssecurity.com/labs/2014/2/12/http-ntlm-information-disclosure.html](https://blog.gdssecurity.com/labs/2014/2/12/http-ntlm-information-disclosure.html)

