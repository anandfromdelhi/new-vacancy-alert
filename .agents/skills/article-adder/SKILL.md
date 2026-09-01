---
name: article-adder
description: High-speed, zero-loss skill to build, design, and publish rich, SEO-optimized, mobile-first article and guide pages from raw text and instruction files, with visual cards, tables, graphs, interactive elements, SSG prerendering, and automated book affiliate link reporting.
---

# Article Adder & Publisher Skill

Use this skill whenever the user provides two text files (or text inputs) — **File 1: Article Content Text** and **File 2: Instructions (SEO, Design, or Target Audience Guidelines)** — to design, build, and publish an article page on the website.

---

## Key Goals & Principles

1. **Zero-Loss / Complete Text Fidelity (Strict Copy-Paste Rule)**:
   - **Never delete, truncate, summarize, or omit** any paragraphs, explanations, headings, points, or analysis present in the source article text.
   - Faithfully retain all information while organizing it into clear, engaging, logically structured sections with hierarchical headings (`<h1>`, `<h2>`, `<h3>`).

2. **Mobile-First & Zero Horizontal Scroll Rule**:
   - Every layout, grid, table, badge cluster, and graph must be **100% responsive** with no horizontal overflow (`w-full`, `max-w-full`, `break-words`, `overflow-hidden`).
   - Wide comparison tables must be wrapped in responsive horizontal scrollers (`overflow-x-auto rounded-xl border border-slate-200`) or rendered as responsive mobile cards (`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3`).

3. **Rich Visual Elements & High-Performance UI**:
   - **Hero Section**: Eyebrow badge, high-impact headline, article metadata (Author, Published Date, Updated Date, Reading Time, Category, Views/Bookmarks counter), and quick share/download actions.
   - **Quick Stat & Metric Decks**: Metric cards highlighting key numbers (e.g. Total Questions, Cut-off Marks, Vacancy Numbers, Salary Levels, Preparation Timeframes).
   - **Top Recommendations & Comparison Tables**: Clean styled tables with rank badges, rating stars (`⭐⭐⭐⭐⭐`), feature chips, and highlighted verdict tags.
   - **Book Recommendation Cards**: Beautifully styled cards with subject badges, key features, pros/cons, best-for callouts, and Amazon affiliate action buttons.
   - **Visual Preparation Roadmaps & Timelines**: Numbered circular steps, timeline connectors, and study plan phase grids.
   - **Charts & Visual Meters**: Lightweight, pure Tailwind CSS progress bars, bar comparison metrics, and visual score distributions.
   - **Interactive FAQ Accordion**: Expandable/collapsible FAQ questions with question pills and clean typography.
   - **Sticky Bottom Action Bar & Navigation Index**: Include `<ArticleStickyBottomBar />` and sidebar navigation for seamless reading.
   - **Community & Social Widgets**: `<CommentsSection articleId="..." />`, `<SubscribeWidget />`, author bio box, and social share handles.

4. **Super SEO-Friendly Architecture & Full SSG Pre-Rendering**:
   - React Helmet async `<Helmet>` with custom `<title>`, `<meta name="description">`, `<link rel="canonical">`, Open Graph, and Twitter tags.
   - **Comprehensive Schema.org JSON-LD**:
     - `Article` / `NewsArticle` / `TechArticle` schema with author, publisher, headline, and timestamps.
     - `FAQPage` schema automatically mapping all FAQ items for Google rich snippets.
     - `BreadcrumbList` schema linking Home > Articles > [Article Title].
     - `ItemList` / `Product` schema if books or recommended products are evaluated.
   - Registered in `scripts/prerender.ts` static routes list for 100% raw HTML pre-rendering into `dist/articles/<slug>/index.html` and `dist/articles/<slug>.html`.
   - Automatic `public/sitemap.xml` and `robots.txt` synchronization.

5. **Amazon Affiliate Book Extraction & Reporting**:
   - Structure all book links in a top-level constant dictionary (`export const ARTICLE_BOOK_LINKS = { ... }`).
   - Immediately after uploading and building the article, output a clear, structured markdown table of **all books/materials mentioned in the article** so the user can easily provide Amazon affiliate links to update.

---

## Detailed Step-by-Step Workflow

### Step 1: Analyze Input Files & Content Structure
1. Read **File 1 (Article Content Text)**:
   - Extract the core topic, target exam/recruitment, all subheadings, body paragraphs, tables, study roadmaps, recommended books, FAQs, and author notes.
2. Read **File 2 (Instructions / SEO & Design Requirements)**:
   - Extract target slug, primary keywords, meta description, color themes, category (`Railway` | `Medical` | `SSC` | `General` | `UPSC`), and any custom design instructions.
3. Determine:
   - **Slug**: e.g., `/articles/best-books-for-rrb-alp` or `/articles/upsc-prelims-strategy-2026`
   - **Component Name**: e.g., `RrbAlpBestBooksPage.tsx` or `UpscPrelimsStrategyPage.tsx`

---

### Step 2: Book / Resource Extraction & Affiliate Dictionary Setup
Identify all books, test series, and study materials mentioned in the text and define the book link dictionary at the top of the file:

```tsx
export const ARTICLE_BOOK_LINKS = {
  BOOK_1_KEY: "#", // User will provide Amazon affiliate URL
  BOOK_2_KEY: "#",
  // ...
};
```

---

### Step 3: Create the React Component (`src/pages/<PageName>.tsx`)
Create a new file in `src/pages/` containing:
- Helmet metadata & Schema.org JSON-LD scripts.
- Sticky table of contents / floating dock.
- Complete, unabridged article text organized into visual sections (`<section id="...">`).
- Top pick summary table and detailed review cards for books/topics.
- Visual breakdown boxes, pros & cons, and study timetable grids.
- Interactive FAQ accordion with expand/collapse states.
- Author Bio (`Anand Kumar Mehta` / Government Exam Researcher).
- `<CommentsSection articleId="..." />` and `<SubscribeWidget />`.
- `<ArticleStickyBottomBar />`.

---

### Step 4: Register Routing & Indexing

1. **Register in `src/App.tsx`**:
   - Import the component: `import ArticlePageName from './pages/ArticlePageName';`
   - Add route: `<Route path="articles/<slug>" element={<ArticlePageName />} />`
   - Add backward-compatible redirect if applicable: `<Route path="<slug>" element={<Navigate to="/articles/<slug>" replace />} />`

2. **Register in `src/pages/ArticlesPage.tsx`**:
   - Add article entry to `ARTICLES_LIST` array with `id`, `slug`, `title`, `excerpt`, `category`, `author`, `date`, `readTime`, `badge`, and `icon`.

3. **Register in `scripts/prerender.ts`**:
   - Add `'/articles/<slug>'` to the `routes` Set in `scripts/prerender.ts`.

---

### Step 5: Type Check & SSG Production Build

Run linting and full pre-rendering:
```bash
npm run lint
npm run build
```
Verify that:
- TypeScript passes with 0 errors.
- Pre-renderer discovers and generates raw HTML for the new article route without errors.

---

### Step 6: Git Commit & Push
Commit all new and modified files and push to remote:
```powershell
git add .
git commit -m "feat(articles): add <Article Title> guide and resources"
git push origin main
```

---

### Step 7: Output Amazon Affiliate Book List for User

Present a clean, numbered markdown table to the user with all books extracted from the article:

| # | Book / Material Title | Author / Publisher | Target Subject / Topic | Recommended For | Link Key Name | Current Link |
|---|-----------------------|--------------------|------------------------|-----------------|---------------|--------------|
| 1 | Disha RRB Guide       | Disha Publication  | Complete Syllabus      | Beginners       | `DISHA_GUIDE` | *Pending*    |
| 2 | R.S. Aggarwal Maths   | S. Chand           | Mathematics            | Fundamentals    | `RS_MATHS`    | *Pending*    |

**User Prompt**:
> "Here is the list of books featured in this article. Please provide the Amazon affiliate links for any or all of these items, and I will instantly update the article links and rebuild the site."

---

### Step 8: Update Affiliate Links When Provided
When the user replies with the affiliate links:
1. Update the `ARTICLE_BOOK_LINKS` constant in `src/pages/<PageName>.tsx`.
2. Run `npm run build` to rebuild static HTML pages.
3. Commit and push:
```powershell
git add src/pages/<PageName>.tsx public/sitemap.xml
git commit -m "chore(affiliate): update amazon affiliate links for <article-name>"
git push origin main
```
