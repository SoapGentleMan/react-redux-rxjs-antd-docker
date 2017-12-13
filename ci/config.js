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

const nginxConf = template`
upstream cluster {
        ${'API'}
}

server {
        listen 8080;
        server_name _;
        root /usr/share/nginx/html;

        proxy_http_version      1.1;
        proxy_set_header        Host                ${'PROXY_HOST'};
        proxy_set_header        apikey              ${'PROXY_KEY'};
        proxy_set_header        Connection          "";
        proxy_set_header        x-forwarded-for     $proxy_add_x_forwarded_for;
        proxy_set_header        x-access-key        ${'ACCESS_KEY'};
        proxy_set_header        x-request-id        $http_x_request_id;
        proxy_set_header        x-client            ${'LOG_CLIENT'};

        location /apps {
                proxy_pass http://cluster;
        }

        location /api {
                proxy_pass http://cluster;
        }

        location /static {
                expires 7d;
        }

        location / {
                expires     -1;
                rewrite     ^.*$ /static/%PROJECT_NAME%/index.html;
        }

}
`(config);
// 生成 Nginx 配置
fs.writeFileSync(path.join(__dirname, 'default.conf'), nginxConf);

function template(strings, ...keys) {
  return (function (config) {
    let result = [strings[0]];
    keys.forEach((key, i) => {
      let value = config[key] || '';
      if (key === 'API') {
        value = config['API'].map(api => `server ${api};`).join('\n        ');
      }
      result.push(value, strings[i + 1]);
    });
    return result.join('');
  });
}
