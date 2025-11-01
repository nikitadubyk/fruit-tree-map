import {
  Hr,
  Html,
  Head,
  Font,
  Body,
  Text,
  Link,
  Button,
  Preview,
  Section,
  Container,
} from '@react-email/components';

interface MagicLinkEmailProps {
  magicLink: string;
  userEmail: string;
}

export const MagicLinkEmail = ({
  magicLink,
  userEmail,
}: MagicLinkEmailProps) => (
  <Html>
    <Head>
      <Font
        fontWeight={400}
        fontFamily="Inter"
        fontStyle="normal"
        fallbackFontFamily="Arial"
        webFont={{
          format: 'woff2',
          url: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2',
        }}
      />
    </Head>
    <Preview>Войдите в свой аккаунт одним нажатием</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <div style={logoContainer}>
            <div style={logoPlaceholder}>📧</div>
            <Text style={logoText}>Fruit Tree</Text>
          </div>
        </Section>

        <Section style={content}>
          <Text style={heading}>Вход в аккаунт</Text>
          <Text style={paragraph}>
            Здравствуйте! Вы запросили вход в свой аккаунт на {userEmail}.
          </Text>
          <Text style={paragraph}>
            Нажмите на кнопку ниже, чтобы безопасно войти в систему:
          </Text>

          <Section style={buttonContainer}>
            <Button style={button} href={magicLink}>
              Войти в аккаунт
            </Button>
          </Section>

          <Text style={alternativeText}>
            Или скопируйте и вставьте эту ссылку в браузер:
          </Text>
          <Link href={magicLink} style={linkStyle}>
            {magicLink}
          </Link>

          <Hr style={hr} />

          <Text style={footer}>
            🔒 Эта ссылка действительна в течение <strong>15 минут</strong> и
            может быть использована только один раз.
          </Text>
          <Text style={footer}>
            Если вы не запрашивали вход, проигнорируйте это письмо.
          </Text>
        </Section>

        <Section style={footerSection}>
          <Text style={footerText}>
            С уважением,
            <br />
            Команда Fruit Tree
          </Text>
          <Hr style={hr} />
          <Text style={disclaimerText}>
            Это автоматическое сообщение, пожалуйста, не отвечайте на него.
          </Text>
        </Section>
      </Container>
    </Body>
  </Html>
);

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily: '"Inter", "Arial", sans-serif',
};

const container = {
  padding: '0',
  width: '600px',
  maxWidth: '100%',
  borderRadius: '8px',
  margin: '40px auto',
  backgroundColor: '#ffffff',
  border: '1px solid #f0f0f0',
};

const header = {
  padding: '32px 40px',
  backgroundColor: '#4f46e5',
  borderRadius: '8px 8px 0 0',
};

const logoContainer = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const logoPlaceholder = {
  fontSize: '32px',
  marginRight: '12px',
};

const logoText = {
  margin: '0',
  color: '#ffffff',
  fontSize: '24px',
  fontWeight: '600',
};

const content = {
  padding: '40px',
};

const heading = {
  color: '#1f2937',
  fontSize: '28px',
  fontWeight: '600',
  lineHeight: '1.3',
  margin: '0 0 24px 0',
  textAlign: 'center' as const,
};

const paragraph = {
  color: '#6b7280',
  fontSize: '16px',
  lineHeight: '1.6',
  margin: '0 0 16px 0',
};

const buttonContainer = {
  margin: '32px 0',
  textAlign: 'center' as const,
};

const button = {
  border: 'none',
  color: '#ffffff',
  fontSize: '16px',
  fontWeight: '600',
  cursor: 'pointer',
  borderRadius: '6px',
  padding: '14px 32px',
  textDecoration: 'none',
  display: 'inline-block',
  backgroundColor: '#4f46e5',
  textAlign: 'center' as const,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
};

const alternativeText = {
  color: '#9ca3af',
  fontSize: '14px',
  margin: '24px 0 8px 0',
  textAlign: 'center' as const,
};

const linkStyle = {
  color: '#4f46e5',
  fontSize: '14px',
  display: 'block',
  margin: '0 0 24px 0',
  textDecoration: 'underline',
  textAlign: 'center' as const,
  wordBreak: 'break-all' as const,
};

const hr = {
  margin: '24px 0',
  borderColor: '#e5e7eb',
};

const footer = {
  margin: '8px 0',
  color: '#6b7280',
  fontSize: '14px',
  lineHeight: '1.5',
  textAlign: 'center' as const,
};

const footerSection = {
  padding: '0 40px 40px 40px',
};

const footerText = {
  color: '#374151',
  fontSize: '14px',
  lineHeight: '1.5',
  margin: '0 0 16px 0',
  textAlign: 'center' as const,
};

const disclaimerText = {
  margin: '0',
  color: '#9ca3af',
  fontSize: '12px',
  lineHeight: '1.4',
  textAlign: 'center' as const,
};
