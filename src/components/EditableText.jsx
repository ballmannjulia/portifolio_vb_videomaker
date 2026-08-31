// Componente genérico: no modo de edição vira um input/textarea que herda
// a tipografia do elemento que está substituindo. Fora do modo de edição,
// renderiza apenas o texto (Tag configurável: h1, h2, p, span...).
export default function EditableText({
  editMode,
  tag: Tag = 'span',
  value,
  onChange,
  multiline = false,
  className = '',
  placeholder = '',
  style,
  as, // permite passar um componente customizado no lugar de Tag
}) {
  if (!editMode) {
    const Element = as || Tag;
    if (!value) return null;
    return (
      <Element className={className} style={style}>
        {value}
      </Element>
    );
  }

  if (multiline) {
    return (
      <textarea
        className={`editable ${className}`}
        style={style}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    );
  }

  return (
    <input
      className={`editable ${className}`}
      style={style}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
