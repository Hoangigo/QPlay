import { Request, Response } from "express";
import Host from "../models/host.model";
import Event from "../models/event.model"
import Vote from "../models/voteactivity.model";
import Auction from "../models/auctionactivity.model";
import Bet from "../models/bet.model";
import Suggestion from "../models/suggestion.model";
import VoteOption from "../models/voteoption.model";
import bcrypt from "bcrypt";
import { sendEmail } from "../helper/mail.helper";
import crypto from 'crypto';
import { checkRequestForToken, generateToken } from "../helper/token.helper";

// get existing host method 
//
export const getExistingHost = async (req: Request, res: Response) => {
    // search if host with email exists
    const host = await Host.findOne({ email: req.body.email });

    // host with this email does not exist
    if (!host) {
        return res.status(404).json({
            error: "host does not exist!"
        });
    }

    // compare the passwords
    if (!bcrypt.compareSync(req.body.password, host.password)) {
        return res.status(401).json({
            error: "invalid credentials!"
        });
    }

    // create token
    const token = generateToken({
        email: host.email,
        _id: host._id,
    });

    // entered data is correct, so send token
    return res.status(201).json({
        title: 'login succeded',
        token: token,
        email: host.email
    });
}

// create new host method
//
export const createNewHost = async (req: Request, res: Response) => {
    // check if email already exists
    await Host.findOne({ email: req.body.email }).then((response) => {
        if (response) {
            // email already exists in database
            return res.status(409).json({ 
                error: "your email is already registered!" 
            });
        }
    });

    const saltRounds = 10;
    let hashedPassword = '';

    // hash password
    await bcrypt.hash(req.body.password, saltRounds).then((hash: string) => {
        hashedPassword = hash;
    }).catch((err: any) => {
        console.log(err);
        return;
    });

    // create new host object
    const newHost = new Host({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        isConfirmed: false,
    });

    // save new host in database
    await newHost.save().catch((err: any) => {
        console.log(err);
        return;
    });

    // send email for verification
    const link = `http://localhost:6969/confirm/?id=${newHost._id}`;
    const subject = "⭐WELCOME TO QPLAY⭐ PLEASE VERIFY YOUR EMAIL ADDRESS";
    const html = `<a href=${link}>Verify Email.</a>`;
    sendEmail(subject, newHost.email, html);

    // successfully created and stored
    return res.status(201).send(newHost);
}

// verify email confirmation method
//
export const verifyEmailConfirmation = async (req: Request, res: Response) => {
    const host = await Host.findOne({ _id: req.params.id });

    // host does not exist
    if (!host) {
        return res.status(404).json({
            error: "host not found!"
        });
    }

    // host is already confirmed
    if (host.isConfirmed) {
        return res.status(409).json({
            error: "email is already verified!"
        });
    }

    // host is confirmed
    host.isConfirmed = true;
    await host.save().catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(201).send(host);
}

// request reset host password method
//
export const resetRequestHostPassword = async (req: Request, res: Response) => {
    const host = await Host.findOne({ email: req.body.email });

    if (!host) {
        return res.status(404).json({
            error: "host not found!"
        });
    }

    // create random token
    const resetToken = crypto.randomBytes(20).toString('hex');

    // set data for host
    host.resetPasswordToken = resetToken;
    host.resetPasswordExpires = Date.now() + 900000; // token expires in 15 min

    await host.save().catch((err: any) => {
        console.log(err);
        return;
    });

    const subject = "QPLAY - PASSWORD RESET";
    const link = `http://localhost:6969/password/reset/?token=${resetToken}`;
    const html = `<a href=${link}>Reset Password.</a>`;
    sendEmail(subject, host.email, html);

    return res.status(200).send({
        title: "successfully send email"
    });
}

// confirm reset password token
//
export const confirmResetPasswordToken = async (req: Request, res: Response) => {
    const host = await Host.findOne({ resetPasswordToken: req.body.token });

    if (!host || req.body.token === null) {
        return res.status(404).json({
            error: "token not found"
        });
    }

    // check if token is invalid
    if (host && host.resetPasswordExpires < Date.now()) {
        host.resetPasswordExpires = null;
        host.resetPasswordToken = null;

        await host.save().catch((err: any) => {
            console.log(err);
            return;
        });

        return res.status(401).json({
            error: "token is expired!"
        });
    }

    // token exists
    return res.status(200).send(host);
}

// reset host password method
//
export const resetHostPassword = async (req: Request, res: Response) => {
    const host = await Host.findOne({
        resetPasswordToken: req.body.token,
        resetPasswordExpires: { $gt: Date.now() },
    });

    if (!host) {
        return res.status(400).json({
            error: "error while resetting password"
        });
    }

    // set new password
    const saltRounds = 10;
    let hashedPassword = '';
    await bcrypt.hash(req.body.password, saltRounds).then((hash: string) => {
        hashedPassword = hash;
    }).catch((err: any) => {
        console.log(err);
        return;
    });
    host.password = hashedPassword;

    // reset token
    host.resetPasswordToken = null;
    host.resetPasswordExpires = null;

    await host.save().catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(201).send(host);
}

// get host by email method
//
export const getHostByEmail = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    const host = await Host.findOne({ email: req.params.email }).populate('events');

    if (!host) {
        return res.status(404).json({
            error: "host not found"
        });
    }

    return res.status(200).send(host);
}

// delete host method
//
export const deleteHost = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    const host = await Host.findOneAndDelete({ email: req.params.email });

    if (!host) {
        return res.status(404).json({
            title: "host not found"
        });
    }

    // delete host events
    const hostEvents = host.get('events');
    for (let i = 0; i < hostEvents.length; i++) {
        let event = await Event.findOneAndDelete({ _id: hostEvents[i]._id });

        if (event) {
            let eventAuctions = event.get('auctionActivities');
            let eventVotes = event.get('voteActivities');
            let eventSuggestions = event.get('suggestions');

            // delete event auctions
            for (let j = 0; j < eventAuctions.length; j++) {
                let auction = await Auction.findOneAndDelete({ _id: eventAuctions[j]._id  });
                
                if (auction) {
                    // delete bets in auctions
                    let auctionBets = auction.get('bets');
                    for (let k = 0; k < auctionBets.length; k++) {
                        await Bet.findOneAndDelete({ _id: auctionBets[k]._id }).catch((err: any) => {
                            console.log(err);
                            return;
                        });
                    }
                }
            }

            // delete event votes
            for (let k = 0; k < eventVotes.length; k++) {
                let vote = await Vote.findOneAndDelete({ _id: eventVotes[k]._id });

                if (vote) {
                    // delete options in votes
                    let voteOptions = vote.get('voteOptions');
                    for (let l = 0; l < voteOptions.length; l++) {
                        await VoteOption.findOneAndDelete({ _id: voteOptions[l]._id }).catch((err: any) => {
                            console.log(err);
                            return;
                        });
                    }

                }
            }

            // delete event suggestions
            for (let l = 0; l < eventSuggestions.length; l++) {
                await Suggestion.findOneAndDelete({ _id: eventSuggestions[l]._id }).catch((err: any) => {
                    console.log(err);
                    return;
                });
            }
        } 
    }

    return res.status(204).json({
        title: "host succesfully deleted"
    });
}

// update host method
//
export const updateHost = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }; // this route is protected, check the token

    const host = await Host.findOne({ email: req.params.email });

    if (!host) {
        return res.status(404).json({
            error: "host not found"
        });
    }

    // change name if variable is not undefined
    if (req.body.name) {
        host.name = req.body.name;
    }

    // change email if variable is not undefined
    let emailChanged = false;
    if (req.body.email) {
        host.email = req.body.email;
        host.isConfirmed = false;
        emailChanged = true;
    }

    await host.save().catch((err: any) => {
        console.log(err);
        return;
    });

    if (emailChanged) {
        // send email for verification
        const link = `http://localhost:6969/confirm/?id=${host._id}`;
        const subject = "QPLAY - PLEASE VERIFY YOUR NEW EMAIL ADRESS"
        const html = `<a href=${link}>Verify Email.</a>`;
        sendEmail(subject, host.email, html);
    }

    return res.status(201).send(host);
}

// change host password method
//
export const changeHostPassword = async (req: Request, res: Response) => {
    if (!checkRequestForToken(req)) {
        return;
    }; // this route is protected, check the token
    
    const host = await Host.findOne({ email: req.params.email });

    if (!host) {
        return res.status(404).json({
            error: "host not found"
        });
    }

    // compare if old password is correct
    if (!bcrypt.compareSync(req.body.oldPassword, host.password)) {
        return res.status(401).json({ 
            error: "invalid credentials!" 
        });
    }

    // set new password
    const saltRounds = 10;
    let hashedPassword = '';
    await bcrypt.hash(req.body.newPassword, saltRounds).then((hash: string) => {
        hashedPassword = hash;
    }).catch((err: any) => {
        console.log(err);
        return;
    });
    host.password = hashedPassword;

    await host.save().catch((err: any) => {
        console.log(err);
        return;
    });

    return res.status(201).json({
        title: "password succesfully changed"
    });
}