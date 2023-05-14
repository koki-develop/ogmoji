import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";
import classNames from "classnames";

const inter = Inter({ subsets: ["latin"] });

const origin =
  process.env.NODE_ENV === "production"
    ? "https://ogmoji.vercel.app"
    : "http://localhost:3000";

type HomeProps = {
  text: string;
};

export default function Home(props: HomeProps) {
  const router = useRouter();

  const [text, setText] = useState(props.text);
  const [trimmedText, setTrimmedText] = useState(text.trim());

  const ogImageUrl = useMemo(() => {
    const url = new URL("/api/v1/og", origin);
    url.searchParams.set("t", trimmedText);
    return url;
  }, [trimmedText]);

  const imageSrc = useMemo(() => {
    return ogImageUrl.pathname + ogImageUrl.search;
  }, [ogImageUrl]);

  const handleChangeText = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setText(e.target.value);
    },
    []
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setTrimmedText(text.trim());
    }, 250);
    return () => clearTimeout(timer);
  }, [text]);

  useEffect(() => {
    const query = trimmedText === "" ? undefined : { t: trimmedText };
    router.replace({ query }, undefined, { shallow: true });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trimmedText]);

  return (
    <main
      className={classNames(inter.className, "flex flex-col items-center p-4")}
    >
      <div className="container">
        <h1 className="mb-4 text-center text-xl">OGmoji</h1>

        <div>
          <textarea
            className="block w-full rounded-md border border-gray-300 p-2 outline-none"
            rows={4}
            value={text}
            onChange={handleChangeText}
          />
        </div>

        {trimmedText !== "" && (
          <div>
            <Image src={imageSrc} width={1200} height={630} alt={trimmedText} />
          </div>
        )}
      </div>
    </main>
  );
}

export function getServerSideProps({ query }: { query: { t?: string } }) {
  return {
    props: {
      text: query.t ?? "",
    },
  };
}
