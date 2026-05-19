import Image from "next/image";
import { TableOfContents } from "@/components/TableOfContents";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col bg-background">
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center px-6 py-16 sm:px-8 sm:py-20">
        <header className="w-full max-w-4xl text-center">
          <p className="font-display text-2xl font-bold uppercase tracking-normal sm:text-3xl">
            Watilo, Inc.
          </p>

          <h1 className="mt-16 font-display text-3xl font-bold leading-tight sm:mt-24 sm:text-5xl lg:text-balance">
            Our Guide to Crafting Digital Products, Two Humans, and a Dream Life
          </h1>
        </header>

        <Image
          src="/images/sun.svg"
          alt=""
          width={75}
          height={63}
          className="mt-12 h-auto w-20"
          priority
        />

        <TableOfContents className="mt-16 w-full max-w-2xl" />

        <footer className="mt-auto flex flex-col items-center pt-24 pb-8">
          <Image
            src="/images/beach.svg"
            alt=""
            width={51}
            height={56}
            className="h-auto w-14"
          />
          <p className="mt-10 text-center font-display text-2xl font-bold italic leading-normal">
            Live for the journey, not the destination
          </p>
        </footer>
      </div>
    </main>
  );
}
