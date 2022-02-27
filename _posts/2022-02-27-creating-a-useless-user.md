---
title:  "Creating a *Useless* User"
date:   2022-02-27 16:40:00 +0300
tags:  linux permissions privileges 
---
## Story
In my [previous post]({% post_url 2022-02-27-ssh-into-machine-that-is-behind-private-network %}), I explained how to do port forwarding to access some machine behind private network. I will use this method to fix some issues in our desktop at home or my girlfriend's computer. Now, of course I don't want to give them access to my server. But they also need to have a user in my server to be able to perform port forwarding via ssh. So I wanted to create a user with least privileges to make sure nothing goes wrong.

## The solution
I searched the problem in it turned out to be very simple. You just need to add two additional flags to `adduser` command while creating the user.
```bash
sudo adduser uselessuser --shell=/bin/false --no-create-home
```
Now, `uselessuser` can't do anything useful in your server. If they try to login, the connection will be closed immediately.
```bash
❯ ssh uselessuser@remote.host
uselessuser@remote.host\'s password:
Could not chdir to home directory /home/uselessuser: No such file or directory
Connection to remote.host closed.
```
But they can still do forward the remote port to their local machine.
```bash
❯ ssh -Nf -R 7777:localhost:22 uselessuser@remote.host
uselessuser@remote.host\'s password:
```
The `-N` option is the most important one here. From the documentation:
>      -N   Do not execute a remote command.  This is useful 
          for just forwarding ports.   Refer to the description 
          of SessionType in ssh_config(5) for details.

## Last words
I love learning new things everyday. I knew setting the shell of a user to `/bin/false` will prevent them from logging in. The reason I wrote this blog post is because 2 things I wanted to share:
- While looking for a solution to the problem I mentioned, I searched *"create a user with no privileges in linux"* and [this](https://askubuntu.com/questions/1174376/how-to-create-a-user-with-the-least-privileges-permissions-but-enough-to-do-ssh) came out. It is really interesting for me that another person wanted to do the same thing for the *exact same reasons*. They were also trying port forwarding via ssh and they wanted to create a limited user in their server to give friends. So the question was a **perfect fit**  to the problem.
- The `-N` flag of the ssh command was also surprising for me. It was like as if someone had encountered these problems before and just took the exact steps required to solve this problem for me. I mean look at the documentation. Crazy!

