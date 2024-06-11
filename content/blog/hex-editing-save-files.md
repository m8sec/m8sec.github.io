---
# Post Settings
title: "Game Hacking: Hex Editing Save Files for Unlimited Cash"
date: "2023-08-10"

tags: ["reversing"]
categories: ["blog"]
draft: false
toc: false

# Override default meta tags
noindex: false
author: false
description: ""
---

![](/images/posts/hex-editing-save-files/intro.png)

After creating a [Batocera](https://batocera.org/) live USB for retro gaming, I instantly started down the path of game hacking and researching how ROM’s (digital game copies) could be abused…

This post serves as my introduction to video game hacking through analyzing two saved states of Pokemon Red and hex editing targeted values for unlimited cash!

## Getting Setup (Level 1)
To start, I created a fresh [Ubuntu](https://ubuntu.com/) virtual machine and downloaded the GameBoy Emulator [BGB](https://bgb.bircd.org/) — executed using Wine. I tested a few emulators before settling on BGB for its built-in debugging capabilities.

Next, I started the target ROM and created a new game.

![](/images/posts/hex-editing-save-files/1.png)

Before entering the first mandatory battle scene, I saved the game with $3,000 and made a copy of the `.sav` file located in the current directory:

![](/images/posts/hex-editing-save-files/2.png)

After creating a copy of the initial save state, I went back into the game and completed the first battle scene changing my cash value to $3,175. Having all the required pieces in place, I saved the game one last time and closed the emulator.

![](/images/posts/hex-editing-save-files/3.png)

## Finding the Offset (Level 2)

Using the two `.sav` files, I used the `hexdump` and `diff` commands to identify differences between the files. With each file being exactly alike, the cash values `3000` vs `3175` should stand out.

The goal was to identify the offset, or location, of our player’s money in the saved state file. Once found, we can modify the value and restart the game with unlimited cash!

![](/images/posts/hex-editing-save-files/4.png)

Using [Bulbapedia](https://bulbapedia.bulbagarden.net/wiki/Save_data_structure_(Generation_I)), I looked up the saved data structures in Pokemon Generation 1 games and found that money is stored in the save file as a Binary Coded Decimal. This meant, it is always interpreted as decimal even if viewed as hexadecimal.

Therefore, we can identify the money offset by finding the location at which `30 00` is stored in file 1 and `31 75` is stored in file 2.

![](/images/posts/hex-editing-save-files/5.png)
*Note: saved data structures may not always be as straight forward in alternate variables or game files.*

## Changing the Save File (Level 3)

Now that the offset of our players cash was found at `0x25F3` we can visit this value in our active file and replace it with `9999`:

![](/images/posts/hex-editing-save-files/6.png)

At this point, I was excited to resume the game and see the new cash amount under my player’s profile. However, instead, the game indicated the save state was corrupt or destroyed ☠️

![](/images/posts/hex-editing-save-files/7.png)

## Defeating the Checksum (“Boss” Battle)

Researching the error a bit more, it turns out a checksum value is placed in each save file at `0x3523`. This is a one byte field, with 256 possible values, used to protect the integrity of the game data.

Luckily, the checksum implementation was very well [documented](https://bulbapedia.bulbagarden.net/wiki/Save_data_structure_(Generation_I)#Checksum). This made it possible to replicate with the following Python code, and write the correct checksum byte to our save file:

```python
import sys
with open(sys.argv[1], 'rb+') as f:
    sav = bytearray(f.read())
    checksum = 0xff
    for c in sav[0x2598:0x3523]:
        checksum -= c
    sav[0x3523]=checksum&0xff
    f.seek(0,0)
    f.write(sav)
    print("Checksum value updated: {}".format(checksum&0xff))
```

Now, when restarting the game, I was allowed to resume at the last saved position with the maximum money value allowed 🤑

![](/images/posts/hex-editing-save-files/8.png)

## Conclusion

Pokemon Red’s “money” value was a good proof-of-concept and introduction to game hacking. While variations may exist between alternate games and consoles, the overall technique of hex editing save files can be applied universally.
