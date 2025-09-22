import { select, checkbox, password, confirm, input } from "@inquirer/prompts";
import { execSync } from "child_process";
import fs from "fs";
import readline from "readline-sync";
import figlet from "figlet";

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

function printWelcomeMsg() {
  console.log(
    figlet.textSync("Welcome to", {
      font: "ANSI Shadow",
      horizontalLayout: "full",
    }),
  );
  console.log(
    figlet.textSync("Loki :)!", {
      font: "ANSI Shadow",
      horizontalLayout: "full",
    }),
  );
  console.log(`${colors.FgYellow}`);
  console.log(
    figlet.textSync("A Server Automation Tool", {
      font: "Future",
      horizontalLayout: "full",
    }),
  );
}

function printThankYouMsg() {
  console.log(
    figlet.textSync("Thanks for using!", {
      font: "ANSI Shadow",
      horizontalLayout: "full",
    }),
  );

  console.log(
    figlet.textSync("Made by Khush Vachhani!", {
      font: "ANSI Shadow",
      horizontalLayout: "full",
    }),
  );
  console.log(`${colors.FgGreen}`);
  console.log(
    figlet.textSync("Checkout Github", {
      font: "Future",
      horizontalLayout: "full",
    }),
  );
  console.log(`${colors.FgCyan}`);
  console.log(
    figlet.textSync("kapvm4444", { font: "Future", horizontalLayout: "full" }),
  );
  console.log(`${colors.Reset}`);
  console.log(`${colors.FgRed}Happy Hacking!`);
  console.log(`${colors.Reset}`);
}

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
      // Add a blank line after each step for spacing
      console.log("");
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
        console.log(`Skipping...${colors.Reset}`);
        break; // Exit the loop and move to the next command
      } else if (choice === 2) {
        // Abort or user pressed Cancel
        console.log(`Aborting setup.${colors.Reset}`);
        process.exit(1); // Exit the entire script
      } else {
        // Retry
        console.log(`Retrying...${colors.Reset}`);
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

  printWelcomeMsg();

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

  console.clear();

  console.log(
    `${colors.FgCyan}==========  Select The Config for your server  ==========${colors.Reset}`,
  );

  //NEW VERSION OF INQUIRER
  //selecting webserver
  const webserver = await select({
    message: "Select a web server: (Use up and down key to navigate)",
    choices: [
      { name: "Nginx", value: "Nginx" },
      { name: "Apache", value: "Apache" },
      { name: "None", value: "None" },
    ],
  });

  //DEV TOOLS
  const tools = await checkbox({
    message:
      "Select languages and tools (Use up and down key to navigate and space-bar to select): ",
    pageSize: 10,
    choices: [
      { name: "Node.js (Keep Installed)", value: "Node.js (Keep Installed)" },
      { name: "PHP FPM", value: "PHP FPM" },
      { name: "Composer", value: "Composer" },
      {
        name: "NPM (Node Package manager)",
        value: "Node.js (Keep Installed)",
      },
      { name: "phpmyadmin", value: "phpmyadmin" },
      { name: "PM2", value: "PM2" },
      { name: "Git", value: "Git" },
      { name: "NONE", value: "None" },
    ],
  });

  //selecting database
  const database = await select({
    message: "Select a database: (Use up and down key to navigate)",
    choices: [
      { name: "MySQL", value: "MySQL" },
      { name: "MongoDB", value: "MongoDB" },
      { name: "None", value: "None" },
    ],
  });

  // --- Save Choices for the Bash Script ---
  // This writes the user's tool selections to a temporary file.
  fs.writeFileSync("/tmp/setup_choices.txt", JSON.stringify(tools));

  // --- Installation Phase ---
  console.log(
    `\n${colors.FgYellow}Starting installation based on your selections...${colors.Reset}`,
  );
  console.log("");

  //NOTE  -------------------SERVERS

  console.log(
    `${colors.FgCyan}==========  Setting Up Web Server  ==========${colors.Reset}`,
  );

  //=> NGINX
  if (webserver === "Nginx") {
    runCommand("sudo apt install nginx -y", "Installing Nginx");
    runCommand("sudo ufw allow 'Nginx HTTP'", "Allow Nginx to firewall");
    runCommand("sudo ufw status", "Check allowed Nginx in ufw");
    runCommand(
      'bash -c "[ \\"$(curl -s -o /dev/null -w %{http_code} http://localhost)\\" = \\"200\\" ]"',
      "Verifying Nginx is running (HTTP 200 OK)",
    );
    runCommand(
      "systemctl is-active --quiet nginx",
      "Checking if Nginx service is active",
    );
    runCommand("sudo systemctl enable nginx", "Allow Nginx to startup");

    console.log(
      `${colors.FgGreen}====> Nginx Installed Successfully!${colors.Reset}`,
    );
  }
  //=> Apache
  else if (webserver === "Apache") {
    runCommand("sudo apt install apache2 -y", "Installing Apache");
    runCommand('sudo ufw allow in "Apache"', "Enable apache in ufw");
    runCommand("sudo ufw status", "Check allowed apache in ufw");
    runCommand(
      "systemctl is-active --quiet apache2",
      "Checking if Apache service is active",
    );
    runCommand("sudo systemctl enable apache2", "Register Apache for startup");

    console.log(
      `${colors.FgGreen}====> Apache Installed Successfully!${colors.Reset}`,
    );
  }

  //NOTE -------------------TOOLS

  //=> NODEJS
  if (tools.includes("Node.js (Keep Installed)")) {
    //DO NOTHING because it is already installed in pre-requisites
  }
  //=> PHP FPM
  if (tools.includes("PHP FPM")) {
    const selectedPhpVersions = await checkbox({
      message:
        "Select PHP-FPM versions to install (spacebar to select and arrow keys to navigate):",
      choices: [
        { name: "PHP 7.4", value: "7.4" },
        { name: "PHP 8.0", value: "8.0" },
        { name: "PHP 8.1", value: "8.1" },
        { name: "PHP 8.2", value: "8.2" },
        { name: "PHP 8.3", value: "8.3" },
        { name: "PHP 8.4", value: "8.4" },
      ],
    });

    // If no versions are selected, do nothing.
    if (selectedPhpVersions.length > 0) {
      runCommand(
        "sudo apt-get install software-properties-common -y",
        "Installing common files",
      );

      runCommand(
        "sudo add-apt-repository ppa:ondrej/php -y",
        "Installing ppa:ondrej/php",
      );

      runCommand("sudo apt-get update -y", "Refreshing Package Manager");

      selectedPhpVersions.push("8.3");
      for (const version of selectedPhpVersions) {
        console.log(`\n--- Installing PHP ${version} ---`);
        const packages = `php${version} php${version}-fpm php${version}-mysql libapache2-mod-php${version} libapache2-mod-fcgid`;

        runCommand(
          `sudo apt-get install -y ${packages}`,
          `Installing PHP ${version} and common extensions`,
        );

        runCommand(
          `sudo systemctl start php${version}-fpm`,
          `Installing PHP ${version} and common extensions`,
        );

        // Enable the mbstring extension
        runCommand("phpenmod mbstring", "Enabling PHP mbstring extension");
      }

      runCommand(
        "sudo a2enmod actions fcgid alias proxy_fcgi",
        "updating Apache Config",
      );

      runCommand("sudo systemctl restart apache2", "Restarting Apache Service");
    }

    runCommand(
      "apt-get install -y php-cli php-fpm php-mysql php-xml php-curl",
      "Installing PHP",
    );
    runCommand(
      "curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer",
      "Installing Composer",
    );
  }
  //=> COMPOSER
  if (tools.includes("Composer")) {
    runCommand("apt-get install -y unzip", "Installing Unzip for Composer");

    let isVerified = false;
    while (!isVerified) {
      runCommand(
        "curl -sS https://getcomposer.org/installer -o /tmp/composer-setup.php",
        "Downloading Composer installer",
      );

      const verificationCommand = `HASH=$(curl -sS https://composer.github.io/installer.sig) && php -r "if (hash_file('SHA384', '/tmp/composer-setup.php') === '$HASH') { echo 'Installer verified'; } else { echo 'Installer corrupt'; unlink('composer-setup.php'); } echo PHP_EOL;"`;

      try {
        console.log("Verifying installer integrity...");
        execSync(verificationCommand, { stdio: "inherit" });
        isVerified = true;
      } catch (error) {
        console.error("Verification failed. Re-downloading...");
      }
    }

    runCommand(
      "sudo php /tmp/composer-setup.php --install-dir=/usr/local/bin --filename=composer",
      "Installing Composer globally",
    );
    runCommand("composer --version", "Verifying Composer installation");
  }
  //=> NPM
  if (tools.includes("NPM (Node Package Manager)")) {
    //DO NOTHING because it is already installed in pre-requisites
  }
  //=> PM2
  if (tools.includes("PM2")) {
    runCommand("sudo npm install pm2 -g", "Installing PM2");
    runCommand("pm2 list", "Checking PM2");
  }
  //=> GIT
  if (tools.includes("Git")) {
    runCommand("sudo apt-get install git", "Installing Git");
  }

  //NOTE -------------------Databases

  console.log(
    `${colors.FgCyan}==========  Setting Up Database  ==========${colors.Reset}`,
  );

  // => MySQL
  if (database === "MySQL") {
    runCommand("sudo apt install mysql-server -y", "Installing MySQL");

    /*NOT NEEDED, ALREADY INCLUDED IN mysql_secure_installation command
      let passwordGood = false;
    let rootPassword, retryRootPassword;

    while (!passwordGood) {
      rootPassword = await password({ message: "Enter MySQL root password" });
      retryRootPassword = await password({
        message: "Re-type MySQL root password",
      });

      if (rootPassword === retryRootPassword) passwordGood = true;
    }*/
  }

  //=> PHPMYADMIN
  if (tools.includes("phpmyadmin")) {
    // --- Step 1: Installation ---
    // Acknowledge the interactive part of the installation
    console.log(
      `\n${colors.FgRed}ATTENTION: The next step is interactive.` +
        `\n1. At the 'Configuring phpmyadmin' screen, press SPACE to select 'apache2'.` +
        `\n2. Press ENTER to select 'Ok'.` +
        `\n3. Select 'Yes' to configure the database with dbconfig-common.` +
        `\n4. Enter a password for the phpmyadmin user when prompted.${colors.Reset}`,
    );
    readline.keyInPause("Press space-bar to continue...");

    runCommand(
      "apt-get install -y phpmyadmin php-mbstring php-zip php-gd php-json php-curl",
      "Installing phpMyAdmin",
    );

    runCommand(
      `sudo mysql_secure_installation`,
      "Setting security rules for the database password",
    );

    console.log(
      `${colors.FgGreen}phpMyAdmin installed successfully.${colors.Reset}`,
    );

    // --- Step 2: Configure PHP Version for phpMyAdmin ---
    const apacheConfPath = "/etc/phpmyadmin/apache.conf";
    try {
      console.log("Reading Apache config for phpMyAdmin...");
      let apacheConfContent = fs.readFileSync(apacheConfPath, "utf-8");

      // Define the PHP handler block to insert
      const phpHandlerBlock = `
    <FilesMatch \\.php$>
        SetHandler "proxy:unix:/var/run/php/php8.3-fpm.sock|fcgi://localhost/"
    </FilesMatch>`;

      // Define the .htaccess override line
      const allowOverrideLine = "    AllowOverride All";

      // Find the insertion point: inside the <Directory> block
      const directoryTag = "<Directory /usr/share/phpmyadmin>";
      const insertIndex =
        apacheConfContent.indexOf(directoryTag) + directoryTag.length;

      // Inject the new lines into the file content string
      apacheConfContent =
        apacheConfContent.slice(0, insertIndex) +
        "\n" +
        allowOverrideLine + // Add AllowOverride
        "\n" +
        phpHandlerBlock + // Add PHP handler
        apacheConfContent.slice(insertIndex);

      // Write the modified content back to a temporary file
      fs.writeFileSync("/tmp/phpmyadmin.conf", apacheConfContent);

      // Use sudo to overwrite the original file
      runCommand(
        `sudo mv /tmp/phpmyadmin.conf ${apacheConfPath}`,
        "Updating phpMyAdmin Apache configuration",
      );
    } catch (error) {
      console.error(
        `${colors.FgRed}Error modifying ${apacheConfPath}: ${error.message}${colors.Reset}`,
      );
    }

    // Restart Apache to apply the new configuration
    runCommand("systemctl restart apache2", "Restarting Apache");

    // --- Step 3: Add Extra Security Layer (.htaccess gateway) ---
    const addHtaccess = await confirm({
      message:
        "Do you want to add an extra layer of password protection to phpMyAdmin (Recommended)?",
    });

    if (addHtaccess) {
      console.log("\n--- Configuring Apache .htaccess security ---");

      // Prompt for the new username and password
      const gatewayUser = await input({
        message: "Enter a username for the security gateway:",
      });
      const gatewayPass = await password({
        message: `Enter a password for ${gatewayUser}:`,
      });

      // Enable .htaccess overrides for the phpmyadmin directory
      const apacheConf = `
<Directory /usr/share/phpmyadmin>
    AllowOverride All
</Directory>
    `;
      fs.writeFileSync("/tmp/phpmyadmin-override.conf", apacheConf);
      runCommand(
        "sudo mv /tmp/phpmyadmin-override.conf /etc/apache2/conf-available/phpmyadmin-override.conf",
        "Creating phpMyAdmin Apache config override",
      );
      runCommand(
        "sudo a2enconf phpmyadmin-override",
        "Enabling config override",
      );

      // Create the .htaccess file
      const htaccessContent = `
AuthType Basic
AuthName "Restricted Access"
AuthUserFile /etc/phpmyadmin/.htpasswd
Require valid-user
    `;
      fs.writeFileSync("/tmp/.htaccess", htaccessContent);
      runCommand(
        "sudo mv /tmp/.htaccess /usr/share/phpmyadmin/.htaccess",
        "Creating .htaccess file for phpMyAdmin",
      );

      // Create the password file using the htpasswd utility
      runCommand(
        `sudo htpasswd -c -b /etc/phpmyadmin/.htpasswd ${gatewayUser} ${gatewayPass}`,
        "Creating gateway user",
      );

      // Restart Apache to apply all changes
      runCommand(
        "systemctl restart apache2",
        "Restarting Apache to enable security",
      );
      console.log(
        `${colors.FgGreen}Security gateway enabled. You will now need two passwords to log in.${colors.Reset}`,
      );
    }

    console.log(
      `\nphpMyAdmin setup complete. You can access it at http://your_server_ip/phpmyadmin`,
    );
  }

  // => MongoDB
  else if (database === "MongoDB") {
    runCommand(
      "sudo apt-get install gnupg curl",
      "Installing gnupg for MongoDB",
    );
    runCommand(
      "curl -fsSL https://www.mongodb.org/static/pgp/server-8.0.asc | \
   sudo gpg -o /usr/share/keyrings/mongodb-server-8.0.gpg \
   --dearmor",
      "Adding MongoDB GPG key",
    );
    runCommand(
      'echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-8.0.gpg ] https://repo.mongodb.org/apt/ubuntu noble/mongodb-org/8.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-8.0.list',
      "Adding MongoDB repository",
    );
    runCommand("sudo apt-get update", "Updating package lists for MongoDB");
    runCommand("sudo apt-get install -y mongodb-org", "Installing MongoDB");
    runCommand(
      "systemctl start mongod && systemctl enable mongod",
      "Starting and enabling MongoDB",
    );
  }

  // Prints a final completion message.
  console.log(
    `\n${colors.FgGreen}========================================================`,
  );
  console.log("      🚀 >> Server Setup Complete! << 🚀     ");
  console.log(
    `========================================================${colors.Reset}`,
  );

  printThankYouMsg();
}

// Starts the main function.
main();
