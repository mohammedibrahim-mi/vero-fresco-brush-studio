import { createFileRoute } from "@tanstack/react-router";
import { Hero, Nav } from "@/components/site/Hero";
import { PageLoader, PaintCursor, SmoothScroll } from "@/components/site/effects";
import {
  Animate, BrushPacks, Comparison, Faq, FeatureGrid, Finale, Footer, Journey, Layers, LiveBrushes, Numbers, Statement,
} from "@/components/site/sections";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vero Fresco — Free pro painting & drawing app for Android" },
      { name: "description", content: "Thousands of brushes, unlimited layers and real animation for Android phones, tablets and stylus. Free for all." },
      { property: "og:title", content: "Vero Fresco — Paint, draw & animate on Android" },
      { property: "og:description", content: "The pro painting & drawing app for Android. Made for everyone. Free for all." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <PageLoader />
      <SmoothScroll />
      <PaintCursor />
      <Nav />
      <main>
        <Hero videoSrc="" />
        <Statement />
        <Journey />
        <LiveBrushes />
        <Numbers />
        <Layers />
        <Animate />
        <FeatureGrid />
        <BrushPacks />
        <Comparison />
        <Finale />
        <Faq />
      </main>
      <Footer />
    </>
  );
}
