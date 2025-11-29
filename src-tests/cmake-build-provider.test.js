'use strict';

import {jest} from '@jest/globals';
import {documentMock} from './mock-jsdom.js';
import cmakeBuildProvider from '../src/cmake-build-provider';
import {CmakeIntegrationEngine} from '../src/classCmakeIntegrationEngine';

import {makePopulatedDirectory, makePopulatedReadOnlyDirectory} from './fixturesForPulsarDirectory.js';
import {makeExistingFile} from './fixturesForPulsarFile.js';
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

let givenGlobals;

beforeEach(() => {
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
    givenGlobals = {
        engine: new CmakeIntegrationEngine(jsGlobals),
        ...jsGlobals
    };
});

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
                            'name': 'whatever'
                        }
                    ]
                }, null, 4)
            };
            const givenDirectoryNotCmakeProject = makePopulatedDirectory(
                '/home/not-a-cmake-project'
            );
            const givenDirectoryCmakeProjectWithoutPresets = makePopulatedDirectory(
                '/home/cmake-project-without-preset', ['CMakeLists.txt']
            );
            const givenReadOnlyDirectoryCmakeProjectWithoutPresets = makePopulatedReadOnlyDirectory(
                '/home/cmake-project-immutable-without-preset', ['CMakeLists.txt']
            );
            const givenDirectoryCmakeProjectWithSharedPresets = makePopulatedDirectory(
                '/home/cmake-project/with-shared-presets',
                [
                    'CMakeLists.txt',
                    {path: 'CMakePresets.json', file: makeExistingFile({onRead: givenSettings['cmake-build-provider-for-pulsar-by-sporniket.default-preset-body']})}
                ]
            );
            const givenDirectoryCmakeProjectWithLocalPresets = makePopulatedDirectory(
                '/home/cmake-project/with-local-presets',
                [
                    'CMakeLists.txt',
                    {path: 'CMakeUserPresets.json', file: makeExistingFile({onRead: givenSettings['cmake-build-provider-for-pulsar-by-sporniket.default-preset-body']})}
                ]
            );

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
            expect(givenGlobals.engine.state.keys().toArray()).toEqual([
                '/home/not-a-cmake-project',
                '/home/cmake-project-without-preset',
                '/home/cmake-project-immutable-without-preset',
                '/home/cmake-project/with-shared-presets',
                '/home/cmake-project/with-local-presets'
            ]);
            expect(givenGlobals.engine.state.get('/home/not-a-cmake-project')).toEqual({
                directory: givenDirectoryNotCmakeProject,
                isCmakeProject: false,
                errors: [],
                warnings: [],
            });
            expect(givenGlobals.engine.state.get('/home/cmake-project-without-preset')).toEqual({
                directory: givenDirectoryCmakeProjectWithoutPresets,
                isCmakeProject: true,
                isLanguageCppOrC: true,
                errors: [],
                warnings: [],
                selectedCmakePreset: {
                    registry: 'public',
                    id: 'whatever'
                },
                cmakePresets: {
                    public: {
                        order: [
                            'whatever'
                        ],
                        registry: new Map([
                            ['whatever', {
                                name: 'whatever'
                            }]
                        ])
                    },
                    private: {
                        order: [],
                        registry: new Map()
                    },
                },
            });
            expect(givenGlobals.engine.state.get('/home/cmake-project-immutable-without-preset')).toEqual({
                directory: givenReadOnlyDirectoryCmakeProjectWithoutPresets,
                isCmakeProject: true,
                isLanguageCppOrC: true,
                warnings: [],
                errors: [
                    'cannot.create.preset:CMakePresets.json',
                    'no.preset.after.load',
                ],
                selectedCmakePreset: {},
                cmakePresets: {
                    public: {
                        order: [],
                        registry: new Map()
                    },
                    private: {
                        order: [],
                        registry: new Map()
                    },
                },
            });
            expect(givenGlobals.engine.state.get('/home/cmake-project/with-shared-presets')).toEqual({
                directory: givenDirectoryCmakeProjectWithSharedPresets,
                isCmakeProject: true,
                isLanguageCppOrC: true,
                errors: [],
                warnings: [],
                selectedCmakePreset: {
                    registry: 'public',
                    id: 'whatever'
                },
                cmakePresets: {
                    public: {
                        order: ['whatever'],
                        registry: new Map([
                            ['whatever', {
                                name: 'whatever'
                            }]
                        ])
                    },
                    private: {
                        order: [],
                        registry: new Map()
                    },
                },
            });
            expect(givenGlobals.engine.state.get('/home/cmake-project/with-local-presets')).toEqual({
                directory: givenDirectoryCmakeProjectWithLocalPresets,
                isCmakeProject: true,
                isLanguageCppOrC: true,
                errors: [],
                warnings: [],
                selectedCmakePreset: {
                    registry: 'private',
                    id: 'whatever'
                },
                cmakePresets: {
                    public: {
                        order: [],
                        registry: new Map()
                    },
                    private: {
                        order: ['whatever'],
                        registry: new Map([
                            ['whatever', {
                                name: 'whatever'
                            }]
                        ])
                    },
                },
            });

        });
        describe('It loads the preset files of each project', () => {
            const givenPrivatePresetBody = JSON.stringify({
                'version': 8,
                'cmakeMinimumRequired': {
                    'major': 3,
                    'minor': 28,
                    'patch': 0
                },
                'configurePresets': [
                    {
                        'name': 'a',
                        'displayName': 'whatever',
                        'binaryDir': '${sourceDir}/...',
                        'cacheVariables': {
                            'what': 'ever'
                        }
                    },
                    {
                        'name': 'b',
                        'displayName': 'whatever',
                        'binaryDir': '${sourceDir}/...',
                        'cacheVariables': {
                            'what': 'ever'
                        }
                    },
                    {
                        'name': 'c',
                        'displayName': 'whatever',
                        'binaryDir': '${sourceDir}/...',
                        'cacheVariables': {
                            'what': 'ever'
                        }
                    }
                ]
            });

            const givenSharedPresetBody = JSON.stringify({
                'version': 8,
                'cmakeMinimumRequired': {
                    'major': 3,
                    'minor': 28,
                    'patch': 0
                },
                'configurePresets': [
                    {
                        'name': 'd',
                        'displayName': 'whatever',
                        'binaryDir': '${sourceDir}/...',
                        'cacheVariables': {
                            'what': 'ever'
                        }
                    },
                    {
                        'name': 'e',
                        'displayName': 'whatever',
                        'binaryDir': '${sourceDir}/...',
                        'cacheVariables': {
                            'what': 'ever'
                        }
                    },
                    {
                        'name': 'f',
                        'displayName': 'whatever',
                        'binaryDir': '${sourceDir}/...',
                        'cacheVariables': {
                            'what': 'ever'
                        }
                    }
                ]
            });

            const givenPresetBodyWithNoPresets = JSON.stringify({
                'version': 8,
                'cmakeMinimumRequired': {
                    'major': 3,
                    'minor': 28,
                    'patch': 0
                },
                'configurePresets': []
            });

            test('It load both private and shared presets, in separate spaces, and the first public preset is selected', async() => {
                // Prepare
                const givenCmakeProject = makePopulatedDirectory(
                    '/home/cmake-project/with-presets',
                    [
                        'CMakeLists.txt',
                        {path: 'CMakePresets.json', file: makeExistingFile({onRead: givenSharedPresetBody})},
                        {path: 'CMakeUserPresets.json', file: makeExistingFile({onRead: givenPrivatePresetBody})}
                    ]
                );
                givenGlobals.pulsar.project.getDirectories.mockImplementation(() => {
                    return [
                        givenCmakeProject
                    ];
                });
                givenGlobals.pulsar.config.get.mockImplementation(() => {
                    return '';
                });

                // Execute
                await dut({}, givenGlobals);

                // Verify
                expect(givenGlobals.engine.state).toEqual(new Map([
                    [
                        '/home/cmake-project/with-presets',
                        {
                            'directory': givenCmakeProject,
                            'isCmakeProject': true,
                            'isLanguageCppOrC': true,
                            'errors': [],
                            'warnings': [],
                            'selectedCmakePreset': {
                                'registry': 'public',
                                'id': 'd'
                            },
                            'cmakePresets': {
                                'private': {
                                    'order': [
                                        'a',
                                        'b',
                                        'c'
                                    ],
                                    'registry': new Map([
                                        ['a', {
                                            'name': 'a',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }],
                                        ['b', {
                                            'name': 'b',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }],
                                        ['c', {
                                            'name': 'c',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }]
                                    ])
                                },
                                'public': {
                                    'order': [
                                        'd',
                                        'e',
                                        'f'
                                    ],
                                    'registry': new Map([
                                        ['d', {
                                            'name': 'd',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }],
                                        ['e', {
                                            'name': 'e',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }],
                                        ['f', {
                                            'name': 'f',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }]
                                    ])
                                }
                            },
                        }
                    ]
                ])
                );
            });
            test('When there are only private presets, the first private preset is selected', async () => {
                // Prepare
                const givenCmakeProject = makePopulatedDirectory(
                    '/home/cmake-project/with-presets',
                    [
                        'CMakeLists.txt',
                        {path: 'CMakeUserPresets.json', file: makeExistingFile({onRead: givenPrivatePresetBody})}
                    ]
                );
                givenGlobals.pulsar.project.getDirectories.mockImplementation(() => {
                    return [
                        givenCmakeProject
                    ];
                });
                givenGlobals.pulsar.config.get.mockImplementation(() => {
                    return '';
                });

                // Execute
                await dut({}, givenGlobals);

                // Verify
                expect(givenGlobals.engine.state).toEqual(new Map([
                    [
                        '/home/cmake-project/with-presets',
                        {
                            'directory': givenCmakeProject,
                            'isCmakeProject': true,
                            'isLanguageCppOrC': true,
                            'errors': [],
                            'warnings': [],
                            'selectedCmakePreset': {
                                'registry': 'private',
                                'id': 'a'
                            },
                            'cmakePresets': {
                                'private': {
                                    'order': [
                                        'a',
                                        'b',
                                        'c'
                                    ],
                                    'registry': new Map([
                                        ['a', {
                                            'name': 'a',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }],
                                        ['b', {
                                            'name': 'b',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }],
                                        ['c', {
                                            'name': 'c',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }]
                                    ])
                                },
                                'public': {
                                    'order': [],
                                    'registry': new Map()
                                }
                            },
                        }
                    ]
                ])
                );
            });
            test('When there are finally no presets, it registers an error', async () => {
                const givenCmakeProject = makePopulatedDirectory(
                    '/home/cmake-project/with-presets',
                    [
                        'CMakeLists.txt',
                        {path: 'CMakePresets.json', file: makeExistingFile({onRead: givenPresetBodyWithNoPresets})},
                        {path: 'CMakeUserPresets.json', file: makeExistingFile({onRead: givenPresetBodyWithNoPresets})}
                    ]
                );
                givenGlobals.pulsar.project.getDirectories.mockImplementation(() => {
                    return [
                        givenCmakeProject
                    ];
                });
                givenGlobals.pulsar.config.get.mockImplementation(() => {
                    return '';
                });

                // Execute
                await dut({}, givenGlobals);

                // Verify
                expect(givenGlobals.engine.state).toEqual(new Map([
                    [
                        '/home/cmake-project/with-presets',
                        {
                            'directory': givenCmakeProject,
                            'isCmakeProject': true,
                            'isLanguageCppOrC': true,
                            'errors': [
                                'no.preset.after.load'
                            ],
                            'warnings': [],
                            'selectedCmakePreset': {},
                            'cmakePresets': {
                                'private': {
                                    'order': [],
                                    'registry': new Map()
                                },
                                'public': {
                                    'order': [],
                                    'registry': new Map()
                                }
                            },
                        }
                    ]
                ]));
            });
            test('When there is an error while reading a file, it registers a warning', async () => {
                // Prepare
                const givenCmakeProject = makePopulatedDirectory(
                    '/home/cmake-project/with-presets',
                    [
                        'CMakeLists.txt',
                        {path: 'CMakePresets.json', file: makeExistingFile({onRead: givenSharedPresetBody})},
                        {path: 'CMakeUserPresets.json', file: makeExistingFile({onRead: new Error('cannot read')})}
                    ]
                );
                givenGlobals.pulsar.project.getDirectories.mockImplementation(() => {
                    return [
                        givenCmakeProject
                    ];
                });
                givenGlobals.pulsar.config.get.mockImplementation(() => {
                    return '';
                });

                // Execute
                await dut({}, givenGlobals);

                // Verify
                expect(givenGlobals.engine.state).toEqual(new Map([
                    [
                        '/home/cmake-project/with-presets',
                        {
                            'directory': givenCmakeProject,
                            'isCmakeProject': true,
                            'isLanguageCppOrC': true,
                            'errors': [],
                            'warnings': [
                                'cannot.read.file:CMakeUserPresets.json:Error: cannot read'
                            ],
                            'selectedCmakePreset': {
                                'registry': 'public',
                                'id': 'd'
                            },
                            'cmakePresets': {
                                'private': {
                                    'order': [],
                                    'registry': new Map()
                                },
                                'public': {
                                    'order': [
                                        'd',
                                        'e',
                                        'f'
                                    ],
                                    'registry': new Map([
                                        ['d', {
                                            'name': 'd',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }],
                                        ['e', {
                                            'name': 'e',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }],
                                        ['f', {
                                            'name': 'f',
                                            'displayName': 'whatever',
                                            'binaryDir': '${sourceDir}/...',
                                            'cacheVariables': {
                                                'what': 'ever'
                                            }
                                        }]
                                    ])
                                }
                            },
                        }
                    ]
                ]));
            });
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
