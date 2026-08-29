import { useQuery } from '@tanstack/react-query';
import { getData } from '../services/api';
import { date } from '../utils/expiry';

export default function AuditLogs() {
  const q = useQuery({
    queryKey: ['audit'],
    queryFn: () => getData('/audit-logs')
  });

  return (
    <>
      <header>
        <p className="text-cyan text-sm font-bold tracking-widest">ACCOUNTABILITY</p>
        <h1 className="mt-2 text-3xl font-bold">Audit logs</h1>
      </header>
      <section className="card mt-6 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-700 text-slate-400">
              <th className="p-4">Action</th>
              <th className="p-4">Actor</th>
              <th className="p-4">Details</th>
              <th className="p-4">When</th>
            </tr>
          </thead>
          <tbody>
            {q.isLoading ? (
              <tr>
                <td className="p-8" colSpan="4">
                  Loading logs…
                </td>
              </tr>
            ) : (
              (q.data?.data || []).map(x => (
                <tr key={x._id} className="border-b border-slate-800">
                  <td className="p-4 font-medium">
                    {x.action.replaceAll('_', ' ')}
                  </td>
                  <td className="p-4">
                    {x.actor?.email || 'System'}
                  </td>
                  <td className="p-4 text-slate-400">
                    {x.meta?.nodeName || '—'}
                  </td>
                  <td className="p-4">
                    {date(x.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </>
  );
}