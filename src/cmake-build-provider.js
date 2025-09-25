// TODO -- import e.g. import { CompositeDisposable, Disposable} from 'atom';
/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

function createCmakeBuilderProviderClass(globals, config) {
    return class CmakeBuilderProvider {
        #globals = globals;
        #config = config;
        #basedir;
        constructor(cwd) {
            this.#basedir = cwd;
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
            // REQUIRED: return a nice readable name of this provider.
            return `${this.#config.niceName.prefix} '${this.#basedir}'`;
        }

        isEligible() {
            // REQUIRED: Perform operations to determine if this build provider can
            // build the project in `cwd` (which was specified in `constructor`).
            return 'boolean';
        }

        settings() {
            // REQUIRED: Return an array of objects which each define a build description.
            return 'array of objects'; // [ { ... }, { ... }, ]
        }

        on(event, cb) {
            // OPTIONAL: The build provider can let `build` know when it is time to
            // refresh targets.
            return 'void';
        }

        removeAllListeners(event) {
            // OPTIONAL: (required if `on` is defined) removes all listeners registered in `on`
            return 'void';
        }
    };

}

export default {
    activate(state) {},
    deactivate() {},
    // actions entry points
    // provided services entry points
    provideBuilder() {return createCmakeBuilderProviderClass({}, {niceName: {prefix: 'CMake builders of'}});},
    // consumed services entry points
};
