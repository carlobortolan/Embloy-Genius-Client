"use client";
import React, {useState, useCallback, useEffect, use} from "react";
import '@/app/globals.css'
import { EmbloyToolbox, EmbloyToolboxImgA, EmbloyToolboxImgButton, EmbloyToolboxImgAdvanced } from "@/app/components/ui/misc/toolbox";
import { EmbloyLHPV, EmbloyV, EmbloyH, EmbloySpacer, EmbloyToggle} from "@/app/components/ui/misc/stuff";
import { EmbloyH1, EmbloyP } from "@/app/components/ui/misc/text";
import { 
    connect as leverConnect, 
    disconnect as leverDisconnect, 
    sync as leverSync, 
    reset as leverReset ,
    verify as leverVerify,
    sync
} from "@/app/settings/integrations/lever";
import { claim_core_tokens } from "@/lib/api/user";
import { ProgressLoadingScreen } from "@/app/components/dom/main/screens/ProgressLoadingScreen.js";
import { cn } from "@/lib/utils";

function IntegrationElement({name, activeIntegrations, description, doc_link, onConnect, onDisconnect, onSync, onReset, onVerify, onReload}) {
    const [isError, setError] = useState(null);
    const [status, setStatus] = useState("inactive");
    const [syncStatus, setSyncStatus] = useState("inactive");
    const [resetStatus, setResetStatus] = useState("inactive");

    const force = (status) => {
        setStatus(status);
    };

    const handleReset = async () => {
        if (resetStatus !== 'resetting') {
            setResetStatus("resetting");
            await onReset();
            setResetStatus("success");
        } else {
            setResetStatus("inactive");
        }
    };

    const handleSync = async () => {
        if (syncStatus !== 'syncing') {
            setSyncStatus("syncing");
            await onSync();
            setSyncStatus("success");
        } else {
            setSyncStatus("inactive");
        }
    };

    const handleToggleChange = async (newState) => {
        if (status === "inactive" && newState === true) {
            try {
                force("connect");
                await onConnect();
                setError(null);
            } catch (error) {
                setError("Error connecting to " + name);
                force("inactive");
            } 
            onReload();
        } else if (status === "active" && newState === false) {
            try {
                force("disconnect");
                const token = await onDisconnect(activeIntegrations);
                onReload(token);
                setError(null);
                force("inactive");
            } catch (error) {
                setError("Error disconnecting from " + name);
                force("active");
            }
        }
      };

    useEffect(() => {
        if (onVerify(activeIntegrations) === true) {
            force("active");
        }
    }, [activeIntegrations]);

    

   

    return (
        <EmbloyV className={"bg-transparent dark:bg-chianti border border-etna dark:border-biferno text-white rounded-lg p-4"}>
            <EmbloyH className={"items-center justify-between"}>
                <EmbloyH className={"items-center gap-2"}>
                    <EmbloyH1 className={"text-sm"}>{name}</EmbloyH1>
                    <div className="h-5 w-[1px] dark:bg-nebbiolo "/>
                    <EmbloyP className={"text-sm"}>{description}</EmbloyP>
                </EmbloyH>
                
               
                <EmbloyH className={"items-center justify-end gap-4 max-w-fit"}>
                    
                    {(isError !== null) && <EmbloyP className={"text-xs text-red-500 dark:text-red-500"}>{isError}</EmbloyP>}
                    {(status === "connect") && <EmbloyP className={"text-xs text-yellow-500 dark:text-yellow-500"}>Connecting...</EmbloyP>}
                    {(status === "disconnect") && <EmbloyP className={"text-xs text-yellow-500 dark:text-yellow-500"}>Disconnecting...</EmbloyP>}
                    {(resetStatus === "resetting") && <EmbloyP className={"text-xs text-yellow-500 dark:text-yellow-500"}>Please wait, this may take up to 30 seconds. Don't refresh.</EmbloyP>}
                    
                    <EmbloyToolbox superClassName="h-7 border-2 dark:border-nebbiolo dark:bg-nebbiolo" className={undefined} name={undefined} >
                        {/*<IntegrationSync key="Sync" name={name} disabled={!isRequested} />
                        <ResetWebhook key="Reset" name={name} disabled={!isRequested}/>*/}
                        <EmbloyToolboxImgButton 
                            disabled={status !== "active" || resetStatus === "resetting"}
                            action={syncStatus === "syncing"}
                            path_success="/icons/svg/lugana/success.svg" 
                            path_success_hovered="/icons/svg/custoza/success.svg"
                            success={syncStatus === "success"}
                            onClick={handleSync} 
                            tooltip={syncStatus === "success" ? 'Successfully synced with ' + name : syncStatus === 'syncing' ? ('Syncing with ' + name + '...') : ('Synchronize with ' + name)} 
                            path="/icons/svg/black/sync.svg" 
                            path_action="/icons/svg/black/no-sync.svg" 
                            path_hovered="/icons/svg/leidoveneta/sync.svg" 
                            path_hovered_action="/icons/svg/leidoveneta/no-sync.svg" 
                            path_disabled="/icons/svg/etna/sync.svg" 
                            dark_path="/icons/svg/amarone/sync.svg"
                            dark_path_action="/icons/svg/amarone/no-sync.svg" 
                            dark_path_hovered="/icons/svg/barbera/sync.svg" 
                            dark_path_hovered_action="/icons/svg/barbera/no-sync.svg" 
                            dark_path_disabled="/icons/svg/biferno/sync.svg" 
                            height="12" width="12" 
                        />
                        <EmbloyToolboxImgButton 
                            disabled={status !== "active" || syncStatus === "syncing"}
                            action={resetStatus === "resetting"}
                            onClick={handleReset} 
                            tooltip={resetStatus === "success" ? 'Successfully reset ' + name + ' Webhooks' : resetStatus === 'resetting' ? ('Resetting ' + name + ' Webhooks...') : ('Reset ' + name + ' Webhooks')} 
                            path_success="/icons/svg/lugana/success.svg" 
                            path_success_hovered="/icons/svg/custoza/success.svg"
                            success={resetStatus === "success"}
                            path="/icons/svg/black/whk.svg"
                            path_action="/icons/svg/black/no-whk.svg" 
                            path_hovered="/icons/svg/leidoveneta/whk.svg"
                            path_hovered_action="/icons/svg/leidoveneta/no-whk.svg" 
                            path_disabled="/icons/svg/etna/whk.svg" 
                            dark_path="/icons/svg/amarone/whk.svg" 
                            dark_path_action="/icons/svg/amarone/no-whk.svg" 
                            dark_path_hovered="/icons/svg/barbera/whk.svg" 
                            dark_path_hovered_action="/icons/svg/barbera/no-whk.svg" 
                            dark_path_disabled="/icons/svg/biferno/whk.svg"  
                            height="12" width="12"  
                        />
                        <EmbloyToolboxImgA tooltip={`Help`} href={doc_link} height="12" width="12" path="/icons/svg/black/ask.svg" path_hovered="/icons/svg/leidoveneta/ask.svg" dark_path="/icons/svg/amarone/ask.svg" dark_path_hovered="/icons/svg/barbera/ask.svg" target="_blank" />
                    </EmbloyToolbox>
                    <EmbloyToggle 
                        forceStatus={status} 
                        unlock={`
                            ${(status === "active" && true) 
                            || (status !== "active" && false)}
                        `} 
                        className="h-7" 
                        tooltip={`
                            ${(status === "active") && "Disconnect Embloy from " + name
                            || (status === "inactive") && "Connect Embloy to " + name
                            || (status === "connect" || status === "disconnect") && "Pending..."}
                        `} onChange={handleToggleChange} 
                    />
                </EmbloyH>
            </EmbloyH>
        </EmbloyV> 
    );
}
export function IntegrationControl({activeIntegrations}) {
    const [integrations, setIntegrations] = useState([]);
    useEffect(() => {
        setIntegrations(activeIntegrations);
    }, [activeIntegrations]);
    const reload = async (token) => {
        if (token===undefined) {
            console.log("i gOT NO TOKEN");
            const tokens = await claim_core_tokens(true);
            setIntegrations(tokens);
        } else {
            console.log("i gOT TOKEN", token);
            setIntegrations(token);
        }
        return true;
    };
    return (
        <EmbloyV className={"gap-2 border-t dark:border-biferno pt-2"}>
            <EmbloyH className={"items-center justify-between"}>
                <EmbloyH1 className={"text-lg"}>Integration Center</EmbloyH1>
            </EmbloyH>
            <EmbloyV className={"gap-2"}>
                <EmbloyV className={"gap-2"}>
                    <IntegrationElement name="Lever" activeIntegrations={integrations} description={"Use Embloy with Lever's recruiting software."} doc_link="https://developers.embloy.com/docs/guides/get-started-integrations-lever" onConnect={leverConnect} onDisconnect={leverDisconnect} onSync={leverSync} onReset={leverReset} onVerify={leverVerify} onReload={reload} />
                </EmbloyV>
            </EmbloyV>
        </EmbloyV> 
    );
}