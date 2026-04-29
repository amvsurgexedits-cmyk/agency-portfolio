import { useEffect, useRef } from 'react';

interface ScrollAnimationOptions {
    threshold?: number;
    rootMargin?: string;
    triggerOnce?: boolean;
}

export const useScrollAnimation = (options: ScrollAnimationOptions = {}) => {
    const elementsRef = useRef<(HTMLElement | null)[]>([]);

    useEffect(() => {
        const observerOptions = {
            root: null,
            rootMargin: options.rootMargin || '0px',
            threshold: options.threshold || 0.1,
        };

        const handleIntersect = (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-fade-up-active');
                    if (options.triggerOnce !== false) {
                        observer.unobserve(entry.target);
                    }
                }
            });
        };

        const observer = new IntersectionObserver(handleIntersect, observerOptions);

        const elements = elementsRef.current.filter((el): el is HTMLElement => el !== null);
        elements.forEach((el) => observer.observe(el));

        return () => {
            elements.forEach((el) => observer.unobserve(el));
        };
    }, [options.rootMargin, options.threshold, options.triggerOnce]);

    const addToRefs = (el: HTMLElement | null) => {
        if (el && !elementsRef.current.includes(el)) {
            elementsRef.current.push(el);
        }
    };

    return addToRefs;
};
