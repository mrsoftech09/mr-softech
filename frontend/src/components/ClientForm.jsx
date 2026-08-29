import { useForm } from 'react-hook-form';
import { useEffect } from 'react';

const fields = [
  ['nodeName', 'Node name'],
  ['ipAddress', 'IP address'],
  ['dataCenter', 'Data center'],
  ['billTo', 'Bill to'],
  ['serviceTo', 'Service to'],
  ['numberOfUsers', 'Number of users'],
  ['billFrom', 'Bill from', 'date'],
  ['expiryDate', 'Expiry date', 'date'],
  ['ftpLink', 'FTP link (optional)']
];

export default function ClientForm({ initial, onSubmit, busy, onCancel }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm({ defaultValues: initial });

  useEffect(() => reset(initial), [initial, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid gap-3 sm:grid-cols-2">
      {fields.map(([key, label, type]) => (
        <label key={key} className={key === 'ftpLink' ? 'sm:col-span-2' : ''}>
          <span className="mb-1 block text-xs text-slate-400">{label}</span>
          <input
            className="field"
            type={type || (key === 'numberOfUsers' ? 'number' : 'text')}
            {...register(key, {
              required: key !== 'ftpLink',
              min: key === 'numberOfUsers' ? 0 : undefined
            })}
          />
          {errors[key] && (
            <span className="text-xs text-rose-300">Required or invalid</span>
          )}
        </label>
      ))}
      <div className="sm:col-span-2 flex gap-2 justify-end">
        <button type="button" onClick={onCancel} className="btn btn-muted">
          Cancel
        </button>
        <button disabled={busy} className="btn btn-primary">
          {busy ? 'Saving…' : 'Save client'}
        </button>
      </div>
    </form>
  );
}