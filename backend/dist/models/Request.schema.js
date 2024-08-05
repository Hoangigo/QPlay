"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SearchTrackSchema = void 0;
const yup_1 = require("yup");
exports.SearchTrackSchema = (0, yup_1.object)({
    q: (0, yup_1.string)().required(),
    limit: (0, yup_1.string)().required()
});
