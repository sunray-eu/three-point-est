import pako from "pako";

/**
 * Encodes the state into a URL-safe Base64 string with compression
 */
export function encodeStateToUrl(state) {
    const json = JSON.stringify(state);
    const utf8Bytes = new TextEncoder().encode(json);

    // Compress with pako (zlib)
    const compressed = pako.deflate(utf8Bytes);

    // Convert to Base64
    const base64 = btoa(String.fromCharCode(...compressed))

    return encodeURIComponent(base64);
}

/**
 * Decodes the state from a URL-safe Base64 string with decompression
 */
export function decodeStateFromUrl(base64) {
    try {
        // Convert Base64 back to Uint8Array
        const compressedBytes = new Uint8Array(
            atob(base64)
                .split("")
                .map((char) => char.charCodeAt(0))
        );

        // Decompress using pako
        const decompressed = pako.inflate(compressedBytes);

        // Convert back to string and parse JSON
        const json = new TextDecoder().decode(decompressed);
        return JSON.parse(json);
    } catch (e) {
        console.error("Failed to decode state from URL", e);
        return null;
    }
}
