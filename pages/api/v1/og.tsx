import { ImageResponse } from "next/server";
import React from "react";

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
          backgroundColor: "#eefbff",
          display: "flex",
          height: "100%",
          padding: "32px",
          width: "100%",
        }}
      >
        <div
          style={{
            alignItems: "center",
            background: "white",
            border: "1px solid rgb(243 244 246)", // border border-gray-100
            borderRadius: "6px", // rounded-md
            boxShadow:
              "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)", // shadow-md
            color: "black",
            display: "flex",
            flex: 1,
            fontSize: 40,
            justifyContent: "center",
            padding: "16px",
            whiteSpace: "pre-wrap",
          }}
        >
          {t}
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
