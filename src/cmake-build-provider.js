'use strict';
import {createCmakeBuilderProviderClass} from './classCmakeBuilderProvider';
import {createCmakeBuilderProviderMainViewClass} from './classCmakeBuilderProviderMainView';
import { CompositeDisposable, Disposable } from 'atom';
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

export let subscriptions = null;

export default {
    activate(state, givenGlobals) {
        if (givenGlobals){
            givenGlobals.log(givenGlobals.document);
        }
        const globals = {
            atom: givenGlobals?.atom || atom,
            document: givenGlobals?.document || document,
            log: givenGlobals?.log || console.log
        };

        console.log('CMake build provider activated.');
        const mainViewClass = createCmakeBuilderProviderMainViewClass(globals, {});
        subscriptions = new CompositeDisposable(
            atom.workspace.addOpener((uri) => {
                if (uri === 'atom://cmake-builder-provider-by-sporniket/main') {
                    return new mainViewClass();
                }
                return null;
            }),
            new Disposable(() => {
                atom.workspace.getPaneItems().forEach((item) => {
                    if (item instanceof mainViewClass) {
                        item.destroy();
                    }
                });
            })
        );
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
