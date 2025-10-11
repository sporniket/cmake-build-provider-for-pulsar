'use-strict';
import {jest} from '@jest/globals';

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

export const documentMock = {
    createElement: jest.fn(mockDomElement)
};
