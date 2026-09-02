'use client';

import Script from 'next/script';
import { useEffect, useRef } from 'react';

export interface TallyFormEmbedProps {
  formId: string;
  title: string;
  description: string;
  badgeText?: string;
  badgeColor?: 'yellow' | 'pink' | 'blue' | 'green' | 'orange';
  titleColor?: 'black' | 'white';
}

type TallyWidgetEventName =
  | 'Tally.FormLoaded'
  | 'Tally.FormPageView'
  | 'Tally.FormSubmitted';

const TALLY_WIDGET_EVENTS: TallyWidgetEventName[] = [
  'Tally.FormLoaded',
  'Tally.FormPageView',
  'Tally.FormSubmitted',
];

export function TallyFormEmbed({
  formId,
  title,
  description,
  badgeText = 'Application',
  badgeColor = 'yellow',
  titleColor = 'black'
}: TallyFormEmbedProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.source !== iframeRef.current?.contentWindow || typeof event.data !== 'string') {
        return;
      }

      const eventName = TALLY_WIDGET_EVENTS.find((candidate) => event.data.includes(candidate));
      if (!eventName) return;

      try {
        const parsed = JSON.parse(event.data) as { payload?: unknown };
        const detail = {
          event: eventName,
          formId,
          payload: parsed.payload,
        };

        // Same-origin consumers can listen for one normalized app-level event without
        // depending on Tally's postMessage transport directly.
        window.dispatchEvent(new CustomEvent('moonshine:tally-event', { detail }));

        // If a GTM-style dataLayer already exists, forward the same lifecycle event.
        // This is analytics/event forwarding only. Persistence and lifecycle changes
        // continue through authenticated webhook/intake routes.
        const browserWindow = window as Window & {
          dataLayer?: Array<Record<string, unknown>>;
        };

        browserWindow.dataLayer?.push({
          event: eventName,
          tally_form_id: formId,
          tally_payload: parsed.payload,
        });
      } catch {
        // Ignore malformed/unrelated postMessage payloads from the embedded frame.
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [formId]);

  const badgeColors = {
    yellow: 'bg-neo-yellow',
    pink: 'bg-neo-pink',
    blue: 'bg-neo-blue',
    green: 'bg-neo-green',
    orange: 'bg-neo-orange',
  };

  const titleColors = {
    black: 'text-neo-black',
    white: 'text-neo-white',
  };

  const embedUrl = `https://tally.so/embed/${formId}?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1&formEventsForwarding=1`;

  return (
    <section className="w-full">
      <div className="bg-neo-cream border-4 border-neo-black p-8 md:p-12 shadow-brutal text-neo-black relative">
        <div className={`absolute -top-6 -left-6 ${badgeColors[badgeColor]} border-2 border-neo-black px-4 py-2 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transform -rotate-2`}>
          {badgeText}
        </div>

        <h2 className={`text-3xl font-black uppercase tracking-tighter mb-6 mt-4 ${titleColors[titleColor]}`}>
          {title}
        </h2>
        <p className="font-medium text-lg mb-8 border-l-4 border-neo-pink pl-4">
          {description}
        </p>

        <iframe
          ref={iframeRef}
          src={embedUrl}
          data-tally-src={embedUrl}
          loading="lazy"
          width="100%"
          height="500"
          frameBorder="0"
          marginHeight={0}
          marginWidth={0}
          title={title}>
        </iframe>
        <Script src="https://tally.so/widgets/embed.js" strategy="lazyOnload" />
      </div>
    </section>
  );
}
