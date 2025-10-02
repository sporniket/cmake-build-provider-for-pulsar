/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

export function createCmakeBuilderProviderMainViewClass(globals, config) {
    return class CmakeBuilderProviderMainView {
        #globals = globals;
        #config = config;
        #element;

        constructor(serializedState) {
            this.#element = {};
        }

        getTitle() {
            return 'CMake builder provider &mdash; Status';
        }

        getElement() {
            return this.#element;
        }

        getDefaultLocation() {
            return 'bottom';
        }

        getAllowedLocations() {
            return ['left', 'right', 'bottom'];
        }

        getURI() {
            return 'atom://cmake-builder-provider-by-sporniket/main';
        }

        serialize() {
            return {};
        }

        destroy() {}
    };
}
