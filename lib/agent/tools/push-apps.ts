import { google } from 'googleapis';
import { Client as NotionClient } from '@notionhq/client';
import { createServiceClient } from '@/lib/supabase/server';
import { getAuthenticatedClient } from '@/lib/integrations/google';

export interface PushAppsInput {
  destination: string;
  artifact_id: string;
  format: string;
}

interface ArtifactRow {
  id: string;
  type: string;
  title: string;
  content: Record<string, unknown>;
}

interface IntegrationRow {
  access_token: string;
  refresh_token: string | null;
  metadata: Record<string, unknown>;
}

export async function executePushApps(
  input: PushAppsInput,
  userId: string
): Promise<string> {
  const supabase = createServiceClient();

  // Load artifact
  const { data: artifact, error: artError } = await supabase
    .from('artifacts')
    .select('id, type, title, content')
    .eq('id', input.artifact_id)
    .eq('user_id', userId)
    .single();

  if (artError || !artifact) {
    return `No se encontro el artefacto ${input.artifact_id}. Verifica que exista.`;
  }

  // Map destination to provider
  const providerMap: Record<string, string> = {
    google_drive: 'google',
    gmail: 'google',
    notion: 'notion',
  };
  const provider = providerMap[input.destination];
  if (!provider) return `Destino desconocido: ${input.destination}`;

  // Check if integration is connected
  const { data: integration, error: intError } = await supabase
    .from('user_integrations')
    .select('access_token, refresh_token, metadata')
    .eq('user_id', userId)
    .eq('provider', provider)
    .single();

  if (intError || !integration) {
    return `El fundador no tiene ${input.destination} conectado. Pedile que vaya a Configuracion > Integraciones para conectar ${provider === 'google' ? 'Google' : 'Notion'}.`;
  }

  const typedArtifact = artifact as unknown as ArtifactRow;
  const typedIntegration = integration as unknown as IntegrationRow;

  try {
    switch (input.destination) {
      case 'google_drive':
        return await pushToGoogleDrive(typedArtifact, typedIntegration, supabase);

      case 'gmail':
        return await pushToGmail(typedArtifact, typedIntegration, userId, supabase);

      case 'notion':
        return await pushToNotion(typedArtifact, typedIntegration, supabase);

      default:
        return `Destino no soportado: ${input.destination}`;
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Error desconocido';
    return `Error al enviar a ${input.destination}: ${msg}`;
  }
}

// --- Google Drive ---
async function pushToGoogleDrive(
  artifact: ArtifactRow,
  integration: IntegrationRow,
  supabase: ReturnType<typeof createServiceClient>
): Promise<string> {
  const auth = getAuthenticatedClient(integration.access_token, integration.refresh_token || undefined);
  const drive = google.drive({ version: 'v3', auth });

  const docContent = formatArtifactAsText(artifact);

  const file = await drive.files.create({
    requestBody: {
      name: `${artifact.title} — Copiloto`,
      mimeType: 'application/vnd.google-apps.document',
    },
    media: {
      mimeType: 'text/plain',
      body: docContent,
    },
    fields: 'id,webViewLink',
  });

  const fileUrl = file.data.webViewLink || '';

  // Update artifact with external URL
  await supabase
    .from('artifacts')
    .update({ external_url: fileUrl, external_provider: 'google_drive' })
    .eq('id', artifact.id);

  return `Artefacto "${artifact.title}" exportado a Google Drive exitosamente. Link: ${fileUrl}`;
}

// --- Gmail ---
async function pushToGmail(
  artifact: ArtifactRow,
  integration: IntegrationRow,
  userId: string,
  supabase: ReturnType<typeof createServiceClient>
): Promise<string> {
  // Get user email
  const { data: profile } = await supabase
    .from('founder_profiles')
    .select('full_name')
    .eq('user_id', userId)
    .single();

  const auth = getAuthenticatedClient(integration.access_token, integration.refresh_token || undefined);
  const gmail = google.gmail({ version: 'v1', auth });

  // Get sender email from profile
  const aboutRes = await gmail.users.getProfile({ userId: 'me' });
  const userEmail = aboutRes.data.emailAddress || '';

  const subject = `[Copiloto] ${artifact.title}`;
  const body = formatArtifactAsHtml(artifact);

  const message = [
    `From: ${profile?.full_name || 'Copiloto'} <${userEmail}>`,
    `To: ${userEmail}`,
    `Subject: ${subject}`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=utf-8',
    '',
    body,
  ].join('\r\n');

  const encoded = Buffer.from(message)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  await gmail.users.messages.send({
    userId: 'me',
    requestBody: { raw: encoded },
  });

  return `Artefacto "${artifact.title}" enviado por email a ${userEmail} exitosamente.`;
}

// --- Notion ---
async function pushToNotion(
  artifact: ArtifactRow,
  integration: IntegrationRow,
  supabase: ReturnType<typeof createServiceClient>
): Promise<string> {
  const notion = new NotionClient({ auth: integration.access_token });

  // Search for a page to use as parent (first available page)
  const search = await notion.search({
    filter: { property: 'object', value: 'page' },
    page_size: 1,
  });

  let parentId: string;
  if (search.results.length > 0) {
    parentId = search.results[0].id;
  } else {
    return 'No se encontro ninguna pagina en el workspace de Notion. Crea al menos una pagina primero.';
  }

  const blocks = formatArtifactAsNotionBlocks(artifact);

  const page = await notion.pages.create({
    parent: { page_id: parentId },
    properties: {
      title: {
        title: [{ text: { content: `${artifact.title} — Copiloto` } }],
      },
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    children: blocks as any,
  });

  const pageUrl = (page as unknown as { url: string }).url || '';

  await supabase
    .from('artifacts')
    .update({ external_url: pageUrl, external_provider: 'notion' })
    .eq('id', artifact.id);

  return `Artefacto "${artifact.title}" exportado a Notion exitosamente. Link: ${pageUrl}`;
}

// --- Formatters ---

function formatArtifactAsText(artifact: ArtifactRow): string {
  const lines: string[] = [artifact.title, '='.repeat(artifact.title.length), ''];

  const content = artifact.content;
  for (const [key, value] of Object.entries(content)) {
    if (Array.isArray(value)) {
      lines.push(`${formatKey(key)}:`);
      value.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          lines.push(`  - ${Object.values(item).join(' | ')}`);
        } else {
          lines.push(`  - ${item}`);
        }
      });
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${formatKey(key)}:`);
      for (const [subKey, subVal] of Object.entries(value)) {
        lines.push(`  ${formatKey(subKey)}: ${subVal}`);
      }
    } else {
      lines.push(`${formatKey(key)}: ${value}`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

function formatArtifactAsHtml(artifact: ArtifactRow): string {
  let html = `<h1 style="color:#4F46E5">${artifact.title}</h1>`;
  html += `<p style="color:#666;font-size:12px">Generado por Copiloto para Fundadores</p><hr>`;

  const content = artifact.content;
  for (const [key, value] of Object.entries(content)) {
    html += `<h3>${formatKey(key)}</h3>`;
    if (Array.isArray(value)) {
      html += '<ul>';
      value.forEach((item) => {
        if (typeof item === 'object' && item !== null) {
          html += `<li>${Object.entries(item).map(([k, v]) => `<strong>${formatKey(k)}</strong>: ${v}`).join(' — ')}</li>`;
        } else {
          html += `<li>${item}</li>`;
        }
      });
      html += '</ul>';
    } else if (typeof value === 'object' && value !== null) {
      html += '<table style="border-collapse:collapse;width:100%">';
      for (const [subKey, subVal] of Object.entries(value)) {
        html += `<tr><td style="padding:4px 8px;border:1px solid #ddd;font-weight:bold">${formatKey(subKey)}</td><td style="padding:4px 8px;border:1px solid #ddd">${subVal}</td></tr>`;
      }
      html += '</table>';
    } else {
      html += `<p>${value}</p>`;
    }
  }

  return html;
}

function formatArtifactAsNotionBlocks(artifact: ArtifactRow): Array<Record<string, unknown>> {
  const blocks: Array<Record<string, unknown>> = [
    {
      object: 'block',
      type: 'callout',
      callout: {
        icon: { emoji: '🚀' },
        rich_text: [{ text: { content: `Tipo: ${artifact.type} | Generado por Copiloto para Fundadores` } }],
      },
    },
    { object: 'block', type: 'divider', divider: {} },
  ];

  const content = artifact.content;
  for (const [key, value] of Object.entries(content)) {
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [{ text: { content: formatKey(key) } }],
      },
    });

    if (Array.isArray(value)) {
      value.forEach((item) => {
        const text = typeof item === 'object' && item !== null
          ? Object.entries(item).map(([k, v]) => `${formatKey(k)}: ${v}`).join(' — ')
          : String(item);
        blocks.push({
          object: 'block',
          type: 'bulleted_list_item',
          bulleted_list_item: {
            rich_text: [{ text: { content: text.substring(0, 2000) } }],
          },
        });
      });
    } else if (typeof value === 'object' && value !== null) {
      for (const [subKey, subVal] of Object.entries(value)) {
        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              { text: { content: `${formatKey(subKey)}: ` }, annotations: { bold: true } },
              { text: { content: String(subVal) } },
            ],
          },
        });
      }
    } else {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [{ text: { content: String(value).substring(0, 2000) } }],
        },
      });
    }
  }

  return blocks;
}

function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}
