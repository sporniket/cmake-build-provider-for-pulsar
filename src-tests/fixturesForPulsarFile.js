'use strict';
import {jest} from '@jest/globals';

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
            onCreate: (alreadyCreated) => {return Promise.resolve(!alreadyCreated);},
            onWrite: () => {return Promise.resolve('done writing');}
        },
        READ_ONLY: {
            onCreate: (alreadyCreated) => {return alreadyCreated ? Promise.resolve(!alreadyCreated) : Promise.reject(new Error('Create failed'));},
            onWrite: () => {return Promise.reject(new Error('Write failed'));}
        }
    }
);

const MockedFileCreation = Object.freeze(
    {
        EXISTING: {
            isCreated: true
        },
        ABSENT: {
            isCreated: false
        }
    }
);


class MockedFile {
    #created;
    #fileMode;
    exists;
    create;
    write;

    constructor(mockedFileCreation, mockedFileMode ) {
        this.#created = mockedFileCreation.isCreated;
        this.#fileMode = mockedFileMode;
        this.exists = jest.fn(this.#exists);
        this.create = jest.fn(this.#create);
        this.write = jest.fn(this.#write);
    }

    #exists() {
        return this.#created;
    }

    #create() {
        if (this.#created) {
            return this.#fileMode.onCreate(true);
        }
        if (this.#fileMode === MockedFileMode.READ_ONLY) {
            return this.#fileMode.onCreate();
        }
        this.#created = true;
        return this.#fileMode.onCreate(false);
    }

    #write(text) {
        if (!this.#created && this.#fileMode === MockedFileMode.READ_WRITE) {
            this.#created = true; // implied creation
        }
        return this.#fileMode.onWrite(text);
    }
}

export function makeExistingFile() {return new MockedFile(MockedFileCreation.EXISTING, MockedFileMode.READ_WRITE);}
export function makeReadOnlyFile() {return new MockedFile(MockedFileCreation.EXISTING, MockedFileMode.READ_ONLY);}
export function makeAbsentFile() {return new MockedFile(MockedFileCreation.ABSENT, MockedFileMode.READ_WRITE);}
export function makeUncreatableFile() {return new MockedFile(MockedFileCreation.ABSENT, MockedFileMode.READ_ONLY);}
