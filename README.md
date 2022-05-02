<h1 align="center">UOL chat api</h1>

<p align="center">
<img width="145px" src="./images/logo.png"/>
</p>

### Descrição 📎

Uma copia do funcionamento do backend do famoso bate papo uol, um chat em tempo real entre usuários. Nesse projeto temos uma api de dados que se utiliza do banco de dados Mongo para armazenar os dados e Express.js para servir os dados em forma de JSON.

### Funcionalidades 🚀

-   configurar dotenv

    -   [x] Criar arquivo dotenv
    -   [x] valores: PORT e URL
    -   [x] Criação de um servidor express correndo na porta 5000

-   Retornar mensagens
    -   [x] Requisição GET no caminho `/messages`
    -   [x] Busacar mensagens no banco de dados de acordo com o limite
    -   [x] a rota deve receber um query parameter "limit"
    -   [x] caso limit não seja informado deve ser inferido como 100
    -   [x] Deve-se filtrar as mensagens privadas que não pertecem ao usuário
    -   [x] Deve receber um header "User" com o nome do usuário para que haja a filtragem
-   Adicionar participante ao chat

    -   [x] usar a rota `/participants` com o método post
    -   [x] A requisição deve receber um nome pelo body
    -   [x] deve ser validado caso algum erro seja encontrado(body incompleto)
    -   [x] validação com JOI
    -   [x] Caso haja erro o status de retorno deve ser 422()
    -   [x] Checar se o nome já existe no banco de dados, caso sim retornar 409

-   Receber mensagens
    -   [x] Requisição POST no caminho `/messages`
    -   [x] O nome do usuário que envio será enviado pelo header
    -   [x] Validar body da requisição usando JOI
    -   [x] Ao salvar a mensagem se deve adicionar o atributo time
    -   [x] Retornar status 201
-   Criação de um servidor express correndo na porta 5000

    -   [x] Requisição POST no caminho `/status`
    -   [x] deve receber o User pelo header
    -   [x] caso o User não existe retorne status 404
    -   [x] Caso tudo ok atualize na coleção de participantes time: `Date.now()`
    -   [x] SetInterval que desliga user inativos por 15 segundos

-   Deletar usuário offline

    -   [x] Fazer set Interval para excluir usuário
    -   [x] Deletar usuário a cada 15 segundos
    -   [x] Usar como parâmetro para excluir devemos usar o tempo de último login do usuário, caso seja maior que 10 segundos o user deve ser excluido
    -   [x] Uma mensagem deve ser inserida na coleção de mensagens para sinalizar a deleção

-   Sanitizar os dados recebidos
    -   [x] remover possíveis códigos html da messagem e do username
    -   [x] tirar espaços em brancos do inicio e do fim

### Ferramentas 🛠️

<br>

<p align='center'>
<img src="https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E">
<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white">
<img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express">
<img src="https://img.shields.io/badge/Git-E34F26?style=for-the-badge&logo=git&logoColor=white">
<img src="https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white">
<p>

### Entre em contato 📞

<br>

<p align="center">
<a href="https://www.linkedin.com/in/luis-felipe-vanin-martins-5a5b38215">
<img src="https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=blue">
</a>
<a href="mailto:luisfvanin2@gmail.com">
<img src="https://img.shields.io/badge/Gmail:%20luisfvanin2@gmail.com-D14836?style=for-the-badge&logo=gmail&logoColor=white">
</a>
</p>
