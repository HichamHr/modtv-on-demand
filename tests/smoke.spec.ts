import { test, expect, type Page } from "@playwright/test";

const email = process.env.E2E_EMAIL;
const password = process.env.E2E_PASSWORD;

function uniqueSlug(prefix: string) {
  const stamp = Date.now().toString(36).slice(-6);
  const rand = Math.random().toString(36).slice(2, 6);
  return `${prefix}-${stamp}${rand}`.slice(0, 30);
}

async function login(page: Page) {
  if (!email || !password) {
    throw new Error("E2E_EMAIL and E2E_PASSWORD must be set.");
  }

  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByLabel("Password").fill(password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
}

test("redirects unauthenticated users from /dashboard", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});

test("creates a channel and redirects to /dashboard/[slug]", async ({ page }) => {
  test.skip(!email || !password, "Set E2E_EMAIL and E2E_PASSWORD to run.");

  await login(page);

  const slug = uniqueSlug("qa-channel");
  await page.getByRole("button", { name: "Create Channel" }).first().click();
  const dialog = page.getByRole("dialog");
  await dialog.getByLabel("Name").fill(`QA Channel ${slug}`);
  await dialog.getByLabel("Slug").fill(slug);
  await dialog.getByRole("button", { name: "Create Channel" }).click();

  await expect(dialog).toBeHidden({ timeout: 10000 });
  await expect(page).toHaveURL(new RegExp(`/dashboard/${slug}$`), {
    timeout: 10000,
  });
});

test("draft stays hidden until publish, then appears on storefront", async ({ page }) => {
  test.skip(!email || !password, "Set E2E_EMAIL and E2E_PASSWORD to run.");

  await login(page);

  const slug = uniqueSlug("qa-draft");
  const title = `Draft Video ${slug}`;

  await page.getByRole("button", { name: "Create Channel" }).first().click();
  const channelDialog = page.getByRole("dialog");
  await channelDialog.getByLabel("Name").fill(`QA Draft Channel ${slug}`);
  await channelDialog.getByLabel("Slug").fill(slug);
  await channelDialog.getByRole("button", { name: "Create Channel" }).click();
  await expect(channelDialog).toBeHidden({ timeout: 10000 });
  await expect(page).toHaveURL(new RegExp(`/dashboard/${slug}$`), {
    timeout: 10000,
  });

  await page.goto(`/dashboard/${slug}/videos`);
  await page.getByRole("button", { name: "Add Video" }).click();
  const videoDialog = page.getByRole("dialog");
  await videoDialog.getByLabel("Title").fill(title);
  await videoDialog.getByLabel("Video URL").fill("https://example.com/video.mp4");
  await videoDialog.getByRole("button", { name: "Save" }).click();
  await expect(videoDialog).toBeHidden();
  await expect(page.getByRole("heading", { name: title })).toBeVisible({
    timeout: 10000,
  });

  await page.goto(`/${slug}`);
  await expect(page.getByRole("heading", { name: "No videos yet" })).toBeVisible();
  await expect(page.getByText(title)).toHaveCount(0);

  await page.goto(`/dashboard/${slug}/videos`);
  await page.getByRole("button", { name: "Publish" }).first().click();
  await expect(page.getByRole("button", { name: "Unpublish" }).first()).toBeVisible({
    timeout: 15000,
  });

  await page.goto(`/${slug}`);
  await expect(page.getByText(title)).toBeVisible();
});

test("premium video shows paywall UI", async ({ page }) => {
  test.skip(!email || !password, "Set E2E_EMAIL and E2E_PASSWORD to run.");

  await login(page);

  const slug = uniqueSlug("qa-premium");
  const title = `Premium Video ${slug}`;

  await page.getByRole("button", { name: "Create Channel" }).first().click();
  const channelDialog = page.getByRole("dialog");
  await channelDialog.getByLabel("Name").fill(`QA Premium Channel ${slug}`);
  await channelDialog.getByLabel("Slug").fill(slug);
  await channelDialog.getByRole("button", { name: "Create Channel" }).click();
  await expect(channelDialog).toBeHidden({ timeout: 10000 });
  await expect(page).toHaveURL(new RegExp(`/dashboard/${slug}$`), {
    timeout: 10000,
  });

  await page.goto(`/dashboard/${slug}/videos`);
  await page.getByRole("button", { name: "Add Video" }).click();
  const videoDialog = page.getByRole("dialog");
  await videoDialog.getByLabel("Title").fill(title);
  await videoDialog.getByLabel("Video URL").fill("https://example.com/video.mp4");
  await videoDialog.getByLabel("Premium (paid)").check();
  await videoDialog.getByLabel("Price (cents)").fill("499");
  await videoDialog.getByRole("button", { name: "Save" }).click();
  await expect(videoDialog).toBeHidden();

  await expect(page.getByRole("button", { name: "Publish" }).first()).toBeVisible({
    timeout: 10000,
  });
  await page.getByRole("button", { name: "Publish" }).first().click();
  await expect(page.getByRole("button", { name: "Unpublish" }).first()).toBeVisible({
    timeout: 15000,
  });

  await page.goto(`/${slug}`);
  await page.getByRole("link", { name: title }).click();
  await expect(page.getByRole("heading", { name: "Unlock full access" })).toBeVisible();
});

test("unknown channel or video returns not found", async ({ page }) => {
  await page.goto("/this-channel-does-not-exist");
  await expect(page.getByRole("heading", { name: "Not found" })).toBeVisible();

  await page.goto("/this-channel-does-not-exist/videos/not-a-real-video");
  await expect(page.getByRole("heading", { name: "Not found" })).toBeVisible();
});
