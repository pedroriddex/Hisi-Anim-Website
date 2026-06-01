/**
 * Central site configuration.
 *
 * Everything that depends on the GitHub repository lives here, so the download
 * button and version badge stay in sync from a single source of truth.
 */
export const REPO_OWNER = "pedroriddex";
export const REPO_NAME = "Hisi-Anim-WordPress-Plugin";

export const GITHUB_REPO_URL = `https://github.com/${REPO_OWNER}/${REPO_NAME}`;
export const GITHUB_RELEASES_URL = `${GITHUB_REPO_URL}/releases`;

/**
 * Stable link to the ZIP asset of the latest release. Works automatically as
 * soon as a release with a `hisi-anim.zip` asset is published.
 */
export const DOWNLOAD_URL = `${GITHUB_REPO_URL}/releases/latest/download/hisi-anim.zip`;

export const WORDPRESS_ORG_URL = ""; // TODO: set once published on wordpress.org.

/**
 * Fetch the latest published version tag from the GitHub API.
 * Returns null when there is no release yet, so the UI can fall back gracefully.
 * Revalidated hourly so the site always shows the current version.
 */
export async function getLatestVersion(): Promise<string | null> {
  try {
    const res = await fetch(
      `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/releases/latest`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      },
    );
    if (!res.ok) {
      return null;
    }
    const data = (await res.json()) as { tag_name?: string };
    return data.tag_name ?? null;
  } catch {
    return null;
  }
}
