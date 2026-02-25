import {
  BlobReader, BlobWriter, ZipReader
} from "@zip-js/zip-js";

async function getLatestBuildNumber(): Promise<number> {
  const response = await fetch(
    "https://developers.eveonline.com/static-data/tranquility/latest.jsonl",
  );
  const text = await response.text();
  const line = text.split("\n")[0];
  const data = JSON.parse(line);
  return parseInt(data.buildNumber, 10);
}

async function getLocalBuildNumber(): Promise<number> {
  const text = await Deno.readTextFile("./BuildNumber");
  const buildNumber = parseInt(text.trim(), 10);
  if (isNaN(buildNumber)) {
    return 0;
  }
  return buildNumber;
}

async function download(url: string, dest: string) {
  console.log(`Downloading from ${url} to ${dest}...`);
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to fetch: ${response.status} ${response.statusText}`,
    );
  }

  // 获取文件总大小
  const contentLength = response.headers.get("content-length");
  const total = contentLength ? parseInt(contentLength, 10) : null;
  let received = 0;

  let lastPrintedPercent = -1;
  const progressStream = new TransformStream<Uint8Array, Uint8Array>({    
    transform(chunk, controller) {
      // 累计接收字节数
      received += chunk.length;
      if (total) {
        const currentPercent = Math.floor((received / total) * 100);
        if (currentPercent !== lastPrintedPercent) {
          lastPrintedPercent = currentPercent;
          Deno.stdout.writeSync(
            new TextEncoder().encode(
              `\rDownloaded ${currentPercent}% (${received}/${total} bytes)`,
            ),
          );
        }
      } else {
        Deno.stdout.writeSync(
          new TextEncoder().encode(`\rDownloaded ${received} bytes`),
        );
      }
      controller.enqueue(chunk);
    },
    flush() {
      console.log("\nDownload complete!");
    },
  });

  const file = await Deno.open(dest, { create: true, write: true, truncate: true });
  if (!response.body) {
    throw new Error("Response body is empty");
  }
  await response.body.pipeThrough(progressStream).pipeTo(file.writable);
}

async function unzip(file: string, dest: string) {
  console.log(`Unzipping ${file} to ${dest}...`);
  const zipData = await Deno.readFile(file);
  const zipReader = new ZipReader(new BlobReader(new Blob([zipData])));
  const entries = await zipReader.getEntries();
  for (const entry of entries) {
    if (entry.directory) {
      continue;
    }
    const entryData = await entry.getData(new BlobWriter());
    const arrayBuffer = await entryData.arrayBuffer();
    const outputPath = `${dest}/${entry.filename}`;
    await Deno.mkdir(outputPath.substring(0, outputPath.lastIndexOf("/")), { recursive: true });
    await Deno.writeFile(outputPath, new Uint8Array(arrayBuffer));
    console.log(`Extracted ${entry.filename}`);
  }
}

async function main() {
  const latest = await getLatestBuildNumber();
  console.log("Latest build number:", latest);
  const local = await getLocalBuildNumber();
  console.log("Local build number:", local);

  if (latest === local) {
    console.log("No update needed.");
    return;
  }
  const dataTmp = "./data_tmp";
  try {
    await download(
      `https://developers.eveonline.com/static-data/tranquility/eve-online-static-data-${latest}-yaml.zip`,
      dataTmp,
    );
    await unzip(dataTmp, "./yaml");
    await Deno.writeTextFile("./BuildNumber", latest.toString());
    console.log("Update complete.");
  } finally {
    await Deno.remove(dataTmp);
    console.log("removed temporary file:", dataTmp);
  }
}

main();