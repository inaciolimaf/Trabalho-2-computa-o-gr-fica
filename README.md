# Jogo Cesta de Bolinhas

Um jogo interativo em 3D desenvolvido com Three.js e Cannon.js onde o objetivo é coletar bolinhas que caem do topo da cena usando uma cesta controlada pelo mouse.

## Visão Geral

O **Cesta de Bolinhas** é um jogo de reflexos e coordenação onde o jogador controla uma cesta azul com o mouse para capturar bolinhas coloridas que caem constantemente do céu. As bolinhas são geradas por um sistema de partículas com física realista, incluindo gravidade, colisões e diferentes materiais.

O jogo foi desenvolvido como parte de um trabalho acadêmico de Computação Gráfica, implementando conceitos de:
- Renderização 3D com Three.js.
- Simulação física com Cannon.js.
- Sistema de partículas.
- Detecção de colisões.
- Interface de usuário interativa.
- Controle por mouse.
- Áudio procedural.

## Funcionalidades

### Funcionalidades Principais
- **Controle por Mouse**: Mova a cesta horizontalmente seguindo o cursor do mouse.
- **Sistema de Partículas**: Bolinhas são geradas automaticamente no topo da tela.
- **Física Realista**: Implementação de gravidade, colisões e diferentes materiais físicos.
- **Sistema de Pontuação**: Cada bolinha coletada aumenta a pontuação do jogador.
- **Cronômetro**: Jogo com duração de 60 segundos para torná-lo mais competitivo.

### Funcionalidades Avançadas
- **Bolinhas Coloridas**: Cada bolinha possui uma cor aleatória gerada dinamicamente.
- **Bolinhas com textura**: Cada bolinha possui uma textura aleatória gerada dinamicamente.
- **Painel de Controle de dificuldade (dat.GUI)**: Interface para ajustar a gravidade durante o jogo.
- **Áudio Procedural**: Som de "ping" gerado quando bolinhas são coletadas.
- **Iluminação Dinâmica**: Sistema de iluminação ambiente e direcional com sombras.
- **Design Responsivo**: Interface adaptável a diferentes tamanhos de tela.

### Detalhes Técnicos
- **Materiais Físicos Diferenciados**: 
  - Bolas-Cesta: Fricção 0.1, Restituição 0.4.
  - Bolas-Chão: Fricção 0.5, Restituição 0.7.
- **Otimização de Performance**: Remoção automática de bolinhas coletadas.
- **Controles Intuitivos**: Movimento suave da cesta seguindo o mouse.
- **Física de Colisão**: Detecção precisa de colisões com área trigger invisível.

## Como Executar

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge).
- Conexão com a internet (para carregar as bibliotecas CDN).

### Instruções de Execução

1. **Clone ou baixe o repositório**:
   ```bash
   git clone https://github.com/inaciolimaf/Trabalho-2-computa-o-gr-fica.git
   cd Trabalho-2-computa-o-gr-fica-main
   ```

2. **Abra o arquivo `index.html`** em um navegador web:
   - Clique duas vezes no arquivo `index.html`, ou arraste o arquivo para uma janela do navegador.
   

3. **Como Jogar**:
   - Mova o mouse para controlar a cesta azul.
   - Colete as bolinhas coloridas que caem do céu.
   - Sua pontuação aparece no canto superior esquerdo.
   - Use o painel de controle para ajustar a gravidade.
   - O jogo dura 60 segundos.

### Controles
- **Mouse**: Movimento horizontal da cesta.
- **Painel GUI**: Ajuste da gravidade (valores entre -20 e 0).

## Tecnologias Utilizadas

- **Three.js (r128)**: Biblioteca JavaScript para renderização 3D.
- **Cannon.js (v0.6.2)**: Engine de física 3D.
- **dat.GUI (v0.7.9)**: Interface gráfica para controles.
- **HTML5 Canvas**: Renderização gráfica.
- **Web Audio API**: Geração de áudio procedural.
- **JavaScript ES6+**: Lógica do jogo e interações.


## Referências

- [Three.js Documentation](https://threejs.org/docs/)
- [Cannon.js Physics Engine](https://github.com/schteppe/cannon.js/)
- [dat.GUI Controller Library](https://github.com/dataarts/dat.gui)
- [Web Audio API Documentation](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [WebGL Fundamentals](https://webglfundamentals.org/)

## Equipe

- **FRANCISCO SILVAN FELIPE DO CARMO** — 496641  
- **FRANK WILLIAM ARAUJO SOUZA** — 473269  
- **INACIO LIMA DE SOUZA FILHO** — 509153  
- **JOAO ARTUR SALES ROCHA** — 511375  
- **MATHEUS FARES TRAJANO** — 512210  

> Projeto desenvolvido sob orientação do Prof. **Iális Cavalcante** na disciplina de Computação Gráfica – Engenharia de Computação – UFC Sobral.

---


