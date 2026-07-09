import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">

        <h1 className="text-8xl font-bold text-primary">
          404
        </h1>

        <h2 className="text-3xl font-semibold mt-4">
          Page Not Found
        </h2>

        <p className="text-muted-foreground mt-4">
          Sorry, the page you are looking for does not exist or may have been moved.
        </p>

        <Link
          href="/"
          className="inline-flex mt-8 px-6 py-3 rounded-full bg-primary text-white hover:opacity-90 transition"
        >
          Back to Home
        </Link>

      </div>
    </main>
  );
}