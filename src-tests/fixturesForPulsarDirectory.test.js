'use strict';

import {makePopulatedDirectory, makePopulatedReadOnlyDirectory} from './fixturesForPulsarDirectory.js';
import {makeExistingFile, makeReadOnlyFile, makeUncreatableFile} from './fixturesForPulsarFile.js';
/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/
async function expectFileToBeAnExistingWritableFile(file, initialContent, contentToWrite) {
    expect(file.exists()).toBe(true);
    expect(file.read()).resolves.toBe(initialContent);
    await expect(file
        .write(contentToWrite)
        .then(() => {return file.read();})
    ).resolves.toBe(contentToWrite);
}
async function expectFileToBeAnExistingReadOnlyFile(file, initialContent, contentToWrite) {
    expect(file.exists()).toBe(true);
    expect(file.read()).resolves.toBe(initialContent);
    await expect(file.write(contentToWrite)).rejects.toThrow();
}
async function expectFileToBeANonExistingNonCreatableFile(file) {
    expect(file.exists()).toBe(false);
    await expect(file.create()).rejects.toThrow();
}

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
            test('It returns the fixtures that were given at instanciation', async() => {
                const directory = makePopulatedDirectory(
                    'path',
                    [
                        {path: 'empty_file', file: makeExistingFile() },
                        {path: 'file_with_content', file: makeExistingFile({onRead: 'whatever 1'})},
                        {path: 'file_read_only', file: makeReadOnlyFile({onRead: 'whatever 2'})},
                        {path: 'file_uncreatable', file: makeUncreatableFile()}
                    ]
                );

                // Verify
                await expectFileToBeAnExistingWritableFile(directory.getFile('empty_file'), '', 'to be written');
                await expectFileToBeAnExistingWritableFile(directory.getFile('file_with_content'), 'whatever 1', 'to be written');
                await expectFileToBeAnExistingReadOnlyFile(directory.getFile('file_read_only'), 'whatever 2', 'to be written');
                await expectFileToBeANonExistingNonCreatableFile(directory.getFile('file_uncreatable'));
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
        describe('File creation', () => {
            test('getFile("a").create() resolves when the directory has not be populated with "a"', async () => {
                const dir = makePopulatedDirectory('dir', []);
                await expect(dir.getFile('a').create()).resolves.toBe(true);
            });
        });
        describe('File update', () => {
            test('getFile("a").write("whatever") resolves when the directory has not be populated with "a"', async () => {
                const dir = makePopulatedDirectory('dir', []);
                await expect(dir.getFile('a').write('whatever')).resolves.toBeTruthy();
            });
            test('getFile("a").write("whatever") resolves when the directory has been populated with "a"', async() => {
                const dir = makePopulatedDirectory('dir', ['a']);
                await expect(dir.getFile('a').write('whatever')).resolves.toBeTruthy();
            });
        });
    });

});


describe('==== makePopulatedReadOnlyDirectory() simulates a read only Directory with some files presents ====', () => {
    describe('It has expected methods', () => {
        test('It has methods getPath(), getFile()', () => {
            expect(makePopulatedReadOnlyDirectory()).toMatchObject({
                getPath: expect.any(Function),
                getFile: expect.any(Function),
            });
        });
        test('Methods getPath(), getFile() are mock functions', () => {
            const fixture = makePopulatedReadOnlyDirectory();
            for (const method of ['getPath', 'getFile']) {
                expect(fixture[method]._isMockFunction).toBe(true);
            }
        });

    });
    describe('Calling getPath()', () => {
        test('It returns the path given at instanciation time', () => {
            const dir = makePopulatedReadOnlyDirectory('a');
            expect(dir.getPath()).toBe('a');
        });
        test('It can be verified that getPath() has been called', () => {
            const dir = makePopulatedReadOnlyDirectory('a');
            dir.getPath();
            expect(dir.getPath).toHaveBeenCalled();
        });

    });
    describe('Calling getFile()', () => {
        describe('It returns a File', () => {
            test('getFile("a") has methods `exists()`, `create()`, `write()`', () => {
                const dir = makePopulatedReadOnlyDirectory('dir');
                expect(dir.getFile('a')).toMatchObject({
                    exists: expect.any(Function),
                    create: expect.any(Function),
                    write: expect.any(Function)
                });
            });
            test('Methods `exists()`, `create()`, `write()` of getFile("a") are mock functions', () => {
                const dir = makePopulatedReadOnlyDirectory('dir');
                const file = dir.getFile('a');
                for (const method of ['exists', 'create', 'write']) {
                    expect(file[method]._isMockFunction).toBe(true);
                }
            });
            test('It returns the fixtures that were given at instanciation', async() => {
                const directory = makePopulatedReadOnlyDirectory(
                    'path',
                    [
                        {path: 'empty_file', file: makeExistingFile() },
                        {path: 'file_with_content', file: makeExistingFile({onRead: 'whatever 1'})},
                        {path: 'file_read_only', file: makeReadOnlyFile({onRead: 'whatever 2'})},
                        {path: 'file_uncreatable', file: makeUncreatableFile()}
                    ]
                );

                // Verify
                await expectFileToBeAnExistingWritableFile(directory.getFile('empty_file'), '', 'to be written');
                await expectFileToBeAnExistingWritableFile(directory.getFile('file_with_content'), 'whatever 1', 'to be written');
                await expectFileToBeAnExistingReadOnlyFile(directory.getFile('file_read_only'), 'whatever 2', 'to be written');
                await expectFileToBeANonExistingNonCreatableFile(directory.getFile('file_uncreatable'));
            });
        });
        describe('It is idempotent', () => {
            test('getFile("a") gives the same result than getFile("a")', () => {
                const dir = makePopulatedReadOnlyDirectory('dir');
                const file = dir.getFile('a');
                expect(dir.getFile('a')).toBe(file);
            });
            test('getFile("b") gives a different result than getFile("a")', () => {
                const dir = makePopulatedReadOnlyDirectory('dir');
                const file = dir.getFile('a');
                expect(dir.getFile('b')).not.toBe(file);
            });

        });
        describe('File existence', () => {
            test('getFile("a").exists() returns true when the directory has been populated with "a"', () => {
                const dir = makePopulatedReadOnlyDirectory('dir', ['a']);
                expect(dir.getFile('a').exists()).toBe(true);
            });
            test('getFile("a").exists() returns false when the directory has not been populated with "a"', () => {
                const dir = makePopulatedReadOnlyDirectory('dir', ['b']);
                expect(dir.getFile('a').exists()).toBe(false);
            });
        });
        describe('File creation', () => {
            test('getFile("a").create() is rejected when the directory has not be populated with "a"', async () => {
                const dir = makePopulatedReadOnlyDirectory('dir', []);
                await expect(dir.getFile('a').create()).rejects.toThrow();
            });
        });
        describe('File update', () => {
            test('getFile("a").write("whatever") is rejected when the directory has not be populated with "a"', async () => {
                const dir = makePopulatedReadOnlyDirectory('dir', []);
                await expect(dir.getFile('a').write('whatever')).rejects.toThrow();
            });
            test('getFile("a").write("whatever") is rejected when the directory has been populated with "a"', async () => {
                const dir = makePopulatedReadOnlyDirectory('dir', ['a']);
                await expect(dir.getFile('a').write('whatever')).rejects.toThrow();
            });
        });
    });

});
