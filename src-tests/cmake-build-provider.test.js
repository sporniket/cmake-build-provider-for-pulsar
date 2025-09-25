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
    describe.each([
        ['activate'],
        ['deactivate'],
        ['provideBuilder']
    ])('the plugin has required function "%s"', (f) => {
        const dut = cmakeBuildProvider[f]
        test(`${dut} is a function`, () => {
            expect(dut).toBeInstanceOf(Function);
        });
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
        const providerClass = cmakeBuildProvider.provideBuilder()
        expect(providerClass).toBeDefined();
        const provider = new providerClass("whatever")
        for(let f of ["constructor","destructor","getNiceName", "isEligible", "settings", "on", "removeAllListeners"]) {
            const dut = provider[f]
            test(`${dut} is a function`, () => {
                expect(dut).toBeInstanceOf(Function)
            })
        }
    });
});
