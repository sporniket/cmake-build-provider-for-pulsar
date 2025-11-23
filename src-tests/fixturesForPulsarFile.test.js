'use strict';
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
        test('It has methods `exists()`, `create()`, `read()`, `write()`', () => {
            expect(fixture).toMatchObject({
                exists: expect.any(Function),
                create: expect.any(Function),
                read: expect.any(Function),
                write: expect.any(Function)
            });
        });
        test('Methods `exists()`, `create()`, `read()`, `write()` are mock functions', () => {
            for (const method of ['exists', 'create', 'read', 'write']) {
                expect(fixture[method]._isMockFunction).toBe(true);
            }
        });
    };
}

describe('==== makeExistingFile() simulates an existing file ====', () => {
    describe('It has expected methods', assertRequiredMethodsOf(makeExistingFile()));
    describe('Calling exists()', () => {
        test('A call to exists() after instantiation returns true', () => {
            expect(makeExistingFile().exists()).toBe(true);
        });
        test('A call to exists() after write("whatever") returns true', async () => {
            const f = makeExistingFile();
            await expect(f.write('whatever').then(() => {
                return f.exists();
            })).resolves.toBe(true);
        });
        test('A call to exists() after create() returns true', async () => {
            const f = makeExistingFile();
            await expect(f.create().then(() => {
                return f.exists();
            })).resolves.toBe(true);
        });
        test('It can be verified that exists() has been called', () => {
            const f = makeExistingFile();
            f.exists();
            expect(f.exists).toHaveBeenCalled();
        });
    });
    describe('Calling create()', () => {
        test('It resolves to false', async () => {
            await expect(makeExistingFile().create()).resolves.toBe(false);
        });
        test('It can be verified that create() has been called', async () => {
            const f = makeExistingFile();
            await expect(f.create()
                .then(() => {return f.create;})
            ).resolves.toHaveBeenCalled();
        });
    });
    describe('Calling read()', () => {
        test('A call to read() after makeExistingFile() returns ""', async() => {
            const f = makeExistingFile();
            expect(f.read()).resolves.toBe('');
        });
        test('A call to read() after makeExistingFile({onRead:"whatever"}) returns "whatever"', async() => {
            const f = makeExistingFile({onRead: 'whatever'});
            expect(f.read()).resolves.toBe('whatever');
        });
        test('A call to read() after let f = makeExistingFile() ; f.write("whatever") returns "whatever"', async() => {
            const f = makeExistingFile();
            expect(f.write('whatever').then(()=>f.read())).resolves.toBe('whatever');
        });
        test('It can be verified that read() has been called', () => {
            const f = makeExistingFile();
            expect(f.read().then(() => f.read)).resolves.toHaveBeenCalled();
        });
    });
    describe('Calling write("whatever")', () => {
        test('A call to write() resolves', async () => {
            const f = makeExistingFile();
            await expect(f.write('whatever')).resolves.toBeTruthy();
        });
        test('It can be verified that write() has been called with "whatever"', async () => {
            const f = makeExistingFile();
            await expect(f.write('whatever')
                .then(() => {return f.write;})
            ).resolves.toHaveBeenCalledWith('whatever');
        });
    });
});

describe('==== makeReadOnlyFile() simulates a read only existing file ====', () => {
    describe('It has expected methods', assertRequiredMethodsOf(makeReadOnlyFile()));
    describe('Calling exists()', () => {
        test('A call to exists() after instantiation returns true', () => {
            expect(makeReadOnlyFile().exists()).toBe(true);
        });
        test('A call to exists() after write("whatever") returns true', async () => {
            const f = makeReadOnlyFile();
            await expect(f.write('whatever').then(
                () => {
                    throw new Error('Should not happen');
                },
                () => {
                    return f.exists();
                })).resolves.toBe(true);
        });
        test('A call to exists() after create() returns true', async () => {
            const f = makeReadOnlyFile();
            await expect(f.create().then(() => {
                return f.exists();
            })).resolves.toBe(true);
        });
        test('It can be verified that exists() has been called', () => {
            const f = makeReadOnlyFile();
            f.exists();
            expect(f.exists).toHaveBeenCalled();
        });
    });
    describe('Calling create()', () => {
        test('It resolves to false', async () => {
            await expect(makeReadOnlyFile().create()).resolves.toBe(false);
        });
        test('It can be verified that create() has been called', async () => {
            const f = makeReadOnlyFile();
            await expect(f.create()
                .then(() => {return f.create;})
            ).resolves.toHaveBeenCalled();
        });
    });
    describe('Calling read()', () => {
        test('A call to read() after makeReadOnlyFile() returns ""', async() => {
            const f = makeReadOnlyFile();
            expect(f.read()).resolves.toBe('');
        });
        test('A call to read() after makeReadOnlyFile({onRead:"whatever"}) returns "whatever"', async() => {
            const f = makeReadOnlyFile({onRead: 'whatever'});
            expect(f.read()).resolves.toBe('whatever');
        });
        test('A call to read() after let f = makeReadOnlyFile() ; try{f.write("whatever")}catch(error){} returns ""', async() => {
            const f = makeReadOnlyFile();
            expect(f.write('whatever').then(
                ()=>{
                    throw new Error('Should not happen');
                },
                ()=>f.read())
            ).resolves.toBe('');
        });
        test('It can be verified that read() has been called', () => {
            const f = makeReadOnlyFile();
            expect(f.read().then(() => f.read)).resolves.toHaveBeenCalled();
        });
    });
    describe('Calling write("whatever")', () => {
        test('A call to write() is rejected', async () => {
            const f = makeReadOnlyFile();
            await expect(f.write('whatever')).rejects.toThrow();
        });
        test('It can be verified that write() has been called with "whatever"', async () => {
            const f = makeReadOnlyFile();
            await expect(f.write('whatever').then(
                () => {
                    throw new Error('Should not happen');
                },
                () => {
                    return f.write;
                })
            ).resolves.toHaveBeenCalledWith('whatever');
        });
    });
});

describe('==== makeAbsentFile() simulates a non existing file that can be created ====', () => {
    describe('It has expected methods', assertRequiredMethodsOf(makeAbsentFile()));
    describe('Calling exists()', () => {
        test('A call to exists() after instantiation returns false', () => {
            expect(makeAbsentFile().exists()).toBe(false);
        });
        test('A call to exists() after write("whatever") returns true', async () => {
            const f = makeAbsentFile();
            await expect(f.write('whatever').then(() => {
                return f.exists();
            })).resolves.toBe(true);
        });
        test('A call to exists() after create() returns true', async () => {
            const f = makeAbsentFile();
            await expect(f.create().then(() => {
                return f.exists();
            })).resolves.toBe(true);
        });
        test('It can be verified that exists() has been called', () => {
            const f = makeAbsentFile();
            f.exists();
            expect(f.exists).toHaveBeenCalled();
        });
    });
    describe('Calling create()', () => {
        test('It resolves to true', async () => {
            await expect(makeAbsentFile().create()).resolves.toBe(true);
        });
        test('It can be verified that create() has been called', async () => {
            const f = makeAbsentFile();
            await expect(f.create()
                .then(() => {return f.create;})
            ).resolves.toHaveBeenCalled();
        });
    });
    describe('Calling read()', () => {
        test('A call to read() after makeAbsentFile() is rejected', async() => {
            const f = makeAbsentFile();
            expect(f.read()).rejects.toThrow();
        });
        test('A call to read() after let f = makeAbsentFile() ; f.write("whatever") returns "whatever"', async() => {
            const f = makeAbsentFile();
            expect(f.write('whatever').then(()=>f.read())).resolves.toBe('whatever');
        });
        test('It can be verified that read() has been called', () => {
            const f = makeAbsentFile();
            expect(f.read().then(
                () => {
                    throw new Error('Should not happen');
                },
                () => f.read
            )).resolves.toHaveBeenCalled();
        });
    });
    describe('Calling write("whatever")', () => {
        test('A call to write() resolves', async () => {
            const f = makeAbsentFile();
            await expect(f.write('whatever')).resolves.toBeTruthy();
        });
        test('It can be verified that write() has been called with "whatever"', async () => {
            const f = makeAbsentFile();
            expect(f.write('whatever')
                .then(() => {return f.write;})
            ).resolves.toHaveBeenCalledWith('whatever');
        });
    });
});

describe('==== makeUncreatableFile() simulates a non existing file that cannot be created ====', () => {
    describe('It has expected methods', assertRequiredMethodsOf(makeUncreatableFile()));
    describe('Calling exists()', () => {
        test('A call to exists() after instantiation returns false', () => {
            expect(makeUncreatableFile().exists()).toBe(false);
        });
        test('A call to exists() after write("whatever") returns false', async () => {
            const f = makeUncreatableFile();
            await expect(f.write('whatever').then(
                () => {
                    throw new Error('Should not happen');
                },
                () => {
                    return f.exists();
                })).resolves.toBe(false);
        });
        test('A call to exists() after create() returns false', async () => {
            const f = makeUncreatableFile();
            await expect(f.create().then(
                () => {
                    throw new Error('Should not happen');
                },
                () => {
                    return f.exists();
                })).resolves.toBe(false);
        });
        test('It can be verified that exists() has been called', () => {
            const f = makeUncreatableFile();
            f.exists();
            expect(f.exists).toHaveBeenCalled();
        });
    });
    describe('Calling create()', () => {
        test('It is rejected', async () => {
            await expect(makeUncreatableFile().create()).rejects.toThrow();
        });
        test('It can be verified that create() has been called', async () => {
            const f = makeUncreatableFile();
            await expect(f.create()
                .then(
                    () => {
                        throw new Error('Should not happen');
                    },
                    () => {
                        return f.create;
                    })
            ).resolves.toHaveBeenCalled();
        });
    });
    describe('Calling read()', () => {
        test('A call to read() after makeUncreatableFile() is rejected', async() => {
            const f = makeUncreatableFile();
            expect(f.read()).rejects.toThrow();
        });
        test('A call to read() after let f = makeUncreatableFile() ; try{f.write("whatever")}catch(error){} is rejected', async() => {
            const f = makeUncreatableFile();
            expect(f.write('whatever').then(
                ()=>{
                    throw new Error('Should not happen');
                },
                ()=>f.read())
            ).rejects.toThrow();
        });
        test('It can be verified that read() has been called', () => {
            const f = makeUncreatableFile();
            expect(f.read().then(
                () => {
                    throw new Error('Should not happen');
                },
                () => f.read
            )).resolves.toHaveBeenCalled();
        });
    });
    describe('Calling write("whatever")', () => {
        test('A call to write() is rejected', async () => {
            const f = makeUncreatableFile();
            await expect(f.write('whatever')).rejects.toThrow();
        });
        test('It can be verified that write() has been called with "whatever"', async () => {
            const f = makeUncreatableFile();
            await expect(f.write('whatever').then(
                () => {
                    throw new Error('Should not happen');
                },
                () => {
                    return f.write;
                })
            ).resolves.toHaveBeenCalledWith('whatever');
        });
    });
});
