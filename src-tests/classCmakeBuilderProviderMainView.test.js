'use strict';
import {createCmakeBuilderProviderMainViewClass} from '../src/classCmakeBuilderProviderMainView';
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
    const mainViewClass = createCmakeBuilderProviderMainViewClass({}, {});
    const view = new mainViewClass({what: 'ever'});
    test('It MUST have a constructor accepting a serialized state', () => {
        expect(false).toBe(true);
    });
    test('It MUST have a title', () => {
        expect(view.getTitle()).toBe('CMake builder provider &mdash; Status');
    });
    test('It MUST have an URI', () => {
        expect(view.getURI()).toBe('atom://cmake-builder-provider-by-sporniket/main');
    });
    test('It MUST have a body', () => {
        expect(view.getElement()).toBeDefined();
    });
    test('It MUST be located at the bottom by default', () => {
        expect(view.getDefaultLocation()).toBe('bottom');
    });
    test('It MUST be located in a dock', () => {
        expect(view.getAllowedLocations()).toStrictEqual(['left', 'right', 'bottom']);
    });
    test('It MUST provide a serialized state to enable restoration', () => {
        expect(view.serialize()).toBeDefined();
    });
    test('It MUST free all resources on destruction', () => {
        view.destroy();
        expect(false).toBe(true);
    });
});
