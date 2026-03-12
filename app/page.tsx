import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-500 to-blue-500">
      <div className="mx-auto max-w-4xl px-4 py-16 text-center text-white">
        <h1 className="mb-6 text-5xl font-bold">Modern Day Circus AI Content Extractor</h1>
        <p className="mb-8 text-xl">
          Transform your Instagram archive into Shopify-ready product ideas, collections, and copy.
        </p>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <Link
            href="/import"
            className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20"
          >
            <h3 className="text-lg font-semibold">Import</h3>
            <p className="text-sm">Scan and import Instagram exports</p>
          </Link>
          <Link
            href="/library"
            className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20"
          >
            <h3 className="text-lg font-semibold">Library</h3>
            <p className="text-sm">Browse classified content</p>
          </Link>
          <Link
            href="/analyze"
            className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20"
          >
            <h3 className="text-lg font-semibold">Analyze</h3>
            <p className="text-sm">Deep dive into export files</p>
          </Link>
          <Link
            href="/clusters"
            className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20"
          >
            <h3 className="text-lg font-semibold">Clusters</h3>
            <p className="text-sm">Explore theme clusters</p>
          </Link>
          <Link
            href="/shopify"
            className="rounded-lg bg-white/10 p-6 backdrop-blur-sm transition hover:bg-white/20"
          >
            <h3 className="text-lg font-semibold">Shopify</h3>
            <p className="text-sm">Generate commerce assets</p>
          </Link>
        </div>
      </div>
    </div>
  );
}

