const http = require('http');

// Criar o agent da conexão TCP
const agent = new http.Agent({ keepAlive: true });

const request = http.request({
    agent: agent,
    hostname: "localhost",
    port: 8050,
    method: "POST",
    path: "/create-post",
    headers: {
        "Content-Type": "application/json",
        // Definir um content-length é uma boa prática.
        "Content-Length": Buffer.byteLength(
            JSON.stringify({ message: "Hi there!" }),
            "utf-8"
        )
    }
});
// request é uma Duplex Stream. 
// Então se lermos desse objeto, estaremos lendo a resposta que o servidor enviar
// E se escrevermos nesse objeto, enviará dados para o servidor como um body.

// Esse evento é emitido apenas uma vez e a resposta vem como uma stream.
request.on('response', (chunk) => {
    console.log(`Response received from the server:`);
    console.log(chunk.toString());
})

/* -------------- Enviando dados sem definir o content-length --------------*/

// Enviar body como string para o servidor
/*request.write(JSON.stringify({ message: "Hi there!" }));
request.write(JSON.stringify({ message: "How are you?" }));
request.write(JSON.stringify({ message: "Are you still there?" }));
*/

// É necessário informar que a requisição terminou. Assim, o servidor consegue descobrir o quão grande é o dado que queremos enviar
// Se especificar o content-length nos headers, não é necessário definir o request.end()
/* request.end(); */
// request.end(JSON.stringify({ message: "This is my last message." })); // É possível enviar um último body.

/* --------------------------------------------------------------------------*/



/* -------------- Enviando dados utilizando o content-length --------------*/
request.write(JSON.stringify({ message: "Hi there!" }));
/* --------------------------------------------------------------------------*/




// Você pode reutilizar o 'agent' e criar uma nova requisição, utilizando a mesma conexão TCP, acelerando a velocidade da aplicação.