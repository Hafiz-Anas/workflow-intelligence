"use client";

import { useEffect, useId, useState } from "react";
import { ArrowUpRight, Check, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { useSubmitDecision } from "@/lib/hooks/useRequest";
import type { Decision } from "@/lib/schemas";
import { cn } from "@/lib/utils";

const MIN_LENGTH = 15;

const copy: Record<
  Decision,
  { title: string; verb: string; description: string; variant: "success" | "destructive" | "default"; icon: typeof Check; toast: string }
> = {
  approve: {
    title: "Approve request",
    verb: "Confirm approval",
    description: "Your comment is recorded on the timeline with your approval.",
    variant: "success",
    icon: Check,
    toast: "Request approved",
  },
  decline: {
    title: "Decline request",
    verb: "Confirm decline",
    description: "Explain why the request is declined so the department can respond.",
    variant: "destructive",
    icon: X,
    toast: "Request declined",
  },
  escalate: {
    title: "Escalate request",
    verb: "Confirm escalation",
    description: "Explain what needs higher authority or further review.",
    variant: "default",
    icon: ArrowUpRight,
    toast: "Request escalated",
  },
};

interface SignoffDialogProps {
  requestId: string;
  decision: Decision | null;
  onOpenChange: (open: boolean) => void;
}

export function SignoffDialog({ requestId, decision, onOpenChange }: SignoffDialogProps) {
  const [comment, setComment] = useState("");
  const submit = useSubmitDecision();
  const fieldId = useId();

  useEffect(() => {
    if (decision) setComment("");
  }, [decision]);

  if (!decision) return <Dialog open={false} onOpenChange={onOpenChange} />;

  const c = copy[decision];
  const length = comment.trim().length;
  const valid = length >= MIN_LENGTH;
  const Icon = c.icon;

  const confirm = () => {
    if (!valid) return;
    submit.mutate(
      { requestId, decision, comment },
      {
        onSuccess: () => {
          toast({ variant: decision === "decline" ? "warning" : "success", title: c.toast, description: "Decision added to the timeline." });
          onOpenChange(false);
        },
        onError: (error) => toast({ variant: "destructive", title: "Could not record decision", description: error.message }),
      },
    );
  };

  return (
    <Dialog open onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{c.title}</DialogTitle>
          <DialogDescription>{c.description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-1.5">
          <Label htmlFor={fieldId}>Comment (required)</Label>
          <Textarea
            id={fieldId}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write the reason for this decision…"
            aria-describedby={`${fieldId}-hint`}
            aria-invalid={length > 0 && !valid}
            autoFocus
          />
          <p id={`${fieldId}-hint`} className={cn("text-xs", valid ? "text-success-fg" : "text-muted-foreground")}>
            {valid ? "Comment meets the minimum length." : `At least ${MIN_LENGTH} characters required (${length}/${MIN_LENGTH}).`}
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button variant={c.variant} onClick={confirm} disabled={!valid || submit.isPending}>
            {submit.isPending ? <Loader2 className="animate-spin" /> : <Icon />}
            {c.verb}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
