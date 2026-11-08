// @ts-nocheck
export const colors = { orange: '#f58200', teal: '#007f73', ink: '#173e39', cream: '#fffaf1' };
export const card = { background: '#fff', padding: 22, borderRadius: 12, border: '1px solid #eadfcf', marginBottom: 16 };
export const field = { padding: 12, borderRadius: 8, border: '1px solid #d8c9b9', width: '100%', boxSizing: 'border-box', margin: '7px 0 14px' };
export const button = { background: colors.orange, color: 'white', border: 0, padding: '12px 17px', borderRadius: 8, cursor: 'pointer', fontWeight: 600 };
// The shared SiteHeader/SiteFooter are already rendered by ConditionalSiteChrome.
// Keep only the content container here, avoiding a second navigation bar
// (and its public Admin shortcut) on planner, custom-tour and assistant pages.
export function Shell({ children, title, lang = 'en' }) {
  return (
    <section dir={lang === 'he' ? 'rtl' : 'ltr'} style={{ background: colors.cream, minHeight: '70vh', fontFamily: 'Arial,sans-serif', color: colors.ink }}>
      <div style={{ maxWidth: 1020, margin: '0 auto', padding: '35px 18px' }}>
        <h1>{title}</h1>
        {children}
      </div>
    </section>
  );
}
