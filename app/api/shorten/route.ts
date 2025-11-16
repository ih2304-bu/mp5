import { NextResponse } from "next/server";
import getCollection, { URLS_COLLECTION } from "@/db";

// api route to shorten urls
export async function POST(request: Request) {
  try {
    // get url and alias from request
    const body = await request.json();
    const { url, alias } = body;

    // check if both are provided
    if (!url || !alias) {
      return NextResponse.json(
        { error: "URL and alias are required" },
        { status: 400 }
      );
    }

    // validate url format - needs http:// or https://
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      return NextResponse.json(
        { error: "Invalid URL. Must start with http:// or https://" },
        { status: 400 }
      );
    }

    // get the collection
    const collection = await getCollection(URLS_COLLECTION);
    
    // check if alias already exists
    const existing = await collection.findOne({ alias: alias });

    if (existing) {
      return NextResponse.json(
        { error: "This alias is already taken. Please choose another one." },
        { status: 400 }
      );
    }

    // save to database
    await collection.insertOne({
      alias: alias,
      originalUrl: url,
      createdAt: new Date(),
    });

    // get base url - uses env var or request origin or localhost
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ||
      request.headers.get("origin") ||
      "http://localhost:3000";

    // return the shortened url
    return NextResponse.json({
      success: true,
      shortenedUrl: `${baseUrl}/${alias}`,
    });
  } catch (error) {
    // return error message for debugging
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Something went wrong: ${errorMessage}` },
      { status: 500 }
    );
  }
}
