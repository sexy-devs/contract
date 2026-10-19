import { useEffect, useState } from "react";

type Props = {
  show: boolean;
  message: string;
  duration?: number;
  onDismiss: () => void;
};

function Toast({ show, message, duration = 2500, onDismiss }: Props) {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (!show) return;

    setProgress(100);
    const start = Date.now();

    const tick = setInterval(() => {
      const elapsed = Date.now() - start;
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(remaining);

      if (elapsed >= duration) {
        clearInterval(tick);
        onDismiss();
      }
    }, 30);

    return () => clearInterval(tick);
  }, [show, duration, onDismiss]);

  if (!show) return null;

  return (
    <div className="fixed bottom-6 left-1/2 z-50 w-full max-w-sm -translate-x-1/2 px-4">
      <div className="overflow-hidden rounded-xl border border-green-200 bg-white shadow-lg">
        <p className="px-4 py-3 text-sm font-medium text-green-700">✓ {message}</p>
        <div className="h-1 bg-green-100">
          <div className="h-full bg-green-600" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}

export default Toast;
