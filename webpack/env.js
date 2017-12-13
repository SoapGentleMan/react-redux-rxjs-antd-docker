/**
 * Env
 * Get npm lifecycle event to identify the environment
 */
const fs = require('fs')
const path = require('path')

let projectConfig = (() => {
  let projectConfigPath = path.join(__dirname, '../project.config.js')
  if (!fs.existsSync(projectConfigPath)) {
    return {}
  }
  return require(projectConfigPath)
})()
let ENV = process.env.npm_lifecycle_event;
const isTest = ENV === 'test'
const isProd = ENV === 'build' || ENV === 'release'
const STATIC_PREFIX = process.env.STATIC_PREFIX ? process.env.STATIC_PREFIX : ''
const NAMESPACE = process.env.NAMESPACE ? process.env.NAMESPACE : projectConfig.namespace
const DEV_PORT = '8765'
const UGLIFYJS = !!process.env.UGLIFYJS

const MODULES_DIR = process.env.NODE_DOCKER_MODULES ? [__dirname, process.env.NODE_DOCKER_MODULES] : [__dirname, 'node_modules']
module.exports = {
  ENV,
  isTest, isProd, STATIC_PREFIX, NAMESPACE, DEV_PORT, MODULES_DIR, UGLIFYJS
}
