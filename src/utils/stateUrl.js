/**
 * @fileoverview Utility functions for encoding/decoding app state into/from URL parameters.
 */
import pako from "pako";

/**
 * Encodes the state into a URL-safe Base64 string with compression.
 *
 * @param {Object} state - The app state.
 * @returns {string} The encoded state.
 */
export function encodeStateToUrl(state) {
  const json = JSON.stringify(state);
  const utf8Bytes = new TextEncoder().encode(json);
  const compressed = pako.deflate(utf8Bytes);
  const base64 = btoa(String.fromCharCode(...compressed));
  return encodeURIComponent(base64);
}

/**
 * Decodes the state from a URL-safe Base64 string with decompression.
 *
 * @param {string} base64 - The encoded state string.
 * @returns {Object|null} The decoded state or null if error occurs.
 */
export function decodeStateFromUrl(base64) {
  try {
    const compressedBytes = new Uint8Array(
      atob(base64)
        .split("")
        .map((char) => char.charCodeAt(0))
    );
    const decompressed = pako.inflate(compressedBytes);
    const json = new TextDecoder().decode(decompressed);
    return JSON.parse(json);
  } catch (e) {
    console.error("Failed to decode state from URL", e);
    return null;
  }
}
