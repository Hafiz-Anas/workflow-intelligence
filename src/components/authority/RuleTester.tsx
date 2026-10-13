"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight, CheckCircle2, FlaskConical, Loader2 } from "lucide-react";
import { SectionCard } from "@/components/shared/SectionCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRequests } from "@/lib/hooks/useRequests";
import { useRuleTest, useTiers } from "@/lib/hooks/useTiers";
import { ruleTestInputSchema } from "@/lib/schemas";
import { cn } from "@/lib/utils";

export function RuleTester({ onOpenClause }: { onOpenClause: (policyId: string, clause: string) => void }) {
  const tiers = useTiers();
  const requests = useRequests();
  const ruleTest = useRuleTest();

  const [amount, setAmount] = useState("2450000");
  const [category, setCategory] = useState("Contract extension");
  const [department, setDepartment] = useState("Information Technology");
  const [amountError, setAmountError] = useState<string | null>(null);

  const categories = useMemo(
    () => [...new Set((tiers.data ?? []).flatMap((t) => t.categoriesApprovable))].filter((c) => c !== "All categories").sort(),
    [tiers.data],
  );
  const departments = useMemo(() => [...new Set((requests.data ?? []).map((r) => r.originDepartment))].sort(), [requests.data]);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const parsed = ruleTestInputSchema.safeParse({
      amount: amount.trim() === "" ? Number.NaN : Number(amount),
      category,
      department,
    });
    if (!parsed.success) {
      const issue = parsed.error.issues.find((i) => i.path[0] === "amount");
      setAmountError(issue ? "Enter a valid amount of zero or more." : null);
      return;
    }
    setAmountError(null);
    ruleTest.mutate(parsed.data);
  };

  const result = ruleTest.data;
  const loadingOptions = tiers.isLoading || requests.isLoading;

  return (
    <SectionCard
      title="Rule Tester"
      description="Check which tier should handle a request, using your organization's tier limits."
    >
      <form onSubmit={onSubmit} className="space-y-3" noValidate>
        <div className="space-y-1">
          <Label htmlFor="rule-amount">Amount</Label>
          <Input
            id="rule-amount"
            type="number"
            inputMode="decimal"
            min={0}
            step="any"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            aria-invalid={amountError !== null}
            aria-describedby={amountError ? "rule-amount-error" : undefined}
            className={cn("font-mono tabular", amountError && "border-danger")}
          />
          {amountError && (
            <p id="rule-amount-error" className="text-xs text-danger">
              {amountError}
            </p>
          )}
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="rule-category">Category</Label>
            <Select value={category} onValueChange={setCategory} disabled={loadingOptions}>
              <SelectTrigger id="rule-category">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c} value={c}>
                    {c}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1">
            <Label htmlFor="rule-department">Department</Label>
            <Select value={department} onValueChange={setDepartment} disabled={loadingOptions}>
              <SelectTrigger id="rule-department">
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d} value={d}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <Button type="submit" disabled={ruleTest.isPending || loadingOptions}>
          {ruleTest.isPending ? <Loader2 className="animate-spin" /> : <FlaskConical />}
          Test
        </Button>
      </form>

      {ruleTest.error && (
        <p role="alert" className="mt-3 text-sm text-danger">
          {ruleTest.error instanceof Error ? ruleTest.error.message : "The rule test failed."}
        </p>
      )}

      {result && !ruleTest.isPending && (
        <div role="status" className="mt-4 space-y-3 rounded-md border border-accent/30 bg-accent/5 p-3">
          <div className="flex items-start gap-2">
            {result.escalatedForCategory ? (
              <ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-warning-fg" aria-hidden />
            ) : (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-fg" aria-hidden />
            )}
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Should be handled by</p>
              <p className="text-base font-semibold">
                {result.tierName} · {result.role}
              </p>
            </div>
          </div>
          <p className="text-xs">
            <span className="text-muted-foreground">Deciding clause: </span>
            <button
              type="button"
              onClick={() => onOpenClause(result.policySourceId, result.clause.match(/§[\d.()a-z]+/)?.[0] ?? "")}
              className="font-mono text-accent underline decoration-dotted underline-offset-2 hover:decoration-solid"
            >
              {result.clause}
            </button>
          </p>
          <p className="text-sm">{result.explanation}</p>
          <ol className="list-decimal space-y-1 ps-5 text-xs text-muted-foreground">
            {result.steps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </div>
      )}
    </SectionCard>
  );
}
