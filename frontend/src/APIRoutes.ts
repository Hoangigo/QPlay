import axios, { AxiosError, AxiosResponse } from "axios";
import { LatLngLiteral } from "leaflet";
import { AddressSchema } from "./Types/AddressSchema";
import { BetSchema, CreateAuctionSchema, CreateBetQueryProps, CreateBetSchema, getActiveAuction } from "./Types/AuctionSchema";
import { CreateEventSchema, EventActiveAuctionSchema, EventActiveVoteSchema, EventAuctionSchema, EventInfoSchema, EventSchema, EventSuggestionSchema, EventVoteSchema } from "./Types/EventSchema";
import { SongSchema } from "./Types/SongSchema";
import { CreateSuggestionQueryProps, CreateSuggestionSchema, SuggestionSchema } from "./Types/SuggestionSchema";
import { HostSchema } from "./Types/HostSchema";
import { BASE_URL } from "./main";
import { CreateVoteSchema, VoteOptionSchema, VoteSchema, getActiveVote } from "./Types/VoteSchema";


// API ROUTES

// SPOTIFY
export const fetchSongs = async (query: string, limit?: number): Promise<SongSchema[]> => {
    const _limit = limit ? limit : 10;
    if (query.length == 0) {
        return [] as SongSchema[]; //backend just accepts query string not empty
    }
    return await axios.get(`${BASE_URL}spotify/search`, {
        params: {
            q: query,
            limit: _limit,
        }
    })
        .then(response => {

            if (response.status === 200) {
                const songs: SongSchema[] = response.data;
                return songs;
            }
            return [] as SongSchema[];
        }
        ).catch(error => {
            console.error(error);
            return [] as SongSchema[];
        }
        );
};

export const fetchSongInfo = async (id: string): Promise<SongSchema> => {
    return await axios.get(`${BASE_URL}spotify/track/${id}`)
        .then(response => {

            if (response.status === 200) {
                const song: SongSchema = response.data;
                return song;
            }
            return {} as SongSchema;
        }
        ).catch(error => {
            console.error(error);
            return {} as SongSchema;
        }
        );
}

export const fetchMultipleSongInfo = async (ids: string[]): Promise<SongSchema[]> => {
    const idString = ids.join(",");
    return await axios.get(`${BASE_URL}spotify/tracks/${idString}`)
        .then(response => {
            console.log(response);
            if (response.status === 200) {
                const songs: SongSchema[] = response.data;
                return songs;
            }
            return {} as SongSchema[];
        }
        ).catch(error => {
            console.error(error);
            return {} as SongSchema[];
        }
        );
}

// PAYPAL
export const createSuggestionPayment = async (price: number, eventId: string, suggestion: CreateSuggestionQueryProps) => {
    return await axios.post(`${BASE_URL}paypal/authorize`, {
        price: price,
        returnUrl: `http://localhost:6969/user/song-suggest/${eventId}/payment?boosted=${suggestion.boosted}&message=${encodeURIComponent(suggestion.message)}&songId=${suggestion.songId}&price=${price}`,
        cancelUrl: `http://localhost:6969/user/event-overview/${eventId}`,
    }).then((response: AxiosResponse) => {
        if (response.status === 201) {
            return response.data;
        }
    }).catch((err: AxiosError) => {
        console.error(err);
    })
}

export const createBetPayment = async (eventId: string, auctionId: string, bet: CreateBetQueryProps) => {
    return await axios.post(`${BASE_URL}paypal/authorize`, {
        price: bet.price,
        returnUrl: `http://localhost:6969/user/bet/${eventId}/payment?price=${bet.price}&songId=${bet.songId}&auctionId=${auctionId}`,
        cancelUrl: `http://localhost:6969/user/event-overview/${eventId}`,
    }).then((response: AxiosResponse) => {
        if (response.status === 201) {
            return response.data;
        }
    }).catch((err: AxiosError) => {
        console.error(err);
    })
}

export const executePayment = async (token: string, price: number) => {
    return await axios.post(`${BASE_URL}paypal/capture`, {
        token: token,
        price: price
    }).then((response: AxiosResponse) => {
        if (response.status === 200) {
            return response.data;
        }
    }).catch((err: AxiosError) => {
        console.error(err);
    })
}

export const refundPayment = async (refundId: string, paymentId: string, price: number) => {
    return await axios.post(`${BASE_URL}paypal/refund`, {
        refundId: refundId,
        price: price,
        paymentId: paymentId,
    }).then((response: AxiosResponse) => {
        if (response.status === 200) {
            return response.data;
        }
    }).catch((err: AxiosError) => {
        console.error(err);
    })
}

// OPENSTREETMAP
export const fetchAddress = async (location: LatLngLiteral): Promise<AddressSchema> => {
    return await axios.get(`${BASE_URL}openstreetmap/${location.lat}/${location.lng}`).then((response: AxiosResponse) => {
        if (response.status === 200) {
            return response.data;
        }
        return {} as AddressSchema;
    }).catch((error: AxiosError) => {
        console.error(error);
        return {} as AddressSchema;
    })
};

// EVENTS
export const deleteEvent = async (id: string): Promise<boolean> => {
    return await axios.delete(`${BASE_URL}event/${id}`)
        .then(response => {

            if (response.status === 204) {
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });
}

export const getEvent = async (id: string): Promise<EventSchema> => {
    return await axios.get(`${BASE_URL}event/${id}`)
        .then(response => {

            if (response.status === 200) {
                const event = response.data;
                return event;
            }
            return {} as EventSchema;
        }
        )
        .catch(error => {
            console.error("Error:", error);
            return {} as EventSchema;
        });

}

export const createEvent = async (event: CreateEventSchema, email: string): Promise<string> => {
    return await axios.post(`${BASE_URL}event/create/${email}`, event).then((response) => {
        if (response.status === 201) {
            const _id: string = response.data._id;
            return _id;
        }
        return "0";
    }).catch((err) => {
        console.error(err);
        return "0";
    });
};


export const updateEvent = async (event: EventSchema): Promise<boolean> => {
    return await axios.put(`${BASE_URL}event/${event._id}`, event)
        .then(response => {

            if (response.status === 200) {
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });

}

export const updateEventWithInfoSchema = async (event: EventInfoSchema) => {
    return await axios.put(`${BASE_URL}event/${event._id}`, event).then(response => {

        if (response.status === 200) {
            return true;
        }
        return false;
    }).catch(error => {
        console.error("Error:", error);
        return false;
    }
    );
}

export const getEventInfoData = async (id: string): Promise<EventInfoSchema> => {
    return await axios.get(`${BASE_URL}event/data/info/${id}`)
        .then(response => {

            if (response.status === 200) {
                const event = response.data;
                return event;
            }
            return {} as EventInfoSchema;
        }
        )
        .catch(error => {
            console.error("Error:", error);
            return {} as EventInfoSchema;
        });
}

export const getEventVoteData = async (id: string): Promise<EventVoteSchema> => {
    return await axios.get(`${BASE_URL}event/data/vote/${id}`)
        .then(async response => {

            if (response.status === 200 && Array.isArray(response.data.voteActivities[0].voteOptions)) {
                const voteOptionsPromises: Promise<VoteOptionSchema>[] = response.data.voteActivities[0].voteOptions.map(async (option: any) => {
                    const song: SongSchema = await fetchSongInfo(option.songId);
                    return {
                        ...option,
                        song: song
                    } as VoteOptionSchema;
                });

                const voteOptions: VoteOptionSchema[] = await Promise.all(voteOptionsPromises);
                const eventVote: EventVoteSchema = {
                    _id: response.data._id,
                    voteActivities: [{
                        _id: response.data.voteActivities[0]._id,
                        start: response.data.voteActivities[0].start,
                        end: response.data.voteActivities[0].end,
                        voteOptions: voteOptions
                    }]
                }
                return eventVote;
            }
            return {} as EventVoteSchema;
        }
        )
        .catch(error => {
            console.error("Error:", error);
            return {} as EventVoteSchema;
        });
}

export const getEventAuctionData = async (id: string): Promise<EventAuctionSchema> => {
    return await axios.get(`${BASE_URL}event/data/auction/${id}`)
        .then(async response => {

            if (response.status !== 200) {

                return {} as EventAuctionSchema;
            }

            if (response.data.auctionActivities === 0) {

                return {} as EventAuctionSchema;
            }

            if (Array.isArray(response.data.auctionActivities[0].bets)) {
                const betsArray: BetSchema[] = response.data.auctionActivities[0].bets;
                if (betsArray.length === 0) {
                    return {
                        _id: response.data._id,
                        auctionActivities: [{
                            _id: response.data.auctionActivities[0]._id,
                            startPrice: response.data.auctionActivities[0].startPrice,
                            start: response.data.auctionActivities[0].start,
                            end: response.data.auctionActivities[0].end,
                            bets: []
                        }]
                    } as EventAuctionSchema;
                }
                const betsPromises: Promise<BetSchema>[] = response.data.auctionActivities[0].bets.map(async (option: any) => {
                    const song: SongSchema = await fetchSongInfo(option.songId);
                    return {
                        ...option,
                        song: song
                    } as BetSchema;
                });

                const bets: BetSchema[] = await Promise.all(betsPromises);

                const eventAuction: EventAuctionSchema = {
                    _id: response.data._id,
                    auctionActivities: [{
                        _id: response.data.auctions[0]._id,
                        startPrice: response.data.auctions[0].startPrice,
                        start: response.data.auctions[0].start,
                        end: response.data.auctions[0].end,
                        bets: bets
                    }]
                }


                return eventAuction;
            }

            return {} as EventAuctionSchema;
        }
        )
        .catch(error => {
            console.error("Error:", error);
            return {} as EventAuctionSchema;
        });

}

export const getEventActiveVoteData = async (id: string): Promise<EventActiveVoteSchema> => {
    return await axios.get(`${BASE_URL}event/data/vote/${id}`)
        .then(async response => {

            if (response.status !== 200) {

                return {} as EventActiveVoteSchema;
            }

            if (response.data.voteActivities.length === 0) {

                return {} as EventActiveVoteSchema;
            }

            const currActivity = getActiveVote(response.data.voteActivities);
            if (!currActivity) {

                return {} as EventActiveVoteSchema;
            }


            if (Array.isArray(currActivity.voteOptions)) {
                if (currActivity) {
                    const voteOptionsPromises: Promise<VoteOptionSchema>[] = currActivity.voteOptions.map(async (option: any) => {
                        const song: SongSchema = await fetchSongInfo(option.songId);
                        return {
                            ...option,

                            song: song
                        } as VoteOptionSchema;
                    });

                    const voteOptions: VoteOptionSchema[] = await Promise.all(voteOptionsPromises);
                    const eventVote: EventActiveVoteSchema = {
                        _id: response.data._id,
                        voteActivity: {
                            _id: currActivity._id,
                            start: currActivity.start,
                            end: currActivity.end,
                            voteOptions: voteOptions
                        }
                    }
                    return eventVote;
                }
            }
            return {} as EventActiveVoteSchema;
        }
        )
        .catch(error => {
            console.error("Error:", error);
            return {} as EventActiveVoteSchema;
        });
}

export const getEventActiveAuctionData = async (id: string): Promise<EventActiveAuctionSchema> => {
    return await axios.get(`${BASE_URL}event/data/auction/${id}`)
        .then(async response => {

            if (response.status !== 200) {

                return {} as EventActiveAuctionSchema;
            }

            if (response.data.auctionActivities.length === 0) {

                return {} as EventActiveAuctionSchema;
            }



            const currActivity = getActiveAuction(response.data.auctionActivities);

            if (!currActivity) {

                return {} as EventActiveAuctionSchema;
            }

            if (Array.isArray(currActivity.bets)) {
                const betsArray: BetSchema[] = currActivity.bets;
                if (betsArray.length === 0) {

                    return {
                        _id: response.data._id,
                        auctionActivity: {
                            _id: currActivity._id,
                            startPrice: currActivity.startPrice,
                            start: currActivity.start,
                            end: currActivity.end,
                            bets: []
                        }
                    } as EventActiveAuctionSchema;
                }
                const betsPromises: Promise<BetSchema>[] = currActivity.bets.map(async (option: any) => {

                    const song: SongSchema = await fetchSongInfo(option.songId);

                    return {
                        ...option,
                        song: song
                    } as BetSchema;
                });

                const bets: BetSchema[] = await Promise.all(betsPromises);

                const eventAuction: EventActiveAuctionSchema = {
                    _id: response.data._id,
                    auctionActivity: {
                        _id: currActivity._id,
                        startPrice: currActivity.startPrice,
                        start: currActivity.start,
                        end: currActivity.end,
                        bets: bets
                    }
                }


                return eventAuction;
            }

            return {} as EventActiveAuctionSchema;
        }
        )
        .catch(error => {
            console.error("Error:", error);
            return {} as EventActiveAuctionSchema;
        });

}

export const checkIsActivityActive = async (eventId: string): Promise<number> => {
    const eventV = await getEventActiveVoteData(eventId);
    if (eventV) {
        const currVote = eventV.voteActivity;
        if (currVote) {
            if (new Date(currVote.start) <= new Date()
                && new Date(currVote.end) >= new Date()) {
                return 2;
            }
        }
    }



    const eventA = await getEventActiveAuctionData(eventId);
    if (eventA) {
        const currAuction = eventA.auctionActivity;
        if (currAuction) {
            if (new Date(currAuction.start) <= new Date()
                && new Date(currAuction.end) >= new Date()) {
                return 1;
            }
        }
    }

    return 0;
}

export const getEventSuggestionData = async (id: string): Promise<EventSuggestionSchema> => {
    return await axios.get(`${BASE_URL}event/data/suggestion/${id}`)
        .then(async response => {
            if (response.status === 200 && Array.isArray(response.data.suggestions)) {
                const suggestionsArray: SuggestionSchema[] = response.data.suggestions;
                if (suggestionsArray.length === 0) {
                    return {
                        _id: response.data._id,
                        suggestions: []
                    } as EventSuggestionSchema;
                }

                const songIds: string[] = suggestionsArray.map((suggestion: any) => suggestion.songId);

                const songs: SongSchema[] = await fetchMultipleSongInfo(songIds);
                const songMap = new Map<string, SongSchema>(songs.map(song => [song.id, song]));

                const suggestions: SuggestionSchema[] = suggestionsArray.map((suggestion: any) => {
                    return {
                        ...suggestion,
                        suggestedAt: new Date(suggestion.suggestedAt),
                        song: songMap.get(suggestion.songId) || {} as SongSchema
                    } as SuggestionSchema;
                });

                const eventSuggestion: EventSuggestionSchema = {
                    _id: response.data._id,
                    suggestions: suggestions
                }
                return eventSuggestion;
            }
            return {} as EventSuggestionSchema;
        })
        .catch(error => {
            console.error("Error:", error);
            return {} as EventSuggestionSchema;
        });
}


// SUGGESTIONS

export const getSuggestions = async (eventId: string): Promise<SuggestionSchema[]> => {
    try {
        const response = await axios.get(`${BASE_URL}suggestion/${eventId}/`);


        if (response.status === 200 && Array.isArray(response.data)) {
            const suggestionsPromises: Promise<SuggestionSchema>[] = response.data.map(async (suggestion: any) => {
                const song: SongSchema = await fetchSongInfo(suggestion.songId);
                return {
                    ...suggestion,
                    song: song
                } as SuggestionSchema;
            });

            const suggestions: SuggestionSchema[] = await Promise.all(suggestionsPromises);
            return suggestions;
        }

        return [] as SuggestionSchema[];
    } catch (error) {
        console.error("Error:", error);
        return [] as SuggestionSchema[];
    }
}


export const deleteSuggestion = async (suggestionId: string): Promise<boolean> => {
    return await axios.delete(`${BASE_URL}suggestion/${suggestionId}`)
        .then(response => {

            if (response.status === 204) {
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });

}

export const createSuggestion = async (eventId: string, suggestion: CreateSuggestionSchema): Promise<boolean> => {
    return await axios.post(`${BASE_URL}suggestion/create/${eventId}`, suggestion)
        .then(response => {

            const status = response.status;
            if (status === 201) {
                return true;
            }
            return false;
        }
        ).catch(error => {
            console.error(error);
            return false;
        }
        );
}

export const updateSuggestion = async (id: string, data: Object): Promise<boolean> => {
    return await axios.put(`${BASE_URL}suggestion/${id}`, data).then((response: AxiosResponse) => {
        if (response.status === 201) {
            return true;
        }
        return false;
    }).catch((err: AxiosError) => {
        console.error(err);
        return false;
    })
}



// HOST

export const getHost = async (email: string): Promise<HostSchema> => {
    return await axios.get(`${BASE_URL}host/${email}`)
        .then(response => {

            if (response.status === 200) {
                const newHost: HostSchema = response.data;
                return newHost;
            }
            return {} as HostSchema;
        })
        .catch(error => {
            console.error("Error:", error);
            return {} as HostSchema;
        });

}

export const createHost = async (name: string, email: string, password: string): Promise<boolean> => {
    return await axios.post(`${BASE_URL}createNewHost`, { name, email, password })
        .then(response => {
            if (response.status === 201) {
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });
};

export const deleteHost = async (email: string): Promise<boolean> => {
    return await axios.delete(`${BASE_URL}host/${email}`)
        .then(response => {
            if (response.status === 204) {
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });
};

export const verifyEmailConfirmation = async (id: string) => {
    const response: AxiosResponse = await axios.get(`${BASE_URL}host/confirm/${id}`);
    return response.status;
};



// VOTE
export const getVote = async (voteId: string): Promise<VoteSchema> => {
    return await axios.get(`${BASE_URL}vote/${voteId}`)
        .then(async response => {

            if (response.status !== 200) {

                return {} as VoteSchema;
            }

            if (response.data.voteOptions.length === 0) {

                return {} as VoteSchema;
            }


            const fetchedVote: VoteSchema = response.data;
            if (!fetchedVote) {

                return {} as VoteSchema;
            }
            const voteOptions = fetchedVote.voteOptions;

            if (Array.isArray(voteOptions)) {
                if (voteOptions) {
                    const voteOptionsPromises: Promise<VoteOptionSchema>[] = voteOptions.map(async (option: any) => {
                        const song: SongSchema = await fetchSongInfo(option.songId);
                        return {
                            ...option,
                            song: song
                        } as VoteOptionSchema;
                    });

                    const voteOptionsSong: VoteOptionSchema[] = await Promise.all(voteOptionsPromises);
                    const newVote: VoteSchema = {
                        _id: fetchedVote._id,
                        start: new Date(fetchedVote.start),
                        end: new Date(fetchedVote.end),
                        voteOptions: voteOptionsSong
                    }
                    return newVote;
                }
                return {} as VoteSchema;
            }
            return {} as VoteSchema;
        })
        .catch(error => {
            console.error("Error:", error);
            return {} as VoteSchema;
        });
}

export const createVote = async (eventId: string, vote: CreateVoteSchema): Promise<boolean> => {



    return await axios.post(`${BASE_URL}vote/create/${eventId}`, vote)
        .then(response => {

            if (response.status === 201) {

                return true;
            }

            return false;
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });
}

export const deleteVote = async (voteId: string): Promise<boolean> => {
    return await axios.delete(`${BASE_URL}vote/${voteId}`)
        .then(response => {

            if (response.status === 204) {
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });
}

export const voting = async (voteOptionId: string): Promise<boolean> => {
    return await axios.put(`${BASE_URL}voteoption/update/count`, { _id: voteOptionId })
        .then(response => {

            const status = response.status;
            if (status === 200) {
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });

}

// AUCTION

export const getBets = async (auctionId: string): Promise<BetSchema[]> => {
    return await axios.get(`${BASE_URL}bets/${auctionId}`)
        .then(response => {

            if (response.status === 200) {
                const bets: BetSchema[] = response.data.bets;
                return bets;
            }
            return {} as BetSchema[];
        })
        .catch(error => {
            console.error("Error:", error);
            return {} as BetSchema[];
        });
}

export const getTopBet = async (auctionId: string): Promise<BetSchema | null> => {
    return await axios.get(`${BASE_URL}bet/${auctionId}`)
        .then(async response => {

            if (response.status === 200) {
                const bets = response.data;
                if (bets.length !== 0) {
                    const maxPriceBet = bets.reduce((prev: { price: number; }, current: { price: number; }) => {
                        return (prev.price > current.price) ? prev : current;
                    });
                    const topBetSong = await fetchSongInfo(maxPriceBet.songId);

                    const topBet_ = {
                        ...maxPriceBet,
                        song: topBetSong
                    } as BetSchema;


                    return topBet_;
                }
            }

            return null;
        })
        .catch(error => {
            console.error("Error:", error);
            return null;
        });
}

export const createAuction = async (eventId: string, auction: CreateAuctionSchema): Promise<boolean> => {
    return await axios.post(`${BASE_URL}auction/create/${eventId}`, auction)
        .then(response => {

            const status = response.status;
            if (status === 201) {
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });
}


export const deleteAuction = async (auctionId: string): Promise<boolean> => {
    return await axios.delete(`${BASE_URL}auction/${auctionId}`)
        .then(response => {

            if (response.status === 204) {
                return true;
            }
            return false;
        })
        .catch(error => {
            console.error("Error:", error);
            return false;
        });
}

export const createBet = async (auctionId: string, cBet: CreateBetSchema): Promise<boolean> => {
    return await axios.post(`${BASE_URL}bet/create/${auctionId}`, { songId: cBet.songId, paymentId: cBet.paymentId, price: cBet.price })
        .then(response => {

            const status = response.status;
            if (status === 201) {
                return true;
            }
            return false;
        }
        ).catch(error => {
            console.error("Error:", error);
            return false;
        }
        );

}