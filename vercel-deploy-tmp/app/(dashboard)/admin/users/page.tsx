'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useAuthStore } from '@/lib/stores/auth';

export default function AdminUsersPage() {
  const router = useRouter();
  const { getAllUsers, startImpersonation, user } = useAuthStore();
  const [search, setSearch] = useState('');
  const [reason, setReason] = useState('Customer support request');

  const rows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return getAllUsers().filter((entry) => {
      if (!term) return true;
      return (
        entry.name.toLowerCase().includes(term) ||
        entry.email.toLowerCase().includes(term) ||
        entry.role.toLowerCase().includes(term)
      );
    });
  }, [getAllUsers, search]);

  return (
    <div>
      <Header
        title="Admin Users"
        description="Browse all tenants and enter support mode as that user."
      />
      <div className="space-y-4 p-6">
        <Input
          value={reason}
          onChange={(event) => setReason(event.target.value)}
          placeholder="Support reason for impersonation audit trail"
        />
        <Input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search users by name, email, role"
        />
        <Card className="divide-y">
          {rows.map((entry) => (
            <div key={entry.id} className="flex flex-col gap-3 p-4 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="font-medium">{entry.name}</p>
                <p className="text-sm text-muted-foreground">{entry.email}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge variant="secondary">{entry.role}</Badge>
                  {entry.id === user?.id && <Badge>Current</Badge>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    if (startImpersonation(entry.id, reason)) {
                      router.push('/dashboard');
                    }
                  }}
                >
                  View Dashboard
                </Button>
                <Button
                  onClick={() => {
                    if (startImpersonation(entry.id, reason)) {
                      router.push('/dashboard');
                    }
                  }}
                >
                  Log in as user
                </Button>
              </div>
            </div>
          ))}
          {rows.length === 0 && (
            <div className="p-8 text-center text-sm text-muted-foreground">No users matched your search.</div>
          )}
        </Card>
      </div>
    </div>
  );
}
