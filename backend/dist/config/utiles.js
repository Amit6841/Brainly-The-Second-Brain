"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genHash = genHash;
function genHash(len) {
    const allowedValue = "azxnvkfjasdfsloiewt1234567890rqopwruit";
    let hash = "";
    for (let i = 0; i < len; i++) {
        const element = allowedValue[Math.floor(Math.random() * allowedValue.length)];
        hash = hash + element;
    }
    return hash;
}
