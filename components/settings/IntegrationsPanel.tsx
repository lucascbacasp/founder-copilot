'use client';

import { useState, useEffect } from 'react';

interface Integration {
  id: string;
  provider: string;
  metadata: Record<string, unknown>;
  created_at: string;
}

const PROVIDERS = [
  {
    id: 'google',
    name: 'Google',
    description: 'Drive + Gmail — exporta artefactos a Google Docs y envialos por email',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
      </svg>
    ),
  },
  {
    id: 'notion',
    name: 'Notion',
    description: 'Exporta artefactos como paginas en tu workspace de Notion',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path d="M4.459 4.208c.746.606 1.026.56 2.428.466l13.215-.793c.28 0 .047-.28-.046-.326L18.28 2.18c-.42-.326-.98-.7-2.055-.607L3.01 2.726c-.467.047-.56.28-.374.466l1.823 1.016zm.793 3.172v13.85c0 .747.373 1.027 1.214.98l14.523-.84c.841-.047.934-.56.934-1.166V6.354c0-.606-.233-.933-.747-.886l-15.177.886c-.56.047-.747.327-.747.886v.14zm14.337.42c.093.42 0 .84-.42.886l-.7.14v10.264c-.607.327-1.166.514-1.633.514-.747 0-.934-.234-1.494-.933l-4.577-7.186v6.953l1.447.327s0 .84-1.166.84l-3.22.187c-.093-.187 0-.653.327-.747l.84-.22V9.854L7.822 9.62c-.093-.42.14-1.026.793-1.073l3.454-.233 4.764 7.279v-6.44l-1.213-.14c-.094-.514.28-.886.747-.933l3.22-.187z"/>
      </svg>
    ),
  },
];

export function IntegrationsPanel() {
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [loading, setLoading] = useState(true);
  const [connecting, setConnecting] = useState<string | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, []);

  // Reload on return from OAuth redirect
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') || params.get('error')) {
      loadIntegrations();
      // Clean URL
      window.history.replaceState(null, '', '/settings');
    }
  }, []);

  async function loadIntegrations() {
    try {
      const res = await fetch('/api/integrations');
      const data = await res.json();
      setIntegrations(data.integrations || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleConnect(provider: string) {
    setConnecting(provider);
    try {
      const res = await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'connect', provider }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      setConnecting(null);
    }
  }

  async function handleDisconnect(provider: string) {
    try {
      await fetch('/api/integrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'disconnect', provider }),
      });
      setIntegrations((prev) => prev.filter((i) => i.provider !== provider));
    } catch {
      // ignore
    }
  }

  function isConnected(provider: string) {
    return integrations.some((i) => i.provider === provider);
  }

  function getIntegration(provider: string) {
    return integrations.find((i) => i.provider === provider);
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-zinc-800 p-5">
        <p className="text-sm text-zinc-500">Cargando integraciones...</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {PROVIDERS.map((provider) => {
        const connected = isConnected(provider.id);
        const integration = getIntegration(provider.id);
        const isConnecting = connecting === provider.id;

        return (
          <div
            key={provider.id}
            className="rounded-xl border border-zinc-800 p-4 flex items-center gap-4"
          >
            <div className="flex-shrink-0 text-white">{provider.icon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">{provider.name}</p>
                {connected && (
                  <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded-full bg-green-500/20 text-green-400">
                    Conectado
                  </span>
                )}
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{provider.description}</p>
              {connected && integration?.metadata && (
                <p className="text-xs text-zinc-600 mt-1">
                  {provider.id === 'notion' && (integration.metadata as { workspace_name?: string }).workspace_name
                    ? `Workspace: ${(integration.metadata as { workspace_name?: string }).workspace_name}`
                    : `Conectado el ${new Date(integration.created_at).toLocaleDateString('es-AR')}`}
                </p>
              )}
            </div>
            <div>
              {connected ? (
                <button
                  onClick={() => handleDisconnect(provider.id)}
                  className="text-xs px-3 py-1.5 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  Desconectar
                </button>
              ) : (
                <button
                  onClick={() => handleConnect(provider.id)}
                  disabled={isConnecting}
                  className="text-xs px-3 py-1.5 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 disabled:opacity-50 transition-colors"
                >
                  {isConnecting ? 'Conectando...' : 'Conectar'}
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
