import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NetworkScene from '../components/CinematicBackground';

function Welcome() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 grid place-items-center bg-[#070b13]/95 text-center"
    >
      <div>
        <motion.svg
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1, repeat: 1 }}
          width="92"
          height="92"
          viewBox="0 0 92 92"
          className="mx-auto mb-5 text-cyan"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
        >
          <rect x="16" y="25" width="60" height="46" rx="13" />
          <circle cx="36" cy="47" r="3" fill="currentColor" />
          <circle cx="56" cy="47" r="3" fill="currentColor" />
          <path d="M37 59c6 5 12 5 18 0M46 25V14M39 14h14" />
        </motion.svg>
        <p className="text-3xl font-black text-cyan">Welcome to MR SOFTECH 👋</p>
      </div>
    </motion.div>
  );
}

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm(),
        { login } = useAuth(),
        nav = useNavigate(),
        [error, setError] = useState(''),
        [busy, setBusy] = useState(false),
        [welcoming, setWelcoming] = useState(false);

  const submit = async d => {
    setBusy(true);
    setError('');
    try {
      await login(d);
      setWelcoming(true);
      setTimeout(() => nav('/dashboard'), 1800);
    } catch (e) {
      setError(e.response?.data?.error?.message || 'Unable to sign in');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main
      className="relative flex min-h-screen flex-col items-center overflow-hidden bg-[#10131d] text-white"
      style={{
        backgroundImage: "linear-gradient(rgba(6,12,25,.58),rgba(6,12,25,.8)),url(/login-reference-bg.png)",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
      <NetworkScene />
      <div className="absolute inset-0 bg-gradient-to-br from-[#071a33]/90 via-[#161827]/80 to-[#26131f]/90" />
      
      <header className="relative z-10 flex w-full justify-center px-4 pt-6 sm:pt-8">
        <div className="grid h-16 w-16 place-items-center rounded-2xl border border-white/25 bg-white/15 shadow-lg shadow-cyan/20 backdrop-blur-md">
          <svg
            viewBox="0 0 64 64"
            className="h-10 w-10 text-cyan"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
          >
            <rect x="14" y="18" width="36" height="30" rx="7" />
            <circle cx="25" cy="31" r="2" fill="currentColor" />
            <circle cx="39" cy="31" r="2" fill="currentColor" />
            <path d="M24 40c5 4 11 4 16 0M32 18V10" strokeLinecap="round" />
          </svg>
        </div>
      </header>

      <AnimatePresence>
        {welcoming && <Welcome />}
      </AnimatePresence>

      <form
        onSubmit={handleSubmit(submit)}
        className="relative z-10 mx-auto mt-8 w-[calc(100%-2rem)] max-w-sm sm:mt-10 rounded-xl border border-white/15 bg-slate-900/65 p-6 text-white shadow-2xl backdrop-blur-xl"
      >
        <p className="text-xs font-bold tracking-widest text-cyan">MR SOFTECH</p>
        <h1 className="mt-2 text-2xl font-bold">Welcome back</h1>
        <p className="mt-1 text-xs text-slate-300">
          Sign in to your private operations dashboard.
        </p>

        {error && (
          <p className="mt-4 rounded bg-rose-950 p-3 text-sm text-rose-200">
            {error}
          </p>
        )}

        <label className="mt-5 block text-xs font-semibold">
          Email
          <input
            className="field mt-2 border-white/15 bg-white/10"
            type="email"
            {...register('email', { required: true })}
          />
        </label>

        <label className="mt-3 block text-xs font-semibold">
          Password
          <input
            className="field mt-2 border-white/15 bg-white/10"
            type="password"
            {...register('password', { required: true, minLength: 8 })}
          />
        </label>

        <div className="mt-2 text-right">
          <button type="button" className="text-[10px] text-cyan">
            Forgot Password?
          </button>
        </div>

        <button
          disabled={busy}
          className="mt-4 w-full rounded-lg bg-gradient-to-r from-cyan to-blue-600 py-2.5 text-sm font-bold"
        >
          {busy ? 'Signing in…' : 'Login'}
        </button>

        <div className="my-4 text-center text-[10px] text-slate-400">OR</div>

        <button
          type="button"
          className="w-full rounded-lg border border-white/15 bg-white/10 py-2.5 text-xs font-semibold"
        >
          <span className="mr-2 text-red-400">G</span>
          Login with Google
        </button>

        <p className="mt-5 text-center text-[11px] text-slate-300">
          Don’t have an account?{' '}
          <span className="font-semibold text-cyan">Sign up</span>
        </p>
      </form>
    </main>
  );
}