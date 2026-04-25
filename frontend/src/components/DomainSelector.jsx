import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check, Plus } from "lucide-react";
import "../styles/DomainSelector.css";

const DOMAINS = [
    "example.com",
    "my-app.io",
    "store-front.com",
    "blog.dev"
];

const DomainSelector = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedDomain, setSelectedDomain] = useState(DOMAINS[0]);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="domain-selector-container" ref={dropdownRef}>
            <button className="domain-trigger" onClick={() => setIsOpen(!isOpen)}>
                <Globe size={16} />
                <span>{selectedDomain}</span>
                <ChevronDown size={14} className={`chevron ${isOpen ? 'open' : ''}`} />
            </button>

            {isOpen && (
                <div className="domain-dropdown">
                    <div className="domain-list">
                        {DOMAINS.map((domain) => (
                            <button
                                key={domain}
                                className={`domain-item ${selectedDomain === domain ? 'active' : ''}`}
                                onClick={() => {
                                    setSelectedDomain(domain);
                                    setIsOpen(false);
                                }}
                            >
                                <span>{domain}</span>
                                {selectedDomain === domain && <Check size={14} />}
                            </button>
                        ))}
                    </div>
                    <div className="domain-footer">
                        <button className="add-domain-btn">
                            <Plus size={14} />
                            <span>Add New Domain</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DomainSelector;
