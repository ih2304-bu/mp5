import { redirect } from "next/navigation";
import { notFound } from "next/navigation";
import getCollection, { URLS_COLLECTION } from "@/db";

// this handles when someone visits /alias - redirects them
export default async function RedirectPage({
  params,
}: {
  params: Promise<{ alias: string }>;
}) {
  // get alias from url like /cs391
  const { alias } = await params;
  
  // get collection from db
  const collection = await getCollection(URLS_COLLECTION);
  
  // find the alias in database
  const urlDocument = await collection.findOne({ alias: alias });

  // if not found show 404
  if (!urlDocument) {
    notFound();
  }

  // redirect to the original url
  redirect(urlDocument.originalUrl);
}
