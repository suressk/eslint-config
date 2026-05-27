import colors from 'picocolors'
import prompts from 'prompts'
import semver from 'semver'
import {
  args,
  generateCommit,
  getPackageInfo,
  getVersionChoices,
  run,
  step,
  updateVersion,
} from './utils'

async function main(): Promise<void> {
  let targetVersion: string | undefined
  const { currentVersion, pkgPath, pkgDir } = getPackageInfo()

  if (!targetVersion) {
    const { release }: { release: string } = await prompts({
      type: 'select',
      name: 'release',
      message: 'Select release type',
      choices: getVersionChoices(currentVersion),
    })

    if (release === 'custom') {
      const { version }: { version: string } = await prompts({
        type: 'text',
        name: 'version',
        message: 'Input custom version',
        initial: currentVersion,
      })
      targetVersion = version
    }
    else {
      targetVersion = release
    }
  }

  if (!semver.valid(targetVersion))
    throw new Error(`invalid target version: ${targetVersion}`)

  const tag = `v${targetVersion}`

  if (targetVersion.includes('beta') && !args.tag)
    args.tag = 'beta'

  if (targetVersion.includes('alpha') && !args.tag)
    args.tag = 'alpha'

  const { confirmRelease }: { confirmRelease: boolean } = await prompts({
    type: 'confirm',
    name: 'confirmRelease',
    message: `Releasing ${colors.yellow(tag)} Confirm?`,
  })

  if (!confirmRelease)
    return

  step('\nUpdating package version...')
  updateVersion(pkgPath, targetVersion)

  // push to Github
  await generateCommit(pkgDir, `release: ${tag}`)
  await run('git', ['tag', tag]) // add tag
  await run('git', ['push', 'origin', `refs/tags/${tag}`]) // push tag to github
  await run('git', ['push'])
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
