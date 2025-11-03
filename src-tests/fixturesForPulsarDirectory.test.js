'use strict';
import {jest} from '@jest/globals';

import {makePopulatedDirectory} from './fixturesForPulsarDirectory.js';
/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

describe('==== makePopulatedDirectory() simulates a Directory with some files presents ====', () => {
    describe('It has expected methods', () => {
        test('It has methods getPath(), getFile()', () => {
            expect(makePopulatedDirectory()).toMatchObject({
                getPath: expect.any(Function),
                getFile: expect.any(Function),
            });
        });
        test('Methods getPath(), getFile() are mock functions', () => {
            const fixture = makePopulatedDirectory();
            for (const method of ['getPath', 'getFile']) {
                expect(fixture[method]._isMockFunction).toBe(true);
            }
        });

    });
    describe('Calling getPath()', () => {
        test('It returns the path given at instanciation time', () => {
            const dir = makePopulatedDirectory('a');
            expect(dir.getPath()).toBe('a');
        });
        test('It can be verified that getPath() has been called', () => {
            const dir = makePopulatedDirectory('a');
            dir.getPath();
            expect(dir.getPath).toHaveBeenCalled();
        });

    });
    describe('Calling getFile()', () => {
        describe('It returns a File', () => {
            test('getFile("a") has methods `exists()`, `create()`, `write()`', () => {
                const dir = makePopulatedDirectory('dir');
                expect(dir.getFile('a')).toMatchObject({
                    exists: expect.any(Function),
                    create: expect.any(Function),
                    write: expect.any(Function)
                });
            });
            test('Methods `exists()`, `create()`, `write()` of getFile("a") are mock functions', () => {
                const dir = makePopulatedDirectory('dir');
                const file = dir.getFile('a');
                for (const method of ['exists', 'create', 'write']) {
                    expect(file[method]._isMockFunction).toBe(true);
                }
            });

        });
        describe('It is idempotent', () => {
            test('getFile("a") gives the same result than getFile("a")', () => {
                const dir = makePopulatedDirectory('dir');
                const file = dir.getFile('a');
                expect(dir.getFile('a')).toBe(file);
            });
            test('getFile("b") gives a different result than getFile("a")', () => {
                const dir = makePopulatedDirectory('dir');
                const file = dir.getFile('a');
                expect(dir.getFile('b')).not.toBe(file);
            });

        });
        describe('File existence', () => {
            test('getFile("a").exists() returns true when the directory has been populated with "a"', () => {
                const dir = makePopulatedDirectory('dir', ['a']);
                expect(dir.getFile('a').exists()).toBe(true);
            });
            test('getFile("a").exists() returns false when the directory has not been populated with "a"', () => {
                const dir = makePopulatedDirectory('dir', ['b']);
                expect(dir.getFile('a').exists()).toBe(false);
            });
        });

    });

});
