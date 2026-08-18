# Checklist de publicação — Rota Lucro

## Identificação técnica

- Pacote: `app.rotalucro.motorista`
- Version code: `12`
- Version name: `1.5.0`
- Min SDK: `23`
- Target SDK: `36` (Android 16)
- Formato de publicação: Android App Bundle (`.aab`)
- Assinatura: usar a chave de upload fornecida separadamente e ativar Google Play App Signing.

## Permissões declaradas

- `android.permission.INTERNET`
- `android.permission.ACCESS_NETWORK_STATE`

A versão principal não declara localização, contatos, SMS, câmera, microfone ou Serviço de Acessibilidade.

## Página da loja

- Nome: Rota Lucro
- Categoria sugerida: Auto e veículos
- Público-alvo sugerido: 18 anos ou mais
- Anúncios: Não
- Compras no app na primeira versão: Não
- Política de privacidade: `https://raw.githubusercontent.com/lzn777/money/main/PRIVACY_POLICY.md`

## Segurança dos dados — preenchimento sugerido

Revise estas respostas no Play Console antes de enviar. Elas foram preparadas com base na versão Android atual, que não possui login, SDK de anúncios ou SDK de analytics.

### Dados financeiros e de atividade inseridos pelo usuário

- Corridas, receitas, despesas, custos, metas, km e jornada: armazenados localmente no aparelho.
- Não enviados para banco de dados próprio pelo app Android atual.
- Não compartilhados com anunciantes.

### Dados técnicos de conexão

O conteúdo do aplicativo é carregado por HTTPS de uma hospedagem web. Como qualquer serviço web, a infraestrutura pode processar dados técnicos necessários à conexão, como IP, data/hora, user-agent e cabeçalhos de rede. Antes de concluir a seção "Segurança dos dados", confira as configurações de logs/analytics do provedor de hospedagem e declare qualquer retenção adicional que estiver ativa.

### Conta e exclusão

- O app não oferece criação de conta na versão atual.
- Não há cadastro de usuário em servidor para excluir.
- O usuário pode remover dados locais limpando os dados do app ou desinstalando-o.

## Conteúdo do app

- Público infantil: Não.
- Conteúdo de violência, sexo, jogos de azar ou substâncias: Não.
- App de notícias: Não.
- App governamental: Não.
- App de saúde: Não.
- Funcionalidade financeira regulada: Não; o app faz controle de custos e ganhos pessoais e não oferece crédito, investimento, carteira, banco ou pagamento.

## Ordem recomendada no Play Console

1. Criar o app com idioma padrão Português (Brasil).
2. Informar o nome `Rota Lucro`.
3. Aceitar o Google Play App Signing.
4. Criar uma versão em **Teste interno**.
5. Fazer upload do AAB assinado.
6. Preencher Detalhes do app usando `PLAY_CONSOLE_LISTING_PT-BR.txt`.
7. Adicionar ícone 512x512, gráfico de recursos 1024x500 e screenshots.
8. Informar a Política de Privacidade.
9. Preencher Segurança dos dados.
10. Preencher Classificação de conteúdo e Público-alvo.
11. Testar instalação pela própria Play Store.
12. Depois do teste interno, seguir para teste fechado/produção conforme as exigências exibidas na sua conta do Play Console.

## Observação importante sobre a chave

A chave de upload não deve ser colocada no GitHub nem enviada a terceiros. Guarde o arquivo `.jks` e a senha em local seguro. Para futuras atualizações do Rota Lucro, use a mesma chave de upload registrada no Play Console.
