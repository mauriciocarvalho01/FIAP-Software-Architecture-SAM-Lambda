# client-authentication-lbda

Este projeto contém o código-fonte e arquivos de suporte para uma aplicação serverless que você pode implantar usando o SAM CLI. Ele inclui os seguintes arquivos e pastas:

- authentication - Código para a função Lambda da aplicação escrita em TypeScript.
- events - Eventos de invocação que você pode usar para acionar a função.
- authentication/tests - Testes unitários para o código da aplicação.
- template.yaml - Um template que define os recursos da AWS da aplicação.

A aplicação utiliza vários recursos da AWS, incluindo funções Lambda e uma API do API Gateway. Esses recursos estão definidos no arquivo `template.yaml` deste projeto. Você pode atualizar o template para adicionar recursos da AWS através do mesmo processo de implantação que atualiza o código da aplicação.

Se preferir usar um ambiente de desenvolvimento integrado (IDE) para construir e testar sua aplicação, você pode usar o AWS Toolkit.
O AWS Toolkit é um plugin de código aberto para IDEs populares que usa o SAM CLI para construir e implantar aplicações serverless na AWS. O AWS Toolkit também oferece uma experiência simplificada de depuração passo a passo para o código da função Lambda. Consulte os links abaixo para começar:

* [CLion](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [GoLand](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [IntelliJ](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [WebStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [Rider](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [PhpStorm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [PyCharm](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [RubyMine](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [DataGrip](https://docs.aws.amazon.com/toolkit-for-jetbrains/latest/userguide/welcome.html)
* [VS Code](https://docs.aws.amazon.com/toolkit-for-vscode/latest/userguide/welcome.html)
* [Visual Studio](https://docs.aws.amazon.com/toolkit-for-visual-studio/latest/user-guide/welcome.html)

## Implantar a aplicação

O Serverless Application Model Command Line Interface (SAM CLI) é uma extensão do AWS CLI que adiciona funcionalidades para construir e testar aplicações Lambda. Ele usa Docker para executar suas funções em um ambiente Amazon Linux que simula o Lambda. Também pode emular o ambiente de construção e a API da aplicação.

To use the SAM CLI, you need the following tools.

* SAM CLI - [Install the SAM CLI](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* Node.js - [Install Node.js 20](https://nodejs.org/en/), including the NPM package management tool.
* Docker - [Install Docker community edition](https://hub.docker.com/search/?type=edition&offering=community)

Para construir e implantar sua aplicação pela primeira vez, execute os seguintes comandos no terminal:

```bash
sam build
sam deploy --guided
```

O primeiro comando compilará o código-fonte da aplicação. O segundo comando empacotará e implantará sua aplicação na AWS, com uma série de prompts:

* **Stack Name**: O nome da pilha a ser implantada no CloudFormation. Deve ser único para sua conta e região. Uma boa sugestão é usar o nome do projeto.
* **AWS Region**:  A região da AWS onde você deseja implantar sua aplicação.
* **Confirm changes before deploy**: Se definido como "sim", qualquer conjunto de alterações será exibido para revisão manual antes da execução. Se definido como "não", o SAM CLI implantará automaticamente as alterações da aplicação.
* **Allow SAM CLI IAM role creation**: Muitos templates do SAM, incluindo este exemplo, criam roles do AWS IAM necessárias para que as funções AWS Lambda incluídas acessem serviços da AWS. Por padrão, essas permissões são limitadas ao mínimo necessário. Para implantar uma pilha do AWS CloudFormation que cria ou modifica roles do IAM, o valor `CAPABILITY_IAM` para capabilities deve ser fornecido. Se a permissão não for dada por meio deste prompt, você deve passar explicitamente `--capabilities CAPABILITY_IAM` no comando `sam deploy`.
* **Save arguments to samconfig.toml**: Se definido como "sim", suas escolhas serão salvas em um arquivo de configuração dentro do projeto, de forma que no futuro você possa apenas reexecutar `sam deploy` sem parâmetros para implantar mudanças na aplicação.

Você pode encontrar o URL do endpoint da API Gateway nos valores de saída exibidos após a implantação.

## Usar o SAM CLI para construir e testar localmente

Construa sua aplicação com o comando`sam build`.

```bash
client-authentication-lbda$ sam build
```

O SAM CLI instala as dependências definidas no `authentication/package.json`, compila o TypeScript com o esbuild, cria um pacote de implantação e o salva na pasta `.aws-sam/build`.

Teste uma única função invocando-a diretamente com um evento de teste. Um evento é um documento JSON que representa a entrada que a função recebe da origem do evento. Eventos de teste estão incluídos na pasta `events` deste projeto.

Execute as funções localmente e as invoque com o comando `sam local invoke`.

```bash
client-authentication-lbda$ sam local invoke AuthenticationFunction --event events/event.json
```

O SAM CLI também pode emular a API da aplicação. Use `sam local start-api` para executar a API localmente na porta 3000.

```bash
client-authentication-lbda$ sam local start-api
client-authentication-lbda$ curl http://localhost:3000/
```

O SAM CLI lê o template da aplicação para determinar as rotas da API e as funções que elas invocam. A propriedade `Events` na definição de cada função inclui a rota e o método para cada caminho.

```yaml
      Events:
        Authentication:
          Type: Api
          Properties:
            Path: /auth
            Method: get
```

## Adicionar um recurso à sua aplicação
O template da aplicação usa o AWS Serverless Application Model (AWS SAM) para definir os recursos da aplicação. O AWS SAM é uma extensão do AWS CloudFormation com uma sintaxe mais simples para configurar recursos comuns de aplicações serverless, como funções, gatilhos e APIs. Para recursos não incluídos na [the SAM specification](https://github.com/awslabs/serverless-application-model/blob/master/versions/2016-10-31.md), você pode usar os tipos de recursos padrão do [AWS CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-template-resource-type-ref.html).

## Buscar, monitorar e filtrar logs das funções Lambda

Para simplificar a solução de problemas, o SAM CLI tem um comando chamado `sam logs`. O `sam logs` permite buscar logs gerados por sua função Lambda implantada diretamente no terminal. Além de imprimir os logs no terminal, este comando tem várias funcionalidades úteis para ajudar a encontrar rapidamente erros.

`NOTA`: Este comando funciona para todas as funções AWS Lambda, não apenas para as implantadas com o SAM.

```bash
client-authentication-lbda$ sam logs -n AuthenticationFunction --stack-name client-authentication-lbda --tail
```

Você pode encontrar mais informações e exemplos sobre como filtrar logs das funções Lambda na [SAM CLI Documentation](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-logging.html).

## Testes Unitários

Os testes são definidos na pasta `authentication/tests` deste projeto. Use o NPM para instalar o [Jest test framework](https://jestjs.io/) executar os testes unitários.

```bash
client-authentication-lbda$ cd authentication
authentication$ npm install
authentication$ npm run test
```

## Limpeza

Para deletar a aplicação de exemplo que você criou, use o AWS CLI. Supondo que você tenha usado o nome do projeto como nome da stack, execute o seguinte comando:

```bash
sam delete --stack-name client-authentication-lbda
```

## Recursos

Veja o [AWS SAM developer guide](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/what-is-sam.html) para uma introdução à especificação SAM, ao SAM CLI e aos conceitos de aplicações serverless.

Em seguida, você pode usar o AWS Serverless Application Repository para implantar aplicações prontas para uso que vão além dos exemplos básicos e aprender como os autores desenvolveram suas aplicações: [AWS Serverless Application Repository main page](https://aws.amazon.com/serverless/serverlessrepo/)
