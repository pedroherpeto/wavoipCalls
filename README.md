# Sistema de Calls - Docker Setup

Este projeto contém um sistema completo com frontend React, backend Node.js e banco PostgreSQL, configurado para rodar com Docker Compose.

## Pré-requisitos

- Docker
- Docker Compose

## Como executar

### 1. Subir todos os serviços
```bash
docker-compose up -d
```

### 2. Verificar se os serviços estão rodando
```bash
docker-compose ps
```

### 3. Ver logs dos serviços
```bash
# Todos os serviços
docker-compose logs

# Serviço específico
docker-compose logs backend
docker-compose logs frontend
docker-compose logs postgres
```

### 4. Parar os serviços
```bash
docker-compose down
```

### 5. Parar e remover volumes (dados do banco)
```bash
docker-compose down -v
```

## Acessos

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:3100
- **PostgreSQL**: localhost:5432
  - Database: `postgres`
  - Username: `postgres`
  - Password: `password`

## Estrutura dos Containers

- **postgres**: Banco de dados PostgreSQL (porta 5432)
- **backend**: API Node.js/Express com TypeScript (porta 3100)
- **frontend**: Aplicação React (porta 3001)

## Variáveis de Ambiente Configuradas

### Backend
- **Credenciais**: TOKEN, JWT_SECRET, JWT_REFRESH_SECRET
- **Banco**: POSTGRES_HOST, POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
- **CORS**: FRONTEND_URL, BACKEND_URL, PROXY_PORT
- **Porta**: 3100

### Frontend
- **API URL**: http://localhost:3100
- **Porta**: 3001

### PostgreSQL
- **Database**: postgres
- **Porta**: 5432
- **Credenciais**: postgres/password

## Desenvolvimento

Os volumes estão configurados para hot-reload, então as alterações no código são refletidas automaticamente.

### Rebuild dos containers
```bash
docker-compose build
docker-compose up -d
```

## Licença

Este projeto está licenciado sob a **GNU Affero General Public License v3.0 (AGPL v3)**.

### Principais características da licença:

- **Código Aberto**: O software é livre e de código aberto
- **Obrigação de Expor Código Fonte**: Qualquer pessoa que use ou implemente este software deve disponibilizar o código fonte completo
- **Permite Comercialização**: Você pode usar, modificar e distribuir o software comercialmente
- **Proteção de Marcas e Copyright**: As marcas registradas e direitos autorais originais são mantidos
- **Sem Garantias**: O software é fornecido "como está", sem garantias de qualquer tipo

### Requisitos para uso:

1. **Distribuição**: Se você distribuir o software, deve incluir o código fonte completo
2. **Modificações**: Qualquer modificação deve ser licenciada sob a mesma licença AGPL v3
3. **Uso em Rede**: Se o software for usado em um servidor acessível publicamente, o código fonte deve estar disponível para os usuários
4. **Atribuição**: Deve manter os avisos de copyright e licença originais

Para mais detalhes, consulte o arquivo [LICENSE](LICENSE) ou visite [https://www.gnu.org/licenses/agpl-3.0.html](https://www.gnu.org/licenses/agpl-3.0.html).
