const fs = require('fs');
const semver = require('semver');
const { logSuccess, logError } = require('../logs');
const { getConfig, addComponentToConfigAndBit } = require('./add');


const addComponentIfNotExists = async (componentId) => {
    // add component to config if it is not added yet
    const config = await getConfig();
    const configComponents = config.components;
    if (!configComponents[componentId]) {
        await addComponentToConfigAndBit(componentId, {});
    }
};

const applyVersion = async (componentId, versionVariant) => {

    const config = await getConfig();

    const component = config.components[componentId];
    const currentVersion = component.version;
    const newVersion = semver.inc(currentVersion, versionVariant);

    component.version = newVersion;
    component.published = false;

    // update config file
    const data = JSON.stringify(config, null, 4);
    fs.writeFileSync('zenbit.config.json', data);

    return newVersion;
};


const versionComponent = async (componentId, versionType) => {
    try {
        const versionVariant = versionType || 'patch';
        await addComponentIfNotExists(componentId);
        const newVersion = await applyVersion(componentId, versionVariant);

        logSuccess(`${versionVariant} version applied to ${componentId} successfully`);
        logSuccess(`New version: ${newVersion}`);
    } catch (error) {
        logError(error);
    }
};

module.exports = { versionComponent };
