export default function Footer({ data }) {
  return (
    <footer style={{ padding: '28px 0', textAlign: 'center', fontSize: '0.75rem', color: 'var(--ink-soft)' }}>
      <div className="container">
        © {new Date().getFullYear()} {data.configuracoes.nomeMarca}. Todos os direitos reservados.
      </div>
    </footer>
  );
}
