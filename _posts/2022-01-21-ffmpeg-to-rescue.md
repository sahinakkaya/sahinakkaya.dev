---
title:  "Using ffmpeg for Simple Video Editing"
date:   2022-01-21 23:40:00 +0300
tags: cli ffmpeg
classes: wide
excerpt: 
---

## Story
Today, I have recorded a video for one of my classes and I was required to upload it till midnight. The video was perfect except for a few seconds where I misspelled some words and started again. I had to remove that part from the video before uploading it. Since I was low on time, I thought that I better use a GUI program to do this job. I opened up [Kdenlive](https://kdenlive.org/en/) and jumped into editing my video. It was my first time using it so I spent some time to cut and delete the parts that I want to get rid of. When I was ready, I clicked Render button to render my video. It was waaay too slow than I expected. Since I have nothing to do while waiting for render to finish, I thought I could give `ffmpeg` a shot.

## Let the show begin
 Like Kdenlive, I have never used `ffmpeg` before. Like every normal Linux user do, I opened up a terminal and typed `man ffmpeg` to learn how to use it... Just kidding :D I opened a browser and typed *"ffmpeg cut video by time"*. Not the best search query, but it was good enough to find what I am looking for as the [first result](https://stackoverflow.com/questions/18444194/cutting-the-videos-based-on-start-and-end-time-using-ffmpeg). 

### Cutting the videos based on start and end time
 According to answers on the page I mentioned, I run the following commands to cut my video into two parts:
 ```bash
ffmpeg -ss 00:00:00 -to 00:01:55  -i input.mov -c copy part1.mp4 # take from 00:00 to 01:55
ffmpeg -ss 00:02:03 -to 00:05:17  -i input.mov -c copy part2.mp4 # take from 02:03 to 05:17
 ```

 These two commands run **instantly**! Kdenlive was still rendering... The progress was 46%. Meh... I said "Duck it, I am gonna use ffmpeg only" and cancelled the rendering.

### Concatenating the video files
 Now we have two videos that we want to join. Guess what will be our next search query? *"ffmpeg join videos"*. And [here](https://stackoverflow.com/questions/7333232/how-to-concatenate-two-mp4-files-using-ffmpeg) is the first result:

 ```bash
echo file part1.mp4 >> mylist.txt
echo file part2.mp4 >> mylist.txt
ffmpeg -f concat -i mylist.txt -c copy result.mp4
 ```

And we are DONE! How easy was that? Whole process took about 10 minutes including my search on the internet. If I continued waiting for Kdenlive to finish rendering, I would probably be still waiting at that time. I love the power of command line!
