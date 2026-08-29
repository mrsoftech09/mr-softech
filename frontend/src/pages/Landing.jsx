import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Menu, X, ArrowUpRight } from 'lucide-react';

const video = 'https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260803_192301_9231ed6b-c55c-4a48-909c-4ebe11cf2e11.mp4';
const links = ['Modules', 'Clientele', 'Solutions', 'Billing'];

export default function Landing() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <main
      className="relative h-screen w-full overflow-hidden bg-black text-white"
      style={{ fontFamily: 'Geist, Inter, sans-serif' }}
    >
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover opacity-75"
        src={video}
      />
      <div className="absolute inset-0 bg-black/25" />
      
      <nav className="relative z-50 flex items-center justify-between px-5 py-5 sm:px-8 sm:py-6 lg:px-12">
        <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
          <img
            src="/mr-cloud-logo.png"
            alt="MR CLOUD"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span>
            MR CLOUD{' '}
            <small className="block text-[9px] font-normal opacity-70">
              A Unit of MR SOFTECH
            </small>
          </span>
          <svg
            width="24"
            height="24"
            viewBox="0 0 256 256"
            fill="currentColor"
          >
            <path d="M128 128C128 198.692 70.692 256 0 256c0-70.692 57.308-128 128-128Zm0 0c70.692 0 128 57.308 128 128-70.692 0-128-57.308-128-128ZM0 0c70.692 0 128 57.308 128 128C57.308 128 0 70.692 0 0ZM256 0c0 70.692-57.308 128-128 128C128 57.308 185.308 0 256 0Z" />
          </svg>
          mr softech
        </Link>

        <div className="hidden items-center gap-3 md:flex">
          <div className="flex gap-1 rounded-full bg-white/10 px-1.5 py-1.5 backdrop-blur-lg">
            {links.map(x => (
              <a
                key={x}
                href={`#${x.toLowerCase()}`}
                className="flex items-center gap-1 rounded-full px-4 py-1.5 text-sm font-medium text-white/80 transition-colors hover:bg-white/10 hover:text-white"
              >
                {x}
                {x === 'Solutions' && <ChevronDown size={14} />}
              </a>
            ))}
          </div>
          <Link
            to="/login"
            className="self-stretch rounded-full bg-gradient-to-b from-[#2b2b2b] to-[#101010] px-5 py-2 text-sm font-medium transition hover:opacity-90"
          >
            Get started <ArrowUpRight className="ml-1 inline" size={14} />
          </Link>
        </div>

        <button
          onClick={() => setOpen(x => !x)}
          className="relative z-50 grid h-10 w-10 place-items-center rounded-full bg-white/10 backdrop-blur-lg md:hidden"
          aria-label="Toggle menu"
        >
          <Menu
            className={`absolute transition-all duration-300 ${
              open ? 'rotate-90 scale-0 opacity-0' : 'scale-100 opacity-100'
            }`}
          />
          <X
            className={`absolute transition-all duration-300 ${
              open ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-0 opacity-0'
            }`}
          />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/80 backdrop-blur-md"
            />
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ duration: .5, ease: [.16, 1, .3, 1] }}
              className="fixed right-0 top-0 z-40 flex h-full w-72 flex-col bg-black/90 p-6 pt-24 backdrop-blur-xl"
            >
              <div className="space-y-2">
                {links.map((x, i) => (
                  <motion.a
                    key={x}
                    href={`#${x.toLowerCase()}`}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (i + 1) * .06 }}
                    onClick={() => setOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium text-white/80 hover:bg-white/10 hover:text-white"
                  >
                    {x}
                    {x === 'Solutions' && <ChevronDown size={16} />}
                  </motion.a>
                ))}
              </div>
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="mt-auto rounded-full bg-gradient-to-b from-[#2b2b2b] to-[#101010] px-5 py-3 text-center text-sm font-medium"
              >
                Get started
              </Link>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <section className="relative z-10 mt-auto flex h-[calc(100%-84px)] flex-col justify-end gap-6 px-5 pb-8 sm:px-8 sm:pb-12 lg:flex-row lg:items-end lg:justify-between lg:px-12 lg:pb-16">
        <motion.div
          initial={{ opacity: 0, filter: 'blur(10px)', y: 26 }}
          animate={{ opacity: 1, filter: 'blur(0)', y: 0 }}
          transition={{ duration: 1, ease: [.25, .1, .25, 1] }}
          className="max-w-xl"
        >
          <p className="mb-5 text-xs uppercase tracking-[.3em] text-white/60">
            MR SOFTECH · INFRASTRUCTURE OPS
          </p>
          <h1 className="text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl lg:text-[3.5rem]">
            Secure client infrastructure that works while you rest
          </h1>
          <div className="mt-6 inline-flex flex-col gap-3 rounded-2xl bg-white p-1.5 sm:flex-row sm:items-center sm:rounded-full">
            <input
              placeholder="Type your email"
              className="rounded-full bg-white px-5 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 sm:w-64 sm:rounded-none sm:py-2"
            />
            <Link
              to="/login"
              className="rounded-full bg-gradient-to-b from-[#2b2b2b] to-[#101010] px-6 py-3 text-center text-sm font-medium text-white transition hover:opacity-90 sm:py-2.5"
            >
              Get started <ArrowUpRight className="ml-1 inline" size={14} />
            </Link>
          </div>
        </motion.div>

        <div className="flex flex-col gap-4 sm:flex-row lg:gap-5">
          <motion.article
            initial={{ opacity: 0, filter: 'blur(10px)', y: 26 }}
            animate={{ opacity: 1, filter: 'blur(0)', y: 0 }}
            transition={{ delay: .2, duration: 1 }}
            className="w-full rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:w-64"
          >
            <p className="text-3xl font-normal tracking-tight" style={{ fontFamily: 'monospace' }}>
              42,500+
            </p>
            <p className="mt-3 text-sm leading-relaxed text-white/70">
              Teams run MR SOFTECH to handle recurring infrastructure ops daily.
            </p>
          </motion.article>

          <motion.article
            initial={{ opacity: 0, filter: 'blur(10px)', y: 26 }}
            animate={{ opacity: 1, filter: 'blur(0)', y: 0 }}
            transition={{ delay: .3, duration: 1 }}
            className="w-full rounded-2xl bg-white/10 p-5 backdrop-blur-lg sm:w-64"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="grid h-6 w-6 place-items-center rounded bg-black font-bold text-white">
                M
              </span>
              <span className="text-sm font-semibold">MR Softech</span>
            </div>
            <p className="text-sm leading-relaxed text-white/80">
              “One secure place to see every node, service period, and renewal decision.”
            </p>
            <div className="mt-4 flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-violet to-cyan text-xs font-bold text-ink">
                MR
              </span>
              <div>
                <p className="text-sm font-semibold">Operations team</p>
                <p className="text-xs text-white/60">Infrastructure control</p>
              </div>
            </div>
          </motion.article>
        </div>
      </section>
    </main>
  );
}