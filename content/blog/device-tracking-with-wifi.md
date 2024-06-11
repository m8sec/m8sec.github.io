---
# Post Settings
title: "Decoding the Airwaves: Tracking Device Movements With WiFi"
date: "2023-06-30"

tags: ["wireless", "aircrack-ng"]
categories: ["blog"]
draft: false
toc: false

# Override default meta tags
noindex: false
author: false
description: ""
---

One of the many rabbit holes I've gone down recently was the use of WiFi to track client devices. While this technique is not new by any means, I recall seeing [matt0177](https://twitter.com/matt0177)'s 2022 Blackhat USA [talk](https://i.blackhat.com/USA-22/Thursday/US-22-Edmondson-Chasing-Your-Tail.pdf) where he demonstrated using signal intelligence emitted from personal devices as a means of counter surveillance. This was the first practical application of device tracking I was exposed to and wanted to try taking this one step further for home use 📶.

My goal was to capture local wireless signals and create a secondary data point for alerts triggered by motion cameras and other home alarms. Best case scenario, this could provide information about the unwanted visitor's device (aka smartphone) such as:
* Unique MAC address for device tracking.
* Device manufacturer using [OUI lookups](https://www.wireshark.org/tools/oui-lookup.html).
* Recently connected access points via ESSID probes.


# How Does this Work?
The concept behind this is actually quite simple…

Many of our smartphones and mobile devices are set up perfectly for convenience. They unconsciously join our home networks, connect to our car's bluetooth automatically, and pickup our wireless headphones every-time.

*That said, how many people turn off their WiFi or disable bluetooth when leaving the house?*

Because of this, our phones are always emitting signals looking for known devices/networks. These wireless beacons can be intercepted and interpreted by anyone listening.

{{< figure src="/images/posts/device-tracking-with-wifi/img_1.png" class="center" >}}


# Hardware Requirements
For this project I used the following hardware:
* Raspberry Pi 4b
* Alfa Dual-Band wireless adapter


# Detecting Nearby Devices
I was hoping to modify an existing open source project or make use of the amazing Kismet toolset for proof-of-concept. However, for several reasons, I ended up creating a custom app called SignalSpy.

SignalSpy uses the aircrack-ng suite to monitor nearby devices and display the data in a neatly formatted web application. This information can be used to track signals in range, view connected devices of neighboring access points, and calculate [approximate](https://github.com/ANRGUSC/WirelessRangeEstimation) distance based on signal strength.

{{< figure src="/images/posts/device-tracking-with-wifi/img_2.png" class="center" >}}

## Custom Notifications
To make detection easier, device alerts can be configured based on mac address, distance, power, and occurrence — with optional Slack push notifications:

{{< figure src="/images/posts/device-tracking-with-wifi/img_3.png" class="center" >}}


# Success! 🏆
It took a few days to get the scan durations and alerts configured for my environment. Many of my initial issues were caused by the placement of the Raspberry Pi in relation to the areas I was trying to monitor.

In the end, I managed to successfully align the SignalSpy alerts with other security appliances. This was tested extensively with both my own devices and a few unplanned participants — thank you Amazon delivery 😃:

{{< figure src="/images/posts/device-tracking-with-wifi/img_4.png" class="center" >}}

Even in cases where smartphones utilized [Private WiFi](https://support.apple.com/guide/security/wi-fi-privacy-secb9cb3140c/web) for MAC address rotation, it was possible to extract access point names, or ESSID values, from client probe requests. This could allow unique names to be searched on site's such as [WiGLE](https://wigle.net/) to identify known locations and presumably the owner's home address.

{{< figure src="/images/posts/device-tracking-with-wifi/img_5.png" class="center" >}}


# Conclusion
Overall, the amount of data received from monitoring wireless frequencies was overwhelming — even in a somewhat rural setting. However, through normalizing and sorting this information, it was possible to successfully track device movements!

Pairing this data with other controls such as home security cameras, provided an easy way to get additional information on triggered events:

{{< figure src="/images/posts/device-tracking-with-wifi/img_6.png" class="center" >}}


# Dev Notes
So far, only 2.4GHz and 5GHz wireless frequencies were experimented. Incorporating additional short-range signals such as Bluetooth could provide alternate data points and increase accuracy of device tracking.

For those still wondering "why not Kismet?":
* I had concerns about the size of the database when trying to create a semi-permanent home solution running for extended periods of time.
* I spent time playing with `kismet_logging.conf` to reduce size and tried restarting the program to initiate a new `.kismet` database. However, I could never get the file size small enough and ran into wireless card issues when constantly resetting the Kismet daemon.
* Lastly, and most importantly, I ran out of time. If I continue development with SignalSpy, I want to dig into this more for Kismet's awesome data collection and default compatibility with Bluetooth, GPS, and more!
