import React, {useContext, useEffect, useRef, useState} from "react";
import {UserContext} from "@/app/components/dom/main/wrappers/UserContext";
import '@/app/globals.css'
import {AvatarButton} from "@/app/components/ui/misc/avatar";
import { not_core_get } from "@/lib/api/core";
import '@/app/globals.css'
import { EmbloyLHPV, EmbloyV, EmbloyH, EmbloySpacer, EmbloyToggle, EmbloyButton, EmbloySeperator} from "@/app/components/ui/misc/stuff";
import { EmbloyInput, EmbloyInputbox, EmbloyInputboxElement, EmbloyRadioOption, EmbloySelectOption } from "@/app/components/ui/misc/input";
import { EmbloyP, EmbloyH1} from "@/app/components/ui/misc/text";
import { XIcon } from "lucide-react";
import { FaLink } from "react-icons/fa";
import Link from "next/link";
import { siteConfig } from "@/config/site";
import {marked} from "marked";
import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import TurndownService from 'turndown';
import { html_to_markdown, checkBody } from "@/app/recruitment/post_details";
import parse, { domToReact } from 'html-react-parser';
const options = {
    replace: (domNode) => {
        if (domNode.name === "h1") {
            return <EmbloyH1 className="text-base mb-4">{domToReact(domNode.children, options)}</EmbloyH1>;
        }
        if (domNode.name === "p") {
            return <EmbloyP className="text-sm mb-4">{domToReact(domNode.children, options)}</EmbloyP>;
        }
        if (domNode.name === "ul") {
            return <ul className="mb-4">{domToReact(domNode.children, options)}</ul>;
        }
        if (domNode.name === "li") {
            return <li className="text-sm">{domToReact(domNode.children, options)}</li>;
        }
        if (domNode.name === "strong") {
            return <strong>{domToReact(domNode.children, options)}</strong>;
        }
        if (domNode.name === "a") {
            return (
                <a
                    href={domNode.attribs.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline"
                >
                    {domToReact(domNode.children)}
                </a>
            );
        }
    },
};
const industries = [
    {value: "Technology", label: "Technology"},
    {value: "Healthcare", label: "Healthcare"},
    {value: "Finance", label: "Finance"},
    {value: "Education", label: "Education"},
    {value: "Retail", label: "Retail"},
    {value: "Manufacturing", label: "Manufacturing"},
    {value: "Entertainment_and_Media", label: "Entertainment & Media"},
    {value: "Transportation_and_Logistics", label: "Transportation & Logistics"},
    {value: "Energy_and_Utilities", label: "Energy & Utilities"},
    {value: "Real_Estate", label: "Real Estate"},
    {value: "Food_and_Beverage", label: "Food & Beverage"},
    {value: "Telecommunications", label: "Telecommunications"},
    {value: "Agriculture", label: "Agriculture"},
    {value: "Hospitality_and_Tourism", label: "Hospitality & Tourism"},
    {value: "Government_and_Public_Services", label: "Government & Public Services"},
    {value: "Nonprofit_and_NGO", label: "Nonprofit & NGO"},
    {value: "Automotive", label: "Automotive"},
    {value: "Biotechnology_and_Pharmaceuticals", label: "Biotechnology & Pharmaceuticals"},
    {value: "Construction_and_Engineering", label: "Construction & Engineering"},
    {value: "Insurance", label: "Insurance"},
    {value: "E_Commerce", label: "E-Commerce"},
    {value: "Aerospace_and_Defense", label: "Aerospace & Defense"},
    {value: "Arts_and_Culture", label: "Arts & Culture"},
    {value: "Sports_and_Recreation", label: "Sports & Recreation"},
    {value: "Mining_and_Resources", label: "Mining & Resources"},
    {value: "Legal_and_Consulting", label: "Legal & Consulting"},
    {value: "Fashion_and_Lifestyle", label: "Fashion & Lifestyle"},
    {value: "Consumer_Electronics", label: "Consumer Electronics"},
    {value: "Publishing_and_Printing", label: "Publishing & Printing"},
    {value: "Logistics_and_Supply_Chain", label: "Logistics & Supply Chain"},
    {value: "Private_Equity_and_Venture_Capital", label: "Private Equity & Venture Capital"},
    {value: "Education_Technology", label: "Education Technology"},
    {value: "Cybersecurity", label: "Cybersecurity"},
    {value: "Virtual_Reality_and_Immersive_Technologies", label: "Virtual Reality & Immersive Technologies"},
    {value: "Artificial_Intelligence_and_Machine_Learning", label: "Artificial Intelligence & Machine Learning"},
    {value: "Cryptocurrency_and_Blockchain", label: "Cryptocurrency & Blockchain"},
    {value: "Sustainability_and_Renewables", label: "Sustainability & Renewables"},
];


export function CompanyInfo(reload) {
    let {user, company, subscription} = useContext(UserContext)
    const [body, setBody] = useState(company.company_description.body);

    const [newImageUrl, setNewImageUrl] = useState(null);
    const [avatar, set_avatar] = useState(false);

    const [showReload, setShowReload] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);
    const [removing, setRemoving] = useState(false);
    const [removeError, setRemoveError] = useState(null);

    const handleImageReset = async () => {
        //TODO: Implement when endpoint is available. Issue #187 for Core-Server https://github.com/Embloy/Embloy-Core-Server/issues/187
        /* 
        try {
            setRemoveError(null);
            setRemoving(true);
            const formData = new FormData();
            formData.append("company_logo", null);
            const res = await not_core_get("PATCH", `/company/${company.id}`, formData, true);
            setNewImageUrl("default");
            setRemoving(false);
            setShowReload(true);
            set_avatar(false);
        } catch (error) {
            setRemoving(false);
            setRemoveError('error');
            console.log("IMAGE RESET ERROR", error)
        }
            */
    };

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                if (file.size > 2000000) {
                    throw new Error('File too large');
                }
                setUploadError(null);
                setUploading(true);
                const formData = new FormData();
                formData.append("company_logo", file);
                const res = await not_core_get("PATCH", `/company/${company.id}`, formData, true);
                if (res.company.company_logo) {
                    setNewImageUrl(res.company.company_logo);
                }
                setUploading(false);
                setShowReload(true);
                set_avatar(true);

            } catch (error) {
                setUploading(false);
                setUploadError('error');
            }
        }
        
    };

    const handleNameChange = async (e) => {
        if (company.company_name !== name) {
            try {
                const res = await not_core_get("PATCH", `/company/${company.id}`,{company_name:name})
                company.company_name = name;
                setName(name);
            } catch (e) {
                setName(company.company_name)
            }
        }
    }

    const handlePhoneChange = async (e) => {
        if (company.company_phone !== phone) {
            try {
                const res = await not_core_get("PATCH", `/company/${company.id}`,{company_phone:phone})
                company.company_phone = phone;
                setPhone(phone);
            } catch (e) {
                setPhone(company.company_phone)
            }
        }
    }
    

    const handleEmailChange = async (e) => {
        if (company.company_email !== email) {
            try {
                const res = await not_core_get("PATCH", `/company/${company.id}`,{company_email:email})
                company.company_email = email;
                setEmail(email);
            } catch (e) {
                setEmail(company.company_email)
            }
        }
    }
    

    const handleIndustryChange = async (indus) => {
        if (company.company_industry !== indus) {
            try {
                const res = await not_core_get("PATCH", `/company/${company.id}`,{company_industry:indus})
                company.company_industry = indus;
                setIndustry(indus);
            } catch (e) {
                setIndustry(company.company_industry)
            }
        }
    }

    const handleIndustryRemove = async (e) => {
        if (company.company_industry !== null) {
            try {
                const res = await not_core_get("PATCH", `/company/${company.id}`,{company_industry:null})
                company.company_industry = null;
                setIndustry(null);
            } catch (e) {
                setIndustry(company.company_industry)
            }
        }
    }

    const handleSlugChange = async (e) => {
        if (company.company_slug !== slug) {
            try {
                const res = await not_core_get("PATCH", `/company/${company.id}`,{company_slug:slug})
                company.company_slug = slug;
                setSlug(slug);
                setSlugError(false);
            } catch (e) {
                setSlug(company.company_slug)
                setSlugError(true);
            }
        }
    }

    const handleUrlAdd = async (url) => {
        if (url && !urls.includes(url)) {
            try {
                const res = await not_core_get("PATCH", `/company/${company.id}`,{"company_urls":[...urls, url]})
                company.company_urls = [...urls, url];
                setUrls([...urls, url]);
            } catch (e) {
                console.log("URL ADD ERROR", e)
            }
        }
    }

    const handleUrlRemove = async (url) => {
        if (url && urls.includes(url)) {
            try {
                const res = await not_core_get("PATCH", `/company/${company.id}`,{"company_urls": urls.filter(u => u !== url)})
                company.company_urls = urls.filter(u => u !== url);
                setUrls(urls.filter(u => u !== url));
            } catch (e) {
            }
        }
    }

    const [name, setName] = useState(company.company_name)
    const [phone, setPhone] = useState(company.company_phone || null)
    const [email, setEmail] = useState(company.company_email || null)
    const [urls, setUrls] = useState(company.company_urls || [])
    const [showUrl, setShowUrl] = useState(false)
    const [industry, setIndustry] = useState(company.company_industry || null)
    const [slug, setSlug] = useState(company.company_slug || null)
    const [slugError, setSlugError] = useState(false);

    const fileInputRef = useRef(null);

    const handleAvatarChange = (value) => {
        if (value === 'initials') {
            handleImageReset();       
        } else if (value === 'image' && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };
    useEffect(() => {
        if (company.company_logo===null) {
            set_avatar(false);
        } else {
            set_avatar(true);
        }
    }, [company]);

    const [showDesc, setShowDesc] = useState(false);
    let bin = html_to_markdown(company?.company_description?.body);
    const [markdown, setMarkdown] = useState({ md: bin || "", cs: { line: 0, ch: 0 } });
    const [previewStatus, setPreviewStatus] = useState(false);

    const handlePreview = () => {
        setPreviewStatus(!previewStatus);
    };

    const inactivityTimer = useRef(null);
    const [timeLeft, setTimeLeft] = useState(null);

    const resetInactivityTimer = () => {
        /*
        if (inactivityTimer.current) {
            clearInterval(inactivityTimer.current);
        }

        let timeRemaining = 1; // Start with 2 seconds
        setTimeLeft(timeRemaining);

        inactivityTimer.current = setInterval(() => {
            if (timeRemaining > 0) {
                timeRemaining -= 0.5; // Decrement by 0.5 seconds
                setTimeLeft(timeRemaining);
            } else {
                clearInterval(inactivityTimer.current);
                handleDescriptionSave();
            }
        }, 500);
        */
    };

    useEffect(() => {
        /*
        return () => {
            if (inactivityTimer.current) {
                clearInterval(inactivityTimer.current);
            }
        };
        */
    }, []);

    const handleDescriptionSave = async () => {
        if (checkBody(body, marked(markdown.md))) {
            let desc = { ...company.company_description };
            desc.body = marked(markdown.md);
            if (desc.body === "") {
                desc.body = null;
            }
            const req_body = {
                "company_description": desc.body
            }
            const cs = markdown.cs;
            setPreviewStatus(false);
            try {
                const res = await not_core_get("PATCH", `/company/${company.id}`, req_body);
                setBody(marked(markdown.md))
                setMarkdown({ md: markdown.md, cs: cs});

            } catch (error) {
                setMarkdown(body, cs); 
            }
        } 
    };
    


    return (  
        <EmbloyV className="gap-4" >
            <EmbloyP>
                If you have subscribed to a professional plan, you can create and manage a company account in addition to your personal account. This company account represents your organization publicly on our platform, such as when posting job openings. Below, you can manage the details of your company profile, including its name, logo, industry, and contact information, ensuring your organization is accurately represented to potential candidates and partners.
                <a
                    className="px-1 italic text-embloy-purple-lighter hover:underline cursor-pointer"
                    href="https://developers.embloy.com/docs/category/account"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn more
                </a>
            </EmbloyP>
            <EmbloyH>

            </EmbloyH>
            
            { (user && company && company.id ) ?
                <EmbloyV className="gap-4" >
                    <EmbloyInputbox>
                        <EmbloyInputboxElement head="Company Information" description="Name & Unique Identfier of the company">
                            <EmbloyInput
                                max={100}
                                name="Company Name"
                                value={name}
                                required={true}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="Acme Inc."
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleNameChange(e);
                                    }
                                }}
                                onBlur={handleNameChange}
                            />
                            <EmbloyInput
                                name="Slug"
                                max={120}
                                value={slug}
                                required={true}
                                onChange={(e) => setSlug(e.target.value)}
                                placeholder="acme"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleSlugChange(e);
                                    }
                                }}
                                onBlur={handleSlugChange}
                                className={`${slugError && "border-primitivo dark:border-primitivo"}`}
                            />
                        </EmbloyInputboxElement>
                    </EmbloyInputbox>
                    <EmbloyInputbox>
                        <EmbloyInputboxElement head="Public Contact Details" description="Company email address & phone number">
                            <EmbloyInput
                                name="Company Email"
                                max={150}
                                value={email}
                                required={true}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="info@acme.inc"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handleEmailChange(e);
                                    }
                                }}
                                onBlur={handleEmailChange}
                            />
                            <EmbloyInput
                                max={20}
                                name="Company Phone"
                                value={phone}
                                required={true}
                                onChange={(e) => setPhone(e.target.value)}
                                placeholder="(555) 555-1234"
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        handlePhoneChange(e);
                                    }
                                }}
                                onBlur={handlePhoneChange}
                            />
                        </EmbloyInputboxElement>
                    </EmbloyInputbox>
                    <EmbloyInputbox>
                        <EmbloyInputboxElement head="Miscellaneous" description="Company industry & URLs">
                            <EmbloyH className="gap-2 justify-between items-center">
                                <EmbloyInput
                                    variant="select"
                                    onChange={(e) => handleIndustryChange(e.target.value)}
                                    value={company.company_industry !== null ? company.company_industry : ""}
                                    className={`w-52 text-sm ${(company.company_industry && company.company_industry !== "") ? "text-black dark:text-white" : "text-testaccio dark:text-nebbiolo"}`}
                                >
                                    <EmbloySelectOption placeholder={true} className="text-sm text-black dark:text-white">
                                        Select Industry
                                    </EmbloySelectOption>
                                    {industries && industries.map((industry, index) => {
                                         return <EmbloySelectOption key={index} value={industry.value} className={"max-w-52 text-sm text-black dark:text-white"} >
                                                {industry.label}
                                            </EmbloySelectOption>
                                    })}
                                </EmbloyInput>
                                { industry !== null &&
                                    <button onClick={handleIndustryRemove} className="hover:bg-primitivo/10 dark:hover:bg-primitivo/10 rounded-sm transition-colors duration-200">
                                        <XIcon className="w-4 h-4 text-primitivo dark:text-primitivo" />
                                    </button>
                                }
                                
                            </EmbloyH>
                            <EmbloyH className="gap-2 justify-center">
                                <EmbloyButton name="Edit Company URLs" onClick={() => setShowUrl(true)} variant="bold" />
                    
                                {
                                    showUrl && (

                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/75">
                                            <div className="w-11/12 rounded-md bg-white px-6 py-3 shadow-md dark:bg-gray-900 md:w-1/2">
                                                <div className="flex flex-row items-start justify-end">
                                                    <button
                                                        onClick={() => setShowUrl(false)}
                                                        className="font-heading text-xl text-gray-800 dark:text-gray-200"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                                <EmbloyH className="justify-between items-end">
                                                    <EmbloyH1 className="font-heading text-base">Company URLs:</EmbloyH1>
                                                    <EmbloyP className={`text-xs ${urls.length >= 10 && 'text-primitivo dark:text-primitivo'}`}>{"("+ urls.length + " | 10)" }</EmbloyP>
                                                </EmbloyH>
                                                <EmbloySeperator className="mt-0.5 mb-2 h-px" />
                                                {urls && urls.map((url, index) => (
                                                    <EmbloyH key={index} className="gap-2 justify-between">
                                                        <a
                                                            key={`${url}_${index}`}
                                                            href={url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex w-fit flex-row items-center gap-1.5"
                                                        >
                                                            <FaLink className="text-xs text-gray-800 dark:text-gray-200" />
                                                            <EmbloyP className="text-xs">{url}</EmbloyP>
                                                        </a>
                                                        <button
                                                            className="hover:bg-primitivo/10 dark:hover:bg-primitivo/10 rounded-sm transition-colors duration-200"
                                                            onClick={() => handleUrlRemove(url)}
                                                        >
                                                            <XIcon className="w-4 h-4 text-primitivo dark:text-primitivo" />
                                                        </button>
                                                    </EmbloyH>
                                                ))}
                                                <EmbloySeperator className="my-2 h-px" />
                                                <EmbloyV className="gap-2 justify-between">
                                                    <EmbloyH className="justify-between">
                                                        <EmbloyP className="cursor-pointer font-semibold text-xs hover:underline decoration-dotted">Add URL:</EmbloyP>
                                                    </EmbloyH>
                                                    <EmbloyInput
                                                        max={100}
                                                        name="URL"
                                                        disabled={urls.length >= 10}
                                                        placeholder="https://acme.inc"
                                                        onKeyPress={(e) => {
                                                            if (e.key === 'Enter') {
                                                                handleUrlAdd(e.target.value);
                                                                e.target.value = '';
                                                            }
                                                        }}
                                                        onBlur={(e) => {
                                                            handleUrlAdd(e.target.value);
                                                            e.target.value = '';
                                                        }}
                                                    />
                                                </EmbloyV>
                                            </div>
                                        </div>
                                    )
                                }
                            </EmbloyH>
                        </EmbloyInputboxElement>
                    </EmbloyInputbox>
                    <EmbloyInputbox>
                        <EmbloyInputboxElement head="Company Avatar" description="Public profile image">
                            <EmbloyH>
                                <EmbloyInput variant="single-choice">
                                    <EmbloyRadioOption
                                        value="initials"
                                        head="Use initials"
                                        checked={!avatar}
                                        onChange={() => handleAvatarChange('initials')}
                                        note = {removing ? 'Removing...' : removeError && 'Error removing'}
                                        note_state = {removeError ? 'error' : 'default'}
                                        
                                    />
                                    <EmbloyRadioOption
                                        value="image"
                                        head="Upload an image"
                                        checked={avatar}
                                        onChange={() => handleAvatarChange('image')}
                                        note={uploading ? 'Uploading...' : uploadError && 'Error uploading'}
                                        note_state={uploadError ? 'error' : 'default'}
                                    />
                                </EmbloyInput>
                            </EmbloyH>

                            <EmbloyH className="justify-end" >
                                <EmbloyInput
                                    variant="file"
                                    ref={fileInputRef}
                                    style={{ display: 'none' }} 
                                    onChange={handleImageChange} 
                                />

                                    
                                <button onClick={() => {handleAvatarChange('image')}} >
                                    <AvatarButton
                                        updated_image={newImageUrl}
                                        user={company}
                                        isUser={false}
                                        w={80}
                                        h={80}
                                        styles="max-h-fit rounded-full bg-transparent hover:bg-transparent"
                                        btn={false}
                                    />
                                </button>
                                
                            </EmbloyH>
                        </EmbloyInputboxElement>
                    </EmbloyInputbox>
                    <EmbloyInputbox>
                        <EmbloyInputboxElement head="Company Description" description="Customize the Company Board">
           
                            <EmbloyH className="gap-2" >
                                <Link href={`${siteConfig.core_url}/board/${company.company_slug}`} target="_blank">
                                    <EmbloyButton name="To Company Board" onClick={() => {}} variant="bold" />
                                </Link>
                                <EmbloyButton name="Edit Company Board" onClick={() => setShowDesc(true)} variant="bold" />
                                {
                                    showDesc && (

                                        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800/75">
                                            <div className="w-11/12 rounded-md bg-white px-6 py-3 shadow-md dark:bg-gray-900 md:w-3/4">
                                                <div className="flex flex-row items-start justify-end">
                                                    <button
                                                        onClick={() => {
                                                            setShowDesc(false)
                                                            handleDescriptionSave()
                                                        }}
                                                        className="font-heading text-xl text-gray-800 dark:text-gray-200"
                                                    >
                                                        &times;
                                                    </button>
                                                </div>
                                                <EmbloyH className="justify-between items-end">
                                                    <EmbloyH1 className="font-heading text-base">Company Description:</EmbloyH1>
                                                </EmbloyH>
                                                <div className="mt-0.5 mb-2 h-p" />
                                                { !previewStatus ?
                                                    <SimpleMDE
                                                        value={markdown.md}
                                                        getCodemirrorInstance={(instance) => { 
                                                            instance.on('change', (editor) => {
                                                                const cursorPosition = editor.getCursor(); 
                                                                const value = editor.getValue(); 
                                                                setMarkdown({ md: value, cs: cursorPosition }); 
                                                                resetInactivityTimer(); // Reset the inactivity timer on typing
                                                            });
                                                            if (markdown.cs) {
                                                                instance.setCursor(markdown.cs);
                                                            }
                                                        }}
                                                        className="w-full text-black dark:text-white"
                                                        options={{
                                                            autofocus: true,
                                                            hideIcons: ["guide", "side-by-side", "fullscreen", "quote", "preview"],
                                                            toolbar: [
                                                                {
                                                                    name: "custom",
                                                                    action: function customFunction(editor) {
                                                                        handlePreview();
                                                                    },
                                                                    className: "fa fa-eye",
                                                                    title: "Custom Button",
                                                                },
                                                                "|",
                                                                "bold",
                                                                "italic",
                                                                "heading",
                                                                "unordered-list",
                                                                "ordered-list",
                                                                "link",
                                                                "image",
                                                                "|",
                                                                {
                                                                    name: "custom_save",
                                                                    action: function customFunction(editor) {
                                                                        handleDescriptionSave();
                                                                    },
                                                                    className: "fa fa-save",
                                                                    title: "Save Button",
                                                                },
                                                            ],
                                                        }}
                                                    />
                                                : 
                                                <EmbloyV className="border border-etna dark:border-nebbiolo rounded-md ">
                                                    <EmbloyH className={"justify-start gap-2 px-4 py-2"}>
                                                        <button onClick={handlePreview}>
                                                            <EmbloyP className="text-xs text-capri dark:text-capri underline">{"Return to Editor"}</EmbloyP>
                                                        </button>
                                                    </EmbloyH>
                                                    <EmbloySeperator className="h-px w-full bg-etna dark:bg-nebbiolo" />
                                                    <EmbloyV className="px-4 py-2">
                                                        {markdown && parse(body || '', options)}
                                                    </EmbloyV>
                                                </EmbloyV>
                                                }
                                            </div>
                                        </div>
                                    )
                                }
                            </ EmbloyH>
                        </EmbloyInputboxElement>
                    </EmbloyInputbox>
                </EmbloyV>
                :
                <EmbloyV className="gap-4" >

                </EmbloyV>
            }
            
        </EmbloyV>
        
    )
}