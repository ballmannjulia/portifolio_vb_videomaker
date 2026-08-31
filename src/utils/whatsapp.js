export function buildWhatsappHref(data, customMessage) {
  const { cliente, contato } = data;
  const phone = (contato.whatsapp || '').replace(/\D/g, '');

  let message = customMessage || 'Olá! Vi a proposta e gostaria de conversar sobre a cobertura do meu casamento.';

  if (cliente?.ativa && cliente.noiva && cliente.noivo) {
    message = `Olá! Somos ${cliente.noiva} e ${cliente.noivo}. Vimos nossa proposta e gostaríamos de conversar sobre a cobertura do casamento.`;
  }

  const encoded = encodeURIComponent(message);
  return `https://wa.me/${phone}?text=${encoded}`;
}
