'use strict';
import {jest} from '@jest/globals';

import {makeExistingFile, makeReadOnlyFile, makeAbsentFile, makeUncreatableFile} from './fixturesForPulsarFile.js';
/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/
const MockedFileMode = Object.freeze(
    {
        READ_WRITE: {
            newExistingFile: () => {return makeExistingFile();},
            newAbsentFile: () => {return makeAbsentFile();}
        },
        READ_ONLY: {
            newExistingFile: () => {return makeReadOnlyFile();},
            newAbsentFile: () => {return makeUncreatableFile();}
        }
    }
);

class MockedDirectory {
    #path;
    #files;
    #fileMode;
    getPath;
    getFile;
    constructor(pathToDir, relativePathOfExistingFiles, fileMode) {
        this.#path = pathToDir;
        this.#files = new Map();
        this.#fileMode = fileMode;
        if (!!relativePathOfExistingFiles && Array.isArray(relativePathOfExistingFiles)) {
            for (let path of relativePathOfExistingFiles) {
                this.#files.set(path, this.#fileMode.newExistingFile());
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
            this.#files.set(relativePath, this.#fileMode.newAbsentFile());
        }
        return this.#files.get(relativePath);
    }
}

export function makePopulatedDirectory(pathToDir, relativePathOfExistingFiles) {
    return new MockedDirectory(pathToDir, relativePathOfExistingFiles, MockedFileMode.READ_WRITE);
}

export function makePopulatedReadOnlyDirectory(pathToDir, relativePathOfExistingFiles) {
    return new MockedDirectory(pathToDir, relativePathOfExistingFiles, MockedFileMode.READ_ONLY);
}
