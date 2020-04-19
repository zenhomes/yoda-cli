const fs = require('fs');
const { runSpawn } = require('../promisify');
const { logError } = require('../logs');
const { getConfig, addComponentToConfigAndBit } = require('./add');

const getModifiedComponentsKeys = (components) => {
    const componentKeys = Object.keys(components);
    return componentKeys.filter((key) => {
        const component = components[key];
        return !component.published;
    });
}


const buildAndTagComponent = async (componentId, version) => {
    // run bit build
    await runSpawn(`npx`, ['bit', 'build', `${componentId}`, '-c']);
    // tag component
    await runSpawn(`npx`, ['bit', 'tag', `${componentId}`, `${version}`, '--skip-auto-tag']);
}

const buildAndPublishAllComponents = async (remote) => {
    const config = await getConfig();
    const components = config.components;
    const modifiedComponentsKeys = getModifiedComponentsKeys(components);

    // build, tag and export components
    for (const componentId of modifiedComponentsKeys) {
        const component = components[componentId];
        await buildAndTagComponent(componentId, component.version);
    }

    // export built and tagged components
    await runSpawn(`npx`, ['bit', 'export', `${remote}`]);

    // update zenconfig file
    for (const componentId of modifiedComponentsKeys) {
        const component = components[componentId];
        component.published = true;
    }
    const data = JSON.stringify(config, null, 4);
    fs.writeFileSync('yoda.config.json', data);
}

const buildAndBuildSingleComponent = async (componentId, remote) => {
    const config = await getConfig();
    const components = config.components;

    const component = components[componentId];
    await buildAndTagComponent(componentId, component.version);

    // export built and tagged components
    await runSpawn(`npx`, ['bit', 'export', `${remote}`]);

    component.published = true;
    const data = JSON.stringify(config, null, 4);
    fs.writeFileSync('yoda.config.json', data);
}


const exportComponent = async (remote, { componentId }) => {
    try {
        if (componentId) {
            await buildAndBuildSingleComponent(componentId, remote);
        } else {
            await buildAndPublishAllComponents(remote);
        }
    } catch (error) {
        logError(error);
    }
};

module.exports = { exportComponent };
