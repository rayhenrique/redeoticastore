import { LoginForm } from "@/components/admin/login-form";

interface AdminLoginPageProps {
  searchParams: Promise<{ next?: string }>;
}

export default async function AdminLoginPage({ searchParams }: AdminLoginPageProps) {
  const params = await searchParams;

  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <LoginForm nextPath={params.next || "/admin"} />
    </main>
  );
}
