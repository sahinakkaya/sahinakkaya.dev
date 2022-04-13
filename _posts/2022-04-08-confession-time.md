---
title:  "Confession Time"
date:   2022-04-08 18:46:00 +0300
last_modified_at: 2022-04-13
tags:  ssl
---

## A failure story
Last week, I received an email from [Let's Encrypt](https://letsencrypt.org/) reminding me to renew my certificates. I forgot to renew it and the certificate expired. Now I can't send or receive any emails. If you send me email in the last week and wonder why I didn't respond, this is the reason. 

Anyway, I thought it will be easy to fix. Just run `certbot` again and let him do the job, right? NOPE. It is not that easy. It is just giving me errors with some success messages. If I was not so clueless about what the heck I am doing, I could fix the error. But I don't know anything about how SSL works and it is a shame. 

I don't even know the subject enough to Google it. I feel like I am the only guy in the planet whose certificate is expired. Seriously, how tf I can't find a solution to a such common problem? There was a saying like, *"If you can't find something on the internet, there is a high chance that you are being stupid"*. It was not exactly like this but I can't find the original quote either. Argghh...

If you know the original quote, email me... No, do not email because it does not work. F%ck this thing. F*%k everything. I deserved this. Do not help. If I can't fix this by myself, I should not call myself computer engineer. I am out.


### **Update**
The problem is fixed. One of my colleagues told me to reboot the server so that it will (*possibly*) trigger a script to get a new certificate. I did not think it would work because I already try to get a new certificate manually running `certbot renew`. And yeah, it didn't change anything but gave me courage to try other *dead simple* solutions.

- One of them was adding missing MX records for my domain. `certbot` was telling me that it can't find any `A` or `AAAA` records for `www.mail`. I didn't think this is related with my problem because how would I receive emails before then? Anyway, I added the records and the errors are gone. It was only giving me success messages now. Everything seemed to be fine. But I still could not connect to my mail account.

- And here is the solution: `sudo systemctl restart dovecot`. Kill me. I am *guessing* I had to restart the mail service because certificate has changed and it had to pick up the new one. I bet if I had run this command right after `certbot renew` I would not face any issues. The error messages caused by missing mx records were not related with this problem but I was confused by them and I thought something wrong with my certificates. 

Any way, I am happy that it is finally fixed. Did I learn something from this? Not much. But yeah, sometimes all you need is a simple restart :D

