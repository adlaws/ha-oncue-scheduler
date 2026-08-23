---
name: prompt-enhancer
description: >
  Enhance and improve user prompts so they produce better outcomes when used
  with LLM agents. Use when asked to "enhance my prompts", "enhance prompts",
  "improve my prompt", "make my prompts better", "prompt enhancement mode", or
  "help me write better prompts". Deactivate when told to "stop enhancing
  prompts", "stop prompt enhancement", "stop enhancing my prompts", or
  "disable prompt enhancement".
---

# Prompt Enhancer

Takes a user's draft prompt and produces an improved version that is more
specific, structured, and likely to produce the desired outcome when given to
an LLM agent.

## When to Use This Skill

- User says "enhance my prompts", "enhance prompts", "improve my prompt",
  "prompt enhancement mode", or similar activation phrases.
- User provides a draft prompt and asks for it to be made better, clearer, or
  more detailed.

## When to Deactivate

- User says "stop enhancing prompts", "stop enhancing my prompts", "stop
  prompt enhancement", "disable prompt enhancement", or similar.
- When deactivated, return to normal operation and stop applying the
  enhancement workflow.

## Enhancement Workflow

When this skill is active, treat every user message as a prompt to be enhanced
unless it is clearly a meta-instruction (e.g. "stop enhancing").

### Step 1: Analyse the Original Prompt

Evaluate the user's prompt against these dimensions:

| Dimension        | Question to Ask Yourself                                      |
| ---------------- | ------------------------------------------------------------- |
| **Clarity**      | Is the intent unambiguous?                                    |
| **Specificity**  | Are concrete details provided (language, format, scope, etc)? |
| **Context**      | Is there enough background for an agent to act?               |
| **Constraints**  | Are boundaries, limitations, or exclusions stated?            |
| **Output shape** | Is the desired output format/structure described?             |
| **Audience**     | Is the target reader or consumer of the output clear?         |
| **Tone/Style**   | Are stylistic expectations communicated?                      |

### Step 2: Decide — Enhance or Clarify

Apply the following decision logic:

- **If the prompt is clear enough to enhance confidently** → proceed to
  Step 3.
- **If the prompt is ambiguous or too vague** (i.e. there are multiple
  plausible interpretations that would lead to significantly different
  outputs, OR critical details are missing that cannot be reasonably
  inferred) → proceed to Step 2a.

#### Step 2a: Ask Clarifying Questions

Ask the user focused follow-up questions to resolve ambiguity. Guidelines:

- Ask only what is **necessary** — do not over-question.
- Group related questions together.
- Provide suggested options where appropriate to reduce friction.
- Frame questions around the dimensions from Step 1 that are lacking.
- Maximum 3–5 questions per round. If more are needed, prioritise the most
  impactful ones first.

Example question patterns:

- "What is the intended audience for this output?"
- "Should the output be in a specific format (e.g. bullet points, code,
  prose)?"
- "Are there any constraints I should know about (length, language, style)?"
- "What is the primary goal — informing, persuading, instructing, or
  something else?"
- "Can you give an example of what a good result would look like?"

After receiving answers, return to Step 1 with the additional context.

### Step 3: Produce the Enhanced Prompt

Rewrite the prompt applying these principles:

1. **Be explicit about the role/persona** — If the prompt benefits from a
   system-level framing, add it (e.g. "You are an expert X…").
2. **State the task clearly** — Use a direct imperative sentence to describe
   what the agent should do.
3. **Provide context** — Include relevant background, constraints, and scope.
4. **Define the output format** — Specify structure, length, format, or style
   expectations.
5. **Add examples if helpful** — Include input/output examples when they
   would reduce ambiguity.
6. **Set boundaries** — State what to include AND what to exclude or avoid.
7. **Sequence multi-step tasks** — If the task has multiple parts, number
   them explicitly.

### Step 4: Present the Result

Present the enhanced prompt to the user in a clearly delineated block. Use
the following format:

---

**Enhanced prompt:**

> [The improved prompt text here]

---

If you made significant assumptions, briefly list them below the enhanced
prompt so the user can confirm or correct them.

### Step 5: Offer Iteration

After presenting the enhanced prompt, ask if the user would like to:

- Adjust or refine it further
- Enhance another prompt
- Stop prompt enhancement mode

## Enhancement Principles

- **Preserve intent** — Never change what the user is trying to achieve; only
  make it clearer and more actionable.
- **Don't over-constrain** — Add specificity where it helps, but don't add
  unnecessary restrictions the user didn't ask for.
- **Be concise** — Enhanced prompts should be as short as possible while
  remaining complete. Do not pad with filler.
- **Respect the user's style** — If the user writes casually, the enhanced
  prompt can be direct and practical rather than formal.
- **Infer intelligently** — Use context from the conversation, workspace, and
  common sense to fill gaps where the inference is obvious (e.g. if the user
  is in a C++ project, assume the prompt is about C++ unless stated
  otherwise).

## Examples

### Example 1: Simple Enhancement (No Clarification Needed)

**Original:** "Write a function to parse dates"

**Enhanced:**

> Write a C++ function that parses date strings in ISO 8601 format
> (YYYY-MM-DD) and returns a struct containing year, month, and day as
> integers. The function should return an error indication (e.g.
> std::optional or a bool success flag) for invalid input rather than
> throwing exceptions. Include input validation for impossible dates
> (e.g. month 13, day 32).

### Example 2: Clarification Needed

**Original:** "Make it better"

**Response:** This prompt is too vague for me to enhance meaningfully. A few
questions:

1. What is "it" — code, documentation, a design, something else?
2. What does "better" mean in this context — faster, more readable, more
   complete, differently structured?
3. Is there a specific problem with the current version you'd like addressed?

### Example 3: Moderate Enhancement with Assumptions

**Original:** "Add error handling"

**Enhanced:**

> Add error handling to the current function/module. Specifically:
>
> 1. Identify operations that can fail (file I/O, network calls, parsing,
>    memory allocation).
> 2. Add appropriate error handling for each (try/catch, error codes, or
>    Result types depending on the project's existing patterns).
> 3. Ensure errors are logged with enough context for debugging.
> 4. Propagate unrecoverable errors to the caller rather than silently
>    swallowing them.
>
> Follow the existing error-handling patterns already used in this codebase.

**Assumptions:** Applying to the currently open file; following existing
project conventions for error handling style.
