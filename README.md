# jawk-certificados

> Backend para site JAWK Certificados Digitais para servir arquivos estáticos e enviar e-mails de contato via SMTP

## Informações gerais

| Item | Detalhe |
|---|---|
| Cliente | JAWK Digital Group _(confirmar)_ |
| Status | Ativo |
| Linguagem / stack | Express |
| IDE | _(preencher)_ |
| Banco de dados | _(nenhum identificado)_ |
| Docker | Sim |
| Repositório | https://github.com/macega/jawk-certificados.git |
| Primeiro commit | 2026-06-02 |
| Último commit | 2026-06-03 |
| Arquivo mais recente | 2026-06-03 |
| Commits | 11 |

## Dependências

- dotenv ^16.4.5
- express ^4.19.2
- nodemailer ^6.9.13

## Como compilar / executar

```bash
npm install
npm run start
```

```bash
docker compose up -d --build
```

## Configuração

- Copiar `.env.example` para `.env` e preencher: `PORT`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `CONTACT_RECEIVER`
- Arquivos sensíveis (`.env`, certificados, chaves) estão no `.gitignore` e **não** vão para o GitHub.

## Estrutura de pastas

```
assets/  imagens e arquivos estáticos
css/     estilos
js/      scripts JavaScript
```

## Observações

Anotações do README anterior:

> Website oficial da JAWK Certificados. Central de soluções em certificação digital, oferecendo segurança, agilidade e validação jurídica para empresas e profissionais. Uma iniciativa JAWK Digital Group.

- _(particularidades, pendências, contatos do cliente)_

## Histórico

| Data | Alteração |
|---|---|
| 2026-06-03 | feat: make header cta buttons open WhatsApp in a new tab |
| 2026-06-03 | feat: integrate checkout form with SMTP backend mailer |
| 2026-06-02 | feat: change header cta buttons to open WhatsApp chat and add cache-busting |
| 2026-06-02 | feat: add favicon matching the J logo icon design |
| 2026-06-02 | feat: add pre-filled text parameter to WhatsApp link and add floating support button |
| 2026-06-02 | chore(docker): change host port mapping to 8078 to avoid conflicts |
| 2026-10-27 | README gerado na organização da pasta Fontes |
