---
title:  "Hot-Reload Long Running Shell Scripts (feat. trap / kill)"
date:   2023-01-16 00:48:08 +0300
tags:  trap kill linux
---

## `trap` them and `kill` them!
There is a beautiful command in Linux called [`trap`](https://man7.org/linux/man-pages/man1/trap.1p.html) which *trap*s signals and let you run specific commands when they invoked. There is also good ol' [`kill`](https://man7.org/linux/man-pages/man1/kill.1.html) command which not only kills processes but allows you to specify a signal to send. By combining these two, you can run specific functions from your scripts any time!


### Basic Example
Let's start by creating something very simple and build up from there. Create a script with the following contents:

```bash
#!/bin/bash

echo "My pid is $$. Send me SIGUSR1!"

func() {
  echo "Got SIGUSR1"
}

# here we are telling that run 'func' when USR1 signal is
# received. You can run anything. Combine commands with ; etc.
trap "func" USR1

# The while loop is important here otherwise our script will exit
# before we manage to get a chance to send a signal.
while true ; do
    echo "waiting SIGUSR1"
    sleep 1
done
```
Now make it executable and run it:
```bash
❯ chmod +x trap_example
❯ ./trap_example
My pid is 2811137. Send me SIGUSR1!
waiting SIGUSR1
waiting SIGUSR1
waiting SIGUSR1
waiting SIGUSR1
waiting SIGUSR1
```

Open another terminal and send your signal with `kill` to the specified pid.
```bash
❯ kill -s USR1 2811137
```

You should receive `"Got SIGUSR!"` from the other process. That's it! Now, imagine you write whatever thing you want to execute in `func` and then you can simply `kill -s ...` anytime and as many times you want!

Let's move the while loop into the `func` and add some variables so you can see how powerful this is.
```bash
#!/bin/bash

echo "My pid is $$. Send me SIGUSR1!"

func() {
    i=1
    while  true ; do
        echo "i: $i"
        i=$(( i + 1 ))
        sleep 1
    done
}

trap "echo 'Got SIGUSR1!'; func" USR1

# we need to call the function once, otherwise script
# will exit before we manage to send a signal
func

```

Now run the script and send `SIGUSR1`. Here is the result:
```bash
❯ ./trap_example
My pid is 2880704. Send me SIGUSR1!
i: 1
i: 2
i: 3
i: 4
i: 5
i: 6
i: 7
Got SIGUSR1!
i: 1
i: 2
i: 3
i: 4
i: 5
Got SIGUSR1!
i: 1
i: 2
^C
```

Isn't this neat?

### More useful example

Let's imagine you have multiple long running (infinite loops basically) scripts and you want to restart them without manually searching for their pid's and killing them. `trap` is for the rescue, again! <sup>[*](## "Yeah, I know you can run a systemd service if you want but I think it is an overkill for this situation. Plus, I don't like dealing with them.")</sup> This command is awesome.

Without further ado, let's get started. Create a script called `script1` with the following contents:

```bash
#!/bin/bash
# file: script1

i=1
while  true ; do
    echo "Hello from $0. i is $i"
    i=$(( i + 1 ))
    sleep 1
done
```

And symlink it to another name just for fun:
```bash
❯ chmod +x script1
❯ ln -s script1 script2
```

Now we can pretend they are two different scripts as their outputs differ:
```bash
❯ ./script1
Hello from ./script1. i is 1
Hello from ./script1. i is 2
Hello from ./script1. i is 3
Hello from ./script1. i is 4
^C
❯ ./script2
Hello from ./script2. i is 1
Hello from ./script2. i is 2
Hello from ./script2. i is 3
^C
```

Finally, create the main script which will start child scripts and restart them on our signals:

```bash
#!/bin/bash
echo "My pid is $$. You know what to do  ( ͡° ͜ʖ ͡°)"
echo "You can also send me signal with 'killall `basename $0` ...'"

pids=() # we will store the pid's of child scripts here
scripts_to_be_executed=("./script1" "./script2")

kill_childs(){ # wow, this sounded wild
    for pid in "${pids[@]}"
    do
      echo killing "$pid"
      kill "$pid"
    done
    pids=()
}

# kill childs and restart all the scripts
restart_scripts(){
    kill_childs
    # for each script in the list
    for script in "${scripts_to_be_executed[@]}"
    do
        # run the script and store its pid.
        # '&' at the end of command is important otherwise
        # the script will block until its execution is finished.
        $script &
        pid=$!
        pids+=("$pid")
    done
}

# we will restart_scripts with SIGUSR1 signal
trap 'echo "restarting scripts"; restart_scripts' USR1

# we will kill all the childs and exit the main script with SIGINT
# which is same signal as when you press <Control-C> on your terminal
trap 'echo exiting; kill_childs; exit' INT

# run the function once
restart_scripts

# infinite loop, otherwise main script will exit before we send signal.
# remember, we started child processes with '&' so they won't block this script
while true; do
  sleep 1
done
```

Now, you can run your main script and reload your child scripts any time with `killall main_script -USR1`

Here is an example run:
```
❯ ./trap_multiple
My pid is 3124123. You know what to do  ( ͡° ͜ʖ ͡°)
You can also send me signal with 'killall trap_multiple ...'
Hello from ./script1. i is 1
Hello from ./script2. i is 1
Hello from ./script2. i is 2
Hello from ./script1. i is 2
Hello from ./script2. i is 3
Hello from ./script1. i is 3
restarting scripts
killing 3124125
killing 3124126
Hello from ./script1. i is 1
Hello from ./script2. i is 1
Hello from ./script2. i is 2
Hello from ./script1. i is 2
Hello from ./script2. i is 3
Hello from ./script1. i is 3
Hello from ./script2. i is 4
Hello from ./script1. i is 4
restarting scripts
killing 3124304
killing 3124305
Hello from ./script1. i is 1
Hello from ./script2. i is 1
Hello from ./script1. i is 2
Hello from ./script2. i is 2
^Cexiting
killing 3124875
killing 3124876
```


### Final words
I think I am started to getting obsessed with `trap` command because it has such a good name and purpose. FOSS people are really on another level when it comes to naming. Here is another good one:

> \- How can you see the contents of a file?  <br>
\+ You *`cat`* it.  <br>
\- What if you want to see them in reverse order?  <br>
\+ You *`tac`* it.  <br>

No, it is not just a joke. Try it... Man I love Gnoo slash Linux.

Anyway, I hope now you know how to `trap` and `kill`. Next week I will explain how to `unzip; strip; touch; finger; grep; mount; fsck; more; yes; fsck; fsck; umount; clean; sleep` <nobr>( ͡° ͜ʖ ͡°)</nobr>. <sup>[*](## "jk :D")</sup>
