import { type MDXComponents } from "mdx/types"
import React from "react"
import { MdContentCopy } from "react-icons/md"

export function useMDXComponents(components: MDXComponents) {
  return {
    h1: ({ children }: { children: React.ReactNode }) => (
      <h1 className="mt-5">{children}</h1>
    ),
    h2: ({ children }: { children: React.ReactNode }) => (
      <h2 className="mt-3">{children}</h2>
    ),
    h3: ({ children }: { children: React.ReactNode }) => (
      <h3 className="mt-3">{children}</h3>
    ),
    pre: ({ children }: { children: React.ReactNode }) => (
      <pre className="group/copy relative">
        <div className="absolute right-0 top-0 m-4 size-5 cursor-pointer opacity-0 transition-opacity group-hover/copy:opacity-100">
          <MdContentCopy size={"1.25rem"} />
        </div>
        {children}
      </pre>
    ),
    blockquote: ({ children }: { children: React.ReactNode }) => (
      <blockquote className="self-center rounded-md border-l-2 border-l-neutral-400 bg-neutral-800 p-3">
        {children}
      </blockquote>
    ),
    table: ({ children }: { children: React.ReactNode }) => (
      <table className="mx-auto">{children}</table>
    ),
    th: ({ children }: { children: React.ReactNode }) => (
      <th className="border p-3">{children}</th>
    ),
    td: ({ children }: { children: React.ReactNode }) => (
      <td className="border p-3">{children}</td>
    ),
    ol: ({ children }: { children: React.ReactNode }) => (
      <ol className="flex list-decimal flex-col gap-2 *:ml-4">
        {children}
      </ol>
    ),
    ul: ({ children }: { children: React.ReactNode }) => (
      <ul className="flex list-disc flex-col gap-2 *:ml-4">{children}</ul>
    ),
    a: ({ children, href }: { children: React.ReactNode; href: string }) => (
      <a
        href={href}
        className="underline decoration-neutral-500 transition-colors hover:decoration-neutral-400"
      >
        {children}
      </a>
    ),
    ...components,
  }
}
