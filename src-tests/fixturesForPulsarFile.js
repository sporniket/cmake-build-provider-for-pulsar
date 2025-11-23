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
    #onRead;
    exists;
    create;
    read;
    write;

    constructor({mockedFileCreation, mockedFileMode, onRead = ''} ) {
        this.#created = mockedFileCreation.isCreated;
        this.#fileMode = mockedFileMode;
        this.#onRead = onRead;
        this.exists = jest.fn(this.#exists);
        this.create = jest.fn(this.#create);
        this.read = jest.fn(this.#read);
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

    #read() {
        if (typeof this.#onRead === 'string' || this.#onRead instanceof String)
        {
            return Promise.resolve(this.#onRead);
        }
        else if (this.#onRead instanceof Error) {
            return Promise.reject(this.#onRead);
        }
        throw new Error('wrong.initialization:' + typeof (this.#onRead));
    }

    #write(text) {
        if (this.#fileMode === MockedFileMode.READ_WRITE) {
            if (!this.#created) {
                this.#created = true; // implied creation
            }
            this.#onRead = text;
        }
        return this.#fileMode.onWrite(text);
    }
}

export function makeExistingFile({onRead} = {onRead: ''}) {
    return new MockedFile({
        onRead,
        mockedFileCreation: MockedFileCreation.EXISTING,
        mockedFileMode: MockedFileMode.READ_WRITE
    } );
}
export function makeReadOnlyFile({onRead} = {onRead: ''}) {
    return new MockedFile({
        onRead,
        mockedFileCreation: MockedFileCreation.EXISTING,
        mockedFileMode: MockedFileMode.READ_ONLY
    });
}
export function makeAbsentFile() {
    return new MockedFile({
        onRead: new Error('cannot.read'),
        mockedFileCreation: MockedFileCreation.ABSENT,
        mockedFileMode: MockedFileMode.READ_WRITE
    });
}
export function makeUncreatableFile() {
    return new MockedFile({
        onRead: new Error('cannot.read'),
        mockedFileCreation: MockedFileCreation.ABSENT,
        mockedFileMode: MockedFileMode.READ_ONLY
    });
}
