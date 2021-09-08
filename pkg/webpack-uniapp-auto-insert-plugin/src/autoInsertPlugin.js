/*
* @file 骨架屏内容自动注入到html中；
*/
const path = require('path');
const fs = require('fs');
const serverRender = require('vue-server-renderer');
const devCache = null;

class AutoInsertPlugin {
    constructor(options = {}) {
        this.jsonPath = options.jsonPath || '';
        this.ssrParser = options.ssrParser || '';
        this.insertContent = options.insertContent || '';
    }

    apply(compiler) {
        if (!this.jsonPath || '') {
            this.error('jsonPath can not be empty in UniAppInsertSkeletonPlugin');
        }

        if (!fs.existsSync(this.jsonPath)) {
            this.error('can not find the file of ssr json');
        }
    }

    // 骨架屏生成器
    executeSsr(html, jsonPath, cb) {
        const render = serverRender.createBundleRenderer(jsonPath, {
            template: html
        });

        render.renderToString({}, (err, targetHtml) => {
            if (err) {
                return;
            }
            targetHtml && cb(targetHtml);
        });
    }

    error(msg) {
        throw new Error(msg);
    }
}

module.exports = {
    AutoInsertPlugin
}