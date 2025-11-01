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

function assertRequiredMethodsOf(fixture) {
    return () => {
        expect(fixture).toMatchObject({
            exists: expect.any(Function),
            create: expect.any(Function),
            write: expect.any(Function)
        });
    };
}

function repeatTestRandTimes(minRep, maxRep, testFnToRepeat) {
    let nbTimes = Math.floor(Math.random() * (maxRep - minRep)) + minRep;
    for (let i = 0; i < nbTimes; i++) {
        test(`attempt #${i}`, () => {
            testFnToRepeat();
        });
    }
}

describe('==== makeExistingFile() simulates an existing file ====', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeExistingFile()));
    describe('After instanciation', () => {
        test('A call to exists() returns true', () => {
            expect(makeExistingFile().exists()).toBe(true);
        });
        test('A call to exists() after write("whatever") returns true', async () => {
            const f = makeExistingFile();
            await expect(f.write('whatever').then(() => {
                return f.exists();
            })).resolves.toBe(true);
        });
        test('A call to exists() after create() returns true', async () => {
            const f = makeExistingFile();
            await expect(f.create().then(() => {
                return f.exists();
            })).resolves.toBe(true);
        });
        test('getLastWrite() returns null', () => {
            expect(makeExistingFile().getLastWrite()).toBeNull();
        });
    });
    test('A call to create() resolves to false', async () => {
        await expect(makeExistingFile().create()).resolves.toBe(false);
    });
    describe('A call to write() resolves and is verifiable', () => {
        const f = makeExistingFile();
        const w = f.write('whatever');
        test('A call to write() resolves', async () => {
            await expect(w).resolves.toBeTruthy();
        });
        test('getLastWrite() returns "whatever"', () => {
            expect(f.getLastWrite()).toBe('whatever');
        });
    });
});

describe('==== makeReadOnlyFile() simulates a read only existing file ====', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeReadOnlyFile()));
    describe('After instanciation', () => {
        test('A call to exists() returns true', () => {
            expect(makeReadOnlyFile().exists()).toBe(true);
        });
        test('A call to exists() after write("whatever") returns true', async () => {
            const f = makeReadOnlyFile();
            await expect(f.write('whatever').then(
                ()=>{
                    throw new Error('Should not happen');
                },
                () => {
                    return f.exists();
                })).resolves.toBe(true);
        });
        test('A call to exists() after create() returns true', async () => {
            const f = makeReadOnlyFile();
            await expect(f.create().then(() => {
                return f.exists();
            })).resolves.toBe(true);
        });
        test('getLastWrite() returns null', () => {
            expect(makeReadOnlyFile().getLastWrite()).toBeNull();
        });
    });
    test('A call to create() resolves to false', async () => {
        await expect(makeReadOnlyFile().create()).resolves.toBe(false);
    });
    describe('A call to write() is rejected and is verifiable', () => {
        const f = makeReadOnlyFile();
        const w = f.write('whatever');
        test('A call to write() is rejected', async () => {
            await expect(w).rejects.toThrow();
        });
        test('getLastWrite() returns "whatever"', () => {
            expect(f.getLastWrite()).toBe('whatever');
        });
    });
});

describe('==== makeAbsentFile() simulates a non existing file that can be created ====', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeAbsentFile()));
    describe('After instanciation', () => {
        test('A call to exists() returns false', () => {
            expect(makeAbsentFile().exists()).toBe(false);
        });
        test('A call to exists() after write("whatever") returns true', async () => {
            const f = makeAbsentFile();
            await expect(f.write('whatever').then(() => {
                return f.exists();
            })).resolves.toBe(true);
        });
        test('A call to exists() after create() returns true', async () => {
            const f = makeAbsentFile();
            await expect(f.create().then(() => {
                return f.exists();
            })).resolves.toBe(true);
        });
        test('getLastWrite() returns null', () => {
            expect(makeAbsentFile().getLastWrite()).toBeNull();
        });
    });
    test('A call to create() resolves to true', async () => {
        await expect(makeAbsentFile().create()).resolves.toBe(true);
    });
    describe('A call to write() resolves and is verifiable', () => {
        const f = makeAbsentFile();
        const w = f.write('whatever');
        test('A call to write() resolves', async () => {
            await expect(w).resolves.toBeTruthy();
        });
        test('getLastWrite() returns "whatever"', () => {
            expect(f.getLastWrite()).toBe('whatever');
        });
    });
});

describe('==== makeUncreatableFile() simulates a non existing file that cannot be created ====', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeUncreatableFile()));
    describe('After instanciation', () => {
        test('A call to exists() returns false', () => {
            expect(makeUncreatableFile().exists()).toBe(false);
        });
        test('A call to exists() after write("whatever") returns false', async () => {
            const f = makeUncreatableFile();
            await expect(f.write('whatever').then(
                ()=>{
                    throw new Error('Should not happen');
                },
                () => {
                    return f.exists();
                })).resolves.toBe(false);
        });
        test('A call to exists() after create() returns false', async () => {
            const f = makeUncreatableFile();
            await expect(f.create().then(
                ()=>{
                    throw new Error('Should not happen');
                },
                () => {
                    return f.exists();
                })).resolves.toBe(false);
        });
        test('getLastWrite() returns null', () => {
            expect(makeUncreatableFile().getLastWrite()).toBeNull();
        });
    });
    test('A call to create() is rejected', async () => {
        await expect(makeUncreatableFile().create()).rejects.toThrow();
    });
    describe('A call to write() is rejected and is verifiable', () => {
        const f = makeUncreatableFile();
        const w = f.write('whatever');
        test('A call to write() is rejected', async () => {
            await expect(w).rejects.toThrow();
        });
        test('getLastWrite() returns "whatever"', () => {
            expect(f.getLastWrite()).toBe('whatever');
        });
    });
});
