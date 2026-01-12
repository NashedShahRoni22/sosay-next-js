import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      
      {/* Icon / Emoji */}
      <div className="mb-6 text-7xl">🚧</div>

      {/* Main Heading */}
      <h1 className="text-5xl font-bold tracking-tight sm:text-7xl">
        Page Not Found
      </h1>

      {/* Subtext */}
      <p className="mt-4 max-w-xl text-lgsm:text-xl text-center">
        Looks like this page doesn’t exist or is still under construction.
        Don’t worry — it happens even on the best social apps.
      </p>

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        <Link
          href="/app"
          className="rounded-full bg-secondary text-white px-6 py-3 text-lg font-medium transition hover:bg-secondary/80"
        >
          Go Back Home
        </Link>
      </div>

      {/* Footer text */}
      <span className="mt-10 text-sm">
        Error 404 • Not Found
      </span>
    </div>
  );
}
