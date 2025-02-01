import fs from "fs";
import path from "path";
import chalk from "chalk"; // Import chalk untuk pewarnaan teks

async function copyFolder(src, dest) {
  try {
    await fs.promises.mkdir(dest, { recursive: true });
    const entries = await fs.promises.readdir(src, { withFileTypes: true });

    for (let entry of entries) {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);

      if (entry.isDirectory()) {
        await copyFolder(srcPath, destPath);
      } else {
        await fs.promises.copyFile(srcPath, destPath);
      }
    }

    console.log(chalk.green(`✔ Copied ${src} to ${dest}`));
  } catch (err) {
    console.error(chalk.red(`✖ Error copying folder from ${src} to ${dest}:`), err);
  }
}

const accountsSrc = path.join(process.cwd(), "accounts");
const configSrc = path.join(process.cwd(), "config");
const accountsDest = path.join(process.cwd(), "app", "accounts");
const configDest = path.join(process.cwd(), "app", "config");

(async () => {
  await copyFolder(accountsSrc, accountsDest);
  await copyFolder(configSrc, configDest);

  console.log(chalk.cyan("🚀 Starting the app..."));
  await import("../app/index.js");
})();
