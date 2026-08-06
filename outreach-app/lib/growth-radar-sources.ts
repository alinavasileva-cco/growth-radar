type GitHubTreeItem = { path?: string; type?: string };

const REPOSITORY = "alinavasileva-cco/growth-radar";
const BRANCH = "main";
const RAW_BASE = `https://raw.githubusercontent.com/${REPOSITORY}/${BRANCH}/`;
const TREE_URL = `https://api.github.com/repos/${REPOSITORY}/git/trees/${BRANCH}?recursive=1`;
const MAX_RECENT_SHARDS_PER_KIND = 50;

function latest(paths: string[], marker: string): string[] {
  return paths
    .filter((path) => path.includes(marker) && path.endsWith(".csv"))
    .sort((a, b) => b.localeCompare(a))
    .slice(0, MAX_RECENT_SHARDS_PER_KIND);
}

function envUrls(...values: Array<string | undefined>): string[] {
  return values
    .flatMap((value) => (value ?? "").split(","))
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function discoverGrowthRadarSources() {
  const response = await fetch(TREE_URL, {
    cache: "no-store",
    headers: { accept: "application/vnd.github+json" }
  });
  if (!response.ok) throw new Error(`Не удалось прочитать список кампаний Growth Radar: ${response.status}`);

  const payload = await response.json() as { tree?: GitHubTreeItem[] };
  const allCsvPaths = (payload.tree ?? [])
    .filter((item) => item.type === "blob" && item.path?.startsWith("data/") && item.path.endsWith(".csv"))
    .map((item) => item.path!);

  const campaignPaths = allCsvPaths.filter((path) => path.startsWith("data/campaigns/"));
  const campaignRoots = [...new Set(campaignPaths.map((path) => path.split("/").slice(0, 3).join("/")))];
  const leadPaths = new Set<string>();
  const contactPaths = new Set<string>();

  if (allCsvPaths.includes("data/leads_master.csv")) leadPaths.add("data/leads_master.csv");
  if (allCsvPaths.includes("data/contacts.csv")) contactPaths.add("data/contacts.csv");

  for (const root of campaignRoots) {
    const paths = campaignPaths.filter((path) => path.startsWith(`${root}/`));
    for (const path of paths) {
      if (path.endsWith("/leads_master.csv") || path.endsWith("/contactable_master.csv")) leadPaths.add(path);
      if (path.endsWith("/contacts.csv")) contactPaths.add(path);
    }
    latest(paths, "/master_shards/").forEach((path) => leadPaths.add(path));
    latest(paths, "/contactable_shards/").forEach((path) => leadPaths.add(path));
    latest(paths, "/contact_shards/").forEach((path) => contactPaths.add(path));
  }

  const customLeadUrls = envUrls(
    process.env.GROWTH_RADAR_CSV_URL,
    process.env.GROWTH_RADAR_LEGACY_LEADS_URL,
    process.env.GROWTH_RADAR_CAMPAIGN_LEADS_URL,
    process.env.GROWTH_RADAR_CONTACTABLE_URL
  );
  const customContactUrls = envUrls(
    process.env.GROWTH_RADAR_LEGACY_CONTACTS_URL,
    process.env.GROWTH_RADAR_CAMPAIGN_CONTACTS_URL
  );

  return {
    leadUrls: [...new Set([...leadPaths].map((path) => `${RAW_BASE}${path}`).concat(customLeadUrls))],
    contactUrls: [...new Set([...contactPaths].map((path) => `${RAW_BASE}${path}`).concat(customContactUrls))],
    campaignCount: campaignRoots.length
  };
}
