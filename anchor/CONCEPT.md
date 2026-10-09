# Anchor: an attention and working-memory layer for the infinite canvas

**A product concept by Qasim Murad**
**Target users:** designers with ADHD (and, by the curb-cut effect, anyone who works in large, long-lived Figma files)

---

## 0. Why this problem is mine

> **[To fill in, in your own words. Everything below the placeholders is a prompt, not copy to keep.]**
>
> **The moment.** [One specific scene, with a real file and a real deadline. Something like: "It was a Monday, I opened the onboarding file I'd left on Friday, saw 300 frames, and spent 25 minutes just figuring out which one was current." The more concrete, the more credible.]
>
> **What I tried.** [The workaround you built for yourself: sticky-note frames, a "START HERE" page, a Notion doc of next steps, a timer, closing all other tabs. Workarounds are evidence that the tool is missing something.]
>
> **Why the workaround isn't enough.** [Where it breaks: you forget to update the note, the START HERE page goes stale, the timer becomes a nag you ignore.]
>
> **The realization.** [The line that connects your experience to the product: the problem isn't discipline, it's that the file doesn't hold intent, so the person has to.]

Everything that follows is this one experience, generalized, and then checked against what other designers with ADHD say.

---

## 1. The one-line pitch

Figma's infinite canvas is the best thing about Figma and the worst thing about Figma if you have ADHD. Anchor is a small set of native features that hold a designer's **intent, context, and attention** for them, so the canvas stops punishing the brains that are often best at generating ideas on it.

Built for ADHD. Better for everyone.

---

## 2. Why this user, why now

**The population is large and under-served.**
- The CDC's October 2024 report estimated that 6.0% of U.S. adults (about 15.5 million people) had a current ADHD diagnosis in 2023, and 8% had a past or present diagnosis. Over half were diagnosed as adults, which means a large share of working designers are figuring out ADHD on the job, with no workplace accommodations.
- Figma has millions of users. Even at the general-population rate, that is hundreds of thousands of ADHD designers inside Figma. I could not find a study measuring ADHD prevalence among designers specifically, so I do not claim creative fields over-index. What the research does show (White and Shah) is that adults with ADHD score higher on original creative thinking and real-world creative achievement than adults without it. The people the canvas serves worst may be some of the people it exists for.

**The gap is real.** Searching the Figma Community and the wider web turns up accessibility plugins for color contrast, keyboard navigation, and vision simulation, but nothing built for attention, executive function, or working memory. Accessibility in design tooling has so far meant "help designers build accessible products," not "make the design tool accessible to the designer."

**There is an organic signal that users want this.** When Figma retired FigPals, a forum petition to bring them back included this from a designer: "As a designer with ADHD I find the FigPal really helpful as almost a body double, helping me keep on task." Nobody designed FigPals as an accommodation. Users made it one. That is the clearest kind of product evidence: people are already repurposing Figma to meet this need.

**It aligns with where Figma is going.** AI that understands file context, design-system consistency at scale, and new plugin and tooling surfaces are exactly the product areas in the APM job description. Anchor is an application of all three to a specific, underserved user.

---

## 3. ADHD is an accessibility need, not a productivity preference

"Focus features" are easy to dismiss as productivity nice-to-haves. They are not. Attention and working memory are covered by disability law, by the web accessibility standards Figma's own customers are held to, and by the inclusive-design framework the industry already uses. Anchor is an accessibility product by every one of those definitions.

### 3.1 Under the law, concentrating is a protected ability

- **United States.** The ADA Amendments Act of 2008 and the EEOC's implementing regulations (29 CFR 1630.2(i)) list **concentrating** and **thinking** among the "major life activities" whose substantial limitation makes a person legally disabled. The limitation no longer has to be severe; only one major life activity needs to be affected; the effect of medication and coping strategies is disregarded; and episodic conditions count if they would be limiting when active. An ADHD designer whose concentration is substantially limited is a person with a disability under federal law, and the tool they spend eight hours a day inside is the environment where accommodation actually happens.
- **United Kingdom.** The Equality Act 2010 uses a similar test (an impairment with a substantial, long-term adverse effect on day-to-day activities, assessed ignoring medication). Employers and service providers owe reasonable adjustments. Common ADHD adjustments listed by the NHS and employment lawyers include quieter workspaces, breaking tasks into steps, reminders, and assistive technology. Anchor is that list, inside the tool.

### 3.2 Under the standards, attention and memory are explicit accessibility requirements

Figma's customers ship products that must meet WCAG. The same standard applies to Figma itself.

**WCAG 2.2 success criteria whose intent is attention and memory** (verify exact wording against the W3C Recommendation):

| Criterion | Level | What it requires | Anchor feature |
|---|---|---|---|
| 2.2.4 Interruptions | AAA | Interruptions can be postponed or suppressed by the user, except emergencies | Tunnel mutes comments, cursors, and notifications for the session; nothing is lost, it queues |
| 2.2.2 Pause, Stop, Hide | A | Moving or auto-updating content can be paused, stopped, or hidden | Tunnel dims and locks everything outside the scope; multiplayer cursors are hidden |
| 2.2.1 Timing Adjustable / 2.2.6 Timeouts | A / AAA | Users control time limits and are warned of data loss from inactivity | Anchor's timer is informational only; nothing expires, and the session log survives closing the file |
| 3.3.7 Redundant Entry | A | Information already provided is not asked for again in the same process | Where was I? restores context instead of making the user rediscover it |
| 3.2.6 Consistent Help | A | Help is in the same place every time | The Anchor panel is one fixed surface with the same three actions |
| 2.4.11 Focus Not Obscured | AA | The focused item is not hidden by other content | Tunnel keeps the scope fully visible and un-dimmed |

**The W3C's cognitive accessibility guidance** (*Making Content Usable for People with Cognitive and Learning Disabilities*, W3C Group Note, 29 April 2021, from the COGA task force) goes further than WCAG and names the exact problems Anchor targets:

- **Objective 5, "Help users focus."** The Note describes the user need as three failures: losing track of the current action, having attention pulled elsewhere, and not knowing how to stop distractions. Its patterns include **Limit Interruptions** (give users an easy way to control interruptions and content changes unless they started them), **Make Short Critical Paths**, and **Avoid Too Much Content**. It says a site works best for people with attention challenges when there are no interruptions or when interruptions can be paused and viewed later. That is Tunnel.
- **Objective 6, "Ensure processes do not rely on memory."** The Note's guidance is that headings, breadcrumbs, and a visible current-location indicator let someone who lost focus get back to their task without restarting. On an infinite canvas there are no headings and no breadcrumbs. Where was I? and the intent line are the breadcrumb.
- **Objective 8, "Support adaptation and personalization."** Users should be able to adjust the experience to their needs. The drift threshold, the muting, and the opt-in session log are personalization, not defaults imposed on everyone.

The Note is explicit that ADHD is one of the conditions it covers, and that its patterns are supplemental to WCAG rather than required for conformance. That is the right register for Anchor: not a compliance checkbox, but the thing accessibility experts say to build.

### 3.3 Under inclusive design, "solve for one, extend to many" is the method

Microsoft's Inclusive Design toolkit (Kat Holmes) defines disability the way the WHO does, as a **mismatch** between a person and their environment, and uses a **persona spectrum** of permanent, temporary, and situational mismatches. The attention spectrum looks like this:

| Permanent | Temporary | Situational |
|---|---|---|
| ADHD | Concussion, grief, a newborn at home, burnout | Open-plan office, a 40-person file with twelve live cursors, a Friday 4 pm handoff |

The toolkit's rule is **solve for one, extend to many**. Designing Tunnel for the permanent case produces the feature every situational case wants. This is the curb-cut argument in the industry's own vocabulary, and it is why Anchor should ship as a core feature with an accessibility origin rather than as an "ADHD mode."

### 3.4 What the research says about tools like Figma

There is no published study of designers with ADHD using design software. The closest evidence is from neighboring tools, and it points the same way:

- **Coding environments.** A 2025 think-aloud study of nine computing students with ADHD using VS Code found frustration and barriers in the IDE's layout and interaction design, with themes of self-confidence, interaction, and learning. The authors call it the first study of its kind for IDEs. A design canvas has strictly more on screen than a code editor.
- **Productivity tools.** A 2025 paper on neurodivergent-aware productivity observes that mainstream tools assume sequential planning, sustained attention, and consistent executive function, and that for ADHD users they become sources of overwhelm: "task paralysis," fatigue, and prioritization confusion in front of long static boards. A page with 400 frames is a long static board.
- **Assistive prototypes.** *Tether* (ASE 2025, New Ideas track) is a desktop assistant for software engineers with ADHD that targets attention management, task initiation, and re-entry, processes everything locally for privacy, and has so far only been self-evaluated by its authors. It validates the direction and shows the open gap: nobody has built this inside a creative tool, and nobody has tested it with real users at scale. Figma could be first on both.

### 3.5 Figma's accessibility work so far is sensory and motor, not cognitive

Figma has shipped real accessibility work: screen reader support, keyboard navigation (F6 between regions, Tab through layers, Cmd+K actions), an enhanced-contrast mode, and a WCAG 2.2 audit of FigJam in 2023. All of it addresses vision and motor needs. Nothing in Figma's accessibility settings, help center, or plugin ecosystem addresses attention, memory, or executive function. Cognitive accessibility is the next layer, and Anchor is the first concrete proposal for it.

---

## 4. What ADHD actually does to a designer in Figma

I want to avoid the generic "people with ADHD get distracted" framing. The specific executive-function traits map onto specific Figma moments:

| Trait | What it looks like in Figma | The cost |
|---|---|---|
| **Working-memory deficit** | Reopen a file Monday morning, see 400 frames, and have no idea what you were doing Friday afternoon | Slow, anxious "re-entry." Interruption research (Gloria Mark, UC Irvine) puts the general re-entry cost at roughly 20+ minutes; with ADHD it is often worse, and sometimes the file simply gets avoided |
| **Hyperfocus and intent drift** | Sat down to fix the checkout flow. Three hours later the icon set is redrawn and the checkout flow is untouched | Great work on the wrong thing; missed deadlines; shame spiral |
| **Distractibility on an infinite canvas** | Every neighboring frame, comment pin, cursor, and page tab is a competing stimulus | Shallow work; frequent self-interruptions |
| **Task initiation and decomposition** | A brief like "design onboarding" has no obvious first move, so nothing starts | Procrastination that looks like laziness and is not |
| **"ADHD tax" on tedious hygiene** | Layers named `Frame 1432`, detached components, hard-coded colors instead of tokens, because naming and tidying are boring and get deferred forever | Design-system drift, painful handoff, and a reputation problem for the designer |
| **Rejection sensitivity** | A batch of 30 comments lands at once | Feedback becomes a threat; the file gets avoided |
| **Time blindness** | No sense of how long you have been on one element | Overpolishing; surprise at the end of the day |

Anchor targets the first three rows directly, and the fourth and fifth through AI assistance. Comment triage and timers are deliberately secondary (see section 8).

---

## 5. The product

Anchor is three features that share one idea: **the file should remember your intent so you don't have to.**

### 4.1 "Where was I?" (re-entry card)

**When:** every time you open or return to a file after a break.

**What:** a dismissible card at the top of the canvas that answers three questions in under 10 seconds:
1. **What you were doing.** An AI-generated, two-sentence summary built from version history, your recent edits, and your last selection. "You were iterating on the empty-state illustration in *Checkout / Cart empty*. You detached the button component and were trying a larger CTA."
2. **What's waiting on you.** Unresolved comments on frames you touched, in one line each, with the loudest first.
3. **What you said next.** The note you left yourself. On leaving the file (or on a quiet prompt after inactivity), Anchor asks "What's the next step?" and stores the answer against the frame.

One click on the card zooms you to the frame you were on, with it already selected.

**Why it works:** it externalizes working memory. The note-to-future-self is the single highest-leverage ADHD strategy in the clinical literature (externalizing executive function), and Figma already has the raw data (version history, selection, comments) to generate most of the card automatically.

### 4.2 Tunnel (focus mode)

**When:** you pick a frame, flow, or section and press one shortcut.

**What:**
- Everything outside the chosen scope dims and becomes non-interactive. The scope stays fully editable. Components the scope depends on remain reachable.
- Comment pins, multiplayer cursors, and notifications inside Figma are muted for the session. Nothing is lost; it queues.
- A quiet, non-judgmental elapsed-time indicator ("42 min in Tunnel"). No red alarms, no countdown. ADHD users respond badly to pressure cues and well to gentle time awareness.
- An optional "intent line" at the top: the sentence you typed when you entered, e.g. "Finish the error states." It is there to re-read, not to nag.

**Why it works:** it reduces stimuli instead of asking the user to resist them. It also reflects what the FigPals petitioner was describing: a persistent, visible anchor to the current task.

### 4.3 Park it (tangent capture)

**When:** you notice (or Anchor gently notices) that you have drifted from the intent line.

**What:**
- One shortcut moves the frames you have been editing off-intent to a **Parking lot** page, with an auto-generated note ("Explored a larger CTA style, 2:10–2:48 pm, while working on Checkout error states") and a link back to where they came from.
- **Drift nudge:** if you have been editing frames outside your Tunnel scope for a configurable stretch (default 15 min), a single soft prompt appears: "This isn't *Finish the error states*. Park it, or make it the new intent?" Two buttons. No guilt copy.

**Why it works:** hyperfocus tangents are often where the best ideas come from. The goal is not to stop them but to make them cheap to capture and cheap to return from, so a tangent costs minutes rather than an afternoon.

### 4.4 Stretch: "Tidy for me" (AI hygiene, tied to design systems)

Not in the MVP, but the strongest tie to Figma's design-systems roadmap. One action that uses AI to name layers from their content, swap hard-coded values for the nearest matching variable or token, and flag detached instances. It removes the exact chore ADHD designers defer forever, and in doing so improves design-system adoption and consistency across a whole team, which is a goal the APM job description names explicitly.

---

## 6. The curb-cut argument (why Figma should ship this for everyone)

Curb cuts were built for wheelchair users and are used by everyone with a stroller or a suitcase. Each Anchor feature has an obvious general-population user:

| Feature | Built for | Also obviously useful to |
|---|---|---|
| Where was I? | ADHD working memory | Anyone returning from vacation, anyone joining a file mid-project, PMs and engineers who open a design file once a week |
| Tunnel | ADHD distractibility | Anyone in a 2,000-frame enterprise file; anyone presenting one flow in a review |
| Park it | ADHD intent drift | Every designer who has ever had "explorations" pages that nobody can decipher later |
| Tidy for me | ADHD task aversion | Every design-systems team on earth |

This matters for the pitch: an accessibility feature framed as an accommodation gets a small budget; the same feature framed as a core workflow improvement with an accessibility origin gets built. Anchor is the second kind.

---

## 7. How I'd measure it

**Primary (ADHD-specific, measured via opt-in cohort):**
- Time from file open to first meaningful edit ("re-entry time"). Target: cut it in half for returning sessions.
- Self-reported "I knew what to do when I opened the file" (1–5) in a weekly in-product pulse.

**Secondary (everyone):**
- Share of sessions that start from a "Where was I?" click-through.
- Tunnel adoption: sessions with Tunnel on, median Tunnel length, and drift-nudge acceptance rate (Park vs. re-intent vs. dismiss). A high dismiss rate means the nudge is wrong, not the user.
- Parking-lot retrieval rate: how often parked frames get reopened. If it is near zero, Park it is a trash can with better branding and should be redesigned.

**Guardrails:**
- No increase in comment resolution time (muting comments must not make feedback rot).
- No measurable drop in multiplayer collaboration events.

---

## 8. What I deliberately left out, and why

- **Pomodoro timers and countdowns.** Plenty exist, and ADHD users often report they add pressure rather than relieve it. The elapsed-time indicator in Tunnel is the gentlest version that still helps with time blindness.
- **Comment triage and tone softening.** Real need (rejection sensitivity), but it touches the collaboration product and raises trust questions ("did Figma rewrite my reviewer's words?"). It deserves its own concept rather than a bullet here.
- **Gamification, streaks, confetti.** Novelty wears off fast with ADHD, and streaks turn a missed day into shame. Anchor should feel like a calm assistant, not a game.
- **A separate "ADHD mode" toggle.** Segregated modes get discovered by nobody and stigmatize the people who use them. Every Anchor feature is a normal feature anyone can turn on.

---

## 9. Risks and open questions

1. **AI summary quality.** A wrong "Where was I?" summary is worse than none, because it re-anchors the user to the wrong thing. Mitigation: show the evidence (which frames, which version) under the summary, and always prefer the user's own note when one exists.
2. **The drift nudge can become a nag.** Mitigation: it fires at most once per Tunnel session by default, and it learns. Dismiss twice and the threshold doubles.
3. **Privacy and surveillance.** "Figma tracks what frames I edit and for how long" is a reasonable thing to be nervous about, especially for a feature aimed at a disability. Mitigation: all session tracking is local to the user, opt-in, never visible to admins or teammates, and clearly stated.
4. **Enterprise files have thousands of comments.** Muting and un-muting at scale needs careful design so nothing is silently dropped.
5. **Does it actually help?** The honest answer is that I have anecdotes and a mechanism, not a study. The first step is a two-week diary study with ten designers who have ADHD, before writing a line of production code.

---

## 10. How I'd validate it before building (what I'd do in week one as an APM)

1. Recruit 10 designers who self-identify as having ADHD (Figma community, ADHD designer groups on Discord and LinkedIn). Diary study: for one week, each time they open a Figma file, write one line about what they were trying to do and how long it took to feel oriented.
2. Pull anonymized product analytics for a proxy: time from file open to first edit, split by time since last session. If the "re-entry gap" is large for everyone, Where was I? has a general-population business case too.
3. Ship Tunnel as a plugin prototype (see section 11) to the same ten designers and watch them use it over a call.

---

## 11. Prototype plan (what I can build now, as a Figma plugin)

The Figma Plugin API can support a convincing MVP of all three features. Plugins can read and write nodes and pages, observe selection and document changes, zoom the viewport, and store per-user data with `clientStorage`. They cannot mute comments or notifications, and they cannot read version history, so the prototype fakes those two parts and says so.

**Tunnel (plugin):** select a frame or section, press "Enter Tunnel." The plugin records the scope, lowers the opacity of every other top-level node on the page (restoring it on exit), locks them, zooms to fit the scope, and shows an intent line plus an elapsed-time counter in the plugin UI.

**Park it (plugin):** the plugin listens for `documentchange` events. Edits to nodes outside the Tunnel scope accumulate; after 15 minutes of off-scope edits, the UI shows the drift nudge. "Park it" moves the off-scope nodes to a `🅿 Parking lot` page, adds a note frame with the timestamp and intent, and returns the viewport to the scope.

**Where was I? (plugin):** on every session the plugin logs the frames edited and the last selection into `clientStorage`. On relaunch it shows the last session's summary (rule-based in the prototype: frames touched, time spent, the user's saved note) with a "Take me there" button. Swapping the rule-based summary for an AI-written one is a single function call.

Built, this is a 1–2 day prototype. Unbuilt, it is still a concept with a concrete path, which is the thing an APM interview actually tests.

---

## 12. Why me, why this (for the application)

Anchor started as my own workaround (section 0) and became a product concept when I noticed other designers describing the same thing in their own words, like the FigPals "body double" comment. It also comes from a specific belief: Figma's best users are often the ones its canvas serves worst. ADHD designers generate ideas faster than most tools can hold them; the problem is holding, not generating. The product opportunity is to make the file do the remembering. That is a working-memory problem dressed up as a design-tool problem, and solving it well means working across AI (the summaries), design systems (tidy-for-me and consistency), and plugin surfaces (the prototype path), which is exactly the cross-product liaison role the APM program describes.

---

## Sources

**Accessibility law and standards**
- EEOC, *Notice Concerning the ADA Amendments Act of 2008* and 29 CFR 1630.2(i) (concentrating and thinking as major life activities; mitigating measures disregarded; episodic impairments): [eeoc.gov](https://www.eeoc.gov/laws/guidance/notice-rights-under-ada-amendments-act-2008); final rule, Federal Register, 25 March 2011: [govinfo.gov](https://www.govinfo.gov/link/fr/76/17007).
- UK Equality Act 2010 as applied to ADHD, with NHS reasonable-adjustment examples: [CNWL NHS](https://www.cnwl.nhs.uk/services/mental-health-services/cnwl-adult-adhd-service/adhd-reasonable-adjustments), [didlaw](https://didlaw.com/?p=8468).
- W3C, *Making Content Usable for People with Cognitive and Learning Disabilities*, Group Note, 29 April 2021: [w3.org/TR/coga-usable](https://www.w3.org/TR/coga-usable/). Objective "Help users focus": [w3.org](https://w3.org/WAI/WCAG2/supplemental/objectives/o5-user-focus/); pattern "Limit Interruptions": [w3.org](https://w3.org/WAI/WCAG2/supplemental/patterns/o5p01-minimal-interruptions/); objective "Ensure processes do not rely on memory": [w3.org](https://www.w3.org/WAI/WCAG2/supplemental/objectives/o6-memory).
- WCAG 2.2 (success criteria 2.2.1, 2.2.2, 2.2.4, 2.2.6, 2.4.11, 3.2.6, 3.3.7): [w3.org/TR/WCAG22](https://www.w3.org/TR/WCAG22/). Understanding 2.2.4 Interruptions: [w3c.github.io](https://w3c.github.io/wcag21/understanding/interruptions.html).
- Microsoft Inclusive Design toolkit, persona spectrum and "solve for one, extend to many": [inclusive.microsoft.design](https://inclusive.microsoft.design/); secondary summary at [CareerFoundry](https://careerfoundry.com/en/blog/ux-design/persona-spectrums/).

**Research**
- *Accessible Design in Integrated Development Environments: A Think Aloud Study Exploring the Experiences of Students with ADHD* (2025): [arxiv.org/abs/2506.10598](https://arxiv.org/abs/2506.10598).
- Shah, Magalhaes, Gama, de Souza Santos, *Tether: A Personalized Support Assistant for Software Engineers with ADHD*, ASE 2025 NIER: [arxiv.org/abs/2509.01946](https://arxiv.org/abs/2509.01946).
- *Toward Neurodivergent-Aware Productivity: A Systems and AI-Based Human-in-the-Loop Framework for ADHD-Affected Professionals* (2025): [arxiv.org/abs/2507.06864](https://arxiv.org/abs/2507.06864).
- White and Shah on creative thinking and achievement in adults with ADHD, summarized at [Understood.org](https://www.understood.org/articles/adhd-and-creativity-what-you-need-to-know).

**Figma's current accessibility surface**
- Figma Help Center, accessibility settings and keyboard navigation: [help.figma.com](https://help.figma.com/hc/articles/35063862380311).
- Figma blog, screen reader and keyboard accessibility features: [figma.com/blog](https://www.figma.com/blog/introducing-screenreader-and-accessibility-features/), [figma.com/blog](https://www.figma.com/blog/introducing-keyboard-accessibility-features/).

**Prevalence and user evidence**

- CDC, *Morbidity and Mortality Weekly Report*, October 10, 2024, on adult ADHD prevalence (6.0% current diagnosis; 8% past or present; 55.9% diagnosed in adulthood). Summarized by [CHADD](https://chadd.org/about-adhd/general-prevalence-adults/) and [Psychiatric Times](https://psychiatrictimes.com/view/insights-into-the-new-cdc-data-on-adult-adhd).
- Figma Community forum, FigPals petition thread, designer with ADHD describing FigPals as a "body double": [forum.figma.com](https://forum.figma.com/share-your-feedback-26/we-need-to-make-figpals-a-permanent-feature-sign-the-petition-39122/index6.html).
- Figma blog, [Design for everyone with these accessibility-focused plugins](https://www.figma.com/blog/design-for-everyone-with-these-accessibility-focused-plugins/), which shows current accessibility tooling is focused on contrast and vision, not attention.
- Gloria Mark (UC Irvine) interruption research, the source of the commonly cited ~23-minute task-resumption figure. Secondary summary at [jobcannon.io](https://jobcannon.io/blog/context-switching-cost); cite the primary papers before using the exact number.
- Bournemouth University, *Inattention and task switching performance: the role of predictability, working memory load and goal neglect*, which links inattentive traits to higher switch costs under working-memory load: [eprints.bournemouth.ac.uk](https://eprints.bournemouth.ac.uk/32496/).
- Stéphanie Walter, *Neurodiversity and UX* resource collection (design guidelines for ADHD, autism, dyslexia, dyscalculia), referenced via [LinkedIn](https://es.linkedin.com/in/airam-reyes).
