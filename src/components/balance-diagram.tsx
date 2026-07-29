import { Schematic } from "@/components/schematic";
import { StatusTag } from "@/components/ui";
import { balance } from "@/content/balance";

export function BalanceDiagram() {
  return (
    <Schematic
      columns={balance.signalPath}
      footer={
        <>
          <StatusTag>Provisional patent · No. 63/743,085</StatusTag>
          <p className="font-mono text-[12px] text-fg-faint">
            Published · Youth Innovation Journal, Fall 2025
          </p>
        </>
      }
    />
  );
}
