const { execSync } = require('child_process')

if (process.env.VERCEL) {
    console.log(
        'Running in Vercel — skipping local test suite (tests run separately, before deploy).'
    )
    process.exit(0)
}

console.log('Running unit tests...')
execSync('npm run test:unit', { stdio: 'inherit' })

console.log('Running E2E tests...')
execSync('npm run test:e2e', { stdio: 'inherit' })

console.log('All tests passed. Proceeding with build.')
