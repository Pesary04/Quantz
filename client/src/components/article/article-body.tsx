import { CheckCircle2, Lightbulb } from "lucide-react";

type Block =
  | { type: "lead"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "heading"; id: string; text: string }
  | { type: "points"; id: string; heading: string; items: string[] }
  | { type: "callout"; id: string; label: string; text: string }
  | { type: "list"; ordered: boolean; items: string[] };

export interface ArticleHeading {
  id: string;
  text: string;
}

const ORDERED_ITEM = /^\d+[.)]\s+/;
const BULLET_ITEM = /^[-•*]\s+/;

function isHeading(text: string): boolean {
  if (text.startsWith("## ")) return true;
  return text.length <= 90 && /[A-Z]/.test(text) && !/[a-z]/.test(text) && !ORDERED_ITEM.test(text);
}

function toSentenceCase(text: string): string {
  const clean = text.replace(/^##\s+/, "").trim();
  if (/[a-z]/.test(clean)) return clean;
  const lower = clean.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function parseArticle(content: string): Block[] {
  const chunks = content
    .split(/\n\s*\n/)
    .map((chunk) => chunk.trim())
    .filter(Boolean);

  const blocks: Block[] = [];
  let index = 0;

  while (index < chunks.length) {
    const chunk = chunks[index];

    if (isHeading(chunk)) {
      const text = toSentenceCase(chunk);
      const id = slugify(text);

      if (chunk.endsWith("?") && chunks[index + 1] && !isHeading(chunks[index + 1])) {
        blocks.push({ type: "callout", id, label: text, text: chunks[index + 1] });
        index += 2;
        continue;
      }

      if (chunk.endsWith(":")) {
        const items: string[] = [];
        index += 1;
        while (
          index < chunks.length &&
          !isHeading(chunks[index]) &&
          !ORDERED_ITEM.test(chunks[index]) &&
          !BULLET_ITEM.test(chunks[index])
        ) {
          items.push(chunks[index]);
          index += 1;
        }
        blocks.push({ type: "points", id, heading: text.replace(/:$/, ""), items });
        continue;
      }

      blocks.push({ type: "heading", id, text });
      index += 1;
      continue;
    }

    const listPattern = ORDERED_ITEM.test(chunk) ? ORDERED_ITEM : BULLET_ITEM.test(chunk) ? BULLET_ITEM : null;
    if (listPattern) {
      const items: string[] = [];
      while (index < chunks.length && listPattern.test(chunks[index])) {
        items.push(chunks[index].replace(listPattern, ""));
        index += 1;
      }
      blocks.push({ type: "list", ordered: listPattern === ORDERED_ITEM, items });
      continue;
    }

    blocks.push({ type: blocks.length === 0 ? "lead" : "paragraph", text: chunk });
    index += 1;
  }

  return blocks;
}

export function getHeadings(blocks: Block[]): ArticleHeading[] {
  return blocks.flatMap((block) => {
    if (block.type === "heading") return [{ id: block.id, text: block.text }];
    if (block.type === "points") return [{ id: block.id, text: block.heading }];
    if (block.type === "callout") return [{ id: block.id, text: block.label }];
    return [];
  });
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-7 text-base leading-relaxed text-foreground/85 md:text-lg md:leading-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "lead":
            return (
              <p
                key={i}
                className="text-pretty text-lg font-medium leading-8 text-foreground first-letter:float-left first-letter:mr-3 first-letter:mt-1 first-letter:text-6xl first-letter:font-extrabold first-letter:leading-none first-letter:text-[#2D6091] md:text-xl md:leading-9"
              >
                {block.text}
              </p>
            );

          case "paragraph":
            return (
              <p key={i} className="text-pretty">
                {block.text}
              </p>
            );

          case "heading":
            return (
              <h2
                key={i}
                id={block.id}
                className="mt-4 scroll-mt-28 text-balance text-2xl font-bold text-[#1E3F72] md:text-3xl"
              >
                {block.text}
              </h2>
            );

          case "points":
            return (
              <section key={i} id={block.id} className="mt-4 flex scroll-mt-28 flex-col gap-5" aria-labelledby={`${block.id}-title`}>
                <h2 id={`${block.id}-title`} className="text-balance text-2xl font-bold text-[#1E3F72] md:text-3xl">
                  {block.heading}
                </h2>
                <ol className="grid gap-4 sm:grid-cols-2">
                  {block.items.map((item, itemIndex) => (
                    <li
                      key={itemIndex}
                      className="flex flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-shadow hover:shadow-md"
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1E3F72] text-sm font-bold text-primary-foreground"
                      >
                        {itemIndex + 1}
                      </span>
                      <p className="text-pretty text-base leading-relaxed text-foreground/85">{item}</p>
                    </li>
                  ))}
                </ol>
              </section>
            );

          case "callout": {
            const isPositive = /good|solution|tip/i.test(block.label);
            return (
              <aside
                key={i}
                id={block.id}
                className={`flex scroll-mt-28 gap-4 rounded-2xl p-6 md:p-8 ${
                  isPositive ? "bg-[#2D6091] text-primary-foreground" : "bg-[#1E3F72]/[0.06] text-foreground"
                }`}
              >
                <Lightbulb
                  aria-hidden="true"
                  className={`mt-1 h-6 w-6 shrink-0 ${isPositive ? "text-primary-foreground" : "text-[#2D6091]"}`}
                />
                <div className="flex flex-col gap-2">
                  <h2
                    className={`text-sm font-bold uppercase tracking-widest ${
                      isPositive ? "text-primary-foreground/80" : "text-[#2D6091]"
                    }`}
                  >
                    {block.label}
                  </h2>
                  <p className="text-pretty text-lg font-medium leading-8 md:text-xl">{block.text}</p>
                </div>
              </aside>
            );
          }

          case "list":
            return block.ordered ? (
              <ol key={i} className="flex flex-col gap-3">
                {block.items.map((item, itemIndex) => (
                  <li
                    key={itemIndex}
                    className="flex items-start gap-4 rounded-xl border-l-0 bg-background p-5"
                  >
                    <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#2D6091]" />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="flex flex-col gap-3">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <CheckCircle2 aria-hidden="true" className="mt-1.5 h-5 w-5 shrink-0 text-[#2D6091]" />
                    <span className="text-pretty">{item}</span>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
