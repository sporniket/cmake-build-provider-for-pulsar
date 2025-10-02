'use strict';

/* SPDX-License-Identifier: GPL-3.0-or-later */
/****************************************

---
Copyright (C) 2025 David SPORN
---
This is part of **cmake-build-provider-for-pulsar-by-sporniket**.
A build provider to maintain a list of cmake targets, for Pulsar,
the community-led, hyper-hackable text editor..
****************************************/

export function inject(values, recipient) {
    let orig = {};
    for (const [key, value] of Object.entries(values)) {
        orig[key] = recipient[key];
        recipient[key] = value;
    }
    return orig;
}
