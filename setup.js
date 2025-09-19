import { select, checkbox } from "@inquirer/prompts";
import { execSync } from "child_process";
import fs from "fs";
import readline from "readline-sync";

// --- Color Definitions for Node.js ---
// An object holding ANSI escape codes for different colors.
const colors = {
  Reset: "\x1b[0m",
  FgRed: "\x1b[31m",
  FgGreen: "\x1b[32m",
  FgYellow: "\x1b[33m",
  FgBlue: "\x1b[34m",
  FgCyan: "\x1b[36m",
};

// --- Helper Function to Run Commands ---
// This function now highlights the command it is about to run.
const runCommand = (command, description) => {
  let success = false;

  while (!success) {
    try {
      // Prints the description in blue.
      console.log(
        `\n${colors.FgBlue}--- Running: ${description} ---${colors.Reset}`,
      );
      // Prints the actual command in cyan for clarity.
      console.log(`${colors.FgCyan}COMMAND: ${command}${colors.Reset}`);
      // Runs the command, showing its live output in the terminal.
      execSync(command, { stdio: "inherit" });
      console.log(
        `${colors.FgGreen}--- SUCCESS: ${description} ---${colors.Reset}`,
      );
      success = true;
    } catch (error) {
      console.error(
        `${colors.FgRed}--- FAILED: ${description} ---${colors.Reset}`,
      );
      console.error(`${colors.FgRed}Error Message: ${error.message}`);

      const choice = readline.keyInSelect(
        ["Retry", "Skip", "Abort"],
        "What would you like to do? (Press 'Enter' or leave empty to Retry)",
      );

      if (choice === 1) {
        // Skip
        console.log("Skipping...");
        break; // Exit the loop and move to the next command
      } else if (choice === 2) {
        // Abort or user pressed Cancel
        console.log("Aborting setup.");
        process.exit(1); // Exit the entire script
      } else {
        // Retry
        console.log("Retrying...");
        continue; // The loop will run the command again
      }
    }
  }
};

const initialServerSetup = () => {
  runCommand("ufw allow OpenSSH", "Allow OpenSSH through firewall");
  runCommand("yes | ufw enable", "Enable the firewall");
  runCommand("ufw status", "See your enabled ");
  runCommand(
    "sudo apt-get update",
    "Update apache package manager - apt listing",
  );
};

// The main function that runs our entire setup
async function main() {
  console.clear();
  // Prints a welcome message in green.
  console.log(`${colors.FgGreen}====================================`);
  console.log("  Welcome to the Server Setup Tool  ");
  console.log(`====================================${colors.Reset}\n`);

  console.log(
    `${colors.FgCyan}==========  Starting Initial Server Setup  ==========${colors.Reset}`,
  );
  // run initial server setup commands
  initialServerSetup();

  // --- Interactive Prompts --- //OLD PACKAGE NOT RECOMMENDED
  /*const answers = await inquirer.prompt([
    {
      type: "list",
      name: "webserver",
      message: "Select a web server:",
      choices: ["Nginx", "Apache"],
    },
    {
      type: "list",
      name: "database",
      message: "Select a database:",
      choices: ["MySQL", "MongoDB", "None"],
    },
    {
      type: "checkbox",
      name: "tools",
      message: "Select languages and tools (spacebar to select):",
      choices: [
        "Node.js (Keep Installed)",
        "PHP & Composer",
        "Python 3 & pip",
        "Docker & Docker Compose",
        "Certbot (for SSL)",
        "None",
      ],
    },
  ]);*/

  //NEW VERSION OF INQUIRER
  //selecting webserver
  const webserver = await select({
    message: "Select a web server:",
    choices: [
      { name: "Nginx", value: "Nginx" },
      { name: "Apache", value: "Apache" },
      { name: "None", value: "None" },
    ],
  });

  //selecting database
  const database = await select({
    message: "Select a database:",
    choices: [
      { name: "MySQL", value: "MySQL" },
      { name: "MongoDB", value: "MongoDB" },
      { name: "None", value: "None" },
    ],
  });

  //DEV TOOLS
  const tools = await checkbox({
    message: "Select languages and tools (spacebar to select):",
    choices: [
      { name: "Node.js (Keep Installed)", value: "Node.js (Keep Installed)" },
      { name: "PHP & Composer", value: "PHP & Composer" },
      { name: "Python 3 & pip", value: "Python 3 & pip" },
      { name: "Docker & Docker Compose", value: "Docker & Docker Compose" },
      { name: "Certbot (for SSL)", value: "Certbot (for SSL)" },
      { name: "NONE", value: "None" },
    ],
  });

  // --- Save Choices for the Bash Script ---
  // This writes the user's tool selections to a temporary file.
  fs.writeFileSync("/tmp/setup_choices.txt", JSON.stringify(tools));

  // --- Installation Phase ---
  console.log(
    `\n${colors.FgYellow}Starting installation based on your selections...${colors.Reset}`,
  );

  //NOTE  -------------------SERVERS

  console.log(
    `${colors.FgCyan}==========  Setting Up Web Server  ==========${colors.Reset}`,
  );

  if (webserver === "Nginx") {
    //=> NGINX

    runCommand("sudo apt install nginx -y", "Installing Nginx");
    runCommand("sudo ufw allow 'Nginx HTTP'", "Allow Nginx to firewall");
    runCommand("sudo ufw status", "Check allowed Nginx in ufw");
    runCommand(
      '[ "$(curl -w \'\%{http_code}\' http://localhost)" = "200" ]',
      "Verifying Apache is running (HTTP 200 OK)",
    );
    runCommand(
      "systemctl is-active --quiet nginx",
      "Checking if Nginx service is active",
    );
    runCommand("sudo systemctl enable nginx", "Allow Nginx to startup");

    console.log(
      `${colors.FgGreen}====> Nginx Installed Successfully!${colors.Reset}`,
    );
  } else if (webserver === "Apache") {
    //=> Apache

    runCommand("sudo apt install apache2 -y", "Installing Apache");
    runCommand('sudo ufw allow in "Apache"', "Enable apache in ufw");
    runCommand("sudo ufw status", "Check allowed apache in ufw");
    runCommand(
      '[ "$(curl -w \'\%{http_code}\' http://localhost)" = "200" ]',
      "Verifying Apache is running (HTTP 200 OK)",
    );
    runCommand(
      "systemctl is-active --quiet apache2",
      "Checking if Apache service is active",
    );
    runCommand("sudo systemctl enable apache2", "Register Apache for startup");

    console.log(
      `${colors.FgGreen}====> Apache Installed Successfully!${colors.Reset}`,
    );
  }

  //NOTE -------------------Databases

  console.log(
    `${colors.FgCyan}==========  Setting Up Database  ==========${colors.Reset}`,
  );

  if (database === "MySQL") {
    // => MySQL
    runCommand("sudo apt install -y mysql-server", "Installing MySQL");
    runCommand("sudo systemctl start mysql.service", "Start MySQL service");
    runCommand(
      "sudo systemctl enable mysql.service",
      "enable MySQL service for startup",
    );
  } else if (database === "MongoDB") {
    // => MongoDB
    runCommand("apt-get install -y gnupg", "Installing gnupg for MongoDB");
    runCommand(
      "curl -fsSL https://pgp.mongodb.com/server-6.0.asc | gpg -o /usr/share/keyrings/mongodb-server-6.0.gpg --dearmor",
      "Adding MongoDB GPG key",
    );
    runCommand(
      'echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-6.0.gpg ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-6.0.list',
      "Adding MongoDB repository",
    );
    runCommand("apt-get update", "Updating package lists for MongoDB");
    runCommand("apt-get install -y mongodb-org", "Installing MongoDB");
    runCommand(
      "systemctl start mongod && systemctl enable mongod",
      "Starting and enabling MongoDB",
    );
  }

  //NOTE -------------------TOOLS

  if (tools.includes("PHP & Composer")) {
    runCommand(
      "apt-get install -y php-cli php-fpm php-mysql php-xml php-curl",
      "Installing PHP",
    );
    runCommand(
      "curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer",
      "Installing Composer",
    );
  }
  if (tools.includes("Python 3 & pip")) {
    runCommand(
      "apt-get install -y python3 python3-pip",
      "Installing Python 3 & pip",
    );
  }
  if (tools.includes("Docker & Docker Compose")) {
    runCommand(
      "apt-get install -y docker.io docker-compose",
      "Installing Docker & Docker Compose",
    );
    runCommand(
      "systemctl start docker && systemctl enable docker",
      "Starting and enabling Docker",
    );
  }
  if (tools.includes("Certbot (for SSL)")) {
    runCommand(
      "apt-get install -y certbot python3-certbot-nginx",
      "Installing Certbot",
    );
  }

  // Prints a final completion message.
  console.log(`\n${colors.FgGreen}====================================`);
  console.log("      🚀>> Server Setup Complete! <<🚀     ");
  console.log(`====================================${colors.Reset}`);
}

// Starts the main function.
main();
