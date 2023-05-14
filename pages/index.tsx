import classNames from "classnames";
import { Inter } from "next/font/google";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SiFacebook, SiGithub, SiTwitter } from "react-icons/si";

const inter = Inter({ subsets: ["latin"] });

const origin =
  process.env.NODE_ENV === "production"
    ? "https://ogmoji.vercel.app"
    : "http://localhost:3000";

type LayoutProps = {
  children: React.ReactNode;
};

function Layout({ children }: LayoutProps) {
  return (
    <div
      className={classNames(
        inter.className,
        "flex flex-col items-center bg-[#eefbff] min-h-screen gap-4"
      )}
    >
      <Header />
      {children}
      <Footer />
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white flex w-full justify-center py-4 items-center shadow-md">
      <h1 className="text-center text-xl">OGmoji</h1>
    </header>
  );
}

function Footer() {
  return (
    <footer className="flex flex-col items-center gap-4 pb-8">
      <p>&copy; 2023 Koki Sato</p>
      <a
        href="https://github.com/koki-develop/ogmoji"
        target="_blank"
        rel="noopener noreferrer"
      >
        <SiGithub fontSize={32} />
      </a>
    </footer>
  );
}

type HomeProps = {
  defaultText: string;
};

export default function Home({ defaultText }: HomeProps) {
  const router = useRouter();

  const [text, setText] = useState(defaultText);
  const [trimmedText, setTrimmedText] = useState(defaultText.trim());

  const ogImageUrl = useMemo(() => {
    const url = new URL("/api/v1/og", origin);
    url.searchParams.set("t", trimmedText);
    return url;
  }, [trimmedText]);

  const imageSrc = useMemo(
    () => ogImageUrl.pathname + ogImageUrl.search,
    [ogImageUrl.pathname, ogImageUrl.search]
  );

  const encodedShareUrl = useMemo(() => {
    const url = new URL(origin);
    url.searchParams.set("t", trimmedText);
    return encodeURIComponent(url.href);
  }, [trimmedText]);

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
    <Layout>
      <main className="p-4 container gap-4 flex flex-col">
        <div>
          <textarea
            className="block w-full rounded shadow-md border border-gray-100 p-2 outline-none"
            rows={4}
            value={text}
            onChange={handleChangeText}
          />
        </div>

        {trimmedText !== "" && (
          <div className="flex flex-col gap-4">
            {/* SHARE */}
            <div className="flex gap-2">
              <a
                className="bg-[#1DA1F2] block rounded text-white flex items-center gap-2 py-2 px-4 shadow-md"
                href={`https://twitter.com/intent/tweet?url=${encodedShareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiTwitter fontSize={24} />
                Twitter
              </a>
              <a
                className="bg-[#1877F2] block rounded text-white flex items-center gap-2 py-2 px-4 shadow-md"
                href={`http://www.facebook.com/share.php?u=${encodedShareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <SiFacebook fontSize={24} />
                Facebook
              </a>
            </div>

            {/* PREVIEW */}
            <div>
              <Image
                src={imageSrc}
                width={1200}
                height={630}
                alt={trimmedText}
              />
            </div>
          </div>
        )}
      </main>
    </Layout>
  );
}

export function getServerSideProps({ query }: { query: { t?: string } }) {
  return {
    props: {
      defaultText: query.t ?? "",
    },
  };
}
