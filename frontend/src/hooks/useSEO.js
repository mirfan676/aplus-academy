import { useEffect } from "react";

const defaultImage = "https://www.aplusacademy.pk/aplus-logo.png";
const defaultLocale = "en_PK";
const structuredDataSelector = "script[data-seo-structured='true']";

const setOrCreateMetaByName = (name, content) => {
  let tag = document.querySelector(`meta[name='${name}']`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = name;
    document.head.appendChild(tag);
  }
  tag.content = content;
};

const setOrCreateMetaByProperty = (property, content) => {
  let tag = document.querySelector(`meta[property='${property}']`);
  if (!tag) {
    tag = document.createElement("meta");
    tag.setAttribute("property", property);
    document.head.appendChild(tag);
  }
  tag.setAttribute("content", content);
};

const removeMetaByProperty = (property) => {
  document.querySelectorAll(`meta[property='${property}']`).forEach((tag) => tag.remove());
};

const useSEO = ({
  title,
  description,
  canonical,
  ogImage = defaultImage,
  ogImageAlt = "A Plus Academy",
  ogUrl,
  robots = "index, follow",
  type = "website",
  locale = defaultLocale,
  publishedTime,
  modifiedTime,
  section,
  tags = [],
  structuredData,
}) => {
  useEffect(() => {
    if (title) document.title = title;

    if (description) {
      setOrCreateMetaByName("description", description);
    }
    setOrCreateMetaByName("robots", robots);

    if (canonical) {
      let link = document.querySelector("link[rel='canonical']");
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    setOrCreateMetaByProperty("og:site_name", "A Plus Academy");
    setOrCreateMetaByProperty("og:locale", locale);
    setOrCreateMetaByProperty("og:type", type);
    if (ogUrl || canonical) setOrCreateMetaByProperty("og:url", ogUrl || canonical);
    if (title) setOrCreateMetaByProperty("og:title", title);
    if (description) setOrCreateMetaByProperty("og:description", description);
    if (ogImage) setOrCreateMetaByProperty("og:image", ogImage);
    if (ogImageAlt) setOrCreateMetaByProperty("og:image:alt", ogImageAlt);

    setOrCreateMetaByName("twitter:card", "summary_large_image");
    setOrCreateMetaByName("twitter:site", "@aplus_pk");
    setOrCreateMetaByName("twitter:title", title || "");
    setOrCreateMetaByName("twitter:description", description || "");
    setOrCreateMetaByName("twitter:image", ogImage || defaultImage);
    setOrCreateMetaByName("twitter:image:alt", ogImageAlt || "A Plus Academy");

    if (type === "article") {
      if (publishedTime) setOrCreateMetaByProperty("article:published_time", publishedTime);
      if (modifiedTime) setOrCreateMetaByProperty("article:modified_time", modifiedTime);
      if (section) setOrCreateMetaByProperty("article:section", section);
      if (Array.isArray(tags) && tags.length > 0) {
        const uniqueTags = [...new Set(tags.filter(Boolean))];
        document
          .querySelectorAll("meta[property='article:tag']")
          .forEach((tag) => tag.remove());
        uniqueTags.forEach((value) => {
          const tag = document.createElement("meta");
          tag.setAttribute("property", "article:tag");
          tag.setAttribute("content", value);
          document.head.appendChild(tag);
        });
      }
    } else {
      removeMetaByProperty("article:published_time");
      removeMetaByProperty("article:modified_time");
      removeMetaByProperty("article:section");
      removeMetaByProperty("article:tag");
    }

    document.querySelectorAll(structuredDataSelector).forEach((script) => script.remove());

    let mountedScript = null;
    if (structuredData) {
      mountedScript = document.createElement("script");
      mountedScript.type = "application/ld+json";
      mountedScript.dataset.seoStructured = "true";
      mountedScript.textContent = JSON.stringify(structuredData);
      document.head.appendChild(mountedScript);
    }

    return () => {
      if (mountedScript?.parentNode) {
        mountedScript.parentNode.removeChild(mountedScript);
      }
    };
  }, [
    title,
    description,
    canonical,
    ogImage,
    ogImageAlt,
    ogUrl,
    robots,
    type,
    locale,
    publishedTime,
    modifiedTime,
    section,
    tags,
    structuredData,
  ]);
};

export default useSEO;
