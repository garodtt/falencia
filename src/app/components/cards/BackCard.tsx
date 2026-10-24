// verso de um goblin (cartas que os outros não podem ver)
export function BackCard({ className = '' }: { className?: string }) {
  return (
    <div className={`card back ${className}`}>
      <span className="bk">F</span>
    </div>
  );
}
