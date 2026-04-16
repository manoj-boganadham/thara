import { useMemo, useState } from 'react';

const SECRET_ANSWER = 'saichand';
const TARGET_TOTAL = 150000;

const BILL_ITEMS = [
  { label: 'Friends Tax (Annual)', amount: 12500 },
  { label: 'Late Reply Penalty', amount: 3800 },
  { label: 'Unlimited Advice Service', amount: 5200 },
  { label: 'Mood Swing Handling Charges', amount: 12200 },
  { label: 'Listening to Random Stories (Unlimited Plan)', amount: 14800 },
  { label: 'Typing... Waiting Compensation', amount: 9100 },
  { label: '"I\'m fine" Investigation Cost', amount: 17600 },
  { label: 'Overthinking Resolution Charges', amount: 13200 },
];

const formatCurrency = (value) => {
  return `Rs. ${value.toLocaleString('en-IN')}`;
};

const normalizeAnswer = (value) => value.toLowerCase().replace(/\s+/g, '');

function BillPage() {
  const [answer, setAnswer] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const totals = useMemo(() => {
    const subtotal = BILL_ITEMS.reduce((sum, item) => sum + item.amount, 0);
    const friendshipHandlingFee = Math.round(subtotal * 0.18);
    const gowthamEmotionalDamageFee = 7500;
    const runningTotal = subtotal + friendshipHandlingFee + gowthamEmotionalDamageFee;
    const roundOff = Math.max(0, TARGET_TOTAL - runningTotal);
    const grandTotal = runningTotal + roundOff;

    return { subtotal, friendshipHandlingFee, gowthamEmotionalDamageFee, roundOff, grandTotal };
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    const normalizedInput = normalizeAnswer(answer);

    if (normalizedInput === SECRET_ANSWER) {
      setErrorMessage('');
      setIsUnlocked(true);
      return;
    }

    setIsUnlocked(false);
    setErrorMessage('Wrong answer. Try again.');
  };

  return (
    <main className="bill-theme">
      <section className="bill-wrap">
        {!isUnlocked ? (
          <article className="bill-gate card-surface">
            <h1 className="bill-gate-title">Friendship Bill Counter</h1>
            <p className="bill-gate-question">
              Who is the most good person in your gang
            </p>

            <form className="bill-gate-form" onSubmit={handleSubmit}>
              <label className="bill-label" htmlFor="bill-secret-answer">
                Your Answer
              </label>
              <input
                id="bill-secret-answer"
                className="bill-input"
                type="text"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                placeholder="Type the legend's name"
                autoComplete="off"
              />
              <button type="submit" className="primary-btn bill-submit-btn">
                Unlock Bill
              </button>
            </form>

            {errorMessage && <p className="bill-error">{errorMessage}</p>}
          </article>
        ) : (
          <article className="bill-receipt card-surface">
            <header className="bill-header">
              <p className="bill-brand">Friendship Bill Counter</p>
              <h1 className="bill-title">Friendship Recovery Bill</h1>
              <p className="bill-meta">Counter No: 07 | Token: RF-2026</p>
            </header>

            <div className="bill-line-items">
              {BILL_ITEMS.map((item) => (
                <div className="bill-row" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{formatCurrency(item.amount)}</strong>
                </div>
              ))}
            </div>

            <div className="bill-summary">
              <div className="bill-row">
                <span>Subtotal</span>
                <strong>{formatCurrency(totals.subtotal)}</strong>
              </div>
              <div className="bill-row">
                <span>Friendship Handling Fee (18%)</span>
                <strong>{formatCurrency(totals.friendshipHandlingFee)}</strong>
              </div>
              <div className="bill-row">
                <span>Gowtham Emotional Damage Fee</span>
                <strong>{formatCurrency(totals.gowthamEmotionalDamageFee)}</strong>
              </div>
              <div className="bill-row">
                <span>Round Off (to Rs. 1,50,000)</span>
                <strong>{formatCurrency(totals.roundOff)}</strong>
              </div>
            </div>

            <footer className="bill-total">
              <span>Grand Total Payable</span>
              <strong>{formatCurrency(totals.grandTotal)}</strong>
            </footer>

            <p className="bill-legal-note">
              As per Section Marriage Act 2026: “All dues will be collected over a lifetime.”
            </p>
          </article>
        )}
      </section>
    </main>
  );
}

export default BillPage;
