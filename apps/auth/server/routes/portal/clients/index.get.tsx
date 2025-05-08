import { renderToString } from "hono/jsx/dom/server"
import { Fragment } from "hono/jsx/jsx-runtime";
import { Page } from "~/templates/Page";
import { useDb } from "~~/db";
import { sdchiClients } from "~~/db/schema/oidc";

interface CopyableTextProps {
  text: string;
  displayText?: string;
  title: string;
  className?: string;
}

function CopyableText({ text, displayText, title, className = "" }: CopyableTextProps) {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <span className="font-mono">{displayText || text}</span>
      <button
        onclick={(e) => {
          e.preventDefault();
          navigator.clipboard.writeText(text).then(() => {
            console.log('Copied to clipboard:', text);
          }).catch(err => {
            console.error('Failed to copy:', err);
          });
        }}
        className="text-gray-400 hover:text-gray-600 cursor-pointer"
        title={title}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      </button>
    </div>
  );
}

interface CopyableURIsProps {
  uris: string[];
}

function CopyableURIs({ uris }: CopyableURIsProps) {
  return (
    <div className="flex items-start space-x-2">
      {uris.map((uri, idx) => (
        <>
          <CopyableText
            text={uri}
            key={idx}
            title="Copy Redirect URI"
            className="flex-1 font-mono"
          />
        </>
      ))}
    </div>
  );
}

export default defineEventHandler(async (event) => {
  const db = useDb((event.context.cloudflare.env as any));
  const records = await db.select().from(sdchiClients);

  // TODO: workout the switch to render for client-side rendering
  return renderToString(
    <Page title="Registered Web Apps" description="List of registered web apps">
      <div className="px-4 sm:px-6 lg:px-8 mt-10">
        <div className="sm:flex sm:items-center">
          <div className="sm:flex-auto">
            <h1 className="text-base font-semibold text-gray-900">Registered Web Apps</h1>
            <p className="mt-2 text-sm text-gray-700">
              A list of all the registered web applications that can use this OIDC server for authentication.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <a
              type="button"
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              href="/portal/clients/new"
              title="Register a new OIDC web application"
              aria-label="Register a new OIDC web application"
              role="button"
            >
              + Add New Web App
            </a>
          </div>
        </div>
        <div className="mt-8 flow-root">
          <div className="-mx-4 -my-2 sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 align-middle">
              <table className="min-w-full border-separate border-spacing-0">
                <thead>
                  <tr>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter sm:pl-6 lg:pl-8"
                    >
                      Application Name
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter sm:table-cell"
                    >
                      Client Id
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 hidden border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter lg:table-cell"
                    >
                      Redirect URIs
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur-sm backdrop-filter"
                    >
                      Token Secret
                    </th>
                    <th
                      scope="col"
                      className="sticky top-0 z-10 border-b border-gray-300 bg-white/75 py-3.5 pr-4 pl-3 backdrop-blur-sm backdrop-filter sm:pr-6 lg:pr-8"
                    >
                      <span className="sr-only">Edit</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {records.map((record, index) => (
                    <tr key={record.id}>
                      <td
                        className={classNames(
                          index !== records.length - 1 ? 'border-b border-gray-200' : '',
                          'py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6 lg:pl-8',
                        )}
                      >
                        {record.applicationName}
                      </td>
                      <td
                        className={classNames(
                          index !== records.length - 1 ? 'border-b border-gray-200' : '',
                          'hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 sm:table-cell',
                        )}
                      >
                        <CopyableText
                          text={record.id}
                          title="Copy Client ID"
                        />
                      </td>
                      <td
                        className={classNames(
                          index !== records.length - 1 ? 'border-b border-gray-200' : '',
                          'hidden px-3 py-4 text-sm whitespace-nowrap text-gray-500 lg:table-cell',
                        )}
                      >
                        <CopyableURIs
                          uris={formatRedirectUris(record.redirectUris)}
                          title="Copy Redirect URIs"
                        />
                      </td>
                      <td
                        className={classNames(
                          index !== records.length - 1 ? 'border-b border-gray-200' : '',
                          'px-3 py-4 text-sm whitespace-nowrap text-gray-500',
                        )}
                      >
                        <CopyableText
                          text={record.tokenSecret}
                          displayText={record.tokenSecret.length > 20 ? `${record.tokenSecret.slice(0, 20)}...` : record.tokenSecret}
                          title="Copy Token Secret"
                        />
                      </td>
                      <td
                        className={classNames(
                          index !== records.length - 1 ? 'border-b border-gray-200' : '',
                          'relative py-4 pr-4 pl-3 text-right text-sm font-medium whitespace-nowrap sm:pr-8 lg:pr-8',
                        )}
                      >
                        <a href={`/portal/clients/${record.id}`} className="text-indigo-600 hover:text-indigo-900">
                          Edit<span className="sr-only">, {record.applicationName}</span>
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </Page>
  )
})

function classNames(...classes: (string | boolean | undefined)[]): string {
  return classes.filter(Boolean).join(' ')
}

function formatRedirectUris(redirectUri: string): string[] {
  if (!redirectUri) {
    return [];
  }
  return JSON.parse(redirectUri);
}
