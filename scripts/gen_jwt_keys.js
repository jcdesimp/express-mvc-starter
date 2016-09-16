#!/usr/bin/env node

"use strict"

const DESTINATION_DIR = "./resources"
const PUBLIC_KEY = "pubkey.pem";
const PRIVATE_KEY = "privkey.pem";

const child_process = require('child_process');
const path = require('path');

child_process.execSync(`openssl genrsa -out ${path.join(DESTINATION_DIR, PRIVATE_KEY)} 2048`);
child_process.execSync(`openssl rsa -in ${path.join(DESTINATION_DIR, PRIVATE_KEY)} -pubout -out ${path.join(DESTINATION_DIR, PUBLIC_KEY)}`);
