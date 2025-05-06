import nitroCloudflareBindings from "nitro-cloudflare-dev";

export default defineNitroConfig({
  srcDir: "server",
  preset: "cloudflare_pages",
  modules: [nitroCloudflareBindings],
});
