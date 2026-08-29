import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getData, mutations } from '../services/api';
import { date, statusLabel, expiryUrgency } from '../utils/expiry';
import ClientForm from '../components/ClientForm';
import ExcelActions from '../components/ExcelActions';
import { Plus, Trash2, Pencil, X } from 'lucide-react';

const blank = {
  nodeName: '',
  ipAddress: '',
  dataCenter: '',
  billTo: '',
  serviceTo: '',
  numberOfUsers: 0,
  billFrom: '',
  expiryDate: '',
  ftpLink: ''
};

export default function Clients() {
  const [params, setParams] = useState({ page: 1, limit: 20, search: '', status: '', dataCenter: '' }),
        [form, setForm] = useState(null),
        [confirm, setConfirm] = useState(null),
        qc = useQueryClient();

  const qs = new URLSearchParams(Object.entries(params).filter(([, v]) => v !== ''));

  const q = useQuery({
    queryKey: ['clients', params],
    queryFn: () => getData('/clients?' + qs)
  });

  const rows = q.data?.data || [];

  const invalidate = () => qc.invalidateQueries({ queryKey: ['clients'] });

  const save = useMutation({
    mutationFn: ({ id, data }) =>
      id ? mutations.patch('/clients/' + id, data) : mutations.post('/clients', data),
    onSuccess: () => {
      invalidate();
      qc.invalidateQueries({ queryKey: ['summary'] });
      setForm(null);
    }
  });

  const del = useMutation({
    mutationFn: id => mutations.delete('/clients/' + id),
    onSuccess: () => {
      invalidate();
      setConfirm(null);
    }
  });

  const set = k => e => setParams(p => ({ ...p, [k]: e.target.value, page: 1 }));

  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-cyan text-sm font-bold tracking-widest">INVENTORY</p>
          <h1 className="mt-2 text-3xl font-bold">Client services</h1>
        </div>
        <button onClick={() => setForm(blank)} className="btn btn-primary">
          <Plus size={17} />
          Add client
        </button>
      </header>

      <section className="card mt-6 p-4">
        <div className="flex flex-wrap items-center gap-2">
          <input
            className="field max-w-sm"
            placeholder="Search node name or IP…"
            value={params.search}
            onChange={set('search')}
          />
          <select className="field w-auto" value={params.status} onChange={set('status')}>
            <option value="">All statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="EXPIRING_SOON">Expiring soon</option>
            <option value="EXPIRED">Expired</option>
          </select>
          <select className="field w-auto" value={params.dataCenter} onChange={set('dataCenter')}>
            <option value="">All data centers</option>
            {['AWS', 'Azure', 'GCP', 'On-Premise'].map(x => (
              <option key={x}>{x}</option>
            ))}
          </select>
          <ExcelActions rows={rows} onComplete={invalidate} />
        </div>

        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1000px] text-left text-sm">
            <thead className="border-b border-slate-700 text-xs uppercase text-slate-400">
              <tr>
                {[
                  'Node',
                  'IP address',
                  'Data center',
                  'Bill to',
                  'Service to',
                  'Users',
                  'Bill from',
                  'Expiry',
                  'Status',
                  'Actions'
                ].map(x => (
                  <th className="p-3" key={x}>{x}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {q.isLoading ? (
                <tr>
                  <td colSpan="10" className="p-8 text-center">Loading services…</td>
                </tr>
              ) : rows.length ? (
                rows.map(r => (
                  <tr className="border-b border-slate-800" key={r._id}>
                    <td className="p-3 font-medium">{r.nodeName}</td>
                    <td className="p-3 font-mono text-xs">{r.ipAddress}</td>
                    <td className="p-3">{r.dataCenter}</td>
                    <td className="p-3">{r.billTo}</td>
                    <td className="p-3">{r.serviceTo}</td>
                    <td className="p-3">{r.numberOfUsers}</td>
                    <td className="p-3">{date(r.billFrom)}</td>
                    <td className="p-3">
                      <div>{date(r.expiryDate)}</div>
                      <span className={'expiry-badge ' + expiryUrgency(r.expiryDate).className}>
                        {expiryUrgency(r.expiryDate).label}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={'status status-' + r.status}>
                        {statusLabel(r.status)}
                      </span>
                    </td>
                    <td className="p-3">
                      <button
                        aria-label="Edit"
                        onClick={() =>
                          setForm({
                            ...r,
                            billFrom: r.billFrom.slice(0, 10),
                            expiryDate: r.expiryDate.slice(0, 10)
                          })
                        }
                        className="mr-2 text-cyan"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        aria-label="Delete"
                        onClick={() => setConfirm(r)}
                        className="text-rose-300"
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="p-10 text-center text-slate-400">
                    No client services match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <footer className="mt-4 flex justify-between text-sm text-slate-400">
          <span>{q.data?.meta?.total || 0} results</span>
          <span>
            <button
              disabled={params.page === 1}
              onClick={() => setParams(p => ({ ...p, page: p.page - 1 }))}
            >
              Previous
            </button>
            <span className="mx-2">Page {params.page}</span>
            <button
              disabled={rows.length < params.limit}
              onClick={() => setParams(p => ({ ...p, page: p.page + 1 }))}
            >
              Next
            </button>
          </span>
        </footer>
      </section>

      {form && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-30 grid place-items-center bg-black/70 p-4">
          <div className="card w-full max-w-2xl p-6">
            <div className="mb-5 flex justify-between">
              <h2 className="text-xl font-bold">{form._id ? 'Edit client' : 'Add client'}</h2>
              <button onClick={() => setForm(null)}><X /></button>
            </div>
            <ClientForm
              initial={form}
              busy={save.isPending}
              onSubmit={d => save.mutate({ id: form._id, data: d })}
              onCancel={() => setForm(null)}
            />
          </div>
        </div>
      )}

      {confirm && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-30 grid place-items-center bg-black/70 p-4">
          <div className="card max-w-sm p-6">
            <h2 className="text-xl font-bold">Delete service?</h2>
            <p className="mt-2 text-sm text-slate-400">{confirm.nodeName} will be soft-deleted.</p>
            <div className="mt-6 flex justify-end gap-2">
              <button className="btn btn-muted" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="btn bg-rose-500 text-white" onClick={() => del.mutate(confirm._id)}>Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}