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
        if (!this.watchDir && this.watchFiles.length === 0) {
            this.error('watchDir or watchFiles is wrong in UniAppInsertSkeletonPlugin');
        }

        compiler.hooks.watchRun.tapAsync('watchRun', (watch, cb) => {
            let filesChange = watch.compiler.watchFileSystem.watcher.mtimes;

            if (filesChange.length === 0) {
                cb();
            }

            const hasChange = filesChange.some(file => {
                if (this.watchDir) {
                    return file.indexOf(this.watchDir) !== -1;
                } else {
                    return this.watchFiles.indexOf(file) !== -1;
                }
            });

            if (hasChange) {
                this.generatorSsrJson(cb);
            }
        });
    }

    generatorSsrJson(cb) {
        const exec = child_process.exec;
        const cmd = 'vue invoke uni-skeleton';
        
        exec(cmd, (err) => {
            if (err) {
                this.error(err);
            } else {
                console.log('serverBundleJson has been update');
            }
            cb();
        })
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