"use client";

import { useState } from "react";
import { Button, Input } from "@stoker/ui";
import { enqueueFieldCommand, drainOutbox } from "@stoker/field-sync";
import { ArrowRightLeft, CheckCircle2, History } from "lucide-react";

export default function FieldCashPage() {
  const [transferAmount, setTransferAmount] = useState<string>("50.00");
  const [recipient, setRecipient] = useState<string>("Ali Asghar (Operator)");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const amountMinor = BigInt(Math.round(parseFloat(transferAmount) * 100));

      await enqueueFieldCommand({
        name: "cash.transfer",
        payload: {
          fromFloatId: "30000000-0000-0000-0000-000000000001",
          toFloatId: "30000000-0000-0000-0000-000000000002",
          amountMinor: amountMinor.toString(),
          currency: "PKR",
        },
      });

      await drainOutbox().catch(() => {});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Balance Card */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
        <div className="text-xs text-[var(--ink-3)] font-medium">Your Custody Float</div>
        <div className="text-3xl font-extrabold mt-1 text-[var(--ink)] font-[family-name:var(--font-display)]">
          Rs. 127,500
        </div>
        <div className="flex items-center justify-between text-xs text-[var(--ink-2)] mt-2 pt-2 border-t border-[var(--line)]">
          <span>Issued: Rs. 150,000</span>
          <span>Spent: Rs. 22,500</span>
          <span>Pending: Rs. 0</span>
        </div>
      </div>

      {submitted && (
        <div className="p-3 bg-[var(--ok-sunk)] border border-[var(--ok-line)] text-[var(--ok)] rounded-[var(--radius-control)] flex items-center gap-2 text-xs font-medium">
          <CheckCircle2 className="w-4 h-4" />
          <span>Handover transfer logged & queued to outbox!</span>
        </div>
      )}

      {/* Transfer Cash to Worker Form */}
      <form onSubmit={handleTransfer} className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)] space-y-4">
        <div className="flex items-center gap-2">
          <ArrowRightLeft className="w-4 h-4 text-[var(--primary)]" />
          <h2 className="text-sm font-semibold text-[var(--ink)]">Hand Over Cash to Worker</h2>
        </div>

        <div>
          <label className="block text-xs font-medium text-[var(--ink-2)] mb-1">Recipient Worker</label>
          <select
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            className="w-full h-10 px-3 text-sm bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-control)] text-[var(--ink)] focus:outline-none focus:border-[var(--primary)]"
          >
            <option value="Ali Asghar (Operator)">Ali Asghar (Operator #EMP-002)</option>
            <option value="Zubair Khan (Operator)">Zubair Khan (Night Operator #EMP-003)</option>
            <option value="Rasheed Ahmed (Driver)">Rasheed Ahmed (Driver #DRV-001)</option>
          </select>
        </div>

        <Input
          label="Transfer Amount (PKR / Rs.)"
          type="number"
          step="1"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
          required
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full h-11"
          disabled={submitting}
        >
          {submitting ? "Processing..." : "Confirm Cash Handover"}
        </Button>
      </form>

      {/* Recent Activity */}
      <div className="p-4 bg-[var(--surface)] border border-[var(--line)] rounded-[var(--radius-card)]">
        <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-[var(--ink-2)]">
          <History className="w-4 h-4" />
          <span>Recent Transactions</span>
        </div>
        <div className="divide-y divide-[var(--line)] text-xs">
          <div className="py-2 flex items-center justify-between">
            <div>
              <div className="font-medium text-[var(--ink)]">Routine Valve Gasket</div>
              <div className="text-[10px] text-[var(--ink-3)]">Expense #EXP-0991 • Approved</div>
            </div>
            <span className="font-semibold text-[var(--danger)]">-Rs. 22,500</span>
          </div>
          <div className="py-2 flex items-center justify-between">
            <div>
              <div className="font-medium text-[var(--ink)]">Initial Float Issue</div>
              <div className="text-[10px] text-[var(--ink-3)]">Bank Transfer • Ref #FL-01</div>
            </div>
            <span className="font-semibold text-[var(--ok)]">+Rs. 150,000</span>
          </div>
        </div>
      </div>
    </div>
  );
}
