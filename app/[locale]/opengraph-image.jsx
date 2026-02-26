import { ImageResponse } from 'next/og';

export const alt = 'Veritas Investigations';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';
export const dynamic = 'force-dynamic';

const text = {
  he: { name: 'וריטס חקירות', subtitle: 'בהנהלת עו״ד אלון פרדו' },
  en: { name: 'Veritas Investigations', subtitle: 'Managed by Attorney Alon Pardo' },
};

export default async function OgImage({ params }) {
  const { locale } = await params;
  const t = text[locale] || text.he;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#1a1a1a',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '20px',
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 700,
              color: '#d5d9e2',
              letterSpacing: '-0.02em',
            }}
          >
            {t.name}
          </div>
          <div
            style={{
              width: 48,
              height: 1,
              backgroundColor: '#d5d9e2',
            }}
          />
          <div
            style={{
              fontSize: 28,
              fontWeight: 200,
              color: '#9499a8',
              letterSpacing: '0.02em',
            }}
          >
            {t.subtitle}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
