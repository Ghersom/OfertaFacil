# OfertaFácil

PWA responsivo para reunir ofertas e comunidades de supermercados em um único feed.

## Recursos

- Pesquisa instantânea por produto, mercado ou categoria
- Filtros por mercado, categoria, desconto, validade e favoritos
- Ordenação por destaque, preço, desconto ou data
- Favoritos e ofertas cadastradas persistidos no navegador
- Painel para cadastrar e excluir ofertas
- Comunidades com notificações ativáveis
- Resumo de notificações agrupadas
- Instalação como aplicativo e funcionamento offline
- Layout adaptado para celular, tablet e computador

## Publicação

O workflow em `.github/workflows/pages.yml` publica automaticamente a branch `main` no GitHub Pages.

Depois de ativar o GitHub Pages com a origem **GitHub Actions**, o aplicativo fica disponível em:

https://ghersom.github.io/OfertaFacil/

## Observação

Esta primeira versão usa `localStorage`, portanto cadastros e favoritos ficam no aparelho atual. Para uma versão multiusuário, o próximo passo é conectar autenticação e banco de dados.
