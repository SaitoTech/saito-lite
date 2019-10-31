#How to work in a branch when developing a Saito Module

## Install Satio

tl:dr

* ```git clone <path to saito>```
* ```cd <saito folder>```
* ```npm install```

if not on loclhost update ./config/options with the ip/server name of your server

* ```npm run compile```
* ```npm start```

You can then test this is working at:
* ```localhost:12101``` (if you made not changes)
  or
* ```<ip address>:12101``` or alternate if you changed the port in config

## Putting your module in place

### Branch the whole codebase
```git branch myBranch```
```git checkout myBranch```


This does not change anything in the code - just tells git you are working in a branch.

### Add your module

Create a folder ```myModule``` in ```mods``` directory or copy in your module.

Edit ```lib/saito/modules.js``` to include the path to your module. \
(Just cheat and copy a row for another module changing the names.)

Now you can begin coding!

## Sharing your work for review or help.

Push your changes into the branch:

* ```git add .``` so that the whole repository is included.
* ```git commit -m 'useful commit message about what is needed'```
* ```git push`` (you may be instructed to ``git push --origin branchname``` if you are - do that.)

Contact the person who you want to show, or get help from.

They can then swap to that branch and pull 'the whole stack' so they can get directly to debugging or reviewing what you have suggested.

If it is good code we want to add to the repository - they might ask you to submit it as a pull request. 

Or, to push your good code into a new repo for inclusion as a stand alone module.

