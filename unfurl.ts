export function unfurlOptions(url: string) {
  if (/https:\/\/twitter.com\/[^\/]+\/status\/\d+/.exec(url)) {
    return [{ id: "tweet-unfurl", name: "Tweet content" }];
  } else {
    return [];
  }
}

function htmlToMarkdown(html: string) {
  return html
    .replace(/<br>/g, " ")
    .replace(/<p>/g, " ")
    .replace(/<\/?[^>]+(>|$)/g, "")
    .split("&mdash;")[0]
    .trim();
}

export async function unfurlTweet(url: string): Promise<string> {
  const oEmbedResult = await fetch(
    `https://publish.twitter.com/oembed?url=${url}`,
  );
  if (oEmbedResult.status !== 200) {
    console.error(await oEmbedResult.text());
    throw new Error("Failed to fetch oEmbed result");
  }
  const oEmbedJson = await oEmbedResult.json();
  return `[${oEmbedJson.author_name}](${url}):\n > ${
    htmlToMarkdown(
      oEmbedJson.html,
    )
  }`;
}
