---
# Post Settings
title: "Hacking Organizations One Document at a Time With Metadata"
date: "2021-02-03"

tags: ["osint", "recon"]
categories: ["blog"]
draft: false
toc: false

# Override default meta tags
noindex: false
author: false
description: ""
---

Metadata is simply defined as data about data. In computer systems, this is used to correctly interpret files and store descriptive attributes. While not always visible, metadata provides far more information than content creators realize. Once a document and containing metadata is made public, it could unknowingly help an attacker infiltrate your organization.

As a penetration tester, I am often given a week to target a client’s public facing environment with the goal of breaching their internal network. This form of testing allows the client to evaluate the effectiveness of their defensive solutions, assess the security team’s response to simulated threat activity, and identify vulnerabilities for remediation. However, with only one week and zero preexisting knowledge, this can be a daunting task.


## In comes metadata!
The first step in penetration testing, or any offensive security engagement, is reconnaissance. Learning how your target operates. This includes everything from the software they use to their user account naming convention. All of which can be leveraged in subsequent attacks.

Metadata is a go-to source for this information and is easily overlooked during a company’s publishing process. Once posted on their website, or another public forum, it is possible to download the file and extract critical information using utilities such as Phil Harvey’s [ExifTool](https://exiftool.org/). This is a platform-independent application written in Perl that can be used to read, write, and edit meta information in a variety of file types.

![](/images/posts/hacking-with-metadata/metadata_1.png)
*Image depicting the types of information that can be extracted from metadata.*


## 
This process can be simplified even further with tools such as [PyMeta](https://github.com/m8sec/pymeta), which uses search engine scraping to automatically find public documents released by an organization. Once found, it will download the files and create a neatly formatted report of the extracted metadata.

![](/images/posts/hacking-with-metadata/metadata_2.png)
*Partial PyMeta report from a popular domain-wide bug bounty program.*

Information such as user account naming conventions can be applied to generate a list of users for brute-forcing or social engineering style attacks. This data can also be used to make inferences about the environment or craft custom payloads based on the operating system(s), software, or application versions found.


## What can we do about this?
Metadata can be removed in Microsoft Office through modifying the document properties and enabling [personal information removal](https://support.microsoft.com/en-us/office/remove-hidden-data-and-personal-information-by-inspecting-documents-presentations-or-workbooks-356b7b5d-77af-44fe-a07f-9aa4d085966f) in the privacy settings.

![](/images/posts/hacking-with-metadata/metadata_3.png)

Depending on the technologies employed by an organization, third party tools or plugins may exist to strip metadata during the upload process. Otherwise, this removal can also be done at the operating system level via File Explorer.


## Wrapping it up
Using metadata to target organizations has been around for years. However, it remains an unrealized point of information for defenders that is still heavily leveraged by attackers today.

