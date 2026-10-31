// Guarda-corpo do padrão do projeto (ver CLAUDE.md): falha se voltar HTML em string, DOM mexido
// à mão ou cor/tamanho solto no lugar dos tokens do styles.css. A mensagem diz arquivo e linha.
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

const SRC = join(import.meta.dirname, '..', 'src');
const files = (readdirSync(SRC, { recursive: true }) as string[])
  .filter((f) => /\.tsx?$/.test(f) && !/\.test\.tsx?$/.test(f))
  .map((f) => f.replaceAll('\\', '/'));

// todas as linhas (de todos os arquivos que passam no filtro) que batem com `re`
function hits(re: RegExp, only: (f: string) => boolean = () => true) {
  const out: string[] = [];
  for (const f of files.filter(only)) {
    readFileSync(join(SRC, f), 'utf8')
      .split('\n')
      .forEach((line, i) => {
        if (re.test(line)) out.push(`src/${f}:${i + 1}  ${line.trim().slice(0, 90)}`);
      });
  }
  return out;
}
// a tela: o jogo e o sandbox
const app = (f: string) => f.startsWith('app/') || f.startsWith('sandbox/');

void test('nada de HTML em string nem elemento criado à mão: a tela é React', () => {
  assert.deepEqual(
    hits(/innerHTML|outerHTML|insertAdjacentHTML|document\.createElement|\.appendChild\(/),
    [],
  );
});

void test('classList só no Flip (a virada da carta precisa partir do verso, ver Flip.tsx)', () => {
  assert.deepEqual(
    hits(/classList/, (f) => f !== 'app/table/center/Flip.tsx'),
    [],
  );
});

void test('cores só pelos tokens do @theme (styles.css), nunca hex ou rgb soltos', () => {
  assert.deepEqual(hits(/#[0-9a-fA-F]{6}\b|\[#[0-9a-fA-F]{3,8}\]|rgba?\(/, app), []);
});

void test('transparência com /NN (bg-bad/20), não com color-mix(..., transparent)', () => {
  assert.deepEqual(hits(/color-mix\(in_srgb,var\(--color-[\w-]+\)_\d+%,transparent\)/, app), []);
});

void test('tamanho de letra pelos tokens (text-small, text-title...), nunca text-[13px]', () => {
  assert.deepEqual(hits(/text-\[\d+(\.\d+)?px\]/, app), []);
});

void test('sombra e camada (z-index) pelos tokens: shadow-card, z-modal...', () => {
  assert.deepEqual(hits(/shadow-\[[^\]]*rgba|z-\[\d{2,}\]/, app), []);
});
