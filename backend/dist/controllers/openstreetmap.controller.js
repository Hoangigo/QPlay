"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAddressData = void 0;
const axios_1 = __importDefault(require("axios"));
// get address data from openstreetmap method 
//
const getAddressData = async (req, res) => {
    const lat = req.params.lat;
    const lng = req.params.lng;
    await axios_1.default.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`).then((response) => {
        if (response.data.address) {
            const address = {
                number: response.data.address.house_number,
                street: response.data.address.road,
                city: response.data.address.city,
                country: response.data.address.country,
                zip: response.data.address.postcode,
            };
            // send address
            return res.status(200).send(address);
        }
    }).catch((error) => {
        return res.status(400).json({
            "error": error
        });
    });
};
exports.getAddressData = getAddressData;
