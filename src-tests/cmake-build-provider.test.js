'use strict';

import {jest} from '@jest/globals';
import {documentMock} from './mock-jsdom.js';
import cmakeBuildProvider from '../src/cmake-build-provider';
import {CmakeIntegrationEngine} from '../src/classCmakeIntegrationEngine';

import {makePopulatedDirectory, makePopulatedReadOnlyDirectory} from './fixturesForPulsarDirectory.js';
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

const jsGlobals = {
    pulsar: {
        workspace: {
            toggle: jest.fn(),
            addOpener: jest.fn(),
            getCenter: jest.fn(() => {return workspaceCenter;} )
        },
        commands: {
            add: jest.fn()
        },
        project: {
            getDirectories: jest.fn(() => [])
        },
        config: {
            get: jest.fn()
        }
    },
    document: documentMock,
    log: jest.fn(),
};

const givenGlobals = {
    engine: new CmakeIntegrationEngine(jsGlobals),
    ...jsGlobals
};

describe('==== cmake-build-provider is a plugin for Pulsar (https://pulsar-edit.dev/) ====', () => {
    describe('== It has expected methods ==', () => {
        test('cmakeBuildProvider.activate is a Function', () => {
            expect(cmakeBuildProvider.activate).toBeInstanceOf(Function);
        });
        test('cmakeBuildProvider.deactivate is a Function', () => {
            expect(cmakeBuildProvider.deactivate).toBeInstanceOf(Function);
        });
        test('cmakeBuildProvider.toggleMain is a Function', () => {
            expect(cmakeBuildProvider.toggleMain).toBeInstanceOf(Function);
        });
    });

    describe('== Calling activate() ==', () => {
        const dut = cmakeBuildProvider.activate;
        test('It logs a message', () => {
            dut({}, givenGlobals);
            expect(givenGlobals.log).toHaveBeenCalledWith('CMake build provider activated.');
        });
        test('It add a valid opener', () => {
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
        test('It scans the projects of the workspace', async () => {
            // prepare
            const givenSettings = {
                'cmake-build-provider-for-pulsar-by-sporniket.default-preset-body': JSON.stringify({
                    'version': 8,
                    'cmakeMinimumRequired': {
                        'major': 3,
                        'minor': 28,
                        'patch': 0
                    },
                    'configurePresets': [
                        {
                            'what': 'ever'
                        },
                        {
                            'never': 'mind'
                        }
                    ]
                }, null, 4)
            };
            const givenDirectoryNotCmakeProject = makePopulatedDirectory('/home/not-a-cmake-project');
            const givenDirectoryCmakeProjectWithoutPresets = makePopulatedDirectory('/home/cmake-project-without-preset', ['CMakeLists.txt']);
            const givenReadOnlyDirectoryCmakeProjectWithoutPresets = makePopulatedReadOnlyDirectory('/home/cmake-project-immutable-without-preset', ['CMakeLists.txt']);
            const givenDirectoryCmakeProjectWithSharedPresets = makePopulatedDirectory('/home/cmake-project/with-shared-presets', ['CMakeLists.txt', 'CMakePresets.json']);
            const givenDirectoryCmakeProjectWithLocalPresets = makePopulatedDirectory('/home/cmake-project/with-local-presets', ['CMakeLists.txt', 'CMakeUserPresets.json']);

            givenGlobals.pulsar.project.getDirectories.mockImplementation(() => {
                return [
                    givenDirectoryNotCmakeProject,
                    givenDirectoryCmakeProjectWithoutPresets,
                    givenReadOnlyDirectoryCmakeProjectWithoutPresets,
                    givenDirectoryCmakeProjectWithSharedPresets,
                    givenDirectoryCmakeProjectWithLocalPresets
                ];
            });
            givenGlobals.pulsar.config.get.mockImplementation(() => {
                return givenSettings['cmake-build-provider-for-pulsar-by-sporniket.default-preset-body'];
            });

            // execute
            await dut({}, givenGlobals);

            // verify
            expect(givenGlobals.pulsar.project.getDirectories).toHaveBeenCalled();
            for (const dir of [
                givenDirectoryNotCmakeProject,
                givenDirectoryCmakeProjectWithoutPresets,
                givenReadOnlyDirectoryCmakeProjectWithoutPresets,
                givenDirectoryCmakeProjectWithSharedPresets,
                givenDirectoryCmakeProjectWithLocalPresets
            ]) {
                expect(dir.getPath).toHaveBeenCalled();
                expect(dir.getFile).toHaveBeenCalledWith('CMakeLists.txt');
                expect(dir.getFile('CMakeLists.txt').exists).toHaveBeenCalled();
            }
            for (const dir of [
                givenDirectoryCmakeProjectWithoutPresets,
                givenReadOnlyDirectoryCmakeProjectWithoutPresets,
                givenDirectoryCmakeProjectWithSharedPresets,
                givenDirectoryCmakeProjectWithLocalPresets
            ]) {
                expect(dir.getFile).toHaveBeenNthCalledWith(2, 'CMakePresets.json');
                const cmakeSharedPresetFile = dir.getFile('CMakePresets.json');
                expect(cmakeSharedPresetFile.exists).toHaveBeenCalled();
                if (!cmakeSharedPresetFile.exists()) {
                    expect(dir.getFile).toHaveBeenNthCalledWith(3, 'CMakeUserPresets.json');
                    expect(dir.getFile('CMakeUserPresets.json').exists).toHaveBeenCalled();
                }
            }
            for (const dir of [
                givenDirectoryCmakeProjectWithoutPresets,
                givenReadOnlyDirectoryCmakeProjectWithoutPresets
            ]) {
                expect(dir.getFile('CMakePresets.json').write).toHaveBeenCalledWith(givenSettings['cmake-build-provider-for-pulsar-by-sporniket.default-preset-body']);
            }
            expect(givenGlobals.engine.state).toEqual(new Map(
                [
                    ['/home/not-a-cmake-project', {
                        directory: givenDirectoryNotCmakeProject,
                        isCmakeProject: false
                    }],
                    ['/home/cmake-project-without-preset', {
                        directory: givenDirectoryCmakeProjectWithoutPresets,
                        isCmakeProject: true,
                        isLanguageCppOrC: true,
                    }],
                    ['/home/cmake-project-immutable-without-preset', {
                        directory: givenReadOnlyDirectoryCmakeProjectWithoutPresets,
                        isCmakeProject: true,
                        isLanguageCppOrC: true,
                        errors: [
                            'cannot.create.preset:CMakePresets.json'
                        ]
                    }],
                    ['/home/cmake-project/with-shared-presets', {
                        directory: givenDirectoryCmakeProjectWithSharedPresets,
                        isCmakeProject: true,
                        isLanguageCppOrC: true,
                    }],
                    ['/home/cmake-project/with-local-presets', {
                        directory: givenDirectoryCmakeProjectWithLocalPresets,
                        isCmakeProject: true,
                        isLanguageCppOrC: true,
                    }]
                ]

            )
            );

        });
    });
    describe('== Calling deactivate() ==', () => {
        const dut = cmakeBuildProvider.deactivate;
        test('It logs a message', () => {
            dut(givenGlobals);
            expect(givenGlobals.log).toHaveBeenCalledWith('CMake build provider de-activated.');
        });
    });
    describe('== Calling toggleMain() ==', () => {
        const dut = cmakeBuildProvider.toggleMain;
        test('It calls pulsar.workspace.toggle()', () => {
            dut(givenGlobals);
            expect(givenGlobals.pulsar.workspace.toggle).toHaveBeenCalledWith('atom://cmake-builder-provider-by-sporniket/main');
        });
    });
});

describe('==== cmake-build-provider provides the service "builder v2" ====', () => {
    describe('== It has expected methods ==', () => {
        test('cmakeBuildProvider.provideBuilder is a Function', () => {
            expect(cmakeBuildProvider.provideBuilder).toBeInstanceOf(Function);
        });
    });
    describe('== Calling provideBuilder() ==', () => {
        test('It returns a class that can be instanciated', () => {
            const providerClass = cmakeBuildProvider.provideBuilder(givenGlobals);
            expect(new providerClass('my_path').getNiceName()).toBe('CMake builders of \'my_path\'');
        });
    });
});
