import { Fragment, type ReactNode } from "react";
import { CheckCircle2, Lightbulb, Quote } from "lucide-react";

type Stat = { prefix: string; value: string; label: string };

type Block =
  | { type: "greeting"; text: string }
  | { type: "lead"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string }
  | { type: "heading"; id: string; text: string; subtitle?: string }
  | { type: "points"; id: string; heading: string; items: string[] }
  | { type: "callout"; id: string; label: string; text: string }
  | { type: "stats"; items: Stat[] }
  | { type: "list"; ordered: boolean; items: string[] }
  | { type: "signoff"; lines: string[] };

export interface ArticleHeading {
  id: string;
  text: string;
}

const ORDERED_ITEM = /^\d+[.)]\s+/;
const BULLET_ITEM = /^[-•*]\s+/;
const GREETING = /^(dear|hi|hello|good (morning|afternoon|day))\b/i;
const SIGNOFF = /^(kind|warm|best|warmest)\s+regards|^(sincerely|yours (sincerely|faithfully|truly)|regards)\b/i;
const STAT_LINE = /^(approximately|approx\.?|around|about|over|more than|nearly|almost|up to)?\s*(\d[\d,.]*\s?%?)\s+(.+)$/i;
const CONTINUATION_SPLIT = /^([a-z][^.!?]{2,80}?)\s+(?=[A-Z][a-z]+\s+[a-z])/;
const FIGURE = /(\d[\d,.]*\s?%|\b\d{1,3}(?:,\d{3})+\b|\b(?!(?:19|20)\d{2}\b)\d{2,3}\b)/g;
const MAX_QUOTES = 2;

function isAllCapsHeading(text: string): boolean {
  if (text.startsWith("## ")) return true;
  return text.length <= 90 && /[A-Z]/.test(text) && !/[a-z]/.test(text) && !ORDERED_ITEM.test(text);
}

function isTitleHeading(text: string): boolean {
  if (text.includes("\n") || text.length > 70) return false;
  if (/[.!,;]$/.test(text)) return false;
  if (ORDERED_ITEM.test(text) || BULLET_ITEM.test(text)) return false;
  if (!/^[A-Z"“']/.test(text)) return false;
  return text.split(/\s+/).length <= 10;
}

function isHeading(text: string): boolean {
  return isAllCapsHeading(text) || isTitleHeading(text);
}

function toSentenceCase(text: string): string {
  const clean = text.replace(/^##\s+/, "").trim();
  if (/[a-z]/.test(clean)) return clean;
  const lower = clean.toLowerCase();
  return lower.charAt(0).toUpperCase() + lower.slice(1);
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function parseStats(lines: string[]): Stat[] | null {
  const stats: Stat[] = [];
  for (const line of lines) {
    const match = line.match(STAT_LINE);
    if (!match) return null;
    const prefix = match[1] ? (/^approx/i.test(match[1]) ? "Approx." : capitalize(match[1].toLowerCase())) : "";
    stats.push({ prefix, value: match[2].replace(/\s/g, ""), label: match[3].replace(/[.;]$/, "") });
  }
  return stats;
}

/** Splits text on blank lines, then turns single-line runs (pasted from Word) into lists or joined paragraphs. */
function toChunks(content: string): string[] {
  return content
    .replace(/\r\n/g, "\n")
    .split(/\n\s*\n/)
    .map((chunk) =>
      chunk
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .join("\n"),
    )
    .filter(Boolean);
}

export function parseArticle(content: string): Block[] {
  const chunks = toChunks(content);
  const blocks: Block[] = [];
  let quoteCount = 0;
  let index = 0;

  const pushText = (text: string) => {
    const hasLead = blocks.some((block) => block.type === "lead");
    const previous = blocks[blocks.length - 1];
    const sentences = text.split(/(?<=[.!?])\s+/).length;

    if (!hasLead) {
      blocks.push({ type: "lead", text });
    } else if (
      quoteCount < MAX_QUOTES &&
      text.length >= 40 &&
      text.length <= 170 &&
      sentences <= 2 &&
      !text.endsWith(":") &&
      previous?.type !== "quote" &&
      previous?.type !== "heading"
    ) {
      blocks.push({ type: "quote", text });
      quoteCount += 1;
    } else {
      blocks.push({ type: "paragraph", text });
    }
  };

  while (index < chunks.length) {
    const chunk = chunks[index];
    const lines = chunk.split("\n");

    if (blocks.length === 0 && GREETING.test(chunk) && chunk.length <= 60) {
      blocks.push({ type: "greeting", text: chunk.replace(/,$/, "") });
      index += 1;
      continue;
    }

    if (SIGNOFF.test(chunk)) {
      const signoff = [...lines, ...chunks.slice(index + 1).flatMap((rest) => rest.split("\n"))];
      blocks.push({ type: "signoff", lines: signoff });
      break;
    }

    if (lines.length > 1) {
      const stats = parseStats(lines);
      if (stats && stats.length >= 2) {
        blocks.push({ type: "stats", items: stats });
        index += 1;
        continue;
      }

      const looksLikeList = lines.every((line) => line.length <= 200 && !/[.!?]$/.test(line) || ORDERED_ITEM.test(line) || BULLET_ITEM.test(line));
      if (looksLikeList) {
        const ordered = lines.every((line) => ORDERED_ITEM.test(line));
        blocks.push({
          type: "list",
          ordered,
          items: lines.map((line) => line.replace(ordered ? ORDERED_ITEM : BULLET_ITEM, "")),
        });
        index += 1;
        continue;
      }

      chunks[index] = lines.join(" ");
      continue;
    }

    if (isHeading(chunk)) {
      let text = toSentenceCase(chunk);
      let subtitle: string | undefined;
      index += 1;

      // Word pastes often break "Heading:" and its second half into separate paragraphs.
      const next = chunks[index];
      if (text.endsWith(":") && next && /^[a-z]/.test(next)) {
        if (next.length <= 70 && !/[.!?]$/.test(next) && !next.includes("\n")) {
          subtitle = capitalize(next);
          index += 1;
        } else {
          const split = next.match(CONTINUATION_SPLIT);
          if (split) {
            subtitle = capitalize(split[1]);
            chunks[index] = next.slice(split[0].length);
          }
        }
        if (subtitle) text = text.replace(/:$/, "");
      }

      const id = slugify(text);
      const body = chunks[index];

      if (!subtitle && text.endsWith("?") && body && !isHeading(body) && !body.includes("\n")) {
        blocks.push({ type: "callout", id, label: text, text: body });
        index += 1;
        continue;
      }

      if (!subtitle && text.endsWith(":") && isAllCapsHeading(chunk)) {
        const items: string[] = [];
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

      blocks.push({ type: "heading", id, text: text.replace(/:$/, ""), subtitle });
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

    pushText(chunk);
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

function withFigures(text: string): ReactNode {
  const parts = text.split(FIGURE);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="font-semibold text-[#1E3F72]">
        {part}
      </strong>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  );
}

export function ArticleBody({ blocks }: { blocks: Block[] }) {
  return (
    <div className="flex flex-col gap-7 text-base leading-relaxed text-foreground/85 md:text-lg md:leading-8">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "greeting":
            return (
              <p key={i} className="flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-[#2D6091]">
                <span aria-hidden="true" className="h-px w-8 bg-[#2D6091]" />
                {block.text}
              </p>
            );

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
                {withFigures(block.text)}
              </p>
            );

          case "quote":
            return (
              <figure key={i} className="relative my-2 flex flex-col gap-3 border-y border-[#1E3F72]/15 py-8 md:px-6">
                <Quote aria-hidden="true" className="h-8 w-8 fill-[#2D6091]/15 text-[#2D6091]" />
                <blockquote className="text-pretty text-2xl font-bold leading-snug text-[#1E3F72] md:text-3xl md:leading-snug">
                  {block.text}
                </blockquote>
              </figure>
            );

          case "heading":
            return (
              <h2 key={i} id={block.id} className="mt-4 flex scroll-mt-28 flex-col gap-1">
                <span className="text-balance text-2xl font-bold text-[#1E3F72] md:text-3xl">{block.text}</span>
                {block.subtitle && (
                  <span className="text-balance text-lg font-medium text-[#2D6091] md:text-xl">{block.subtitle}</span>
                )}
              </h2>
            );

          case "stats":
            return (
              <ul key={i} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {block.items.map((stat, statIndex) => (
                  <li
                    key={statIndex}
                    className={`flex flex-col gap-2 rounded-2xl p-6 ${
                      statIndex === 0 ? "bg-[#1E3F72] text-primary-foreground" : "bg-[#1E3F72]/[0.06] text-foreground"
                    }`}
                  >
                    {stat.prefix && (
                      <span
                        className={`text-xs font-bold uppercase tracking-widest ${
                          statIndex === 0 ? "text-primary-foreground/70" : "text-[#2D6091]"
                        }`}
                      >
                        {stat.prefix}
                      </span>
                    )}
                    <span
                      className={`text-4xl font-extrabold tracking-tight md:text-5xl ${
                        statIndex === 0 ? "text-primary-foreground" : "text-[#1E3F72]"
                      }`}
                    >
                      {stat.value}
                    </span>
                    <span
                      className={`text-pretty text-sm leading-relaxed ${
                        statIndex === 0 ? "text-primary-foreground/85" : "text-foreground/75"
                      }`}
                    >
                      {stat.label}
                    </span>
                  </li>
                ))}
              </ul>
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
                  <li key={itemIndex} className="flex items-start gap-4 rounded-xl bg-background p-5">
                    <CheckCircle2 aria-hidden="true" className="mt-1 h-5 w-5 shrink-0 text-[#2D6091]" />
                    <span className="text-pretty">{withFigures(item)}</span>
                  </li>
                ))}
              </ol>
            ) : (
              <ul key={i} className="flex flex-col gap-3">
                {block.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3">
                    <CheckCircle2 aria-hidden="true" className="mt-1.5 h-5 w-5 shrink-0 text-[#2D6091]" />
                    <span className="text-pretty">{withFigures(item)}</span>
                  </li>
                ))}
              </ul>
            );

          case "signoff":
            return (
              <footer key={i} className="mt-4 flex flex-col gap-1 border-t border-border pt-6">
                {block.lines.map((line, lineIndex) => (
                  <p
                    key={lineIndex}
                    className={lineIndex === 0 ? "text-foreground/70" : "font-semibold text-[#1E3F72]"}
                  >
                    {line}
                  </p>
                ))}
              </footer>
            );
        }
      })}
    </div>
  );
}
