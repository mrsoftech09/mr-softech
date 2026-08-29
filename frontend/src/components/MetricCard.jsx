import { motion } from 'framer-motion';
import { Activity, Users, Server, ShieldCheck, Clock3, TrendingUp } from 'lucide-react';

const icons = {
  "Total nodes": Server,
  "Total users": Users,
  "Active services": Activity,
  "Renewal health": ShieldCheck,
  "Expiring soon": Clock3,
  "Expired nodes": TrendingUp
};

const order = {
  "Total nodes": 0,
  "Total users": 1,
  "Active services": 2,
  "Renewal health": 3,
  "Expiring soon": 4,
  "Expired nodes": 5
};

export default function MetricCard({
  label,
  value,
  accent = 'cyan',
  index = order[label] ?? 0,
  onClick
}) {
  const Icon = icons[label] || Activity;

  return (
    <motion.article
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={e => onClick && (e.key === 'Enter' || e.key === ' ') && onClick()}
      initial={{ opacity: 0, filter: 'blur(8px)', y: 15 }}
      animate={{ opacity: 1, filter: 'blur(0px)', y: 0 }}
      transition={{ duration: .55, delay: index * .09, ease: [.25, .1, .25, 1] }}
      className="card metric-card group relative cursor-pointer overflow-hidden p-5"
    >
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className={`mt-2 text-3xl font-bold text-${accent === 'violet' ? 'violet' : 'cyan'}`}>
            {value}
          </p>
          {label === 'Renewal health' && (
            <div className="mt-3 h-1.5 w-40 overflow-hidden rounded-full bg-slate-700">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${value}%` }}
                transition={{ delay: .4, duration: 1 }}
                className="h-full rounded-full bg-gradient-to-r from-violet to-cyan"
              />
            </div>
          )}
        </div>
        <span className="icon-badge grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-violet to-cyan text-ink">
          <Icon size={20} />
        </span>
      </div>
    </motion.article>
  );
}