import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Link href="/login">Login</Link>
      <Link href="/signup">Signup</Link> |{" "}
      <Link href="/dashboard">Dashboard</Link>
    </div>
  );
}
