/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import {onRequest} from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";

const functions = require('firebase-functions');
const { exec } = require('child_process');
const path = require('path');

exports.runNISTModel = functions.https.onRequest((req, res) => {
    const exePath = path.join(__dirname, 'src\assets\NISTmodel.exe'); 

    exec(exePath, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return res.status(500).send(`Error: ${error.message}`);
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.status(500).send(`stderr: ${stderr}`);
        }
        res.send(stdout);
    });
});
