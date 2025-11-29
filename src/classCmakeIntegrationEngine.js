import {asyncInitializeProjectState, asyncUpdateProjectStateWithPresets} from './helperProjectState';
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

    asyncInitializeState() {
        return this.#asyncDiscoverWorkspace()
            .then(() => this.#asyncReloadPresetsOfAllProjects())
        ;
    }

    #asyncDiscoverWorkspace() {
        const defaultPresetsBody = this.#globals.pulsar.config.get('cmake-build-provider-for-pulsar-by-sporniket.default-preset-body');
        return Promise.all(this.#globals.pulsar.project.getDirectories().map((dir) => asyncInitializeProjectState(dir, defaultPresetsBody)))
            .then((dirStates) => {
                for (const dirState of dirStates) {
                    this.#state.set(dirState.directory.getPath(), dirState);
                    this.#globals.log(`registered ${dirState.directory.getPath()}`);
                }
                return this;
            });
    }

    #asyncReloadPresetsOfAllProjects() {
        return Promise.all(this.#state.values().map((projectState) => asyncUpdateProjectStateWithPresets(projectState)))
            .then(() => this);
    }
}
