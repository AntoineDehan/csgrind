import { useState } from "react";
import { ChevronDown } from "lucide-react";
import Dot from "../Dot/Dot";
import Text from "../Text/Text";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../collapsible";

type Tip = {
  id: string;
  content: string;
};

type TipsCollapseProps = {
  category: string;
  tips: Tip[];
};

export default function TipsCollapse({ category, tips }: TipsCollapseProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-lg border border-brand bg-background-secondary/40 p-4">
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex w-full cursor-pointer items-center gap-2">
          <Dot color="brand" glow={!open} />
          <Text
            span
            size="xsmall"
            weight="bold"
            color="secondary"
            className="uppercase tracking-wider"
          >
            TIPS{" "}
            <Text span size="xsmall" weight="bold" color="brand">
              · {category}
            </Text>
          </Text>
          <ChevronDown
            className={`ml-auto size-4 text-text-secondary transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </CollapsibleTrigger>
        <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-300 ease-out data-ending-style:h-0 data-starting-style:h-0">
          <ol className="mt-4 flex flex-col gap-3">
            {tips.map((tip, index) => (
              <li key={tip.id} className="flex gap-3">
                <Text span mono size="small" color="brand">
                  {String(index + 1).padStart(2, "0")}
                </Text>
                <Text size="small">{tip.content}</Text>
              </li>
            ))}
          </ol>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
