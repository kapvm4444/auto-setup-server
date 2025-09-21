#!/bin/bash
set -e

# --- Color Definitions ---
# Defines variables for different colors to make output readable.
# The \\033[ is the escape code, followed by a color code.
# NC (No Color) resets the text back to default.
RED='\e[31m'
GREEN='\e[32m'
YELLOW='\e[33m'
BLUE='\e[34m'
NC='\e[0m' # No Color

#-> --- STAGE 1: BOOTSTRAP ---
echo -e "${BLUE}======== Temporarily installing Node.js for Navigation ========${NC}"
# All commands now print their full output to the screen.
apt-get update
apt-get install -y curl
echo -e "${YELLOW}Setting up Node.js repository...${NC}"
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -
echo -e "${YELLOW}Installing Node.js and npm...${NC}"
apt-get install -y nodejs
echo -e -n "${YELLOW}Installed Node.js version ${NC}"
node -v
echo -e ""

# Go to the script directory to install inquirer
cd /tmp/
echo -e "${YELLOW}Installing Dependencies...${NC}"
npm install

#-> ======== STAGE 2: EXECUTE INTERACTIVE SCRIPT ========
echo -e "${BLUE}======== Starting Setup ========${NC}"
# This command runs the main interactive script.
node setup.js

#-> ======== STAGE 3: CLEANUP ========
echo -e "${BLUE}======== Finalizing Setup & Cleaning Up ========${NC}"

# Check if the user chose to keep Node.js.
if grep -q "Node.js (Keep Installed)" /tmp/setup_choices.txt; then
    echo -e "${GREEN}Node.js was selected for installation. Keeping it.${NC}"
else
    echo -e "${YELLOW}Node.js was not selected. Uninstalling it for a clean server...${NC}"
    # The 'purge' command completely removes a package and its configuration files.
    apt-get purge --auto-remove -y nodejs
    # Remove the Node.js repository source list to keep the system clean.
    rm -f /etc/apt/sources.list.d/nodesource.list
    echo -e "${GREEN}Node.js has been successfully uninstalled.${NC}"
fi

# Deletes the temporary file that stored the user's choices.
rm -f /tmp/setup_choices.txt

# Clean up temporary npm files
rm -rf /tmp/node_modules
rm -f /tmp/package-lock.json

echo -e "${GREEN}======== Master Script Finished ========${NC}"
