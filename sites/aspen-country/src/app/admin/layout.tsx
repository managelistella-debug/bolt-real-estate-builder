import { ReactNode } from "react";
import { requireAdminUser } from "@/lib/admin-auth";
import AdminSidebar from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const user = await requireAdminUser();

  return (
    <main className="min-h-screen bg-[#F5F5F3] text-black">
      <div className="flex min-h-screen flex-col md:flex-row">
        <AdminSidebar />
        <section className="flex-1 p-5 md:p-8">
          <div className="mb-6 border-b border-[#EBEBEB] pb-4">
            <p className="text-sm text-[#888C99]">Signed in as {user.email}</p>
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
