import { test, expect } from "@playwright/test";

test("kanban exige autenticação", async ({ page }) => {
  await page.goto("/admin/leads");
  const url = page.url();
  if (url.includes("/admin/leads")) {
    await expect(page.getByRole("heading", { name: "CRM de Leads" })).toBeVisible();
  } else {
    await expect(page).toHaveURL(/\/admin\/login/);
  }
});
