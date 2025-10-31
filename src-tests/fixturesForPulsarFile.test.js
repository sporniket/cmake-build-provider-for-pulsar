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
    console.log(fixture);
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

describe('makeExistingFile() simulates an existing file', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeExistingFile()));
    describe('A call to exists() always returns true', () => {
        let f = makeExistingFile();
        repeatTestRandTimes(2, 20, () => {
            expect(f.exists()).toBe(true);
        });
    });
});

describe('makeReadOnlyFile()', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeReadOnlyFile()));
    describe('A call to exists() always returns true', () => {
        let f = makeReadOnlyFile();
        repeatTestRandTimes(2, 20, () => {
            expect(f.exists()).toBe(true);
        });
    });
});

describe('makeAbsentFile()', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeAbsentFile()));
    describe('A call to exists() always returns false when create() has not been called', () => {
        let f = makeAbsentFile();
        repeatTestRandTimes(2, 20, () => {
            expect(f.exists()).toBe(false);
        });
    });
});

describe('makeUncreatableFile()', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeUncreatableFile()));
    describe('A call to exists() always returns false when create() has not been called', () => {
        let f = makeAbsentFile();
        repeatTestRandTimes(2, 20, () => {
            expect(f.exists()).toBe(false);
        });
    });
});
