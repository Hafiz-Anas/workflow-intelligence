"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { AlertCircle, CheckCircle2, FileUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";
import { formatNumber } from "@/lib/format";
import { useUploadPolicy } from "@/lib/hooks/usePolicies";
import { cn } from "@/lib/utils";

interface UploadItem {
  key: string;
  name: string;
  sizeKb: number;
  progress: number;
  state: "uploading" | "processing" | "done" | "error";
}

const ACCEPT = {
  "application/pdf": [".pdf"],
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
};

export function PolicyDropzone() {
  const upload = useUploadPolicy();
  const [items, setItems] = useState<UploadItem[]>([]);
  const [rejected, setRejected] = useState<string[]>([]);
  const timers = useRef(new Set<number>());

  useEffect(() => {
    const active = timers.current;
    return () => {
      active.forEach((t) => window.clearInterval(t));
      active.clear();
    };
  }, []);

  const update = (key: string, patch: Partial<UploadItem>) =>
    setItems((list) => list.map((item) => (item.key === key ? { ...item, ...patch } : item)));

  const startUpload = useCallback(
    (file: File) => {
      const key = `${file.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const sizeKb = Math.max(1, Math.round(file.size / 1024));
      setItems((list) => [{ key, name: file.name, sizeKb, progress: 0, state: "uploading" }, ...list]);

      const durationMs = 1500 + Math.random() * 1000;
      const startedAt = Date.now();
      const timer = window.setInterval(() => {
        const progress = Math.min(100, ((Date.now() - startedAt) / durationMs) * 100);
        update(key, { progress });
        if (progress >= 100) {
          window.clearInterval(timer);
          timers.current.delete(timer);
          update(key, { state: "processing" });
          upload
            .mutateAsync({ fileName: file.name, sizeKb })
            .then((policy) => {
              update(key, { state: "done" });
              toast({
                variant: "success",
                title: "Policy uploaded",
                description: `${policy.name} was added to the library and is queued for review.`,
              });
            })
            .catch(() => {
              update(key, { state: "error" });
              toast({ variant: "destructive", title: "Upload failed", description: `${file.name} could not be added.` });
            });
        }
      }, 100);
      timers.current.add(timer);
    },
    [upload],
  );

  const onDrop = useCallback(
    (accepted: File[], rejections: FileRejection[]) => {
      setRejected(rejections.map((r) => r.file.name));
      accepted.forEach(startUpload);
    },
    [startUpload],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: ACCEPT,
    multiple: true,
    noClick: true,
    noKeyboard: true,
  });

  return (
    <div className="space-y-3">
      <div
        {...getRootProps()}
        className={cn(
          "flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-6 text-center transition-colors",
          isDragActive ? "border-accent bg-accent/5" : "border-border bg-muted/30",
        )}
      >
        <input {...getInputProps()} aria-label="Upload policy documents" />
        <FileUp className={cn("h-6 w-6", isDragActive ? "text-accent" : "text-muted-foreground")} aria-hidden />
        <p className="text-sm font-medium">{isDragActive ? "Drop files to upload" : "Drag policy documents here"}</p>
        <p className="text-xs text-muted-foreground">PDF or DOCX. Policies, procedures, approval and escalation rules.</p>
        <Button type="button" size="sm" variant="outline" onClick={open}>
          Browse files
        </Button>
      </div>

      {rejected.length > 0 && (
        <p role="alert" className="flex items-start gap-1.5 text-xs text-danger">
          <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>
            Not uploaded (only PDF and DOCX are accepted): <span className="font-mono">{rejected.join(", ")}</span>
          </span>
        </p>
      )}

      {items.length > 0 && (
        <ul className="space-y-2" aria-label="Uploads">
          {items.map((item) => (
            <li key={item.key} className="rounded-md border p-2.5">
              <div className="flex items-center gap-2 text-xs">
                {item.state === "done" ? (
                  <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success-fg" aria-hidden />
                ) : item.state === "error" ? (
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 text-danger" aria-hidden />
                ) : (
                  <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-accent" aria-hidden />
                )}
                <span className="min-w-0 flex-1 truncate font-mono">{item.name}</span>
                <span className="shrink-0 font-mono text-muted-foreground tabular">{formatNumber(item.sizeKb)} KB</span>
              </div>
              <Progress
                className="mt-2"
                value={item.progress}
                aria-label={`Upload progress for ${item.name}`}
                indicatorClassName={item.state === "done" ? "bg-success" : item.state === "error" ? "bg-danger" : "bg-accent"}
              />
              <p className="mt-1 text-[11px] text-muted-foreground">
                {item.state === "uploading" && `Uploading… ${Math.round(item.progress)}%`}
                {item.state === "processing" && "Adding to library…"}
                {item.state === "done" && "Uploaded. Added to the repository manifest."}
                {item.state === "error" && "Upload failed."}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
