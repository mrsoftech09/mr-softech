import { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { mutations } from '../services/api';
import { Download, Upload } from 'lucide-react';

const pick = (r, ...keys) => keys.map(k => r[k]).find(v => v !== undefined && v !== '') ?? '';

export default function ExcelActions({ rows, onComplete }) {
  const input = useRef(),
        [busy, setBusy] = useState(false),
        [message, setMessage] = useState('');

  const exportExcel = () => {
    const data = rows.map(r => ({
      'Node Name': r.nodeName,
      'IP Address': r.ipAddress,
      'DataCenter Name': r.dataCenter,
      'Bill To': r.billTo,
      'Service To': r.serviceTo,
      'Number of users': r.numberOfUsers,
      'Expiry Date': r.expiryDate,
      'Bill From': r.billFrom,
      'FTP Drive Link': r.ftpLink || ''
    }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(data), 'Clients');
    XLSX.writeFile(wb, 'mr-softech-clients.xlsx');
  };

  const importExcel = async e => {
    const file = e.target.files?.[0];
    if (!file) return;

    setBusy(true);
    setMessage('');

    try {
      const w = XLSX.read(await file.arrayBuffer(), { type: 'array', cellDates: true }),
            raw = XLSX.utils.sheet_to_json(w.Sheets[w.SheetNames[0]], { defval: '' }),
            clients = raw.map(r => ({
              nodeName: pick(r, 'Node Name', 'nodeName'),
              ipAddress: pick(r, 'IP Address', 'ipAddress'),
              dataCenter: pick(r, 'DataCenter Name', 'Data Center', 'dataCenter'),
              billTo: pick(r, 'Bill To', 'billTo'),
              serviceTo: pick(r, 'Service To', 'serviceTo'),
              numberOfUsers: pick(r, 'Number of users', 'Users', 'numberOfUsers'),
              expiryDate: pick(r, 'Expiry Date', 'expiryDate'),
              billFrom: pick(r, 'Bill From', 'billFrom'),
              ftpLink: pick(r, 'FTP Drive Link', 'FTP Link', 'ftpLink')
            })),
            result = await mutations.post('/clients/bulk', { clients });

      setMessage(`${result.data.inserted} imported`);
      onComplete?.();
    } catch (err) {
      const details = err.response?.data?.error?.details?.[0];
      setMessage(
        details
          ? `Row ${details.row}: ${details.fields.map(x => x.field).join(', ')}`
          : err.response?.data?.error?.message || 'Import failed'
      );
    } finally {
      setBusy(false);
      e.target.value = '';
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn btn-muted" onClick={exportExcel}>
        <Download size={16} />
        Export to Excel
      </button>
      <button
        className="btn btn-muted"
        disabled={busy}
        onClick={() => input.current?.click()}
      >
        <Upload size={16} />
        {busy ? 'Importing…' : 'Import from Excel'}
      </button>
      <input
        ref={input}
        type="file"
        accept=".xlsx,.xls"
        className="hidden"
        onChange={importExcel}
      />
      {message && (
        <span className="self-center text-xs text-slate-500">{message}</span>
      )}
    </div>
  );
}