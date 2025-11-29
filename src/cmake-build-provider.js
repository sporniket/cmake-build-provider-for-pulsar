'use strict';
import {createCmakeBuilderProviderClass} from './classCmakeBuilderProvider';
import {createCmakeBuilderProviderMainViewClass} from './classCmakeBuilderProviderMainView';
import {CmakeIntegrationEngine} from './classCmakeIntegrationEngine';
import {CompositeDisposable, Disposable} from 'atom';
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

function buildGlobals(givenGlobals) {
    const jsGlobals = {
        pulsar: givenGlobals?.pulsar || atom,
        document: givenGlobals?.document || document,
        log: givenGlobals?.log || console.log
    };
    return {
        engine: givenGlobals?.engine || new CmakeIntegrationEngine(jsGlobals),
        ...jsGlobals
    };
}

export default {
    /**
     * Required extension point to start the plugin.
     *
     * @param state provided by pulsar, the plugin MAY restore its previously saved state.
     * @param givenGlobals <b>UNOFFICIAL ARGUMENTS FOR TESTING</b> a way to inject atom, document, console.log,... ;
     * @see buildGlobals(givenGlobals)
     */
    activate(state, givenGlobals) {
        const _globals = buildGlobals(givenGlobals);

        _globals.log('CMake build provider activated.');
        const mainViewClass = createCmakeBuilderProviderMainViewClass(_globals, {});
        subscriptions = new CompositeDisposable(
            _globals.pulsar.workspace.addOpener((uri) => {
                if (uri === 'atom://cmake-builder-provider-by-sporniket/main') {
                    return new mainViewClass();
                }
                return null;
            }),
            // Register command that toggles this view
            _globals.pulsar.commands.add('atom-workspace', {
                'cmake-build-provider-for-pulsar-by-sporniket:toggleMain': () => this.toggleMain()
            }),

            new Disposable(() => {
                _globals.pulsar.workspace.getPaneItems().forEach((item) => {
                    if (item instanceof mainViewClass) {
                        item.destroy();
                    }
                });
            })
        );
        return _globals.engine.asyncInitializeState();
    },
    /**
     * Required extension point to stop the plugin.
     *
     * @param givenGlobals <b>UNOFFICIAL ARGUMENTS FOR TESTING</b> a way to inject atom, document, console.log,... ;
     * @see buildGlobals(givenGlobals)
     */
    deactivate(givenGlobals) {
        const _globals = buildGlobals(givenGlobals);
        _globals.log('CMake build provider de-activated.');
        //subscriptions.dispose();
    },
    // actions entry points
    toggleMain(givenGlobals) {
        const _globals = buildGlobals(givenGlobals);
        _globals.log('CMake build provider toggleMain.');
        _globals.pulsar.workspace.toggle('atom://cmake-builder-provider-by-sporniket/main');
    },
    // provided services entry points
    provideBuilder(givenGlobals) {
        const _globals = buildGlobals(givenGlobals);
        return createCmakeBuilderProviderClass(_globals, {niceName: {prefix: 'CMake builders of'}});
    },
    // consumed services entry points
};
