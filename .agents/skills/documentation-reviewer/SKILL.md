---
name: documentation-reviewer
description: 'Quality control and assurance for documentation. Use when asked to "review documentation", "do a documentation pass", "check the docs", "audit documentation quality", "proofread the docs", or when performing editorial review of markdown files. Checks informational completeness and accuracy, tonal and phrasing consistency, terminology consistency, appropriate technicality for the target audience, and formatting correctness. Uses the /markdown-formatter skill for formatting rules. Can propose changes for user approval or apply edits directly when instructed.'
---

# Documentation Reviewer

A quality-control skill for reviewing and improving documentation. Performs a comprehensive
editorial pass covering formatting, accuracy, consistency, and audience-appropriateness.

## When to Use This Skill

- User asks to "review documentation", "do a documentation pass", or "check the docs"
- User asks for "proofreading", "editorial review", or "quality check" on docs
- User asks to "audit" or "improve" documentation quality
- User says "update and correct as appropriate" (implies immediate edit permission)

## Prerequisites

- Read the `/markdown-formatter` skill (`references/markdown-formatting-guidelines.md`)
  before starting any review. The formatting rules defined there are the source of truth
  for all formatting checks.
- Read every file in scope before proposing any changes. A full read is essential for
  assessing cross-file consistency.
- Read the relevant codebase, configuration files, or other primary sources that the
  documentation describes. Documentation must be verified against the actual
  implementation, not just checked for internal consistency. For example, if docs
  describe a Dockerfile's build steps, read the Dockerfile; if docs list environment
  variables, check the `.env` file and compose file; if docs describe a service's
  behaviour, check the source code.

## Edit Permission

This skill operates in one of two modes:

1. **Review and propose** (default): Report findings and ask the user for confirmation
   before making edits.
2. **Review and edit**: Apply corrections immediately. This mode is activated when the
   user's request includes language such as "update and correct as appropriate",
   "fix what you find", "do a documentation pass and make changes", or any phrasing
   that grants upfront edit permission.

When in doubt, ask before editing.

## Review Process

### Step 1 - Scope

Confirm which files are in scope. If the user specifies a directory or file set, use
that. Otherwise, ask.

**Default exclusions:** Unless the user explicitly includes them, the following
directories are excluded from review. These contain working notes, agent
configuration, and internal planning material that is not user-facing documentation:

- `.agents/`
- `.notes/`
- `.tickets/`
- `.plans/`

If the user specifically requests review of files within these directories, honour
that request.

### Step 2 - Read the Formatting Rules

Read the `/markdown-formatter` skill and its `references/markdown-formatting-guidelines.md`
file. These rules are the formatting source of truth.

### Step 3 - Read All Files in Scope

Read every in-scope file in full before starting the audit. Do not begin reporting
findings until all files have been read. Cross-file consistency cannot be assessed
from partial reads.

### Step 4 - Audit

Check every file against the criteria below. Organise findings by category, not by file,
so that systemic issues are visible.

### Step 5 - Report or Edit

- In **review and propose** mode: present a summary of findings grouped by category,
  with file and line references. Ask the user which to fix.
- In **review and edit** mode: apply all corrections, then present a summary of what
  was changed.
- **"No significant changes" is a valid outcome.** If the documentation is already in
  good shape and any remaining tweaks would amount to shuffling words without meaningful
  improvement, say so clearly. Do not manufacture findings or recommend busywork edits
  just to produce a non-empty report. A clean bill of health is a legitimate review
  result. Note that this assessment may change if the project itself evolves — the
  documentation may need revisiting when code, architecture, or scope changes, but
  that is a future concern, not a reason to force changes now.

## Audit Criteria

### 1 - Formatting (via /markdown-formatter)

Apply every rule from the `/markdown-formatter` skill. Key checks:

- [ ] ATX headings (`#`), ordered levels (MD001, MD003)
- [ ] Single H1 per file (MD025)
- [ ] No duplicate heading text within a file (MD024)
- [ ] No heading-ending punctuation (MD026)
- [ ] `*` for unordered lists (MD004)
- [ ] Fenced code blocks with language string (MD040, MD046, MD048)
- [ ] Blank line spacing around headings, lists, and fences (MD022, MD031, MD032)
- [ ] No trailing spaces or multiple consecutive blank lines (MD009, MD012)
- [ ] No bare URLs (MD034)
- [ ] No raw HTML except `<br>` (MD033)
- [ ] No em dashes; use `-`, comma, semicolon, or colon instead
- [ ] 120-character line limit (code blocks and tables exempt) (MD013)
- [ ] Callout blocks use the emoji blockquote style (`> ⚠️`, `> ℹ️`, etc.)
- [ ] Final newline (MD047)

### 2 - Informational Completeness and Accuracy

- [ ] Are there gaps in coverage? Topics mentioned but not explained, sections that
      trail off, or areas where a reader would be left with unanswered questions.
- [ ] Is every factual claim accurate? Cross-reference against source files
      (Dockerfiles, compose files, config files, source code) where possible.
- [ ] Are cross-references and "see also" links present where a reader would
      benefit from them?
- [ ] Do "Related Documentation" or equivalent sections exist where appropriate,
      and are they consistent across peer files?
- [ ] Are there missed opportunities to hyperlink terms or concepts to their
      definitions or related detail elsewhere? Prefer short link text: one or
      two words is ideal, three to five at most. Never link entire sentences or
      clauses.
- [ ] When a table or list pairs a name with a description (e.g. parameter
      tables, glossary rows, configuration keys), prefer linking the name
      rather than words inside the description. For example,
      [`constraints`](#vehicleconstraints) in the name column is better than
      a link buried in the description text. Apply the same principle outside
      tables wherever a defined term appears alongside explanatory prose. Fall
      back to linking within the description only when linking the name would
      be confusing or ambiguous.

### 3 - Tonal and Phrasing Consistency

- [ ] Is the voice consistent across all files? (e.g., imperative vs. descriptive,
      second person vs. third person)
- [ ] Is the same concept described the same way everywhere? Watch for synonyms
      that create ambiguity (e.g., "container" vs. "service" vs. "image" used
      interchangeably when they mean different things).
- [ ] Are spelling conventions consistent? (e.g., British English: "initialise",
      "synchronise", "colour"; or American English - but not a mix)
- [ ] Is punctuation style consistent? (e.g., Oxford comma usage, list
      punctuation, sentence-ending in list items)

### 4 - Terminology Consistency

- [ ] Are proper nouns, product names, and technical terms spelled and capitalised
      identically everywhere? (e.g., "Docker Bench" not "docker bench" or
      "DockerBench"; "FMS Bridge" not "fms bridge")
- [ ] Are abbreviations introduced on first use and then used consistently?
- [ ] Do code-formatted terms (backtick-wrapped) match the actual identifiers in
      the codebase?

### 5 - Audience Appropriateness

- [ ] Is the assumed level of technical knowledge consistent across all files?
      One file should not assume deep Docker expertise while a peer file explains
      what a container is.
- [ ] Are explanations pitched at the right level for the target audience?
      Neither too basic (patronising) nor too advanced (alienating).
- [ ] Is jargon either avoided or explained, depending on the audience?

### 6 - Link Validity

- [ ] Do all internal markdown links resolve to existing files?
- [ ] Do all anchor links (e.g., `#some-heading`) resolve to existing headings?
- [ ] Are relative paths correct given each file's location?
- [ ] Are external URLs plausible and well-formed? (Do not fetch them, but check
      for obvious typos or broken patterns.)
- [ ] **No references to internal-only paths.** User-facing documentation must not
      reference or link to files in `.agents/`, `.notes/`, `.tickets/`, or `.plans/`.
      These directories contain working notes and agent configuration that are not
      published or accessible to documentation readers. If a doc references content
      from one of these directories, the relevant information must be extracted and
      included inline in the documentation itself (or in another published doc that
      can be linked). Replace the reference with the actual content, not just a
      different path.

### 7 - Diataxis Structure

> **Appropriateness gate:** Before evaluating this section, determine whether the
> documentation is large enough and varied enough that the Diataxis framework
> (tutorials, how-to guides, reference, explanation) would add value. Small,
> single-audience projects with only a handful of pages may not benefit. If
> Diataxis is clearly inappropriate, note this and skip the section.

When this section applies:

- [ ] **Correct page categorisation.** Does each page belong cleanly to one
      Diataxis quadrant? A page that mixes tutorial steps with reference tables,
      or embeds conceptual explanation inside a how-to procedure, is a sign that
      content should be split or reorganised.
- [ ] **Tutorials are learning-oriented.** Tutorial pages should guide the reader
      through a sequence of steps to achieve a working result. They should not
      explain why things work (that belongs in explanation) or list every option
      (that belongs in reference). The reader should be able to follow the steps
      and succeed, even if they do not yet understand the underlying concepts.
- [ ] **How-to guides are task-oriented.** How-to pages should address a specific,
      real-world goal ("How to configure X", "How to migrate from Y to Z"). They
      assume the reader already has basic competence and skip introductory
      explanation. Steps are practical and goal-directed.
- [ ] **Reference is information-oriented.** Reference pages should describe the
      machinery accurately and completely: APIs, configuration options, CLI flags,
      data formats. They should be dry, consistent, and structured for lookup, not
      for reading end to end. They should not include tutorials or procedural steps.
- [ ] **Explanation is understanding-oriented.** Explanation pages should discuss
      concepts, design decisions, trade-offs, and background context. They help
      the reader build a mental model. They should not include step-by-step
      procedures or API signatures.
- [ ] **Navigation reflects the quadrants.** If the project uses Diataxis, the
      top-level navigation or section structure should make the four categories
      discoverable. The reader should be able to tell at a glance whether they
      are looking at a tutorial, a how-to, a reference page, or an explanation.
- [ ] **Cross-quadrant linking.** Pages should link to their counterparts in other
      quadrants where helpful. A tutorial might link to the relevant reference
      page; a how-to might link to the explanation that justifies the approach.
      These links help readers navigate between learning, doing, and understanding.
- [ ] **Completeness across quadrants.** Are any quadrants conspicuously empty or
      underdeveloped relative to the others? A project with extensive reference
      docs but no tutorials or how-to guides has a gap that may frustrate users.
      Flag significant imbalances.
- [ ] **Newcomer onboarding alignment.** If the documentation has a newcomer
      audience (see [section 8](#8---newcomer-coherence)), assess whether
      Diataxis tutorials adequately serve the onboarding path. The journey from
      "what is this?" through "how do I set it up?" to "how do I achieve a
      typical use case?" should map naturally onto the tutorials quadrant.
      Gaps in tutorials often surface as newcomer coherence failures.

### 8 - Newcomer Coherence

> **Appropriateness gate:** Before evaluating this section, determine whether the
> documentation has an onboarding function — i.e., it targets users, contributors, or
> researchers who may be approaching the project for the first time. If the documentation
> is purely internal reference for an established team with no newcomer audience, note
> this and skip the section. Do not force findings where this criterion is irrelevant.

When this section applies:

- [ ] **Entry-point clarity.** Does the documentation clearly communicate what the
      project is for? Is there a visible "About", "What is this?", or "Overview"
      section that states the problem the project solves and who it is for?
- [ ] **Typical use case visibility.** Are one or more concrete use cases described
      (e.g., "creating an X that does Y", "researching X to justify Y") so a newcomer
      can immediately understand what success looks like?
- [ ] **Onboarding path logic.** Can a newcomer follow a coherent, linear path from
      "what is this?" → "how do I set it up?" → "how do I achieve a typical use case?"
      without dead ends, circular references, or assumed prior knowledge? If the
      project uses Diataxis (see [section 7](#7---diataxis-structure)), this path
      should be well-served by the tutorials quadrant. A weak or missing tutorials
      section is often the root cause of a disjointed onboarding experience.
- [ ] **Holistic coherence.** Do the code, documentation, configuration, examples, and
      directory structure present a unified, self-consistent picture of the project? Or
      do different artefacts tell conflicting stories about what the project is, how it
      is used, or what matters most?
- [ ] **Simplicity of approach.** Is the project's approach to its problem domain
      presented simply enough for a newcomer to grasp without institutional knowledge?
      Are there unnecessary abstractions, unexplained conventions, or implicit
      assumptions that create barriers to comprehension?
- [ ] **Consistency between code and docs.** When a newcomer reads the documentation
      and then looks at the code (or vice versa), do naming, structure, and concepts
      align? Or does the code use different terminology, patterns, or organisation than
      the documentation leads them to expect?

## Reporting Format

When reporting findings (in review-and-propose mode), use this structure:

```markdown
## Documentation Review: <scope>

### Formatting

- **file.md line N**: <issue description>

### Informational Accuracy

- **file.md**: <issue description>

### Consistency

- **file.md, other-file.md**: <issue description>

### Audience

- <observation>

### Links

- **file.md line N**: <broken link description>

### Diataxis Structure

- <observation> (or "Skipped — Diataxis not applicable for this project")

### Newcomer Coherence

- <observation> (or "Skipped — no onboarding audience identified")

### Summary

- N formatting issues
- N accuracy issues
- N consistency issues
- N link issues
- N Diataxis structure issues (or "skipped")
- N newcomer coherence issues (or "skipped")
```

## Tips

- Use `grep` and `awk` for bulk checks (em dashes, bare URLs, list markers, line
  length) before reading files individually. This catches systemic issues fast.
- When checking line length, remember that tables, code blocks, and long URLs are
  exempt.
- When checking link validity, extract all internal links with grep, then verify
  targets exist. This is faster than reading every file looking for broken links.
- For anchor links, remember that MkDocs generates anchors from heading text by
  lowercasing, replacing spaces with hyphens, and stripping punctuation.
