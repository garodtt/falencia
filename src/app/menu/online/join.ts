import { joinTable } from '../../../net/online.ts';
import { resetTips } from '../../store.ts';

// toda entrada numa mesa começa com as dicas zeradas, como uma partida nova
export function joinWithTips(code: string) {
  resetTips();
  void joinTable(code);
}
