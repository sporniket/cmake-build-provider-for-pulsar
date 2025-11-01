'use strict';
import {jest} from '@jest/globals';

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

// === mocking atom ===
const subscriptionActivePane = {
    dispose: jest.fn()
};

const workspaceCenter = {
    observeActivePaneItem: jest.fn(() => {
        return subscriptionActivePane;
    })
};

const atom = {
    workspace: {
        getCenter: () => {
            return workspaceCenter;
        }
    }
};

// === mocking DOM api ===
function mockDomElement() {
    return {
        textContent: null,
        remove: jest.fn(),
        appendChild: jest.fn(),
        classList: {
            add: jest.fn()
        }
    };
}

const mainElement = mockDomElement();
const messageElement = mockDomElement();

const document = {
    createElement: jest.fn(() => {
        return messageElement;
    }).mockImplementationOnce(() => {
        return mainElement;
    })
};

// === stubing globals ===
const logger = jest.fn();

beforeEach(()=>{
    document.createElement.mockImplementation(() => {
        return messageElement;
    }).mockImplementationOnce(() => {
        return mainElement;
    });
});

afterEach(() =>{
    document.createElement.mockClear();
});


describe('Class CmakeBuilderProvider', () => {
    const mainViewClass = createCmakeBuilderProviderMainViewClass({pulsar: atom, document, log: logger}, {});
    let view; // need to call the constructor in a test to have mocks properly setup.
    test('It MUST have a constructor preparing the view', () => {
        view = new mainViewClass({what: 'ever'});
        expect(logger).toHaveBeenCalledWith('Constructed CmakeBuilderProviderMainView.');
        expect(document.createElement).toHaveBeenCalledWith('div');
        expect(workspaceCenter.observeActivePaneItem).toHaveBeenCalled();
    });
    test('It MUST have a title', () => {
        expect(view.getTitle()).toBe('CMake builder provider -- Status');
    });
    test('It MUST have an URI', () => {
        expect(view.getURI()).toBe('atom://cmake-builder-provider-by-sporniket/main');
    });
    test('It MUST have a body', () => {
        const element = view.getElement();
        expect(element).toBeDefined();
        expect(element).toBe(mainElement);
        expect(element.classList).toBeDefined();
        expect(element.classList.add).toBeDefined();
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
        expect(subscriptionActivePane.dispose).toHaveBeenCalled();
        expect(mainElement.remove).toHaveBeenCalled();
    });
});
