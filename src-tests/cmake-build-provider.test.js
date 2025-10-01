'use strict';

import {jest} from '@jest/globals';

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

describe('It MUST have an activate() method', () => {
    const dut = cmakeBuildProvider.activate;
    test('cmakeBuildProvider.activate is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.activate() logs a message', () => {
        const logger = jest.fn();
        console.log = logger;
        dut({});
        expect(logger).toHaveBeenCalledWith('CMake build provider activated.');
    });
});

describe('It MUST have an deactivate() method', () => {
    const dut = cmakeBuildProvider.deactivate;
    test('cmakeBuildProvider.deactivate is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.deactivate() logs a message', () => {
        const logger = jest.fn();
        console.log = logger;
        dut();
        expect(logger).toHaveBeenCalledWith('CMake build provider de-activated.');
    });
});

describe('It MUST have an provideBuilder() method', () => {
    const dut = cmakeBuildProvider.provideBuilder;
    test('cmakeBuildProvider.provideBuilder is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.provideBuilder() return a class that can be instanciated', () => {
        const providerClass = cmakeBuildProvider.provideBuilder();
        expect(new providerClass('my_path').getNiceName()).toBe('CMake builders of \'my_path\'');
    });
});
