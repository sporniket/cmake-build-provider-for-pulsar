/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

export class CmakeIntegrationEngine {
    #globals;
    #state;
    constructor(globals) {
        this.#globals = globals;
        this.#state = new Map();
    }

    get state() {
        return new Map(this.#state);
    }

    initializeProjectState() {
        return Promise.all(this.#globals.pulsar.project.getDirectories().map((dir) => this.#scanRootDirectory(dir)))
            .then((dirStates) => {
                for (const dirState of dirStates) {
                    this.#state.set(dirState.directory.getPath(), dirState);
                    this.#globals.log(`registered ${dirState.directory.getPath()}`);
                }
                return this;
            });
    }

    #scanRootDirectory(dir) {
        return Promise.resolve({
            directory: dir,
            isCmakeProject: false
        }).then((state) => {
            const cmakelistFile = dir.getFile('CMakeLists.txt');

            // step 1 : eligibility
            if (!cmakelistFile.exists()) {return state;}
            state.isCmakeProject = true;
            state.isLanguageCppOrC = true;

            // step 2 : preflight
            const cmakeSharedPresetFile = dir.getFile('CMakePresets.json');
            if (cmakeSharedPresetFile.exists()) {return state;}
            const cmakeLocalPresetFile = dir.getFile('CMakeUserPresets.json');
            if (cmakeLocalPresetFile.exists()) {return state;}
            return cmakeSharedPresetFile.write(this.#globals.pulsar.config.get('cmake-build-provider-for-pulsar-by-sporniket.default-preset-body'))
                .then(() => {return state;})
                .catch(() => {
                    state.errors = ['cannot.create.preset:CMakePresets.json'];
                    return state;
                });
        });

    }
}
