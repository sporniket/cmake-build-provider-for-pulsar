'use strict';
import cmakeBuildProvider from '../src/cmake-build-provider';
/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

describe.each([
    ["activate"],
    ["deactivate"],
    ["provideBuilder"]
])('the main module has required function "%s"', (f) => {
    test(`${cmakeBuildProvider[f]} is a function`, () => {
        expect(cmakeBuildProvider[f]).toBeInstanceOf(Function);
    });
});
