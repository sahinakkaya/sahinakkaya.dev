---
title:  "SSH into Machine That Is Behind a Private Network"
date:   2022-02-27 00:40:00 +0300
tags:  ssh private-network remote-port-forwarding
---

## Story
I believe there is always a "tech support person" in every home. Everyone knows that when there is a problem with any electronic device, they should ask this person. I am the tech support in our house. Today, I had to fix a problem in our desktop. Since I was not at home, I had to fix the problem remotely. 

## Possible solutions
- Just tell the non-tech people at home to configure the router to forward ssh traffic to desktop, right? Well, this is not an option for me, not because people are non-tech, but there is no router! The desktop is connected to internet via hotspot from mobile phone. There is no root access in the phone and even if there was, it is a really big pain to forward the packets manually. Trust me. Been there, done that!

- There are tools like [ngrok](https://www.ngrok.com), [localtunnel](localtunnel.me) which exposes your localhost to the internet and gives you a URL to access it but I did not want to use them. 
  - I did not want to use `ngrok` because it is not open source and it might have security issues. They are also charging you. 
  - `localtunnel` seemed perfect. The code of both client and server is open. That is great news! But it did not last long because it is just forwarding http/https traffic :(

## Solution
I was thinking of extending the functionality of `localtunnel`, but I learned a very simple way. You don't need any external program to overcome this issue. The good old `ssh` can do that! All you need is another machine (a remote server) that both computers can access via ssh. 

```bash
# local machine (my home computer)
ssh -R 7777:localhost:22 remote-user@remote.host
```
This command forwards all the incoming connections to port 7777 of remote machine to port 22 of our current machine. In order for this to work, you need to make sure `GatewayPorts` is set to `yes` in the remote server ssh configuration. It also assumes our current machine accepts ssh connections via port 22.

--- 
Now, go to any machine and connect to the remote server first. When we are connected, we will create another ssh connection to port 7777 to connect our home computer.
```bash
# another local machine (my laptop)
ssh remote-user@remote.host

# connected remote
ssh -p 7777 homeuser@localhost 
# we are now connected to home computer
```

The last two command can also combined so that we directly hop into the home computer.
```bash
ssh -t remote-user@remote.host ssh -p 7777 homeuser@localhost 
```

### Result
As a result, it only took us 2 simple ssh commands to do this. This is just unbelievable! Now, I need to find a way to make non-tech people at home run this command when there is a problem. Too bad Linux can't help me there :D

