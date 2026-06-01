import Image from "next/image";
import { Button, Chip, Card, CardBody, Snippet } from "@heroui/react";
import {
  DOWNLOAD_URL,
  GITHUB_REPO_URL,
  GITHUB_RELEASES_URL,
  getLatestVersion,
} from "@/lib/site";
import { ClassGallery } from "@/components/ClassGallery";
import "@/styles/hisi-anim.css";
import "@/styles/demo.css";

const features = [
  {
    title: "Native in Elementor",
    body: "A “Hísi Anim” section in the Advanced tab (classic) and the General tab (atomic V4). Effect, clip-path reveal and duration — no code.",
  },
  {
    title: "Native in Bricks",
    body: "A “Hísi Anim” control group with its own icon in the Style tab and the element quick-access bar.",
  },
  {
    title: "Any other builder",
    body: "Gutenberg, Oxygen, Beaver Builder or your theme: just add the CSS classes to any element.",
  },
  {
    title: "Truly lightweight",
    body: "No jQuery, no external libraries. IntersectionObserver plus modern CSS scroll-driven animations.",
  },
  {
    title: "Works in every browser",
    body: "Uses native animation-timeline where available and loads a polyfill only when needed, e.g. Firefox.",
  },
  {
    title: "Accessible by default",
    body: "Respects motion preferences and degrades gracefully when animations aren’t supported.",
  },
];

export default async function Home() {
  const version = await getLatestVersion();

  return (
    <main className="relative mx-auto flex min-h-screen max-w-5xl flex-col px-6">
      {/* Hero */}
      <section className="hero-glow relative flex flex-col items-center pt-32 pb-24 text-center">
        <Image
          src="/hisi-icon-256.png"
          alt="Hísi Anim"
          width={72}
          height={72}
          className="rounded-[1.25rem] ring-1 ring-white/10"
          priority
        />

        <p className="mt-9 text-xs font-medium uppercase tracking-[0.28em] text-default-400">
          WordPress animation plugin
        </p>

        <h1 className="font-display mt-5 text-6xl font-semibold leading-[1.02] sm:text-7xl">
          Hísi Anim
        </h1>

        <p className="mt-6 max-w-xl text-balance text-lg font-light leading-relaxed text-default-500">
          Elegant, minimalist scroll-driven animations for WordPress. Add a
          class — and your elements come to life as they enter the viewport.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <Button
            as="a"
            href={DOWNLOAD_URL}
            color="primary"
            size="lg"
            radius="full"
            className="px-7 font-medium"
          >
            Download plugin
          </Button>
          <Button
            as="a"
            href={GITHUB_REPO_URL}
            variant="bordered"
            size="lg"
            radius="full"
            target="_blank"
            rel="noopener noreferrer"
            className="border-default-200 px-7 font-medium"
          >
            View on GitHub
          </Button>
        </div>

        <div className="mt-6 flex items-center gap-3 text-sm text-default-400">
          <Chip variant="flat" size="sm" className="bg-default-100 text-default-500">
            {version ? `Latest: ${version}` : "Free & open source"}
          </Chip>
          <span className="text-default-300">·</span>
          <span>GPL-2.0-or-later</span>
        </div>
      </section>

      {/* Features */}
      <section className="grid gap-px overflow-hidden rounded-2xl border border-default-100 bg-default-100 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => (
          <Card
            key={f.title}
            shadow="none"
            radius="none"
            className="bg-content1 transition-colors duration-300 hover:bg-content2"
          >
            <CardBody className="gap-2.5 p-7">
              <h3 className="text-[0.95rem] font-medium tracking-tight text-default-800">
                {f.title}
              </h3>
              <p className="text-sm font-light leading-relaxed text-default-500">
                {f.body}
              </p>
            </CardBody>
          </Card>
        ))}
      </section>

      {/* Usage */}
      <section className="pt-24 pb-12">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-default-400">
          Usage
        </p>
        <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Add a class. That’s it.
        </h2>
        <p className="mt-3 max-w-2xl text-balance font-light text-default-500">
          In any builder, drop the base class plus a modifier into the element’s{" "}
          <span className="text-default-700">CSS classes</span> field.
        </p>

        <div className="mt-7 max-w-2xl">
          <Snippet
            hideSymbol
            variant="bordered"
            radius="md"
            classNames={{
              base: "border-default-200 bg-content1",
              pre: "font-mono text-sm text-default-700",
            }}
          >
            {`class="hisi-anim ha--scrollBlurLeft"`}
          </Snippet>
        </div>
      </section>

      {/* Live class gallery */}
      <section className="pb-24">
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-default-400">
          Class reference
        </p>
        <h2 className="font-display mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
          Every class, live.
        </h2>
        <p className="mt-3 max-w-2xl text-balance font-light text-default-500">
          Each example replays as it scrolls into view. Hover a card and hit
          replay, or click it, to see the effect again.
        </p>

        <div className="mt-10">
          <ClassGallery />
        </div>
      </section>

      <hr className="hairline" />

      {/* Footer */}
      <footer className="flex flex-col items-center gap-3 py-14 text-center text-sm text-default-400">
        <div className="flex items-center gap-5">
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-default-700"
          >
            GitHub
          </a>
          <a
            href={GITHUB_RELEASES_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="transition-colors hover:text-default-700"
          >
            Releases
          </a>
        </div>
        <p className="text-default-300">
          © {new Date().getFullYear()} Hísi Anim · GPL-2.0-or-later
        </p>
      </footer>
    </main>
  );
}
