import { Request, Response } from "express";
import axios, { AxiosError, AxiosResponse } from 'axios';

// get address data from openstreetmap method 
//
export const getAddressData = async (req: Request, res: Response) => {
    const lat = req.params.lat;
    const lng = req.params.lng;

    await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`).then((response: AxiosResponse) => {
        if (response.data.address) {
            const address = {
                number: response.data.address.house_number,
                street: response.data.address.road,
                city: response.data.address.city,
                country: response.data.address.country,
                zip: response.data.address.postcode,
            }
            // send address
            return res.status(200).send(address);
        }
    }).catch((error: AxiosError) => {
        return res.status(400).json({
            "error": error
        });
    });
}