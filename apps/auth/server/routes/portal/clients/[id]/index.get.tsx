import { eq } from "drizzle-orm";
import { renderToString } from "hono/jsx/dom/server";
import { FormField } from "~/components/FormField";
import { TextareaField } from "~/components/TextAreaField";
import { Page } from "~/templates/Page";
import { useDb } from "~~/db";
import { sdchiClients } from "~~/db/schema/oidc";

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    return sendRedirect(event, "/portal/clients", 404);
  }

  const db = useDb((event.context.cloudflare.env as any));
  const record = await db.select().from(sdchiClients).where(eq(sdchiClients.id, id)).get();
  if (!record) {
    return sendRedirect(event, "/portal/clients", 404);
  }

  const redirectUris = JSON.parse(record.redirectUris);
  const redirectUriString = redirectUris.join('\n');
  const csrfToken = event.context.csrfToken || '';

  return renderToString(
    <Page title="Edit OIDC Web App" description="Edit an existing OIDC web application">
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-2xl mx-auto">
          <form method="post" action={`/portal/clients/${id}`}>
            <input type="hidden" name="_csrf" value={csrfToken} />
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base/7 font-semibold text-gray-900">Edit OIDC Web Application</h2>
                <p className="mt-1 text-sm/6 text-gray-600">
                  Update the configuration for this OIDC web application.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <FormField
                    id="application_name"
                    name="application_name"
                    label="Application Name"
                    required
                    defaultValue={record.applicationName}
                    colSpan="sm:col-span-4"
                  />

                  <div className="sm:col-span-4">
                    <label className="block text-sm/6 font-medium text-gray-900">
                      Client ID
                    </label>
                    <div className="mt-2">
                      {record.id}
                      <p className="mt-2 text-sm text-gray-500">
                        The Client ID cannot be changed after creation.
                      </p>
                    </div>
                  </div>

                  <FormField
                    id="client_secret"
                    name="client_secret"
                    label="Client Secret"
                    type="text"
                    required
                    defaultValue={record.tokenSecret}
                    colSpan="sm:col-span-4"
                  />

                  <TextareaField
                    id="redirect_uri"
                    name="redirect_uri"
                    label="Redirect URIs"
                    required
                    defaultValue={redirectUriString}
                    rows={4}
                    description="Enter one redirect URI per line. These are the URLs where users will be redirected after authentication."
                  />
                </div>
              </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
              <a
                href="/portal/clients"
                className="text-sm/6 font-semibold text-gray-900 hover:text-gray-700"
              >
                Cancel
              </a>
              <button
                type="submit"
                className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Update Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </Page>);
});
