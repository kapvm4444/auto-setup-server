# Setup Instructions

Use following commands in your new born server to start the script

## Commands

---

### Run all steps at once

If you prefer, you can run all the above commands together:

```bash
wget -O /tmp/init.sh --no-cache https://raw.githubusercontent.com/kapvm4444/auto-setup-server/main/init.sh && \
wget -O /tmp/setup.js --no-cache https://raw.githubusercontent.com/kapvm4444/auto-setup-server/main/setup.js && \
wget -O /tmp/package.json --no-cache https://raw.githubusercontent.com/kapvm4444/auto-setup-server/main/package.json && \
chmod +x /tmp/init.sh && \
sudo /tmp/init.sh
```
---

Sometimes, encountering error:
```bash
E: Could not get lock /var/lib/apt/lists/lock. (Held by another process.)
```
then use this command to stop the process and run my script again.
```bash
sudo service packagekit restart
```

---

Run each command one by one (if needed) :

##### 1. Download the master setup script
```bash
wget -O  /tmp/init.sh --no-cache https://raw.githubusercontent.com/kapvm4444/auto-setup-server/main/init.sh
```

##### 2. Download the interactive setup script
```bash
wget -O /tmp/setup.js --no-cache https://raw.githubusercontent.com/kapvm4444/auto-setup-server/main/setup.js
```

##### 3. Get the package.json for dependencies
```bash
wget -O /tmp/package.json --no-cache https://raw.githubusercontent.com/kapvm4444/auto-setup-server/main/package.json
```

##### 4. Make the master setup script executable
```bash
chmod +x /tmp/init.sh
```

##### 5. Run the master setup script with sudo
```bash
sudo /tmp/init.sh
```


