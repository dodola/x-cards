import { DynamicStyleTippyComponent } from "@src/app/(app)/components/dynamic-style-tippy";
import { useMemo, useRef, useState } from "react";
import pRetry from 'p-retry';
import { copyImage, extractTweetInfo, getPostThread } from "@src/app/utils";
import toast from 'react-hot-toast';
import * as _ from 'lodash-es';
import { PreviewToast } from "./x-cards-toast";
import { useTweetsStore } from "./use-tweet-collection";
import type { PlasmoCSUIAnchor } from "plasmo";
import { Plus } from "lucide-react";
import { tweet2Markdown, tweet2NotionBlock } from '@src/app/utils/export';

export const CardButton: React.FC<{
    anchor: PlasmoCSUIAnchor
}> = ({ anchor }) => {
    const [isLoading, setIsLoading] = useState(false);

    const cardConfig = useRef({});
    // const url = 'http://localhost:9989' + encodeURIComponent('https://api.notion.com/');

    const handleCopyAsCellCard = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        try {
            const postElement = anchor.element.closest('article[data-testid="tweet"]');
            const tweetInfo = extractTweetInfo(postElement)
            const imageSrc = await pRetry(async () => {
                return copyImage(tweetInfo, cardConfig.current);
            }, {
                retries: 10,
            });

            const thread = getPostThread(postElement);
            const tweetInfos = _.compact(thread?.map(e => extractTweetInfo(e)));
            chrome.runtime.sendMessage({
                action: "createNotionPage",
                data: tweetInfos,
            }, (response) => {
                if (response.error) {
                    console.log(response.error);
                    toast.error(`Error creating Notion page: ${response.error}`, { duration: 500 });
                } else {
                    console.log("Notion page created successfully");
                    toast.success("👏 Notion page created successfully", {
                        duration: 500,
                    })
                }
            });



            // toast.success("👏  Copy the card to clipboard", {
            //     duration: 500,
            // })

            // useTweetsStore.setState((state) => {
            //     state.tweets = tweetInfos;
            //     state.activeTab = 'linear';
            //     state.imageSrc = imageSrc;
            //     return state;
            // });
            // toast.remove('preview-toast');

            // toast.custom((t) => {
            //     return (<PreviewToast
            //         anchor={anchor}
            //         tweetInfos={tweetInfos}
            //         tweetInfo={tweetInfo}
            //     ></PreviewToast>)
            // }, {
            //     id: 'preview-toast',
            //     duration: Infinity,
            //     position: 'top-right',
            // })
        } catch (error) {
            toast.error(`Error copying card: ${error.message}`);
            console.error("Error generating card:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const handleDefaultClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        await handleCopyAsCellCard(e);
    }

    const handleClick = async (e) => {
        e.stopPropagation();
        e.preventDefault();
        if (isLoading) return;
        setIsLoading(true);
        try {
            const postElement = anchor.element.closest('article[data-testid="tweet"]');
            const tweetInfo = extractTweetInfo(postElement)
            const thread = getPostThread(postElement);
            const tweetInfos = _.compact(thread?.map(e => extractTweetInfo(e)));
            useTweetsStore.setState((state) => {
                state.tweets = [
                    ...state.tweets,
                    tweetInfo,
                ];
                state.activeTab = 'linear';
                return state;
            });
            toast.remove('preview-toast');
            toast.custom((t) => {
                return (<PreviewToast
                    anchor={anchor}
                    tweetInfos={tweetInfos}
                    tweetInfo={tweetInfo}
                ></PreviewToast>)
            }, {
                id: 'preview-toast',
                duration: Infinity,
                position: 'top-right',
            })
        } catch (error) {
            toast.error(`Error copying card: ${error.message}`);
            console.error("Error generating card:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const dropdownMenu = useMemo(() => {
        return (<div className="dropdown-menu">
            <ul className="dropdown-menu-list">

                <div className="dropdown-menu-separator" />
                <li className="dropdown-menu-item"
                    onClick={handleClick}
                >
                    <Plus className="dropdown-menu-icon"></Plus>
                    Add to Collection
                </li>
            </ul>
        </div>)
    }, [])

    return (
        <DynamicStyleTippyComponent
            tippyOptions={{
                maxWidth: 200,
            }}
            content={dropdownMenu}>
            <div
                className="x"
                onClick={handleDefaultClick}
                style={{
                    padding: "4px",
                }}
            >
                <button className="x card-button"
                >
                    <div
                        dir="ltr"
                        style={{ textOverflow: "unset" }}
                    >
                        {isLoading ? (
                            <svg
                                className="animate-spin"
                                viewBox="0 0 1024 1024"
                                xmlns="http://www.w3.org/2000/svg"
                                width={22.5}
                                height={22.5}
                            >
                                <path
                                    d="M512 128a384 384 0 01384 384 384 384 0 01-384 384 384 384 0 01-384-384 384 384 0 01384-384zm0 115.2a268.8 268.8 0 100 537.6 268.8 268.8 0 000-537.6z"
                                    fillOpacity={0.05}
                                />
                                <path
                                    d="M781.696 794.24A390.272 390.272 0 00229.76 242.304a58.539 58.539 0 0082.773 82.773 273.195 273.195 0 11386.39 386.39 58.539 58.539 0 0082.773 82.773z"
                                    fill="#768294"
                                />
                            </svg>

                        ) : (
                            <>
                                <svg
                                    style={{
                                        width: '22.5px',
                                        height: '22.5px',
                                        verticalAlign: 'text-bottom',

                                    }}
                                    viewBox="0 0 1024 1024"
                                    xmlns="http://www.w3.org/2000/svg"
                                    width={22.5}
                                    height={22.5}
                                >
                                    <path
                                        d="M843.7 263.4l-157-99.4c-2.9-1.9-6-3.5-9-5-11.5-20.7-31.2-36.6-56-42.6L459.2 77.3C445.8 68.9 429.9 64 412.8 64H227c-48.3 0-87.4 39.2-87.4 87.4V785c0 48.3 39.1 87.4 87.4 87.4h67.4l116.8 74c40.8 25.8 94.8 13.7 120.6-27.1l339-535.4c25.9-40.7 13.7-94.7-27.1-120.5zM205.1 680.3v-507c0-24.1 19.6-43.7 43.7-43.7H338c-.9 2.6-1.7 5.2-2.3 8L205.1 680.3zm189.2-506.2c5.6-23.5 29.2-37.9 52.7-32.3l133.4 32.1c-5.3 5-10.1 10.7-14.2 17.2L282.5 639.2l111.8-465.1zm409.5 193.3L488.2 865.9c-12.9 20.4-39.9 26.4-60.3 13.5l-120.1-76c-20.4-12.9-26.5-39.9-13.5-60.3l315.6-498.4c12.9-20.4 39.9-26.5 60.3-13.6l120.1 76c20.3 12.9 26.4 39.9 13.5 60.3zM428.7 716.6h-8.1c-21.5 0-39 17.4-39 39v8.1c0 21.5 17.5 39 39 39h8.1c21.5 0 39-17.4 39-39v-8.1c0-21.6-17.5-39-39-39z"
                                        fill="rgb(113, 118, 123)"
                                    />
                                </svg>
                            </>
                        )}

                    </div>
                </button>
            </div>
        </DynamicStyleTippyComponent>
    )
}