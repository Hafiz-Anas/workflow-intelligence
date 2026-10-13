"use client";

import { useEffect, useId, useState } from "react";
import { CheckCircle2, Loader2, PlugZap, XCircle } from "lucide-react";
import { DetailDrawer, DrawerFacts, DrawerSection } from "@/components/shared/DetailDrawer";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/components/ui/use-toast";
import type { ConnectionTestResult } from "@/lib/api/connectors";
import { formatNumber, formatRelative } from "@/lib/format";
import { useConfigureConnector, useTestConnection } from "@/lib/hooks/useConnectors";
import { useLastDefined } from "@/lib/hooks/useLastDefined";
import { connectorConfigSchema, connectorGroupLabels, type Connector, type ConnectorConfig } from "@/lib/schemas";
import { cn } from "@/lib/utils";

interface ConfigureConnectorDrawerProps {
  connector: Connector | null;
  onOpenChange: (open: boolean) => void;
}

const initial: ConnectorConfig = { endpoint: "", authMethod: "oauth", syncFrequency: "1h" };

/** Mock connector setup. No credentials are sent and no external system is contacted. */
export function ConfigureConnectorDrawer({ connector, onOpenChange }: ConfigureConnectorDrawerProps) {
  const shown = useLastDefined(connector);
  const configure = useConfigureConnector();
  const test = useTestConnection();
  const [name, setName] = useState("");
  const [config, setConfig] = useState<ConnectorConfig>(initial);
  const [errors, setErrors] = useState<Partial<Record<keyof ConnectorConfig, string>>>({});
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const formId = useId();

  // Reset the form whenever a different connector is opened.
  useEffect(() => {
    if (!connector) return;
    setName(connector.name);
    setConfig(initial);
    setErrors({});
    setTestResult(null);
    test.reset();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connector?.id]);

  const validate = () => {
    const parsed = connectorConfigSchema.safeParse(config);
    if (parsed.success) {
      setErrors({});
      return parsed.data;
    }
    const fieldErrors: Partial<Record<keyof ConnectorConfig, string>> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof ConnectorConfig;
      fieldErrors[key] = key === "endpoint" ? "Enter the endpoint or URL for this source." : issue.message;
    }
    setErrors(fieldErrors);
    return null;
  };

  const runTest = () => {
    if (!shown || !validate()) return;
    setTestResult(null);
    test.mutate(
      { id: shown.id, endpoint: config.endpoint },
      {
        onSuccess: (result) => {
          setTestResult(result);
          toast(
            result.ok
              ? {
                  variant: "success",
                  title: "Connection test passed",
                  description: `${shown.name} responded in ${result.latencyMs} ms.`,
                }
              : { variant: "destructive", title: "Connection test failed", description: result.message },
          );
        },
        onError: () => toast({ variant: "destructive", title: "Connection test failed", description: "Please try again." }),
      },
    );
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const data = validate();
    if (!shown || !data) return;
    configure.mutate(
      { id: shown.id, config: data },
      {
        onSuccess: (updated) => {
          toast({
            variant: "success",
            title: "Connector online",
            description: `${name || updated.name} is connected and syncing.`,
          });
          onOpenChange(false);
        },
        onError: () =>
          toast({ variant: "destructive", title: "Connection failed", description: "Check the settings and try again." }),
      },
    );
  };

  const isConnect = shown?.status !== "online";

  return (
    <DetailDrawer
      open={connector !== null}
      onOpenChange={onOpenChange}
      eyebrow={shown ? connectorGroupLabels[shown.group] : "Connector"}
      title={shown ? `${isConnect ? "Connect" : "Configure"} ${shown.name}` : "Connector"}
      subtitle="Sample configuration. No credentials are sent and no external system is contacted."
      isEmpty={!shown}
      emptyTitle="No connector selected"
      footer={
        <>
          <Button type="button" variant="outline" onClick={runTest} disabled={test.isPending || configure.isPending}>
            {test.isPending ? <Loader2 className="animate-spin" /> : <PlugZap />}
            Test connection
          </Button>
          <Button type="submit" form={formId} disabled={configure.isPending}>
            {configure.isPending && <Loader2 className="animate-spin" aria-hidden />}
            {configure.isPending ? "Connecting…" : isConnect ? "Connect" : "Save"}
          </Button>
        </>
      }
    >
      {shown && (
        <>
          <DrawerFacts
            items={[
              { label: "Status", value: <StatusBadge status={shown.status} /> },
              {
                label: "Last sync",
                value: (
                  <span className="font-mono text-xs">
                    {shown.lastSyncAt ? formatRelative(shown.lastSyncAt) : "Never synced"}
                  </span>
                ),
              },
              {
                label: "Records indexed",
                value: <span className="font-mono tabular">{formatNumber(shown.recordsIndexed)}</span>,
              },
            ]}
          />

          <DrawerSection title="Configuration">
            <form id={formId} onSubmit={submit} className="grid gap-4" noValidate>
              <div className="grid gap-1.5">
                <Label htmlFor={`${formId}-name`}>Connection name</Label>
                <Input id={`${formId}-name`} value={name} onChange={(e) => setName(e.target.value)} />
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor={`${formId}-endpoint`}>Endpoint or URL</Label>
                <Input
                  id={`${formId}-endpoint`}
                  value={config.endpoint}
                  onChange={(e) => {
                    setConfig((c) => ({ ...c, endpoint: e.target.value }));
                    setTestResult(null);
                  }}
                  placeholder="https://source.example.internal"
                  aria-invalid={Boolean(errors.endpoint)}
                  aria-describedby={errors.endpoint ? `${formId}-endpoint-error` : undefined}
                  className="font-mono"
                />
                {errors.endpoint && (
                  <p id={`${formId}-endpoint-error`} className="text-xs text-danger">
                    {errors.endpoint}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="grid gap-1.5">
                  <Label htmlFor={`${formId}-auth`}>Authentication</Label>
                  <Select
                    value={config.authMethod}
                    onValueChange={(v) => setConfig((c) => ({ ...c, authMethod: v as ConnectorConfig["authMethod"] }))}
                  >
                    <SelectTrigger id={`${formId}-auth`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="oauth">OAuth</SelectItem>
                      <SelectItem value="service_account">Service account</SelectItem>
                      <SelectItem value="api_key">API key</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-1.5">
                  <Label htmlFor={`${formId}-sync`}>Sync frequency</Label>
                  <Select
                    value={config.syncFrequency}
                    onValueChange={(v) => setConfig((c) => ({ ...c, syncFrequency: v as ConnectorConfig["syncFrequency"] }))}
                  >
                    <SelectTrigger id={`${formId}-sync`}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15m">Every 15 min</SelectItem>
                      <SelectItem value="1h">Every 1 h</SelectItem>
                      <SelectItem value="6h">Every 6 h</SelectItem>
                      <SelectItem value="24h">Every 24 h</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid gap-1.5">
                <Label htmlFor={`${formId}-secret`}>Credentials</Label>
                <Input
                  id={`${formId}-secret`}
                  type="password"
                  autoComplete="off"
                  placeholder="Stored in your secrets vault (not used in this demo)"
                  aria-describedby={`${formId}-secret-hint`}
                />
                <p id={`${formId}-secret-hint`} className="text-xs text-muted-foreground">
                  Placeholder only. Nothing typed here leaves the browser.
                </p>
              </div>
            </form>
          </DrawerSection>

          {(test.isPending || testResult) && (
            <DrawerSection title="Connection test">
              <div
                role="status"
                className={cn(
                  "flex items-start gap-2 rounded-md border p-3 text-sm",
                  test.isPending && "border-border",
                  testResult?.ok && "border-success/30 bg-success/5",
                  testResult && !testResult.ok && "border-danger/30 bg-danger/5",
                )}
              >
                {test.isPending ? (
                  <Loader2 className="mt-0.5 h-4 w-4 shrink-0 animate-spin text-muted-foreground" aria-hidden />
                ) : testResult?.ok ? (
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success-fg" aria-hidden />
                ) : (
                  <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden />
                )}
                <p>
                  {test.isPending
                    ? "Testing connection…"
                    : testResult?.ok
                      ? `${testResult.message} Response time ${testResult.latencyMs} ms.`
                      : testResult?.message}
                </p>
              </div>
            </DrawerSection>
          )}
        </>
      )}
    </DetailDrawer>
  );
}
