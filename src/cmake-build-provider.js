'use strict';
import {createCmakeBuilderProviderClass} from './classCmakeBuilderProvider';
// TODO -- import e.g. import { CompositeDisposable, Disposable} from 'atom';
/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

export default {
    activate(state) {
        console.log('CMake build provider activated.');
    },
    deactivate() {
        console.log('CMake build provider de-activated.');
    },
    // actions entry points
    toggleMain() {
        atom.workspace.toggle('atom://cmake-builder-provider-by-sporniket/main');
    },
    // provided services entry points
    provideBuilder() {return createCmakeBuilderProviderClass({}, {niceName: {prefix: 'CMake builders of'}});},
    // consumed services entry points
};
