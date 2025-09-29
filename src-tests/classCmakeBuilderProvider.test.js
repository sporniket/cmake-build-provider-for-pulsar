'use strict';
import {createCmakeBuilderProviderClass} from '../src/classCmakeBuilderProvider';
/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/
describe('Class CmakeBuilderProvider', () => {
    const providerClass = createCmakeBuilderProviderClass({}, {niceName: {prefix: 'CMake builders of'}});
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
