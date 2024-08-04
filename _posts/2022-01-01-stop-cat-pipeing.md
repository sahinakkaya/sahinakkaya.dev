---
title:  "Stop cat-pipe'ing, You Are Doing It Wrong!"
date:   2022-01-01 18:00:00 +0300
classes: wide
tags: cat grep linux command-line
---
```bash
cat some_file | grep some_pattern
```
I'm sure that you run a command something like above at least once if you are using terminal. You know how `cat` and `grep` works and you also know what pipe (`|`) does. So you naturally combine all of these to make the job done. I was also doing it this way. What I didn't know is that `grep` already accepts file as an argument. So the above command could be rewritten as:
```bash
grep some_pattern some_file
```

... which can make you save a few keystrokes and a few nanoseconds of CPU cycles. Phew! Not a big deal if you are not working files that contains GBs of data, right? I agree but you should still use the latter command because it will help you solve some other problems better. Here is a real life scenario: You want to search for some specific pattern in all the files in a directory. 

- If you use the first approach, you may end up running commands like this:

```bash
❯ ls
 config.lua   Git.lua          init.lua   markdown.lua   palette.lua      util.lua
 diff.lua     highlights.lua   LSP.lua    Notify.lua     Treesitter.lua   Whichkey.lua

❯ cat config.lua | grep light
❯ cat diff.lua | grep light
❯ cat Git.lua | grep light
❯ cat highlights.lua | grep light
  Pmenu = { fg = C.light_gray, bg = C.popup_back },
  CursorLineNr = { fg = C.light_gray, style = "bold" },
  Search = { fg = C.light_gray, bg = C.search_blue },
  IncSearch = { fg = C.light_gray, bg = C.search_blue },

❯ cat init.lua | grep light
local highlights = require "onedarker.highlights"
  highlights,
❯ # You still have a lot to do :/
```

- If you use the second approach, you will immediately realize that you can send all the files with `*` operator and you will finish the job with just one command (2 if you include mandatory `ls` :D):

```bash
❯ ls
 config.lua   Git.lua          init.lua   markdown.lua   palette.lua      util.lua
 diff.lua     highlights.lua   LSP.lua    Notify.lua     Treesitter.lua   Whichkey.lua

❯ grep light *
highlights.lua:  Pmenu = { fg = C.light_gray, bg = C.popup_back },
highlights.lua:  CursorLineNr = { fg = C.light_gray, style = "bold" },
highlights.lua:  Search = { fg = C.light_gray, bg = C.search_blue },
highlights.lua:  IncSearch = { fg = C.light_gray, bg = C.search_blue },
init.lua:local highlights = require "onedarker.highlights"
init.lua:  highlights,
LSP.lua:  NvimTreeNormal = { fg = C.light_gray, bg = C.alt_bg },
LSP.lua:  LirFloatNormal = { fg = C.light_gray, bg = C.alt_bg },
markdown.lua:  markdownIdDelimiter = { fg = C.light_gray },
markdown.lua:  markdownLinkDelimiter = { fg = C.light_gray },
palette.lua:  light_gray = "#abb2bf",
palette.lua:  light_red = "#be5046",
util.lua:local function highlight(group, properties)
util.lua:    "highlight",
util.lua:    highlight(group, properties)
```

Isn't this neat? You might say that *"This is cheating! You are using a wild card, of course it will be easier."* Well, yes. Technically I could use the same wild card in the first command like `cat * | grep light` but:
- I figured that out only after using wild card in the second command. So I think it is does not feel natural.
- It is still not giving the same output. Try and see the difference! [*](## "You will not be able to see which file contains which line. 'cat' will just concatenate all the input.")
