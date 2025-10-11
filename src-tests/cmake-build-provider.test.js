'use strict';

import {jest} from '@jest/globals';
import {documentMock} from './mock-jsdom.js';
import cmakeBuildProvider from '../src/cmake-build-provider';

import {inject} from './injector.js';
/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

let origStateGlobal;

let origStateConsole;

beforeEach(() => {
    origStateConsole = inject({log: jest.fn()}, console);
    origStateGlobal = inject({atom: {
        workspace: {
            toggle: jest.fn(),
            addOpener: jest.fn()
        },
        document: documentMock
    }}, globalThis);
});

afterEach(() =>{
    inject(origStateConsole, console);
    inject(origStateGlobal, globalThis);
});

describe('It MUST have an activate() method', () => {
    const dut = cmakeBuildProvider.activate;
    test('cmakeBuildProvider.activate is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.activate() logs a message', () => {
        dut({});
        expect(console.log).toHaveBeenCalledWith('CMake build provider activated.');
    });
    test('cmakeBuildProvider.activate() add a valid opener', () => {
        dut({}, {atom, document: documentMock, log: origStateConsole.log});
        expect(atom.workspace.addOpener).toHaveBeenCalledTimes(1);
        const args = atom.workspace.addOpener.mock.calls[0];
        expect(args).toHaveLength(1);
        const callback = args[0];
        expect(callback).toBeInstanceOf(Function);
        const callbackReturn = callback('atom://cmake-builder-provider-by-sporniket/main');
        expect(callbackReturn).toBeInstanceOf('CmakeBuilderProviderMainViewClass');
        expect(callback('whatever')).toBeUndefined();
    });
});

describe('It MUST have an deactivate() method', () => {
    const dut = cmakeBuildProvider.deactivate;
    test('cmakeBuildProvider.deactivate is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.deactivate() logs a message', () => {
        dut();
        expect(console.log).toHaveBeenCalledWith('CMake build provider de-activated.');
    });
});

describe('It MUST have a toggleMain() method', () => {
    const dut = cmakeBuildProvider.toggleMain;
    test('cmakeBuildProvider.toggleMain is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.toggleMain() calls atom.workspace.toggle()', () => {
        dut();
        expect(atom.workspace.toggle).toHaveBeenCalledWith('atom://cmake-builder-provider-by-sporniket/main');
    });
});

describe('It MUST have a provideBuilder() method', () => {
    const dut = cmakeBuildProvider.provideBuilder;
    test('cmakeBuildProvider.provideBuilder is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.provideBuilder() return a class that can be instanciated', () => {
        const providerClass = cmakeBuildProvider.provideBuilder();
        expect(new providerClass('my_path').getNiceName()).toBe('CMake builders of \'my_path\'');
    });
});
