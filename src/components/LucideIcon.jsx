import * as Icons from 'lucide-react';

export default function LucideIcon({ name, ...props }) {
  const Icon = Icons[name] || Icons.Sparkles;
  return <Icon aria-hidden="true" focusable="false" {...props} />;
}
