ERROR

Playing VETO (not in response to anything) - bugs out

```
imperium.js?41c4:3108 Uncaught (in promise) ReferenceError: laws is not defined
    at Object.playActionCard (imperium.js?41c4:3108)
    at Imperium.handleGameLoop (imperium.js?41c4:9454)
    at Imperium.runQueue (gametemplate.js?7c65:1734)
    at Imperium.handleGameMove (gametemplate.js?7c65:514)
    at Imperium._callee3$ (gametemplate.js?7c65:2296)
    at tryCatch (runtime.js?f3a2:65)
    at Generator.invoke [as _invoke] (runtime.js?f3a2:303)
    at Generator.prototype.<computed> [as next] (runtime.js?f3a2:117)
    at asyncGeneratorStep (52:11)
    at _next (52:13)
```

* During ship movement - mark selected ships (and add cargo in brackets)
* During ship movement - allow undoing selection

* Only offer to move ships to activated sector if move is possible.

* Add card mouse over for action cards

* Show planet card popup over name when planets listed for invation
* Announce invasion success in HUD
* 