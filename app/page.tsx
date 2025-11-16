"use client";

import { useState } from "react";

export default function Home() {
  // state for the form
  const [url, setUrl] = useState("");
  const [alias, setAlias] = useState("");
  const [shortenedUrl, setShortenedUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // handle when form is submitted
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setShortenedUrl("");
    try {
      // send to api
      const response = await fetch("/api/shorten", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, alias }),
      });

      const data = await response.json();

      // if error
      if (!response.ok) {
        setError(data.error || "Failed to shorten URL");
        setIsLoading(false);
        return;
      }

      // if success show the shortened url and clear form
      if (data.shortenedUrl) {
        setShortenedUrl(data.shortenedUrl);
        setUrl("");
        setAlias("");
      } else {
        setError("No shortened URL returned from server");
      }
      setIsLoading(false);
    } catch (error) {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  // copy to clipboard function
  const handleCopy = async () => {
    if (shortenedUrl) {
      try {
        await navigator.clipboard.writeText(shortenedUrl);
        alert("Copied to clipboard!");
      } catch (error) {
        alert("Failed to copy");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100">
      <div className="w-full max-w-lg">
        <h1 className="text-3xl font-bold text-center mb-2">URL Shortener</h1>
        <p className="text-center text-gray-600 mb-6">
          Shorten your long URLs into compact, shareable links
        </p>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-lg font-semibold mb-2">Shorten a URL</h2>
          <p className="text-gray-600 mb-4">
            Enter a long URL to create a shorter, shareable link
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1">URL</label>
              <input
                type="text"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/very/long/url"
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block mb-1">Custom Alias</label>
              <div className="flex">
                <span className="p-2 bg-gray-100 border border-r-0 rounded-l">
                  /
                </span>
                <input
                  type="text"
                  value={alias}
                  onChange={(e) => setAlias(e.target.value)}
                  placeholder="my-custom-alias"
                  className="flex-1 p-2 border rounded-r"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full p-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
            >
              {isLoading ? "Shortening..." : "Shorten"}
            </button>
          </form>

          {error && (
            <div className="mt-4 p-3 bg-red-100 border border-red-300 rounded">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {shortenedUrl && (
            <div className="mt-4 p-3 bg-green-100 border border-green-300 rounded">
              <p className="text-sm mb-2">Your shortened URL:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={shortenedUrl}
                  readOnly
                  className="flex-1 p-2 bg-white border rounded text-sm"
                />
                <button
                  onClick={handleCopy}
                  className="px-4 py-2 bg-blue-600 text-white rounded"
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
