async function main() {
  console.log('Database seeding skipped.')
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
