const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 3000;

const ping = require('ping');
const { readFile } = require('fs');

app.use(express.static('public'));


async function readConfig() {
    try {
        const data = await fs.readFile('config.json', 'utf8');
        const config = JSON.parse(data);
        return config.ip_address;
    } catch (error) {
        console.error('Error reading config file:', error);
        return null;
    }
}

// Replace with the IP or hostname of your remote Linux server
const host = '192.168.1.163';

// Global variable to store server status
let serverStatus = false;

// Function to check server status
function checkServerStatus() {
    ping.sys.probe(host, function(isAlive) {
        serverStatus = isAlive; // Update the global variable
        if (isAlive) {
            console.log(`Server at ${host} is ON`);
        } else {
            console.log(`Server at ${host} is OFF`);
        }
    });
}

// Start the interval to check every 30 seconds
setInterval(checkServerStatus, 60000);

// Initial check when the script runs
checkServerStatus();

app.get('/checkstate', async (req, res) => {
    res.send({ active: serverStatus });
});

app.get('/start', (req, res) => {
    const username = req.query.username;
    const ipAddress = req.ip;
    const cleanIp = ipAddress.replace(/^::ffff:/, '');

    console.log(`Felhasználó: ${username}`);

    if (!username) {
        return res.status(400).send('Hiányzó felhasználónév');
    }

    exec(`./sendwol.sh ${username} ${cleanIp}`, (error, stdout, stderr) => {
        if (error) {
            console.error(`Hiba történt: ${stderr}`);
            res.status(500).send('Hiba történt a szkript végrehajtása során');
        } else {
            console.log(`Szkript kimenet: ${stdout}`);
            res.send(stdout);
        }
    });
});

app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} címen`);
});
