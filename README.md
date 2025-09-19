# Setup Instructions

Use following commands in your new born server to start the script

## Commands

Run each command one by one:

```bash
# 1. Download the master setup script
wget -O  /tmp/init.sh --no-cache https://raw.githubusercontent.com/kapvm4444/auto-setup-server/main/init.sh

# 2. Download the interactive setup script
wget -O /tmp/setup.js --no-cache https://raw.githubusercontent.com/kapvm4444/auto-setup-server/main/setup.js

# 3. Get the package.json for dependencies
wget -O /tmp/package.json --no-cache https://raw.githubusercontent.com/kapvm4444/auto-setup-server/main/package.json

# 4. Make the master setup script executable
chmod +x /tmp/init.sh

# 5. Run the master setup script with sudo
sudo /tmp/init.sh
