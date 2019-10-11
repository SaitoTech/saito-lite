# Install Saito

## Dependencies
- Python 2.x

## Server Configuration (pre-install)

You should have a server with at least 2 GB of RAM and a reasonably 
up-to-date version of NodeJS and NPM installed. If you are setting
up a new server, we recommend using Ubuntu, which can be configured
to work out-of-the-box with Node v9 as follows:
```
apt-get update
apt-get install g++ make
curl -sL https://deb.nodesource.com/setup_9.x | sudo -E bash -
sudo apt-get install -y nodejs
```


## Step 1 - Install NodeJS Dependencies

```
npm install
```

If you run into any problems at this point please write us and let us
know and we'll figure out the problem and update this file. Otherwise
you should be ready to run Saito.



## Step 2 - Compile Saito

Prepare the software for running the first time:

```
npm run nuke
```
This will "compile" the software, including the scripts that are fed-out
to browsers that connect to your machine. Once it is complete, you can 
run the software:


## Step 3 -- Run Saito

```
npm start
```

If you have made no configuration changes, you can connect to your local
Saito server at:

http://localhost:12101/






