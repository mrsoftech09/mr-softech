import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getData } from '../services/api';
import MetricCard from '../components/MetricCard';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip
} from 'recharts';
import { X } from 'lucide-react';

const colors = ['#42e8e0', '#f7c948', '#fb7185'];

const details = {
  'Total nodes': 'All tracked client infrastructure nodes currently in the system.',
  'Total users': 'The combined number of users across every tracked client service.',
  'Active services': 'Services with an expiry date more than 30 days away.',
  'Renewal health': 'Percentage of services currently in a healthy active state.',
  'Expiring soon': 'Services expiring within the next 30 days.',
  'Expired nodes': 'Services whose expiry date has already passed.'
};

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['summary'],
    queryFn: () => getData('/dashboard/summary')
  });

  const clients = useQuery({
    queryKey: ['dashboard-users'],
    queryFn: () => getData('/clients/users'),
    staleTime: 3e5
  });

  const [selected, setSelected] = useState(null);

  if (isLoading) return <p>Loading dashboard…</p>;
  if (error) return <p className="text-rose-300">Could not load dashboard.</p>;

  const d = data.data;

  const metrics = [
    ['Total nodes', d.totalNodes],
    ['Total users', d.totalUsers],
    ['Active services', d.activeServices],
    ['Renewal health', `${d.renewalHealth}%`, 'violet'],
    ['Expiring soon', d.expiringSoon],
    ['Expired nodes', d.expiredNodes]
  ];

  const allClients = clients.data?.data || [];

  const selectedClients = selected
    ? allClients.filter((c, i, a) =>
        selected.label === 'Total users'
          ? true
          : selected.label === 'Total nodes'
            ? a.findIndex(x => x.client === c.client) === i
            : selected.label === 'Active services' ||
                selected.label === 'Renewal health'
              ? c.status === 'ACTIVE'
              : selected.label === 'Expiring soon'
                ? c.status === 'EXPIRING_SOON'
                : selected.label === 'Expired nodes'
                  ? c.status === 'EXPIRED'
                  : true
      )
    : [];

  return (
    <>
      <header className="depth-enter">
        <p className="text-cyan text-sm font-bold tracking-widest">OVERVIEW</p>
        <h1 className="mt-2 text-3xl font-bold">Operations dashboard</h1>
        <p className="mt-2 text-slate-400">Your service estate at a glance.</p>
      </header>

      <section className="mt-7 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {metrics.map(([label, value, accent], i) => (
          <MetricCard
            key={label}
            label={label}
            value={value}
            accent={accent}
            index={i}
            onClick={() => setSelected({ label, value })}
          />
        ))}
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-2 depth-enter delay-3">
        <article className="card h-80 p-5">
          <h2 className="font-bold">Service health</h2>
          <ResponsiveContainer width="100%" height="90%">
            <PieChart>
              <Pie
                data={d.distribution}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
              >
                {d.distribution.map((x, i) => (
                  <Cell key={x.name} fill={colors[i]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </article>

        <article className="card h-80 p-5">
          <h2 className="font-bold">Services by data center</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={d.dataCenters}>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip />
              <Bar dataKey="value" fill="#42e8e0" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>
      </section>

      {selected && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-30 grid place-items-center bg-black/50 p-4"
          onClick={() => setSelected(null)}
        >
          <div
            className="card w-full max-w-md p-7"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-cyan">
                  Metric details
                </p>
                <h2 className="mt-2 text-2xl font-bold">{selected.label}</h2>
              </div>
              <button
                aria-label="Close details"
                onClick={() => setSelected(null)}
              >
                <X />
              </button>
            </div>
            <p className="mt-6 text-5xl font-bold text-cyan">{selected.value}</p>
            <p className="mt-4 text-slate-500">{details[selected.label]}</p>
            <div className="mt-5 max-h-48 overflow-y-auto rounded-lg border border-slate-200/20">
              {clients.isLoading ? (
                <p className="p-3 text-sm">Loading client breakdown…</p>
              ) : selectedClients.length ? (
                selectedClients.map(c => (
                  <div
                    key={c.email}
                    className="border-b border-slate-200/10 px-3 py-2 text-sm"
                  >
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-slate-500">
                      {c.email} · {c.client}
                    </p>
                  </div>
                ))
              ) : (
                <p className="p-3 text-sm text-slate-500">
                  No matching clients found.
                </p>
              )}
            </div>
            <button
              className="btn btn-primary mt-6 w-full"
              onClick={() => setSelected(null)}
            >
              Done
            </button>
          </div>
        </div>
      )}
    </>
  );
}