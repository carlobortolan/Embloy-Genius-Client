"use client";
import React, {useEffect, useState} from "react";
import Image from "next/image";
import LoadingScreen from "@/app/components/misc/LoadingScreen";
import {get_genius_query, get_ops} from "@/lib/misc_requests";
import ErrorScreen from "@/app/components/misc/ErrorScreen";
import {isNotNumeric} from "@/lib/utils/helpers";
import {useRouter} from "next/navigation";
import {Interval, Subscription} from "@/lib/utils/enums";
import {cn} from "@/lib/utils";

export default function Page({params}) {
    //TODO: make fucking string json parsable
    const [content, setContent] = useState({})
    const router = useRouter();
    const [selectedOption, setSelectedOption] = useState(null);

    const purchase_allowed = () => {
        if (selectedOption === null) {
            return false;
        }
        return true;
    }
    useEffect(() => {
        get_ops('store/' + params.slug + '/', router).then(data => {
            console.log(data[0])
            setContent(data[0])

        })
    }, [])
    if (content === null) {
        return <LoadingScreen/>;
    } else if (!isNotNumeric(content)) {
        return <ErrorScreen/>;
    } else if (Object.keys(content).length === 0) {
        // Check for an empty object in case content is an empty object
        return <LoadingScreen/>;
    } else {
        let subscription_name = Subscription[content["product_name"]];
        let subscriptionText = content["description"]["text"];
        let subscriptionFeatures = content["description"]["features"];
        let subscriptionOptions = content["subscription_options"];

        //todo: alignment for maler screens
        return (
            <div className="fixed top-0 left-0 w-screen h-screen overflow-hidden flex items-center justify-center">
                <Image
                    src="/img/store_screen.svg"
                    alt="Logo"
                    height="20000"
                    width="20000"
                />
                <div
                    className="fixed left-1/4 w-1/2 min-w-[1260px] h-screen z-50 flex flex-col items-center justify-start">
                    <div className="h-24"/>

                    <div className="h-6"/>
                    <div className="flex flex-row items-center justify-center">
                        <h1 className="text-center text-white font-medium text-3xl">Embloy </h1>
                        {content["product_name"] === "basic" &&
                            (
                                <Image
                                    src="/img/smart.svg"
                                    alt={content["product_name"]}
                                    height="100"
                                    width="100"
                                    className="relative"
                                />
                            )}
                        {content["product_name"] === "premium" &&
                            (
                                <Image
                                    src="/img/genius.svg"
                                    alt={content["product_name"]}
                                    height="100"
                                    width="100"
                                    className="relative"
                                />
                            )}
                    </div>
                    <p className="text-center text-white font-normal text-base">Brain-boosting your recruitment</p>
                    <div className="h-12"/>
                    <div
                        className="w-4/6 bg-black border border-gray-700 rounded-lg flex flex-col items-start justify-start p-4">
                        <h1 className="text-white font-medium text-xl">Enable {subscription_name} for your
                            organization</h1>
                        <div className="h-2"/>
                        <p className="text-white font-normal text-sm">{subscriptionText}</p>
                        <div className="h-6"/>
                        <div
                            className="w-full flex flex-row item-center justify-center">
                            <h1 className="px-4 py-1 rounded-lg bg-embloy-purple-light text-embloy-purple text-center text-sm font-semibold cursor-default">Features</h1>
                        </div>
                        <div className="h-4"/>
                        <div
                            className="p-2 border rounded-lg border-white w-full flex flex-col item-start justify-start gap-4">
                            {subscriptionFeatures.map((feature, index) => {
                                const featureKeys = Object.keys(feature);
                                const key = featureKeys.find(key => key !== 'icon_url');
                                const iconUrl = feature['icon_url'];

                                return (
                                    <div key={index} className="w-full flex flex-row item-center justify-start">
                                        <div
                                            className="w-1/3 flex flex-row items-start justify-start cursor-default gap-2">
                                            <Image
                                                src={"/icons/" + iconUrl}
                                                alt={content["product_name"]}
                                                height="35"
                                                width="35"
                                                className="relative"
                                            />
                                            <h1 className="left text-sm font-normal text-white">{key}</h1>
                                        </div>
                                        <div className="w-2/3 flex flex-row items-start justify-start ">
                                            <p className="left text-sm font-normal text-white">{feature[key]}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <div className="h-6"/>
                        <div
                            className="w-full flex flex-row item-center justify-center">
                            <h1 className="px-4 py-1 rounded-lg bg-embloy-purple-light text-embloy-purple text-center text-sm font-semibold cursor-default">Options</h1>
                        </div>
                        <div className="h-4"/>
                        <div className="w-full flex flex-row item-start justify-start gap-px ">
                            <div className="border rounded-lg border-white flex flex-row item-start justify-start">
                                {subscriptionOptions.map((option, index) => (
                                    <React.Fragment key={index}>
                                        <div
                                            className={cn(selectedOption === option ? "w-32 flex flex-col items-center justify-center gap-px cursor-default bg-gray-900 rounded-lg" : " rounded-lg w-32 flex flex-col items-center justify-center gap-px cursor-pointer hover:bg-gray-900")}
                                            onClick={() => setSelectedOption(subscriptionOptions[index])}
                                        >
                                            <div className="h-2" />
                                            <h1 className="center text-sm font-semibold text-white">{option.duration} {option.unit}</h1>
                                            <p className="center text-sm font-normal text-embloy-purple-lighter">{`${option.currency} ${option.price} ${option.type}*`}</p>
                                            <div className="h-2" />
                                        </div>
                                        {index !== subscriptionOptions.length - 1 && <div className="h-full w-px bg-white" />}
                                    </React.Fragment>
                                ))}

                            </div>
                        </div>
                        <div className="h-12"/>

                        <div className="h-2"/>
                        <div className="w-full flex flex-row item-center justify-between">
                            <div className="w-1/3">
                                {purchase_allowed() ? (
                                    <h1
                                        className="flex flex-row items-center justify-start py-2 text-white text-sm">
                                        {`Your plan:${selectedOption.currency} ${selectedOption.price} ${selectedOption.type} for ${selectedOption.duration} ${selectedOption.unit}*`}
                                    </h1>
                                ) : (
                                    <h1
                                        className="flex flex-row items-center justify-start py-2 text-red-500 text-sm">
                                        No option selected
                                    </h1>
                                )}
                            </div>
                            <div className="w-1/3 flex flex-row items-center justify-center">
                                {purchase_allowed() ? (
                                    <button
                                        className="rounded-full py-1 px-4 bg-embloy-purple-light hover:bg-embloy-purple-lighter text-embloy-purple text-center text-sm font-semibold">
                                        Buy
                                    </button>
                                ) : (
                                    <button
                                        disabled={true}
                                        className="rounded-full py-1 px-4 bg-gray-700 text-gray-900 text-center text-sm font-semibold cursor-not-allowd">
                                        Buy
                                    </button>
                                )}

                            </div>
                            <button className="w-1/3 flex flex-row py-2 text-gray-700 hover:text-gray-400 text-xs items-center justify-end">
                                <a href="https://about.embloy.com"> * see Embloys payment terms</a>
                            </button>
                        </div>


                    </div>
                    <div className="h-12"/>
                </div>
            </div>

        )
    }


}