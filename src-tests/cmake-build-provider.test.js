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

describe('\n  ======== PREFLIGHT the plugin looks valid ========\n', () => {
    describe('it has required functions', () => {
        for (let f of ['activate', 'deactivate', 'provideBuilder']) {
            const dut = cmakeBuildProvider[f];
            test(`${f} is a function`, () => {
                expect(dut).toBeInstanceOf(Function);
            });
        }
    });
});

describe('\n  ======== LIFECYCLE plugin activation ========\n', () => {
    test('[TODO] it MUST reload plugin configuration', () => {
        expect('TODO').toBeDefined();
    });
    test('[TODO] it MUST reload the configuration of each projects', () => {
        expect('TODO').toBeDefined();
    });
    test('[TODO] it MUST defer resyncing projects', () => {
        expect('TODO').toBeDefined();
    });
});

describe('\n  ======== LIFECYCLE plugin deactivation ========\n', () => {
    test('[TODO] it MUST serialize latest states', () => {
        expect('TODO').toBeDefined();
    });
    test('[TODO] it MUST unsubscribe from any subscriptions', () => {
        expect('TODO').toBeDefined();
    });
    test('[TODO] it MUST defer resyncing projects', () => {
        expect('TODO').toBeDefined();
    });
});

describe('\n  ======== SERVICE providing «builder» ========\n', () => {
    describe('[TODO] it MUST returns a builder provider', () => {
        const providerClass = cmakeBuildProvider.provideBuilder();
        expect(providerClass).toBeDefined();
        const provider = new providerClass('whatever');
        for (let f of ['constructor', 'destructor', 'getNiceName', 'isEligible', 'settings', 'on', 'removeAllListeners']) {
            const dut = provider[f];
            test(`${f} is a function`, () => {
                expect(dut).toBeInstanceOf(Function);
            });
        }
    });
    describe('Class CmakeBuilderProvider', () => {
        const providerClass = cmakeBuildProvider.provideBuilder();
        const provider = new providerClass('whatever');
        test('It MUST return the expected nice name', () => {
            expect(provider.getNiceName()).toBe('CMake builders of \'whatever\'');
        });
        test('It MUST always be eligible', () => {
            expect(provider.isEligible()).toBe(true);
        });
        test('It MUST return a list of builds', () => {
            expect(provider.settings()).toStrictEqual([{
                'cmd': 'echo',
                'name': 'cmake:whatever> echo',
                'args': ['CMake builders of \'whatever\''],
                'sh': true,
                'cwd': 'whatever'
            }]);
        });
    });
});
