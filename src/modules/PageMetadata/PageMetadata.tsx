import Head from "next/head";
import React, { FC } from "react";
import { useRouter } from "next/router";

import {
  DEFAULT_SOCIAL_IMAGE,
  DEFAULT_SOCIAL_IMAGE_ALT,
  ORIGIN,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TITLE,
} from "../../config";
import { isAbsoluteUrl } from "../../utils/url";

interface PageMetadataProps {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  type?: "article" | "website";
  publishedTime?: Date;
}

const DEFAULT_METADATA = {
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  image: DEFAULT_SOCIAL_IMAGE,
  imageAlt: DEFAULT_SOCIAL_IMAGE_ALT,
  type: "website",
};

export const PageMetadata: FC<PageMetadataProps> = (props) => {
  const { asPath } = useRouter();
  const canonicalUrl = `${ORIGIN}${new URL(`${ORIGIN}${asPath}`).pathname}`;

  const { description, image, imageAlt, title, type } = {
    ...DEFAULT_METADATA,
    ...props,
  };

  const absoluteImageUrl = isAbsoluteUrl(image) ? image : `${ORIGIN}${image}`;

  return (
    <Head>
      <title>{props.title ? `${props.title} – ${SITE_NAME}` : title}</title>

      <meta name="description" content={description} />

      <link rel="canonical" href={canonicalUrl} />
      <meta httpEquiv="Content-Language" content="en" />

      <meta name="apple-mobile-web-app-title" content={SITE_NAME} />
      <meta name="application-name" content={SITE_NAME} />

      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:image" content={absoluteImageUrl} />
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />

      {type === "article" && (
        <meta property="article:author" content={SITE_NAME} />
      )}

      {props.publishedTime && (
        <meta
          property="article:published_time"
          content={props.publishedTime.toISOString()}
        />
      )}

      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:image" content={absoluteImageUrl} />
      <meta property="twitter:image:alt" content={imageAlt} />
    </Head>
  );
};
