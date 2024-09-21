import { useState, useEffect } from 'react';

type SVGLoaderProps = {
    url: string;
    width?: string;
    height?: string;
    fill?: string;
};

export default function SVGLoader({
    url,
    width,
    height,
    fill
}: SVGLoaderProps) {
    const [svgContent, setSvgContent] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        if (isLoading) {
            try {
                fetch(url)
                    .then(async (res) => {
                        if (!res.ok) {
                            throw new Error("Failed to fetch SVG from server! " + res.status)
                        } else {
                            const svgText = await res.text();
                            setSvgContent(svgText);
                        }

                        setIsLoading(false)
                    })
                    .catch((e) => {
                        console.error("Could not fetch SVG: ", e);
                        setIsLoading(false);
                    })
            } catch (e) {
                console.error("Failed to fetch SVG", e);
                setIsLoading(false);
            }
        }
    }, [isLoading, url])

    if (isLoading) return <div/>;

    // Parse the SVG content to a DOM element
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgContent, 'image/svg+xml');
    const svgElement = svgDoc.documentElement;

    // Apply fill if provided
    if (fill) {
        svgElement.setAttribute('fill', fill);
    }

    // width and height
    if (width) {
        svgElement.setAttribute('width', width);
    }
    if (height) {
        svgElement.setAttribute('height', height);
    }

    svgElement.setAttribute('viewbox', "0 0 300 300.251")

    return (
        <div 
            className="svg-container"
            dangerouslySetInnerHTML={{ __html: svgElement.outerHTML }} 
        />
    );
}