/**
 * @file 入口文件
 **/

const { AutoInsertPlugin } = require('./src/autoInsertPlugin.js');
const { AutoWatchPlugin  }= require('./src/autoWatchPlugin.js');

module.exports = {
    UniAppInsertSkeletonPlugin: AutoInsertPlugin,
    UniAppWatchSkeletonPlugin: AutoWatchPlugin
}