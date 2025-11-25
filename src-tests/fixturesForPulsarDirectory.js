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
function isString(v) {
    return (typeof v === 'string' || v instanceof String);
}

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
    constructor(pathToDir, fileSpecifications, fileMode) {
        this.#path = pathToDir;
        this.#files = new Map();
        this.#fileMode = fileMode;
        if (!!fileSpecifications && Array.isArray(fileSpecifications)) {
            for (let spec of fileSpecifications) {
                if (isString(spec)) {
                    this.#files.set(spec, this.#fileMode.newExistingFile());
                } else {
                    const {path, file} = spec;
                    this.#files.set(path, file);
                }
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

export function makePopulatedDirectory(pathToDir, fileSpecifications) {
    return new MockedDirectory(pathToDir, fileSpecifications, MockedFileMode.READ_WRITE);
}

export function makePopulatedReadOnlyDirectory(pathToDir, fileSpecifications) {
    return new MockedDirectory(pathToDir, fileSpecifications, MockedFileMode.READ_ONLY);
}
