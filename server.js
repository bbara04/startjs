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

app.get('/checkstate', async (req, res) => {

    let ipAddress = await readConfig();

    if (!ipAddress) {
        
        return res.status(400).send({ error: 'No IP address provided' });
    }

    ping.promise.probe(ipAddress, { timeout: 3 })
        .then((result) => {
            res.send({ active: result.alive });
        })
        .catch((error) => {
            res.status(500).send({ error: 'Error pinging the IP address' });
        });
});

app.listen(port, () => {
    console.log(`A szerver fut a http://localhost:${port} címen`);
});
