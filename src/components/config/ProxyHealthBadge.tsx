import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { proxyHealthApi, type ProxyHealthStatus } from '@/services/api/proxyHealth';
import styles from './VisualConfigEditor.module.scss';

export function ProxyHealthBadge() {
  const { t } = useTranslation();
  const [health, setHealth] = useState<ProxyHealthStatus | null>(null);

  useEffect(() => {
    let mounted = true;
    const fetchHealth = async () => {
      try {
        const status = await proxyHealthApi.getStatus();
        if (mounted) setHealth(status);
      } catch {
        // Silently ignore fetch failures
      }
    };
    fetchHealth();
    const interval = setInterval(fetchHealth, 30_000);
    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  if (!health || !health.monitored) {
    return null;
  }

  const statusColor =
    health.status === 'healthy'
      ? '#22c55e'
      : health.status === 'probing'
        ? '#eab308'
        : '#ef4444';

  const statusText =
    health.status === 'healthy'
      ? t('config_management.visual.sections.network.proxy_health_healthy')
      : health.status === 'probing'
        ? t('config_management.visual.sections.network.proxy_health_probing')
        : t('config_management.visual.sections.network.proxy_health_disabled');

  const nextProbe =
    health.status === 'disabled' && health.next_probe_at
      ? ` (${t('config_management.visual.sections.network.proxy_health_next_probe')}: ${new Date(health.next_probe_at).toLocaleTimeString()})`
      : '';

  return (
    <div className={styles.proxyHealthBadge}>
      <span
        className={styles.proxyHealthDot}
        style={{ backgroundColor: statusColor }}
      />
      <span className={styles.proxyHealthText}>
        {statusText}
        {nextProbe}
      </span>
      {health.last_error && health.status === 'disabled' && (
        <span className={styles.proxyHealthError}>{health.last_error}</span>
      )}
    </div>
  );
}
