// components/loader/index.tsx
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: number;
  text?: string;
  className?: string;
}

export const Loader = ({ size = 40, className, text }: LoaderProps) => (
  <div
    className={`flex flex-col items-center justify-center gap-3 ${className}`}
  >
    <Loader2 className="animate-spin text-blue-600" size={size} />
    {text && <p className="text-sm text-gray-600">{text}</p>}
  </div>
);
