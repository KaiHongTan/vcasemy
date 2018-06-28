const _ = require('lodash');
const assert = require('assert');
const omit = require('omit-deep');
const environment = process.env.NODE_ENV;

const configs = {
    production: function () {
        return {
            baseURL: assertEnvVar(
                'base_url',
                'The URL of the website including the protocol and the port if needed'
            ),
            port: assertEnvVar(
                '3001',
                'The port that the REST api should be listening on'
            ),
            vgoURL: assertEnvVar(
                'VGO_URL',
                'The VGO URL used for getting cases information and sending opening offers'
            ),
            vgoAPIKey: assertEnvVar('VGO_API_KEY', 'The VGO website API Key'),
            affiliateAddress: assertEnvVar(
                'AFFILIATE_ADDRESS',
                'The Ethereum address of the account for collecting fees'
            ),
            sessionKeys: [
        assertEnvVar('SESSION_KEY', 'Key used for session managment'),
      ],
            steamApiKey: assertEnvVar(
                'STEAM_API_KEY',
                'Key used for steam login integration'
            ),
            log: {
                level: optionalEnvVar('LOG_LEVEL', 'Log level', 'info'),
            },
        };
    },
    development: function () {
        return {
            baseURL: 'http://vcase.eu-4.evennode.com/',
            port: 3002,
            vgoURL: 'https://api-trade.opskins.com',
            vgoAPIKey: '6119a188d842b79451dedbeb2d3d78',
            affiliateAddress: '0x0000000000000000',
            sessionKeys: ['this is not secure'],
            steamApiKey: assertEnvVar(
                'STEAM_API_KEY',
                'Key used for steam login integration'
            ),
            log: {
                level: 'debug',
            },
        };
    },
    qa: function () {
        return {
            baseURL: '0.0.0.0',
            port: 3002,
            vgoURL: 'https://api-trade.opskins.com',
            vgoAPIKey: '6119a188d842b79451dedbeb2d3d78',
            affiliateAddress: '0x0000000000000000',
            sessionKeys: ['this is not secure'],
            steamApiKey: assertEnvVar(
                'B6E511D6000564BE84895EB2BC294BC2',
                'Key used for steam login integration'
            ),
            log: {
                level: 'debug',
            },
        };
    },
};

let config = configs[environment];

assert(
    config,
    `Configuration ${environment} does not exist, NODE_ENV must be one of ${Object.keys(
    configs
  )}`
);

config = config();

// Convenience helper to display the config with sensitive fields stripped
config.toWire = function () {
    return omit(_.cloneDeep(config), ['password', 'toWire']);
};

console.log(
    `Running in ${environment} mode. Config is ${JSON.stringify(
    config.toWire(),
    null,
    2
  )}\n--\n'password' keys omitted.`
);

module.exports = config;

function assertEnvVar(envVar, description) {
    const value = process.env[envVar];
    assert(
        value !== null && value !== undefined,
        `Environment variable ${envVar} (currently is ${value}) must be present. Description: ${description}`
    );
    return value;
}

function optionalEnvVar(envVar, description, defaultValue) {
    const value = process.env[envVar];
    if (value === null || value === undefined) {
        if (defaultValue === undefined) {
            console.warn(
                `Optional environment variable ${envVar} (currently is ${value}) not present. Description: ${description}`
            );
        } else {
            console.warn(
                `Optional environment variable ${envVar} (currently is ${value}) not present. Description: ${description}. Using default value ${defaultValue}`
            );
        }
    }
    return value || defaultValue;
}
