/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

export function createCmakeBuilderProviderClass(globals, config) {
    return class CmakeBuilderProvider {
        #globals = globals;
        #config = config;
        #basedir;
        #niceName;
        constructor(cwd) {
            console.log(`createCmakeBuilderProviderClass(${cwd})> construct`)
            this.#basedir = cwd;
            this.#niceName = `${this.#config.niceName.prefix} '${this.#basedir}'`
            // OPTIONAL: setup here
            // cwd is the project root this provider will operate in, so store `cwd` in `this`.
        }

        destructor() {
            // OPTIONAL: tear down here.
            // destructor is not part of ES6. This is called by `build` like any
            // other method before deactivating.
            return 'void';
        }

        getNiceName() {
            console.log(`createCmakeBuilderProviderClass(${this.#basedir})> getNiceName() returns '${this.#niceName}'`)
            // REQUIRED: return a nice readable name of this provider.
            return this.#niceName;
        }

        isEligible() {
            console.log(`createCmakeBuilderProviderClass(${this.#basedir})> isEligible()`)
            // REQUIRED: Perform operations to determine if this build provider can
            // build the project in `cwd` (which was specified in `constructor`).
            return true;
        }

        settings() {
            console.log(`createCmakeBuilderProviderClass(${this.#basedir})> settings()`)
            // REQUIRED: Return an array of objects which each define a build description.
            return Promise.resolve([{
                'exec': 'echo',
                'name': `cmake:${this.#basedir}> echo`,
                'args': [`CMake builders of '${this.#basedir}'`],
                'sh': true,
                'cwd': `${this.#basedir}`
            }]); // [ { ... }, { ... }, ]
        }

        on(event, cb) {
            console.log(`createCmakeBuilderProviderClass(${this.#basedir})> on(${event},cb)`)
            // OPTIONAL: The build provider can let `build` know when it is time to
            // refresh targets.
            return 'void';
        }

        removeAllListeners(event) {
            console.log(`removeAllListeners(${this.#basedir})> on(${event},cb)`)
            // OPTIONAL: (required if `on` is defined) removes all listeners registered in `on`
            return 'void';
        }
    };
}
