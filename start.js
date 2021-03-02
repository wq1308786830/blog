const child = require('child_process');

const util = require('util');
const exec = util.promisify(child.exec);

async function doGenerate() {
  const cmdClear = 'yarn clear';
  const cmdBuild = 'yarn build';
  const cmdStart = 'yarn start';
  try {
    let str = '';
    await exec(cmdClear);
    const buildResult = await exec(cmdBuild);
    if (buildResult.stderr) {
      process.stdout.write(`\nstderr: \n${buildResult.stderr}\n`);
      str = 'build success with warning';
    } else {
      str = 'build success';
    }

    const exportResult = await exec(cmdStart);
    if (exportResult.stderr) {
      process.stdout.write(`\nstderr: \n${exportResult.stderr}\n`);
      str = 'export success with warning';
    } else {
      str = 'export success';
    }

    return Promise.resolve(str);
  } catch (e) {
    process.stderr.write(`\nError ${e.message}\n`);
    throw new Error(e);
  }
}

doGenerate();
