/*
* @file 骨架屏内容自动监听骨架屏文件变动；
*/
const child_process = require('child_process');

class AutoWatchPlugin {
    constructor(options) {
        this.watchDir = options.watchDir || '';
        this.watchFiles = options.watchFiles || [];
    }

    apply(compiler) {
        if (!this.watchDir && !this.watchFiles) {
            this.error('watchDir or watchFiles is wrong in UniAppInsertSkeletonPlugin');
        }

        compiler.hooks.watchRun.tapAsync('watchRun', (watch, cb) => {
            let filesChange = watch.compiler.watchFileSystem.watcher.mtimes;
        });
    }

    generatorSsrJson() {

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
    AutoWatchPlugin
}