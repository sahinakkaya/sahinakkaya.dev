---
title:  "Never Get Trapped in Grub Rescue Again!"
date:   2022-03-03 03:46:00 +0300
tags:  linux grub partition uefi
---

Anytime I install a new system on my machine, I pray God for nothing bad happens. But it usually happens. When I reboot, I find myself in the "Grub rescue" menu and I don't know how to fix things from that point. 

I go into the live environment and run some random commands that I found on the internet and hope for the best. 

![me trying to fix grub](/assets/images/grub-rescue/random-bullshit.jpg)

What a nice way to shoot myself in the foot! But this time is different. This time, I f\*cked up so much that even the random commands on the internet could not help me. I was on my own and I needed to figure out what is wrong with my system. Let me tell you what I did:

I decided to install another OS just to try it in a real machine. I wanted to shrink one of my partitions to create a space for the new system. I run `fdisk /dev/sdb`, the very first message that it tells me was 
> `This disk is currently in use - repartitioning is probably a bad idea. It's recommended to umount all file systems, and swapoff all swap partitions on this disk.`

Yes, it just screams ***"Do not do it!"*** but come on. I will not try to shrink the partition I am using (`sdb3`). So it should not be a problem. I ignored the message and shrink it anyway. No problem. Installed and tested the new OS a little bit. Time to reboot and hope for the best. And of course it did not boot. What would I even expecting? 

![ah sh\*t here we go again](/assets/images/grub-rescue/cj.png)



As always, I booted into a live environment and run `boot-repair` command. It was always working but this time... Even after finishing the operation successfully I could not boot into neither Arch nor Ubuntu (the two systems I had previously). 

Arch was originally mounted in `sdb3` and Ubuntu was `sda2`. Considering the fact that I only messed with `sdb`, I should be able to boot Ubuntu, right? Well, yeah. Technically I did boot into Ubuntu but I didn't see login screen. It was dropping me into something called "Emergency mode" which just makes me panic! `sudo update-grub`... Nope. Same thing. Arch does not boot and Ubuntu partially boots. 

Let me tell you what the problem was and how my ignorance made it worse:

- While installing the new system, I saw a partition **labelled** "Microsoft Basic Data". I deleted it thinking it is not required because I don't use W\*ndows. It turns out, it was my *boot* partition for Arch, just labelled incorrectly... Big lolz :D But we will see this is not even important because I had to rewrite my boot partition anyway.

- My Arch was installed in `sdb3`. When I created a new partition and installed the new system, `sdb3` was shifted to `sdb5` even though I did not ask for it. But the grub configuration to boot my system was still pointing to `sdb3`. That was the reason why Arch does not boot. It was trying to boot from `sdb3`. So I had to recreate grub configuration and reinstall grub to fix it. I run the following commands that I found [here](https://www.jeremymorgan.com/tutorials/linux/how-to-reinstall-boot-loader-arch-linux/) in a live Arch environment:
  ```bash
  mkdir /mnt/arch
  mount -t auto /dev/sdb5 /mnt/arch
  arch-chroot /mnt/arch
  mount -t auto /dev/sdb4 /boot/efi
  os-prober
  grub-mkconfig > /boot/grub/grub.cfg
  grub-install --efi-directory=/boot/efi --target=x86_64-efi /dev/sdb
  exit
  reboot
  ```

  And it fixed my grub. I can now boot into Arch, hooray! 


- Ubuntu was not still booting properly. I checked the logs with `journalctl -xb` and saw something related with `sdb`. Ubuntu was installed in `sda2`, why `sdb` should be a problem? Then I remembered something. Back in times when I was using Ubuntu, I was using `sdb1` as a secondary storage. So I had a configuration where it automatically mounts `sdb1` on startup. Since I messed with `sdb1` , it was failing to mount it. I opened `/etc/fstab`, and deleted the related line. Bingo! It started booting properly.

  ![i am something of a hackerman myself](/assets/images/grub-rescue/hackerman.jpg) 

- I started feeling like Hackerman, and I said to myself *"You know what, Imma fix everything."* I had a very sh\*tty grub menu with useless grub entries from old systems that I don't use anymore. The UEFI also had the same problem. It had ridiculous amount of boot entries that most of them are just trash.

  ![the pictures i took while trying to figure out which boot options are useless](/assets/images/grub-rescue/shitty-uefi.jpg) 

  These are the pictures I took for reference while trying to figure out which boot options are useless. Sorry for the bad quality. I didn't think I would use them in a blog post. 

  - While trying to fix the previous problems, I've spent enough time in the `/boot/efi` directory that make me understand where these grub entries are coming from. There were a lot of files belong to old systems. I simply deleted them and updated grub. All of the bad entries were gone. I want to draw your attention here: *I did not search for how to delete the unused grub entries. I just knew deleting their directories from `/boot/efi` will do. I am doing this sh\*t! (Another hackerman moment :D )*
  - In order to delete useless boot options from UEFI menu, I used `efibootmgr`. I searched for it on the internet, of course!
  ```bash
  efibootmgr -v # Check which entries you want to delete, say it is 0003.
  sudo efibootmgr -b 0003 -B # This will delete third boot option. 
  ```

And finally! I know everything about how all these work. Another shady part of Linux is clear for me. Now: 


![Give me a ruined computer and an Arch ISO, and I shall fix it for you.](/assets/images/grub-rescue/quote.jpg) 
