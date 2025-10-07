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
        #subscriptions;

        constructor(serializedState) {
            this.#element = this.#globals.document.createElement('div');
            this.#element.classList.add('cmake-builder-provider-by-sporniket-main');

            const message = this.#globals.document.createElement('div');
            message.textContent = 'The CmakeBuilderProviderMainView is here';
            message.classList.add('message');
            this.#element.appendChild(message);

            // TODO : change callback for something usefull.
            this.#subscriptions = this.#globals.atom.workspace.getCenter().observeActivePaneItem(item => {
                if (!atom.workspace.isTextEditor(item)) {return;}
                message.innerHTML = `
        <h2>${item.getFileName() || 'untitled'}</h2>
        <ul>
          <li><b>Soft Wrap:</b> ${item.softWrapped}</li>
          <li><b>Tab Length:</b> ${item.getTabLength()}</li>
          <li><b>Encoding:</b> ${item.getEncoding()}</li>
          <li><b>Line Count:</b> ${item.getLineCount()}</li>
        </ul>
      `;
            });
            this.#globals.log('Constructed CmakeBuilderProviderMainView.');
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

        destroy() {
            this.#subscriptions.dispose();
            this.#element.remove();
        }
    };
}
