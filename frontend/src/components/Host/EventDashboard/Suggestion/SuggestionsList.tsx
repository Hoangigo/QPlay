import { useEffect, useState } from "react";
import { Badge, Card, List, ListItem } from "@chakra-ui/react";
import Suggestion from "./Suggestion";
import { SuggestionSchema } from "../../../../Types/SuggestionSchema";
import { EventSuggestionSchema } from "../../../../Types/EventSchema";
import { getEventSuggestionData } from "../../../../APIRoutes";

interface SuggestionsListProps {
    eventId: string;
    isActive: boolean;
}

const SuggestionsList = ({ eventId, isActive }: SuggestionsListProps) => {
    const [sortedSuggestions, setSortedSuggestions] = useState<SuggestionSchema[]>([]);
    const [isSuggestionsListEmpty, setIsSuggestionsListEmpty] = useState<boolean>(true);

    useEffect(() => {
        const fetch = async () => {
            if (!isActive) {
                return;
            }
            const newEvent: EventSuggestionSchema = await getEventSuggestionData(eventId);

            if (newEvent && Array.isArray(newEvent.suggestions)) {
                if (newEvent.suggestions.length === 0) {
                    setIsSuggestionsListEmpty(true);
                    return;
                } else {
                    setIsSuggestionsListEmpty(false);
                }

                // only not accepted and not refunded suggestions
                const filteredSuggestions = filterSuggestions(newEvent.suggestions);

                if (filteredSuggestions.length <= 0) {
                    setIsSuggestionsListEmpty(true);
                }

                const boostSorted = filteredSuggestions.
                    sort((a, b) => Number(b.boosted) - Number(a.boosted)
                        || a.suggestedAt.getTime() - b.suggestedAt.getTime());
                setSortedSuggestions(boostSorted);
            } else {
                setIsSuggestionsListEmpty(true);
            }
        }
        fetch();

        const intervalId = setInterval(fetch, 10000);
        return () => clearInterval(intervalId);
    }, [isActive]);

    const filterSuggestions = (suggestions: SuggestionSchema[]) => {
        const filteredSuggestions = [];

        for (let i = 0; i < suggestions.length; i++) {
            if (!suggestions[i].accepted && !suggestions[i].refunded) {
                filteredSuggestions.push(suggestions[i]);
            }
        }

        return filteredSuggestions;
    };

    return (
        isSuggestionsListEmpty ?
            (
                <Badge
                    borderRadius={"xl"}
                    p={"4"}
                    mt={"12"}
                    colorScheme="purple"
                    fontSize={"lg"}
                    textAlign={"center"}
                >
                    No suggestions yet
                </Badge>
            )
            :
            (
                <Card mt="2">
                    <List spacing={"2"}>
                        {sortedSuggestions.map((suggestion: SuggestionSchema) => (
                            <ListItem  >
                                <Suggestion
                                    id={suggestion._id}
                                    key={suggestion.song.id}
                                    song={suggestion.song}
                                    message={suggestion.message}
                                    boosted={suggestion.boosted}
                                    refundId={suggestion.refundId}
                                    paymentId={suggestion.paymentId}
                                    price={suggestion.price}
                                    showButtons={suggestion.suggestedAt.getTime() === sortedSuggestions[0].suggestedAt.getTime()}
                                />
                            </ListItem>
                        ))}
                    </List>
                </Card >
            )
    );
}

export default SuggestionsList;
