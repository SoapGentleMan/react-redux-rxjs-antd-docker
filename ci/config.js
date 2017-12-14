const path = require('path');
const fs = require('fs');
let config = {};
if (process.argv[2] === 'prod') {
  config = require('./config/prod');
  // 更新 ts 编译规则，不生成 source map
  let tsconfig = require(path.join(__dirname, '../tsconfig.json'));
  tsconfig.compilerOptions.sourceMap = false;
  fs.writeFileSync(path.join(__dirname, '../tsconfig.json'), JSON.stringify(tsconfig));
} else {
  config = require('./config/pre');
}

const tpl = `#!/usr/bin/env bash
${Object.keys(config).filter(key => key !== 'API').map(key => `
export ${key}=${JSON.stringify(config[key])}`).join('')}
`;
// 生成环境变量
fs.writeFileSync(path.join(__dirname, 'config.sh'), tpl);
