import { createFileRoute } from "@tanstack/react-router";
import { Hero, Nav } from "@/components/site/Hero";
import { PageLoader, PaintCursor, SmoothScroll } from "@/components/site/effects";
import {
  Animate, BrushPacks, Download, Faq, FeatureGrid, Finale, Footer, Journey, Layers, LiveBrushes, Statement,
} from "@/components/site/sections";
import { About } from "@/components/site/About";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Vero Fresco — Free pro painting & drawing app for Android" },
      { name: "description", content: "A painting, drawing and animation app for Android. Download the free APK for your phone or tablet." },
      { property: "og:title", content: "Vero Fresco — Paint, draw & animate on Android" },
      { property: "og:description", content: "A painting, drawing and animation app for Android. Download it free." },
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
        <Hero />
        <Statement />
        <Journey />
        <LiveBrushes />
        <Layers />
        <Animate />
        <FeatureGrid />
        <BrushPacks />
        <Finale />
        <Download />
        <Faq />
        <About />
      </main>
      <Footer />
    </>
  );
}
