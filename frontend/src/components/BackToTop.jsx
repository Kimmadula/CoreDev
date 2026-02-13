import { useState, useEffect } from "react";
import "../BackToTop.css"; // We'll move styles here or keep them in index.css

export default function BackToTop({ targetRef }) {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            let currentScroll = 0;
            if (targetRef && targetRef.current) {
                currentScroll = targetRef.current.scrollTop;
            } else {
                currentScroll = window.scrollY;
            }

            if (currentScroll > 300) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        const target = (targetRef && targetRef.current) ? targetRef.current : window;
        target.addEventListener("scroll", handleScroll);

        return () => target.removeEventListener("scroll", handleScroll);
    }, [targetRef]);

    const scrollToTop = () => {
        if (targetRef && targetRef.current) {
            targetRef.current.scrollTo({ top: 0, behavior: "smooth" });
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <button
            className={`back-to-top ${showButton ? 'visible' : ''}`}
            onClick={scrollToTop}
            aria-label="Back to top"
        >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19V5" />
                <path d="M5 12l7-7 7 7" />
            </svg>
        </button>
    );
}
