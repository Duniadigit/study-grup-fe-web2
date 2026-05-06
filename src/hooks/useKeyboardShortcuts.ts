import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

interface ShortcutOptions {
  onToggleDark?: () => void;
}

export function useKeyboardShortcuts({ onToggleDark }: ShortcutOptions = {}) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ignore if typing in input/textarea
      const tag = (e.target as HTMLElement).tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;

      // D → Dark mode toggle
      if (e.key === 'd' && !e.ctrlKey && !e.metaKey) {
        onToggleDark?.();
        return;
      }

      // G → Go to Groups
      if (e.key === 'g' && !e.ctrlKey && !e.metaKey) {
        navigate('/groups');
        return;
      }

      // H → Go to Dashboard (Home)
      if (e.key === 'h' && !e.ctrlKey && !e.metaKey) {
        navigate('/dashboard');
        return;
      }

      // N → New (create task if on task page, else create group)
      if (e.key === 'n' && !e.ctrlKey && !e.metaKey) {
        const taskMatch = location.pathname.match(/\/groups\/([^/]+)\/tasks/);
        if (taskMatch) {
          navigate(`/groups/${taskMatch[1]}/tasks/create`);
        } else {
          navigate('/groups/create');
        }
        return;
      }

      // Escape → Go back
      if (e.key === 'Escape') {
        navigate(-1);
        return;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [navigate, location, onToggleDark]);
}
