'use strict';
import {jest} from '@jest/globals';

import {makeExistingFile, makeAbsentFile} from './fixturesForPulsarFile.js';
/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

class MockedDirectory {
    #path;
    #files;
    getPath;
    getFile;
    constructor(pathToDir, relativePathOfExistingFiles) {
        this.#path = pathToDir;
        this.#files = new Map();
        if (!!relativePathOfExistingFiles && Array.isArray(relativePathOfExistingFiles)) {
            for (let path of relativePathOfExistingFiles) {
                this.#files.set(path, makeExistingFile());
            }
        }
        this.getPath = jest.fn(this.#getPath);
        this.getFile = jest.fn(this.#getFile);
    }

    #getPath() {
        return this.#path;
    }

    #getFile(relativePath) {
        if (!this.#files.has(relativePath)) {
            this.#files.set(relativePath, makeAbsentFile());
        }
        return this.#files.get(relativePath);
    }
}

export function makePopulatedDirectory(pathToDir, relativePathOfExistingFiles) {
    return new MockedDirectory(pathToDir, relativePathOfExistingFiles);
}
