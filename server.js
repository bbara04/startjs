const express = require('express');
const { exec } = require('child_process');
const path = require('path');
const fs = require('fs').promises;

const app = express();
const port = 3000;

const ping = require('ping');

app.use(express.static('public'));

app.post('/run-script', (req, res) => {
    exec('./run_script.sh', (error, stdout, stderr) => {
        if (error) {
            console.error(`Hiba történt: ${stderr}`);
            res.status(500).send('Hiba történt a szkript végrehajtása során');
        } else {
            console.log(`Szkript kimenet: ${stdout}`);
            res.send(stdout);
        }
    });
});

app.get('/read-file', async (req, res) => {
    try {
        const fileContent = await fs.readFile(path.join(__dirname, 'public', 'last_start.txt'), 'utf-8');
        res.send(fileContent);
    } catch (error) {
        console.error('Hiba történt:', error.message);
        res.status(500).send('Hiba történt a fájl olvasása során');
    }
});

app.get('/check-device', (req, res) => {
    const ipAddress = req.query.ip;

    if (!ipAddress) {
        return res.status(400).send({ error: 'No IP address provided' });
    }

    ping.promise.probe(ipAddress, { timeout: 10 })
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
