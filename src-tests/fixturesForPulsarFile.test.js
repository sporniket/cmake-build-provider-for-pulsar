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
        test.each(['exists', 'create', 'write'])('%s', (m) => {
            expect(fixture[m]).toBeInstanceOf(Function);
        });
    };
}

describe('makeExistingFile()', () => {
    describe('It has expected methods', assertRequiredMethodsOf(makeExistingFile()));
});

describe('makeReadOnlyFile()', () => {
    describe('It has expected methods', assertRequiredMethodsOf(makeExistingFile()));
});

describe('makeAbsentFile()', () => {
    describe('It has expected methods', assertRequiredMethodsOf(makeExistingFile()));
});

describe('makeUncreatableFile()', () => {
    describe('It has expected methods', assertRequiredMethodsOf(makeExistingFile()));
});
