---
name: documenter
description: >
  Create complete, well-structured documentation for a project or codebase. Use
  when asked to "document this project", "create documentation", "generate docs",
  "write the docs", "create a docs site", or "build documentation for this repo".
  Produces a full MkDocs-based documentation site with consistent style, logical
  navigation, a glossary, and valid mkdocs.yml configuration that builds cleanly
  in strict mode. Sister skill to /documentation-reviewer — creates documentation
  that meets the same quality standards the reviewer checks for.
---

# Documenter

Creates complete, coherent, and consistently-structured documentation for a project
or codebase. Produces output that conforms to the quality standards enforced by the
`/documentation-reviewer` skill and the formatting rules defined by the
`/markdown-formatter` skill.

## When to Use This Skill

- User asks to "document this project", "create documentation", or "generate docs"
- User asks to "write the docs" or "build a docs site" for a codebase
- User asks to "create a documentation site" or "set up MkDocs for this project"
- User wants comprehensive documentation created from scratch for an existing codebase
- User wants to add documentation to a project that currently has none
- User wants to add or extend documentation in a project that already has docs
- User asks to "document this module", "add docs for X", or "fill in the missing docs"

## Prerequisites

Before writing any documentation:

1. **Read the `/markdown-formatter` skill** and its
   `references/markdown-formatting-guidelines.md`. These formatting rules are the
   source of truth for all generated markdown. Every page must conform to them.
2. **Explore the target codebase thoroughly.** Read source files, headers, tests,
   configuration files, READMEs, and any existing documentation. You cannot document
   what you do not understand.
3. **Identify the public API surface.** Determine which types, functions, classes,
   namespaces, modules, or endpoints a user of this project would interact with.
4. **Understand the project's architecture.** How is it structured? What are the
   major subsystems or modules? How do they relate to each other?

## Clarifying Questions

Before starting work, ask the user about any of the following that are unclear:

- **Audience**: Who will read this documentation? Developers consuming the library?
  Operators running the system? Both?
- **Scope**: The entire project, or specific modules/subsystems?
- **Structure**: Would the Diataxis framework (tutorials, how-to guides, reference,
  explanation) be a good fit, or is a simpler organisation more appropriate?
- **Depth**: API reference only, or conceptual guides and tutorials as well?
- **Existing conventions**: Are there naming conventions, terminology preferences, or
  organisational patterns already established that should be followed?
- **Deployment**: Will this be hosted (e.g. GitHub Pages, ReadTheDocs) or used locally?
  This affects `mkdocs.yml` configuration.

If the codebase context makes the answers obvious, infer them and proceed. Only ask
when genuine ambiguity would lead to significantly different output.

## Mode of Operation

This skill operates in one of two modes depending on whether the project already
has documentation:

1. **Create from scratch** — Full documentation site creation. Follow the complete
   workflow below.
2. **Augment existing** — Add to or extend documentation that already exists.
   Follow the augmentation workflow further below.

If the project already has documentation, **always** use augment mode. The goal is
to produce new pages that are indistinguishable in voice, structure, and style from
the existing ones — as if the same author wrote everything.

## Workflow — Create from Scratch

### Step 1 — Explore the Codebase

Thoroughly explore the target project:

- Read the top-level directory structure
- Read READMEs, existing docs, and configuration files
- Read source code, paying attention to public interfaces, class hierarchies,
  namespaces, and module boundaries
- Read tests to understand intended usage patterns and edge cases
- Identify logical groupings of functionality (these become documentation sections)

### Step 2 — Plan the Documentation Structure

Design the navigation hierarchy before writing any content. A good structure:

- Starts with a landing page (`index.md`) that introduces the project
- Includes a getting-started or usage guide early in the navigation
- Groups related topics into sections (e.g. by module, subsystem, or concept)
- Each section has its own `index.md` overview page
- Ends with supplementary material (glossary, reference tables, etc.)

Present the planned structure to the user for approval before proceeding, unless they
have indicated they want you to proceed autonomously.

#### Diataxis Framework

For projects with documentation that spans multiple audiences and purposes, consider
organising content according to the [Diataxis](https://diataxis.fr/) framework. Diataxis
divides documentation into four distinct types, each serving a different user need:

| Quadrant      | Orientation         | Purpose                                                   |
|---------------|---------------------|-----------------------------------------------------------|
| Tutorials     | Learning-oriented   | Guide the reader through steps to achieve a working result |
| How-to guides | Task-oriented       | Practical steps to accomplish a specific real-world goal    |
| Reference     | Information-oriented | Accurate, complete technical description of the machinery  |
| Explanation   | Understanding-oriented | Discussion of concepts, design decisions, and trade-offs |

**When to use Diataxis:**

- The project has enough content to populate at least three of the four quadrants
- The audience includes both newcomers (who need tutorials) and experienced users
  (who need reference and how-to guides)
- The documentation is large enough that readers benefit from being able to navigate
  by intent ("I want to learn" vs. "I want to accomplish X" vs. "I want to look
  something up")

**When Diataxis may not be appropriate:**

- Very small projects with only a handful of pages
- Single-audience documentation (e.g. pure API reference for library consumers)
- Projects where the existing documentation structure is well-established and
  reorganising would create unnecessary churn without clear benefit

When applying Diataxis, keep each page in a single quadrant. Do not mix tutorial
steps with reference tables, or embed conceptual explanation inside a how-to
procedure. Cross-link between quadrants so readers can move from learning to doing
to understanding as needed.

**Typical Diataxis structure:**

```text
docs/
├── index.md                    # Project landing page
├── tutorials/
│   ├── index.md                # Tutorials overview
│   ├── first_steps.md          # Guided learning experience
│   └── ...
├── how_to/
│   ├── index.md                # How-to guides overview
│   ├── configure_x.md          # Task-oriented guide
│   └── ...
├── reference/
│   ├── index.md                # Reference overview
│   ├── api.md                  # API reference
│   └── ...
├── explanation/
│   ├── index.md                # Explanation overview
│   ├── architecture.md         # Conceptual discussion
│   └── ...
├── glossary.md                 # Glossary of terms
└── attachments/                # Images, diagrams, and other media
    └── <section>/
```

**Typical non-Diataxis structure:**

```text
docs/
├── index.md                    # Project landing page
├── getting_started.md          # Quick-start / usage guide
├── <section>/
│   ├── index.md                # Section overview
│   ├── <topic>.md              # Individual topic pages
│   └── ...
├── <section>/
│   ├── index.md
│   └── ...
├── glossary.md                 # Glossary of terms
└── attachments/                # Images, diagrams, and other media
    └── <section>/
```

### Step 3 — Write the Content

Write all documentation pages following the style, tone, and formatting rules below.
Work section by section, completing each section before moving to the next.

For each page:

1. Write the content following the page structure conventions
2. Add cross-links to related pages and glossary terms
3. Include code examples where they aid understanding
4. Verify all internal links point to files/headings that exist

### Step 4 — Create the Glossary

Create a `glossary.md` page unless the project is trivially small (fewer than a
handful of concepts) or a glossary genuinely does not fit the repository's character.
Default to including one — it is almost always useful.

- Define all domain-specific terms, abbreviations, and jargon
- Write definitions in the same approachable-technical tone as the rest of the docs
- Definitions should be clear and useful, not circular or overly terse
- Organise terms alphabetically
- Use heading anchors for each term so other pages can link directly to definitions

### Step 5 — Generate mkdocs.yml

Create a `mkdocs.yml` configuration that:

- Sets `site_name` to the project name
- Sets `repo_url` if a repository URL is known
- Defines a `nav` structure matching the documentation hierarchy
- Includes appropriate MkDocs extensions and plugins for the content used
  (e.g. `pymdownx.superfences` if Mermaid diagrams are used, `pymdownx.arithmatex`
  if mathematical formulae are used)

### Step 6 — Validate

Run `mkdocs build --strict` and fix any warnings or errors related to the
documentation itself (missing pages referenced in nav, broken links, missing
images, etc.). Deprecation warnings from MkDocs or its plugins that are unrelated
to the documentation content can be ignored.

Validation checklist:

- [ ] `mkdocs build --strict` completes without documentation-related warnings
- [ ] All `nav` entries point to files that exist
- [ ] All internal links resolve to existing files and headings
- [ ] All image/attachment references resolve to existing files
- [ ] Every page has exactly one H1
- [ ] No duplicate heading text within any single file
- [ ] Glossary terms are linked on first use per page where contextually helpful

## Workflow — Augment Existing Documentation

Use this workflow when the project already has documentation and you are adding
to it rather than creating from scratch.

### Step 1 — Study the Existing Documentation

Before writing a single line, read **all** existing documentation thoroughly:

- Read every page in `docs/` to absorb the voice, sentence patterns, and rhythm
- Read `mkdocs.yml` to understand the navigation structure and any plugins/extensions
  in use
- Note the specific conventions the existing docs follow:
    - How are pages structured? (heading hierarchy, section order, intro style)
    - What tone is used? (formal, casual, second-person, imperative, etc.)
    - How are code examples formatted? (minimal snippets vs. full working examples)
    - How are cross-links written? (link text style, relative path patterns)
    - Are there callouts/admonitions? Which style?
    - Is there a glossary? How are terms linked?
    - How are section index pages written? (brief vs. detailed, bullet lists vs. prose)
    - What spelling convention is used? (British, American)
    - How is punctuation handled in lists? (full stops, no full stops, semicolons)

### Step 2 — Identify What Is Missing

- Compare the codebase's public API surface against existing documentation
- Identify undocumented modules, classes, functions, or concepts
- Check for sections that exist but are incomplete or placeholder-like
- Confirm scope with the user if it is not obvious what they want documented

### Step 3 — Plan the Additions

- Determine where new pages fit into the existing navigation hierarchy
- Follow the existing organisational patterns (e.g. if each module has its own
  section with an `index.md`, do the same for new modules)
- Plan glossary additions if new terms are introduced
- Present the plan to the user unless they have indicated autonomous operation

### Step 4 — Write New Content in the Existing Voice

This is the critical step. New pages must blend seamlessly with existing ones:

- **Mirror the existing page template exactly.** If existing pages open with an
  H1 followed by an "Overview" H2, do the same. If they jump straight into content
  after the H1, do that instead. Do not impose a different structure.
- **Match sentence length and complexity.** If existing docs use short, punchy
  sentences, do not write long compound sentences. If they use a more flowing style,
  match that cadence.
- **Use the same linking patterns.** If existing docs link class names to their pages
  on first mention, do the same. If they use backtick-wrapped identifiers without
  links in certain contexts, follow suit.
- **Reuse the same transitional phrases and structural cues.** If existing pages use
  "For example:" before code blocks, use that rather than "As an example" or
  "Consider the following".
- **Match the level of detail.** If existing API docs list every method with a code
  example, do the same. If they summarise groups of methods in a table, do that.
- **Use the same callout style and frequency.** Do not introduce callouts if the
  existing docs rarely use them, and vice versa.

### Step 5 — Update mkdocs.yml and Cross-Links

- Add new pages to the `nav` section in `mkdocs.yml`, placing them where they
  logically belong in the existing hierarchy
- Add cross-links from existing pages to new pages where relevant (and vice versa)
- Add new terms to the glossary if one exists
- Link new glossary terms from new pages on first use

### Step 6 — Validate

- Run `mkdocs build --strict` and fix any documentation-related warnings
- Verify all new internal links resolve
- Re-read new pages side by side with existing pages to check for voice consistency
- Confirm the navigation feels natural and the new content does not create
  organisational orphans

## Tone and Style

### Approachable-Technical Voice

The target tone is **approachable-technical** — accurate and precise, but never dry,
stiff, or academic. Think of a knowledgeable colleague explaining things clearly over
coffee, not a textbook or specification document.

**Do:**

- Write in a natural, conversational register while remaining precise
- Use plain language where it does not sacrifice accuracy
- Address the reader directly ("you can", "this gives you") when it feels natural
- Use short sentences and clear paragraph structure
- Let the reader breathe — not every sentence needs to carry maximum information density

**Don't:**

- Write dense, clause-heavy prose that requires re-reading
- Use jargon without explanation (or a glossary link)
- Be patronising or overly casual — this is still technical documentation
- Sacrifice accuracy for approachability; both are achievable simultaneously
- Use humour that could date badly or distract from the content

### Spelling and Language Conventions

- Use consistent spelling conventions throughout (e.g. if the project uses British
  English: "initialise", "colour", "behaviour"; if American: "initialize", "color",
  "behavior"). Match whatever the existing codebase or organisation uses.
- Use the Oxford comma.
- Be consistent with punctuation in lists (either all items end with full stops or
  none do, based on whether items are complete sentences).

### Technical Accuracy

Accuracy is paramount. Every factual claim must be verifiable against the source code,
configuration files, or other primary sources.

- Do not guess at behaviour — read the code
- Do not invent parameters, return types, or default values
- If something is unclear from the source, say so rather than fabricating an answer
- When documenting APIs, verify signatures, parameter names, types, and return values
  against the actual source code

## Page Structure Conventions

### Landing Page (index.md)

- H1 with the project name or "Overview"
- Brief description of what the project does (2–4 sentences)
- Key features or capabilities as a bullet list (if helpful)
- Pointers to where to go next (getting started, specific sections)

### Section Index Pages

- H1 with the section name or "Overview"
- Brief description of what the section covers
- Summary of the pages within the section, with links
- Keep these concise — they are navigation aids, not content pages

### Topic Pages

- H1 with the topic name
- Overview section explaining what this topic/class/module is and why it matters
- Logical subsections using H2–H4 (never skip heading levels)
- Code examples in fenced blocks with language identifiers
- Cross-links to related pages where a reader would benefit from them
- Links to glossary terms on first use within the page

### Glossary Page

- H1: "Glossary"
- Terms as H2 headings (for direct anchor linking)
- Each term followed by its definition
- Alphabetically ordered
- Cross-link between related terms within the glossary itself

## Formatting Rules

All markdown must conform to the `/markdown-formatter` skill's rules. Key requirements:

### Headings

- ATX style (`#`, `##`, `###`)
- Ordered levels — never skip from H1 to H3 (MD001)
- Exactly one H1 per file (MD025)
- No duplicate heading text within a file (MD024)
- No heading-ending punctuation (MD026)
- Single blank line above headings; no mandatory blank line below (MD022)

### Lists

- `*` for unordered lists (MD004)
- Indent nested items by 4 spaces (MD007)
- Blank lines around lists (MD032)
- Continuation lines aligned with the first word of the list item text

### Code Blocks

- Fenced with backticks (MD046, MD048)
- Always include a language identifier (MD040)
- Code examples should be minimal but complete enough to be useful
- Prefer real, working examples from the codebase where possible

### Line Length

- 120-character limit for prose and headings (MD013)
- Code blocks and tables are exempt
- Wrap at natural word boundaries

### Links

- No bare URLs (MD034)
- Prefer short link text: one or two words is ideal, three to five at most
- Never link entire sentences or clauses
- When a table or list pairs a name with a description, prefer linking the name
  rather than words inside the description
- Internal links use relative paths
- Anchor fragments must match the auto-generated slug (lowercase, spaces become
  hyphens, non-alphanumeric characters except hyphens are removed)

### Callout Blocks

Use blockquote-style callouts with emoji indicators:

| Type    | Icon | Usage |
|---------|------|-------|
| Alert   | 🟥   | Unignorable facts — catastrophic outcomes if ignored |
| Warning | ⚠️   | Gotchas, destructive actions, performance/security caveats |
| Note    | 📓   | Conventions, reminders, things to keep in mind |
| Info    | ℹ️   | Background context, references, supplementary detail |

```markdown
> ⚠️ Specifying a high accuracy threshold may negatively impact performance.

> ℹ️ This conversion follows the ISO 8601 standard.
```

Do not use GitHub-flavoured `[!NOTE]` / `[!WARNING]` admonition syntax.

### Other Formatting

- No trailing spaces or multiple consecutive blank lines (MD009, MD012)
- No raw HTML except `<br>` (MD033)
- No em dashes (`—`); use `-`, comma, semicolon, or colon instead
- File must end with a single newline (MD047)
- All images must have alt text (MD045)
- Use Mermaid for diagrams where appropriate
- Use LaTeX syntax for mathematical formulae ($inline$ or $$block$$)

## Cross-Linking and Glossary References

- Link domain-specific terms to their glossary entries on first use within each page
  (or wherever contextually helpful for navigation)
- Use relative paths for all internal links
- Add "Related" or "See Also" sections where a reader would benefit from them
- Verify all links resolve to existing targets before considering a page complete
- When linking to glossary terms, use the term as the link text:
  `[UTM](../glossary.md#utm)` not `[see the glossary for UTM](../glossary.md#utm)`

## Attachments and Media

- Store all images, diagrams, and media files in `docs/attachments/`
- Organise into subdirectories by section (e.g. `attachments/geometry/`,
  `attachments/units/`)
- Use descriptive filenames
- Always include alt text on images

## Quality Checklist

Before considering the documentation complete, verify:

- [ ] Every public-facing type, function, module, or endpoint is documented
- [ ] All code examples are accurate and match the actual API
- [ ] All internal links resolve (files exist, anchors match headings)
- [ ] All nav entries in `mkdocs.yml` point to existing files
- [ ] If using Diataxis, each page belongs to a single quadrant and cross-links
      to related pages in other quadrants
- [ ] Tone is consistent across all pages (approachable-technical)
- [ ] Terminology is consistent (same concept, same word, everywhere)
- [ ] Spelling conventions are consistent throughout
- [ ] Glossary exists and terms are linked from other pages
- [ ] `mkdocs build --strict` passes without documentation-related warnings
- [ ] Every page has exactly one H1 and no duplicate headings
- [ ] Formatting conforms to `/markdown-formatter` rules
- [ ] No bare URLs, no raw HTML (except `<br>`), no em dashes
- [ ] Callout blocks use the emoji blockquote style
- [ ] Images have alt text and are stored in `docs/attachments/`
