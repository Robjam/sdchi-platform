import { renderToString } from "hono/jsx/dom/server"
import { FormField } from "~/components/FormField";
import { TextareaField } from "~/components/TextAreaField";
import { Page } from "~/templates/Page"



export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const errors = query.errors ? JSON.parse(decodeURIComponent(query.errors as string)) : {};
  const csrfToken = event.context.csrfToken || '';
  
  return renderToString(
    <Page title="Register New Web App" description="Register a new OIDC web application">
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="max-w-2xl mx-auto">
          <form method="post" action="/portal/clients/new">
            <input type="hidden" name="_csrf" value={csrfToken} />
            <div className="space-y-12">
              <div className="border-b border-gray-900/10 pb-12">
                <h2 className="text-base/7 font-semibold text-gray-900">OIDC Web Application Registration</h2>
                <p className="mt-1 text-sm/6 text-gray-600">
                  Register a new web application that will use this OIDC server for authentication.
                </p>

                <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                  <FormField
                    id="application_name"
                    name="application_name"
                    label="Application Name"
                    required
                    placeholder="My Web Application"
                    error={errors?.application_name}
                    colSpan="sm:col-span-4"
                  />

                  <FormField
                    id="client_id"
                    name="client_id"
                    label="Client ID"
                    required
                    placeholder="my-web-app-client-id"
                    error={errors?.client_id}
                    colSpan="sm:col-span-4"
                  />

                  <FormField
                    id="client_secret"
                    name="client_secret"
                    label="Client Secret"
                    type="password"
                    required
                    placeholder="Enter a secure client secret"
                    error={errors?.client_secret}
                    colSpan="sm:col-span-4"
                  />

                  <TextareaField
                    id="redirect_uri"
                    name="redirect_uri"
                    label="Redirect URIs"
                    required
                    placeholder="https://example.com/auth/callback&#10;https://localhost:3000/auth/callback"
                    error={errors?.redirect_uri}
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
                Register Application
              </button>
            </div>
          </form>
        </div>
      </div>
    </Page>
  )
})
