
Buffer.alloc(10000, 0)
// método seguro porque inicializa todas as partes da memória,
// garantindo que o conteúdo seja previsível e não inclua dados residuais de memória anterior

Buffer.allocUnsafe(10000)
// Método não seguro pois é comum pegar dados que já existem no sistema.
// Um hacker pode enviar dados para esse buffer e extraí-los também.
// Então se for usar isso um dia, armazene coisas já pré-definidas, não inputs do user.

Buffer.from()
Buffer.concat()
// Esses dois métodos usam o unsafe internamente para otimizar a alocação de memória,
// mas são seguros porque sempre inicializam os dados corretamente a partir das entradas fornecidas ou buffers existentes.