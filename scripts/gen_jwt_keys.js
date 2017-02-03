#!/usr/bin/env node

const DESTINATION_DIR = './resources';
const PUBLIC_KEY = 'pubkey.pem';
const PRIVATE_KEY = 'privkey.pem';

const childProcess = require('child_process');
const path = require('path');

childProcess.execSync(`openssl genrsa -out ${path.join(DESTINATION_DIR, PRIVATE_KEY)} 2048`);
childProcess.execSync(`openssl rsa -in ${path.join(DESTINATION_DIR, PRIVATE_KEY)} -pubout -out ${path.join(DESTINATION_DIR, PUBLIC_KEY)}`);
