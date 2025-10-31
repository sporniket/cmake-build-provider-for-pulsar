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

describe('makeExistingFile()', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeExistingFile()));
});

describe('makeReadOnlyFile()', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeReadOnlyFile()));
});

describe('makeAbsentFile()', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeAbsentFile()));
});

describe('makeUncreatableFile()', () => {
    test('It has expected methods', assertRequiredMethodsOf(makeUncreatableFile()));
});
