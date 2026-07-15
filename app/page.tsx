// Server component — fetches CMS content from Supabase, passes to client HomePage
import { getSiteContent } from "@/lib/content";
import HomePage from "@/components/HomePage";
import PreloadHead from "@/components/PreloadHead";

export const revalidate = 60; // Re-fetch content at most every 60 seconds

export default async function Page() {
  const content = await getSiteContent();
  return (
    <>
      <PreloadHead content={content} />
      <HomePage content={content} />
    </>
  );
}
