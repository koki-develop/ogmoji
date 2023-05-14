import React from "react";
import { ImageResponse } from "next/server";

export const config = {
  runtime: "edge",
};

export default async function GET(request: Request) {
  const url = new URL(request.url);

  const t = url.searchParams.get("t");
  if (!t) return new Response("Bad Request", { status: 400 });

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px 200px",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          whiteSpace: "pre-wrap",
        }}
      >
        {t}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
