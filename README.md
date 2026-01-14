# Hangul Amount Calculator

Korean MVP calculator that shows results as numeric values and Hangul amount text.

## Tech Stack

- Next.js (App Router)
- TypeScript
- Tailwind CSS

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the dev server:
   ```bash
   npm run dev
   ```
3. Open [http://localhost:3000](http://localhost:3000).

## Testing

```bash
npm run test
```

## Deployment (Vercel)

1. Push this repository to GitHub.
2. Go to [Vercel](https://vercel.com) and import the repository.
3. Keep the default settings for Next.js and deploy.
4. Vercel will provide a live URL after the build completes.

## Notes

- Integer results are converted to Hangul using 만/억/조/경 units.
- Decimal results show "소수점 지원 예정".
