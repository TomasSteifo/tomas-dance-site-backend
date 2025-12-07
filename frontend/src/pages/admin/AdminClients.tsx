import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MainLayout } from '@/layouts/MainLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ClientApi } from '@/lib/api';
import { ClientDto } from '@/lib/api/types';
import { Loader2, Users, Mail, Phone, Calendar, Search } from 'lucide-react';

function formatDate(isoString: string): string {
  return new Date(isoString).toLocaleDateString();
}

const AdminClients = () => {
  const [clients, setClients] = useState<ClientDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredClients = useMemo(() => {
    if (!searchQuery) return clients;
    const query = searchQuery.toLowerCase();
    return clients.filter((client) =>
      client.fullName.toLowerCase().includes(query) ||
      client.email.toLowerCase().includes(query) ||
      client.phone?.toLowerCase().includes(query) ||
      client.id.toString().includes(query)
    );
  }, [clients, searchQuery]);

  useEffect(() => {
    async function fetchClients() {
      try {
        const data = await ClientApi.getAll();
        setClients(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load clients');
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  return (
    <MainLayout>
      <section className="pt-40 pb-20">
        <div className="container mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-foreground mb-2">Clients</h1>
            <p className="text-muted-foreground">All registered clients</p>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, phone, or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 max-w-md"
            />
          </div>

          {loading && (
            <div className="flex items-center justify-center gap-2 text-muted-foreground py-20">
              <Loader2 className="w-5 h-5 animate-spin" />
              Loading clients...
            </div>
          )}

          {error && (
            <div className="text-center py-20">
              <p className="text-destructive">{error}</p>
            </div>
          )}

          {!loading && !error && filteredClients.length === 0 && (
            <div className="text-center py-20">
              <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {clients.length === 0 ? 'No clients found.' : 'No clients match your search.'}
              </p>
            </div>
          )}

          {!loading && !error && filteredClients.length > 0 && (
            <div className="bg-card rounded-2xl border border-border overflow-hidden">
              <table className="w-full">
                <thead className="bg-secondary/50">
                  <tr>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Name</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Email</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Phone</th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-muted-foreground">Registered</th>
                    <th className="text-right px-6 py-4 text-sm font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {filteredClients.map((client) => (
                    <tr key={client.id} className="hover:bg-secondary/30 transition-colors">
                      <td className="px-6 py-4">
                        <span className="text-sm font-medium text-foreground">{client.fullName}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">{client.email}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {client.phone ? (
                          <div className="flex items-center gap-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{client.phone}</span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground/50">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formatDate(client.createdAtUtc)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" asChild>
                          <Link to={`/admin/bookings?clientId=${client.id}`}>
                            View Bookings
                          </Link>
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </section>
    </MainLayout>
  );
};

export default AdminClients;
