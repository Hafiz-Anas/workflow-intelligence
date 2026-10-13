"use client";

import { useEffect, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileUp, Loader2 } from "lucide-react";
import { DetailDrawer, DrawerFacts, DrawerSection } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { formatDate, formatNumber } from "@/lib/format";
import { useLastDefined } from "@/lib/hooks/useLastDefined";
import { useReplacePolicy } from "@/lib/hooks/usePolicies";
import type { PolicyDocument } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface ReplacePolicyDrawerProps {
  policy: PolicyDocument | null;
  onOpenChange: (open: boolean) => void;
}

const sizeKb = (file: File) => Math.max(1, Math.round(file.size / 1024));

/** Replace a policy file: pick a file, watch a mock upload, then the policy version is bumped. */
export function ReplacePolicyDrawer({ policy, onOpenChange }: ReplacePolicyDrawerProps) {
  const shown = useLastDefined(policy);
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState<number | null>(null);
  const timer = useRef<number | undefined>(undefined);
  const replace = useReplacePolicy();

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    open: browse,
  } = useDropzone({
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
    },
    maxFiles: 1,
    multiple: false,
    noClick: true,
    onDrop: (accepted) => {
      setFile(accepted[0] ?? null);
      setProgress(null);
    },
  });

  useEffect(() => () => window.clearInterval(timer.current), []);

  // Reset whenever a different policy is opened.
  useEffect(() => {
    window.clearInterval(timer.current);
    setFile(null);
    setProgress(null);
    replace.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy?.id]);

  const uploading = progress !== null;

  const start = () => {
    if (!shown || !file || uploading) return;
    setProgress(0);
    const started = Date.now();
    timer.current = window.setInterval(() => {
      const pct = Math.min(100, ((Date.now() - started) / 1600) * 100);
      setProgress(pct);
      if (pct < 100) return;
      window.clearInterval(timer.current);
      replace.mutate(
        { id: shown.id, fileName: file.name, sizeKb: sizeKb(file) },
        {
          onSuccess: (updated) => {
            toast({
              variant: "success",
              title: "Policy replaced",
              description: `${updated.name} is now version ${updated.version}. Authority rules will be re-read from the new file.`,
            });
            onOpenChange(false);
          },
          onError: (error) => {
            setProgress(null);
            toast({ variant: "destructive", title: "Could not replace policy", description: error.message });
          },
        },
      );
    }, 80);
  };

  return (
    <DetailDrawer
      open={policy !== null}
      onOpenChange={(open) => {
        if (!open) window.clearInterval(timer.current);
        onOpenChange(open);
      }}
      eyebrow="Replace policy document"
      title={shown?.name ?? "Replace policy"}
      subtitle={shown ? `Currently version ${shown.version}. Demo only: the file is not stored.` : undefined}
      isEmpty={!shown}
      emptyTitle="No policy selected"
      footer={
        <>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={replace.isPending}>
            Cancel
          </Button>
          <Button onClick={start} disabled={!file || uploading}>
            {uploading && <Loader2 className="animate-spin" />}
            {uploading ? "Uploading…" : "Replace policy"}
          </Button>
        </>
      }
    >
      {shown && (
        <>
          <DrawerFacts
            items={[
              { label: "Current file", value: <span className="font-mono text-xs">{shown.fileName}</span> },
              { label: "Last updated", value: <span className="font-mono text-xs tabular">{formatDate(shown.uploadedAt)}</span> },
              { label: "Status", value: <StatusBadge status={shown.status} /> },
            ]}
          />

          <DrawerSection title="New file">
            <div
              {...getRootProps()}
              className={cn(
                "flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed p-6 text-center transition-colors",
                isDragActive && "border-accent bg-accent/5",
              )}
            >
              <input {...getInputProps()} aria-label="Choose replacement policy file" />
              <FileUp className="h-6 w-6 text-muted-foreground" aria-hidden />
              <p className="text-sm text-muted-foreground">
                {isDragActive ? "Drop the file here" : "Drag a PDF or DOCX file here"}
              </p>
              <Button type="button" variant="outline" size="sm" onClick={browse} disabled={uploading}>
                Browse files
              </Button>
            </div>
            {fileRejections.length > 0 && <p className="mt-2 text-xs text-danger">Only PDF and DOCX files are accepted.</p>}

            {file && (
              <div className="mt-3 rounded-md border p-3">
                <div className="flex items-baseline justify-between gap-3 text-sm">
                  <span className="truncate font-mono text-xs">{file.name}</span>
                  <span className="shrink-0 font-mono text-xs text-muted-foreground tabular">
                    {formatNumber(sizeKb(file))} KB
                  </span>
                </div>
                <Progress value={progress ?? 0} className="mt-2" aria-label="Upload progress" />
                <p className="mt-1 text-xs text-muted-foreground" aria-live="polite">
                  {progress === null ? "Ready to upload" : progress < 100 ? `Uploading ${Math.round(progress)}%` : "Processing…"}
                </p>
              </div>
            )}
          </DrawerSection>
        </>
      )}
    </DetailDrawer>
  );
}
