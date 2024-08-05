"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeHostPassword = exports.updateHost = exports.deleteHost = exports.getHostByEmail = exports.resetHostPassword = exports.confirmResetPasswordToken = exports.resetRequestHostPassword = exports.verifyEmailConfirmation = exports.createNewHost = exports.getExistingHost = void 0;
const host_model_1 = __importDefault(require("../models/host.model"));
const event_model_1 = __importDefault(require("../models/event.model"));
const voteactivity_model_1 = __importDefault(require("../models/voteactivity.model"));
const auctionactivity_model_1 = __importDefault(require("../models/auctionactivity.model"));
const bet_model_1 = __importDefault(require("../models/bet.model"));
const suggestion_model_1 = __importDefault(require("../models/suggestion.model"));
const voteoption_model_1 = __importDefault(require("../models/voteoption.model"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const mail_helper_1 = require("../helper/mail.helper");
const crypto_1 = __importDefault(require("crypto"));
const token_helper_1 = require("../helper/token.helper");
// get existing host method 
//
const getExistingHost = async (req, res) => {
    // search if host with email exists
    const host = await host_model_1.default.findOne({ email: req.body.email });
    // host with this email does not exist
    if (!host) {
        return res.status(404).json({
            error: "host does not exist!"
        });
    }
    // compare the passwords
    if (!bcrypt_1.default.compareSync(req.body.password, host.password)) {
        return res.status(401).json({
            error: "invalid credentials!"
        });
    }
    // create token
    const token = (0, token_helper_1.generateToken)({
        email: host.email,
        _id: host._id,
    });
    // entered data is correct, so send token
    return res.status(201).json({
        title: 'login succeded',
        token: token,
        email: host.email
    });
};
exports.getExistingHost = getExistingHost;
// create new host method
//
const createNewHost = async (req, res) => {
    // check if email already exists
    await host_model_1.default.findOne({ email: req.body.email }).then((response) => {
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
    await bcrypt_1.default.hash(req.body.password, saltRounds).then((hash) => {
        hashedPassword = hash;
    }).catch((err) => {
        console.log(err);
        return;
    });
    // create new host object
    const newHost = new host_model_1.default({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        isConfirmed: false,
    });
    // save new host in database
    await newHost.save().catch((err) => {
        console.log(err);
        return;
    });
    // send email for verification
    const link = `http://localhost:6969/confirm/?id=${newHost._id}`;
    const subject = "⭐WELCOME TO QPLAY⭐ PLEASE VERIFY YOUR EMAIL ADDRESS";
    const html = `<a href=${link}>Verify Email.</a>`;
    (0, mail_helper_1.sendEmail)(subject, newHost.email, html);
    // successfully created and stored
    return res.status(201).send(newHost);
};
exports.createNewHost = createNewHost;
// verify email confirmation method
//
const verifyEmailConfirmation = async (req, res) => {
    const host = await host_model_1.default.findOne({ _id: req.params.id });
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
    await host.save().catch((err) => {
        console.log(err);
        return;
    });
    return res.status(201).send(host);
};
exports.verifyEmailConfirmation = verifyEmailConfirmation;
// request reset host password method
//
const resetRequestHostPassword = async (req, res) => {
    const host = await host_model_1.default.findOne({ email: req.body.email });
    if (!host) {
        return res.status(404).json({
            error: "host not found!"
        });
    }
    // create random token
    const resetToken = crypto_1.default.randomBytes(20).toString('hex');
    // set data for host
    host.resetPasswordToken = resetToken;
    host.resetPasswordExpires = Date.now() + 900000; // token expires in 15 min
    await host.save().catch((err) => {
        console.log(err);
        return;
    });
    const subject = "QPLAY - PASSWORD RESET";
    const link = `http://localhost:6969/password/reset/?token=${resetToken}`;
    const html = `<a href=${link}>Reset Password.</a>`;
    (0, mail_helper_1.sendEmail)(subject, host.email, html);
    return res.status(200).send({
        title: "successfully send email"
    });
};
exports.resetRequestHostPassword = resetRequestHostPassword;
// confirm reset password token
//
const confirmResetPasswordToken = async (req, res) => {
    const host = await host_model_1.default.findOne({ resetPasswordToken: req.body.token });
    if (!host || req.body.token === null) {
        return res.status(404).json({
            error: "token not found"
        });
    }
    // check if token is invalid
    if (host && host.resetPasswordExpires < Date.now()) {
        host.resetPasswordExpires = null;
        host.resetPasswordToken = null;
        await host.save().catch((err) => {
            console.log(err);
            return;
        });
        return res.status(401).json({
            error: "token is expired!"
        });
    }
    // token exists
    return res.status(200).send(host);
};
exports.confirmResetPasswordToken = confirmResetPasswordToken;
// reset host password method
//
const resetHostPassword = async (req, res) => {
    const host = await host_model_1.default.findOne({
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
    await bcrypt_1.default.hash(req.body.password, saltRounds).then((hash) => {
        hashedPassword = hash;
    }).catch((err) => {
        console.log(err);
        return;
    });
    host.password = hashedPassword;
    // reset token
    host.resetPasswordToken = null;
    host.resetPasswordExpires = null;
    await host.save().catch((err) => {
        console.log(err);
        return;
    });
    return res.status(201).send(host);
};
exports.resetHostPassword = resetHostPassword;
// get host by email method
//
const getHostByEmail = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    const host = await host_model_1.default.findOne({ email: req.params.email }).populate('events');
    if (!host) {
        return res.status(404).json({
            error: "host not found"
        });
    }
    return res.status(200).send(host);
};
exports.getHostByEmail = getHostByEmail;
// delete host method
//
const deleteHost = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    const host = await host_model_1.default.findOneAndDelete({ email: req.params.email });
    if (!host) {
        return res.status(404).json({
            title: "host not found"
        });
    }
    // delete host events
    const hostEvents = host.get('events');
    for (let i = 0; i < hostEvents.length; i++) {
        let event = await event_model_1.default.findOneAndDelete({ _id: hostEvents[i]._id });
        if (event) {
            let eventAuctions = event.get('auctionActivities');
            let eventVotes = event.get('voteActivities');
            let eventSuggestions = event.get('suggestions');
            // delete event auctions
            for (let j = 0; j < eventAuctions.length; j++) {
                let auction = await auctionactivity_model_1.default.findOneAndDelete({ _id: eventAuctions[j]._id });
                if (auction) {
                    // delete bets in auctions
                    let auctionBets = auction.get('bets');
                    for (let k = 0; k < auctionBets.length; k++) {
                        await bet_model_1.default.findOneAndDelete({ _id: auctionBets[k]._id }).catch((err) => {
                            console.log(err);
                            return;
                        });
                    }
                }
            }
            // delete event votes
            for (let k = 0; k < eventVotes.length; k++) {
                let vote = await voteactivity_model_1.default.findOneAndDelete({ _id: eventVotes[k]._id });
                if (vote) {
                    // delete options in votes
                    let voteOptions = vote.get('voteOptions');
                    for (let l = 0; l < voteOptions.length; l++) {
                        await voteoption_model_1.default.findOneAndDelete({ _id: voteOptions[l]._id }).catch((err) => {
                            console.log(err);
                            return;
                        });
                    }
                }
            }
            // delete event suggestions
            for (let l = 0; l < eventSuggestions.length; l++) {
                await suggestion_model_1.default.findOneAndDelete({ _id: eventSuggestions[l]._id }).catch((err) => {
                    console.log(err);
                    return;
                });
            }
        }
    }
    return res.status(204).json({
        title: "host succesfully deleted"
    });
};
exports.deleteHost = deleteHost;
// update host method
//
const updateHost = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return res.status(403).json({
            error: 'Unauthorized call'
        });
    }
    ; // this route is protected, check the token
    const host = await host_model_1.default.findOne({ email: req.params.email });
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
    await host.save().catch((err) => {
        console.log(err);
        return;
    });
    if (emailChanged) {
        // send email for verification
        const link = `http://localhost:6969/confirm/?id=${host._id}`;
        const subject = "QPLAY - PLEASE VERIFY YOUR NEW EMAIL ADRESS";
        const html = `<a href=${link}>Verify Email.</a>`;
        (0, mail_helper_1.sendEmail)(subject, host.email, html);
    }
    return res.status(201).send(host);
};
exports.updateHost = updateHost;
// change host password method
//
const changeHostPassword = async (req, res) => {
    if (!(0, token_helper_1.checkRequestForToken)(req)) {
        return;
    }
    ; // this route is protected, check the token
    const host = await host_model_1.default.findOne({ email: req.params.email });
    if (!host) {
        return res.status(404).json({
            error: "host not found"
        });
    }
    // compare if old password is correct
    if (!bcrypt_1.default.compareSync(req.body.oldPassword, host.password)) {
        return res.status(401).json({
            error: "invalid credentials!"
        });
    }
    // set new password
    const saltRounds = 10;
    let hashedPassword = '';
    await bcrypt_1.default.hash(req.body.newPassword, saltRounds).then((hash) => {
        hashedPassword = hash;
    }).catch((err) => {
        console.log(err);
        return;
    });
    host.password = hashedPassword;
    await host.save().catch((err) => {
        console.log(err);
        return;
    });
    return res.status(201).json({
        title: "password succesfully changed"
    });
};
exports.changeHostPassword = changeHostPassword;
