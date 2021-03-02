const child = require('child_process');

const util = require('util');
const exec = util.promisify(child.exec);

async function doGenerate() {
  const cmdClear = 'yarn clean';
  const cmdBuild = 'yarn production';
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

    return Promise.resolve(str);
  } catch (e) {
    process.stderr.write(`\nError ${e.message}\n`);
    throw new Error(e);
  }
}

doGenerate();
