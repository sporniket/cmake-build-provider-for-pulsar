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

export function makeExistingFile() {return {
    exists: jest.fn(() => {return true;}),
    create: jest.fn(() => {return Promise.resolve(false);}),
    write: jest.fn(() => {return Promise.resolve(null);})
};}
export function makeReadOnlyFile() {return {
    exists: jest.fn(() => {return true;}),
    create: jest.fn(() => {return Promise.resolve(false);}),
    write: jest.fn(() => {return Promise.resolve(null);})
};}
export function makeAbsentFile() {return {
    exists: jest.fn(() => {return true;}),
    create: jest.fn(() => {return Promise.resolve(false);}),
    write: jest.fn(() => {return Promise.resolve(null);})
};}
export function makeUncreatableFile() {return {
    exists: jest.fn(() => {return true;}),
    create: jest.fn(() => {return Promise.resolve(false);}),
    write: jest.fn(() => {return Promise.resolve(null);})
};}
