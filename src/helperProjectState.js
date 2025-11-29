import {FILE_NAME__SHARED_PRESETS, FILE_NAME__PRIVATE_PRESETS} from './consts';
import {isArray} from './utilsType';
/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

export function asyncInitializeProjectState(directory, defaultPresetsBody) {
    const state = {
        directory,
        isCmakeProject: false,
        errors: [],
        warnings: []
    };

    const cmakelistFile = state.directory.getFile('CMakeLists.txt');

    // step 1 : eligibility
    if (!cmakelistFile.exists()) {
        return Promise.resolve(state);
    }
    state.isCmakeProject = true;
    state.isLanguageCppOrC = true;

    // step 2 : enforce presets existence
    const cmakeSharedPresetFile = state.directory.getFile(FILE_NAME__SHARED_PRESETS);
    if (cmakeSharedPresetFile.exists()) {
        return Promise.resolve(state);
    }
    const cmakeLocalPresetFile = state.directory.getFile(FILE_NAME__PRIVATE_PRESETS);
    if (cmakeLocalPresetFile.exists()) {
        return Promise.resolve(state);
    }

    return cmakeSharedPresetFile
        .write(defaultPresetsBody)
        .then(() => {return state;})
        .catch(() => {
            state.errors.push(`cannot.create.preset:${FILE_NAME__SHARED_PRESETS}`);
            return state;
        });
}

// ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ==== ====

function asyncLoadPresets(state, presetsFileName, registryFieldName) {
    const presetsFile = state.directory.getFile(presetsFileName);
    if (!presetsFile.exists()) {
        return Promise.resolve(state);
    }
    return presetsFile.read()
        .then(
            (presetsBody) => {
                const presets = JSON.parse(presetsBody);
                return isArray(presets.configurePresets) ? { data: {
                    order: presets.configurePresets.map((p) => p.name),
                    registry: new Map(
                        presets.configurePresets.map((p) => [p.name, p])
                    )
                }} : { data: {
                    order: [],
                    registry: new Map()
                }};
            },
            (error) => {
                return { warnings: [
                    `cannot.read.file:${presetsFileName}:${error}`
                ]};
            }
        ).then((response) => {
            if (response.data) {
                state.cmakePresets[registryFieldName] = response.data;
            } else if (response.warnings) {
                state.warnings.push(...response.warnings);
            }
            return state;
        });
}

function chooseActivePresetOfProjectState(state) {
    const hasSharedPresets = state.cmakePresets.public.registry.size > 0;
    const hasNoPresets = !hasSharedPresets && state.cmakePresets.private.registry.size === 0;
    if (hasNoPresets) {
        state.errors.push('no.preset.after.load');
        return state;
    }
    const hasValidSelectedPreset = (!!state.selectedCmakePreset && ['public', 'private'].includes(state.selectedCmakePreset.registry) && state.cmakePresets.registry[state.selectedCmakePreset.registry].has(state.selectedCmakePreset.id));
    if (hasValidSelectedPreset) {
        return state;
    }

    if (hasSharedPresets) {
        state.selectedCmakePreset = {
            registry: 'public',
            id: state.cmakePresets.public.order[0]
        };
    } else {
        state.selectedCmakePreset = {
            registry: 'private',
            id: state.cmakePresets.private.order[0]
        };
    }

    return state;
}

function resetPresetsOfProjectState(state) {
    state.selectedCmakePreset = {};
    state.cmakePresets = {
        public: {
            order: [],
            registry: new Map()
        },
        private: {
            order: [],
            registry: new Map()
        },

    };
    return state;
}

export function asyncUpdateProjectStateWithPresets(projectState) {
    if (!projectState.isCmakeProject) {
        return Promise.resolve(projectState);
    }
    resetPresetsOfProjectState(projectState);
    return asyncLoadPresets(projectState, FILE_NAME__SHARED_PRESETS, 'public')
        .then((state) => {
            return asyncLoadPresets(state, FILE_NAME__PRIVATE_PRESETS, 'private');
        })
        .then(chooseActivePresetOfProjectState);
}
