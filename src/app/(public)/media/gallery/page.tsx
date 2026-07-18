import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/navbar";

const galleryImages = [1, 2, 3, 4, 5];

export default function GalleryPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(93,156,219,0.16),transparent_50%)]" />
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: "url('/images/2.jpeg')",
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          <div className="absolute inset-0 bg-background/70" />
        </div>
        <div className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline w-fit"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="rounded-3xl border border-border/60 bg-background/80 p-8 shadow-lg backdrop-blur">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-primary">
              Media • Gallery
            </p>
            <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              A glimpse into our work
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-muted-foreground">
              A selection of moments captured across our practice, teams, and
              client engagements.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {galleryImages.map((imageNumber) => (
                <div
                  key={imageNumber}
                  className="overflow-hidden rounded-2xl border border-border/60 bg-card"
                >
                  <Image
                    src={`/images/${imageNumber}.jpeg`}
                    alt={`Gallery image ${imageNumber}`}
                    width={800}
                    height={600}
                    className="h-64 w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
