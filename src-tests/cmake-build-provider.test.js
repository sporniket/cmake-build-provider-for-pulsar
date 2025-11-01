'use strict';

import {jest} from '@jest/globals';
import {documentMock} from './mock-jsdom.js';
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

function makeSubscription() {
    return {
        dispose: jest.fn()
    };
}

const workspaceCenter = {
    observeActivePaneItem: jest.fn(() => { return makeSubscription();})
};

const givenGlobals = {
    pulsar: {
        workspace: {
            toggle: jest.fn(),
            addOpener: jest.fn(),
            getCenter: jest.fn(() => {return workspaceCenter;} )
        },
        commands: {
            add: jest.fn()
        }
    },
    document: documentMock,
    log: jest.fn()
};

describe('It MUST have an activate() method', () => {
    const dut = cmakeBuildProvider.activate;
    test('cmakeBuildProvider.activate is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.activate() logs a message', () => {
        dut({}, givenGlobals);
        expect(givenGlobals.log).toHaveBeenCalledWith('CMake build provider activated.');
    });
    test('cmakeBuildProvider.activate() add a valid opener', () => {
        dut({}, givenGlobals);
        expect(givenGlobals.pulsar.workspace.addOpener).toHaveBeenCalledTimes(1);
        const args = givenGlobals.pulsar.workspace.addOpener.mock.calls[0];
        expect(args).toHaveLength(1);
        const callback = args[0];
        expect(callback).toBeInstanceOf(Function);
        expect(callback('whatever')).toBeNull();
        const cbReturn = callback('atom://cmake-builder-provider-by-sporniket/main');
        expect(cbReturn).toBeDefined();
        expect(cbReturn.getTitle()).toBe('CMake builder provider -- Status');
    });
});

describe('It MUST have an deactivate() method', () => {
    const dut = cmakeBuildProvider.deactivate;
    test('cmakeBuildProvider.deactivate is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.deactivate() logs a message', () => {
        dut(givenGlobals);
        expect(givenGlobals.log).toHaveBeenCalledWith('CMake build provider de-activated.');
    });
});

describe('It MUST have a toggleMain() method', () => {
    const dut = cmakeBuildProvider.toggleMain;
    test('cmakeBuildProvider.toggleMain is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.toggleMain() calls atom.workspace.toggle()', () => {
        dut(givenGlobals);
        expect(givenGlobals.pulsar.workspace.toggle).toHaveBeenCalledWith('atom://cmake-builder-provider-by-sporniket/main');
    });
});

describe('It MUST have a provideBuilder() method', () => {
    const dut = cmakeBuildProvider.provideBuilder;
    test('cmakeBuildProvider.provideBuilder is a Function', () => {
        expect(dut).toBeInstanceOf(Function);
    });
    test('cmakeBuildProvider.provideBuilder() return a class that can be instanciated', () => {
        const providerClass = cmakeBuildProvider.provideBuilder(givenGlobals);
        expect(new providerClass('my_path').getNiceName()).toBe('CMake builders of \'my_path\'');
    });
});
