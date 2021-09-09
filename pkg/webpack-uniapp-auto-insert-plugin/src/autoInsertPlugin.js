/*
* @file 骨架屏内容自动注入到html中；
*/
const path = require('path');
const fs = require('fs');
const { createBundleRenderer } = require('vue-server-renderer');
const devCache = null;

class AutoInsertPlugin {
    constructor(options = {}) {
        this.jsonPath = options.jsonPath || '';
        this.ssrParser = options.ssrParser || '';
        // this.insertContent = options.insertContent || '';
        this.flag = `<div id="${options.id || 'app'}">`,
        this.outputHtmlName = options.outputHtmlName || 'index.html';
    }

    apply(compiler) {
        if (!this.jsonPath || '') {
            this.error('jsonPath can not be empty in UniAppInsertSkeletonPlugin');
        }

        if (!fs.existsSync(this.jsonPath)) {
            this.error('can not find the file of ssr json');
        }

        compiler.hooks.emit.tapAsync('emit', (compilation, cb) => {
            let htmlStr;

            if (process.env.NODE_ENV === 'production') {
                htmlStr = compilation.assets[this.outputHtmlName].source();
            } else {
                if (!devCache) {
                    devCache = compilation.assets[this.outputHtmlName].source();
                }
                htmlStr = devCache;
            }

            if (htmlStr.indexOf('<!--vue-ssr-outlet-->') === -1) {
                const htmlArr = htmlStr.split(this.flag);

                htmlArr.splice(1, 0, this.flag);
                htmlArr.splice(2, 0, '<!--vue-ssr-outlet-->');
                htmlStr = htmlArr.join('\n');
            }

            this.executeSsr({jsonPath: this.jsonPath, html: htmlStr}, (err, html) => {
                if (err) {
                    this.error(err);
                } else {
                    compilation.assets[this.outputHtmlName] = {
                        source() {
                            return html;
                        },
                        size() {
                            return html.length;
                        }
                    }
                }
                cb()
            });
        });
    }

    // 骨架屏生成器
    executeSsr(options, cb) {
        const render = createBundleRenderer(options.jsonPath, { template: options.html });

        render.renderToString({}, (err, targetHtml) => {
            cb(err, targetHtml);
        });
    }

    error(msg) {
        if (msg instanceof Error) {
            throw msg;
        } else {
            throw new Error(msg);
        }
    }
}

module.exports = {
    AutoInsertPlugin
}