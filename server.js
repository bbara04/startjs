import express from 'express';
import { exec } from 'child_process';
import fs from 'fs/promises';
import ping from 'ping';
import { stat } from 'fs';

const app = express();
const port = 3000;

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
const host = await readConfig();

// Global variable to store server status and last start time
let serverStatus = false;
let lastStart = null;

// Function to check server status
function checkServerStatus() {
    ping.sys.probe(host, function(isAlive) {
        serverStatus = isAlive; // Update the global variable
        if (isAlive) {
            console.log(`Server at ${host} is ON`);
            return true;
        } else {
            console.log(`Server at ${host} is OFF`);
            return false;
        }
    });
}

// Start the interval to check every 60 seconds
setInterval(checkServerStatus, 60000);

// Initial check when the script runs
checkServerStatus();

app.get('/checkstate', async (req, res) => {
    let status = serverStatus;
    let actualDate = new Date();
    if (Math.abs(lastStart - actualDate) < 120000) {
        status = true;
    }
    res.send({ active: status });
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
            lastStart = new Date();
            res.send(stdout);
        }
    });

});

app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} címen`);
});
